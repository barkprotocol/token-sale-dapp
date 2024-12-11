'use client'

import { createContext, useContext, ReactNode, useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';

const WalletConnectionContext = createContext<ReturnType<typeof useWallet> & { connection: ReturnType<typeof useConnection>['connection'] } | undefined>(undefined);

export function WalletConnectionProvider({ children }: { children: ReactNode }) {
  const wallet = useWallet();
  const { connection } = useConnection();

  const value = useMemo(() => ({ ...wallet, connection }), [wallet, connection]);

  return (
    <WalletConnectionContext.Provider value={value}>
      {children}
    </WalletConnectionContext.Provider>
  );
}

export function useWalletConnection() {
  const context = useContext(WalletConnectionContext);
  if (context === undefined) {
    throw new Error('useWalletConnection must be used within a WalletConnectionProvider');
  }
  return context;
}

