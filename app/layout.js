import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { ScannerProvider } from "../context/ScannerContext";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "FitCheck | Hardware Repack Matcher",
  description: "Scan your hardware and find compatible FitGirl repacks instantly.",
  icons: {
    icon: '/icon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: `
          body { background: #0e0e0e; }
        ` }} />
      </head>
      <body className="antialiased">
        <div className="page-fade-wrapper">
          <ScannerProvider>
            <Navbar />
            {children}
          </ScannerProvider>
        </div>
      </body>
    </html>
  );
}
