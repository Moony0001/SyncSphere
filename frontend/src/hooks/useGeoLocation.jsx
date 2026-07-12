import { useEffect, useState } from "react";

export default function useGeolocation() {
  // `null` until we have a real, finite fix. (Previously this started as
  // {latitude: null, longitude: null}, which slipped past the map's `=== 0`
  // guards and fed invalid coordinates into Leaflet.)
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setError("Geolocation is not supported by this browser");
      setLoading(false);
      return;
    }

    const onSuccess = (pos) => {
      const { latitude, longitude } = pos.coords;
      if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
        setPosition({ latitude, longitude });
        setError(null);
      }
      setLoading(false);
    };

    const onError = (err) => {
      console.error("Error retrieving geolocation:", err);
      setError(err?.message || "Failed to retrieve location");
      setLoading(false);
    };

    // `timeout` is critical on mobile: without it, watchPosition can hang
    // forever (never calling either callback) if a fix can't be obtained,
    // leaving the UI stuck on "loading". `maximumAge` lets a recent cached
    // fix satisfy the first request quickly.
    const watcher = navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 10000,
    });

    return () => navigator.geolocation.clearWatch(watcher);
  }, []);

  return { position, error, loading };
}
