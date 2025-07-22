import ClientDashboard from "./ClientDashboard.tsx";
import FreelancerDashboard from "./FreelancerDashboard.tsx";
import { useAuth } from "@/context/AuthContext.tsx";

export default function Dashboard() {
  
  const { role } = useAuth();
  return role === "freelancer" ? 
  ( <><FreelancerDashboard/></>) : (<> <ClientDashboard /> </>);
}