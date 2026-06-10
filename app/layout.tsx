import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Totally Real Weather App™ — Real weather. Really expensive.",
  description:
    "Totally real weather data for totally real people. Trusted by over 3 Fortune 500 companies. Future weather is expensive to manufacture.",
  openGraph: {
    title: "Totally Real Weather App™",
    description:
      "Real weather. Really expensive. Trusted by over 3 Fortune 500 companies.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
