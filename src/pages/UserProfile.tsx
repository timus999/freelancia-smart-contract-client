import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { format } from "date-fns";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProfileByUsername } from "@/api/auth.ts";

export default function UserProfile() {
  const { username } = useParams();
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user_id = localStorage.getItem("user_id");

   useEffect(() => {

    if (profile?.user_id && user_id === profile.user_id) {
      navigate("/profile", { replace: true });
    }
  }, [username, profile?.user_id, navigate]);


  useEffect(() => {
    async function load() {
      try {
        if (!username) return;
        const res = await getProfileByUsername(username);
        setProfile(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [username]);

  if (loading) {
    return (
      <motion.div
        className="max-w-6xl mx-auto p-6"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Skeleton className="h-32 w-32 rounded-full" />
        <Skeleton className="h-4 w-48 mt-4" />
        <Skeleton className="h-3 w-32 mt-2" />
        <Skeleton className="h-3 w-3/4 mt-4" />
      </motion.div>
    );
  }

  return (
    <motion.div
      className="max-w-6xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Left Main Column */}
      <div className="flex-1 space-y-8">
        {/* Header Section */}
        <div className="flex items-start gap-6">
          <Avatar className="h-24 w-24 text-4xl">
            <AvatarFallback>
              {profile?.username?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-semibold">{profile?.username}</h1>
            <p className="text-muted-foreground">@{profile?.username?.toLowerCase()}</p>
            <p className="mt-2 text-gray-700">{profile?.role || "Not set yet"}</p>
            <div className="text-sm text-gray-500 mt-1">📍 Nepal · 🗣 English</div>
          </div>
        </div>

        {/* Bio */}
        <div>
          <h2 className="text-lg font-semibold mb-2">About me</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            {profile?.bio || "This user hasn't written a bio yet."}
          </p>
        </div>

        {/* Skills */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {(profile?.skills?.split(",") || []).map((skill: string) => (
              <span
                key={skill}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {skill.trim()}
              </span>
            ))}
          </div>
        </div>

        {/* Clients or IPFS */}
        {profile?.profile_ipfs_hash && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Profile Media</h2>
            <a
              href={`https://ipfs.io/ipfs/${profile.profile_ipfs_hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-500 text-sm"
            >
              View IPFS profile
            </a>
          </div>
        )}

        {/* Work History */}
        {profile?.work_history && (
          <Card>
            <CardHeader>
              <CardTitle>Work History</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground whitespace-pre-line">
              {profile.work_history}
            </CardContent>
          </Card>
        )}

        {/* Reviews */}
        <Card>
          <CardHeader>
            <CardTitle>Reviews from Clients</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-muted-foreground space-y-2 p-10">
            <div className="text-3xl">⭐️⭐️⭐️⭐️⭐️</div>
            <p className="text-center">
              {profile?.username || "User"} doesn’t have any reviews yet.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Right Sidebar */}
      <div className="w-full lg:w-72">
        <Card className="bg-secondary border p-4 shadow-sm">
          <p className="text-sm font-medium">🕒 Joined</p>
          <p className="text-sm">
            {profile?.created_at
              ? format(new Date(profile.created_at), "MMMM yyyy")
              : "Unknown"}
          </p>
          <Separator />
          <p className="text-sm font-medium">Role</p>
          <p className="text-sm">
            {profile?.role || "User"}
          </p>
          <Separator/>
          <p className="text-sm font-medium">Languages</p>
          <p className="text-sm">English</p>
        </Card>
      </div>
    </motion.div>
  );
}
