import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { getUserApprovedJobs } from "@/api/job.ts";
import EscrowDetail from "@/components/escrowUI/EscrowDetailCard.tsx";
import {
  CheckCircle,
  FileClock,
  ShieldAlert,
  ArrowRightCircle,
  AlertCircle,
  Send,
} from "lucide-react";
import ConfirmActionModal from "@/components/client/ConfirmActionModal.tsx";
import { requestReviewEscrow } from "@/utils/client/requestReview.ts";
import { reviewRequestClient } from "@/api/job.ts";
import { toast } from "react-toastify";
import { approveWorkClient } from "@/api/job.ts";
import { approveWork } from "@/utils/client/approveWork.ts";
import { cancelEscrow } from "@/utils/client/cancelEscrow.ts";
import { cancelEscrowClient } from "@/api/job.ts";
import { raiseDisputeArbiter } from "@/api/escrow.ts";
import { raiseDispute } from "@/utils/raiseDispute.ts";

type UserApprovedJobs = {
  job_id: number;
  approved_at?: string;
  applied_at: string;
  freelancer_wallet: string;
  application_id: number;
  work_ipfs_hash?: string;
  submitted_at: string;
  disputed?: boolean;
  disputed_at?: string;
  submitted?: boolean;
  review_requested?: boolean;
  review_requested_at?: string;
  freelancer_username?: string;
  maker_wallet: string;
  job_status: string,
};

export default function ApproveWork() {
    const navigate = useNavigate();
  const { job_id } = useParams();
  const [job, setJob] = useState<UserApprovedJobs | null>(null);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);


  const [modal, setModal] = useState<"approve" | "review" | "dispute" | "cancel" | null>(
    null
  );
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const jobId = job_id ? parseInt(job_id) : null;

  useEffect(() => {
      if (!jobId) return;
    const fetchApprovedJobs = async () => {
      try {
        const jobRes = await getUserApprovedJobs(jobId);
        console.log(jobRes);
        setJob(jobRes);
      } catch (err) {
        console.error("Failed to load approved job", err);
      }
    };
    fetchApprovedJobs();
  }, [refresh]);

  //handle work approve 

    const handleApproveWork = async () => {
    if (!job||!wallet) return;

    try {
        setLoading(true);
     await approveWork(job.job_id, job.freelancer_wallet, connection, wallet);
     await approveWorkClient({application_id: job.application_id});
    setTimeout( () => {
        setModal(null);
    toast.success("Work has been approved!!");
      setJob({
        ...job,
        job_status: "completed",

    });
    setLoading(false);
    setRefresh((r) => !r);
    }, 2000)
    } catch (err) {
      console.error("Failed to approve work", err);
      toast.error("Failed to approve work");
    }
  };

    //handle revision request

    const handleRequestReview = async () => {
    if (!job||!wallet) return;

    try {
        setLoading(true);
     await requestReviewEscrow(job.job_id, connection, wallet);
     await reviewRequestClient(job.application_id);
    setTimeout( () => {
        setModal(null);
    toast.success("Review request sent!");
      setJob({
        ...job,
        review_requested: true,
        review_requested_at: new Date().toISOString(),
    });
    setLoading(false);
    setRefresh((r) => !r);
    }, 2000)
    } catch (err) {
      console.error("Failed to request review", err);
      toast.error("Failed to request review");
    }
  };


    //handle cancel escrow 

    const handleCancelEscrow = async () => {
    if (!job||!wallet) return;
    try {
        setLoading(true);
    //  await cancelEscrow(job.job_id, connection, wallet);
     await cancelEscrowClient({job_id: job.job_id});
    setTimeout( () => {
        setModal(null);
    toast.success("Escrow has been cancelled!!");
      setJob({
        ...job,
        job_status: "cancelled",

    });
    setLoading(false);
    setRefresh((r) => !r);
    }, 2000)
    } catch (err) {
      console.error("Failed to cancel escrow", err);
      toast.error("Failed to cancel escrow");
    }
  };


      //handle raise dispute

    const handleRaiseDispute = async () => {
    if (!job||!wallet) return;
    try {
        setLoading(true);
     await raiseDispute(job.job_id, wallet.publicKey.toBase58(), connection, wallet);
     await raiseDisputeArbiter({job_id: job.job_id});
    setTimeout( () => {
        setModal(null);
    toast.success("You have raised a dispute!!");
      setJob({
        ...job,
        disputed: true,
        disputed_at: new Date().toISOString(),

    });
    setLoading(false);
    setRefresh((r) => !r);
    }, 2000)
    } catch (err) {
      console.error("Failed to raise dispute", err);
      toast.error("Failed to raise dispute");
    }
  };
  if (!job || !wallet) return <div className="min-h-screen text-center mt-10">Loading...</div>;
  const cancel = job?.review_requested || false;



  return (
    <motion.div
      className="max-w-5xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-6 relative z-20"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="md:col-span-2"
      >
        <Card className="shadow-md">
          <CardHeader className="flex justify-between items-start gap-4">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-semibold hover:underline cursor-pointer" onClick={ 
                () => {
                    navigate(`/profile/${job.freelancer_username}`)
                }
              }>
                Freelancer: {job.freelancer_username || "Unknown"}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Applied on {new Date(job.applied_at).toLocaleString()}
              </p>

               <p className="text-sm text-muted-foreground">
                {job.review_requested && "Previous "}Submitted on {new Date(job.submitted_at).toLocaleString()}
              </p>
            </div>
          <div className="flex flex-col md:flex-row gap-2 flex-wrap">
  {job.job_status === "completed" ? (
    <Badge variant="default" className="p-1">
      <CheckCircle className="w-4 h-4 mr-1 text-green-600" /> Completed
    </Badge>
  ) : job.submitted ? (
    <Badge variant="default" className="p-1">
      <CheckCircle className="w-4 h-4 mr-1" /> Submitted
    </Badge>
  ) : (
    <Badge variant="secondary" className="p-1">
      <FileClock className="w-4 h-4 mr-1" /> Not Submitted
    </Badge>
  )}

  {job.review_requested && job.job_status !== "completed" && (
    <Badge variant="outline" className="p-1">
      <AlertCircle className="w-4 h-4 mr-1" /> Review Requested
    </Badge>
  )}

  {job.disputed && (
    <Badge variant="destructive">
      <ShieldAlert className="w-4 h-4 mr-1" /> Disputed
    </Badge>
  )}
