import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "MeetGenius",
  description: "AI Meeting Notes",
  icons: {
    icon: "/icon.svg",
  },
};

import { AuthProvider } from "./context/AuthContext";
import CookieConsent from "./components/ui/cookie-consent";
import { ShortcutOverlay } from "./components/ui/ShortcutOverlay";
import { GlobalShortcutHandler } from "./components/ui/GlobalShortcutHandler";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AuthProvider>
          {children}
          <CookieConsent />
          <ShortcutOverlay />
          <GlobalShortcutHandler />
        </AuthProvider>
      </body>
    </html>
  );
}
