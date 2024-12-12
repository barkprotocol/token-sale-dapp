import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(num);
}

export type SaleStage = 'Not Started' | 'Pre-Sale' | 'Public Sale' | 'Ended';

export type SaleInfo = {
  totalTokens: number;
  soldTokens: number;
  remainingTokens: number;
  priceSOL: number;
  priceUSDC: number;
  minPurchase: number;
  maxPurchase: number;
  startDate: Date;
  endDate: Date;
  currentStage: SaleStage;
  saleProgress: number;
}

import { TOKEN_SALE_CONFIG, getCurrentPrice, getTotalTokens, getRemainingTokens } from '@/config/token-sale'
import { fetchPrices, convertToUSD, Currency } from '@/lib/currency-utils'
import { Connection, PublicKey } from '@solana/web3.js';
import { transferTokens } from './utils/token-transfers';

export async function getSaleInfo(): Promise<SaleInfo> {
  try {
    const prices = await fetchPrices()
    const now = new Date()

    let currentStage: SaleStage = 'Not Started'
    if (now >= TOKEN_SALE_CONFIG.endDate) {
      currentStage = 'Ended'
    } else if (now >= TOKEN_SALE_CONFIG.publicSaleDate) {
      currentStage = 'Public Sale'
    } else if (now >= TOKEN_SALE_CONFIG.startDate) {
      currentStage = 'Pre-Sale'
    }

    const currentPrice = getCurrentPrice();
    const totalTokens = getTotalTokens();
    const remainingTokens = getRemainingTokens();
    const saleProgress = ((totalTokens - remainingTokens) / totalTokens) * 100;

    return {
      totalTokens,
      soldTokens: TOKEN_SALE_CONFIG.soldTokens,
      remainingTokens,
      priceSOL: currentPrice,
      priceUSDC: convertToUSD(currentPrice, 'SOL', prices),
      minPurchase: TOKEN_SALE_CONFIG.minPurchase,
      maxPurchase: TOKEN_SALE_CONFIG.maxPurchase,
      startDate: TOKEN_SALE_CONFIG.startDate,
      endDate: TOKEN_SALE_CONFIG.endDate,
      currentStage,
      saleProgress,
    }
  } catch (error) {
    console.error('Error fetching sale info:', error);
    throw new Error('Failed to fetch sale information. Please try again later.');
  }
}

export function updateSoldTokens(amount: number): void {
  if (amount <= 0) {
    throw new Error('Invalid amount: Must be greater than 0')
  }
  if (TOKEN_SALE_CONFIG.soldTokens + amount > getTotalTokens()) {
    throw new Error('Not enough tokens available for purchase')
  }
  TOKEN_SALE_CONFIG.soldTokens += amount
}

export function validatePurchase(amount: number): void {
  const { minPurchase, maxPurchase } = TOKEN_SALE_CONFIG
  const totalTokens = getTotalTokens();
  const soldTokens = TOKEN_SALE_CONFIG.soldTokens;
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

export async function calculatePurchaseCost(amount: number, currency: Currency): Promise<number> {
  try {
    const prices = await fetchPrices()
    const currentPrice = getCurrentPrice();
    const costInSOL = amount * currentPrice
    if (currency === 'SOL') {
      return costInSOL
    } else if (currency === 'USDC') {
      return convertToUSD(costInSOL, 'SOL', prices)
    } else {
      throw new Error(`Unsupported currency: ${currency}`)
    }
  } catch (error) {
    console.error('Error calculating purchase cost:', error);
    throw new Error('Failed to calculate purchase cost. Please try again later.');
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
  try {
    validatePurchase(amount);
    if (!isSaleActive()) {
      throw new Error('Token sale is not currently active');
    }
    const cost = await calculatePurchaseCost(amount, currency);
    const receivingWallet = new PublicKey(TOKEN_SALE_CONFIG.receivingWallet);

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
    if (error instanceof Error) {
      throw new Error(`Failed to process purchase: ${error.message}`);
    } else {
      throw new Error('Failed to process purchase. Please try again.');
    }
  }
}

export function getCurrentSaleStage(): SaleStage {
  const now = new Date()
  if (now >= TOKEN_SALE_CONFIG.endDate) {
    return 'Ended'
  } else if (now >= TOKEN_SALE_CONFIG.publicSaleDate) {
    return 'Public Sale'
  } else if (now >= TOKEN_SALE_CONFIG.startDate) {
    return 'Pre-Sale'
  }
  return 'Not Started'
}

export function getTokenSaleProgress(): number {
  const totalTokens = getTotalTokens();
  const soldTokens = TOKEN_SALE_CONFIG.soldTokens;
  return (soldTokens / totalTokens) * 100;
}

export function getRemainingTimeForCurrentStage(): number {
  const now = new Date();
  const currentStage = getCurrentSaleStage();

  switch (currentStage) {
    case 'Pre-Sale':
      return TOKEN_SALE_CONFIG.publicSaleDate.getTime() - now.getTime();
    case 'Public Sale':
      return TOKEN_SALE_CONFIG.endDate.getTime() - now.getTime();
    default:
      return 0;
  }
}

export async function isWalletWhitelisted(publicKey: PublicKey): Promise<boolean> {
  // Implement whitelist checking logic here
  // For now, we'll return true for all wallets
  return true;
}