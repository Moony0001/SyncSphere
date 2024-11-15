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
            setPosition({
                latitude: coords.coords.latitude,
                longitude: coords.coords.longitude,
            });
            setLoading(false);
        }

        function onError(error) {
            console.error("Error retrieving geolocation: ", error);
            setError(error);
            setLoading(false);
        }

        const watcher = geo.watchPosition(onSuccess, onError);

        return () => geo.clearWatch(watcher);
    }, []);

    return { position, error, loading };
}
