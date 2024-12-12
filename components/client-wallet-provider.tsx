'use client'

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';

const WalletProviderWrapper = dynamic(
  () => import('@/components/wallet-provider-wrapper').then(mod => mod.WalletProviderWrapper),
  { ssr: false }
);

export default function ClientWalletProvider({ children }: { children: ReactNode }) {
  return <WalletProviderWrapper>{children}</WalletProviderWrapper>;
}

