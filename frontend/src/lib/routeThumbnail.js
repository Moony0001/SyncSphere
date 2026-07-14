// Renders a recorded GPS path ([[lat,lng], ...]) onto a canvas and returns a
// PNG data URL. This draws the traced ROUTE SHAPE (not map tiles) on a clean
// background — it is fully self-contained (no external tiles, no API key, no
// canvas-tainting CORS issues), so it works reliably for every activity/user.
export function renderRouteThumbnail(points, opts = {}) {
  const width = opts.width || 640;
  const height = opts.height || 400;
  const padding = opts.padding || 48;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  // Background gradient.
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, "#eef4fb");
  grad.addColorStop(1, "#e2e8f0");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  const valid = (points || []).filter(
    (p) => Array.isArray(p) && Number.isFinite(p[0]) && Number.isFinite(p[1])
  );

  if (valid.length < 2) {
    ctx.fillStyle = "#94a3b8";
    ctx.font = "600 20px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("No route recorded", width / 2, height / 2);
    return canvas.toDataURL("image/png");
  }

  // Project lat/lng to planar coords (equirectangular; accurate enough for a
  // single activity's small area). Correct longitude for latitude distortion.
  const lats = valid.map((p) => p[0]);
  const lngs = valid.map((p) => p[1]);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const midLat = (minLat + maxLat) / 2;
  const cos = Math.cos((midLat * Math.PI) / 180) || 1;

  const proj = valid.map(([lat, lng]) => [(lng - minLng) * cos, maxLat - lat]);
  const xs = proj.map((p) => p[0]);
  const ys = proj.map((p) => p[1]);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const spanX = Math.max(...xs) - minX || 1e-9;
  const spanY = Math.max(...ys) - minY || 1e-9;
  const scale = Math.min((width - 2 * padding) / spanX, (height - 2 * padding) / spanY);
  const offX = (width - spanX * scale) / 2 - minX * scale;
  const offY = (height - spanY * scale) / 2 - minY * scale;
  const tx = (x) => x * scale + offX;
  const ty = (y) => y * scale + offY;

  // Route line.
  ctx.lineWidth = 6;
  ctx.strokeStyle = "#1177FF";
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.beginPath();
  proj.forEach(([x, y], i) => {
    const px = tx(x);
    const py = ty(y);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  });
  ctx.stroke();

  // Start (green) + end (red) markers.
  const dot = (x, y, color) => {
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();
  };
  dot(tx(proj[0][0]), ty(proj[0][1]), "#22c55e");
  dot(tx(proj[proj.length - 1][0]), ty(proj[proj.length - 1][1]), "#ef4444");

  return canvas.toDataURL("image/png");
}
