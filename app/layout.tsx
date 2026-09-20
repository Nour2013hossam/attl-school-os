import type { Metadata } from "next";
import { CustomCursor } from "@/components/effects/custom-cursor";
import "./globals.css";
import { PreferencesProvider } from "@/components/providers/preferences-provider";

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
    <html lang="en" dir="ltr">
      <body>
        <PreferencesProvider>
          {children}
        </PreferencesProvider>
        <CustomCursor />
      </body>
    </html>
  );
}
