import { useEffect, useState } from "react";

export default function useGeolocation() {
    const [position, setPosition] = useState({
        latitude: null,
        longitude: null,
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const geo = navigator.geolocation;
        if (!geo) {
            setError("Geolocation is not supported by this browser");
            setLoading(false);
            return;
        }

        function onSuccess(coords) {
            const { latitude, longitude } = coords.coords;

    setPosition((prev) => {
            // Skip update if no significant change
            if (
                prev &&
                prev.latitude === latitude &&
                prev.longitude === longitude
            ) {
                return prev;
            }
            return { latitude, longitude };
        });

        setLoading(false);
        }

        function onError(error) {
            console.error("Error retrieving geolocation: ", error);
            setError(err.message || "Failed to retrieve location");
            setLoading(false);
        }

        const watcher = geo.watchPosition(onSuccess, onError, {
            enableHighAccuracy: true,
        });

        return () => geo.clearWatch(watcher);
    }, []);

    return { position, error, loading };
}
