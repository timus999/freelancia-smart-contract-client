import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { getJobs, getJobApplicants, approveFreelancer, createEscrowNotification } from "@/api/job.ts";
import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import { createEscrow } from "@/utils/escrow.ts";
import { toast } from "react-toastify";

type Job = {
  id: number;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  skills: string;
  job_ipfs_hash: string,
};

type Applicant = {
  application_id: number;
  freelancer_id: number;
  freelancer_username: string;
  profile_ipfs_hash: string;
  skills: string;
  applied_at: string;
  approved: boolean;
  freelancer_wallet: string,
};

const JobApplicantsPage = () => {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const { jobId } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState<number | null>(null);
  const [selectedApplicationWallet, setSelectedApplicationWallet] = useState<string | null>(null);
  const [creatingEscrow, setCreatingEscrow] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        if (!jobId) return;
        const jobRes = await getJobs({ id: jobId });
        const appRes = await getJobApplicants(parseInt(jobId));
        setJob(jobRes.jobs[0]);
        setApplicants(appRes);
      } catch (err) {
        console.error("Failed to load job or applicants", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [jobId]);

  const handleAction = (applicationId: number, applicantWallet: string) => {
    setSelectedApplicationId(applicationId);
    setSelectedApplicationWallet(applicantWallet)
    setShowModal(true);
  };

  const handleConfirm = async () => {
    if (!selectedApplicationId || !wallet || !job || !selectedApplicationWallet) return toast("Missing data or wallet");

    setShowModal(false);
    setCreatingEscrow(true);
    try {
      const deadline = Math.floor(new Date(job.deadline).getTime() / 1000);
      const autoReleaseAt = deadline + 604800;
      const pda = await createEscrow({
        connection,
        wallet,
        escrowId: job.id,
        amountSol: job.budget,
        takerPk: selectedApplicationWallet,
        deadline,
        autoReleaseAt,
        spec: job.job_ipfs_hash,
        arbiterPk: wallet.publicKey.toBase58(),
      });
      await approveFreelancer(selectedApplicationId);
      await createEscrowNotification({ applicationId: selectedApplicationId, escrow_pda: pda.toBase58() });
      setApplicants(prev => prev.map(a => a.application_id === selectedApplicationId ? { ...a, approved: true } : a));
      setSuccessModal(true);
    } catch (err) {
      toast.error("Failed to create escrow");
      console.error(err);
    } finally {
      setCreatingEscrow(false);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setSelectedApplicationId(null);
  };

  if (loading) return <Skeleton className="w-full h-64" />;
  if (!job) return <p className="text-center text-red-500">Job not found.</p>;

  return (
    <motion.div className="max-w-4xl mx-auto p-6 space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card className="shadow-lg border">
        <CardHeader><CardTitle className="text-2xl">{job.title}</CardTitle></CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{job.description}</p>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <Badge variant="secondary">Budget: ${job.budget}</Badge>
            <Badge variant="secondary">Deadline: {new Date(job.deadline).toLocaleDateString()}</Badge>
            <Badge variant="secondary">Skills: {job.skills}</Badge>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Applicants</h2>
        {applicants.length === 0 ? <p className="text-muted-foreground">No one has applied yet.</p> : (
          applicants.map((applicant) => (
            <motion.div key={applicant.application_id} className="p-4 border rounded-xl bg-secondary shadow-sm flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Avatar><AvatarFallback>{applicant.freelancer_username.slice(0, 2).toUpperCase()}</AvatarFallback></Avatar>
                <div>
                  <p className="font-medium cursor-pointer hover:underline text-blue-600" title="Visit Profile" onClick={() => navigate(`/profile/${applicant.freelancer_username}`)}>{applicant.freelancer_username}</p>
                  <p className="text-sm text-muted-foreground">Applied at {new Date(applicant.applied_at).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Skills: {applicant.skills}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {applicant.approved ? (
                  <Badge variant="secondary">Approved</Badge>
                ) : (
                  <>
                    <Button variant="default" onClick={() => handleAction(applicant.application_id, applicant.freelancer_wallet)} disabled={applicants.some(a => a.approved)}>Approve</Button>
                    <Button variant="destructive" onClick={() => toast("Reject logic not implemented")}>Reject</Button>
                  </>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Confirm Modal */}
      {showModal && (
        <motion.div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <motion.div className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-md" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <h3 className="text-lg font-semibold mb-2">Confirm Approval</h3>
            <p className="text-sm text-muted-foreground mb-4">Escrow will be created and approval will be final. Proceed?</p>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
              <Button variant="default" onClick={handleConfirm}>Confirm</Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Loading Overlay */}
      {creatingEscrow && (
        <motion.div className="fixed inset-0 bg-black/40 backdrop-blur flex items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <motion.div className="text-white text-xl font-medium">Creating escrow, please wait...</motion.div>
        </motion.div>
      )}

      {/* Success Modal */}
      <AnimatePresence>
        {successModal && (
          <motion.div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-sm text-center" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <h3 className="text-lg font-semibold mb-4">Escrow Created & Freelancer Approved!</h3>
              <Button onClick={() => setSuccessModal(false)}>Okay</Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default JobApplicantsPage;
