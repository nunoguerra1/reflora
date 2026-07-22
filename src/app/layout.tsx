import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { SmoothScrollProvider } from "@/components/motion/smooth-scroll-provider";
import { Header } from "@/components/layout/header";
import { Preloader } from "@/components/motion/preloader";
import "./globals.css";

export const metadata: Metadata = {
  title: "Reflora",
  description: "Reflorestamento urbano e comunidade de jardinagem",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="font-sans antialiased">
        <SessionProvider>
          <Preloader />
          <SmoothScrollProvider>
            <Header />
            {children}
          </SmoothScrollProvider>
        </SessionProvider>
      </body>
    </html>
  );
}