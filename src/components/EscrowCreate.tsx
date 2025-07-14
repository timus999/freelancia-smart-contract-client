import { useState, useEffect } from "react";
import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import { createEscrow } from "../utils/escrow.ts";




export const formatUniversalTime = (seconds: number): string => {
  return new Date(seconds * 1000).toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
};


export default function EscrowCreate() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const [escrowId, setEscrowId] = useState("");
  const [amountSol, setAmountSol] = useState("");
  const [spec, setSpec] = useState("Dummy data for escrow spec");



     const currentTime = Math.floor(Date.now() / 1000);
    const deadline = currentTime + 180; // 2 seconds in future
    const autoRelease = deadline + 180;



//   const [deadline, setDeadline] = useState<number | null>(null);
//   const [autoRelease, setAutoRelease] = useState<number | null>(null);

// useEffect(() => {
//   (async () => {
//     const currentTime = await getSolanaUnixTimestamp(connection);
    
//     // Set deadline to 90 seconds from now
//     const deadlineSeconds = currentTime + 60;
    
//     // Set auto-release to 180 seconds from now
//     const autoReleaseSeconds = deadlineSeconds + 60;
    
//     setDeadline(deadlineSeconds);
//     setAutoRelease(autoReleaseSeconds);
//   })();
// }, [connection]);

// // Format for display
// const formatTimeStamp = (seconds: number): string => {
//   const date = new Date(seconds * 1000);
//   return date.toLocaleString('en-US', {
//     year: 'numeric',
//     month: 'short',
//     day: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit',
//     second: '2-digit',
//     timeZoneName: 'short'
//   });
// };


// Universal formatter (always shows UTC)

  const onClick = async () => {
    if (!wallet) return alert("Connect wallet first");

// if (!deadline || !autoRelease) {
//   return alert("Wait for blockchain time to sync...");
// }

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
        deadline: deadline,
        autoReleaseAt: autoRelease,
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
        {deadline && autoRelease ? (
          <>
            ⏱ Deadline:{" "}
            <b>{formatUniversalTime(deadline)}</b>
            <br />⏱ Auto-release:{" "}
            <b>{formatUniversalTime(autoRelease)}</b>
          </>
        ) : (
          "⌛ Syncing time with Solana cluster..."
        )}
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
