import { useState, useEffect, useCallback } from 'react'
import { SaleInfo, SaleStage } from '@/types/sale-info'
import { 
  TOKEN_SALE_CONFIG, 
  getCurrentPrice, 
  getTotalTokens, 
  getRemainingTokens, 
  getSaleStage, 
  getSaleProgress,
  getTimeUntilNextStage,
  formatTimeRemaining
} from '@/config/token-sale'
import { useToast } from "@/hooks/use-toast"

export function useSaleInfo() {
  const [saleInfo, setSaleInfo] = useState<SaleInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchSaleInfo = useCallback(async () => {
    try {
      setIsLoading(true)
      const currentStage = getSaleStage()
      const currentPrice = getCurrentPrice()
      const totalTokens = getTotalTokens()
      const soldTokens = TOKEN_SALE_CONFIG.soldTokens
      const remainingTokens = getRemainingTokens()
      const saleProgress = getSaleProgress()
      const timeUntilNextStage = getTimeUntilNextStage()

      const info: SaleInfo = {
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
        timeUntilNextStage: formatTimeRemaining(timeUntilNextStage)
      }
      setSaleInfo(info)
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
  }, [toast])

  useEffect(() => {
    fetchSaleInfo()
    const interval = setInterval(fetchSaleInfo, 60000) // Refresh every minute

    return () => clearInterval(interval)
  }, [fetchSaleInfo])

  return { saleInfo, isLoading, error, refetch: fetchSaleInfo }
}

