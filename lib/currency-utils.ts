import { TOKEN_SALE_CONFIG } from '@/config/token-sale'

const API_ENDPOINT = 'https://api.coingecko.com/api/v3/simple/price?ids=solana,usd-coin&vs_currencies=usd'

export type Currency = 'SOL' | 'USDC'

export type PriceData = {
  solana: { usd: number }
  'usd-coin': { usd: number }
}

export async function fetchPrices(): Promise<PriceData> {
  try {
    const response = await fetch(API_ENDPOINT)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data as PriceData
  } catch (error) {
    console.error('Error fetching price data:', error)
    throw new Error('Failed to fetch price data. Please try again later.')
  }
}

export function convertToUSD(amount: number, currency: Currency, prices: PriceData): number {
  if (currency === 'SOL') {
    return amount * prices.solana.usd
  } else if (currency === 'USDC') {
    return amount * prices['usd-coin'].usd
  } else {
    throw new Error(`Unsupported currency: ${currency}`)
  }
}

export function convertFromUSD(usdAmount: number, currency: Currency, prices: PriceData): number {
  if (currency === 'SOL') {
    return usdAmount / prices.solana.usd
  } else if (currency === 'USDC') {
    return usdAmount / prices['usd-coin'].usd
  } else {
    throw new Error(`Unsupported currency: ${currency}`)
  }
}

export function getBARKPrice(currency: Currency, prices: PriceData): number {
  const barkPriceInSOL = TOKEN_SALE_CONFIG.price;
  if (currency === 'SOL') {
    return barkPriceInSOL;
  } else if (currency === 'USDC') {
    return convertFromUSD(barkPriceInSOL * prices.solana.usd, 'USDC', prices);
  } else {
    throw new Error(`Unsupported currency: ${currency}`);
  }
}

export function formatCurrency(amount: number, currency: Currency): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency === 'USDC' ? 'USD' : 'SOL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  })
  return formatter.format(amount)
}

export function calculateTotalCost(barkAmount: number, currency: Currency, prices: PriceData): number {
  const barkPriceInCurrency = getBARKPrice(currency, prices)
  return barkAmount * barkPriceInCurrency
}
