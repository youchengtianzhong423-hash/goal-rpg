import type { MetadataRoute } from "next";

const THEME = "#1e1b4b";
const BG = "#0f172a";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "\u76ee\u6a19\u9054\u6210RPG",
    short_name: "\u76ee\u6a19RPG",
    description:
      "\u30af\u30a8\u30b9\u30c8\u3068\u30ed\u30fc\u30c9\u30de\u30c3\u30d7\u30671\u5e74\u76ee\u6a19\u306b\u6311\u3080RPG\u98a8\u306e\u30a2\u30d7\u30ea",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: BG,
    theme_color: THEME,
    lang: "ja",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
