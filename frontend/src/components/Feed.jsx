import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import ActivityCard from "./common/ActivityCard";
import Middle from "./Middle";
import LoadingSpinner from "./common/LoadingSpinner";
import { computePRs } from "../lib/metrics";

export default function Feed() {
  const { data: activities, isLoading } = useQuery({
    queryKey: ["myActivities"],
    queryFn: async () => {
      const res = await fetch("/api/post/myactivities");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch activities");
      return data;
    },
  });

  const prs = useMemo(() => computePRs(activities), [activities]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Your Activities</h1>
        <Link to="/post/create">
          <button className="btn-primary">Record Activity</button>
        </Link>
      </div>

      {isLoading && (
        <div className="flex justify-center py-10">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {!isLoading && (!activities || activities.length === 0) && <Middle />}

      {!isLoading &&
        activities?.map((post) => (
          <ActivityCard key={post._id} post={post} prLabels={prs[post._id]} />
        ))}
    </div>
  );
}
