import { TOKEN_SALE_CONFIG } from '@/config/token-sale';
import { fetchPrices, convertToUSD, Currency } from '@/lib/currency-utils';
import { Connection, PublicKey } from '@solana/web3.js';

export type SaleInfo = {
  totalTokens: number;
  soldTokens: number;
  remainingTokens: number;
  currentPrice: number;
  startDate: Date;
  endDate: Date;
  currentStage: 'Not Started' | 'Pre-Sale' | 'Public Sale' | 'Ended';
  saleProgress: number;
};

export async function getSaleInfo(): Promise<SaleInfo> {
  const prices = await fetchPrices();
  const now = new Date();
  let currentStage: SaleInfo['currentStage'] = 'Not Started';
  
  if (now >= TOKEN_SALE_CONFIG.endDate) {
    currentStage = 'Ended';
  } else if (now >= TOKEN_SALE_CONFIG.publicSaleDate) {
    currentStage = 'Public Sale';
  } else if (now >= TOKEN_SALE_CONFIG.startDate) {
    currentStage = 'Pre-Sale';
  }

  const currentPrice = currentStage === 'Pre-Sale' ? TOKEN_SALE_CONFIG.preSalePrice : TOKEN_SALE_CONFIG.publicSalePrice;
  const totalTokens = TOKEN_SALE_CONFIG.totalSaleAllocation;
  const soldTokens = TOKEN_SALE_CONFIG.soldTokens;
  const remainingTokens = totalTokens - soldTokens;
  const saleProgress = (soldTokens / totalTokens) * 100;

  return {
    totalTokens,
    soldTokens,
    remainingTokens,
    currentPrice,
    startDate: TOKEN_SALE_CONFIG.startDate,
    endDate: TOKEN_SALE_CONFIG.endDate,
    currentStage,
    saleProgress,
  };
}

export function isSaleActive(): boolean {
  const now = new Date();
  return now >= TOKEN_SALE_CONFIG.startDate && now <= TOKEN_SALE_CONFIG.endDate;
}

export function validatePurchase(amount: number): void {
  const { minPurchase, maxPurchase } = TOKEN_SALE_CONFIG;
  if (amount < minPurchase) {
    throw new Error(`Minimum purchase is ${minPurchase} BARK tokens`);
  }
  if (amount > maxPurchase) {
    throw new Error(`Maximum purchase is ${maxPurchase} BARK tokens`);
  }
  if (amount > TOKEN_SALE_CONFIG.remainingTokens) {
    throw new Error('Not enough tokens available for purchase');
  }
}

export async function isWalletWhitelisted(publicKey: PublicKey): Promise<boolean> {
  // Implement whitelist checking logic here
  // For now, we'll return true for all wallets
  return true;
}

export function updateSoldTokens(amount: number): void {
  if (amount <= 0) {
    throw new Error('Invalid amount: Must be greater than 0');
  }
  if (TOKEN_SALE_CONFIG.soldTokens + amount > TOKEN_SALE_CONFIG.totalSaleAllocation) {
    throw new Error('Not enough tokens available for purchase');
  }
  TOKEN_SALE_CONFIG.soldTokens += amount;
}

