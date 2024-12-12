'use client'

import { useMemo } from 'react'
import { Progress } from '@/components/ui/progress'
import { formatNumber } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from 'lucide-react'
import { InfoCard } from './info-card'
import { useToast } from "@/hooks/use-toast"
import { TOKEN_SALE_CONFIG } from '@/config/token-sale'

type SaleStage = 'Not Started' | 'Pre-Sale' | 'Public Sale' | 'Ended'

type SaleInfo = {
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

export function TokenSaleProgress() {
  const { toast } = useToast()

  const saleInfo = useMemo(() => {
    const now = new Date()
    let currentStage: SaleStage = 'Not Started'
    let currentPrice = TOKEN_SALE_CONFIG.preSalePrice
    let totalTokens = TOKEN_SALE_CONFIG.preSaleAllocation

    if (now >= TOKEN_SALE_CONFIG.endDate) {
      currentStage = 'Ended'
    } else if (now >= TOKEN_SALE_CONFIG.publicSaleDate) {
      currentStage = 'Public Sale'
      currentPrice = TOKEN_SALE_CONFIG.publicSalePrice
      totalTokens = TOKEN_SALE_CONFIG.totalSaleAllocation
    } else if (now >= TOKEN_SALE_CONFIG.startDate) {
      currentStage = 'Pre-Sale'
    }

    const soldTokens = TOKEN_SALE_CONFIG.soldTokens
    const remainingTokens = totalTokens - soldTokens
    const saleProgress = (soldTokens / totalTokens) * 100

    return {
      totalTokens,
      soldTokens,
      remainingTokens,
      currentPrice,
      startDate: TOKEN_SALE_CONFIG.startDate,
      endDate: TOKEN_SALE_CONFIG.endDate,
      currentStage,
      saleProgress,
      softCap: TOKEN_SALE_CONFIG.softCap,
      hardCap: TOKEN_SALE_CONFIG.hardCap,
    } as SaleInfo
  }, [])

  const infoCards = useMemo(() => {
    const { soldTokens, remainingTokens, saleProgress, currentStage, softCap, hardCap, currentPrice } = saleInfo;

    return [
      {
        title: "Tokens Sold",
        value: `${formatNumber(soldTokens)} BARK`,
        info: "The total number of BARK tokens that have been purchased so far."
      },
      {
        title: "Tokens Remaining",
        value: `${formatNumber(remainingTokens)} BARK`,
        info: "The number of BARK tokens still available for purchase."
      },
      {
        title: "Sale Progress",
        value: `${saleProgress.toFixed(2)}%`,
        info: "The percentage of total tokens that have been sold in this token sale."
      },
      {
        title: "Current Stage",
        value: currentStage,
        info: "The current stage of the BARK token sale."
      },
      {
        title: "Current Price",
        value: `${currentPrice.toFixed(6)} USDC`,
        info: "The current price per BARK token."
      },
      {
        title: "Soft Cap / Hard Cap",
        value: `$${formatNumber(softCap)} / $${formatNumber(hardCap)}`,
        info: "The soft cap and hard cap for the token sale in USDC."
      }
    ];
  }, [saleInfo]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
      <Card className="overflow-hidden max-w-8xl mx-auto">
        <CardHeader className="bg-bark-primary text-gray-900 p-6">
          <CardTitle className="text-2xl font-bold">Token Sale Progress</CardTitle>
          <p className="text-sm text-gray-700 mt-2">Track the progress of the BARK token sale in real-time. Stay informed about the current stage, tokens sold, and remaining availability.</p>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <Progress 
              value={saleInfo.saleProgress} 
              className="h-4 bg-bark-secondary [&>div]:bg-bark-primary"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>0 BARK</span>
              <span>{formatNumber(saleInfo.totalTokens)} BARK</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {infoCards.map((card, index) => (
              <InfoCard key={index} {...card} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

