'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { Wallet } from 'lucide-react'

const truncateAddress = (address: string) => {
  return `${address.slice(0, 4)}...${address.slice(-4)}`
}

export function WalletButton() {
  const { wallet, connect, disconnect, connecting, connected } = useWallet()
  const { setVisible } = useWalletModal()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleClick = () => {
    if (connected) {
      disconnect()
    } else if (wallet) {
      connect().catch(() => {})
    } else {
      setVisible(true)
    }
  }

  return (
    <Button
      onClick={handleClick}
      disabled={connecting}
      variant="outline"
      className="bg-white text-gray-900 hover:bg-gray-100 hover:text-gray-900 focus:ring-bark-accent border border-gray-300 px-6 py-2 text-lg flex items-center space-x-2 rounded-md transition-all duration-200 ease-in-out shadow-sm hover:shadow-md"
    >
      <Wallet className="w-6 h-6" />
      <span>
        {connecting ? (
          'Connecting...'
        ) : connected ? (
          truncateAddress(wallet?.publicKey?.toBase58() || '')
        ) : wallet ? (
          'Connect'
        ) : (
          'Select Wallet'
        )}
      </span>
    </Button>
  )
}

