import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#39ff14",
};

export const metadata: Metadata = {
  title: "Antaryami Roul | Full Stack Developer",
  description:
    "Interactive CLI portfolio of Antaryami Roul — Full Stack Developer skilled in Laravel, React, Angular, Python & Django. Explore via terminal commands.",
  keywords: [
    "Antaryami Roul",
    "Full Stack Developer",
    "Laravel",
    "React",
    "Django",
    "Portfolio",
    "Bhubaneswar",
  ],
  authors: [{ name: "Antaryami Roul", url: "https://antaryami.free.nf/" }],
  openGraph: {
    title: "Antaryami Roul | CLI Portfolio",
    description: "Interactive terminal portfolio — type 'help' to explore",
    type: "website",
    url: "https://antaryami.free.nf/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Antaryami Roul | CLI Portfolio",
    description: "Interactive terminal portfolio — type 'help' to explore",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Fira+Code:wght@300..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
