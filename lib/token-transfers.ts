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

// Mainnet USDC mint address
const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'); 
const TRANSACTION_OPTIONS = { commitment: 'confirmed' as Commitment };

export async function transferTokens(
  connection: Connection,
  payerPublicKey: PublicKey,
  recipientAccount: PublicKey,
  amount: number,
  currency: 'SOL' | 'USDC'
): Promise<string> {
  if (amount <= 0) {
    throw new Error('Amount must be greater than zero.');
  }

  try {
    const transaction = new Transaction();

    if (currency === 'SOL') {
      // Convert SOL to lamports (smallest unit of SOL)
      const lamports = amount;
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: payerPublicKey,
          toPubkey: recipientAccount,
          lamports,
        })
      );
    } else if (currency === 'USDC') {
      // Convert amount to smallest unit (USDC uses 6 decimals)
      const amountInSmallestUnit = amount; // amount is already in the smallest unit
      const fromTokenAccount = await getAssociatedTokenAddress(USDC_MINT, payerPublicKey);
      const toTokenAccount = await getAssociatedTokenAddress(USDC_MINT, recipientAccount);

      // Check if the recipient's token account exists
      const receiverAccount = await getAccount(connection, toTokenAccount).catch(() => null);

      if (!receiverAccount) {
        transaction.add(
          createAssociatedTokenAccountInstruction(
            payerPublicKey,
            toTokenAccount,
            recipientAccount,
            USDC_MINT
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
    } else {
      throw new Error('Unsupported currency');
    }

    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    transaction.feePayer = payerPublicKey;

    // Serialize the transaction
    const serializedTransaction = transaction.serialize({ requireAllSignatures: false }).toString('base64');

    return serializedTransaction;
  } catch (error: unknown) {
    console.error('Error in transferTokens:', error);
    if (error instanceof Error) {
      throw new Error(`Transfer failed: ${error.message}`);
    } else {
      throw new Error('Transfer failed: Unknown error');
    }
  }
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
    const amountInSmallestUnit = amount * Math.pow(10, TOKEN_SALE_CONFIG.barkTokenDecimals);

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

    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    transaction.feePayer = mintAuthorityPublicKey;

    // Serialize the transaction
    const serializedTransaction = transaction.serialize({ requireAllSignatures: false }).toString('base64');

    return serializedTransaction;
  } catch (error: unknown) {
    console.error('Error in mintBARKTokens:', error);
    if (error instanceof Error) {
      throw new Error(`Minting failed: ${error.message}`);
    } else {
      throw new Error('Minting failed: Unknown error');
    }
  }
}

export async function createTokenAccount(
  connection: Connection,
  payerPublicKey: PublicKey,
  mint: PublicKey
): Promise<PublicKey> {
  try {
    const associatedTokenAddress = await getAssociatedTokenAddress(mint, payerPublicKey);

    // Check if the token account already exists
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

    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    transaction.feePayer = payerPublicKey;

    // Serialize the transaction
    const serializedTransaction = transaction.serialize({ requireAllSignatures: false }).toString('base64');

    console.log(`Token account creation transaction serialized: ${serializedTransaction}`);
    return associatedTokenAddress;
  } catch (error: unknown) {
    console.error(`[createTokenAccount] Error for mint ${mint.toBase58()} and payer ${payerPublicKey.toBase58()}:`, error);
    if (error instanceof Error) {
      throw new Error(`Account creation failed: ${error.message}`);
    } else {
      throw new Error('Account creation failed: Unknown error');
    }
  }
}