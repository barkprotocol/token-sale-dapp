import { Connection, PublicKey, Transaction, sendAndConfirmTransaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Token, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';

export async function transferTokens(
  connection: Connection,
  payerAccount: PublicKey,
  recipientAccount: PublicKey,
  amount: number,
  mintAddress: string
) {
  // If mintAddress is null, it's a SOL transfer
  if (!mintAddress) {
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: payerAccount,
        toPubkey: recipientAccount,
        lamports: amount * LAMPORTS_PER_SOL
      })
    );

    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [payerAccount],
      { commitment: 'confirmed' }
    );

    return signature;
  }

  // Otherwise, it's a token transfer (e.g., USDC)
  const token = new Token(
    connection,
    new PublicKey(mintAddress),
    TOKEN_PROGRAM_ID,
    payerAccount
  );

  const payerTokenAccount = await token.getOrCreateAssociatedAccountInfo(payerAccount);
  const recipientTokenAccount = await token.getOrCreateAssociatedAccountInfo(recipientAccount);

  const transaction = new Transaction().add(
    Token.createTransferInstruction(
      TOKEN_PROGRAM_ID,TOKEN_PROGRAM_ID,
      payerTokenAccount.address,
      recipientTokenAccount.address,
      payerAccount,
      [],
      amount
    )
  );

  const signature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [payerAccount],
    { commitment: 'confirmed' }
  );

  return signature;
}

export async function createTokenAccount(
  connection: Connection,
  payer: PublicKey,
  mint: PublicKey
) {
  const associatedTokenAddress = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    mint,
    payer
  );

  const transaction = new Transaction().add(
    Token.createAssociatedTokenAccountInstruction(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      mint,
      associatedTokenAddress,
      payer,
      payer
    )
  );

  const signature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [payer],
    { commitment: 'confirmed' }
  );

  return associatedTokenAddress;
}

