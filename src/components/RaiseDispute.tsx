import { useState } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { web3, BN } from "@coral-xyz/anchor";
import idl from "../idl/escrow.json";
import { getProgram } from "../utils/getProgram.ts";

interface Props {
  escrowId: number;
  maker: string;
  taker: string;
}

const RaiseDisputeForm = ({ escrowId, maker, taker }: Props) => {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const [evidenceHashHex, setEvidenceHashHex] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleDispute = async () => {
    if (!wallet?.publicKey) {
      return setMessage("Connect wallet first.");
    }

    if (!evidenceHashHex || evidenceHashHex.length !== 64) {
      return setMessage("Evidence hash must be a valid 32-byte (64-char hex) string.");
    }

    try {
      setLoading(true);
      setMessage(null);

      const programId = new web3.PublicKey(idl.address);
      const program = await getProgram(connection, wallet);

      const makerPubkey = new web3.PublicKey(maker);
      const [escrowPda] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from("escrow"), makerPubkey.toBuffer(), new BN(escrowId).toArrayLike(Buffer, "le", 8)],
        programId
      );

      const evidenceBuffer = Buffer.from(evidenceHashHex, "hex");
      if (evidenceBuffer.length !== 32) {
        throw new Error("Evidence hash must be exactly 32 bytes.");
      }

      const ix = await program.methods
        .raiseDispute([...evidenceBuffer]) // convert Buffer to array of u8
        .accounts({
          caller: wallet.publicKey,
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

      setMessage("Dispute raised successfully.");
    } catch (err) {
      console.error("Raise dispute error:", err);
      setMessage("Failed to raise dispute.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="text"
        placeholder="Enter 32-byte hex hash"
        className="w-full px-3 py-2 border rounded text-sm"
        value={evidenceHashHex}
        onChange={(e) => setEvidenceHashHex(e.target.value.trim())}
        maxLength={64}
      />
      <button
        onClick={handleDispute}
        disabled={loading}
        className="px-3 py-1 bg-red-500 text-white rounded disabled:opacity-50"
      >
        {loading ? "Submitting…" : "Raise Dispute"}
      </button>
      {message && <p className="text-sm text-gray-700">{message}</p>}
    </div>
  );
};

export default RaiseDisputeForm;
