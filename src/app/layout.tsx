import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/navigation/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import BookingBar from "@/components/navigation/BookingBar";
import Analytics from "@/components/shared/Analytics";
import PhotoGuard from "@/components/shared/PhotoGuard";
import ScrollEffects from "@/components/motion/ScrollEffects";
import ConsentBanner from "@/components/shared/ConsentBanner";
import { headScript } from "@/lib/theme";
import { brand } from "@/lib/data";
import { siteUrl } from "@/lib/site";

// Manrope for reading and interface text (regular, medium, semibold, bold).
const sans = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-manrope", display: "swap" });
// Fraunces, a soft editorial serif, for headings only: the "wedding album" voice.
const serif = Fraunces({ subsets: ["latin"], style: ["normal", "italic"], axes: ["opsz", "SOFT"], variable: "--font-fraunces", display: "swap" });

const title = `Photographer in ${brand.city} | Wedding Packages from ₹25,000 | ${brand.name}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: `%s | ${brand.name}` },
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
  twitter: { card: "summary_large_image", title, description: brand.description },
  formatDetection: { telephone: false },
  appleWebApp: { capable: true, title: brand.name, statusBarStyle: "default" },
};

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: "#faf8f5",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" suppressHydrationWarning className={`${sans.variable} ${serif.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: headScript }} />
      </head>
      <body className="flex min-h-svh flex-col">
        <SiteHeader />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <SiteFooter />
        <BookingBar />
        <ScrollEffects />
        <Analytics />
        <ConsentBanner />
        <PhotoGuard />
      </body>
    </html>
  );
}
