'use client'

import { useEffect, useState } from 'react'
import { Progress } from '@/components/ui/progress'
import { formatNumber } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InfoIcon, AlertTriangle } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { TOKEN_SALE_CONFIG } from '@/config/token-sale'
import { useToast } from "@/hooks/use-toast"

type SaleInfo = {
  totalTokens: number
  soldTokens: number
  price: number
  startDate: string
  endDate: string
  remainingTokens: number
  priceSOL: number
  priceUSDC: number
  minPurchase: number
  maxPurchase: number
  currentStage: SaleStage
  saleProgress: number
}

type SaleStage = 'Not Started' | 'Pre-Sale' | 'Public Sale' | 'Ended'

export function TokenSaleProgress() {
  const [saleInfo, setSaleInfo] = useState<SaleInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchSaleInfo = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/sale-info')
        if (!response.ok) {
          throw new Error('Failed to fetch sale info')
        }
        const data: SaleInfo = await response.json()
        setSaleInfo(data)
        setError(null)
      } catch (error) {
        console.error('Error fetching sale info:', error)
        setError('Failed to load sale information. Please try again later.')
        toast({
          title: "Error",
          description: "Failed to fetch sale information. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchSaleInfo()
    const interval = setInterval(fetchSaleInfo, 60000) // Refresh every minute

    return () => clearInterval(interval)
  }, [toast])

  if (isLoading) {
    return <LoadingCard />
  }

  if (error || !saleInfo) {
    return <ErrorCard message={error || 'An unexpected error occurred'} />
  }

  const { totalTokens, soldTokens, remainingTokens, saleProgress, currentStage } = saleInfo

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
      <Card className="overflow-hidden max-w-5xl mx-auto">
        <CardHeader className="bg-gradient-to-r from-white text-black p-6">
          <CardTitle className="text-xl font-bold">Token Sale Progress</CardTitle>
          <p className="text-sm text-gray-600 mt-2">Track the progress of the BARK token sale in real-time. Stay informed about the current stage, tokens sold, and remaining availability.</p>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <Progress value={saleProgress} className="h-4 bg-[#e1d8c7] [&>div]:bg-gradient-to-r [&>div]:from-[#e1d8c7] [&>div]:to-[#d1c8b7]" />
            <div className="flex justify-between text-sm text-gray-500">
              <span>0 BARK</span>
              <span>{formatNumber(totalTokens)} BARK</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoCard
              title="Tokens Sold"
              value={`${formatNumber(soldTokens)} BARK`}
              info="The total number of BARK tokens that have been purchased so far."
            />
            <InfoCard
              title="Tokens Remaining"
              value={`${formatNumber(remainingTokens)} BARK`}
              info="The number of BARK tokens still available for purchase."
            />
            <InfoCard
              title="Sale Progress"
              value={`${(Number(saleProgress) || 0).toFixed(2)}%`}
              info="The percentage of total tokens that have been sold in this token sale."
            />
            <InfoCard
              title="Current Stage"
              value={currentStage}
              info="The current stage of the BARK token sale."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function InfoCard({ title, value, info }: { title: string, value: string, info: string }) {
  return (
    <Card className="shadow-smooth transition-all duration-300 hover:shadow-smooth-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
          {title}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <InfoIcon className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-xs">{info}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xl font-bold text-gray-800">{value}</p>
      </CardContent>
    </Card>
  )
}

function LoadingCard() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
      <Card className="overflow-hidden max-w-5xl mx-auto">
        <CardHeader className="bg-gradient-to-r from-gray-950 to-gray-900 text-white p-6">
          <CardTitle className="text-xl font-bold">Token Sale Progress</CardTitle>
          <p className="text-sm text-gray-300 mt-2">Loading sale information...</p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ErrorCard({ message }: { message: string }) {
  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
      <Card className="overflow-hidden max-w-5xl mx-auto">
        <CardHeader className="bg-red-600 text-white p-6">
          <CardTitle className="text-xl font-bold flex items-center">
            <AlertTriangle className="mr-2" />
            Error Loading Sale Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-gray-700">{message}</p>
        </CardContent>
      </Card>
    </div>
  )
}
