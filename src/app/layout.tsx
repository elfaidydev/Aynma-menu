import type { Metadata, Viewport } from "next";
import { publicAsset } from "@/lib/publicAsset";
import localFont from "next/font/local";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import "./globals.css";

const cormorant = localFont({
  src: [{ path: "../../public/fonts/brand.ttf", weight: "400" }, { path: "../../public/fonts/brand-semibold.ttf", weight: "600" }],
  variable: "--font-brand",
  display: "swap",
});
const tajawal = localFont({
  src: [
    { path: "../../public/fonts/tajawal-400.ttf", weight: "400" },
    { path: "../../public/fonts/tajawal-500.ttf", weight: "500" },
    { path: "../../public/fonts/tajawal-700.ttf", weight: "700" },
  ],
  variable: "--font-ar",
  display: "swap",
});
const outfit = localFont({
  src: [{ path: "../../public/fonts/outfit.ttf", weight: "400" }, { path: "../../public/fonts/outfit-semibold.ttf", weight: "600" }],
  variable: "--font-en",
  display: "swap",
});

export const metadata: Metadata = {
  title: "منيو — كوفي اينما | AYNMA",
  description: "منيو كوفي اينما — AYNMA Coffee Menu",
  manifest: publicAsset("/manifest.webmanifest"),
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AYNMA",
  },
  icons: {
    icon: [
      { url: publicAsset("/favicon-32.png"), sizes: "32x32", type: "image/png" },
      { url: publicAsset("/favicon-16.png"), sizes: "16x16", type: "image/png" },
    ],
    apple: publicAsset("/apple-touch-icon.png"),
  },
};

export const viewport: Viewport = {
  themeColor: "#702e3a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cormorant.variable} ${tajawal.variable} ${outfit.variable}`}
    >
      <body>
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
