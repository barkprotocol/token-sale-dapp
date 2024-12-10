import {
  Connection,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Keypair,
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
const TRANSACTION_OPTIONS = { commitment: 'confirmed' };

export async function transferTokens(
  connection: Connection,
  payerKeypair: Keypair,
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
      const lamports = amount * LAMPORTS_PER_SOL;
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: payerKeypair.publicKey,
          toPubkey: recipientAccount,
          lamports,
        })
      );
    } else if (currency === 'USDC') {
      // Convert amount to smallest unit (USDC uses 6 decimals)
      const amountInSmallestUnit = amount * Math.pow(10, 6); // 6 decimals for USDC
      const fromTokenAccount = await getAssociatedTokenAddress(USDC_MINT, payerKeypair.publicKey);
      const toTokenAccount = await getAssociatedTokenAddress(USDC_MINT, recipientAccount);

      // Check if the recipient's token account exists
      const receiverAccount = await getAccount(connection, toTokenAccount).catch(() => null);

      if (!receiverAccount) {
        transaction.add(
          createAssociatedTokenAccountInstruction(
            payerKeypair.publicKey,
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
          payerKeypair.publicKey,
          amountInSmallestUnit,
          [],
          TOKEN_PROGRAM_ID
        )
      );
    } else {
      throw new Error('Unsupported currency');
    }

    // Send the transaction
    const signature = await sendAndConfirmTransaction(connection, transaction, [payerKeypair], TRANSACTION_OPTIONS);
    console.log(`Transaction successful: ${signature}`);
    return signature;
  } catch (error) {
    console.error('Error in transferTokens:', error);
    throw new Error(`Transfer failed: ${error.message}`);
  }
}

export async function mintBARKTokens(
  connection: Connection,
  mintAuthorityKeypair: Keypair,
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
        mintAuthorityKeypair.publicKey,
        amountInSmallestUnit,
        [],
        TOKEN_PROGRAM_ID
      )
    );

    const signature = await sendAndConfirmTransaction(connection, transaction, [mintAuthorityKeypair], TRANSACTION_OPTIONS);
    console.log(`BARK Tokens minted: ${signature}`);
    return signature;
  } catch (error) {
    console.error('Error in mintBARKTokens:', error);
    throw new Error(`Minting failed: ${error.message}`);
  }
}

export async function createTokenAccount(
  connection: Connection,
  payerKeypair: Keypair,
  mint: PublicKey
): Promise<PublicKey> {
  try {
    const associatedTokenAddress = await getAssociatedTokenAddress(mint, payerKeypair.publicKey);

    // Check if the token account already exists
    const existingAccount = await getAccount(connection, associatedTokenAddress).catch(() => null);

    if (existingAccount) {
      console.log(`Token account already exists: ${associatedTokenAddress.toBase58()}`);
      return associatedTokenAddress;
    }

    const transaction = new Transaction().add(
      createAssociatedTokenAccountInstruction(
        payerKeypair.publicKey,
        associatedTokenAddress,
        payerKeypair.publicKey,
        mint
      )
    );

    await sendAndConfirmTransaction(connection, transaction, [payerKeypair], TRANSACTION_OPTIONS);

    console.log(`Token account created: ${associatedTokenAddress.toBase58()}`);
    return associatedTokenAddress;
  } catch (error) {
    console.error(`[createTokenAccount] Error for mint ${mint.toBase58()} and payer ${payerKeypair.publicKey.toBase58()}:`, error);
    throw new Error(`Account creation failed: ${error.message}`);
  }
}
