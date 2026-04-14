import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PwaRegister } from "@/components/PwaRegister";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "目標達成RPG",
  description:
    "\u30af\u30a8\u30b9\u30c8\u3068\u30ed\u30fc\u30c9\u30de\u30c3\u30d7\u30671\u5e74\u76ee\u6a19\u306b\u6311\u3080RPG\u98a8\u306eWeb\u30a2\u30d7\u30ea",
  applicationName: "\u76ee\u6a19\u9054\u6210RPG",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "\u76ee\u6a19\u9054\u6210RPG",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1e1b4b" },
    { media: "(prefers-color-scheme: dark)", color: "#1e1b4b" },
  ],
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
