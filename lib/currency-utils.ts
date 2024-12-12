import { TOKEN_SALE_CONFIG, getCurrentPrice } from '@/config/token-sale'

// API endpoints
const COINGECKO_API_ENDPOINT = 'https://api.coingecko.com/api/v3/simple/price?ids=solana,usd-coin&vs_currencies=usd&include_24hr_change=true'
const COINMARKETCAP_API_ENDPOINT = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest'

export type Currency = 'SOL' | 'USDC'

export type PriceData = {
  solana: { usd: number; usd_24h_change?: number } | null
  'usd-coin': { usd: number; usd_24h_change?: number } | null
  coinmarketcap: { usd: number; usd_24h_change?: number } | null
}

async function fetchCoingeckoPrices(): Promise<Partial<PriceData>> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    const response = await fetch(COINGECKO_API_ENDPOINT, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    // Validate the response data structure
    if (!data.solana?.usd || !data['usd-coin']?.usd) {
      throw new Error('Invalid price data received from Coingecko')
    }

    return {
      solana: data.solana,
      'usd-coin': data['usd-coin']
    }
  } catch (error) {
    console.error(`Error fetching Coingecko price data: ${error instanceof Error ? error.message : 'Unknown error'}`)
    return {}
  }
}

async function fetchCoinmarketcapPrices(): Promise<Partial<PriceData>> {
  try {
    const response = await fetch(COINMARKETCAP_API_ENDPOINT, {
      headers: {
        'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY || '',
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    // Assuming SOL and USDC IDs are 5426 and 3408 respectively
    const solPrice = data.data['5426']
    const usdcPrice = data.data['3408']

    if (!solPrice || !usdcPrice) {
      throw new Error('Invalid price data received from Coinmarketcap')
    }

    return {
      coinmarketcap: {
        usd: solPrice.quote.USD.price,
        usd_24h_change: solPrice.quote.USD.percent_change_24h
      }
    }
  } catch (error) {
    console.error(`Error fetching Coinmarketcap price data: ${error instanceof Error ? error.message : 'Unknown error'}`)
    return {}
  }
}

export async function fetchPrices(): Promise<PriceData> {
  const [coingeckoPrices, coinmarketcapPrices] = await Promise.all([
    fetchCoingeckoPrices(),
    fetchCoinmarketcapPrices(),
  ]);

  return {
    ...coingeckoPrices,
    ...coinmarketcapPrices,
  } as PriceData;
}

export function convertToUSD(amount: number, currency: Currency, prices: PriceData): number {
  if (currency === 'SOL' && prices.solana?.usd) {
    return amount * prices.solana.usd
  } else if (currency === 'USDC' && prices['usd-coin']?.usd) {
    return amount * prices['usd-coin'].usd
  }
  return 0
}

export function convertFromUSD(usdAmount: number, currency: Currency, prices: PriceData): number {
  if (currency === 'SOL' && prices.solana?.usd) {
    return usdAmount / prices.solana.usd
  } else if (currency === 'USDC' && prices['usd-coin']?.usd) {
    return usdAmount / prices['usd-coin'].usd
  }
  return 0
}

export function getBARKPrice(currency: Currency, prices: PriceData): number {
  const barkPriceInSOL = getCurrentPrice()
  
  if (currency === 'SOL') {
    return barkPriceInSOL
  } else if (currency === 'USDC') {
    const solPrices = [prices.solana?.usd, prices.coinmarketcap?.usd].filter(Boolean) as number[]
    const avgSolPrice = solPrices.reduce((sum, price) => sum + price, 0) / solPrices.length
    return barkPriceInSOL * avgSolPrice
  }
  return 0
}

export function formatCurrency(amount: number, currency: Currency): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency === 'USDC' ? 'USD' : 'SOL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(amount)
}

export function calculateTotalCost(barkAmount: number, currency: Currency, prices: PriceData): number {
  const barkPriceInCurrency = getBARKPrice(currency, prices)
  return barkAmount * barkPriceInCurrency
}

export function getPriceChange24h(currency: Currency, prices: PriceData): number | null {
  if (currency === 'SOL') {
    return prices.solana?.usd_24h_change || null
  } else if (currency === 'USDC') {
    return prices['usd-coin']?.usd_24h_change || null
  }
  return null
}

export function getAveragePriceUSD(prices: PriceData): number {
  const validPrices = [
    prices.solana?.usd,
    prices.coinmarketcap?.usd
  ].filter(Boolean) as number[]

  if (validPrices.length === 0) return 0

  return validPrices.reduce((sum, price) => sum + price, 0) / validPrices.length
}

