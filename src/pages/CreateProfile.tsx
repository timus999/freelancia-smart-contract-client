import { useEffect, useState } from "react";
import { ProfileForm } from "@/components/auth/ProfileForm.tsx";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { profileSubmit } from "@/api/auth.ts";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


export default function CreateProfile() {
  const [role, setRole] = useState<"freelancer" | "client" | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const storedRole = localStorage.getItem("role") as "freelancer" | "client" | null;
    setRole(storedRole);
  }, []);

  const handleProfileSubmit = async (data: any) => {
    console.log("Submit:", data);
    try{
    await profileSubmit(data);
    toast.success("Profile created successfully");
    navigate('/dashboard')
    }catch(err){
      toast.error("Failed to create profile");
    }
  
  };

  if (!role) {
    return (
      <div className="max-w-xl mx-auto mt-20 space-y-3">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
      </div>
    );
  }

  return (
    <motion.div
      className="px-4 py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl font-semibold text-center mb-6">
        {role === "freelancer" ? "Freelancer Profile" : "Client Profile"}
      </h2>
      <ProfileForm onSubmit={handleProfileSubmit} role={role} />
    </motion.div>
  );
}
