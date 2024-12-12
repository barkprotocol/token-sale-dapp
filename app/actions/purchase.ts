'use server'

import { revalidatePath } from 'next/cache'
import { TOKEN_SALE_CONFIG } from '@/config/token-sale'
import { validatePurchase, updateSoldTokens, getSaleInfo } from '@/lib/server-utils'
import { fetchPrices, convertToUSD, Currency } from '@/lib/currency-utils'
import { transferTokens } from '@/lib/utils/token-transfers'
import { Connection, PublicKey } from '@solana/web3.js'

export async function purchaseTokens(amount: number, currency: Currency, walletAddress: string) {
  try {
    // Validate the purchase amount
    validatePurchase(amount);

    // Check if the sale is active
    const saleInfo = await getSaleInfo();
    if (saleInfo.currentStage === 'Not Started' || saleInfo.currentStage === 'Ended') {
      throw new Error('Token sale is not active');
    }

    // Fetch current prices
    const prices = await fetchPrices();

    // Calculate the cost in USD and the chosen currency
    const costInSOL = amount * TOKEN_SALE_CONFIG.price;
    const costInUSD = convertToUSD(costInSOL, 'SOL', prices);
    const costInChosenCurrency = currency === 'SOL' ? costInSOL : convertToUSD(costInUSD, 'USDC', prices);

    // Set up the connection to the Solana network
    const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_ENDPOINT!, 'confirmed');
    const buyerPublicKey = new PublicKey(walletAddress);
    const receivingWallet = new PublicKey(TOKEN_SALE_CONFIG.receivingWallet);

    // Perform the token transfer
    const txid = await transferTokens(
      connection,
      buyerPublicKey,
      receivingWallet,
      Math.round(costInChosenCurrency * (currency === 'SOL' ? 1e9 : 1e6)), // Convert to lamports or USDC base units
      currency
    );

    // Update the number of sold tokens
    updateSoldTokens(amount);

    // Revalidate the token sale page to reflect the updated numbers
    revalidatePath('/token-sale');

    return {
      success: true,
      message: `Successfully purchased ${amount} BARK tokens`,
      transactionDetails: {
        amount,
        currency,
        costInChosenCurrency: costInChosenCurrency.toFixed(6),
        costInUSD: costInUSD.toFixed(2),
        transactionId: txid,
        buyerAddress: walletAddress,
      },
    };
  } catch (error) {
    console.error('Purchase error:', error);
    return { 
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}