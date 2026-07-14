import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ImagePlus } from "lucide-react";
import { formatDuration } from "../../lib/formatTime";
import { formatPace } from "../../lib/metrics";
import { renderRouteThumbnail } from "../../lib/routeThumbnail";
import { renderOsmSnapshot } from "../../lib/osmSnapshot";

function Form({ selectedSport, finalTime, finalDistance, route }) {
  // The activity image defaults to a snapshot of the traced route; the user can
  // optionally replace it with their own photo.
  const [imageData, setImageData] = useState(null); // base64 for upload
  const [imagePreview, setImagePreview] = useState(null);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const formattedTime = formatDuration(finalTime);
  const pace = formatPace(Number(finalDistance), finalTime);

  // Generate the route snapshot when the finish screen opens. Show the instant
  // self-contained route trace first (no empty box), then upgrade to the real
  // OpenStreetMap map-tile snapshot once its tiles have loaded.
  useEffect(() => {
    let cancelled = false;
    const trace = renderRouteThumbnail(route);
    setImageData(trace);
    setImagePreview(trace);

    (async () => {
      const mapSnap = await renderOsmSnapshot(route);
      if (!cancelled && mapSnap) {
        setImageData(mapSnap);
        setImagePreview(mapSnap);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [route]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    const reader = new FileReader();
    reader.onload = () => setImageData(reader.result);
    reader.readAsDataURL(file);
  };

  const { mutate: save, isPending } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/post/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          text,
          sport: selectedSport,
          time: formattedTime,
          distance: Number(finalDistance) || 0,
          img: imageData,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save activity");
      return data;
    },
    onSuccess: () => {
      toast.success("Activity saved!");
      queryClient.invalidateQueries({ queryKey: ["myActivities"] });
      navigate("/");
    },
    onError: (e) => toast.error(e.message),
  });

  const handleSave = () => {
    if (!title.trim()) {
      toast.error("Please add a title");
      return;
    }
    save();
  };

  return (
    <div className="card w-full max-w-md p-6 shadow-2xl">
      <div className="text-center">
        <h2 className="text-xl font-bold text-brand">Save Your Activity</h2>
        <p className="mt-1 text-sm text-gray-500">Name it and add a few details.</p>
      </div>

      {/* Activity summary */}
      <div className="mt-5 grid grid-cols-4 gap-2 rounded-lg bg-gray-50 p-3 text-center">
        <div>
          <p className="text-[11px] text-gray-400">Sport</p>
          <p className="text-sm font-semibold text-gray-800">{selectedSport || "-"}</p>
        </div>
        <div>
          <p className="text-[11px] text-gray-400">Time</p>
          <p className="text-sm font-semibold text-gray-800">{formattedTime}</p>
        </div>
        <div>
          <p className="text-[11px] text-gray-400">Distance</p>
          <p className="text-sm font-semibold text-gray-800">{finalDistance} km</p>
        </div>
        <div>
          <p className="text-[11px] text-gray-400">Pace</p>
          <p className="text-sm font-semibold text-gray-800">{pace}</p>
        </div>
      </div>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter title"
        className="input mt-4"
      />
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter description"
        className="input mt-3"
      />

      <div className="mt-4">
        <p className="mb-2 text-xs font-medium text-gray-500">Route snapshot</p>
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="Route"
            className="h-44 w-full rounded-lg border border-gray-200 object-cover"
          />
        ) : (
          <div className="flex h-44 w-full items-center justify-center rounded-lg border border-dashed border-gray-300 text-sm text-gray-400">
            Generating snapshot…
          </div>
        )}
        <label className="btn-outline mt-3 w-full cursor-pointer">
          <ImagePlus className="h-4 w-4" />
          Use a photo instead
          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
        </label>
      </div>

      <button onClick={handleSave} disabled={isPending} className="btn-primary mt-5 w-full py-3">
        {isPending ? "Saving..." : "Save Activity"}
      </button>
    </div>
  );
}

export default Form;
