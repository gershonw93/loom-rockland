import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LOOM Rockland — A Helping Hand Delivered",
  description:
    "LOOM Social Care Network · Rockland. Weekly meal boxes & support services, free for eligible Medicaid members. Apply online.",
  icons: { icon: "/brand/loom-mark.png" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;0,700;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
