import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import storeCoordinates from "../../hooks/storeCoordinates";
import useGeolocation from "../../hooks/useGeoLocation";
import markerIcon from "../../img/marker.png";

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const isValid = (lat, lng) => Number.isFinite(lat) && Number.isFinite(lng);

export default function Map({ isRecording, setDistance, routeRef }) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const polylineRef = useRef(null);
  const fallbackRoute = useRef([]);
  // The recorded [lat,lng] points. If the parent passes a routeRef we write into
  // it (so the finish screen can render a snapshot); otherwise we keep our own.
  const pointsRef = routeRef || fallbackRoute;
  const iconRef = useRef(
    L.icon({ iconUrl: markerIcon, iconSize: [18, 18], iconAnchor: [9, 9] })
  );
  const centeredRef = useRef(false);

  // Fall back to Gwalior instead of [0, 0] (which is the Atlantic — the
  // "blue water" you saw). Reuses the last successful fix if we have one.
  const { value: coordinates, setValue: setCoordinates } = storeCoordinates(
    "lastKnownLocation",
    { latitude: 26.2183, longitude: 78.1828 }
  );

  const { position: location, error, loading } = useGeolocation();

  // Initialise the Leaflet map exactly once.
  useEffect(() => {
    if (mapRef.current) return;

    const map = L.map("map").setView(
      [coordinates.latitude, coordinates.longitude],
      13
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    polylineRef.current = L.polyline([], { color: "#1177FF", weight: 5 }).addTo(map);
    mapRef.current = map;

    // Leaflet caches the container size at init. Inside a flex/fixed layout
    // (and especially on mobile) that size is often wrong or zero on the first
    // frame, which makes tiles load blank or half-render. invalidateSize()
    // recomputes it once layout has settled and on any resize.
    const invalidate = () => map.invalidateSize();
    const t1 = setTimeout(invalidate, 0);
    const t2 = setTimeout(invalidate, 300);
    window.addEventListener("resize", invalidate);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("resize", invalidate);
      map.remove();
      mapRef.current = null;
      polylineRef.current = null;
      markerRef.current = null;
      pointsRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Move the user marker + centre the map when a valid fix arrives.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !location) return;
    const { latitude, longitude } = location;
    if (!isValid(latitude, longitude)) return;

    if (markerRef.current) {
      markerRef.current.setLatLng([latitude, longitude]);
    } else {
      markerRef.current = L.marker([latitude, longitude], {
        icon: iconRef.current,
      }).addTo(map);
    }

    if (!centeredRef.current) {
      map.setView([latitude, longitude], 17);
      centeredRef.current = true;
      setCoordinates({ latitude, longitude }); // remember for next session
    } else if (isRecording) {
      map.panTo([latitude, longitude]); // gently follow while recording
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, isRecording]);

  // Record the route + accumulate distance. Single owner of the polyline.
  useEffect(() => {
    if (!isRecording || !location) return;
    const { latitude, longitude } = location;
    if (!isValid(latitude, longitude)) return;

    const pts = pointsRef.current;
    if (pts.length > 0) {
      const [pLat, pLon] = pts[pts.length - 1];
      const d = haversineDistance(pLat, pLon, latitude, longitude);
      if (Number.isFinite(d)) setDistance((prev) => prev + d);
    }
    pts.push([latitude, longitude]);
    if (polylineRef.current) polylineRef.current.setLatLngs(pts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, isRecording]);

  return (
    <>
      <div id="map" className="h-full w-full" />
      {(loading || error) && (
        <div className="pointer-events-none absolute inset-x-0 top-4 z-[1100] flex justify-center px-4">
          <div className="rounded-full bg-white/95 px-4 py-2 text-center text-sm text-gray-700 shadow-md">
            {loading
              ? "Locating you…"
              : "Location unavailable — enable location access to track your route."}
          </div>
        </div>
      )}
    </>
  );
}
