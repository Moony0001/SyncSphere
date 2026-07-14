import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Bike, Footprints, Heart, MessageCircle, Trophy } from "lucide-react";
import userplaceholder from "../../img/user.png";
import { parseDuration, formatPace, formatSpeed } from "../../lib/metrics";
import { formatDuration } from "../../lib/formatTime";

function Stat({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="mt-0.5 text-base font-bold text-gray-800">{value}</p>
    </div>
  );
}

export default function ActivityCard({ post, prLabels = [] }) {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const [likes, setLikes] = useState(post.likes || []);

  const seconds = parseDuration(post.time);
  const distance = Number(post.distance) || 0;
  const author = post.user || {};
  const isOwn = author._id === authUser?._id;
  const isLiked = likes.map(String).includes(authUser?._id);

  const SportIcon = post.sport === "Cycling" ? Bike : Footprints;

  const date = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  const { mutate: like, isPending } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/post/like/${post._id}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to like");
      return data; // updated likes array
    },
    onSuccess: (updated) => Array.isArray(updated) && setLikes(updated),
  });

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <Link to={`/profile/${author._id}`}>
          <img
            src={author.profileImg || userplaceholder}
            alt=""
            className="h-10 w-10 rounded-full object-cover"
          />
        </Link>
        <div className="min-w-0">
          <Link to={`/profile/${author._id}`} className="font-semibold text-gray-800 hover:text-brand">
            {author.firstname} {author.lastname}
          </Link>
          <p className="text-xs text-gray-400">
            {date} · {post.sport}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="px-4">
        <div className="flex items-center gap-2">
          <SportIcon className="h-5 w-5 text-brand" />
          <h2 className="text-lg font-semibold text-gray-800">{post.title}</h2>
        </div>
        {post.text && <p className="mt-1 text-sm text-gray-500">{post.text}</p>}

        {/* PR badges */}
        {prLabels.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {prLabels.map((label) => (
              <span
                key={label}
                className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-600"
              >
                <Trophy className="h-3.5 w-3.5" />
                {label}
              </span>
            ))}
          </div>
        )}

        <div className="mt-3 grid grid-cols-4 gap-2">
          <Stat label="Distance" value={`${distance.toFixed(2)} km`} />
          <Stat label="Time" value={formatDuration(seconds)} />
          <Stat label="Pace" value={formatPace(distance, seconds)} />
          <Stat label="Speed" value={formatSpeed(distance, seconds)} />
        </div>
      </div>

      {post.img && (
        <img src={post.img} alt="Route" className="mt-3 h-56 w-full object-cover" />
      )}

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Heart className={`h-4 w-4 ${isLiked ? "fill-brand text-brand" : ""}`} />
          {likes.length} {likes.length === 1 ? "kudos" : "kudos"}
        </div>
        <div className="flex items-center gap-1">
          {!isOwn && (
            <button
              onClick={() => like()}
              disabled={isPending}
              aria-label="Give kudos"
              className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-brand"
            >
              <Heart className={`h-5 w-5 ${isLiked ? "fill-brand text-brand" : ""}`} />
            </button>
          )}
          <div className="flex items-center gap-1 rounded-full px-2 py-1 text-sm text-gray-500">
            <MessageCircle className="h-5 w-5" />
            {post.comments?.length || 0}
          </div>
        </div>
      </div>
    </div>
  );
}
