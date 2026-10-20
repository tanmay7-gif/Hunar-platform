"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useHunar } from "@/context/HunarContext";
import { ProtectedImage } from "@/components/ui/ProtectedImage";
import { ShoppingBag, Truck, ArrowUpRight, Check, ArrowRight } from "lucide-react";

function ArtworkDetailContent() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { products, addToCart, cart } = useHunar();

  // Find product by id, slug or title fallback
  const product =
    products.find((p) => p.id === id || p.id === `prod-${id}`) ||
    products[0]; // fallback to "The quiet courtyard"

  const [activeTab, setActiveTab] = useState<"full" | "brushwork" | "texture">("full");
  const [added, setAdded] = useState(false);

  // Available thumbnails matching Screenshot 3
  const thumbnails = [
    { id: "full", label: "Full view", img: product.images[0] || "/artworks/quiet-courtyard-detail.png" },
    { id: "brushwork", label: "Brushwork", img: product.images[1] || product.images[0] || "/artworks/the-quiet-courtyard.png" },
    { id: "texture", label: "Paper & colour", img: "/artworks/rhea-process.png" }
  ];

  const currentDisplayImg =
    activeTab === "full"
      ? product.images[0] || "/artworks/quiet-courtyard-detail.png"
      : activeTab === "brushwork"
      ? product.images[1] || product.images[0] || "/artworks/the-quiet-courtyard.png"
      : "/artworks/rhea-process.png";

  const handleAddToCart = () => {
    addToCart({
      id: `cart-${product.id}-${Date.now()}`,
      productId: product.id,
      title: product.title,
      artist: product.sellerName,
      medium: product.material || "Gouache on paper",
      price: product.price,
      image: product.images[0] || "/artworks/the-quiet-courtyard.png",
      quantity: 1
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  // 3 more pieces from Rhea's studio (Monsoon window, Marigold study, Pink city morning)
  const moreFromStudio = [
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
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumbs (Screenshot 3: Shop art / Paintings / The quiet courtyard) */}
        <nav className="flex items-center gap-2 text-xs text-[#5E4B4E] mb-8">
          <Link href="/shop" className="hover:text-[#2B1219] transition-colors">
            Shop art
          </Link>
          <span>/</span>
          <Link
            href={`/shop?cat=${encodeURIComponent(product.category || "Paintings")}`}
            className="hover:text-[#2B1219] transition-colors"
          >
            {product.category || "Paintings"}
          </Link>
          <span>/</span>
          <span className="text-[#2B1219] font-medium truncate max-w-xs">{product.title}</span>
        </nav>

        {/* Main Artwork Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Column: Artwork Frame & Thumbnails */}
          <div className="lg:col-span-7">
            {/* Museum Matting Container */}
            <div className="bg-[#F0E3C8] border border-[#D4CDC3] p-6 sm:p-10 rounded-xs flex items-center justify-center shadow-2xs">
              <div className="relative max-w-lg w-full aspect-4/3 bg-[#FFFFFF] p-3 sm:p-4 shadow-xs border border-[#E7E0D6]">
                <ProtectedImage
                  src={currentDisplayImg}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Thumbnail selector row */}
            <div className="mt-4 flex items-center gap-3">
              {thumbnails.map((thumb) => (
                <button
                  key={thumb.id}
                  onClick={() => setActiveTab(thumb.id as any)}
                  className={`flex flex-col items-center gap-1.5 p-1 rounded-xs border transition-colors cursor-pointer ${
                    activeTab === thumb.id
                      ? "border-[#6E1F2E] bg-white ring-1 ring-[#6E1F2E]"
                      : "border-[#E7E0D6] bg-[#FAF5EC] hover:border-[#D4CDC3]"
                  }`}
                >
                  <div className="w-12 h-10 overflow-hidden bg-[#EAE2D5]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={thumb.img}
                      alt={thumb.label}
                      className="w-full h-full object-cover pointer-events-none"
                    />
                  </div>
                  <span className="text-[10px] text-[#5E4B4E] font-medium">{thumb.label}</span>
                </button>
              ))}
            </div>

            {/* Footnote */}
            <p className="text-[11px] text-[#8A8986] mt-4">
              Artwork size: {product.dimensions || "40 × 30 cm (W × H)"}. Shown without a frame.
            </p>
          </div>

          {/* Right Column: Details & Purchasing */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#C85A32] mb-1.5">
                ORIGINAL PAINTING · 2024
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#2B1219] font-medium tracking-tight">
                {product.title}
              </h1>
            </div>

            {/* Artist Row */}
            <div className="flex items-center gap-3 py-1">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-[#E7E0D6] shrink-0 bg-[#EAE2D5]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.sellerAvatar || "/artworks/rhea-sharma-portrait.png"}
                  alt={product.sellerName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <Link
                  href="/artist/rhea-sharma"
                  className="text-xs font-semibold text-[#2B1219] hover:text-[#6E1F2E] flex items-center gap-1 transition-colors"
                >
                  <span>{product.sellerName}</span>
                  <ArrowUpRight className="w-3 h-3 text-[#6E1F2E]" />
                </Link>
                <p className="text-[11px] text-[#5E4B4E]">Painted in Jaipur, Rajasthan</p>
              </div>
            </div>

            {/* Price & Stock Pill */}
            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-2xl font-serif font-bold text-[#2B1219]">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#FAF0EB] border border-[#F3CFBF] text-[11px] text-[#C85A32] font-medium">
                One original available
              </span>
            </div>

            {/* Specifications Table */}
            <div className="border-t border-b border-[#E7E0D6] py-3.5 space-y-2 text-xs">
              <div className="grid grid-cols-3">
                <span className="text-[#8A8986]">Medium</span>
                <span className="col-span-2 text-[#2B1219] font-medium">
                  {product.material || "Gouache on cotton paper"}
                </span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-[#8A8986]">Size</span>
                <span className="col-span-2 text-[#2B1219] font-medium">
                  {product.dimensions || "40 × 30 cm (W × H)"}
                </span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-[#8A8986]">Presentation</span>
                <span className="col-span-2 text-[#2B1219] font-medium">
                  {product.presentation || "Unframed · Signed on the back"}
                </span>
              </div>
            </div>

            {/* CTA Button: Add to Cart */}
            <div className="space-y-2.5 pt-1">
              <button
                onClick={handleAddToCart}
                className="w-full py-3 px-6 rounded-xs bg-[#6E1F2E] hover:bg-[#581723] text-[#FFFDF8] text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 text-[#FFFDF8]" />
                    <span>Added to cart</span>
                  </>
                ) : (
                  <>
                    <span>Add to cart</span>
                    <ShoppingBag className="w-4 h-4" />
                  </>
                )}
              </button>

              {added && (
                <div className="flex items-center justify-between text-xs px-3 py-2 bg-[#F0E3C8]/40 border border-[#E7E0D6] rounded-xs">
                  <span className="text-[#5E4B4E]">Item saved in cart</span>
                  <Link href="/cart" className="text-[#6E1F2E] font-semibold hover:underline flex items-center gap-1">
                    <span>View cart ({cart.length})</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>

            {/* Shipping Promise */}
            <div className="flex items-start gap-2.5 text-xs text-[#5E4B4E] pt-1">
              <Truck className="w-4 h-4 text-[#8A8986] shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Ships from {product.sellerName.split(" ")[0]}&apos;s Jaipur studio. Packed flat with a
                protective backing. Shipping cost is shown at checkout.
              </p>
            </div>

            {/* Hairline Divider & Narrative Story */}
            <div className="pt-4 border-t border-[#E7E0D6] space-y-2.5">
              <h3 className="font-serif text-base text-[#2B1219] font-medium">
                An ordinary corner, held in colour.
              </h3>
              <p className="text-xs text-[#5E4B4E] italic leading-relaxed">
                &ldquo;This courtyard is a few lanes from my home. I kept returning to the green leaves
                against the pink wall, and the way the afternoon light made everything still.&rdquo;
              </p>
              <p className="text-xs text-[#5E4B4E] leading-relaxed">
                Painted by hand in opaque gouache, with the paper&apos;s texture left visible. A single
                original, not a print.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section: More from Rhea's studio */}
        <section className="mt-16 pt-10 border-t border-[#E7E0D6]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl text-[#2B1219] font-medium">
              More from Rhea&apos;s studio
            </h2>
            <Link
              href="/artist/rhea-sharma"
              className="text-xs text-[#5E4B4E] hover:text-[#2B1219] flex items-center gap-1 font-medium transition-colors"
            >
              <span>Meet the artist</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {moreFromStudio.map((work) => (
              <Link
                key={work.id}
                href={`/artwork/${work.id}`}
                className="group block"
              >
                <div className="aspect-4/3 rounded-xs overflow-hidden bg-[#F0E3C8]/40 border border-[#E7E0D6] group-hover:border-[#C8B8A6] transition-colors relative">
                  <ProtectedImage
                    src={work.image}
                    alt={work.title}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  />
                </div>
                <div className="mt-2.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-xs font-semibold text-[#2B1219] group-hover:text-[#6E1F2E] transition-colors truncate">
                      {work.title}
                    </h3>
                    <span className="text-xs font-bold text-[#2B1219] shrink-0">
                      ₹{work.price.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#5E4B4E] mt-0.5">{work.artist}</p>
                  <p className="text-[10px] text-[#8A8986]">{work.medium}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default function ArtworkDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F7F5EF] p-12 text-center text-xs text-[#8A8986]">
          Loading artwork details...
        </div>
      }
    >
      <ArtworkDetailContent />
    </Suspense>
  );
}
