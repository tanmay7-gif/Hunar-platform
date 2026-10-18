import type { Metadata } from "next";
import "./globals.css";
import { HunarProvider } from "@/context/HunarContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ToastNotification } from "@/components/ToastNotification";

export const metadata: Metadata = {
  title: "Hunar (हुनर) | Authentic Grassroots Artisans & Creators Platform",
  description:
    "An authentic, hyper-local career and monetization platform for grassroots visual artists, Madhubani/folk artisans, mehndi artists, studio potters, sculptors, and performers.",
  keywords: [
    "Hunar",
    "Indian Artisans",
    "Madhubani Art",
    "Muralist",
    "Studio Pottery",
    "Bridal Mehndi",
    "Folk Art",
    "Grassroots Creators",
    "Hunar Card",
    "Kala Roadmap"
  ]
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#F9F6F0] text-[#1A1816] antialiased selection:bg-[#F3CFBF] selection:text-[#A33F1C]">
        <HunarProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <ToastNotification />
        </HunarProvider>
      </body>
    </html>
  );
}
