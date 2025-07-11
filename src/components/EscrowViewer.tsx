// components/EscrowViewer.tsx
import { useState, useEffect, useCallback } from "react";
import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import { getEscrowData } from "../utils/fetchEscrow.ts";
import SubmitWorkForm from "./SubmitWork.tsx"; // ✅ import your form component
import { PublicKey } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";

const statusLabel = (s: number) =>
  ["Active", "Submitted", "Completed", "Disputed", "Cancelled"][s] ?? "Unknown";

const ts = (secs: number) =>
  new Date(secs * 1_000).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function EscrowViewer() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const [escrows, setEscrows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState<string | null>(null);

  const fetchEscrows = useCallback(async () => {
    if (!wallet) return;
    setLoading(true);
    const fetched: any[] = [];

    try {
      for (let id = 0; id < 20; id++) {
        try {
          const e = await getEscrowData(connection, wallet, id);
          fetched.push(e);
        } catch {
          // ignore missing escrows
        }
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

  if (!wallet)
    return (
      <div className="p-4 border rounded bg-white">
        Connect wallet to view escrows
      </div>
    );

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Your Escrows</h2>
        <button
          onClick={fetchEscrows}
          disabled={loading}
          className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {escrows.length === 0 ? (
        <p className="text-gray-500">No escrows found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {escrows.map((e) => {
            // Validate maker address before conversion
            let makerPubkey: PublicKey | null = null;
            try {
              if (e.maker) {
                makerPubkey = new PublicKey(e.maker);
              }
            } catch {
              makerPubkey = null;
            }
            const openKey = e.publicKey.toBase58();

            return (
              <div
                key={e.publicKey.toString()}
                className="p-4 bg-gray-50 rounded-lg border space-y-2"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-lg">#{e.escrowId}</span>
                  <button
                    className="text-sm text-blue-500 underline"
                    onClick={() =>
                      setOpen(open === openKey ? null : openKey)
                    }
                  >
                    {open === openKey ? "Hide" : "Details"}
                  </button>
                </div>

                <div className="flex justify-between">
                  <span>Status</span>
                  <span>{statusLabel(e.status)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Total</span>
                  <span>{e.amountTotal} SOL</span>
                </div>

                {open === openKey && (
                  <div className="pt-2 border-t space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Released</span>
                      <span>{e.amountReleased} SOL</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Deadline</span>
                      <span>{ts(e.deadline)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Auto-release</span>
                      <span>{ts(e.autoReleaseAt)}</span>
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

                    {/* Conditionally render SubmitWorkForm only if makerPubkey is valid and escrow status is Active */}
                    {makerPubkey && statusLabel(e.status) === "Active" ? (
                      <SubmitWorkForm
                        escrowId={e.escrowId}
                        maker={makerPubkey}
                      />
                    ) : (
                      !makerPubkey && (
                        <p className="text-red-500 text-xs mt-2">
                          Invalid maker public key — cannot submit work
                        </p>
                      )
                    )}
                  </div>
                )}

                <p className="text-[10px] text-gray-400 break-all">{openKey}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
