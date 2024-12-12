export type SaleStage = 'Not Started' | 'Pre-Sale' | 'Public Sale' | 'Ended'

export type SaleInfo = {
  totalTokens: number
  soldTokens: number
  remainingTokens: number
  currentPrice: number
  startDate: Date
  endDate: Date
  currentStage: SaleStage
  saleProgress: number
  softCap: number
  hardCap: number
}

