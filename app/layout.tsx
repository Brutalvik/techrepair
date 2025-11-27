import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";
import FooterSection from "@/components/FooterSection";
import { Chatbot } from "@/components/ChatBot";
import { ReduxProvider } from "./ReduxProvider";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen text-foreground bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <ReduxProvider>
            <div className="relative flex flex-col h-screen">
              <Navbar />
              {/* UPDATED: Removed "container mx-auto px-6" 
               Added "w-full" so children can be full width 
            */}
              <main className="w-full flex-grow">{children}</main>

              <FooterSection />
              <Chatbot />
            </div>
          </ReduxProvider>
        </Providers>
      </body>
    </html>
  );
}
