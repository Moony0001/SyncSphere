import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ImagePlus } from "lucide-react";
import { formatDuration } from "../../lib/formatTime";

function Form({ selectedSport, finalTime, finalDistance }) {
  const [imageData, setImageData] = useState(null); // base64 for upload
  const [imagePreview, setImagePreview] = useState(null);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const navigate = useNavigate();

  const formattedTime = formatDuration(finalTime);

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
        <h2 className="text-xl font-bold text-brand">Make Your Spot Stand Out!</h2>
        <p className="mt-1 text-sm text-gray-500">
          Fill in the details below to save your activity.
        </p>
      </div>

      {/* Activity summary */}
      <div className="mt-5 grid grid-cols-3 gap-2 rounded-lg bg-gray-50 p-3 text-center">
        <div>
          <p className="text-xs text-gray-400">Sport</p>
          <p className="text-sm font-semibold text-gray-800">{selectedSport || "-"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Time</p>
          <p className="text-sm font-semibold text-gray-800">{formattedTime}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Distance</p>
          <p className="text-sm font-semibold text-gray-800">{finalDistance} km</p>
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
        {imagePreview ? (
          <img src={imagePreview} alt="Uploaded" className="h-40 w-full rounded-lg object-cover" />
        ) : (
          <div className="flex h-40 w-full items-center justify-center rounded-lg border border-dashed border-gray-300 text-sm text-gray-400">
            Make this spot yours!
          </div>
        )}
        <label className="btn-outline mt-3 w-full cursor-pointer">
          <ImagePlus className="h-4 w-4" />
          Upload Image
          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
        </label>
      </div>

      <button onClick={handleSave} disabled={isPending} className="btn-primary mt-5 w-full py-3">
        {isPending ? "Saving..." : "Save"}
      </button>
    </div>
  );
}

export default Form;
