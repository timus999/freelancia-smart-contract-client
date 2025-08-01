import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator.tsx";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ArrowRightCircle, Loader2 } from "lucide-react";
import ConfirmActionModal from "@/components/client/ConfirmActionModal.tsx";
import { getDisputedJobsForArbiter, arbiterResolveClient } from "@/api/escrow.ts";
import { resolveDispute } from "@/utils/resolveDispute.ts";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog.tsx";


type DisputedJobs = {
     job_id: number;
     title: string;
     description: string;
     budget: number;
     skills: string;
     client_id: number;
     posted_at: string;
     deadline: string;
     job_ipfs_hash: string;
     work_ipfs_hash: string;
     client_username: string;
     freelancer_username: string;
     application_id: number;
     freelancer_id: number;
     submitted_at: string;
     job_status: string;
     arbiter_id: number;
     freelancer_wallet: string,
     client_wallet: string,
}

export default function ArbiterResolvePage() {
    const navigate = useNavigate();
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const [disputedJob, setDisputedJob] = useState<DisputedJobs| null>(null);
  const [makerAmount, setMakerAmount] = useState(0);
  const [takerAmount, setTakerAmount] = useState(0);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await getDisputedJobsForArbiter();
        console.log(res);
        setDisputedJob(res[1]);
      } catch (err) {
        console.error("Failed to fetch disputed jobs", err);
      }
    };
    fetchJob();
  }, []);

//   const handleResolve = async () => {
//     if (!wallet || !disputedJob) return;
//     try {
//       setLoading(true);
//       await resolveDispute({
//         connection,
//         wallet,
//         escrowId: disputedJob.job_id,
//         maker: new PublicKey(disputedJob.freelancer_wallet),
//         taker: new PublicKey(disputedJob.client_wallet),
//         makerAmountSol: makerAmount,
//         takerAmountSol: takerAmount,
//       });

//       await arbiterResolveClient({ job_id: disputedJob.job_id,
//          resolved: true,
//           application_id: disputedJob.application_id,
//            client_id: disputedJob.client_id,
//             freelancer_id: disputedJob.freelancer_id });
//       setModal(false);
//     } catch (err) {
//       console.error("Failed to resolve dispute", err);
//     } finally {
//       setLoading(false);
//     }
//   };

      const handleResolve = async () => {
      if (!disputedJob||!wallet) return;
      try {
          setLoading(true);
         await resolveDispute({
        connection,
        wallet,
        escrowId: disputedJob.job_id,
        maker: new PublicKey(disputedJob.client_wallet),
        taker: new PublicKey(disputedJob.freelancer_wallet),
        makerAmountSol: makerAmount,
        takerAmountSol: takerAmount,
      });
       await arbiterResolveClient({ job_id: disputedJob.job_id,
         resolved: true,
          application_id: disputedJob.application_id,
           client_id: disputedJob.client_id,
            freelancer_id: disputedJob.freelancer_id });
      setTimeout( () => {
          setModal(false);
      toast.success("You have resolved a dispute!!");
  
      setLoading(false);
      }, 2000)
      } catch (err) {
        console.error("Failed to resolve dispute", err);
        toast.error("Failed to resolve dispute");
      }
    }

  if (!disputedJob) return <p className="text-center mt-10 text-muted-foreground">No disputed job found</p>;

  return (
    <motion.div
      className="max-w-4xl mx-auto px-6 py-10 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="shadow-xl border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">Resolve Dispute: {disputedJob.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <strong>Description:</strong>
            <p className="text-muted-foreground mt-1">{disputedJob.description}</p>
          </div>
          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Budget:</strong>
              <p>{disputedJob.budget} SOL</p>
            </div>
            <div>
              <strong>Deadline:</strong>
              <p>{new Date(disputedJob.deadline).toLocaleDateString()}</p>
            </div>
          </div>
          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Client:</strong>
              <p onClick={() => { navigate(`/profile/${disputedJob.client_username}`)}} className="hover:underline cursor-pointer">{disputedJob.client_username}</p>
            </div>
            <div>
              <strong>Freelancer:</strong>
              <p onClick={() => { navigate(`/profile/${disputedJob.freelancer_username}`)}} className="hover:underline cursor-pointer">{disputedJob.freelancer_username}</p>
            </div>
          </div>

          <Separator />

          <div>
            <strong>Job IPFS:</strong>
            <a href={`https://ipfs.io/ipfs/${disputedJob.job_ipfs_hash}`} className="text-blue-600 underline ml-1" target="_blank">{disputedJob.job_ipfs_hash}</a>
          </div>
          <div>
            <strong>Work IPFS:</strong>
            <a href={`https://ipfs.io/ipfs/${disputedJob.work_ipfs_hash}`} className="text-blue-600 underline ml-1" target="_blank">{disputedJob.work_ipfs_hash}</a>
          </div>
        </CardContent>
      </Card>

      <motion.div
        className="flex justify-end gap-4"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Button variant="default" onClick={() => setModal(true)}>
          <ArrowRightCircle className="w-4 h-4 mr-2" /> Resolve Dispute
        </Button>
      </motion.div>

      {/* <ConfirmActionModal
        open={modal}
        title="Resolve Dispute"
        description="Enter distribution of funds between freelancer and client"
        loading={loading}
        onConfirm={() => { handleResolve}}
        onCancel={() => setModal(false)}
      >
      </ConfirmActionModal>

      { modal && (
        <div className="space-y-4 pt-4">
          <div>
            <label className="block mb-1 font-medium">Freelancer Amount (SOL)</label>
            <Input
              type="number"
              value={makerAmount}
              onChange={(e) => setMakerAmount(Number(e.target.value))}
              placeholder="Amount to freelancer"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Client Amount (SOL)</label>
            <Input
              type="number"
              value={takerAmount}
              onChange={(e) => setTakerAmount(Number(e.target.value))}
              placeholder="Amount to client"
            />
          </div>
        </div>
      )} */}

        <Dialog open={modal} onOpenChange={() => setModal(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Resolve Dispute</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground mb-4">Enter distribution of funds between freelancer and client</p>
<div className="space-y-4 pt-4">
          <div>
            <label className="block mb-1 font-medium">Freelancer Amount (SOL)</label>
            <Input
              type="number"
              value={makerAmount}
              onChange={(e) => setMakerAmount(Number(e.target.value))}
              placeholder="Amount to freelancer"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Client Amount (SOL)</label>
            <Input
              type="number"
              value={takerAmount}
              onChange={(e) => setTakerAmount(Number(e.target.value))}
              placeholder="Amount to client"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setModal(false)}>
            Cancel
          </Button>
          <Button variant="default" onClick={handleResolve} disabled={loading}>
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    Confirm
                  </Button>
        </div>
      </DialogContent>
    </Dialog>
    </motion.div>
  );
}
