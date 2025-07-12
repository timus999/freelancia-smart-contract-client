import { useState } from "react";
import { web3, BN } from "@coral-xyz/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";

import { getProgram } from "../utils/getProgram.ts";

interface Props {
  escrowId: number;
  maker: string;
}

const RequestRevisionForm = ({ escrowId, maker }: Props) => {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleRequest = async () => {
    if (!wallet?.publicKey) {
      return setMessage("Connect wallet first.");
    }

    try {
      setLoading(true);
      setMessage(null);

      const program = await getProgram(connection, wallet);

      const makerPubkey = new web3.PublicKey(maker);
      const [escrowPda] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from("escrow"), makerPubkey.toBuffer(), new BN(escrowId).toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      const ix = await program.methods
        .requestRevision()
        .accounts({
          maker: makerPubkey,
          escrow: escrowPda,
        })
        .instruction();

        const tx = new web3.Transaction().add(ix);
        tx.feePayer = makerPubkey;
        tx.recentBlockhash = (
          await connection.getLatestBlockhash("finalized")
        ).blockhash;
        
        const signedTx = await wallet.signTransaction(tx);
        const sig = await connection.sendRawTransaction(signedTx.serialize());
        await connection.confirmTransaction(sig, "confirmed");


      setMessage("Revision request sent successfully.");
    } catch (err) {
      console.error("Request revision error:", err);
      setMessage("Failed to request revision.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2 space-y-2">
      <button
        onClick={handleRequest}
        disabled={loading}
        className="w-full px-3 py-1 bg-yellow-500 text-white rounded disabled:opacity-50"
      >
        {loading ? "Requesting…" : "Request Revision"}
      </button>
      {message && <p className="text-sm text-gray-700">{message}</p>}
    </div>
  );
};

export default RequestRevisionForm;
