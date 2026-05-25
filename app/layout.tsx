import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:112";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "HallownestAPI — open API for Hollow Knight & Silksong",
    template: "%s · HallownestAPI",
  },
  description:
    "A free, structured, open-source API for Hollow Knight and Silksong data — bosses, charms, areas, items. Fan-made, non-commercial.",
  keywords: [
    "Hollow Knight",
    "Silksong",
    "Hallownest",
    "API",
    "Team Cherry",
    "open data",
    "fan project",
  ],
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "HallownestAPI",
    title: "HallownestAPI — open API for Hollow Knight & Silksong",
    description:
      "A free, structured, open-source API for Hollow Knight and Silksong data.",
  },
  twitter: {
    card: "summary_large_image",
    title: "HallownestAPI",
    description:
      "A free, structured, open-source API for Hollow Knight and Silksong data.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0f" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
          <TooltipProvider delay={200}>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-1.5 focus:text-sm focus:text-primary-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
            >
              Skip to content
            </a>
            <SiteHeader />
            <main id="main" className="flex flex-1 flex-col">
              {children}
            </main>
            <SiteFooter />
            <Toaster richColors />
          </TooltipProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
