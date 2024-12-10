import { NextResponse } from 'next/server';
import { TOKEN_SALE_CONFIG } from '@/config/token-sale';
import { fetchPrices } from '@/lib/currency-utils';

export async function GET() {
  try {
    // Fetch current prices from the price service
    const prices = await fetchPrices();

    // Get the current date and times for different sale stages
    const now = new Date();
    const preSaleStart = TOKEN_SALE_CONFIG.startDate;
    const publicSaleStart = new Date(preSaleStart.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days after pre-sale
    const saleEnd = TOKEN_SALE_CONFIG.endDate;

    // Determine the current sale stage based on the current date
    let currentStage: string = 'Not Started';
    if (now >= saleEnd) {
      currentStage = 'Ended';
    } else if (now >= publicSaleStart) {
      currentStage = 'Public Sale';
    } else if (now >= preSaleStart) {
      currentStage = 'Pre-Sale';
    }

    // Sale information object
    const saleInfo = {
      totalTokens: TOKEN_SALE_CONFIG.totalTokens,
      soldTokens: TOKEN_SALE_CONFIG.soldTokens,
      remainingTokens: TOKEN_SALE_CONFIG.totalTokens - TOKEN_SALE_CONFIG.soldTokens,
      priceSOL: TOKEN_SALE_CONFIG.price,
      priceUSDC: TOKEN_SALE_CONFIG.price * prices.solana.usd, // Calculating price in USD
      minPurchase: TOKEN_SALE_CONFIG.minPurchase,
      maxPurchase: TOKEN_SALE_CONFIG.maxPurchase,
      startDate: preSaleStart.toISOString(),
      endDate: saleEnd.toISOString(),
      currentStage,
      saleProgress: ((TOKEN_SALE_CONFIG.soldTokens / TOKEN_SALE_CONFIG.totalTokens) * 100).toFixed(2),
    };

    // Return sale information as JSON response
    return NextResponse.json(saleInfo);

  } catch (error) {
    console.error('Error fetching sale information:', error);
    return NextResponse.json({ error: `Failed to fetch sale information: ${error.message || error}` }, { status: 500 });
  }
}
