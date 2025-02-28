import type { Metadata } from "next";
import { Geist, Montserrat, Geist_Mono, IBM_Plex_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const montSerrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  weight: "400"
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` ${montSerrat.variable} ${plexMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
