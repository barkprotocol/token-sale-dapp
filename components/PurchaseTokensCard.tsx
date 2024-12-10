'use client'

import { useState, useCallback, useTransition, useEffect } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatNumber } from '@/lib/utils'
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from 'lucide-react'
import { TOKEN_SALE_CONFIG } from '@/config/token-sale'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useWalletConnection } from "./wallet-provider"
import { fetchPrices, getBARKPrice, convertToUSD, convertFromUSD, Currency, PriceData } from '@/lib/currency-utils'
import { getSaleInfo, isSaleActive, validatePurchase } from '@/lib/server-utils'
import { transferTokens } from '@/lib/token-transfers'
import { PublicKey } from '@solana/web3.js';

type Currency = 'SOL' | 'USDC'

const currencyIcons = {
  SOL: "https://ucarecdn.com/0aa23f11-40b3-4cdc-891b-a169ed9f9328/sol.png",
  USDC: "https://ucarecdn.com/ee18c01a-d01d-4ad6-adb6-cac9a5539d2c/usdc.png"
}

export function PurchaseTokensCard() {
  const [amount, setAmount] = useState(TOKEN_SALE_CONFIG.minPurchase);
  const [currency, setCurrency] = useState<Currency>('SOL');
  const [prices, setPrices] = useState<PriceData | null>(null);
  const [isPending, startTransition] = useTransition()
  const [saleInfo, setSaleInfo] = useState<any>(null);
  const [isActive, setIsActive] = useState(false);
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
        const barkPriceSOL = getBARKPrice('SOL', priceData);
        const barkPriceUSDC = getBARKPrice('USDC', priceData);
        setSaleInfo(prevInfo => ({
          ...prevInfo,
          priceSOL: barkPriceSOL,
          priceUSDC: barkPriceUSDC
        }));
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

  const handleCurrencyChange = useCallback((value: string) => {
    setCurrency(value as Currency);
  }, []);

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
    startTransition(async () => {
      try {
        // Validate the purchase
        validatePurchase(amount);

        // Calculate the cost in the selected currency
        const cost = currency === 'SOL' 
          ? amount * saleInfo.priceSOL
          : convertToUSD(amount * saleInfo.priceSOL, 'SOL', prices);

        // Execute the token transfer
        const txid = await transferTokens(
          connection,
          publicKey,
          new PublicKey(TOKEN_SALE_CONFIG.receivingWallet),
          Math.round(cost * (currency === 'SOL' ? 1e9 : 1e6)), // Convert to lamports or USDC base units
          currency
        );

        // Update the sale info after successful purchase
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
      }
    })
  }, [amount, currency, publicKey, connection, saleInfo, prices, isActive, toast]);

  const totalCost = saleInfo && prices
    ? (currency === 'SOL'
        ? saleInfo.priceSOL * amount
        : convertToUSD(saleInfo.priceSOL * amount, 'SOL', prices))
    : 0;

  return (
    <Card className="pb-6">
      <CardHeader>
        <CardTitle>Purchase BARK Tokens</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Price per BARK:</span>
              <div className="flex items-center">
                <span className="text-sm font-bold text-[#e1d8c7] mr-2">
                  {saleInfo ? (currency === 'SOL' ? saleInfo.priceSOL.toFixed(6) : saleInfo.priceUSDC.toFixed(6)) : '...'} {currency}
                </span>
                <Image
                  src={currencyIcons[currency]}
                  alt={`${currency} logo`}
                  width={20}
                  height={20}
                />
              </div>
            </div>
            <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Purchase Limits:</span>
              <span className="text-sm font-bold text-[#e1d8c7]">
                {formatNumber(TOKEN_SALE_CONFIG.minPurchase)} - {formatNumber(TOKEN_SALE_CONFIG.maxPurchase)} BARK
              </span>
            </div>
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium mb-2 text-gray-700">
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
          <div>
            <label htmlFor="currency" className="block text-sm font-medium mb-2 text-gray-700">
              Payment Currency
            </label>
            <Select onValueChange={handleCurrencyChange} value={currency}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select currency">
                  <div className="flex items-center">
                    <Image
                      src={currencyIcons[currency]}
                      alt={`${currency} logo`}
                      width={20}
                      height={20}
                      className="mr-2"
                    />
                    {currency}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {(['SOL', 'USDC'] as Currency[]).map((curr) => (
                  <SelectItem key={curr} value={curr}>
                    <div className="flex items-center">
                      <Image
                        src={currencyIcons[curr]}
                        alt={`${curr} logo`}
                        width={20}
                        height={20}
                        className="mr-2"
                      />
                      {curr}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Total cost:</span>
            <span className="text-sm font-bold text-[#e1d8c7]">
              {totalCost.toFixed(6)} {currency}
            </span>
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
      </CardContent>
    </Card>
  );
}

