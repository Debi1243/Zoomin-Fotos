import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/navigation/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import AppTabBar from "@/components/navigation/AppTabBar";
import AppFeel from "@/components/motion/AppFeel";
import MotionProvider from "@/components/shared/MotionProvider";
import ScrollEffects from "@/components/motion/ScrollEffects";
import { headScript } from "@/lib/theme";
import { brand } from "@/lib/data";
import { siteUrl } from "@/lib/site";

const display = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-instrument", display: "swap" });
const sans = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

const title = `${brand.name} — Wedding, portrait & commercial photography in ${brand.city}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: `%s · ${brand.name}` },
  description: brand.description,
  applicationName: brand.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: brand.name,
    locale: "en_IN",
    url: "/",
    title,
    description: brand.description,
  },
  twitter: { card: "summary_large_image", title: brand.name, description: brand.description },
  formatDetection: { telephone: false },
  appleWebApp: { capable: true, title: "Zoomin Fotos", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f2ec" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0e0c" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" suppressHydrationWarning className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: headScript }} />
      </head>
      <body className="flex min-h-svh flex-col">
        <MotionProvider>
          <SiteHeader />
          <main id="main" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
          <SiteFooter />
          <ScrollEffects />
          <AppTabBar />
          <AppFeel />
        </MotionProvider>
      </body>
    </html>
  );
}
