'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, X } from 'lucide-react'
import { Button } from "@/components/ui/button"

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
    <Card className="bg-bark-secondary border-2 border-bark-primary shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg text-bark-primary flex items-center">
          <AlertTriangle className="mr-2 h-5 w-5" />
          Disclaimer
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="text-bark-primary hover:text-bark-accent"
          onClick={() => setIsVisible(false)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700 leading-relaxed">
          The BARK token sale is a high-risk, speculative investment. Potential investors should carefully consider their financial situation and risk tolerance before participating. Cryptocurrency investments are subject to market risks and regulatory uncertainties. This token sale is not available to residents of certain jurisdictions. Please consult with a qualified financial advisor and review all relevant documentation before making any investment decisions.
        </p>
      </CardContent>
    </Card>
  )
}

