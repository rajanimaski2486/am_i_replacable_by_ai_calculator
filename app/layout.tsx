import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Am I Replaceable by AI? Free AI Career Risk Calculator",
  description: "Get your AI automation exposure score, career moat, and 30-day plan to become harder to replace.",
  openGraph: {
    title: "Am I Replaceable by AI?",
    description: "Get your AI automation exposure score, career moat, and 30-day plan to become harder to replace.",
    type: "website",
    url: "https://amireplaceablebyai.vercel.app",
    images: [{ url: "https://amireplaceablebyai.vercel.app/og-image.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Am I Replaceable by AI?",
    description: "Get your AI automation exposure score, career moat, and 30-day plan to become harder to replace.",
    images: ["https://amireplaceablebyai.vercel.app/og-image.png"],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans bg-slate-950 text-white min-h-screen selection:bg-blue-500/30`}>
        {children}
      </body>
    </html>
  );
}
