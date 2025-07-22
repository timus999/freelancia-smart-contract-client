// src/hooks/useWalletAuth.ts
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "react-toastify";
import { walletLogin, walletSignup } from "../api/auth.ts";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.tsx";

export const useWalletAuth = () => {
    const navigate = useNavigate();
  const { connect, publicKey, connected, wallet } = useWallet();

  const { login, walletConnect } = useAuth();

  const handleWalletAuth = async (
    role: "freelancer" | "client",
    mode: "login" | "signup"
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

      let res;
      if (mode === "signup") {
        res = await walletSignup({ wallet_address: walletAddress, role });    
       toast.success("🎉 Wallet registered!");
    
      } else {
        res = await walletLogin({ wallet_address: walletAddress });
        toast.success("✅ Logged in with wallet!");
      }
      walletConnect(res.role);
      login(res.token, res.role, true, res.verified_wallet);
      localStorage.setItem('user_id', res.user_id);
      
      return res;
    } catch (err: any) {
      console.error("Wallet auth failed:", err);
      toast.error(err.response?.data?.message || "❌ Wallet authentication failed.");
    }
  };

  return { handleWalletAuth };
};
