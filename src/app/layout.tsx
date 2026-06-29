import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LOOM Rockland — Enrollment Portal",
  description:
    "LOOM Social Care Network · Rockland — Weekly Free Meal Boxes & Support Services. Official enrollment portal.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
