import client from "./client.ts";

// Define interfaces for request/response types
interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  role: string;
}

interface ProfileResponse {
  // Define your profile response structure here
  // Example:
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface WalletConnect {
    wallet_address: string;
}

export interface WalletConnectResponse { 
  msg: string,
  wallet_user: boolean,
}
export interface WalletLoginData {
  wallet_address: string;
}

export interface WalletSignupData {
  wallet_address: string;
  role: "freelancer" | "client";
}

interface RequestNonce {
  wallet_address: string;
}

interface WalletVerify {
  wallet_address: string;
  nonce: string;
  signature: string;
}

interface UserProfileResponse {
  user_id: string,
  username: string
  role: "freelnacer" | "client",
  bio: string | undefined,
  skills: string | undefined,
  certifications: string | undefined,
  work_history: string | undefined,
  profile_ipfs_hash: string | undefined,
  created_at: string | undefined,
  updated_at: string | undefined,

}

export const login = async (data: LoginData): Promise<any> => {
  const response = await client.post("/api/login", data);
  return response.data;
};

export const signup = async (data: RegisterData): Promise<any> => {
  const response = await client.post("/api/signup", data);
  return response.data;
};

export const logout = async (): Promise<any> => {
  const response = await client.post("/api/logout");
  return response.data;
};

export const walletConnect = async (data: WalletConnect): Promise<WalletConnectResponse> => {
  const response = await client.post("/api/wallet/connect", data);
  return response.data;
};

export const walletLogin = async (data: WalletLoginData): Promise<any> => {
  const response = await client.post("/api/wallet/login", data);
  return response.data;
};

export const requestNonce = async (data: RequestNonce): Promise<any> => {
  const response = await client.post("/api/wallet/request-nonce", data);
  return response.data;
};

export const walletVerify = async (data: WalletVerify): Promise<any> => {
  const response = await client.post("/api/wallet/verify", data);
  return response.data;
};

export const walletSignup = async (data: WalletSignupData): Promise<any> => {
  const response = await client.post("/api/wallet/signup", data);
  return response.data;
};

export const getProfile = async (userId: string): Promise<UserProfileResponse> => {
  const response = await client.get(`/api/get-profile-userId/${userId}`);
  return response.data;
};
export const getProfileByUsername = async (username: string): Promise<UserProfileResponse> => {
  const response = await client.get(`/api/get-profile-username/${username}`);
  return response.data;
};

export const profileSubmit = async (data: any): Promise<any> => {
  const response = await client.post("/api/profile", data);
  return response.data;
};

export const checkUsername = async (username: string): Promise<any> => {
  const response = await client.get(`/api/username-availability?username=${username}`);
  return response.data;
};


export const freelancerProfile = async (): Promise<ProfileResponse> => {
  console.log("API Base URL:", import.meta.env.VITE_API_URL);
  console.log("Full URL:", `${import.meta.env.VITE_API_URL}/api/profile/basic`);
  console.log("Token:", localStorage.getItem("token"));
  
  try {
    const response = await client.get("/api/profile/basic");
    console.log("API Response:", response);
    return response.data as ProfileResponse;
  } catch (error) {
    console.error("API Error:", error);
    console.error("Error Response:", (error as any).response);
    throw error;
  }
};

export const clientProfile = async (): Promise<ProfileResponse> => {
  const response = await client.get("/api/profile/basic");
  return response.data as ProfileResponse;
};