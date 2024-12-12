'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { TOKEN_SALE_CONFIG } from '@/config/token-sale'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar } from 'lucide-react'

type SaleStage = 'Not Started' | 'Pre-Sale' | 'Public Sale' | 'Ended'

type TimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function Counter() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [stage, setStage] = useState<SaleStage>('Not Started')

  const calculateTimeLeft = useCallback((): [TimeLeft, SaleStage] => {
    const now = new Date()
    const preSaleStart = TOKEN_SALE_CONFIG.startDate
    const publicSaleStart = new Date(preSaleStart.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days after pre-sale
    const saleEnd = TOKEN_SALE_CONFIG.endDate

    let difference: number
    let currentStage: SaleStage

    if (now < preSaleStart) {
      difference = preSaleStart.getTime() - now.getTime()
      currentStage = 'Not Started'
    } else if (now < publicSaleStart) {
      difference = publicSaleStart.getTime() - now.getTime()
      currentStage = 'Pre-Sale'
    } else if (now < saleEnd) {
      difference = saleEnd.getTime() - now.getTime()
      currentStage = 'Public Sale'
    } else {
      difference = 0
      currentStage = 'Ended'
    }

    if (difference > 0) {
      return [
        {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        },
        currentStage,
      ]
    }

    return [{ days: 0, hours: 0, minutes: 0, seconds: 0 }, currentStage]
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      const [newTimeLeft, newStage] = calculateTimeLeft()
      setTimeLeft(newTimeLeft)
      setStage(newStage)

      if (newStage === 'Ended') {
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [calculateTimeLeft])

  const getDescription = useCallback((currentStage: SaleStage): string => {
    switch (currentStage) {
      case 'Not Started':
        return 'Time until Pre-Sale begins'
      case 'Pre-Sale':
        return 'Time until Public Sale begins'
      case 'Public Sale':
        return 'Time remaining in Public Sale'
      case 'Ended':
        return 'Token sale has ended'
      default:
        return ''
    }
  }, [])

  const timeLeftElements = useMemo(() => (
    Object.entries(timeLeft).map(([key, value]) => (
      <div key={key} className="flex flex-col items-center justify-center bg-gray-800 p-4 rounded-lg">
        <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{value.toString().padStart(2, '0')}</div>
        <div className="text-xs sm:text-sm text-[#d0c8b9] uppercase">{key}</div>
      </div>
    ))
  ), [timeLeft])

  const getBadgeColor = (currentStage: SaleStage): string => {
    switch (currentStage) {
      case 'Not Started':
        return 'bg-yellow-100 text-yellow-800'
      case 'Pre-Sale':
        return 'bg-blue-100 text-blue-800'
      case 'Public Sale':
        return 'bg-green-100 text-green-800'
      case 'Ended':
        return 'bg-gray-100 text-gray-800'
      default:
        return ''
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto my-8 bg-gray-900 text-[#d0c8b9]">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-white">BARK Token Sale</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center">
          <Badge className={`text-sm font-semibold mb-2 ${getBadgeColor(stage)}`}>
            {stage}
          </Badge>
          <p className="text-sm flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {getDescription(stage)}
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {timeLeftElements}
        </div>
        <div className="text-sm flex items-center justify-center">
          <Calendar className="w-4 h-4 mr-1" />
          Sale ends on {TOKEN_SALE_CONFIG.endDate.toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  )
}

