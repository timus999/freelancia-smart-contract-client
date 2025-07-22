import client from "./client.ts";


export const getJobUserStatus = async (jobId: number) => {
  const res = await client.get(`/api/jobs/${jobId}/status`);
  return res.data;
};