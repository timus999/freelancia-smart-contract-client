import client from "./client.ts";


export const getJobUserStatus = async (jobId: number) => {
  const res = await client.get(`/api/jobs/${jobId}/status`);
  return res.data;
};

export const getMyJob = async (application_id: number) => {
  const res = await client.get(`/api/my_jobs/${application_id}`);
  return res.data;
};

interface DeliverablePayload {
  application_id: number,
  ipfs_hash: string,
}

export const submitDeliverable = async (data: DeliverablePayload) => {
  const res = await client.post(`/api/my_jobs/submit-deliverable`, data);
  return res.data;
};

interface ClaimTimeoutPayload {
  job_id: number,
}

export const claimTimeoutClient = async (data: ClaimTimeoutPayload) => {
  const res = await client.post(`/api/claim-timeout`, data);
  return res.data;
};