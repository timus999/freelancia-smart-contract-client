import { useState } from "react";
import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import { resolveDispute } from "../../utils/resolveDispute.ts";
import { PublicKey } from "@solana/web3.js";

interface DisputeResolverProps {
  escrow: {
    escrowId: number;
    maker: string;
    taker: string;
    amountTotal: number;
    amountReleased: number;
    amountRefunded: number;
    specHash: string;
    deliverableHash: string;
    deadline: number;
    autoReleaseAt: number;
    status: number;
  };
}

export default function DisputeResolver({ escrow }: DisputeResolverProps) {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const [makerAmount, setMakerAmount] = useState(0);
  const [takerAmount, setTakerAmount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fillSplit = (percent: number) => {
    const total = escrow.amountTotal - escrow.amountReleased - escrow.amountRefunded || 1;
    const takerSplit = total * percent;
    const makerSplit = total - takerSplit;
    setTakerAmount(parseFloat(takerSplit.toFixed(3)));
    setMakerAmount(parseFloat(makerSplit.toFixed(3)));
  };

  const handleResolve = async () => {
    if (!wallet) return alert("Connect wallet");
    setSubmitting(true);
    try {
      await resolveDispute({
        connection,
        wallet,
        escrowId: escrow.escrowId,
        maker: new PublicKey(escrow.maker),
        taker: new PublicKey(escrow.taker),
        makerAmountSol: makerAmount,
        takerAmountSol: takerAmount,
      });
      alert("Dispute resolved!");
    } catch (err) {
      console.error("Error resolving dispute:", err);
      alert("Failed to resolve dispute");
    } finally {
      setSubmitting(false);
      setShowModal(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 shadow-md rounded-xl p-6 mb-6 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Resolve Dispute</h2>

      {/* Escrow Info */}
      <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
        <div><strong>Escrow ID:</strong> {escrow.escrowId}</div>
        <div><strong>Total:</strong> {escrow.amountTotal} SOL</div>
        <div><strong>Released:</strong> {escrow.amountReleased} SOL</div>
        <div><strong>Refunded:</strong> {escrow.amountRefunded} SOL</div>
        <div><strong>Spec Hash:</strong> <code className="break-all">{escrow.specHash}</code></div>
        <div><strong>Deliverable:</strong> <code className="break-all">{escrow.deliverableHash}</code></div>
        <div><strong>Deadline:</strong> {new Date(escrow.deadline * 1000).toLocaleString()}</div>
        <div><strong>Auto Release:</strong> {new Date(escrow.autoReleaseAt * 1000).toLocaleString()}</div>
      </div>

      {/* Split Buttons */}
      <div className="flex gap-2 mb-3">
        {[["50/50", 0.5], ["70/30", 0.7], ["30/70", 0.3]].map(([label, val]) => (
          <button
            key={label}
            onClick={() => fillSplit(val as number)}
            className="px-3 py-1 text-sm bg-gray-100 border border-gray-300 rounded-full hover:bg-gray-200"
          >
            Auto {label}
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <label className="text-sm">
          Maker Amount (SOL)
          <input
            type="number"
            value={makerAmount}
            onChange={(e) => setMakerAmount(parseFloat(e.target.value))}
            className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
          />
        </label>
        <label className="text-sm">
          Taker Amount (SOL)
          <input
            type="number"
            value={takerAmount}
            onChange={(e) => setTakerAmount(parseFloat(e.target.value))}
            className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
          />
        </label>
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        disabled={submitting}
      >
        Submit Resolution
      </button>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h4 className="text-lg font-semibold mb-3">Confirm Resolution</h4>
            <p className="mb-4 text-gray-700">
              Confirm resolution with <strong>{takerAmount} SOL</strong> to Taker and{" "}
              <strong>{makerAmount} SOL</strong> to Maker?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleResolve}
                className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
