import React, { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { clusterApiUrl } from "@solana/web3.js";

import type { PropsWithChildren } from "react";

import "@solana/wallet-adapter-react-ui/styles.css";

interface ProvidersProps extends PropsWithChildren {}

const endpoint = "http://127.0.0.1:8899"; // local validator

export const WalletContextProvider = ({ children }: ProvidersProps) => {
  //   const network = "devnet"; // or "mainnet-beta"
  //   const endpoint = clusterApiUrl(network);

  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
