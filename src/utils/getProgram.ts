import idl from "../idl/escrow.json";
import type { Escrow } from "../idl/escrowTypes.ts";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { web3, Program } from "@coral-xyz/anchor";


 export function getProgram(
  connection: web3.Connection,
  wallet: AnchorWallet
): Promise<Program<Escrow>> {
  if (!wallet) {
    throw new Error("Wallet not connected");
  }

    if (!connection) { 
    throw new Error("Connection not established");
  }
    if (!idl || !idl.address) {
    throw new Error("IDL or program address not found");
    }

    // Create and return the program instance
 
    return Promise.resolve(new Program<Escrow>(idl as Escrow, { connection, wallet }));

}