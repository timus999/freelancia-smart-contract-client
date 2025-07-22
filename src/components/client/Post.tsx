import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { PlusCircle } from "lucide-react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { createJob } from "@/api/job.ts";
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { Calendar } from "@/components/ui/calendar.tsx"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx"

const countries = [
  "United States", "Canada", "United Kingdom", "Germany",
  "France", "India", "Nepal", "Australia", "Japan", "Remote"
];

export default function PostJob() {
    const [date, setDate] = React.useState<Date>()
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      skills: "",
      budget: 0,
      location: "",
      job_type: "",
      job_ipfs_hash: "",
      deadline: "",
      category: "",
      status: "open",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const finalData = {
        ...data,
        budget: parseInt(data.budget),
        deadline: date,
      };
      await createJob(finalData);
      toast.success("Job posted successfully");
      reset();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-5 w-5" /> Post Job
        </Button>
      </DialogTrigger>

      <DialogContent className="backdrop-blur-md max-w-xl">
        <DialogHeader>
          <DialogTitle>Post a New Job</DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input {...register("title", { required: "Title is required" })} />
              {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea rows={3} {...register("description", { required: "Description is required" })} />
              {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="skills">Skills</Label>
                <Input placeholder="comma,separated" {...register("skills", { required: "Skills are required" })} />
                {errors.skills && <p className="text-red-500 text-sm">{errors.skills.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="budget">Budget (in SOL)</Label>
                <Input type="number" {...register("budget", { required: true, min: 0 })} />
                {errors.budget && <p className="text-red-500 text-sm">Budget must be non-negative</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Select onValueChange={(val) => setValue("location", val)} defaultValue="Remote">
                  <SelectTrigger className="my-border-input">
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="job_type">Job Type</Label>
                <Input {...register("job_type", { required: "Job type is required" })} />
                {errors.job_type && <p className="text-red-500 text-sm">{errors.job_type.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="job_ipfs_hash">IPFS Hash</Label>
                <Input {...register("job_ipfs_hash", { required: "IPFS hash is required" })} />
                {errors.job_ipfs_hash && <p className="text-red-500 text-sm">{errors.job_ipfs_hash.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="deadline">Deadline</Label>
  <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className="data-[empty=true]:text-muted-foreground w-auto justify-start text-left font-normal"
        >
          <CalendarIcon />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={setDate} />
      </PopoverContent>
    </Popover>                {errors.deadline && <p className="text-red-500 text-sm">{errors.deadline.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input {...register("category", { required: "Category is required" })} />
                {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Input {...register("status")} disabled value="open" />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Posting..." : "Post Job"}
            </Button>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
