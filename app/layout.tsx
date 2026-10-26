import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./portfolio.css";
import "./showcases.css";
import { ThemeProvider } from "@/components/theme-provider";

const manrope = localFont({ src: "../public/fonts/manrope.ttf", display: "swap", variable: "--font-manrope" });

export const metadata: Metadata = {
  metadataBase: new URL("https://ylamouddan.com/"),

  title: "Yassir Lamouddan | Websites & Business Automation",
  icons: {
    icon: [{ url: "/brand/yl-mark.svg", type: "image/svg+xml" }],
    apple: [{ url: "/brand/apple-touch-icon.png", sizes: "180x180" }],
  },
  authors: {
    name: "YLamouddan",
  },

  description:
    "Yassir Lamouddan turns business bottlenecks into working automation. Explore research, catalogue processing, real document extraction and business-system reconciliation.",
  openGraph: {
    title: "Yassir Lamouddan | Websites & Business Automation",
    description:
      "Interactive product experiences, workflow architecture and decision tools for ambitious businesses.",
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
          defaultTheme="dark"
          storageKey="portfolio-appearance-v3"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
