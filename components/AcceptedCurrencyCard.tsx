'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchPrices, getBARKPrice, PriceData, Currency } from '@/lib/currency-utils'
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"

export function AcceptedCurrencyCard() {
  const [prices, setPrices] = useState<PriceData | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        const data = await fetchPrices()
        setPrices(data)
      } catch (error) {
        console.error('Failed to fetch prices:', error)
        toast({
          title: "Error",
          description: "Failed to fetch current prices. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPriceData()
    const interval = setInterval(fetchPriceData, 60000) // Refresh every minute

    return () => clearInterval(interval)
  }, [toast])

  const currencies: { name: Currency; logo: string }[] = [
    { name: 'SOL', logo: 'https://ucarecdn.com/0aa23f11-40b3-4cdc-891b-a169ed9f9328/sol.png' },
    { name: 'USDC', logo: 'https://ucarecdn.com/ee18c01a-d01d-4ad6-adb6-cac9a5539d2c/usdc.png' },
  ]

  return (
    <Card className="overflow-hidden pb-6 bg-white shadow-xl rounded-xl">
      <CardHeader className="text-white p-6 bg-gradient-to-r from-gray-950 to-gray-900 rounded-t-xl">
        <CardTitle className="text-xl font-bold">Accepted Currencies</CardTitle>
        <p className="text-sm text-gray-300 mt-2">BARK tokens can be purchased using the following cryptocurrencies. Prices are updated in real-time.</p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {currencies.map((currency) => (
            <div key={currency.name} className="flex items-center space-x-3 p-4 rounded-xl bg-gray-100 shadow-md transition-all duration-300 hover:shadow-xl hover:scale-105 hover:bg-gray-50">
              <div className="flex-shrink-0">
                <Image src={currency.logo} alt={`${currency.name} logo`} width={40} height={40} className="rounded-full" />
              </div>
              <div className="flex-grow">
                <p className="text-base font-semibold text-gray-800">{currency.name}</p>
                {loading ? (
                  <Skeleton className="h-3 w-24 mt-1" />
                ) : prices ? (
                  <p className="text-xs text-gray-600 mt-1">
                    1 BARK = <span className="font-medium text-green-600">{getBARKPrice(currency.name, prices).toFixed(6)} {currency.name}</span>
                  </p>
                ) : (
                  <p className="text-xs text-red-600 mt-1">Failed to load price</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
