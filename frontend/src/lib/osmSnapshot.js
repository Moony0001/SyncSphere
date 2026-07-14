// Self-contained static map snapshot using OpenStreetMap tiles directly.
// No API key, no third-party service, no card. We compute which OSM tiles cover
// the route, draw them onto a canvas, then draw the route + start/end markers on
// top and export a PNG. OSM tiles send `Access-Control-Allow-Origin: *`, so with
// crossOrigin images the canvas is NOT tainted and toDataURL() works.
//
// Usage is light (a handful of tiles per saved activity) and includes the
// required "© OpenStreetMap" attribution — compliant with the OSM tile policy.

const TILE = 256;

const worldX = (lng, z) => ((lng + 180) / 360) * Math.pow(2, z) * TILE;
const worldY = (lat, z) => {
  const rad = (lat * Math.PI) / 180;
  return (
    ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) *
    Math.pow(2, z) *
    TILE
  );
};

const isFinitePt = (p) =>
  Array.isArray(p) && Number.isFinite(p[0]) && Number.isFinite(p[1]);

function loadTile(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null); // missing tile -> just leave background
    img.src = url;
  });
}

export async function renderOsmSnapshot(points, opts = {}) {
  const width = opts.width || 640;
  const height = opts.height || 400;
  const padding = opts.padding || 44;

  const pts = (points || []).filter(isFinitePt);
  if (pts.length < 2) return null;

  // Pick the highest zoom (<=18) at which the whole route fits the frame.
  let zoom = 1;
  for (let z = 18; z >= 1; z--) {
    const xs = pts.map((p) => worldX(p[1], z));
    const ys = pts.map((p) => worldY(p[0], z));
    const spanX = Math.max(...xs) - Math.min(...xs);
    const spanY = Math.max(...ys) - Math.min(...ys);
    if (spanX <= width - 2 * padding && spanY <= height - 2 * padding) {
      zoom = z;
      break;
    }
  }

  const tilesPerAxis = Math.pow(2, zoom);
  const wx = pts.map((p) => worldX(p[1], zoom));
  const wy = pts.map((p) => worldY(p[0], zoom));
  const centerX = (Math.min(...wx) + Math.max(...wx)) / 2;
  const centerY = (Math.min(...wy) + Math.max(...wy)) / 2;
  const originX = centerX - width / 2; // world pixel at canvas (0,0)
  const originY = centerY - height / 2;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#e5e7eb";
  ctx.fillRect(0, 0, width, height);

  // Every tile intersecting the viewport.
  const minTX = Math.floor(originX / TILE);
  const maxTX = Math.floor((originX + width) / TILE);
  const minTY = Math.floor(originY / TILE);
  const maxTY = Math.floor((originY + height) / TILE);

  const jobs = [];
  for (let tx = minTX; tx <= maxTX; tx++) {
    for (let ty = minTY; ty <= maxTY; ty++) {
      if (ty < 0 || ty >= tilesPerAxis) continue;
      const wrappedX = ((tx % tilesPerAxis) + tilesPerAxis) % tilesPerAxis;
      const url = `https://tile.openstreetmap.org/${zoom}/${wrappedX}/${ty}.png`;
      const dx = tx * TILE - originX;
      const dy = ty * TILE - originY;
      jobs.push(loadTile(url).then((img) => ({ img, dx, dy })));
    }
  }

  try {
    const tiles = await Promise.all(jobs);
    for (const { img, dx, dy } of tiles) {
      if (img) ctx.drawImage(img, dx, dy);
    }

    // Route line.
    ctx.beginPath();
    pts.forEach((p, i) => {
      const px = worldX(p[1], zoom) - originX;
      const py = worldY(p[0], zoom) - originY;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#1177FF";
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.stroke();

    // Start (green) / end (red) markers.
    const dot = (wxp, wyp, color) => {
      const px = wxp - originX;
      const py = wyp - originY;
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#ffffff";
      ctx.stroke();
    };
    dot(wx[0], wy[0], "#22c55e");
    dot(wx[wx.length - 1], wy[wy.length - 1], "#ef4444");

    // Required OSM attribution.
    ctx.font = "11px system-ui, sans-serif";
    const label = "© OpenStreetMap";
    const tw = ctx.measureText(label).width;
    ctx.fillStyle = "rgba(255,255,255,0.75)";
    ctx.fillRect(width - tw - 10, height - 18, tw + 10, 18);
    ctx.fillStyle = "#374151";
    ctx.textAlign = "left";
    ctx.fillText(label, width - tw - 5, height - 5);

    return canvas.toDataURL("image/png");
  } catch {
    // If anything (incl. an unexpected canvas taint) fails, let the caller fall
    // back to the self-contained route-trace thumbnail.
    return null;
  }
}
