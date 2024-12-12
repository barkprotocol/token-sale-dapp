import { NextRequest, NextResponse } from 'next/server'
import { Connection, PublicKey } from '@solana/web3.js'
import { 
  validatePurchase, 
  calculatePurchaseCost, 
  processPurchase, 
  isSaleActive,
  getCurrentSaleStage,
  isWalletWhitelisted
} from '@/lib/utils/token-sale'
import { Currency } from '@/lib/currency-utils'
import rateLimit from '@/lib/utils/rate-limit'

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500, // Max 500 users per minute
})

export async function POST(request: NextRequest) {
  try {
    await limiter.check(10, 'CACHE_TOKEN') // 10 requests per minute
  } catch {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
  }

  try {
    const { amount, currency, walletAddress } = await request.json();

    if (!amount || !currency || !walletAddress) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (typeof amount !== 'number' || !['SOL', 'USDC'].includes(currency)) {
      return NextResponse.json({ error: 'Invalid amount or currency' }, { status: 400 });
    }

    // Validate the purchase amount
    validatePurchase(amount);

    // Check if the sale is active
    if (!isSaleActive()) {
      return NextResponse.json({ error: 'Token sale is not active' }, { status: 400 });
    }

    // Check if the wallet is whitelisted (for pre-sale stage)
    const currentStage = getCurrentSaleStage();
    if (currentStage === 'Pre-Sale') {
      const buyerPublicKey = new PublicKey(walletAddress);
      const isWhitelisted = await isWalletWhitelisted(buyerPublicKey);
      if (!isWhitelisted) {
        return NextResponse.json({ error: 'Wallet is not whitelisted for pre-sale' }, { status: 403 });
      }
    }

    // Calculate the cost
    const cost = await calculatePurchaseCost(amount, currency as Currency);

    const connection = new Connection(process.env.SOLANA_RPC_NETWORK_URL!);
    const buyerPublicKey = new PublicKey(walletAddress);

    // Process the purchase
    const signature = await processPurchase(amount, currency as Currency, connection, buyerPublicKey);

    return NextResponse.json({
      success: true,
      message: `Successfully purchased ${amount} BARK tokens`,
      transactionDetails: {
        amount,
        currency,
        cost: cost.toFixed(6),
        transactionSignature: signature,
        buyerAddress: walletAddress,
      },
    });
  } catch (error) {
    console.error('Purchase error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    }, { status: 400 });
  }
}

