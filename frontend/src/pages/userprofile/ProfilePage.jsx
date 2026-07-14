import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { MapPin } from "lucide-react";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import ActivityCard from "../../components/common/ActivityCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import useFollow from "../../hooks/useFollow";
import userplaceholder from "../../img/user.png";
import { parseDuration, formatPace, computePRs } from "../../lib/metrics";
import { formatDuration } from "../../lib/formatTime";

export default function ProfilePage() {
  const [hamburger, setHamburger] = useState(true);
  const { id } = useParams();

  const { follow, isPending } = useFollow();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const { data: user, isLoading } = useQuery({
    queryKey: ["userProfile", id],
    queryFn: async () => {
      const res = await fetch(`/api/user/profile/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch user profile");
      return data;
    },
  });

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ["userActivities", id],
    queryFn: async () => {
      const res = await fetch(`/api/post/user/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch activities");
      return data;
    },
    enabled: !!id,
  });

  const isMyProfile = authUser?._id === user?._id;
  const amIFollowing = authUser?.following?.includes(user?._id);

  const prs = useMemo(() => computePRs(posts), [posts]);
  const totals = useMemo(() => {
    const list = posts || [];
    return {
      count: list.length,
      distance: list.reduce((s, p) => s + (Number(p.distance) || 0), 0),
      seconds: list.reduce((s, p) => s + parseDuration(p.time), 0),
    };
  }, [posts]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header hamburger={hamburger} setHamburger={setHamburger} />

      <main className="flex-1">
        {isLoading && (
          <div className="flex justify-center py-16">
            <LoadingSpinner size="lg" />
          </div>
        )}
        {!isLoading && !user && (
          <p className="mt-10 text-center text-lg text-gray-500">User not found</p>
        )}

        {!isLoading && user && (
          <div className="mx-auto grid max-w-container grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)_300px]">
            {/* Left: profile + social */}
            <aside className="space-y-6">
              <div className="card p-6 text-center">
                <img
                  src={user.profileImg || userplaceholder}
                  alt=""
                  className="mx-auto h-24 w-24 rounded-full object-cover ring-2 ring-gray-100"
                />
                <h2 className="mt-4 text-xl font-bold text-gray-800">
                  {user.firstname} {user.lastname}
                </h2>
                {user.bio && (
                  <p className="mt-1 flex items-center justify-center gap-1 text-sm text-gray-500">
                    <MapPin className="h-4 w-4" />
                    {user.bio}
                  </p>
                )}
                {!isMyProfile && (
                  <button
                    onClick={() => follow(user._id)}
                    disabled={isPending}
                    className={`mt-4 w-full ${amIFollowing ? "btn-outline" : "btn-primary"}`}
                  >
                    {isPending ? "..." : amIFollowing ? "Following" : "Follow"}
                  </button>
                )}
              </div>

              <div className="card p-6">
                <h3 className="section-title">Social Stats</h3>
                <div className="mt-3 grid grid-cols-2 text-center">
                  <div>
                    <p className="text-lg font-bold text-gray-800">{user.following?.length ?? 0}</p>
                    <p className="text-xs text-gray-500">Following</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-800">{user.followers?.length ?? 0}</p>
                    <p className="text-xs text-gray-500">Followers</p>
                  </div>
                </div>
              </div>
            </aside>

            {/* Center: real activities */}
            <div className="min-w-0 space-y-6">
              <h1 className="text-xl font-bold text-gray-800">Activities</h1>
              {postsLoading && (
                <div className="flex justify-center py-8">
                  <LoadingSpinner size="lg" />
                </div>
              )}
              {!postsLoading && (!posts || posts.length === 0) && (
                <div className="card p-8 text-center text-sm text-gray-400">
                  No activities yet.
                </div>
              )}
              {!postsLoading &&
                posts?.map((post) => (
                  <ActivityCard key={post._id} post={post} prLabels={prs[post._id]} />
                ))}
            </div>

            {/* Right: real totals */}
            <aside className="hidden lg:block">
              <div className="card p-6">
                <h3 className="section-title">Totals</h3>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Activities</span>
                    <span className="font-bold text-gray-800">{totals.count}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Distance</span>
                    <span className="font-bold text-gray-800">{totals.distance.toFixed(1)} km</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Time</span>
                    <span className="font-bold text-gray-800">{formatDuration(totals.seconds)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Avg pace</span>
                    <span className="font-bold text-gray-800">
                      {formatPace(totals.distance, totals.seconds)}
                    </span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
