// Activity metrics derived from distance (km) and elapsed time (seconds).

// Parse a stored duration ("HH:MM:SS" / "MM:SS") back into seconds.
export function parseDuration(value) {
  if (typeof value === "number") return value;
  if (!value || typeof value !== "string") return 0;
  const parts = value.split(":").map(Number);
  if (parts.some((n) => Number.isNaN(n))) return 0;
  return parts.reduce((acc, n) => acc * 60 + n, 0);
}

// Speed in km/h.
export function speedKmh(distanceKm, seconds) {
  if (!distanceKm || !seconds || seconds <= 0) return 0;
  return (distanceKm / seconds) * 3600;
}

export function formatSpeed(distanceKm, seconds) {
  return `${speedKmh(distanceKm, seconds).toFixed(1)} km/h`;
}

// Given a list of activities, return a map of postId -> [PR labels].
// Personal records here: the single longest-distance activity and the single
// fastest-pace activity across the list.
export function computePRs(activities) {
  const map = {};
  if (!activities || activities.length === 0) return map;
  const push = (id, label) => {
    (map[id] = map[id] || []).push(label);
  };

  let longest = null;
  for (const a of activities) {
    const d = Number(a.distance) || 0;
    if (d > 0 && (!longest || d > Number(longest.distance))) longest = a;
  }
  if (longest) push(longest._id, "Longest distance");

  let fastest = null;
  let best = Infinity;
  for (const a of activities) {
    const sec = parseDuration(a.time);
    const d = Number(a.distance) || 0;
    if (d > 0 && sec > 0) {
      const p = sec / d;
      if (p < best) {
        best = p;
        fastest = a;
      }
    }
  }
  if (fastest) push(fastest._id, "Fastest pace");

  return map;
}

// Pace as "M:SS /km" (minutes per kilometre) — the standard running/walking metric.
export function formatPace(distanceKm, seconds) {
  if (!distanceKm || distanceKm <= 0 || !seconds || seconds <= 0) return "—";
  const secPerKm = seconds / distanceKm;
  const m = Math.floor(secPerKm / 60);
  const s = Math.round(secPerKm % 60);
  // handle rounding to 60
  const mm = s === 60 ? m + 1 : m;
  const ss = s === 60 ? 0 : s;
  return `${mm}:${String(ss).padStart(2, "0")} /km`;
}
