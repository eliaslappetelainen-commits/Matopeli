import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import { AppHeader } from "@/components/navigation/app-header";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://matopeli.fi"),
  title: {
    default: "Matopeli | Moderni auton myyntialusta",
    template: "%s | Matopeli",
  },
  description:
    "Moderni, mobiiliystavallinen auton myyntialusta yksityisille ja yritysmyyjille.",
  openGraph: {
    title: "Matopeli",
    description:
      "Moderni, mobiiliystavallinen auton myyntialusta yksityisille ja yritysmyyjille.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fi"
      className={`${manrope.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[var(--color-surface)] text-[var(--color-ink)]">
        <AppHeader />
        {children}
      </body>
    </html>
  );
}
