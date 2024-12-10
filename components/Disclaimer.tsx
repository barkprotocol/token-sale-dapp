'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function Disclaimer() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 30000) // 30 seconds

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <Card className="bg-white border-2 border-[#c3b192] pb-6">
      <CardHeader>
        <CardTitle className="text-lg text-[#c3b192]">Disclaimer</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700">
          The BARK token sale is a high-risk, speculative investment. Potential investors should carefully consider their financial situation and risk tolerance before participating. Cryptocurrency investments are subject to market risks and regulatory uncertainties. This token sale is not available to residents of certain jurisdictions. Please consult with a qualified financial advisor and review all relevant documentation before making any investment decisions.
        </p>
      </CardContent>
    </Card>
  )
}

