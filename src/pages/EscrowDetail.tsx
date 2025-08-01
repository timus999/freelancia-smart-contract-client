import { getEscrow } from "@/api/escrow.ts";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EscrowDetail from "@/components/escrowUI/EscrowDetailCard.tsx";
import { motion } from "framer-motion";
import { ShieldCheck, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";

type EscrowResponse = {
  job_id: number;
  wallet_address?: string;
};

export default function EscrowDetailPage() {
  const { escrow_pda } = useParams();
  const [result, setResult] = useState<EscrowResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!escrow_pda) return;
    const fetchEscrow = async () => {
      try {
        const res = await getEscrow(escrow_pda);
        setResult(res);
      } catch (err) {
        console.error("Failed to fetch escrow:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEscrow();
  }, [escrow_pda]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-muted-foreground" />
      </div>
    );
  }

  if (!result?.job_id || !result.wallet_address) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-destructive">❌ Invalid or missing escrow data.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
  
            <EscrowDetail
              EscrowId={result.job_id}
              makerWallet={result.wallet_address}
            />

      </motion.div>
    </div>
  );
}
