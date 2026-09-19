import type { Metadata } from "next";
import { CustomCursor } from "@/components/effects/custom-cursor";
import "./globals.css";

export const metadata: Metadata = {
  title: "ATTL School OS",
  description: "Al Thagr Technical Lab School Operating System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        {children}
        <CustomCursor />
      </body>
    </html>
  );
}