import type { Metadata } from "next";
import { CustomCursor } from "@/components/effects/custom-cursor";
import "./globals.css";
import { PreferencesProvider } from "@/components/providers/preferences-provider";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "ATTL School OS",
    template: "%s · ATTL School OS",
  },
  description: "Al Thagr Technical Lab School Operating System for academics, projects, learning, innovation and school life.",
  applicationName: "ATTL School OS",
  generator: "Next.js",
  keywords: ["ATTL", "School OS", "Al Thagr Technical Lab", "school management", "student projects", "learning"],
  openGraph: {
    title: "ATTL School OS",
    description: "A connected digital layer for school academics, projects, learning, innovation and community.",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
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
