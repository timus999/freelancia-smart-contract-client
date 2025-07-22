import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getJobs, applyToJob } from "@/api/job.ts";
import { getJobUserStatus } from "@/api/freelancer.ts";
import { SidebarProfile } from "../dashbaord/SidebarProfile.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "../ui/button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

export const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleJobApply = async (jobId: number) => {
    try {
      await applyToJob(jobId);
      setApplied(true);
      toast.success("You've successfully applied to this job.");
    } catch (err) {
      toast.error("Failed to apply for this job.");
    }
  };

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await getJobs({ id });
        setJob(res.jobs[0]);
      } catch (err) {
        console.error("Failed to fetch job", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchJobStatus = async () => {
      try {
        const res = await getJobUserStatus(Number(id));
        setApplied(res.applied);
        setSaved(res.saved);
      } catch (err) {
        console.error("Failed to fetch job status", err);
      }
    };

    fetchJob();
    fetchJobStatus();
  }, [id]);

  if (loading) return <div className="text-center p-8">Loading job...</div>;
  if (!job)
    return <div className="text-center p-8 text-red-500">Job not found</div>;

  return (
    <motion.div
      className="max-w-5xl mx-auto p-8 grid md:grid-cols-3 gap-6"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Job Information */}
      <motion.div
        className="md:col-span-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <Card>
          <CardHeader>
            <div className="text-sm text-muted-foreground">
              Posted {job.posted_at}
            </div>
            <CardTitle className="text-2xl font-bold mt-1">
              {job.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{job.description}</p>

            <div className="flex flex-wrap gap-2">
              {job.skills.split(",").map((skill: string) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mt-4">
              <div>
                <span className="font-medium text-foreground">Budget:</span>{" "}
                {job.budget} SOL
              </div>
              <div>
                <span className="font-medium text-foreground">Location:</span>{" "}
                {job.location}
              </div>
              <div>
                <span className="font-medium text-foreground">Deadline:</span>{" "}
                {job.deadline}
              </div>
              <div>
                <span className="font-medium text-foreground">Category:</span>{" "}
                {job.category}
              </div>
              <div>
                <span className="font-medium text-foreground">Status:</span>{" "}
                {job.status}
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Button onClick={() => handleJobApply(job.id)} disabled={applied}>
                {applied ? "Applied" : "Apply"}
              </Button>

              <Button variant="outline" disabled={saved}>
                {saved ? "Saved" : "Save"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Sidebar */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <SidebarProfile id={job.client_id} />
      </motion.div>
    </motion.div>
  );
};
