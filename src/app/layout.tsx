{/*import type { Metadata } from "next";
import { Montserrat, IBM_Plex_Mono, Scope_One, Inter} from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const montSerrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const scopeOne = Scope_One({
  variable: "--font-scopeone",
  subsets: ["latin"],
  weight: "400"
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  weight: "400"
});

const blackOps = Inter({
  variable: "--font-blackOps",
  weight: "400"
});

export const metadata: Metadata = {
  title: "HyperViz",
  description: "Machine Learning Project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` ${montSerrat.variable} ${plexMono.variable} ${scopeOne.variable} ${inter.variable} ${blackOps.variable} antialiased flex flex-col min-h-screen`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
*/}
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
  description: "Machine Learning Project",
  icons: {
    icon: '/favicon.svg', // path is relative to /public
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` ${montSerrat.variable} ${plexMono.variable} ${scopeOne.variable} ${inter.variable} ${blackOps.variable} antialiased flex flex-col min-h-screen `}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
