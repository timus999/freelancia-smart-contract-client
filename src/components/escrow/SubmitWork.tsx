// components/SubmitWorkForm.tsx
import { useState } from "react";
import { BN, web3 } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { hash } from "../../utils/escrow.ts"; // Adjust the import path as needed
import { Program } from "@coral-xyz/anchor";
import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import { Escrow } from "../../idl/escrowTypes.ts"; // Adjust the import path as needed
import idl from "../../idl/escrow.json"; // Adjust the import path as needed




export default function SubmitWorkForm({  escrowId, maker }: {
  escrowId: number,
  maker: PublicKey,
}) {

    const { connection } = useConnection();
    const  wallet  = useAnchorWallet();
  const program = new Program<Escrow>(idl as Escrow, {connection, wallet});


  const [deliverable, setDeliverable] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const deliverableHash = hash(deliverable);
      const escrowIdBN = new BN(escrowId);

      const [escrowPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("escrow"),
          maker.toBuffer(),
          escrowIdBN.toArrayLike(Buffer, "le", 8),
        ],
        program.programId
      );

    //   await program.methods
    //     .submitWork(Array.from(deliverableHash))
    //     .accounts({
    //       taker: program.provider.wallet.publicKey,
    //       escrow: escrowPda,
    //     })
    //     .rpc();
  const takerPubkey = wallet?.publicKey;
if (!takerPubkey) throw new Error("Wallet not connected");

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

      setSuccess(true);
      setDeliverable("");
    } catch (err: any) {
      console.error("Submit work error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        className="w-full border p-2 text-sm rounded"
        rows={3}
        placeholder="Enter your deliverable (hash or summary)"
        value={deliverable}
        onChange={(e) => setDeliverable(e.target.value)}
        required
      />
      <button
        type="submit"
        className="px-3 py-1 bg-green-600 text-white rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit Work"}
      </button>
      {success && <p className="text-green-600 text-sm">Work submitted successfully!</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  );
}
