"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useHunar } from "@/context/HunarContext";
import { ProtectedImage } from "@/components/ui/ProtectedImage";
import { MapPin } from "lucide-react";

function ArtistProfileContent() {
  const params = useParams();
  const id = params?.id as string;
  const { creators, products } = useHunar();

  // Find creator or default to Rhea Sharma
  const creator =
    creators.find((c) => c.username === id || c.id === id || c.id === `creator-${id}`) ||
    creators[0]; // Rhea Sharma

  // Get her available original works (the 4 from Screenshot 4)
  const rheaWorks = [
    {
      id: "prod-quiet-courtyard",
      title: "The quiet courtyard",
      artist: "Rhea Sharma · Jaipur",
      medium: "Gouache on paper · 40 × 50 cm",
      price: 8400,
      image: "/artworks/the-quiet-courtyard.png"
    },
    {
      id: "prod-monsoon-window",
      title: "Monsoon window",
      artist: "Rhea Sharma · Jaipur",
      medium: "Acrylic on canvas · 30 × 30 cm",
      price: 4800,
      image: "/artworks/monsoon-window.png"
    },
    {
      id: "prod-marigold-study",
      title: "Marigold study",
      artist: "Rhea Sharma · Jaipur",
      medium: "Gouache on paper · 21 × 30 cm",
      price: 3600,
      image: "/artworks/marigold-study.png"
    },
    {
      id: "prod-pink-city-morning",
      title: "Pink city morning",
      artist: "Rhea Sharma · Jaipur",
      medium: "Acrylic on canvas · 40 × 50 cm",
      price: 6200,
      image: "/artworks/pink-city-morning.png"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#2B1219] py-6 sm:py-10 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb (Screenshot 4: Shop art / Rhea Sharma) */}
        <nav className="flex items-center gap-2 text-xs text-[#5E4B4E] mb-8">
          <Link href="/shop" className="hover:text-[#2B1219] transition-colors">
            Shop art
          </Link>
          <span>/</span>
          <span className="text-[#2B1219] font-medium">{creator.name}</span>
        </nav>

        {/* Hero Artist Split Section */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
          {/* Left Column: Large Studio Photograph */}
          <div className="md:col-span-5 aspect-4/5 rounded-xs overflow-hidden border border-[#E7E0D6] bg-[#F0E3C8]">
            <ProtectedImage
              src="/artworks/rhea-sharma-portrait.png"
              alt="Rhea Sharma painting at her easel"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Column: Bio & Voice */}
          <div className="md:col-span-7 space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#C85A32]">
              MEET THE ARTIST
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#2B1219] font-medium tracking-tight">
              {creator.name}
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-[#5E4B4E]">
              <MapPin className="w-3.5 h-3.5 text-[#C85A32]" />
              <span>Jaipur, Rajasthan · Painter</span>
            </div>

            {/* Standout Serif Quote */}
            <blockquote className="font-serif text-lg sm:text-xl text-[#6E1F2E] font-medium leading-snug pt-1">
              &ldquo;I paint the places we walk past. The quiet ones that stay with us.&rdquo;
            </blockquote>

            {/* Extended Bio (Screenshot 4: 4 paragraphs) */}
            <div className="space-y-3 text-xs text-[#5E4B4E] leading-relaxed">
              <p>
                I&apos;m Rhea, an independent painter working from my home studio in Jaipur. My work
                begins on walks through the old city — a sunlit wall, a cluster of leaves, a window
                after rain.
              </p>
              <p>
                I have always believed that art is more than colours on a canvas — it is a way of
                expressing the feelings that words sometimes cannot capture. My journey as a
                painter began with a simple curiosity about colours, shapes, and the little details
                of everyday life. Over time, that curiosity grew into a passion that continues to
                inspire me every day.
              </p>
              <p>
                Through my paintings, I try to capture emotions, memories, nature, and the beauty
                hidden in ordinary moments. Every brushstroke carries a thought, every colour tells a
                story, and every finished piece holds a part of my creative journey.
              </p>
              <p>
                I work with gouache and acrylic, building small, colour-filled observations of
                everyday life. Every original here is painted and signed by me.
              </p>
            </div>

            <p className="text-[11px] text-[#2B1219] font-medium pt-1">
              Artist logline: <span className="font-semibold italic">Turning feelings into colours, one canvas at a time.</span>
            </p>
          </div>
        </section>

        {/* Studio Fast Facts Row (Screenshot 4) */}
        <section className="my-10 border-y border-[#E7E0D6] py-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A8986] mb-1">
                Based in
              </p>
              <p className="font-medium text-[#2B1219]">A home studio in Jaipur</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A8986] mb-1">
                Works with
              </p>
              <p className="font-medium text-[#2B1219]">Gouache, acrylic &amp; cotton paper</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A8986] mb-1">
                Available work
              </p>
              <p className="font-medium text-[#2B1219]">4 originals · 21 to 50 cm</p>
            </div>
          </div>
        </section>

        {/* Available Originals Section (2x2 Grid) */}
        <section className="my-12">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#C85A32] mb-1">
            AVAILABLE ORIGINALS · 4 PIECES
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#2B1219] font-medium tracking-tight mb-8">
            From my studio to your space.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
            {rheaWorks.map((piece) => (
              <Link
                key={piece.id}
                href={`/artwork/${piece.id}`}
                className="group block"
              >
                <div className="aspect-4/3 rounded-xs overflow-hidden bg-[#F0E3C8]/40 border border-[#E7E0D6] group-hover:border-[#C8B8A6] transition-colors relative">
                  <ProtectedImage
                    src={piece.image}
                    alt={piece.title}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  />
                </div>
                <div className="mt-2.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-xs font-semibold text-[#2B1219] group-hover:text-[#6E1F2E] transition-colors">
                      {piece.title}
                    </h3>
                    <span className="text-xs font-bold text-[#2B1219] shrink-0">
                      ₹{piece.price.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#5E4B4E] mt-0.5">{piece.artist}</p>
                  <p className="text-[10px] text-[#8A8986]">{piece.medium}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Process Note Banner (Screenshot 4 bottom card) */}
        <section className="my-12 bg-[#F0E3C8] rounded-xs border border-[#D4CDC3] p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Image */}
            <div className="md:col-span-5 aspect-4/3 rounded-xs overflow-hidden border border-[#D4CDC3] bg-[#FFFFFF]">
              <ProtectedImage
                src="/artworks/rhea-process.png"
                alt="Rhea Sharma working in studio"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Note text */}
            <div className="md:col-span-7 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#C85A32]">
                A NOTE ON THE PROCESS
              </p>
              <h3 className="font-serif text-xl sm:text-2xl text-[#2B1219] font-medium">
                Small details, slow observation.
              </h3>
              <p className="text-xs text-[#5E4B4E] leading-relaxed">
                I sketch on location and return to the studio to paint. Gouache gives me those velvety,
                solid colours; acrylic lets the layers shine through. You&apos;ll find the medium, exact
                dimensions and framing details on every work, so you can picture it in your own space.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function ArtistProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F7F5EF] p-12 text-center text-xs text-[#8A8986]">
          Loading artist profile...
        </div>
      }
    >
      <ArtistProfileContent />
    </Suspense>
  );
}
