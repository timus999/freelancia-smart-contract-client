import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import { useState, useEffect, useCallback } from "react";
import { getEscrowData } from "@/utils/fetchEscrow.ts";
import { PublicKey } from "@solana/web3.js";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  Wallet,
  Clock,
  CalendarDays,
  Coins,
  CheckCircle2,
  AlarmClock,
  ShieldAlert,
  LoaderCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";

const statusLabel = (s: number) =>
  ["Active", "Submitted", "Completed", "Disputed", "Cancelled"][s] ?? "Unknown";

export default function EscrowDetail({ EscrowId, makerWallet }: { EscrowId: number, makerWallet: string }) {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const [escrows, setEscrows] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchEscrows = useCallback(async () => {
    if (!makerWallet) return;
    setLoading(true);

    try {
        const makerPubkey = new PublicKey(makerWallet);
      const e = await getEscrowData(connection, makerPubkey, EscrowId);
      setEscrows(e);
    } catch (err) {
      console.error("Failed to fetch escrow", err);
    } finally {
      setLoading(false);
    }
  }, [makerWallet, connection]);

  useEffect(() => {
    fetchEscrows();
  }, [fetchEscrows]);

  if (!makerWallet)
    return (
      <Card className="p-4">
        <p className="text-muted-foreground">⚠️ Connect your wallet to view escrow details.</p>
      </Card>
    );

  if (loading || !escrows)
    return <Skeleton className="w-full h-52 rounded-xl" />;

  const {
    maker,
    escrowId,
    status,
    amountTotal,
    amountReleased,
    createdAt,
    deadline,
    autoReleaseAt,
    completedAt,
    specHash,
  } = escrows;


  return (
    <Card className="w-full sm:w-[400px] border shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-blue-500" />
          Escrow #{escrowId}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Wallet className="w-4 h-4 text-purple-800" />
          <span className="truncate" title={maker}>Maker: {maker}</span>
        </div>

        <div className="flex items-center gap-2">
          <Coins className="w-4 h-4 text-yellow-500" />
          <span>Total Amount: {amountTotal} SOL | Released: {amountReleased} SOL </span>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-700" />
          <span>Created: {new Date(Number(createdAt) * 1000).toLocaleString()}</span>
        </div>

        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-red-600" />
          <span>Deadline: {new Date(Number(deadline) * 1000).toLocaleString()}</span>
        </div>

        <div className="flex items-center gap-2">
          <AlarmClock className="w-4 h-4 text-orange-400" />
          <span>Auto Release: {new Date(Number(autoReleaseAt) * 1000).toLocaleString()}</span>
        </div>

        {completedAt != 0 && (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span>Completed At: {new Date(Number(completedAt) * 1000).toLocaleString()}</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className={`text-xs pb-1
             ${
        statusLabel(status) === "Active"
          ? "text-blue-700 bg-blue-100"
          : statusLabel(status) === "Submitted"
          ? "text-yellow-800 bg-yellow-100"
          : statusLabel(status) === "Completed"
          ? "text-green-700 bg-green-100"
          : statusLabel(status) === "Disputed"
          ? "text-red-700 bg-red-100"
          : statusLabel(status) === "Cancelled"
          ? "text-gray-600 bg-gray-200"
          : ""
      }`}>
            Status: {statusLabel(status)}
          </Badge>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>
            Spec:{"  "}
            <a
              href={`https://ipfs.io/ipfs/${specHash}`}
              className="underline hover:text-blue-500"
              target="_blank"
              title={specHash}
              rel="noopener noreferrer"
            >
              {specHash.slice(0, 40)}...
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
