'use client'

import { useState, useCallback, useEffect } from 'react';
import { useTransition } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatNumber } from '@/lib/utils'
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from 'lucide-react'
import { TOKEN_SALE_CONFIG } from '@/config/token-sale'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { fetchPrices, getBARKPrice, convertToUSD, convertFromUSD, PriceData } from '@/lib/currency-utils'
import { getSaleInfo, isSaleActive, validatePurchase } from '@/lib/server-utils'
import { transferTokens } from '@/lib/token-transfers'
import { PublicKey, Transaction } from '@solana/web3.js';
import { WalletButton } from './wallet-button';
import "@/app/styles/wallet-button.css";

type PaymentCurrency = 'SOL' | 'USDC'

const currencyIcons: Record<PaymentCurrency, string> = {
  SOL: "https://ucarecdn.com/0aa23f11-40b3-4cdc-891b-a169ed9f9328/sol.png",
  USDC: "https://ucarecdn.com/ee18c01a-d01d-4ad6-adb6-cac9a5539d2c/usdc.png"
}

export function PurchaseTokensCard() {
  const [amount, setAmount] = useState(TOKEN_SALE_CONFIG.minPurchase);
  const [currency, setCurrency] = useState<PaymentCurrency>('USDC');
  const [prices, setPrices] = useState<PriceData | null>(null);
  const [isPending, startTransition] = useTransition();
  const [saleInfo, setSaleInfo] = useState<any>({ currentPrice: 0, remainingTokens: 0 });
  const [isActive, setIsActive] = useState(false);
  const { toast } = useToast()
  const { publicKey } = useWallet();
  const { connection } = useConnection();

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
  }, [TOKEN_SALE_CONFIG.maxPurchase]);

  const decrementAmount = useCallback(() => {
    setAmount(prev => Math.max(prev - 1000, TOKEN_SALE_CONFIG.minPurchase));
  }, [TOKEN_SALE_CONFIG.minPurchase]);

  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= TOKEN_SALE_CONFIG.minPurchase && value <= TOKEN_SALE_CONFIG.maxPurchase) {
      setAmount(value);
    }
  }, [TOKEN_SALE_CONFIG.minPurchase, TOKEN_SALE_CONFIG.maxPurchase]);

  const handleCurrencyChange = useCallback((value: string) => {
    setCurrency(value as PaymentCurrency);
  }, []);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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
    if (!prices || !prices.solana || !prices['usd-coin']) {
      toast({
        title: "Price Information Unavailable",
        description: "Unable to fetch current prices. Please try again later.",
        variant: "destructive",
      })
      return;
    }
    startTransition(() => {
      (async () => {
        try {
          validatePurchase(amount);
          const currentPrice = saleInfo.currentStage === 'Pre-Sale' ? TOKEN_SALE_CONFIG.preSalePrice : TOKEN_SALE_CONFIG.publicSalePrice;
          const cost = currency === 'SOL'
            ? convertFromUSD(amount * currentPrice, 'SOL', prices)
            : amount * currentPrice;
          const serializedTransaction = await transferTokens(
            connection,
            publicKey,
            new PublicKey(TOKEN_SALE_CONFIG.receivingWallet),
            Math.round(cost * (currency === 'SOL' ? 1e9 : 1e6)),
            currency
          );
          const transaction = Transaction.from(Buffer.from(serializedTransaction, 'base64'));
          const signedTransaction = await window.solana.signTransaction(transaction);
          const signature = await connection.sendRawTransaction(signedTransaction.serialize());
          await connection.confirmTransaction(signature, 'confirmed');
          const updatedInfo = await getSaleInfo();
          setSaleInfo(updatedInfo);
          toast({
            title: "Purchase Successful",
            description: `Successfully purchased ${amount} BARK tokens. Transaction ID: ${signature}`,
          })
        } catch (error) {
          console.error('Purchase error:', error);
          toast({
            title: "Purchase Failed",
            description: error instanceof Error ? error.message : 'An unknown error occurred',
            variant: "destructive",
          })
        }
      })();
    });
  }, [amount, currency, publicKey, connection, saleInfo, prices, isActive, toast, TOKEN_SALE_CONFIG.preSalePrice, TOKEN_SALE_CONFIG.publicSalePrice, TOKEN_SALE_CONFIG.receivingWallet]);

  const totalCost = saleInfo && prices
  ? (currency === 'SOL'
      ? convertFromUSD((saleInfo.currentPrice || 0) * amount, 'SOL', prices)
      : (saleInfo.currentPrice || 0) * amount)
  : 0;

  return (
    <Card className="pb-6">
      <CardHeader>
        <CardTitle>Purchase BARK Tokens</CardTitle>
      </CardHeader>
      <CardContent>
      {!saleInfo ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-[#e1d8c7]" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Price per BARK:</span>
              <div className="flex items-center">
                <span className="text-sm font-bold text-[#e1d8c7] mr-2">
                  {saleInfo && prices
                    ? (currency === 'SOL'
                        ? convertFromUSD(saleInfo.currentPrice || 0, 'SOL', prices).toFixed(6)
                        : (saleInfo.currentPrice || 0).toFixed(6))
                    : '...'} {currency}
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
                {formatNumber(saleInfo?.remainingTokens || 0)} - {formatNumber(TOKEN_SALE_CONFIG.maxPurchase)} BARK
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
                className="rounded-r-none bg-[#e1d8c7] text-gray-900 hover:bg-[#d1c8b7]"
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
                className="rounded-l-none bg-[#e1d8c7] text-gray-900 hover:bg-[#d1c8b7]"
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
                {(['SOL', 'USDC'] as PaymentCurrency[]).map((curr) => (
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
          <WalletButton
            variant="wide"
            onClick={handleSubmit}
            disabled={isPending || !isActive}
            className="mt-4"
          >
            {!publicKey ? (
              'Connect Wallet'
            ) : isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : !isActive ? (
              'Sale Inactive'
            ) : (
              'Buy BARK Tokens'
            )}
          </WalletButton>
        </form>
      )}
      </CardContent>
    </Card>
  );
}