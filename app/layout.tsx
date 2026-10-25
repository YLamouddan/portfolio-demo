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
  authors: {
    name: "YLamouddan",
  },

  description:
    "Software and automation by Yassir Lamouddan. Explore a visual workflow studio, a live 3D product configurator and an evidence-driven intelligence workspace.",
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
