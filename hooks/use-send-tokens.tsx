// IMPORTANT: This implementation uses a placeholder for secure key management.
// In a real production environment, never expose private keys in your code.
// Use a proper key management system as demonstrated by the `getSecureKeypair` function.
import { useState } from "react";
import { Keypair, PublicKey, sendAndConfirmTransaction, Transaction, TransactionExpiredBlockheightExceededError } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, createTransferInstruction } from "@solana/spl-token";
import { useConnection } from "@solana/wallet-adapter-react";
import { TOKEN_SALE_CONFIG } from "@/config/token-sale";
import { getSecureKeypair } from '@/lib/secure-key-management';

const MINT_ADDRESS = TOKEN_SALE_CONFIG.barkTokenMint;

// In a production environment, use a secure key management system
// This could be a hardware security module (HSM), a key management service (KMS),
// or a secure enclave, depending on your security requirements and infrastructure
const getFromKeypair = async () => {
    return await getSecureKeypair('BARK_TOKEN_AUTHORITY');
};

const useSendTokens = () => {
    const { connection } = useConnection();
    const [isOpen, setIsOpen] = useState(false);
    const [transactionUrl, setTransactionUrl] = useState("");
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const sendTokens = async (TRANSFER_AMOUNT: number, DESTINATION_WALLET: PublicKey) => {
        setLoading(true);
        try {
            const FROM_KEYPAIR = await getFromKeypair();
            const [sourceAccount, destinationAccount] = await Promise.all([
                getOrCreateAssociatedTokenAccount(connection, FROM_KEYPAIR, new PublicKey(MINT_ADDRESS), FROM_KEYPAIR.publicKey),
                getOrCreateAssociatedTokenAccount(connection, FROM_KEYPAIR, new PublicKey(MINT_ADDRESS), DESTINATION_WALLET),
            ]);

            const latestBlockHash = await connection.getLatestBlockhash("confirmed");

            const sendTransaction = async () => {
                const tx = new Transaction();
                tx.add(createTransferInstruction(
                    sourceAccount.address,
                    destinationAccount.address,
                    FROM_KEYPAIR.publicKey,
                    TRANSFER_AMOUNT * Math.pow(10, TOKEN_SALE_CONFIG.barkTokenDecimals)
                ));
                tx.recentBlockhash = latestBlockHash.blockhash;
                tx.feePayer = FROM_KEYPAIR.publicKey;

                try {
                    const signature = await sendAndConfirmTransaction(connection, tx, [FROM_KEYPAIR]);
                    return signature;
                } catch (error) {
                    console.error("Transaction failed:", error);
                    throw error;
                }
            };

            let signature;
            try {
                signature = await sendTransaction();
            } catch (error) {
                if (error instanceof TransactionExpiredBlockheightExceededError) {
                    console.log("Transaction expired, retrying...");
                    signature = await sendTransaction();
                } else {
                    throw error;
                }
            }

            setLoading(false);
            setIsOpen(true);
            setTransactionUrl(`https://explorer.solana.com/tx/${signature}`);
            setSuccess(true);
        } catch (error) {
            console.error(error);
            setLoading(false);
            setIsOpen(true);
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("An unknown error occurred");
            }
        }
    };

    return {
        sendTokens,
        loading,
        isOpen,
        errorMessage,
        success,
        setIsOpen,
        transactionUrl,
    };
};

export default useSendTokens;