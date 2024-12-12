import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Commitment,
} from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createTransferInstruction,
  createAssociatedTokenAccountInstruction,
  getAccount,
  createMintToInstruction,
} from '@solana/spl-token';
import { TOKEN_SALE_CONFIG } from '@/config/token-sale';
import { Currency } from '@/lib/currency-utils';

// Mainnet USDC mint address
const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
const TRANSACTION_OPTIONS = { commitment: 'confirmed' as Commitment };

// BARK token mint address
const BARK_MINT = new PublicKey(TOKEN_SALE_CONFIG.barkTokenMint);

export async function transferTokens(
  connection: Connection,
  payerPublicKey: PublicKey,
  recipientAccount: PublicKey,
  amount: number,
  currency: Currency
): Promise<string> {
  if (amount <= 0) {
    throw new Error('Amount must be greater than zero.');
  }

  try {
    const transaction = new Transaction();

    switch (currency) {
      case 'SOL':
        await handleSOLTransfer(transaction, payerPublicKey, recipientAccount, amount);
        break;
      case 'USDC':
        await handleTokenTransfer(transaction, connection, payerPublicKey, recipientAccount, amount, USDC_MINT, 6);
        break;
      case 'BARK':
        await handleTokenTransfer(transaction, connection, payerPublicKey, recipientAccount, amount, BARK_MINT, TOKEN_SALE_CONFIG.barkTokenDecimals);
        break;
      default:
        throw new Error(`Unsupported currency: ${currency}`);
    }

    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
    transaction.recentBlockhash = blockhash;
    transaction.lastValidBlockHeight = lastValidBlockHeight;
    transaction.feePayer = payerPublicKey;

    return transaction.serialize({ requireAllSignatures: false }).toString('base64');
  } catch (error: unknown) {
    console.error('Error in transferTokens:', error);
    throw new Error(`Transfer failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function handleSOLTransfer(
  transaction: Transaction,
  fromPubkey: PublicKey,
  toPubkey: PublicKey,
  amount: number
): Promise<void> {
  const lamports = amount * LAMPORTS_PER_SOL;
  transaction.add(
    SystemProgram.transfer({
      fromPubkey,
      toPubkey,
      lamports,
    })
  );
}

async function handleTokenTransfer(
  transaction: Transaction,
  connection: Connection,
  payerPublicKey: PublicKey,
  recipientAccount: PublicKey,
  amount: number,
  mint: PublicKey,
  decimals: number
): Promise<void> {
  const amountInSmallestUnit = Math.floor(amount * Math.pow(10, decimals));
  const fromTokenAccount = await getAssociatedTokenAddress(mint, payerPublicKey);
  const toTokenAccount = await getAssociatedTokenAddress(mint, recipientAccount);

  const receiverAccount = await getAccount(connection, toTokenAccount).catch(() => null);

  if (!receiverAccount) {
    transaction.add(
      createAssociatedTokenAccountInstruction(
        payerPublicKey,
        toTokenAccount,
        recipientAccount,
        mint
      )
    );
  }

  transaction.add(
    createTransferInstruction(
      fromTokenAccount,
      toTokenAccount,
      payerPublicKey,
      amountInSmallestUnit,
      [],
      TOKEN_PROGRAM_ID
    )
  );
}

export async function mintBARKTokens(
  connection: Connection,
  mintAuthorityPublicKey: PublicKey,
  recipientAccount: PublicKey,
  amount: number
): Promise<string> {
  if (amount <= 0) {
    throw new Error('Amount must be greater than zero.');
  }

  try {
    const barkMint = new PublicKey(TOKEN_SALE_CONFIG.barkTokenMint);
    const amountInSmallestUnit = Math.floor(amount * Math.pow(10, TOKEN_SALE_CONFIG.barkTokenDecimals));

    const recipientTokenAccount = await getAssociatedTokenAddress(barkMint, recipientAccount);

    const transaction = new Transaction().add(
      createMintToInstruction(
        barkMint,
        recipientTokenAccount,
        mintAuthorityPublicKey,
        amountInSmallestUnit,
        [],
        TOKEN_PROGRAM_ID
      )
    );

    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
    transaction.recentBlockhash = blockhash;
    transaction.lastValidBlockHeight = lastValidBlockHeight;
    transaction.feePayer = mintAuthorityPublicKey;

    return transaction.serialize({ requireAllSignatures: false }).toString('base64');
  } catch (error: unknown) {
    console.error('Error in mintBARKTokens:', error);
    throw new Error(`Minting failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function createTokenAccount(
  connection: Connection,
  payerPublicKey: PublicKey,
  mint: PublicKey
): Promise<PublicKey> {
  try {
    const associatedTokenAddress = await getAssociatedTokenAddress(mint, payerPublicKey);

    const existingAccount = await getAccount(connection, associatedTokenAddress).catch(() => null);

    if (existingAccount) {
      console.log(`Token account already exists: ${associatedTokenAddress.toBase58()}`);
      return associatedTokenAddress;
    }

    const transaction = new Transaction().add(
      createAssociatedTokenAccountInstruction(
        payerPublicKey,
        associatedTokenAddress,
        payerPublicKey,
        mint
      )
    );

    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
    transaction.recentBlockhash = blockhash;
    transaction.lastValidBlockHeight = lastValidBlockHeight;
    transaction.feePayer = payerPublicKey;

    const serializedTransaction = transaction.serialize({ requireAllSignatures: false }).toString('base64');

    console.log(`Token account creation transaction serialized: ${serializedTransaction}`);
    return associatedTokenAddress;
  } catch (error: unknown) {
    console.error(`[createTokenAccount] Error for mint ${mint.toBase58()} and payer ${payerPublicKey.toBase58()}:`, error);
    throw new Error(`Account creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getTokenBalance(
  connection: Connection,
  publicKey: PublicKey,
  mint: PublicKey
): Promise<number> {
  try {
    const associatedTokenAddress = await getAssociatedTokenAddress(mint, publicKey);
    const account = await getAccount(connection, associatedTokenAddress);
    return Number(account.amount) / Math.pow(10, account.mint.decimals);
  } catch (error: unknown) {
    console.error(`Error fetching token balance for ${publicKey.toBase58()}:`, error);
    throw new Error(`Failed to fetch token balance: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

