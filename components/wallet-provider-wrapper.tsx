'use client'

import { ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter, TorusWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";
import { ErrorBoundary } from 'react-error-boundary';

require('@solana/wallet-adapter-react-ui/styles.css');

// You can add this to your environment variables
const SOLANA_NETWORK = process.env.NEXT_PUBLIC_SOLANA_RPC_ENDPOINT || WalletAdapterNetwork.Mainnet;

function ErrorFallback({error}: {error: Error}) {
  return (
    <div role="alert">
      <p>Something went wrong with the wallet connection:</p>
      <pre style={{ color: "red" }}>{error.message}</pre>
    </div>
  )
}

export function WalletProviderWrapper({ children }: { children: ReactNode }) {
  const endpoint = useMemo(() => {
    // Check if SOLANA_NETWORK is a full URL
    if (SOLANA_NETWORK.startsWith('http')) {
      return SOLANA_NETWORK;
    }
    // If it's not a URL, treat it as a network name
    return SOLANA_NETWORK === WalletAdapterNetwork.Mainnet
      ? "https://api.mainnet-beta.solana.com"
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
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>{children}</WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ErrorBoundary>
  );
}

