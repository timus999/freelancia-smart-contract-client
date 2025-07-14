// components/EscrowApprover.tsx
import { useEffect, useState, useCallback } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { BN, web3 } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { getEscrowData } from "../utils/fetchEscrow.ts";
import { getProgram } from "../utils/getProgram.ts";
import RequestRevisionForm from "./RequestReview.tsx";
import CancelBeforeStartButton from "./CancelEscrow.tsx";

const statusLabel = (s: number) =>
  ["Active", "Submitted", "Completed", "Disputed", "Cancelled"][s] ?? "Unknown";

export default function EscrowApprover() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const [escrows, setEscrows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEscrows = useCallback(async () => {
    if (!wallet) return;
    setLoading(true);
    const fetched: any[] = [];
    try {
      for (let id = 0; id < 40; id++) {
        try {
          const e = await getEscrowData(connection, wallet, id);
          if (e.maker === wallet.publicKey?.toBase58()) {
            fetched.push(e);
          }
        } catch {}
      }
      setEscrows(fetched);
    } catch (err) {
      console.error("Error fetching escrows:", err);
    } finally {
      setLoading(false);
    }
  }, [wallet, connection]);

  useEffect(() => {
    fetchEscrows();
  }, [fetchEscrows]);

  const handleApprove = async (escrow: any) => {
    if (!wallet) return alert("Wallet not connected");
    if (escrow.status !== 1) return alert("Escrow is not in 'Submitted' state");

    if (escrow.specHash !== escrow.deliverableHash) {
      alert(
        "Deliverable does not match the spec hash \n Do you want to approve anyway?"
      );
    }
    try {
      const program = await getProgram(connection, wallet);

      const maker = wallet.publicKey;
      const taker = new PublicKey(escrow.taker);
      const escrowIdBytes = new BN(escrow.escrowId).toArrayLike(
        Uint8Array,
        "le",
        8
      );

      const escrowPda = PublicKey.findProgramAddressSync(
        [Buffer.from("escrow"), maker.toBuffer(), escrowIdBytes],
        program.programId
      )[0];

      const vaultPda = PublicKey.findProgramAddressSync(
        [Buffer.from("vault"), maker.toBuffer(), escrowIdBytes],
        program.programId
      )[0];

      const ix = await program.methods
        .approveWork()
        .accounts({
          maker,
          taker,
          escrow: escrowPda,
          vault: vaultPda,
          systemProgram: SystemProgram.programId,
        })
        .instruction();

      const tx = new web3.Transaction().add(ix);
      tx.feePayer = maker;
      tx.recentBlockhash = (
        await connection.getLatestBlockhash("finalized")
      ).blockhash;

      const signedTx = await wallet.signTransaction(tx);
      const sig = await connection.sendRawTransaction(signedTx.serialize());
      await connection.confirmTransaction(sig, "confirmed");

      alert(`Approved! Tx: ${tx}`);
      fetchEscrows();
    } catch (err) {
      console.error("Approve work error:", err);
      alert("Failed to approve work: " + err.message);
    }
  };

  if (!wallet)
    return (
      <div className="p-4 bg-white border rounded">
        Connect wallet to view your escrows
      </div>
    );

  return (
    <div className="p-4 space-y-4 bg-white rounded shadow">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">My Escrows (Maker)</h2>
        <button
          onClick={fetchEscrows}
          disabled={loading}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {escrows.length === 0 ? (
        <p className="text-gray-500">No escrows found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {escrows.map((e) => {
            return (
              <div key={e.escrowId} className="p-4 border rounded space-y-2">
                <div className="flex justify-between">
                  <span>ID</span>
                  <span>#{e.escrowId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status</span>
                  <span
                    className={`font-semibold px-2 py-1 rounded text-xs
      ${
        statusLabel(e.status) === "Active"
          ? "text-blue-700 bg-blue-100"
          : statusLabel(e.status) === "Submitted"
          ? "text-yellow-800 bg-yellow-100"
          : statusLabel(e.status) === "Completed"
          ? "text-green-700 bg-green-100"
          : statusLabel(e.status) === "Disputed"
          ? "text-red-700 bg-red-100"
          : statusLabel(e.status) === "Cancelled"
          ? "text-gray-600 bg-gray-200"
          : ""
      }
    `}
                  >
                    {statusLabel(e.status)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total</span>
                  <span>{e.amountTotal} SOL</span>
                </div>
                <div className="flex justify-between">
                  <span>Released</span>
                  <span>{e.amountReleased} SOL</span>
                </div>
                <div className="flex justify-between">
                  <span>Taker</span>
                  <span className="truncate text-xs max-w-[8rem]">
                    {e.taker.toBase58?.() ?? e.taker}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Spec Hash</span>
                  <span
                    title={e.specHash}
                    className="truncate max-w-[10rem] font-mono"
                  >
                    {e.specHash.slice(0, 10)}…
                  </span>
                </div>

                {e.deliverableHash && (
                  <div className="flex justify-between">
                    <span>Deliverable</span>
                    <span
                      title={e.deliverableHash}
                      className="truncate max-w-[10rem] font-mono"
                    >
                      {e.deliverableHash.slice(0, 10)}…
                    </span>
                  </div>
                )}

                {e.status === 1 && (
                  <div>
                    <button
                      className="w-full py-1 mt-2 bg-green-500 text-white rounded"
                      onClick={() => handleApprove(e)}
                    >
                      Approve Work
                    </button>
                    <RequestRevisionForm
                      escrowId={e.escrowId}
                      maker={e.maker}
                    />
                  </div>
                )}

                {e.status === 0 && e.amountReleased === 0 && (
                  <CancelBeforeStartButton
                    escrowId={e.escrowId}
                    maker={e.maker}
                    onSuccess={fetchEscrows}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
