// utils/escrow.ts
import { PublicKey } from "@solana/web3.js";
import {
  Program,
  BN,
  web3,
} from "@coral-xyz/anchor";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import idl from "../idl/escrow.json";
import type { Escrow } from "../idl/escrowTypes.ts";
import { deriveEscrowPda } from "./escrow.ts";
const PROGRAM_ID = new web3.PublicKey(idl.address);

const LAMPORTS_PER_SOL = web3.LAMPORTS_PER_SOL;

export async function getEscrowData(
  connection: web3.Connection,
  wallet: AnchorWallet,
  escrowIdNum: number | bigint
) {

    if (!wallet?.publicKey) throw new Error("Wallet not connected");

     /* ---------- PDA ---------- */
const escrowId = new BN(escrowIdNum.toString());
  // 1. Find the PDA for the escrow account
  const [escrowPda] = deriveEscrowPda(wallet.publicKey, escrowId);

  const program = new Program<Escrow>(idl as Escrow, { connection, wallet });
  const escrowData = await program.account.escrow.fetch(escrowPda);

 return {
  publicKey: escrowPda,
  escrowId: escrowData.escrowId.toNumber(),

  // Convert PublicKey or Uint8Array to base58 string
  maker: escrowData.maker.toBase58 ? escrowData.maker.toBase58() : new PublicKey(escrowData.maker).toBase58(),
  taker: escrowData.taker.toBase58 ? escrowData.taker.toBase58() : new PublicKey(escrowData.taker).toBase58(),

  status: escrowData.status,
  amountTotal: escrowData.amountTotal.toNumber() / LAMPORTS_PER_SOL,
  amountReleased: escrowData.amountReleased.toNumber() / LAMPORTS_PER_SOL,
  deadline: escrowData.deadline.toNumber(),
  autoReleaseAt: escrowData.autoReleaseAt.toNumber(),

  // Spec hash as lowercase hex string
  specHash: Buffer.from(escrowData.specHash).toString("hex"),
};

}