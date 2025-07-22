import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Progress } from "@/components/ui/progress.tsx";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Eye, ArrowRight, Pencil } from "lucide-react";
import { getProfile } from "@/api/auth.ts";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");

    const fetchProfile = async () => {
      if (!userId) return;
      try {
        const res = await getProfile(userId);
        setProfile(res);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <motion.div
      className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 items-start"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }} 
    >
      {/* Left Column */}
      <Card className="md:col-span-1 p-4 flex flex-col items-center">
        {loading ? (
          <>
            <Skeleton className="h-20 w-20 rounded-full mt-4" />
            <Skeleton className="h-4 w-32 mt-4" />
            <Skeleton className="h-3 w-20 mt-2" />
            <Separator className="my-4 w-full" />
            <div className="space-y-2 w-full">
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </>
        ) : (
          <>
            <Avatar className="h-20 w-20 text-3xl mt-4">
              <AvatarFallback>
                {profile?.username?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="text-center mt-4">
              <h2 className="text-lg font-semibold flex items-center justify-center gap-2">
                {profile?.username}
                <Pencil className="w-4 h-4 cursor-pointer hover:text-primary transition" />
              </h2>
              <p className="text-sm text-muted-foreground">
                @{profile?.username?.toLowerCase()}
              </p>
            </div>
            <Separator className="my-4 w-full" />

            <div className="text-sm text-muted-foreground w-full grid grid-cols-[auto_1fr] gap-x-2 gap-y-3">
              <span>📍</span>
              <span>Located in Nepal</span>

              <span>🎭</span>
              <span>Role: {profile?.role}</span>

              <span>📅</span>
              <span>
                Joined on:{" "}
                {profile?.created_at
                  ? format(new Date(profile.created_at), "MMMM yyyy")
                  : "Unknown"}
              </span>

              {profile.role === "freelancer" &&(
                <>
              <span>🧠</span>
              <span className="flex items-center gap-2">
                Skills: {profile?.skills || "Not provided"}
                <Pencil className="w-4 h-4 cursor-pointer hover:text-primary transition" />
              </span>
              </>
              ) }

              {profile?.profile_ipfs_hash && (
                <>
                  <span>🖼️</span>
                  <a
                    href={`https://ipfs.io/ipfs/${profile.profile_ipfs_hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-blue-500"
                  >
                    View IPFS Profile
                  </a>
                </>
              )}
            </div>
          </>
        )}

        <div className="mt-6 space-y-2 w-full">
          <Button variant="outline" className="w-full flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Preview public profile
          </Button>
          <Button
            variant="secondary"
            className="w-full flex items-center justify-center gap-2"
          >
            Explore Freelancia
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <p className="mt-4 text-xs text-muted-foreground text-center">
          You’re currently on your <strong>{profile?.role}</strong> profile.
        </p>
      </Card>

      {/* Right Column */}
      <div className="md:col-span-2 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-semibold">
            👋 Let’s help freelancers get to know you
          </h1>
          <p className="text-muted-foreground">
            Get the most out of Freelancia by sharing more about yourself and how
            you prefer to work with freelancers.
          </p>
        </div>

        {/* Bio */}
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <div>
              <CardTitle>Bio</CardTitle>
            </div>
            {!loading && (
              <Pencil className="w-4 h-4 cursor-pointer hover:text-primary transition" />
            )}
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            {loading ? (
              <Skeleton className="h-16 w-full" />
            ) : profile?.bio ? (
              <p>{profile.bio}</p>
            ) : (
              <p className="italic text-muted">No bio provided yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Checklist */}
        <Card>
          <CardHeader>
            <CardTitle>Profile checklist</CardTitle>
            <Progress value={60} className="mt-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-4 border rounded-lg hover:bg-muted cursor-pointer transition">
              <div>
                <p className="font-medium">Share how you plan to use Freelancia</p>
                <p className="text-sm text-muted-foreground">
                  Tell us if you’re here to find services or offer them.
                </p>
              </div>
              <Button size="sm" variant="outline">
                Add
              </Button>
            </div>
            <div className="flex justify-between items-center p-4 border rounded-lg hover:bg-muted cursor-pointer transition">
              <div>
                <p className="font-medium">Set your communication preferences</p>
                <p className="text-sm text-muted-foreground">
                  Let freelancers know your collaboration preferences.
                </p>
              </div>
              <Button size="sm" variant="outline">
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

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
    </motion.div>
  );
}
