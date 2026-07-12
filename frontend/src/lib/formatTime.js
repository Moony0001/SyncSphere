// Formats a number of seconds as HH:MM:SS. Unlike `new Date(s*1000).toISOString()`
// this never throws (that call throws a RangeError for NaN/invalid input) and it
// keeps counting past 24 hours.
export function formatDuration(totalSeconds) {
  const s = Math.max(0, Math.floor(Number(totalSeconds) || 0));
  const hh = String(Math.floor(s / 3600)).padStart(2, "0");
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}
