import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input.tsx";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { getJobs } from "@/api/job.ts";
import { Banner } from "@/components/dashbaord/Banner.tsx";
import { JobCard } from "@/components/dashbaord/JobCard.tsx";
import { motion, AnimatePresence} from "framer-motion";

type Job = {
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
  client_id: number;
  category: string;
  status: string;
};




export default function FreelancerDashboard() {
  const [filters, setFilters] = useState({
    keyword: "",
    min_budget: "",
    max_budget: "",
    skills: "",
    job_type: "",
    category: "",
    status: "",
    sort_by: "posted_at:DESC",
  });

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filterRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchJobs = async () => {
    setLoading(true);
    setShowFilters(false);
    try {
      const cleanedFilters: Record<string, string> = {};
      for (const key in filters) {
        const value = filters[key as keyof typeof filters];
        if (value !== "" && value !== undefined && value !== null) {
          cleanedFilters[key] = value.trim();
        }
      }
      const response = await getJobs(cleanedFilters);
      setJobs(response.jobs || []);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") fetchJobs();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Click outside closes the filter
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setShowFilters(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 grid md:grid-cols-4 gap-6 relative">
      {/* Main Area */}
      <div className="md:col-span-full space-y-6">
        <Banner />

        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            name="keyword"
            value={filters.keyword}
            onFocus={() => setShowFilters(true)}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Search for jobs"
            className="w-full border rounded-md px-4 py-2 pr-10"
          />
          <Search
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
            onClick={fetchJobs}
          />
          <AnimatePresence>
          {showFilters && (
              <motion.div
              ref={filterRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-40 mt-2 w-full bg-white shadow-lg border rounded-lg p-4"
    >
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Input
                  name="skills"
                  placeholder="Skills"
                  value={filters.skills}
                  onChange={handleChange}
                />
                <Input
                  name="min_budget"
                  placeholder="Min Budget"
                  type="number"
                  value={filters.min_budget}
                  onChange={handleChange}
                />
                <Input
                  name="max_budget"
                  placeholder="Max Budget"
                  type="number"
                  value={filters.max_budget}
                  onChange={handleChange}
                />
                <select
                  className="p-2 rounded border"
                  name="job_type"
                  value={filters.job_type}
                  onChange={handleChange}
                >
                  <option value="">Job Type</option>
                  <option value="remote">Remote</option>
                  <option value="onsite">Onsite</option>
                  <option value="hybrid">Hybrid</option>
                </select>
                <select
                  className="p-2 rounded border"
                  name="category"
                  value={filters.category}
                  onChange={handleChange}
                >
                  <option value="">Category</option>
                  <option value="web">Web</option>
                  <option value="design">Design</option>
                  <option value="ai">AI</option>
                  <option value="marketing">Marketing</option>
                </select>
                <select
                  className="p-2 rounded border"
                  name="status"
                  value={filters.status}
                  onChange={handleChange}
                >
                  <option value="">Status</option>
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
                <select
                  className="p-2 rounded border"
                  name="sort_by"
                  value={filters.sort_by}
                  onChange={handleChange}
                >
                  <option value="posted_at:DESC">Newest</option>
                  <option value="budget:ASC">Budget ↑</option>
                  <option value="budget:DESC">Budget ↓</option>
                  <option value="deadline:ASC">Deadline ↑</option>
                  <option value="deadline:DESC">Deadline ↓</option>
                </select>
              </div>

              <Button className="mt-4 flex items-center gap-2" onClick={fetchJobs}>
                <Filter size={16} />
                Filter Jobs
              </Button>
            </motion.div>
          )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-4 border-b pb-2 text-sm font-medium">
          <button className="text-primary border-b-2 border-primary pb-1">Best Matches</button>
          <button className="text-muted-foreground">Most Recent</button>
          <button className="text-muted-foreground">Saved Jobs</button>
        </div>

        { jobs.length === 0 ? (
            <p className="text-center col-span-full text-gray-500 mt-12">No jobs found.</p>
          ) : (
              <motion.div
          className="space-y-4 mt-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.1 },
            },
          }}
        >
   
          {jobs.map((job, idx) => (
              <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
            <JobCard key={job.id} job={job} index={idx} /> 
            </motion.div>
          ))}
        </motion.div>
          )
        }
      </div>
    </div>
  );
}



