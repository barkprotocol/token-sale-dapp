import { TOKEN_SALE_CONFIG } from '@/config/token-sale'
import { fetchPrices, convertToUSD, Currency } from '@/lib/currency-utils'
import { Connection, PublicKey } from '@solana/web3.js';
import { transferTokens } from './token-transfers';

export async function getSaleInfo() {
  const prices = await fetchPrices()
  const now = new Date()

  let currentStage: 'Not Started' | 'Pre-Sale' | 'Public Sale' | 'Ended' = 'Not Started'
  if (now >= TOKEN_SALE_CONFIG.endDate) {
    currentStage = 'Ended'
  } else if (now >= new Date(TOKEN_SALE_CONFIG.startDate.getTime() + 7 * 24 * 60 * 60 * 1000)) {
    currentStage = 'Public Sale'
  } else if (now >= TOKEN_SALE_CONFIG.startDate) {
    currentStage = 'Pre-Sale'
  }

  return {
    totalTokens: TOKEN_SALE_CONFIG.totalTokens,
    soldTokens: TOKEN_SALE_CONFIG.soldTokens,
    remainingTokens: TOKEN_SALE_CONFIG.totalTokens - TOKEN_SALE_CONFIG.soldTokens,
    priceSOL: TOKEN_SALE_CONFIG.price,
    priceUSDC: convertToUSD(TOKEN_SALE_CONFIG.price, 'SOL' as Currency, prices),
    minPurchase: TOKEN_SALE_CONFIG.minPurchase,
    maxPurchase: TOKEN_SALE_CONFIG.maxPurchase,
    startDate: TOKEN_SALE_CONFIG.startDate,
    endDate: TOKEN_SALE_CONFIG.endDate,
    currentStage,
    saleProgress: (TOKEN_SALE_CONFIG.soldTokens / TOKEN_SALE_CONFIG.totalTokens) * 100
  }
}

export function updateSoldTokens(amount: number) {
  if (amount <= 0) {
    throw new Error('Invalid amount: Must be greater than 0')
  }
  if (TOKEN_SALE_CONFIG.soldTokens + amount > TOKEN_SALE_CONFIG.totalTokens) {
    throw new Error('Not enough tokens available for purchase')
  }
  TOKEN_SALE_CONFIG.soldTokens += amount
}

export function validatePurchase(amount: number) {
  const { minPurchase, maxPurchase, totalTokens, soldTokens } = TOKEN_SALE_CONFIG
  if (amount < minPurchase) {
    throw new Error(`Minimum purchase is ${minPurchase} BARK tokens`)
  }
  if (amount > maxPurchase) {
    throw new Error(`Maximum purchase is ${maxPurchase} BARK tokens`)
  }
  if (amount > totalTokens - soldTokens) {
    throw new Error('Not enough tokens available for purchase')
  }
}

export async function calculatePurchaseCost(amount: number, currency: Currency) {
  const prices = await fetchPrices()
  const costInSOL = amount * TOKEN_SALE_CONFIG.price
  if (currency === 'SOL') {
    return costInSOL
  } else if (currency === 'USDC') {
    return convertToUSD(costInSOL, 'SOL' as Currency, prices)
  } else {
    throw new Error(`Unsupported currency: ${currency}`)
  }
}

export function isSaleActive(): boolean {
  const now = new Date()
  return now >= TOKEN_SALE_CONFIG.startDate && now <= TOKEN_SALE_CONFIG.endDate
}

export async function processPurchase(
  amount: number, 
  currency: Currency, 
  connection: Connection,
  buyerPublicKey: PublicKey
): Promise<string> {
  validatePurchase(amount);
  if (!isSaleActive()) {
    throw new Error('Token sale is not currently active');
  }
  const cost = await calculatePurchaseCost(amount, currency);
  const receivingWallet = new PublicKey(TOKEN_SALE_CONFIG.receivingWallet);

  try {
    const txid = await transferTokens(
      connection,
      buyerPublicKey,
      receivingWallet,
      Math.round(cost * (currency === 'SOL' ? 1e9 : 1e6)), // Convert to lamports or USDC base units
      currency
    );

    // Update sold tokens count
    updateSoldTokens(amount);

    console.log(`Processed purchase of ${amount} BARK tokens for ${cost} ${currency}. Transaction ID: ${txid}`);
    return txid;
  } catch (error) {
    console.error('Error processing purchase:', error);
    throw new Error('Failed to process purchase. Please try again.');
  }
}

