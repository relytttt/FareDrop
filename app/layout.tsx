import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FareDrop - Find the Best Flight Deals",
  description: "Discover amazing flight deals worldwide. We search thousands of flights daily to bring you the best prices.",
  keywords: ["flight deals", "cheap flights", "travel deals", "airfare", "flight search"],
  authors: [{ name: "FareDrop" }],
  openGraph: {
    title: "FareDrop - Find the Best Flight Deals",
    description: "Discover amazing flight deals worldwide. We search thousands of flights daily to bring you the best prices.",
    url: "https://faredrop.com",
    siteName: "FareDrop",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "FareDrop - Flight Deals Aggregator",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FareDrop - Find the Best Flight Deals",
    description: "Discover amazing flight deals worldwide. We search thousands of flights daily to bring you the best prices.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
