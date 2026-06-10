import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Totally Real Weather App™ — Weather intelligence at scale",
  description:
    "Enterprise-grade weather solutions for modern organizations.",
  openGraph: {
    title: "Totally Real Weather App™",
    description:
      "Enterprise-grade weather data",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
