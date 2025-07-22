// src/types/phantom.d.ts
import { PublicKey } from "@solana/web3.js";

interface PhantomProvider {
  isPhantom: boolean;
  publicKey: PublicKey;
  isConnected?: boolean;
  connect: () => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  signMessage: (
    message: Uint8Array,
    display: "utf8" | "hex"
  ) => Promise<{ signature: Uint8Array }>;
}

interface Window {
  solana?: PhantomProvider;
}
