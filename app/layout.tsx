import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./portfolio.css";
import { ThemeProvider } from "@/components/theme-provider";

const manrope = localFont({ src: "../public/fonts/manrope.ttf", display: "swap", variable: "--font-manrope" });

export const metadata: Metadata = {
  metadataBase: new URL("https://ylamouddan.com/"),

  title: "Yassir Lamouddan | Websites & Business Automation",
  authors: {
    name: "YLamouddan",
  },

  description:
    "Websites and practical business tools by Yassir Lamouddan. Explore working demos for quotes, appointment booking, client portals and customer support.",
  openGraph: {
    title: "Yassir Lamouddan | Websites & Business Automation",
    description:
      "Websites, booking tools, client portals and practical automation for growing businesses.",
    url: "https://ylamouddan.com/",
    siteName: "YLamouddan",
    images: [],
    type: "website",
  },
  keywords: ["Yassir Lamouddan", "web development", "automation", "self-hosting"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${manrope.className} ${manrope.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          storageKey="portfolio-appearance-v2"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
