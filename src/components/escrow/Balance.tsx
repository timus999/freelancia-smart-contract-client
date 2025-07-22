// Balance.tsx
import { useState, useEffect } from "react";
import { LAMPORTS_PER_SOL, AccountInfo, PublicKey } from "@solana/web3.js";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

export default function Balance() {
  const { publicKey, connected } = useWallet();          // publicKey: PublicKey | null
  const { connection } = useConnection();

  // number when we know the balance, null while loading / disconnected
  const [balance, setBalance] = useState<number | null>(null);

  /* ---------- one‑shot fetch on mount + reconnect ---------- */
  useEffect(() => {
    if (!connected || !publicKey) {
      setBalance(null);
      return;
    }

    (async () => {
      const lamports = await connection.getBalance(publicKey, "confirmed");
      setBalance(lamports / LAMPORTS_PER_SOL);
    })();
  }, [connected, publicKey, connection]);

  /* ---------- live websocket updates ---------- */
  useEffect(() => {
    if (!connected || !publicKey) return;

    const id = connection.onAccountChange(
      publicKey,
      (info: AccountInfo<Buffer>, _ctx) => {
        setBalance(info.lamports / LAMPORTS_PER_SOL);
      },
      "confirmed"
    );

    return () => {
      connection.removeAccountChangeListener(id);
    };
  }, [connected, publicKey, connection]);

  /* ---------- render ---------- */
  if (!connected) return null;                 // hide until wallet connected
  if (balance === null) return <p>Loading…</p>;

  return (
    <p className="mt-2 text-sm text-center">
      Balance:{" "}
      {balance.toLocaleString(undefined, { maximumFractionDigits: 6 })} SOL
    </p>
  );
}
