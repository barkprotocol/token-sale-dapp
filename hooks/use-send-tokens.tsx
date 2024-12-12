'use client'

import { useState, useCallback } from "react";
import { PublicKey, Connection } from "@solana/web3.js";
import { useWalletConnection } from "@/components/wallet-provider";
import { useToast } from "@/hooks/use-toast";
import { transferTokens } from "@/lib/utils/token-transfers";
import { Currency } from "@/lib/currency-utils";

export const useSendTokens = () => {
  const { connection, publicKey } = useWalletConnection();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [transactionUrl, setTransactionUrl] = useState<string | null>(null);

  const sendTokens = useCallback(async (transferAmount: number, destinationWallet: PublicKey, currency: Currency) => {
    setIsLoading(true);
    setTransactionUrl(null);

    if (!connection || !publicKey) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to send tokens.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const treasuryWallet = new PublicKey(process.env.NEXT_PUBLIC_TREASURY_WALLET!);
      
      if (!treasuryWallet) {
        throw new Error("Treasury wallet address is not configured.");
      }

      const signature = await transferTokens(
        connection,
        treasuryWallet,
        destinationWallet,
        transferAmount,
        currency
      );

      const explorerUrl = `https://explorer.solana.com/tx/${signature}`;
      setTransactionUrl(explorerUrl);
      
      toast({
        title: "Transaction Successful",
        description: (
          <div>
            Tokens have been sent successfully.
            <a href={explorerUrl} target="_blank" rel="noopener noreferrer" className="block mt-2 text-bark-accent hover:underline">
              View on Solana Explorer
            </a>
          </div>
        ),
      });
    } catch (error) {
      console.error("Error sending tokens:", error);
      toast({
        title: "Transaction Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [connection, publicKey, toast]);

  return {
    sendTokens,
    isLoading,
    transactionUrl,
  };
};

export default useSendTokens;

