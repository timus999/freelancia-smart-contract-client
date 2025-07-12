import {  web3, BN } from "@coral-xyz/anchor";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import idl from "../idl/escrow.json";
import { getProgram } from "./getProgram.ts";
const PROGRAM_ID = new web3.PublicKey(idl.address);

type ResolveDisputeParams = {
  connection: web3.Connection;
  wallet: AnchorWallet;
  escrowId: number;
  maker: web3.PublicKey;
  taker: web3.PublicKey;
  takerAmountSol: number;
  makerAmountSol: number;
};

export async function resolveDispute({
  connection,
  wallet,
  escrowId,
  maker,
  taker,
  takerAmountSol,
  makerAmountSol,
}: ResolveDisputeParams) {
  if (!wallet.publicKey) throw new Error("Wallet not connected");

  const program = await getProgram(connection, wallet);
  const [escrowPda] = web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("escrow"),
      maker.toBuffer(),
      new BN(escrowId).toArrayLike(Buffer, "le", 8),
    ],
    PROGRAM_ID
  );

  const [vaultPda] = web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("vault"),
      maker.toBuffer(),
      new BN(escrowId).toArrayLike(Buffer, "le", 8),
    ],
    PROGRAM_ID
  );

  const takerAmount = new BN(Math.floor(takerAmountSol * web3.LAMPORTS_PER_SOL));
  const makerAmount = new BN(Math.floor(makerAmountSol * web3.LAMPORTS_PER_SOL));

  const ix = await program.methods
    .arbiterResolve(takerAmount, makerAmount)
    .accounts({
      arbiter: wallet.publicKey,
      maker,
      taker,
      escrow: escrowPda,
      vault: vaultPda,
      systemProgram: web3.SystemProgram.programId,
    })
    .instruction();


        const tx = new web3.Transaction().add(ix);
        tx.feePayer = wallet.publicKey;
        tx.recentBlockhash = (
          await connection.getLatestBlockhash("finalized")
        ).blockhash;
        
        const signedTx = await wallet.signTransaction(tx);
        const sig = await connection.sendRawTransaction(signedTx.serialize());
        await connection.confirmTransaction(sig, "confirmed");

    
}
