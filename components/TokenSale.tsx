'use client'

import { useState, useCallback, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatNumber } from '@/lib/utils'
import { TOKEN_SALE_CONFIG } from '@/config/token-sale'
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from 'lucide-react'
import { useWalletConnection } from "./wallet-provider"
import { fetchPrices, getBARKPrice, convertToUSD, convertFromUSD } from '@/lib/currency-utils'
import { getSaleInfo, isSaleActive, validatePurchase } from '@/lib/server-utils'
import { transferTokens } from '@/lib/utils/token-transfers'
import { PublicKey } from '@solana/web3.js';

export function TokenSale() {
  const [amount, setAmount] = useState(TOKEN_SALE_CONFIG.minPurchase);
  const [saleInfo, setSaleInfo] = useState<any>(null);
  const [isActive, setIsActive] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [prices, setPrices] = useState<any>(null);
  const { toast } = useToast()
  const { publicKey, connection } = useWalletConnection();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const info = await getSaleInfo();
        setSaleInfo(info);
        setIsActive(await isSaleActive());
        const priceData = await fetchPrices();
        setPrices(priceData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch sale information. Please try again later.",
          variant: "destructive",
        });
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [toast]);

  const incrementAmount = useCallback(() => {
    setAmount(prev => Math.min(prev + 1000, TOKEN_SALE_CONFIG.maxPurchase));
  }, []);

  const decrementAmount = useCallback(() => {
    setAmount(prev => Math.max(prev - 1000, TOKEN_SALE_CONFIG.minPurchase));
  }, []);

  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= TOKEN_SALE_CONFIG.minPurchase && value <= TOKEN_SALE_CONFIG.maxPurchase) {
      setAmount(value);
    }
  }, []);

  const totalCost = useMemo(() => {
    return saleInfo ? (amount * saleInfo.priceSOL).toFixed(5) : '0';
  }, [amount, saleInfo]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey || !connection) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to purchase tokens.",
        variant: "destructive",
      })
      return;
    }
    if (!isActive) {
      toast({
        title: "Sale Inactive",
        description: "The token sale is not currently active.",
        variant: "destructive",
      })
      return;
    }
    setIsPending(true);
    try {
      validatePurchase(amount);
      const cost = amount * saleInfo.priceSOL;
      const txid = await transferTokens(
        connection,
        publicKey,
        new PublicKey(TOKEN_SALE_CONFIG.receivingWallet),
        Math.round(cost * 1e9), // Convert to lamports
        'SOL'
      );
      const updatedInfo = await getSaleInfo();
      setSaleInfo(updatedInfo);
      toast({
        title: "Purchase Successful",
        description: `Successfully purchased ${amount} BARK tokens. Transaction ID: ${txid}`,
      })
    } catch (error) {
      console.error('Purchase error:', error);
      toast({
        title: "Purchase Failed",
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: "destructive",
      })
    } finally {
      setIsPending(false);
    }
  }, [amount, connection, isActive, publicKey, saleInfo, toast]);

  const formContent = useMemo(() => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-[#e1d8c7]">
          <p>Price: {saleInfo ? saleInfo.priceSOL.toFixed(6) : '...'} SOL per BARK</p>
          <p>Available: {saleInfo ? formatNumber(saleInfo.remainingTokens) : '...'} BARK</p>
        </div>
        <Image
          src="/solana-sol-logo.svg"
          alt="Solana logo"
          width={40}
          height={40}
          className="text-[#e1d8c7]"
        />
      </div>
      <div>
        <label htmlFor="amount" className="block text-sm font-medium mb-1 text-gray-700">
          Amount (BARK)
        </label>
        <div className="flex items-center">
          <Button
            type="button"
            onClick={decrementAmount}
            variant="outline"
            className="rounded-r-none"
            disabled={isPending}
          >
            -
          </Button>
          <Input
            type="number"
            id="amount"
            value={amount}
            onChange={handleAmountChange}
            className="rounded-none text-center"
            min={TOKEN_SALE_CONFIG.minPurchase}
            max={TOKEN_SALE_CONFIG.maxPurchase}
            step={1000}
            required
            disabled={isPending}
          />
          <Button
            type="button"
            onClick={incrementAmount}
            variant="outline"
            className="rounded-l-none"
            disabled={isPending}
          >
            +
          </Button>
        </div>
      </div>
      <div className="text-sm text-[#e1d8c7]">
        Total cost: {totalCost} SOL
      </div>
      <Button 
        type="submit" 
        className="w-full bg-[#e1d8c7] text-gray-900 hover:bg-[#d1c8b7]"
        disabled={isPending || !publicKey || !isActive}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : !isActive ? (
          'Sale Inactive'
        ) : !publicKey ? (
          'Connect Wallet to Purchase'
        ) : (
          'Buy BARK Tokens'
        )}
      </Button>
    </form>
  ), [amount, handleAmountChange, incrementAmount, decrementAmount, isActive, isPending, publicKey, saleInfo, totalCost, handleSubmit]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Purchase BARK Tokens</CardTitle>
      </CardHeader>
      <CardContent>
        {formContent}
      </CardContent>
    </Card>
  );
}

