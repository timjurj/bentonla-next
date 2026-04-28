import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.bentonla.com"),
  title: {
    default: "BentonLA.com — Benton, Louisiana Local Business Directory",
    template: "%s | BentonLA.com",
  },
  description:
    "The complete local business directory for Benton, Louisiana and Bossier Parish. Find restaurants, home services, real estate, churches, and more.",
  keywords: [
    "Benton LA businesses",
    "Bossier Parish directory",
    "Benton Louisiana",
    "local businesses Benton LA",
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    siteName: "BentonLA.com",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-H924WKY88X"
          strategy="afterInteractive"
        />
        <Script id="ga4" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-H924WKY88X');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-H924WKY88X"
          strategy="afterInteractive"
        />
        <Script id="ga4" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-H924WKY88X');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}