import "./globals.css";
import { ReactNode } from "react";
import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Anurag Mishra — Senior Software Engineer",
  description:
    "Engineering portfolio featuring experience, systems projects, leadership playbooks, and contact details.",
  openGraph: {
    title: "Anurag Mishra — Senior Software Engineer",
    description:
      "Explore experience, projects, leadership principles, and contact information.",
    type: "website",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
