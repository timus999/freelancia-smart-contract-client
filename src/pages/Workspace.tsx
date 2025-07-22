import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";
import { Heart, CheckCircle, Briefcase } from "lucide-react";
import { getMyJobs, MyJobsResponse } from "@/api/job.ts";
import { toast } from "react-toastify";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { useAuth } from "@/context/AuthContext.tsx";
import { useNavigate } from "react-router-dom";


const jobStatusIcons = {
  saved: <Heart className="text-pink-500" />,
  applied: <Briefcase className="text-blue-500" />,
  approved: <CheckCircle className="text-green-600" />,
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

  const handleClick = (jobId: number, approved?: boolean) => {
    if (!approved)  navigate(`/jobs/${jobId}`);
  }

  const filteredJobs = jobs.filter((job) => {
    if (role === "freelancer") {
      if (filter === "saved") return job.is_saved === 1;
      if (filter === "approved") return job.approved === true;
      return true;
    } else {
      return job.approved === true;
    }
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {role === "freelancer" && (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="flex justify-center mb-6 flex-wrap gap-2">
            <TabsTrigger value="all" onClick={() => setFilter("all")}>All</TabsTrigger>
            <TabsTrigger value="saved" onClick={() => setFilter("saved")}>Saved</TabsTrigger>
            <TabsTrigger value="approved" onClick={() => setFilter("approved")}>Approved</TabsTrigger>
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
                    <Card className="hover:shadow-lg transition-shadow" onClick={() => handleClick(job.job_id, job.approved)}>
                      <CardHeader className="flex flex-row justify-between items-start gap-4">
                        <div>
                          <CardTitle className="text-lg font-semibold text-primary">
                            {job.title}
                          </CardTitle>
                          <p className="text-muted-foreground text-sm line-clamp-2">{job.description}</p>
                        </div>
                        {job.approved ? jobStatusIcons.approved : job.is_saved === 1 ? jobStatusIcons.saved : jobStatusIcons.applied}
                      </CardHeader>
                      <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs text-muted-foreground">
                        <span><strong>Budget:</strong> ${job.budget}</span>
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

      {role === "client" && (
        <div className="grid gap-4">
          <h2 className="text-2xl font-bold mb-4">Approved Jobs</h2>
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))
          ) : filteredJobs.length === 0 ? (
            <p className="text-center text-muted-foreground">No approved jobs yet.</p>
          ) : (
            filteredJobs.map((job, index) => (
              <motion.div
                key={job.job_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-primary">
                      {job.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {job.description}
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
