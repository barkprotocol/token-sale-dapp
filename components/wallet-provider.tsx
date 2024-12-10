'use client'

import { ReactNode, createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { useWallet, ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createTransferInstruction } from '@solana/spl-token';
import { fetchPrices, convertToUSD } from '@/lib/currency-utils';

const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'); // Mainnet USDC mint address

type Currency = 'SOL' | 'USDC';

type WalletContextType = {
  publicKey: PublicKey | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  sendTransaction: (amount: number, currency: Currency) => Promise<string>;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function SolanaWalletProvider({ children }: { children: ReactNode }) {
  const network = 'https://api.mainnet-beta.solana.com';
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={network}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export function WalletConnectionProvider({ children }: { children: ReactNode }) {
  const { publicKey, connect, disconnect, sendTransaction: walletSendTransaction } = useWallet();
  const [connection, setConnection] = useState<Connection | null>(null);

  useEffect(() => {
    const conn = new Connection('https://api.mainnet-beta.solana.com');
    setConnection(conn);
  }, []);

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  const handleSendTransaction = async (amount: number, currency: Currency) => {
    if (!publicKey || !connection) {
      throw new Error('Wallet not connected or connection not established');
    }

    const prices = await fetchPrices();
    const amountInUSD = convertToUSD(amount, currency, prices);

    let transaction: Transaction;
    const receivingWallet = new PublicKey('BARKkeAwhTuFzcLHX4DjotRsmjXQ1MshGrZbn1CUQqMo');

    if (currency === 'SOL') {
      transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: receivingWallet,
          lamports: Math.round(amountInUSD * LAMPORTS_PER_SOL)
        })
      );
    } else if (currency === 'USDC') {
      const fromTokenAccount = await getAssociatedTokenAddress(USDC_MINT, publicKey);
      const toTokenAccount = await getAssociatedTokenAddress(USDC_MINT, receivingWallet);

      transaction = new Transaction().add(
        createTransferInstruction(
          fromTokenAccount,
          toTokenAccount,
          publicKey,
          Math.round(amountInUSD * 1000000), // USDC has 6 decimal places
          [],
          TOKEN_PROGRAM_ID
        )
      );
    } else {
      throw new Error('Unsupported currency');
    }

    try {
      const signature = await walletSendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');
      return signature;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  };

  return (
    <WalletContext.Provider 
      value={{ 
        publicKey, 
        connect: handleConnect, 
        disconnect: handleDisconnect,
        sendTransaction: handleSendTransaction
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWalletConnection() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWalletConnection must be used within a WalletConnectionProvider');
  }
  return context;
}

