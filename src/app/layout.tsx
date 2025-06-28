import type { Metadata } from "next";
import { Montserrat, IBM_Plex_Mono, Scope_One, Inter, Black_Ops_One } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const montSerrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  preload: false,
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  preload: false,
});

const scopeOne = Scope_One({
  variable: "--font-scopeone",
  subsets: ["latin"],
  weight: "400",
  preload: false,
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  weight: "400",
  preload: false,
});

const blackOps = Black_Ops_One({
  variable: "--font-blackOps",
  weight: "400",
  preload: false,
});

export const metadata: Metadata = {
  title: "HyperViz",
  description: "Machine Learning Project"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` ${montSerrat.variable} ${plexMono.variable} ${scopeOne.variable} ${inter.variable} ${blackOps.variable} antialiased flex flex-col min-h-screen bg-amber-900 md:overflow-y-hidden overflow-y-auto`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
