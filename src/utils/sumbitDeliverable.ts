// utils/submitWork.ts
import { BN, web3, Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import type { AnchorWallet } from "@solana/wallet-adapter-react";
import idl from "@/idl/escrow.json";
import type { Escrow } from "@/idl/escrowTypes.ts";
import { hash } from "./escrow.ts";

const PROGRAM_ID = new PublicKey(idl.address);

export async function submitEscrowDeliverable({
  connection,
  wallet,
  escrowId,
  maker,
  cid,
}: {
  connection: web3.Connection;
  wallet: AnchorWallet;
  escrowId: number;
  maker: string;
  cid: string | Uint8Array;
}) {
  if (!wallet?.publicKey) throw new Error("Wallet not connected");

  const program = new Program<Escrow>(idl as Escrow, { connection, wallet });

  // Validate hash
  const deliverableHash =await hash(cid);
  if (deliverableHash.length !== 32) {
    throw new Error("Deliverable hash must be exactly 32 bytes");
  }

  const makerKey = new PublicKey(maker);
  const escrowIdBN = new BN(escrowId);

  const [escrowPda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("escrow"),
      makerKey.toBuffer(),
      escrowIdBN.toArrayLike(Buffer, "le", 8),
    ],
    PROGRAM_ID
  );

  const takerPubkey = wallet.publicKey;

  const ix = await program.methods
    .submitWork(Array.from(deliverableHash))
    .accounts({
      taker: takerPubkey,
      escrow: escrowPda,
    })
    .instruction();

  const tx = new web3.Transaction().add(ix);
  tx.feePayer = takerPubkey;
  tx.recentBlockhash = (
    await connection.getLatestBlockhash("finalized")
  ).blockhash;

  const signedTx = await wallet.signTransaction(tx);
  const sig = await connection.sendRawTransaction(signedTx.serialize());
  await connection.confirmTransaction(sig, "confirmed");

  return sig;
}
