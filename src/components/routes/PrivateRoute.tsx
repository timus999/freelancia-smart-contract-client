import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.tsx";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {

    const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
