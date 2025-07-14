// components/CancelBeforeStartButton.tsx
import { BN, web3 } from "@coral-xyz/anchor";
import {
  useAnchorWallet,
  useConnection,
} from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { getProgram } from "../utils/getProgram.ts";

type Props = {
  escrowId: number;
  maker: string;
  onSuccess: () => void;
};

export default function CancelBeforeStartButton({
  escrowId,
  maker,
  onSuccess,
}: Props) {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();

  const handleCancel = async () => {
    if (!wallet) return alert("Wallet not connected");

    try {
      const program = await getProgram(connection, wallet);
      const makerPk = new PublicKey(maker);
      const escrowIdBytes = new BN(escrowId).toArrayLike(Uint8Array, "le", 8);

      const escrowPda = PublicKey.findProgramAddressSync(
        [Buffer.from("escrow"), makerPk.toBuffer(), escrowIdBytes],
        program.programId
      )[0];

      const vaultPda = PublicKey.findProgramAddressSync(
        [Buffer.from("vault"), makerPk.toBuffer(), escrowIdBytes],
        program.programId
      )[0];

      const ix = await program.methods
        .cancelBeforeStart()
        .accounts({
          maker: makerPk,
          escrow: escrowPda,
          vault: vaultPda,
          systemProgram: SystemProgram.programId,
        })
        .instruction();

      const tx = new Transaction().add(ix);
      tx.feePayer = wallet.publicKey!;
      tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

      const signed = await wallet.signTransaction(tx);
      const sig = await connection.sendRawTransaction(signed.serialize());
      await connection.confirmTransaction(sig, "confirmed");

      alert("Escrow canceled before work started!");
      onSuccess();
    } catch (err: any) {
      console.error("Cancel error:", err);
      alert("Cancel failed: " + err.message);
    }
  };

  return (
    <button
      onClick={handleCancel}
      className="w-full py-1 mt-2 bg-red-500 text-white rounded"
    >
      Cancel Before Start
    </button>
  );
}
