export const TOKEN_SALE_CONFIG = {
  startDate: new Date('2025-01-01T00:00:00Z'),
  endDate: new Date('2025-01-31T23:59:59Z'),
  totalTokens: 3_000_000_000, // 3 billion BARK tokens
  soldTokens: 0, // Start with 0 sold tokens
  price: 0.000001, // 0.000001 SOL per BARK token (1 SOL = 22,000,000 BARK)
  minPurchase: 10000, // Minimum purchase of 10000 BARK tokens
  maxPurchase: 1_000_000_000, // Maximum purchase of 1 billion BARK tokens
};
