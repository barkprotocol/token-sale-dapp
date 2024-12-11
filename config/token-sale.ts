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

export function getSaleStage(): 'Not Started' | 'Pre-Sale' | 'Public Sale' | 'Ended' {
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

