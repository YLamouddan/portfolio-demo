import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://ylamouddan.com/"),

  title: "Yassir Lamouddan | Business Automation & Web Development",
  authors: {
    name: "YLamouddan",
  },

  description:
    "Business automation and web tools by Yassir Lamouddan. Explore working workflow demos, API integrations, and self-hosted projects.",
  openGraph: {
    title: "Yassir Lamouddan | Business Automation & Web Development",
    description:
      "Business automation and web tools by Yassir Lamouddan. Explore working workflow demos, API integrations, and self-hosted projects.",
    url: "https://ylamouddan.com/",
    siteName: "YLamouddan",
    images: "/og.png",
    type: "website",
  },
  keywords: ["Yassir Lamouddan", "web development", "automation", "self-hosting"],
};
//export const metadata: Metadata = {
//title: "Yassir Lamouddan | Development & Automation",
//description: "Yassir Lamouddan's Personal Portfolio",
//};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={spaceGrotesk.className}>
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
