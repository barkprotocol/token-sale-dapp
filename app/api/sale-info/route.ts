import { NextResponse } from 'next/server';
import { fetchPrices } from '@/lib/currency-utils';
import { getSaleInfo } from '@/lib/server-utils';

export async function GET() {
  try {
    // Fetch current prices from the price service
    const prices = await fetchPrices();

    // Get the sale info using the server utility function
    const saleInfo = await getSaleInfo();

    // Combine the sale info with the current prices
    const response = {
      ...saleInfo,
      priceUSDC: saleInfo.priceSOL * (prices?.solana?.usd || 0), // Calculate USDC price
    };

    // Return sale information as JSON response
    return NextResponse.json(response);

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