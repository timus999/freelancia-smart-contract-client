import client from "./client.ts";


export const getEscrow = async (escrow_pda: string) => {
  const res = await client.get(`/api/escrow/${escrow_pda}`);
  return res.data;
};

interface RaiseDisputPayload {
  job_id: number,
}
export const raiseDisputeArbiter = async (data: RaiseDisputPayload) => {
  const res = await client.post(`/api/raise-dispute`, data);
  return res.data;
};

interface ArbiterResolvePayload {
  job_id: number,
  resolved: boolean,
  application_id: number,
  client_id: number,
  freelancer_id: number,
}

export const arbiterResolveClient = async (data: ArbiterResolvePayload) => {
  const res = await client.post(`/api/handle-resolve`, data);
  return res.data;
};

export const getDisputedJobsForArbiter = async () => {
  const res = await client.get(`/api/get-disputed-jobs`);
  return res.data;
};