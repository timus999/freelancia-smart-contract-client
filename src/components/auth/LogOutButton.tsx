import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button.tsx";
import { logout } from "@/api/auth.ts";
import { useAuth } from "@/context/AuthContext.tsx";
import { Navigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();
  const { disconnect, connected } = useWallet();
  const { logout: authLogout } = useAuth();

  const handleLogout = async () => {
    try {

      if (connected) 
        {
          await disconnect();
          authLogout();
          toast.success("Wallet logged out successfully!");
            localStorage.removeItem("token");

      localStorage.removeItem("user");
          return <Navigate to="/" replace />;
        }
      // Clear JWT token
      await logout();
      localStorage.removeItem("token");

      localStorage.removeItem("user");
      authLogout();

      // Disconnect Phantom wallet if connected

      toast.success("👋 Logged out successfully!");

      // Redirect to login or refresh page
       return <Navigate to="/" replace />;
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("❌ Failed to logout.");
    }
  };

};

export default LogoutButton;
