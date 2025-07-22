// src/hooks/useWalletAuth.ts
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "react-toastify";
import { walletConnect } from "../api/auth.ts";
import { useAuth } from "@/context/AuthContext.tsx";

export const useWalletConnect = () => {
  const { connect, publicKey, connected, wallet } = useWallet();

  const {  walletConnect: walletUser } = useAuth();

  const handleWalletConnect = async (
    role: "freelancer" | "client"
  ) => {
    try {
      if (!connected) {
        if (!wallet) {
          toast.error("Please select a wallet first.");
          return;
        }
        await connect();
      }

      if (!publicKey) {
        toast.error("Wallet not connected.");
        return;
      }

      const walletAddress = publicKey.toBase58();
        const res = await walletConnect({wallet_address: walletAddress});
        walletUser(role);
        toast.success("✅ Connected with wallet!");
      return res;
    } catch (err: any) {
      console.error("Wallet auth failed:", err);
      toast.error(err.response?.data?.message || "❌ Wallet authentication failed.");
    }
  };

  return { handleWalletConnect };
};
