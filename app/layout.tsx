import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://ylamouddan.com/"),

  title: "YLamouddan",
  authors: {
    name: "YLamouddan",
  },

  description:
    "Based in Poland,I'm a Web developer and an Electrical Engineer. I'm passionate about building a modern web application that users love",
  openGraph: {
    title: "YLamouddan",
    description:
      "Based in Poland,I'm a Web developer and an Electrical Engineer. I'm passionate about building a modern web application that users love",
    url: "https://ylamouddan.com/",
    siteName: "YLamouddan",
    images: "/og.png",
    type: "website",
  },
  keywords: ["daily web coding", "chensokheng", "dailywebcoding"],
};
//export const metadata: Metadata = {
//title: "YLamouddan",
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
