'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { Loader2 } from 'lucide-react'
import "@/app/styles/wallet-button.css"

interface WalletButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'wide';
}

export function WalletButton({ 
  onClick, 
  disabled = false, 
  children, 
  className = "",
  variant = 'wide'
}: WalletButtonProps) {
  const { publicKey, connecting, connected, disconnect } = useWallet()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleClick = () => {
    if (connected) {
      disconnect()
    } else if (onClick) {
      onClick()
    }
  }

  const buttonClass = `wallet-adapter-button w-full ${className} h-10`

  if (!mounted) {
    return null
  }

  return (
    <>
      {connected && publicKey ? (
        <Button 
          variant="outline" 
          className={buttonClass}
          onClick={handleClick}
          disabled={disabled}
        >
          {children || `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`}
        </Button>
      ) : (
        <WalletMultiButton className={buttonClass}>
          {connecting ? (
            <>
              <Loader2 className="mr-4 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            children || 'Connect Wallet'
          )}
        </WalletMultiButton>
      )}
    </>
  )
}