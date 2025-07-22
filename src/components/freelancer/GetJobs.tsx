import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card } from "@/components/ui/card.tsx";
import { Loader2, Filter } from "lucide-react";
import { getJobs } from "@/api/job.ts";

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

export default function GetJobs() {
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

  const fetchJobs = async () => {
    setLoading(true);
    try {

        // Remove empty values from filters
      const cleanedFilters: Record<string, string> = {};
      for (const key in filters) {
        const value = filters[key as keyof typeof filters];
        if (value !== "" && value !== undefined && value !== null) {
          cleanedFilters[key] = value;
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

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen relative">
      {/* Spinner Overlay */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70">
          <Loader2 className="h-10 w-10 text-gray-600 animate-spin" />
        </div>
      )}

      <div className={`max-w-6xl mx-auto ${loading ? 'pointer-events-none opacity-30' : ''}`}>
        <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Input name="keyword" placeholder="Keyword..." value={filters.keyword} onChange={handleChange} />
            <Input name="skills" placeholder="Skills..." value={filters.skills} onChange={handleChange} />
            <Input name="min_budget" placeholder="Min Budget" type="number" value={filters.min_budget} onChange={handleChange} />
            <Input name="max_budget" placeholder="Max Budget" type="number" value={filters.max_budget} onChange={handleChange} />
            <select name="job_type" value={filters.job_type} onChange={handleChange} className="p-2 rounded border">
              <option value="">Job Type</option>
              <option value="remote">Remote</option>
              <option value="onsite">Onsite</option>
              <option value="hybrid">Hybrid</option>
            </select>
            <select name="category" value={filters.category} onChange={handleChange} className="p-2 rounded border">
              <option value="">Category</option>
              <option value="web">Web</option>
              <option value="design">Design</option>
              <option value="ai">AI</option>
              <option value="marketing">Marketing</option>
            </select>
            <select name="status" value={filters.status} onChange={handleChange} className="p-2 rounded border">
              <option value="">Status</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
            <select name="sort_by" value={filters.sort_by} onChange={handleChange} className="p-2 rounded border">
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
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.length === 0 ? (
            <p className="text-center col-span-full text-gray-500">No jobs found.</p>
          ) : (
            jobs.map((job) => (
              <Card key={job.id} className="p-4 shadow">
                <h3 className="font-bold text-lg mb-1">{job.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{job.description.slice(0, 100)}...</p>
                <div className="text-sm">
                  <span className="block mb-1"><strong>Budget:</strong> ${job.budget}</span>
                  <span className="block"><strong>Type:</strong> {job.job_type}</span>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
