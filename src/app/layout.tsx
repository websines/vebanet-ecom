import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/lib/providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Vebanet - Premium Electronics Store",
  description: "Your destination for premium electronics and technology. Computers, components, smartphones, gaming, and more.",
  keywords: ["electronics", "computers", "gaming", "smartphones", "technology", "components"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 pt-24 lg:pt-28">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