</div>

          </CardHeader>
          <Separator />
          <CardContent className="space-y-4 text-sm text-muted-foreground mt-4">

             <div>
              <strong>Freelancer Wallet Address:</strong>{" "}
              <p className="text-muted-foreground">
                {job.freelancer_wallet}
              </p>
            </div>

            <Separator />
            { job.work_ipfs_hash &&
            <>
            <div>
              <strong>IPFS Hash:</strong>{" "}
              <a
                href={`https://ipfs.io/ipfs/${job.work_ipfs_hash}`}
                className="text-blue-600 underline"
                target="_blank"
                rel="noreferrer"
              >
                {job.work_ipfs_hash}
              </a>
            </div>

            
            <Separator />
            </>
}


               {job.review_requested && job.review_requested_at && (
                <>
                <div>
             Review requested at:{" "}
          {new Date(job.review_requested_at).toLocaleString()}
            </div>
            <Separator />
            </>
      )}


            

        <div className="flex gap-2 flex-wrap justify-end pt-4">
  {job.job_status === "completed" && (
    <div className="w-full text-center">
      <Badge variant="default" className="bg-green-600 text-white p-2">
        ✅ Job Completed
      </Badge>
      <p className="text-muted-foreground mt-2">This job has been successfully completed.</p>
    </div>
  )}

  {job.disputed && (
    <div className="w-full text-center">
      <Badge variant="destructive">
        🚫 Disputed
      </Badge>
      <p className="text-muted-foreground mt-2">This job is currently under dispute.</p>
    </div>
  )}

  {job.job_status === "cancelled" && (
    <div className="w-full text-center">
      <Badge variant="secondary">
        ❌ Cancelled
      </Badge>
      <p className="text-muted-foreground mt-2">This job has been cancelled by the client.</p>
    </div>
  )}

  {/* Only show action buttons if not completed or cancelled */}
  {job.submitted && !["completed", "cancelled"].includes(job.job_status) && !job.disputed && (
    <>
      <Button
        size="sm"
        variant="default"
        onClick={() => setModal("approve")}
      >
        <ArrowRightCircle className="w-4 h-4 mr-1" />
        Approve Work
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={() => setModal("review")}
      >
        <Send className="w-4 h-4 mr-1" />
        Request Review
      </Button>

      <Button
        size="sm"
        variant="destructive"
        onClick={() => setModal("dispute")}
      >
        <ShieldAlert className="w-4 h-4 mr-1" />
        Raise Dispute
      </Button>
    </>
  )}

  {!job.submitted && !["completed", "cancelled"].includes(job.job_status) && (
    <p className="text-muted-foreground w-full">No submission yet.</p>
  )}

  {!job.submitted_at && !["completed", "cancelled"].includes(job.job_status) && (
    <Button
      size="sm"
      variant="destructive"
      onClick={() => setModal("cancel")}
    >
      <ShieldAlert className="w-4 h-4 mr-1" />
      Cancel
    </Button>
  )}
</div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <EscrowDetail
          EscrowId={job.job_id}
          makerWallet={wallet.publicKey.toBase58()}
        />
      </motion.div>

      {/* Modals */}
      <ConfirmActionModal
        open={modal === "approve"}
        title="Confirm Approval"
        description="Are you sure you want to approve this work?"
        loading={loading}
        onConfirm={handleApproveWork}
        onCancel={() => setModal(null)}
      />

      <ConfirmActionModal
        open={modal === "review"}
        title="Request Review"
        description="Are you sure you want to request a review?"
        loading={loading}
        onConfirm={
           handleRequestReview
        }
        onCancel={() => setModal(null)}
      />

      <ConfirmActionModal
        open={modal === "dispute"}
        title="Raise Dispute"
        description="This action will open a dispute. Proceed?"
        loading={loading}
        onConfirm={handleRaiseDispute}
        onCancel={() => setModal(null)}
      />

       <ConfirmActionModal
        open={modal === "cancel"}
        title="Cancel Escrow"
        description="This action will cancel the escrow. Proceed?"
        loading={loading}
        onConfirm={handleCancelEscrow}
        onCancel={() => setModal(null)}
      />

    </motion.div>
  );
}
