import { useEffect, useState } from "react";
import { getProfile } from "@/api/auth.ts";
import { Skeleton } from "../ui/skeleton.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.tsx";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const SidebarProfile = ({ id }: { id: string }) => {
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;
      try {
        const res = await getProfile(id);
        setProfile(res);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  return (
    <>
      {loading ? (
        <>
          <Skeleton className="h-20 w-20 rounded-full mt-4 mx-auto" />
          <Skeleton className="h-4 w-32 mt-4 mx-auto" />
          <Skeleton className="h-3 w-20 mt-2 mx-auto" />
          <Separator className="my-4 w-full" />
          <div className="space-y-2 w-full">
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </>
      ) : (
        <motion.div
          className="bg-card border border-border p-4 rounded-2xl space-y-4 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate(`/profile/${profile.username}`)}
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          title="Visit profile"
        >
          <div className="flex flex-col items-center space-y-2">
            <Avatar className="h-20 w-20 text-3xl mt-4">
              <AvatarFallback>
                {profile?.username?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="font-medium text-center">{profile.username}</div>
            <div className="text-sm text-muted-foreground text-center">{profile.bio}</div>
            <div className="text-xs text-green-600">Online for messages</div>
          </div>

          <div className="text-xs text-muted-foreground border-t pt-4 space-y-2 text-center">
            <div>🚀 Promote with Ads</div>
            <div>🔗 Connects: 40</div>
            <div>⚙️ Preferences</div>
          </div>
        </motion.div>
      )}
    </>
  );
};
