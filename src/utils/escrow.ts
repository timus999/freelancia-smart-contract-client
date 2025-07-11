import { Buffer } from "buffer";
(window as any).Buffer = Buffer;
import {
  AnchorProvider,
  setProvider,
  BN,
  Program,
  utils,
  web3,
  type Idl,
} from "@coral-xyz/anchor";
import idl from "../idl/escrow.json";
import type { Escrow } from "../idl/escrowTypes.ts";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import {
  Connection,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
// const sha256_1 = require("@noble/hashes/sha256");
import { sha256 } from "@noble/hashes/sha256";

export const PROGRAM_ID = new web3.PublicKey(idl.address);

/* ---------- Derive the escrow PDA ---------- */
export const deriveEscrowPda = (
  maker: web3.PublicKey,
  escrowId: BN
): [web3.PublicKey, number] =>
  web3.PublicKey.findProgramAddressSync(
    [
      utils.bytes.utf8.encode("escrow"),
      maker.toBuffer(),
      escrowId.toArrayLike(Buffer, "le", 8),
    ],
    PROGRAM_ID
  );

export function hash(data: Uint8Array | string): Uint8Array {
  const bytes =
    typeof data === "string" ? new TextEncoder().encode(data) : data;

  return sha256(bytes);
}

interface CreateEscrowParams {
  connection: web3.Connection;
  wallet: AnchorWallet;
  escrowId: number | bigint; // human‑friendly
  amountSol: number;
  takerPk: string; // freelancer address
  deadline: number; // UNIX seconds
  autoReleaseAt: number; // UNIX seconds ≥ deadline
  spec: string | Uint8Array; // SOW text or hashable blob
  arbiterPk?: string | null; // optional
}

/* ---------- Main tx helper ---------- */
export async function createEscrow({
  connection,
  wallet,
  escrowId,
  amountSol,
  takerPk,
  deadline,
  autoReleaseAt,
  spec,
  arbiterPk = null,
}: CreateEscrowParams): Promise<web3.PublicKey> {
  try {
    // Validate inputs
    if (!wallet || !wallet.publicKey || !wallet.signTransaction) {
      throw new Error("Wallet not connected or signing not supported");
    }
    if (amountSol <= 0) {
      throw new Error("Amount must be positive");
    }

    const now = Math.floor(Date.now() / 1_000);
    if (deadline <= now) throw new Error("Deadline must be in the future");
    if (autoReleaseAt < deadline)
      throw new Error("autoReleaseAt must be ≥ deadline");

    // let taker;
    // try {
    //   taker = new web3.PublicKey(takerPk);
    //   if (!web3.PublicKey.isOnCurve(taker)) {
    //     throw new Error("Invalid taker public key");
    //   }
    // } catch {
    //   throw new Error("Invalid taker public key format");
    // }
    /* ---------- taker pubkey (real or placeholder) ---------- */
    // const taker = // 🔹 add this block
    //   takerPk && takerPk.trim().length > 0
    //     ? new web3.PublicKey(takerPk) // real freelancer
    //     : web3.PublicKey.default; // all‑zero placeholder
    
    // console.log("Taker public key:", taker.toBase58());
    const taker = wallet?.publicKey;
if (!taker) throw new Error("Wallet not connected");
    const arbiter =
      arbiterPk && arbiterPk.trim().length > 0
        ? new web3.PublicKey(arbiterPk)
        : null;

    // Set up provider
    const provider = new AnchorProvider(connection, wallet, {
      commitment: "confirmed",
    });
    setProvider(provider);


    // Initialize program
    const program = new Program<Escrow>(idl as Escrow, { connection, wallet });

    /* ---------- Convert numeric inputs ---------- */
    const escrowIdBn = new BN(escrowId.toString()); // supports bigint
    const amountLamports = new BN(amountSol * web3.LAMPORTS_PER_SOL);
    const deadlineBn = new BN(deadline);
    const autoReleaseBn = new BN(autoReleaseAt);

    const specHash = hash(spec);
    if (specHash.length !== 32)
      throw new Error("specHash must be exactly 32 bytes");

    /* ---------- Derive PDA ---------- */
    const [escrowPda] = deriveEscrowPda(wallet.publicKey, escrowIdBn);

    /* ---------- Build instruction ---------- */
    const ix = await program.methods
      .createEscrow(
        escrowIdBn,
        amountLamports,
        deadlineBn,
        autoReleaseBn,
        Array.from(specHash), // anchor accepts number[32]
        arbiter // null OK (Option<Pubkey>)
      )
      .accounts({
        maker: wallet.publicKey,
        taker,
        escrow: escrowPda,
        systemProgram: web3.SystemProgram.programId,
      })
      .instruction();

    /* ---------- Send transaction ---------- */
    const tx = new web3.Transaction().add(ix);
    tx.feePayer = wallet.publicKey;
    tx.recentBlockhash = (
      await connection.getLatestBlockhash("confirmed")
    ).blockhash;

    const signedTx = await wallet.signTransaction(tx);
    const sig = await connection.sendRawTransaction(signedTx.serialize());
    await connection.confirmTransaction(sig, "confirmed");

    console.log("✅ escrow created:", sig);
    return escrowPda;
  } catch (error) {
    console.error("Failed to create escrow:", error);
    throw new Error(`Escrow creation failed: ${error.message}`);
  }
}
