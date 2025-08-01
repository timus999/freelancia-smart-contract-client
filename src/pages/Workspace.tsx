import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";
import { Heart, CheckCircle, Briefcase, ShieldCheck } from "lucide-react";
import { getMyJobs, MyJobsResponse } from "@/api/job.ts";
import { toast } from "react-toastify";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { useAuth } from "@/context/AuthContext.tsx";
import { useNavigate } from "react-router-dom";


const jobStatusIcons = {
  saved: <Heart className="text-pink-500" />,
  applied: <Briefcase className="text-blue-500" />,
  approved: <CheckCircle className="text-green-600" />,
  completed: <ShieldCheck className="text-green-900" />,
};

export default function FreelancerJobPage() {
  const [filter, setFilter] = useState("all");
  const [jobs, setJobs] = useState<MyJobsResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const { role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        const res = await getMyJobs();
        setJobs(res);
      } catch (err) {
        toast.error("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchMyJobs();
  }, []);

const handleClick = (id: number, approved?: boolean) => {
  if (role === "freelancer") {
    approved ? navigate(`/my-workspace/${id}`) : navigate(`/jobs/${id}`);
  }
};

const clientWork = (id: number) => {
  if (role === "client") {
    navigate(`/my-jobs/${id}`);
  }
};

const filteredJobs = jobs.filter((job) => {
  if (role === "freelancer") {
    if (filter === "saved") return job.is_saved === 1;
    if (filter === "approved") return job.approved;
    if (filter === "completed") return job.status === "completed";
    return true;
  }

  // Client filtering
  if (role === "client") {
    if (filter === "approved") return job.approved && job.status !== "completed"; 
    if (filter === "completed") return job.status === "completed";
    return true;
  }

  return false;
});

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {role === "freelancer" && (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="flex justify-center mb-6 flex-wrap gap-2">
            <TabsTrigger value="all" onClick={() => setFilter("all")}>All</TabsTrigger>
            <TabsTrigger value="saved" onClick={() => setFilter("saved")}>Saved</TabsTrigger>
            <TabsTrigger value="approved" onClick={() => setFilter("approved")}>Approved</TabsTrigger>
            <TabsTrigger value="completed" onClick={() => setFilter("completed")}>Completed</TabsTrigger>

          </TabsList>
          <TabsContent value={filter}>
            <div className="grid gap-4">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 rounded-xl" />
                ))
              ) : filteredJobs.length === 0 ? (
                <p className="text-center text-muted-foreground">No jobs found.</p>
              ) : (
                filteredJobs.map((job, index) => (
                  <motion.div
                    key={job.job_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow" onClick={() => handleClick(job.application_id, job.approved)}>
                      <CardHeader className="flex flex-row justify-between items-start gap-4">
                        <div>
                          <CardTitle className="text-lg font-semibold text-primary">
                            {job.title}
                          </CardTitle>
                          <p className="text-muted-foreground text-sm line-clamp-2">{job.description}</p>
                        </div>
                        {job.status === "completed" ? jobStatusIcons.completed : job.approved ? jobStatusIcons.approved : job.is_saved === 1 ? jobStatusIcons.saved : jobStatusIcons.applied}
                      </CardHeader>
                      <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs text-muted-foreground">
                        <span><strong>Budget:</strong> {job.budget} SOL</span>
                        <span><strong>Location:</strong> {job.location}</span>
                        <span><strong>Skills:</strong> {job.skills}</span>
                        <span><strong>Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}</span>
                      </CardContent>
                    </Card>
                  </motion.div>

                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}

      {role === "client"  && (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="flex justify-center mb-6 flex-wrap gap-2">
            <TabsTrigger value="all" onClick={() => setFilter("all")}>All</TabsTrigger>
            <TabsTrigger value="approved" onClick={() => setFilter("approved")}>Approved</TabsTrigger>
            <TabsTrigger value="completed" onClick={() => setFilter("completed")}>Completed</TabsTrigger>

          </TabsList>
          <TabsContent value={filter}>
            <div className="grid gap-4">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 rounded-xl" />
                ))
              ) : filteredJobs.length === 0 ? (
                <p className="text-center text-muted-foreground">No jobs found.</p>
              ) : (
                filteredJobs.map((job, index) => (
                  <motion.div
                    key={job.job_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow" onClick={() => clientWork(job.job_id)}>
                      <CardHeader className="flex flex-row justify-between items-start gap-4">
                        <div>
                          <CardTitle className="text-lg font-semibold text-primary hover:text-green-600 hover:underline cursor-pointer">
                            {job.title}
                          </CardTitle>
                          <p className="text-muted-foreground text-sm line-clamp-2">{job.description}</p>
                        </div>
                        {job.status === "completed" ? jobStatusIcons.completed : jobStatusIcons.approved }
                      </CardHeader>
                      <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs text-muted-foreground">
                        <span><strong>Budget:</strong> {job.budget} SOL</span>
                        <span><strong>Location:</strong> {job.location}</span>
                        <span><strong>Skills:</strong> {job.skills}</span>
                        <span><strong>Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}</span>
                      </CardContent>
                    </Card>
                  </motion.div>

                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
