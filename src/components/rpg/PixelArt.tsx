"use client";

import type { ReactNode } from "react";

const HERO_PALETTE: Record<string, string> = {
  ".": "transparent",
  "0": "#0f172a",
  "1": "#fbbf24",
  "2": "#fcd9bd",
  "3": "#2563eb",
  "4": "#1e3a8a",
  "5": "#e2e8f0",
  "6": "#64748b",
};

const BOSS_PALETTE: Record<string, string> = {
  ".": "transparent",
  "0": "#020617",
  "1": "#7f1d1d",
  "2": "#dc2626",
  "3": "#fbbf24",
  "4": "#312e81",
  "5": "#4c1d95",
  "6": "#fca5a5",
  "7": "#facc15",
};

const HERO_ROWS = [
  "......00......",
  ".....0110.....",
  "....011110....",
  "...02222220...",
  "..0222222220..",
  ".02333333320.",
  ".02344443320.",
  ".02333333320.",
  "..0233333320..",
  "...02222220...",
  "....066660....",
  "....066660....",
  ".....060......",
  "....06.60.....",
];

const BOSS_ROWS = [
  "......707......",
  ".....07770.....",
  "....0777770....",
  "...077777770...",
  "..07111111170..",
  ".0712222222170.",
  ".0122222222210.",
  ".0122222222210.",
  ".0126666666210.",
  ".0122222222210.",
  "..01222222210..",
  "...011111110...",
  "....0444440....",
  ".....044440.....",
  "......040.......",
];

function PixelSvg({
  rows,
  palette,
  scale = 4,
  className = "",
}: {
  rows: string[];
  palette: Record<string, string>;
  scale?: number;
  className?: string;
}) {
  const w = rows[0]?.length ?? 0;
  const h = rows.length;
  const rects: ReactNode[] = [];
  rows.forEach((row, y) => {
    row.split("").forEach((ch, x) => {
      const fill = palette[ch];
      if (!fill || ch === ".") return;
      rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={fill} />);
    });
  });
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={className}
      style={{
        width: w * scale,
        height: h * scale,
        imageRendering: "pixelated",
        shapeRendering: "crispEdges",
      }}
      aria-hidden
    >
      {rects}
    </svg>
  );
}

const HERO_ARMOR_SWATCHES: Record<string, string>[] = [
  { "3": "#78716c", "4": "#44403c", "5": "#a8a29e", "6": "#57534e" },
  { "3": "#64748b", "4": "#334155", "5": "#94a3b8", "6": "#475569" },
  { "3": "#0369a1", "4": "#0c4a6e", "5": "#7dd3fc", "6": "#075985" },
  { "3": "#2563eb", "4": "#1e3a8a", "5": "#93c5fd", "6": "#1d4ed8" },
  { "3": "#4f46e5", "4": "#312e81", "5": "#c7d2fe", "6": "#4338ca" },
  { "3": "#ca8a04", "4": "#854d0e", "5": "#fde047", "6": "#a16207" },
  { "3": "#eab308", "4": "#a16207", "5": "#fef08a", "6": "#ca8a04" },
  { "3": "#e2e8f0", "4": "#64748b", "5": "#f8fafc", "6": "#94a3b8" },
  { "3": "#a5b4fc", "4": "#3730a3", "5": "#e0e7ff", "6": "#4f46e5" },
  { "3": "#f87171", "4": "#991b1b", "5": "#fecaca", "6": "#b91c1c" },
  { "3": "#fef08a", "4": "#ca8a04", "5": "#fffbeb", "6": "#fbbf24" },
];

function heroPaletteForTier(tierStep: number): Record<string, string> {
  const step = Math.max(0, Math.min(10, tierStep));
  const sw = HERO_ARMOR_SWATCHES[step];
  return { ...HERO_PALETTE, ...sw };
}

export function PixelHero({ className, scale = 4 }: { className?: string; scale?: number }) {
  return <PixelSvg rows={HERO_ROWS} palette={HERO_PALETTE} scale={scale} className={className} />;
}

/** \u9054\u6210\u7387\u6bb5\u968e\uff080\u201310\uff09\u3067\u8272\u306e\u88c5\u5099\u304c\u5909\u5316 */
export function PixelHeroTiered({
  tierStep,
  className,
  scale = 4,
}: {
  tierStep: number;
  className?: string;
  scale?: number;
}) {
  return <PixelSvg rows={HERO_ROWS} palette={heroPaletteForTier(tierStep)} scale={scale} className={className} />;
}

export function PixelBoss({ className, scale = 4 }: { className?: string; scale?: number }) {
  return <PixelSvg rows={BOSS_ROWS} palette={BOSS_PALETTE} scale={scale} className={className} />;
}
