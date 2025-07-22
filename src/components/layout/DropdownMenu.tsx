import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.tsx";
import { Switch } from "@/components/ui/switch.tsx";


import {
  User,
  LayoutDashboard,
  Sun,
  Moon,
  Wallet,
  TrendingUp,
  Settings,
  LogOut,
  AlertTriangle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext.tsx";
import { useWallet } from "@solana/wallet-adapter-react";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/components/theme-provider.tsx"



export default function Dropdown({ username }: any){
  const { setTheme } = useTheme()
  const [dark, setDark] = useState(false);

    const navigate = useNavigate();
      const { disconnect, connected } = useWallet();
  const { logout: authLogout, isVerified, role, isWalletUser } = useAuth();

  const [online, setOnline] = useState(true);
  
  const handleLogout = async () => {
    try {
      if (connected) {
        await disconnect();
      }
      authLogout();
      toast.success("👋 Logged out successfully!");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("❌ Failed to logout.");
    }
  };

    return (
        <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarFallback>{username.toUpperCase()[0]}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="px-3 py-2 space-y-0.5">
                    <p className="text-sm font-medium leading-none">
                      {username}
                    </p>
                    <p className="text-xs text-muted-foreground">{role}</p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-sm text-muted-foreground">
                        Online for messages
                      </span>
                      <Switch checked={online} onCheckedChange={setOnline} />
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  {isWalletUser ? (
                    isVerified ? (
                      <DropdownMenuItem disabled>
                        <Sun className="mr-2 h-4 w-4" /> Verified ✅
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        onClick={() => navigate("/wallet")}
                        className="text-red-600"
                      >
                        <AlertTriangle className="mr-2 h-4 w-4 text-red-600" />
                        Verify Wallet
                      </DropdownMenuItem>
                    )
                  ) : (
                    <DropdownMenuItem
                      onClick={() => navigate("/wallet")}
                      className="text-purple-900"
                    >
                      <Wallet className="mr-2 h-4 w-4 text-purple-900" />{" "}
                      Connect Wallet
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    {" "}
                    <User className="mr-2 h-4 w-4" /> Your profile{" "}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    {" "}
                    <TrendingUp className="mr-2 h-4 w-4" /> Stats and trends{" "}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    {" "}
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Membership plan{" "}
                  </DropdownMenuItem>
                  { dark ? (  
                  <DropdownMenuItem onClick={() => {
                    setTheme("light");
                    setDark(false);
                  }}>
                    {" "}
                    <Sun className="mr-2 h-4 w-4" /> Light Mode{" "}
                  </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={() => {
                      setTheme("dark");
                      setDark(true);
                    }}>
                    {" "}
                    <Moon className="mr-2 h-4 w-4" /> Dark Mode{" "}
                  </DropdownMenuItem>
                  )
                }
                  <DropdownMenuItem>
                    {" "}
                    <Settings className="mr-2 h-4 w-4" /> Account settings{" "}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    {" "}
                    <LogOut className="mr-2 h-4 w-4" /> Log out{" "}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
    )
}