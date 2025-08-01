import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import {
  SendHorizonal,
  FlagTriangleRight,
  AlarmClock,
  CheckCircle,
  FileClock,
  ShieldAlert,
} from "lucide-react";
import { claimTimeoutClient, getMyJob } from "@/api/freelancer.ts";
import { useParams } from "react-router-dom";
import { timeAgo } from "@/utils/timeformatter.ts";
import { Separator } from "@/components/ui/separator.tsx";
import EscrowDetail from "@/components/escrowUI/EscrowDetailCard.tsx";
import { useAuth } from "@/context/AuthContext.tsx";
import SubmitWork from "@/components/escrowUI/SubmitWork.tsx";
import { submitDeliverable } from "@/api/freelancer.ts";
import { submitEscrowDeliverable } from "@/utils/sumbitDeliverable.ts";
import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import { uploadFileToPinata } from "@/lib/uploadFileToPinata.ts";
import ConfirmActionModal from "@/components/client/ConfirmActionModal.tsx";
import { claimTimeout } from "@/utils/freelancer/claimTimout.ts";
import { raiseDispute } from "@/utils/raiseDispute.ts";
import { raiseDisputeArbiter } from "@/api/escrow.ts";
import { toast } from "react-toastify";

export type Job = {
  id: number;
  title: string;
  status: string,
  description: string;
  budget: number;
  skills: string;
  deadline: string;
  posted_at: string;
  job_ipfs_hash: string;
  approved_at: string;
  submitted: boolean;
  submitted_at?: string;
  disputed?: boolean;
  disputed_at?: string,
  cancelled?: boolean;
  timeout_claimed?: boolean;
  wallet_address: string;
};

export default function JobSubmissionPage() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  
  const [job, setJob] = useState<Job>();
  const { applicationId } = useParams();
  const { isVerified } = useAuth();
   const [showModal, setShowModal] = useState(false);
   const [modal, setModal] = useState<"claimTimeout" | "raiseDispute" | null>(null);
   const [loading, setLoading] = useState(false);
   const [refresh, setRefresh] = useState(false);


   if (!applicationId) return;
   const id = parseInt(applicationId);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getMyJob(id);
        setJob(res);
        
      } catch (err) {
        console.error("Failed to fetch jobs", err);
      }
    };
    
    load();
  }, [refresh]);

  if (!job) return null;

  const skills = job.skills?.split(",").map((s) => s.trim());

  
  const handleFileSubmit =async (file: File): Promise<void> => {
    
    try{
      
      
      if (!wallet) return;
    if(!file) return;
    const cid = await uploadFileToPinata(file);
      const sig = await submitEscrowDeliverable({
      connection,
      wallet,
      escrowId: job.id,
      maker: job.wallet_address,
      cid: cid,
    });

    console.log("Submitted work successfully in tx:", sig);
    await submitDeliverable({ application_id: id, ipfs_hash: cid})
    setRefresh((r) => !r);

    } catch (err: any) {
      console.log(err);
      throw new Error(err);
    }
  }

  const handleClaimTimeout = async() => {

     if (!job||!wallet) return;
        try {
            setLoading(true);
         await claimTimeout(job.id, job.wallet_address, connection, wallet);
         await claimTimeoutClient({job_id: job.id});
        setTimeout( () => {
            setModal(null);
        toast.success("Claimed successfully!!");
        setLoading(false);
        setRefresh((r) => !r);
        }, 2000)
        } catch (err) {
          console.error("Failed to claim", err);
          toast.error("Failed to claim");
        }
  }

    const handleRaiseDispute = async() => {

     if (!job||!wallet) return;
        try {
            setLoading(true);
         await raiseDispute(job.id,job.wallet_address, connection, wallet);
         await raiseDisputeArbiter({job_id: job.id});
        setTimeout( () => {
            setModal(null);
        toast.success("Raised dispute successfully!!");
        setLoading(false);
        setRefresh((r) => !r);
        }, 2000)
        } catch (err) {
          console.error("Failed to raise dispute", err);
          toast.error("Failed to raise dispute");
        }
  }

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
        {/* Job Detail Card */}
        <Card className="md:col-span-2 shadow-md">
          <CardHeader className="flex justify-between items-start gap-4">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-semibold">{job.title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Posted {timeAgo(job.posted_at)}
              </p>
            </div>
       <div className="flex flex-col md:flex-row gap-2">
  {job.cancelled ? (
    <Badge variant="secondary" className="pb-1">
      <FileClock className="w-4 h-4 mr-1" /> Cancelled
    </Badge>
  ) : job.disputed ? (
    <Badge variant="destructive" className="pb-1">
      <ShieldAlert className="w-4 h-4 mr-1" /> Disputed
    </Badge>
  ) : job.status === "completed" ? (
    <Badge variant="default" className="pb-1">
      <CheckCircle className="w-4 h-4 mr-1" /> Completed
    </Badge>
  ) : job.submitted ? (
    <Badge variant="default" className="pb-1">
      <CheckCircle className="w-4 h-4 mr-1" /> Submitted
    </Badge>
  ) : (
    <Badge variant="secondary" className="pb-1">
      <FileClock className="w-4 h-4 mr-1" /> Not Submitted
    </Badge>
  )}
