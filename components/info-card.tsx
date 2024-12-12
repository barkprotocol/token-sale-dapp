'use client'

import { Card, CardContent } from "@/components/ui/card"
import { InfoIcon } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface InfoCardProps {
  title: string
  value: string
  info: string
}

export function InfoCard({ title, value, info }: InfoCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-semibold mt-1">{value}</p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <InfoIcon className="h-5 w-5 text-[#d0c8b9]" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{info}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  )
}

