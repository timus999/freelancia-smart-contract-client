import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useAuth } from "@/context/AuthContext.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import Spinner from "@/components/ui/spinner.tsx";
import { useWalletVerify } from "@/api/verifyWallet.ts";
import { useWalletConnect } from "@/api/walletConnect.ts";
import {
  Wallet,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

export default function ConnectWallet() {
  const { handleWalletConnect } = useWalletConnect();
  const { handleWalletVerify } = useWalletVerify();
  const { isVerified, walletConnect, isWalletUser} = useAuth();
  const role = localStorage.getItem("role");

  if (role !== "client" && role !== "freelancer") {
    toast.info("Already connected and verified!!!");
    return <Spinner />;
  }

  return (
            <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
    <div className="flex items-center justify-center bg-muted px-4 py-14">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <Wallet className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-semibold">
            Connect Your Wallet
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="flex flex-col gap-2 items-center">
            <WalletMultiButton
              style={{
                width: "100%",
                justifyContent: "center",
                height: "40px",
                borderRadius: "8px",
              }}
            />
            <Button
              className="w-full gap-2 bg-primary hover:bg-primary/90 text-white"
              onClick={() => {
                handleWalletConnect(role);
                walletConnect(role);
              }}
            >
              <ArrowRight className="h-4 w-4" />
              Connect with Wallet
            </Button>
          </div>

          <Separator />
          {isVerified  ? (
            <div className="flex items-center justify-between p-2 border rounded-lg text-green-600 bg-green-50">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>Your wallet is verified</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center justify-between p-2 border rounded-lg text-yellow-700 bg-yellow-50 w-full">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Wallet not verified</span>
                </div>
              </div>
              <Button
                className="w-full gap-2 bg-yellow-600 hover:bg-yellow-700 text-white"
                onClick={() => {
                  handleWalletVerify();
                }}
              >
                <ShieldCheck className="h-4 w-4" />
                Verify Wallet
              </Button>
            </div>
          )}
        
          
        </CardContent>
      </Card>
    </div>
    </motion.div>
  );
}
