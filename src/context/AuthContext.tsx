import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  isVerified: boolean;
  isWalletUser: boolean;
  role: string;
  isLoading: boolean;
  login: (token: string, role: string,wallet_user: boolean,  verified_wallet: boolean) => void;
  walletConnect: (role: string) => void;
  walletVerified: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [isWalletUser, setIsWalletUser] = useState(false);
  const [role , setRole] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  // === 1. Initialize auth state from localStorage on first load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const verified = localStorage.getItem("verified");
    const wallet_user = localStorage.getItem("wallet_user");

    const role = localStorage.getItem("role");

    if (role) setRole(role);

    setIsWalletUser(wallet_user === "true");
   setIsAuthenticated(!!token);
    setIsVerified(!!verified);

    setIsLoading(false);
  }, []);

  // === 2. Listen to changes in other tabs
  useEffect(() => {
    const syncAuthState = () => {
      const token = localStorage.getItem("token");
      const verified = localStorage.getItem("verified");

      
      setIsAuthenticated(!!token);
      setIsVerified(!!verified);
    };

    window.addEventListener("storage", syncAuthState);
    return () => window.removeEventListener("storage", syncAuthState);
  }, []);

  // === 3. Normal Login (token-based)
  const login = (token: string, role: string,wallet_user: boolean, verified_wallet: boolean) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("wallet_user", wallet_user.toString());
    
    setIsAuthenticated(true);
    setRole(role);
    
    if (verified_wallet){
      setIsVerified(verified_wallet);
      localStorage.setItem("verified", verified_wallet.toString());
    }
  };

  // === 4. Wallet Connect Only
  const walletConnect = (role: string) => {
    setRole(role);
    localStorage.setItem("wallet_user", "true");
    setIsWalletUser(true);
  };

  // === 5. Wallet Verified
  const walletVerified = () => {
    localStorage.setItem("verified", "true");
    setIsVerified(true);
  };

  // === 6. Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("verified");
    localStorage.removeItem("role");
    localStorage.removeItem("user_id");
    localStorage.removeItem("wallet_user")


    setIsAuthenticated(false);
    setIsVerified(false);
    setIsWalletUser(false);
    setRole("");
  };

  console.log("is wallet", isWalletUser);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isVerified,
        isWalletUser,
        role,
        isLoading,
        login,
        walletConnect,
        walletVerified,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// === 7. Hook for easy use
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
