import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "💜 CUET PG Countdown",
  description: "Counting down to CUET PG 2026 — You've got this, ARMY! 💜",
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
