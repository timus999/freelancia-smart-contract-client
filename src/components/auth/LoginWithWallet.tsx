import { useWalletAuth } from "@/api/walletAuth.ts"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

import { Button } from "@/components/ui/button.tsx";
import { useAuth } from "@/context/AuthContext.tsx";



export default function LoginWithWallet(){
  const { handleWalletAuth } = useWalletAuth();
  const { walletConnect } = useAuth();

  // if (!wallet || !connected) {
  //   return (
  //   <div className="w-full max-w-sm mx-auto"> 
  //   <WalletMultiButton style={{ width: "100%", justifyContent: "center", height: "38px" , borderRadius: "8px"}}/>
  //   </div>
  //   )
  // }

  return (
    <>
    <div className="w-full max-w-sm mx-auto"> 
    <WalletMultiButton style={{ width: "100%", justifyContent: "center" , height: "38px" , borderRadius: "8px"}}/>
    </div>
    <Button
      className="w-full bg-purple-900 hover:black text-white font-bold p-4"
      onClick={() =>{ 
        handleWalletAuth("freelancer", "login");
        walletConnect("wallet_user");
      }
      }
    >
      Login with Wallet
    </Button>
    </>
  );

  
}