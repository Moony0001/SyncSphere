import React from "react";
import { Bike, Heart, MessageCircle, ThumbsUp } from "lucide-react";
import map from "../../img/map.png";

function Stat({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="mt-0.5 text-base font-bold text-gray-800">{value}</p>
    </div>
  );
}

const Post = () => {
  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand font-bold text-white">
          S
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">Sid B</h3>
          <p className="text-xs text-gray-400">2 September 2024 · Gird Tahsil, Madhya Pradesh</p>
        </div>
      </div>

      {/* Body */}
      <div className="px-4">
        <div className="flex items-center gap-2">
          <Bike className="h-5 w-5 text-brand" />
          <h2 className="text-lg font-semibold text-gray-800">Random ride</h2>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-4">
          <Stat label="Distance" value="6.44 km" />
          <Stat label="Elev Gain" value="69 m" />
          <Stat label="Time" value="27m 4s" />
        </div>
      </div>

      <img src={map} alt="Route map" className="mt-3 h-52 w-full object-cover" />

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <ThumbsUp className="h-4 w-4 text-brand" />
          1 kudos
        </div>
        <div className="flex gap-1">
          <button className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-brand">
            <Heart className="h-5 w-5" />
          </button>
          <button className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-brand">
            <MessageCircle className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Post;
