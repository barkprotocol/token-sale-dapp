'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { TOKEN_SALE_CONFIG } from '@/config/token-sale'

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
      <div key={key} className="bg-gray-100 p-4 rounded-lg shadow-sm">
        <div className="text-3xl sm:text-4xl font-bold text-gray-800 mb-1">{value}</div>
        <div className="text-xs sm:text-sm text-gray-600 uppercase">{key}</div>
      </div>
    ))
  ), [timeLeft])

  return (
    <div className="text-center">
      <h2 className="flex flex-col items-center mb-6">
        <span className="text-gray-800 text-3xl font-bold mb-2">{stage}</span>
        <span className="text-sm font-normal text-gray-600">
          {getDescription(stage)}
        </span>
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {timeLeftElements}
      </div>
    </div>
  )
}

