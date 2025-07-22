import { useInfiniteQuery } from "@tanstack/react-query"
import axios from "axios"
import { useEffect, useRef, useCallback } from "react"

const fetchJobs = async ({ pageParam = 1, queryKey }) => {
  const [, category] = queryKey
  const res = await axios.get(`/api/jobs?category=${category}&page=${pageParam}`)
  return res.data
}

const JobList = ({ category }: { category: string }) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["jobs", category],
    queryFn: fetchJobs,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined
    },
  })

  const loadMoreRef = useRef(null)

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [target] = entries
    if (target.isIntersecting && hasNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, fetchNextPage])

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { threshold: 1.0 })
    const current = loadMoreRef.current
    if (current) observer.observe(current)
    return () => {
      if (current) observer.unobserve(current)
    }
  }, [handleObserver])

  if (status === "loading") return <p>Loading jobs...</p>
  if (status === "error") return <p>Error loading jobs</p>

  return (
    <div className="space-y-4">
      {data.pages.map((page, i) =>
        page.jobs.map((job: any) => (
          <div key={job.id} className="border rounded p-4 shadow-sm">
            <h3 className="font-semibold text-lg">{job.title}</h3>
            <p className="text-muted-foreground">{job.description}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {job.skills.map((skill: string) => (
                <span
                  key={skill}
                  className="bg-muted text-xs px-2 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))
      )}
      <div ref={loadMoreRef} className="h-10 flex justify-center items-center">
        {isFetchingNextPage && <span>Loading more...</span>}
      </div>
    </div>
  )
}

export default JobList
