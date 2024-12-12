'use client'

import { ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter, TorusWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";

require('@solana/wallet-adapter-react-ui/styles.css');

// You can add this to your environment variables
const SOLANA_NETWORK = process.env.NEXT_PUBLIC_SOLANA_RPC_ENDPOINT || WalletAdapterNetwork.Mainnet;

export function WalletProviderWrapper({ children }: { children: ReactNode }) {
  const network = useMemo(() => {
    if (SOLANA_NETWORK.startsWith('http')) {
      return SOLANA_NETWORK;
    }
    return SOLANA_NETWORK === WalletAdapterNetwork.Mainnet
      ? clusterApiUrl(WalletAdapterNetwork.Mainnet)
      : clusterApiUrl(SOLANA_NETWORK as WalletAdapterNetwork);
  }, []);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter()
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={network}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

