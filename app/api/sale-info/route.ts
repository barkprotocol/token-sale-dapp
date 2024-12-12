import { NextRequest, NextResponse } from 'next/server';
import { fetchPrices, Currency } from '@/lib/currency-utils';
import { getSaleInfo, getCurrentSaleStage, getTokenSaleProgress } from '@/lib/utils/token-sale';
import rateLimit from '@/lib/utils/rate-limit';

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500, // Max 500 users per minute
});

export async function GET(request: NextRequest) {
  try {
    await limiter.check(20, 'SALE_INFO_CACHE_TOKEN'); // 20 requests per minute
  } catch {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  try {
    // Fetch current prices from the price service
    const prices = await fetchPrices();

    if (!prices) {
      throw new Error('Failed to fetch current prices');
    }

    // Get the sale info using the token sale utility function
    const saleInfo = await getSaleInfo();

    // Get additional sale information
    const currentStage = getCurrentSaleStage();
    const saleProgress = getTokenSaleProgress();

    // Calculate USDC price
    const priceUSDC = saleInfo.priceSOL * (prices.solana?.usd || 0);

    // Combine all information
    const response = {
      ...saleInfo,
      priceUSDC,
      currentStage,
      saleProgress,
      lastUpdated: new Date().toISOString(),
    };

    // Set cache headers
    const headers = new Headers();
    headers.set('Cache-Control', 's-maxage=60, stale-while-revalidate');

    // Return sale information as JSON response
    return NextResponse.json(response, { headers });

  } catch (error: unknown) {
    console.error('Error fetching sale information:', error);
    
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    return NextResponse.json({ error: `Failed to fetch sale information: ${errorMessage}` }, { status: 500 });
  }
}