</div>

{/* {job.status === "completed" && (
  <p className="text-green-600 text-sm font-medium mt-2">Job is completed</p>
)}
{job.status === "disputed" && (
  <p className="text-red-600 text-sm font-medium mt-2">Job is in dispute</p>
)}
{job.status === "cancelled" && (
  <p className="text-muted-foreground text-sm font-medium mt-2">Job was cancelled</p>
)} */}
          </CardHeader>

          <Separator />

          <CardContent className="space-y-6 mt-4 text-sm text-muted-foreground">
            <div>
              <strong className="block text-foreground mb-1">Description</strong>
              <p>{job.description}</p>
            </div>

            <Separator />

             <div>
              <strong className="block text-foreground mb-1">Budget</strong>
              <p>{job.budget} SOL</p>
            </div>

            <Separator />

             <div>
                <strong className="block mb-1 text-foreground">Skills Required</strong>
                <div className="flex flex-wrap gap-1">
                  {skills.map((s, i) => (
                    <Badge key={i} variant="outline" className="pb-1">
                      {s}
                    </Badge>
                  ))}
                </div>

              </div>

              <Separator />

              {job.job_ipfs_hash && (
              <div>
                <strong className=" mb-1 text-foreground">IPFS:  </strong>
                <a
                  href={`https://ipfs.io/ipfs/${job.job_ipfs_hash}`}
                  className="underline text-blue-600"
                  target="_blank"
                  rel="noreferrer"
                >
                  {job.job_ipfs_hash}
                </a>
              </div>
            )}

             <Separator />

            <div className="flex flex-col gap-1">

              <strong className=" text-xs">Deadline: {new Date(job.deadline).toLocaleDateString()}</strong>
          
              {job.submitted && job.submitted_at && (
                <strong className="text-xs">
                  Submitted at: {new Date(job.submitted_at).toLocaleString()}
                </strong>
              )}

               {job.disputed && job.disputed_at && (
                <strong className="text-xs">
                  Disputed at: {new Date(job.disputed_at).toLocaleString()}
                </strong>
              )}
            </div>

            
             <Separator />

          

           <div className="flex flex-wrap justify-end gap-2 pt-4">
  {job.status === "completed" || job.cancelled || job.disputed ? (
    <p className="text-muted-foreground text-sm">No further actions available.</p>
  ) : !job.submitted ? (
    <Button variant="default" size="sm" onClick={() => setShowModal(true)}>
      <SendHorizonal className="w-4 h-4 mr-2" /> Submit Work
    </Button>
  ) : (
    <>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => setModal("raiseDispute")}
      >
        <FlagTriangleRight className="w-4 h-4 mr-2" /> Raise Dispute
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setModal("claimTimeout")}
      >
        <AlarmClock className="w-4 h-4 mr-2" /> Claim Timeout
      </Button>
    </>
  )}
</div>

          </CardContent>
        </Card>
   </motion.div>
        {/* Escrow Detail on Right */}
         <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
          <EscrowDetail EscrowId={job.id} makerWallet={job.wallet_address}/>
        </motion.div>
   
        <SubmitWork
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleFileSubmit}
        isWalletVerified={isVerified}
      />

            <ConfirmActionModal
              open={modal === "claimTimeout"}
              title="Claim Timeout"
              description="Are you sure you want to claim?"
              loading={loading}
              onConfirm={handleClaimTimeout}
              onCancel={() => setModal(null)}
            />

             <ConfirmActionModal
              open={modal === "raiseDispute"}
              title="Raise Dispute"
              description="Are you sure you want to raise dispute?"
              loading={loading}
              onConfirm={handleRaiseDispute}
              onCancel={() => setModal(null)}
            />
    </motion.div>
  );
}
