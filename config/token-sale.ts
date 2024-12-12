export type SaleStage = 'Not Started' | 'Pre-Sale' | 'Public Sale' | 'Ended';

export const TOKEN_SALE_CONFIG = {
  startDate: new Date('2025-01-01T00:00:00Z'),
  publicSaleDate: new Date('2025-01-08T00:00:00Z'),
  endDate: new Date('2025-01-31T23:59:59Z'),
  totalSupply: 18_446_744_073,
  totalSaleAllocation: 7_500_000_000,
  preSaleAllocation: 3_500_000_000,
  publicSaleAllocation: 4_000_000_000,
  soldTokens: 0,
  preSalePrice: 0.000035,
  publicSalePrice: 0.000037,
  price: 0.000035, // Default price in SOL
  softCap: 90000,
  hardCap: 122500,
  minPurchase: 10000,
  maxPurchase: 1_000_000_000,
  barkTokenMint: process.env.NEXT_PUBLIC_BARK_TOKEN_MINT || '',
  barkTokenDecimals: 9,
  receivingWallet: process.env.NEXT_PUBLIC_SALE_WALLET_ADDRESS || '',
}

export function getCurrentPrice(): number {
  const now = new Date();
  if (now < TOKEN_SALE_CONFIG.publicSaleDate) {
    return TOKEN_SALE_CONFIG.preSalePrice;
  }
  return TOKEN_SALE_CONFIG.publicSalePrice;
}

export function getTotalTokens(): number {
  return TOKEN_SALE_CONFIG.totalSaleAllocation;
}

export function getRemainingTokens(): number {
  return TOKEN_SALE_CONFIG.totalSaleAllocation - TOKEN_SALE_CONFIG.soldTokens;
}

export function getSaleStage(): SaleStage {
  const now = new Date();
  if (now < TOKEN_SALE_CONFIG.startDate) {
    return 'Not Started';
  } else if (now < TOKEN_SALE_CONFIG.publicSaleDate) {
    return 'Pre-Sale';
  } else if (now <= TOKEN_SALE_CONFIG.endDate) {
    return 'Public Sale';
  } else {
    return 'Ended';
  }
}

export function getSaleProgress(): number {
  const soldTokens = TOKEN_SALE_CONFIG.soldTokens;
  const totalTokens = getTotalTokens();
  return (soldTokens / totalTokens) * 100;
}

export function formatTokenAmount(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: TOKEN_SALE_CONFIG.barkTokenDecimals
  }).format(amount);
}

export function isValidPurchaseAmount(amount: number): boolean {
  return amount >= TOKEN_SALE_CONFIG.minPurchase && amount <= TOKEN_SALE_CONFIG.maxPurchase;
}

export function getTimeUntilNextStage(): number {
  const now = new Date();
  const currentStage = getSaleStage();
  
  switch (currentStage) {
    case 'Not Started':
      return TOKEN_SALE_CONFIG.startDate.getTime() - now.getTime();
    case 'Pre-Sale':
      return TOKEN_SALE_CONFIG.publicSaleDate.getTime() - now.getTime();
    case 'Public Sale':
      return TOKEN_SALE_CONFIG.endDate.getTime() - now.getTime();
    default:
      return 0;
  }
}

export function formatTimeRemaining(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  return `${days}d ${hours % 24}h ${minutes % 60}m ${seconds % 60}s`;
}

export function updateSoldTokens(amount: number): void {
  if (amount <= 0) {
    throw new Error('Invalid amount: Must be greater than 0');
  }
  if (TOKEN_SALE_CONFIG.soldTokens + amount > getTotalTokens()) {
    throw new Error('Not enough tokens available for purchase');
  }
  TOKEN_SALE_CONFIG.soldTokens += amount;
}

