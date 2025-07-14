// components/ClaimTimeoutForm.tsx
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { BN, web3 } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { getProgram } from "../utils/getProgram.ts";

export default function ClaimTimeoutForm({ escrowId, maker }: { escrowId: number; maker: string }) {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();

  const handleClaim = async () => {
    if (!wallet) return alert("Wallet not connected");

    try {
      const program = await getProgram(connection, wallet);
      const makerKey = new PublicKey(maker);
      const claimant = wallet.publicKey;

      const escrowIdBytes = new BN(escrowId).toArrayLike(Uint8Array, "le", 8);

      const escrowPda = PublicKey.findProgramAddressSync(
        [Buffer.from("escrow"), makerKey.toBuffer(), escrowIdBytes],
        program.programId
      )[0];

      const vaultPda = PublicKey.findProgramAddressSync(
        [Buffer.from("vault"), makerKey.toBuffer(), escrowIdBytes],
        program.programId
      )[0];

      const ix = await program.methods
        .claimTimeout()
        .accounts({
          claimant,
          escrow: escrowPda,
          vault: vaultPda,
          systemProgram: SystemProgram.programId,
        })
        .instruction();

      const tx = new Transaction().add(ix);
      tx.feePayer = claimant;
      tx.recentBlockhash = (await connection.getLatestBlockhash("finalized")).blockhash;

      const signedTx = await wallet.signTransaction(tx);
      const sig = await connection.sendRawTransaction(signedTx.serialize());
      await connection.confirmTransaction(sig, "confirmed");

      alert("Claimed via timeout! Tx: " + sig);
    } catch (err: any) {
      console.error("Claim timeout error:", err);
      alert("Claim failed: " + (err.message || err));
    }
  };

  return (
    <button
      onClick={handleClaim}
      className="w-full mt-2 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded"
    >
      Claim Timeout
    </button>
  );
}
