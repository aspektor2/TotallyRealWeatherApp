import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Enterprise Weather Company™ — Weather intelligence at scale",
  description:
    "Enterprise-grade weather solutions for modern organizations. Trusted by over 3 Fortune 500 companies.",
  openGraph: {
    title: "Enterprise Weather Company™",
    description:
      "Enterprise-grade weather solutions for modern organizations. Future weather is expensive to manufacture.",
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
