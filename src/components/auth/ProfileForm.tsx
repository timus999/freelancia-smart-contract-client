import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input.tsx";
import { Button } from "../ui/button.tsx";
import { Textarea } from "../ui/textarea.tsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { checkUsername } from "@/api/auth.ts";

// Define Zod schema
const profileSchema = z.object({
  username: z.string().min(3),
  bio: z.string().optional(),
  role: z.enum(["freelancer", "client"]),
  skills: z.string().optional(),
  certifications: z.string().optional(),
  work_history: z.string().optional(),
  profile_ipfs_hash: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const defaultValues: Partial<ProfileFormData> = {
  bio: "",
  certifications: "",
  work_history: "",
};


export function ProfileForm({
  onSubmit,
  role,
}: {
  onSubmit: (data: ProfileFormData) => void;
  role: "freelancer" | "client";
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { role },
  });

  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);

  const handleUsernameCheck = async (username: string) => {
    if (username.length < 3) return;
    const res = await checkUsername(username);
    setUsernameAvailable(res.available);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl mx-auto">
      {/* Username */}
      <div>
        <Label htmlFor="username">Username</Label>
        <Input
          {...register("username")}
          onChange={(e: any) => {
            register("username").onChange(e);
            handleUsernameCheck(e.target.value);
          }}
        />
        {usernameAvailable === false && (
          <p className="text-sm text-red-500">Username is already taken</p>
        )}
        {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
      </div>

      {/* Bio */}
      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea {...register("bio")} placeholder="Write a short bio..." />
      </div>

      {/* Role (hidden) */}
      <input type="hidden" value={role} {...register("role")} />

      {/* Conditional Fields */}
      {role === "freelancer" && (
        <>
          <div>
            <Label htmlFor="skills">Skills (comma-separated)</Label>
            <Input {...register("skills")} placeholder="e.g., Rust, React, Solidity" />
          </div>

          <div>
            <Label htmlFor="certifications">Certifications</Label>
            <Textarea {...register("certifications")} placeholder="List certifications..." />
          </div>

          <div>
            <Label htmlFor="work_history">Work History</Label>
            <Textarea {...register("work_history")} placeholder="Describe your past work..." />
          </div>
        </>
      )}

      {/* IPFS Hash */}
      <div>
        <Label htmlFor="profile_ipfs_hash">Profile Picture (IPFS Hash)</Label>
        <Input {...register("profile_ipfs_hash")} placeholder="Qm..." />
      </div>

      <Button type="submit" className="w-full">
        Save Profile
      </Button>
    </form>
  );
}
