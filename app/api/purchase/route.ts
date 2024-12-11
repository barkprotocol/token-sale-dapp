import { NextResponse } from 'next/server'
import { TOKEN_SALE_CONFIG, getCurrentPrice } from '@/config/token-sale'
import { validatePurchase, updateSoldTokens, isSaleActive } from '@/lib/server-utils'
import { fetchPrices, convertToUSD, Currency } from '@/lib/currency-utils'

export async function POST(request: Request) {
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

    // Fetch current prices
    const prices = await fetchPrices();

    if (!prices) {
      return NextResponse.json({ error: 'Failed to fetch current prices' }, { status: 500 });
    }

    // Get the current price
    const currentPrice = getCurrentPrice();

    // Calculate the cost in USD
    const costInUSD = amount * currentPrice;

    // Calculate the cost in the chosen currency (SOL or USDC)
    const costInChosenCurrency = currency === 'SOL' 
      ? convertToUSD(costInUSD, 'USDC', prices)
      : costInUSD;

    // Simulate blockchain transaction with a 90% success rate
    const transactionSuccess = Math.random() > 0.1;

    if (transactionSuccess) {
      // Update the number of sold tokens
      updateSoldTokens(amount);

      // Simulate transaction hash
      const transactionHash = `sim_${Math.random().toString(36).substr(2, 9)}`;

      return NextResponse.json({
        success: true,
        message: `Successfully purchased ${amount} BARK tokens`,
        transactionDetails: {
          amount,
          currency,
          costInChosenCurrency: costInChosenCurrency.toFixed(6),
          costInUSD: costInUSD.toFixed(2),
          transactionHash,
          buyerAddress: walletAddress,
        },
      });
    } else {
      // Simulate specific transaction failure reasons
      const failureReasons = [
        'Insufficient funds',
        'Network congestion',
        'Slippage tolerance exceeded',
      ];
      const randomReason = failureReasons[Math.floor(Math.random() * failureReasons.length)];

      return NextResponse.json({ 
        error: `Transaction failed: ${randomReason}. Please try again.` 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Purchase error:', error);

    // Provide meaningful error messages
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    }, { status: 400 });
  }
}

