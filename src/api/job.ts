import client from "./client.ts";

interface JobCreate{
        title: string;
      description: string;
      skills: string;
      budget: number;
      location: string;
      job_type: string;
      job_ipfs_hash: string;
      deadline: string;
      category: string;
      status: string;
}

interface CreateJobResponse {
    msg: string,
}

// interface JobResponse{
//    id: number;
//   title: string;
//   description: string;
//   skills: string;
//   budget: number;
//   location: string;
//   job_type: string;
//   job_ipfs_hash: string;
//   posted_at: string;
//   deadline: string;
//   category: string;
//   status: string;
// }


export const createJob = async (data: JobCreate): Promise<CreateJobResponse> => {

  const response = await client.post("/api/jobs/create", data);
  return response.data as CreateJobResponse;
};

export const fetchJobs = async (clientId: string) => {
  const response = await client.get("/api/jobs", {
          params: {
            client_id: clientId,
          },
  })
  return response.data;
}


interface JobQuery {
  id?:string,
  keyword?: string;
  min_budget?: number;
  max_budget?: number;
  skills?: string;
  job_type?: string;
  category?: string;
  status?: string;
  sort_by?: string;
  limit?: number;
  offset?: number;
}

export const getJobs = async (query: JobQuery) => {

  const params = new URLSearchParams();

    // Only append non-empty values
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== "" &&
        !(typeof value === "number" && isNaN(value))
      ) {
        params.append(key, String(value));
      }
    });
  }



   const response = await client.get(`/api/jobs?${params.toString()}`);
    return response.data;
}



export const applyToJob = async (jobId: number): Promise<void> => {
    const res = await client.post("/api/jobs/apply", {job_id : jobId});
    return res.data;
}

export const getJobApplicants = async (jobId: number) => {
    const res = await client.get(`/api/jobs/${jobId}/applicants`);
    return res.data;
}

export const approveFreelancer = async (applicationId: number) => {
    const res = await client.post(`/api/applications/approve`, { application_id: applicationId});
    return res.data;
}

interface EscrowNotification {
  applicationId: number,
  escrow_pda: string,
}

export const createEscrowNotification = async (data: EscrowNotification) => {
    const res = await client.post(`/api/jobs/create-escrow`, data);
    return res.data;
}

export interface MyJobsResponse {
    job_id: number,
    title: string,
    description: string,
    skills: string,
    budget: number,
    location: string,
    posted_at: string,
    deadline: string,
    client_id: number,
    applied_at: string,
    approved?: boolean,
    is_saved: number,
}

export const getMyJobs = async (): Promise<MyJobsResponse[]> => {
    const res = await client.get("/api/my-jobs");
    return res.data;
}
// export const getNotifications = async () => {
//   const res = await client.get("/api/notifications");
//   return res.data;
// };

// export const markAsRead = async (id: number) => {
//   await client.post("/api/notifications/mark-read", { id });
// };

// export type Notification = {
//   id: number;
//   user_id: number;
//   message: string;
//   read: boolean;
//   created_at: string;
//   redirect_url?: string;
// };

// export const fetchNotifications = async (): Promise<Notification[]> => {
//   const res = await client.get<Notification[]>("/api/notifications");
//   return res.data;
// };

// export const markAsRead = async (notificationId: number): Promise<void> => {
//   await client.post("/api/notifications/mark-read", { id: notificationId });
// };