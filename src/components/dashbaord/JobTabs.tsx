import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx"
import { useState } from "react"
import JobList from "./JobList.tsx"

const JobTabs = () => {
  const [category, setCategory] = useState("best-matches")

  return (
    <Tabs
      value={category}
      onValueChange={setCategory}
      className="w-full"
    >
      <TabsList className="mb-4">
        <TabsTrigger value="best-matches">Best Matches</TabsTrigger>
        <TabsTrigger value="most-recent">Most Recent</TabsTrigger>
        <TabsTrigger value="saved-jobs">Saved Jobs</TabsTrigger>
      </TabsList>

      <TabsContent value="best-matches">
        <JobList category="best-matches" />
      </TabsContent>
      <TabsContent value="most-recent">
        <JobList category="most-recent" />
      </TabsContent>
      <TabsContent value="saved-jobs">
        <JobList category="saved-jobs" />
      </TabsContent>
    </Tabs>
  )
}

export default JobTabs
