import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "characters");
fs.mkdirSync(outDir, { recursive: true });

const tiers = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const colors = [
  "#44403c",
  "#57534e",
  "#78716c",
  "#a16207",
  "#ca8a04",
  "#eab308",
  "#facc15",
  "#e2e8f0",
  "#a5b4fc",
  "#fecaca",
  "#fef08a",
];

for (let i = 0; i < tiers.length; i++) {
  const b = tiers[i];
  const c1 = colors[i];
  const c2 = "#0f172a";
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="120" height="120" rx="14" fill="url(#g)"/>
  <text x="60" y="50" text-anchor="middle" fill="#f8fafc" font-family="system-ui,sans-serif" font-size="10" font-weight="700">PLACEHOLDER</text>
  <text x="60" y="68" text-anchor="middle" fill="#e2e8f0" font-family="system-ui,sans-serif" font-size="9">${b}% tier</text>
  <text x="60" y="88" text-anchor="middle" fill="#94a3b8" font-size="8">replace with image</text>
</svg>`;
  fs.writeFileSync(path.join(outDir, `tier-${b}.svg`), svg, "utf8");
}

console.log("wrote", tiers.length, "svgs to", outDir);
