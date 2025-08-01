import { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card.tsx";
import { fetchJobs } from "@/api/job.ts";
import PostJob from "./Post.tsx";
import { motion, useInView, Variants } from "framer-motion";

interface JobResopnse {
  id: number;
  title: string;
  description: string;
  skills: string;
  budget: number;
  location: string;
  job_type: string;
  job_ipfs_hash: string;
  posted_at: string;
  deadline: string;
  category: string;
  status: string;
}

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

export default function ClientJobList() {
  const [jobs, setJobs] = useState<JobResopnse[]>([]);
  const [loading, setLoading] = useState(true);
  const clientId = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchJobsClient = async () => {
      try {
        if (!clientId) throw new Error("user_id required");
        const res = await fetchJobs(clientId);
        setJobs(res.jobs || []);
      } catch (err) {
        console.error("Failed to load jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobsClient();
  }, [clientId]);

  if (loading) return <p>Loading jobs...</p>;

  return (
    <div className="w-[55%] mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Jobs</h1>
        <PostJob />
      </div>

      {jobs.length === 0 ? (
        <p className="text-gray-500 text-center mt-12">
          You haven't posted any jobs yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12">
          {jobs.map((job, i) => (
            <AnimatedCard job={job} index={i} key={job.id} />
          ))}
        </div>
      )}
    </div>
  );
}

// Separate component for animated card
function AnimatedCard({ job, index }: { job: JobResopnse; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      custom={index}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeUpVariant}
    >
      <Card className="p-4 shadow">
        <h2 className="text-lg font-semibold mb-1">{job.title}</h2>
        <p className="text-sm text-gray-600 mb-2 line-clamp-3">
          {job.description}
        </p>
        <div className="text-xs text-gray-500 space-y-1">
          <p>
            <strong>Skills:</strong> {job.skills}
          </p>
          <p>
            <strong>Budget:</strong> {job.budget} SOL
          </p>
          <p>
            <strong>Status:</strong> {job.status}
          </p>
          <p>
            <strong title={job.job_ipfs_hash} className="truncate max-w-[10rem]">Job IPFS hash:</strong> {job.job_ipfs_hash.slice(0, 20)}...
          </p>
        </div>
      </Card>
    </motion.div>
  );
}
