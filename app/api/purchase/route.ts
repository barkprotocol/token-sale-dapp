import { NextResponse } from 'next/server';
import { TOKEN_SALE_CONFIG } from '@/config/token-sale';
import { validatePurchase, updateSoldTokens } from '@/lib/server-utils';
import { fetchPrices, convertToUSD, Currency } from '@/lib/currency-utils';

export async function POST(request: Request) {
  try {
    const { amount, currency } = await request.json();

    // Validate the purchase amount
    validatePurchase(amount);

    // Check if the sale is active based on current date
    const now = new Date();
    if (now < TOKEN_SALE_CONFIG.startDate || now > TOKEN_SALE_CONFIG.endDate) {
      return NextResponse.json({ error: 'Token sale is not active' }, { status: 400 });
    }

    // Fetch current prices
    const prices = await fetchPrices();

    // Calculate the cost in USD
    const costInUSD = convertToUSD(amount * TOKEN_SALE_CONFIG.price, 'SOL' as Currency, prices);

    // Simulate blockchain transaction with a 90% success rate
    const transactionSuccess = Math.random() > 0.1;

    if (transactionSuccess) {
      // Update the number of sold tokens
      updateSoldTokens(amount);

      // Calculate the cost in the chosen currency (SOL or USDC)
      const costInChosenCurrency = currency === 'SOL' 
        ? amount * TOKEN_SALE_CONFIG.price
        : convertToUSD(costInUSD, 'USDC' as Currency, prices);

      return NextResponse.json({
        success: true,
        message: `Successfully purchased ${amount} BARK tokens`,
        transactionDetails: {
          amount,
          currency,
          costInChosenCurrency: costInChosenCurrency.toFixed(6),
          costInUSD: costInUSD.toFixed(2),
        },
      });
    } else {
      // Simulate transaction failure
      return NextResponse.json({ 
        error: 'Transaction failed. Please try again.' 
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
