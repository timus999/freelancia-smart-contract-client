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
  maker: PublicKey, // 👈 accept PublicKey instead of AnchorWallet
  escrowIdNum: number | bigint
) {
  // Derive PDA using maker public key and escrowId
  const escrowId = new BN(escrowIdNum.toString());
  const [escrowPda] = deriveEscrowPda(maker, escrowId);

  // Initialize program (read-only)
  const program = new Program<Escrow>(idl as Escrow, { connection });

  const escrowData = await program.account.escrow.fetch(escrowPda);

  return {
    publicKey: escrowPda,
    escrowId: escrowData.escrowId.toNumber(),

    maker: new PublicKey(escrowData.maker).toBase58(),
    taker: new PublicKey(escrowData.taker).toBase58(),

    createdAt: escrowData.createdAt.toNumber(),
    status: escrowData.status,
    amountTotal: escrowData.amountTotal.toNumber() / LAMPORTS_PER_SOL,
    amountReleased: escrowData.amountReleased.toNumber() / LAMPORTS_PER_SOL,
    deadline: escrowData.deadline.toNumber(),
    autoReleaseAt: escrowData.autoReleaseAt.toNumber(),

    arbiter: escrowData.arbiter ? escrowData.arbiter.toBase58() : null,

    specHash: Buffer.from(escrowData.specHash).toString("hex"),
    deliverableHash: Buffer.from(escrowData.deliverableHash).toString("hex"),
    completedAt: escrowData.completedAt.toNumber(),
  };
}
