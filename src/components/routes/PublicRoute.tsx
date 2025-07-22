import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.tsx";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
     const { isAuthenticated } = useAuth();
    if (isAuthenticated) {
      return <Navigate to="/dashboard" replace />;
    }
  
    return children;
};

export default PublicRoute;
