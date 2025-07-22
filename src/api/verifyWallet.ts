// src/api/useWalletAuth.ts
import { useWallet } from "@solana/wallet-adapter-react";
import bs58 from "bs58";
import { requestNonce, walletVerify } from "./auth.ts";
import { useAuth } from "@/context/AuthContext.tsx";
import { toast } from "react-toastify";

export function useWalletVerify() {
  const { publicKey, signMessage, connect, connected } = useWallet();
  const { walletVerified } = useAuth();

  const handleWalletVerify = async () => {
    try {
      if (!connected) await connect();

      if (!publicKey || !signMessage) {
        throw new Error("Wallet not ready");
      }

      const walletAddress = publicKey.toBase58();

      // 1. Get nonce from backend
      const  data  = await requestNonce({ wallet_address: walletAddress });
      const nonce = data.nonce;

      // 2. Prepare message
      const rawMessage = `Welcome to Freelancia!\n\nWallet: ${walletAddress}\nNonce: ${nonce}\n\nSign this message to authenticate.`;
      const length = Array.from(rawMessage).length;
      const formattedMessage = `\x18Solana Signed Message:\n${length}${rawMessage}`;
      const encodedMessage = new TextEncoder().encode(formattedMessage);

      // 3. Sign
      const signature = await signMessage(encodedMessage);
      const signatureBase58 = bs58.encode(signature);

      // 4. Verify with backend
      const verifyRes = await walletVerify({
        wallet_address: walletAddress,
        nonce,
        signature: signatureBase58,
      });

      const token = verifyRes.token;

      if (!token) throw new Error("Invalid token from backend");

      // 5. Sync to AuthContext and localStorage
      walletVerified();
      return true;
    } catch (err: any) {
      toast.error(err.message);
      console.error("❌ Wallet auth failed:", err.response?.data || err.message);
      return false;
    }
  };

  return { handleWalletVerify };
}
