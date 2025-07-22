// components/JobCard.tsx
import { Badge } from "@/components/ui/badge.tsx";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";


const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

export const JobCard = ({ job, index }: { job: any, index: any }) => {
  const skills = job.skills.split(',');

    const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/jobs/${job.id}`);
  }

  return (
        <motion.div
      ref={ref}
      custom={index}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeUpVariant}
    >
  <div onClick={handleClick} className="bg-card border border-border rounded-lg p-4 space-y-3 shadow-sm">
    <div className="text-xs text-muted-foreground">
      Posted {job.posted_at}
    </div>
    <h3 className="text-lg font-semibold">{job.title}</h3>
    <p className="text-sm text-muted-foreground line-clamp-3">{job.description}</p>

    <div className="flex flex-wrap gap-2 mt-2">
      {
        skills.map((skill: string) => (
        <Badge key={skill} variant="secondary">{skill}</Badge>
      ))}
    </div>

    <div className="text-xs text-muted-foreground flex justify-between mt-2">
      <div>{job.payment}</div>
      <div>{job.location}</div>
    </div>
  </div>
      </motion.div>
  )
};
