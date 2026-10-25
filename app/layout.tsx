import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./portfolio.css";
import { ThemeProvider } from "@/components/theme-provider";

const manrope = localFont({ src: "../public/fonts/manrope.ttf", display: "swap", variable: "--font-manrope" });

export const metadata: Metadata = {
  metadataBase: new URL("https://ylamouddan.com/"),

  title: "Yassir Lamouddan | Engineering, Software & Automation",
  authors: {
    name: "YLamouddan",
  },

  description:
    "Electrical engineering meets software and automation. Explore independent interactive prototypes in diagnostics, energy scheduling, workflow reliability and document retrieval.",
  openGraph: {
    title: "Yassir Lamouddan | Engineering, Software & Automation",
    description:
      "Electrical engineering meets software and automation. Explore independent interactive prototypes and the reasoning behind them.",
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
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
