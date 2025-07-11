import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import type { PropsWithChildren } from "react";

const endpoint = "http://127.0.0.1:8899";          // local validator
const wallets  = [new PhantomWalletAdapter()];

interface ProvidersProps extends PropsWithChildren {}

export default function Providers({ children }: ProvidersProps ) {
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        {children}
      </WalletProvider>
    </ConnectionProvider>
  );
}
