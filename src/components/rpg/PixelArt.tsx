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

/** \u5404\u6bb5\u968e\u3067\u8272\u304c\u91cd\u306a\u3089\u306a\u3044\u3088\u3046\u306b\uff08tier3 \u306f\u9285\u8272\u3001\u30d9\u30fc\u30b9\u306e\u9752\u3068\u540c\u8272\u306b\u3057\u306a\u3044\uff09 */
const HERO_ARMOR_SWATCHES: Record<string, string>[] = [
  { "3": "#78716c", "4": "#44403c", "5": "#a8a29e", "6": "#57534e" },
  { "3": "#57534e", "4": "#292524", "5": "#d6d3d1", "6": "#44403c" },
  { "3": "#0d9488", "4": "#115e59", "5": "#99f6e4", "6": "#0f766e" },
  { "3": "#b45309", "4": "#78350f", "5": "#fdba74", "6": "#9a3412" },
  { "3": "#3b82f6", "4": "#1d4ed8", "5": "#dbeafe", "6": "#2563eb" },
  { "3": "#6d28d9", "4": "#4c1d95", "5": "#ddd6fe", "6": "#5b21b6" },
  { "3": "#ca8a04", "4": "#854d0e", "5": "#fde047", "6": "#a16207" },
  { "3": "#e2e8f0", "4": "#475569", "5": "#f8fafc", "6": "#64748b" },
  { "3": "#c4b5fd", "4": "#5b21b6", "5": "#ede9fe", "6": "#7c3aed" },
  { "3": "#fb7185", "4": "#9f1239", "5": "#ffe4e6", "6": "#e11d48" },
  { "3": "#fde047", "4": "#a16207", "5": "#fffbeb", "6": "#eab308" },
];

/** \u51a0\u30fb\u9aea\u306e\u91d1\u306e\u8f1d\u304d\uff08\u9ad8\u6bb5\u968e\u3067\u660e\u308b\u304f\uff09 */
const HERO_CROWN_BY_TIER: Array<Partial<Record<string, string>>> = [
  { "1": "#b45309" },
  { "1": "#ca8a04" },
  { "1": "#d97706" },
  { "1": "#ea580c" },
  { "1": "#f59e0b" },
  { "1": "#fbbf24" },
  { "1": "#fcd34d" },
  { "1": "#fde047" },
  { "1": "#fef08a" },
  { "1": "#fef9c3" },
  { "1": "#fffbeb" },
];

function heroRowsForTier(tierStep: number): string[] {
  const step = Math.max(0, Math.min(10, tierStep));
  const rows = [...HERO_ROWS];
  if (step >= 5) {
    rows[9] = "...0666660....";
    rows[10] = "...0666660....";
  }
  if (step >= 8) {
    rows[1] = "....011110....";
  }
  if (step >= 10) {
    rows[2] = "...01111110...";
    rows[9] = "..066666660..";
    rows[10] = "..066666660..";
  } else if (step >= 8) {
    rows[9] = "...06666660...";
    rows[10] = "...06666660...";
  }
  return rows;
}

function heroPaletteForTier(tierStep: number): Record<string, string> {
  const step = Math.max(0, Math.min(10, tierStep));
  const sw = HERO_ARMOR_SWATCHES[step];
  const crown = HERO_CROWN_BY_TIER[step];
  return { ...HERO_PALETTE, ...sw, ...crown } as Record<string, string>;
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
  return (
    <PixelSvg
      rows={heroRowsForTier(tierStep)}
      palette={heroPaletteForTier(tierStep)}
      scale={scale}
      className={className}
    />
  );
}

export function PixelBoss({ className, scale = 4 }: { className?: string; scale?: number }) {
  return <PixelSvg rows={BOSS_ROWS} palette={BOSS_PALETTE} scale={scale} className={className} />;
}
