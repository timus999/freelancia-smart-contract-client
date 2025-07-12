import { useState } from "react";
import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import { createEscrow } from "../utils/escrow.ts";

export default function EscrowCreate() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const [escrowId, setEscrowId] = useState("");
  const [amountSol, setAmountSol] = useState("");
  const [spec, setSpec] = useState("Dummy data for escrow spec");

  const now = Date.now() / 1000;
  const defaultDeadline = now + 86400;
  const defaultAutoRelease = now + 172800;

  const onClick = async () => {
    if (!wallet) return alert("Connect wallet first");

    const parsedId = Number(escrowId);
    const parsedAmount = parseFloat(amountSol);

    if (!parsedId || isNaN(parsedAmount) || parsedAmount <= 0) {
      return alert("Please enter valid escrow ID and amount");
    }

    try {
      const pda = await createEscrow({
        connection,
        wallet,
        escrowId: parsedId,
        amountSol: parsedAmount,
        takerPk: "",
        deadline: defaultDeadline,
        autoReleaseAt: defaultAutoRelease,
        spec,
        arbiterPk: wallet.publicKey.toBase58(),
      });

      alert(`✅ Escrow created at: ${pda.toBase58()}`);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to create escrow");
    }
  };

  return (
    <div className="p-4 space-y-3 bg-white rounded shadow max-w-md">
      <h2 className="text-lg font-bold">Create Escrow</h2>

      <label className="block text-sm">
        Escrow ID
        <input
          type="text"
          value={escrowId}
          onChange={(e) => setEscrowId(e.target.value)}
          placeholder="e.g. 12"
          className="w-full mt-1 px-3 py-1 border rounded"
        />
      </label>

      <label className="block text-sm">
        Amount (SOL)
        <input
          type="text"
          value={amountSol}
          onChange={(e) => setAmountSol(e.target.value)}
          placeholder="e.g. 1.25"
          step="any"
          className="w-full mt-1 px-3 py-1 border rounded"
        />
      </label>

      <label className="block text-sm">
        Spec / Description
        <textarea
          value={spec}
          onChange={(e) => setSpec(e.target.value)}
          className="w-full mt-1 px-3 py-1 border rounded"
        />
      </label>

      <p className="text-xs text-gray-500">
        ⏱ Deadline: <b>{new Date(defaultDeadline * 1000).toLocaleString()}</b><br />
        ⏱ Auto-release: <b>{new Date(defaultAutoRelease * 1000).toLocaleString()}</b>
      </p>

      <button
        onClick={onClick}
        className="w-full bg-amber-500 text-white py-2 rounded font-semibold hover:bg-amber-600"
      >
        Create Escrow
      </button>
    </div>
  );
}
