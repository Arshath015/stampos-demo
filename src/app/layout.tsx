import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const siteUrl = "https://stampos-ai.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "STAMP OS — AI Catalog Engine",
  description:
    "AI-powered catalog image generation demo for SUGAR Cosmetics. Frontend demo with a simulated AI training/generation flow.",
  openGraph: {
    title: "STAMP OS — AI Catalog Engine",
    description:
      "AI-powered catalog image generation demo for SUGAR Cosmetics. Frontend demo with a simulated AI training/generation flow.",
    url: siteUrl,
    siteName: "STAMP OS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "STAMP OS — AI Catalog Engine",
    description:
      "AI-powered catalog image generation demo for SUGAR Cosmetics. Frontend demo with a simulated AI training/generation flow.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} h-full`}>
      <body className="min-h-full bg-bg text-t1 antialiased">{children}</body>
    </html>
  );
}
