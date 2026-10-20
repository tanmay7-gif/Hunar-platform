"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useHunar } from "@/context/HunarContext";
import { ProtectedImage } from "@/components/ui/ProtectedImage";
import {
  Package,
  Plus,
  ArrowUpRight,
  Trash2,
  Edit,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Box,
  IndianRupee,
  Layers,
  Sparkles,
  ArrowRight
} from "lucide-react";

export default function SellerStudioDashboard() {
  const router = useRouter();
  const {
    currentUser,
    products,
    addProduct,
    deleteProduct,
    showToast
  } = useHunar();

  // Tab filter: "works" | "orders" | "add"
  const [activeTab, setActiveTab] = useState<"works" | "orders" | "add">("works");

  // Form state for "Add a new artwork"
  const [artworkTitle, setArtworkTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Paintings");
  const [size, setSize] = useState("");
  const [medium, setMedium] = useState("");
  const [gst, setGst] = useState("");
  const [description, setDescription] = useState("");
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);

  // Available sample works (Screenshot 7: 6 works)
  const defaultDashboardWorks = [
    {
      id: "prod-quiet-courtyard",
      title: "The quiet courtyard",
      medium: "Gouache on paper · 40 × 30 cm",
      price: 8400,
      status: "Available · 1 original",
      image: "/artworks/the-quiet-courtyard.png"
    },
    {
      id: "prod-monsoon-window",
      title: "Monsoon window",
      medium: "Acrylic on canvas · 30 × 30 cm",
      price: 4800,
      status: "Available · 1 original",
      image: "/artworks/monsoon-window.png"
    },
    {
      id: "prod-marigold-study",
      title: "Marigold study",
      medium: "Gouache on paper · 21 × 30 cm",
      price: 3600,
      status: "Available · 1 original",
      image: "/artworks/marigold-study.png"
    },
    {
      id: "prod-pink-city-morning",
      title: "Pink city morning",
      medium: "Acrylic on canvas · 40 × 50 cm",
      price: 6200,
      status: "Available · 1 original",
      image: "/artworks/pink-city-morning.png"
    },
    {
      id: "prod-amber-evening",
      title: "Amber evening",
      medium: "Acrylic on canvas · 30 × 40 cm",
      price: 8600,
      status: "Sold",
      image: "/artworks/amber-evening.png"
    },
    {
      id: "prod-after-rain",
      title: "After rain",
      medium: "Gouache on paper · 30 × 40 cm",
      price: 5200,
      status: "Sold",
      image: "/artworks/after-rain.png"
    }
  ];

  const [worksList, setWorksList] = useState(defaultDashboardWorks);

  // Sample orders (Screenshot 7: 2 orders)
  const orders = [
    {
      id: "HN-1082",
      date: "14 Oct 2024",
      artwork: "Amber evening · 1 original",
      buyer: "Nisha Kapoor · New Delhi",
      total: 8600,
      status: "Delivered"
    },
    {
      id: "HN-1030",
      date: "10 Oct 2024",
      artwork: "After rain · 1 original",
      buyer: "Dev Shah · Mumbai",
      total: 5200,
      status: "Delivered"
    }
  ];

  const handleDeleteWork = (id: string, title: string) => {
    setWorksList((prev) => prev.filter((w) => w.id !== id));
    deleteProduct(id);
    showToast("Artwork Removed", `"${title}" removed from your studio.`, "info");
  };

  const handleSimulateUpload = () => {
    setUploadedPreview("/artworks/quiet-courtyard-detail.png");
    showToast("Photo Selected", "Cover photo uploaded successfully.", "success");
  };

  const handlePublishArtwork = (e: React.FormEvent) => {
    e.preventDefault();
    if (!artworkTitle.trim()) {
      showToast("Missing Title", "Please enter an artwork title.", "info");
      return;
    }

    const newPiece = {
      id: `prod-${Date.now()}`,
      title: artworkTitle,
      medium: `${medium || "Original Medium"} · ${size || "Standard Size"}`,
      price: Number(price) || 4500,
      status: "Available · 1 original",
      image: uploadedPreview || "/artworks/quiet-courtyard-detail.png"
    };

    setWorksList((prev) => [newPiece, ...prev]);

    addProduct({
      id: newPiece.id,
      title: artworkTitle,
      price: Number(price) || 4500,
      category: (category as any) || "Paintings",
      dimensions: size,
      material: medium,
      description,
      images: [newPiece.image]
    });

    showToast("Published!", `"${artworkTitle}" is now live on your storefront.`, "success");
    setArtworkTitle("");
    setPrice("");
    setSize("");
    setMedium("");
    setGst("");
    setDescription("");
    setUploadedPreview(null);
    setActiveTab("works");
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#2B1219] py-8 sm:py-12 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Page Header (Screenshot 7: YOUR STUDIO, AT A GLANCE / नमस्ते, Rhea.) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E7E0D6] pb-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#C85A32] mb-1">
              Your studio, at a glance
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#2B1219] font-medium tracking-tight">
              नमस्ते, {currentUser?.name ? currentUser.name.split(" ")[0] : "Rhea"}.
            </h1>
            <p className="text-xs text-[#5E4B4E] mt-1">
              Your work has a home here. Let&apos;s make room for what&apos;s next.
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
            <button
              onClick={() => {
                setActiveTab("add");
                const el = document.getElementById("add-artwork-section");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-4 py-2 rounded-xs bg-[#6E1F2E] hover:bg-[#581723] text-[#FFFDF8] text-xs font-medium transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <span>Add artwork</span>
              <Plus className="w-3.5 h-3.5" />
            </button>
            <Link
              href="/artist/rhea-sharma"
              className="text-xs text-[#5E4B4E] hover:text-[#2B1219] flex items-center gap-1 font-medium transition-colors"
            >
              <span>View my storefront</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 3 Metric Stat KPI Cards (Screenshot 7: My works, Orders, Earnings) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {/* Card 1: My works */}
          <div className="bg-[#F0E3C8] border border-[#D4CDC3] rounded-xs p-5 relative shadow-2xs">
            <div className="flex items-start justify-between">
              <span className="text-xs text-[#5E4B4E] font-medium">My works</span>
              <Layers className="w-4 h-4 text-[#C85A32]" />
            </div>
            <div className="font-serif text-3xl sm:text-4xl font-semibold text-[#2B1219] mt-2">
              {worksList.length}
            </div>
            <p className="text-[11px] text-[#5E4B4E] mt-1">
              {worksList.filter((w) => w.status.includes("Available")).length} available ·{" "}
              {worksList.filter((w) => w.status === "Sold").length} sold
            </p>
          </div>

          {/* Card 2: Orders */}
          <div className="bg-[#F0E3C8] border border-[#D4CDC3] rounded-xs p-5 relative shadow-2xs">
            <div className="flex items-start justify-between">
              <span className="text-xs text-[#5E4B4E] font-medium">Orders</span>
              <Box className="w-4 h-4 text-[#C85A32]" />
            </div>
            <div className="font-serif text-3xl sm:text-4xl font-semibold text-[#2B1219] mt-2">
              2
            </div>
            <p className="text-[11px] text-[#5E4B4E] mt-1">2 delivered · all time</p>
          </div>

          {/* Card 3: Earnings */}
          <div className="bg-[#F0E3C8] border border-[#D4CDC3] rounded-xs p-5 relative shadow-2xs">
            <div className="flex items-start justify-between">
              <span className="text-xs text-[#5E4B4E] font-medium">Earnings</span>
              <IndianRupee className="w-4 h-4 text-[#C85A32]" />
            </div>
            <div className="font-serif text-3xl sm:text-4xl font-semibold text-[#2B1219] mt-2">
              ₹12,000
            </div>
            <p className="text-[11px] text-[#5E4B4E] mt-1">Artwork sales · all time</p>
          </div>
        </div>

        {/* Tab Filter Pills (Screenshot 7: My works, Orders (2), Add artwork) */}
        <div className="flex items-center gap-2 text-xs border-b border-[#E7E0D6] pb-3">
          <button
            onClick={() => setActiveTab("works")}
            className={`px-3.5 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
              activeTab === "works"
                ? "bg-[#2B1219] text-[#FFFDF8]"
                : "bg-[#FAF5EC] hover:bg-[#EFE7DC] text-[#5E4B4E] border border-[#E7E0D6]"
            }`}
          >
            My works
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-3.5 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
              activeTab === "orders"
                ? "bg-[#2B1219] text-[#FFFDF8]"
                : "bg-[#FAF5EC] hover:bg-[#EFE7DC] text-[#5E4B4E] border border-[#E7E0D6]"
            }`}
          >
            Orders (2)
          </button>
          <button
            onClick={() => setActiveTab("add")}
            className={`px-3.5 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
              activeTab === "add"
                ? "bg-[#2B1219] text-[#FFFDF8]"
                : "bg-[#FAF5EC] hover:bg-[#EFE7DC] text-[#5E4B4E] border border-[#E7E0D6]"
            }`}
          >
            Add artwork
          </button>
        </div>

        {/* SECTION 1: MY WORKS TABLE */}
        {(activeTab === "works" || activeTab === "add") && (
          <div className="space-y-4">
            <div className="flex items-baseline justify-between">
              <h2 className="font-serif text-xl sm:text-2xl text-[#2B1219] font-medium">
                My works
              </h2>
              <span className="text-xs text-[#8A8986]">
                {worksList.length} works · Prices in INR
              </span>
            </div>

            <div className="bg-[#FFFDF8] border border-[#E7E0D6] rounded-xs overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#FAF0EB] text-[#6E1F2E] text-[10px] font-bold uppercase tracking-wider border-b border-[#F3CFBF]">
                      <th className="py-2.5 px-4">Artwork</th>
                      <th className="py-2.5 px-4">Price</th>
                      <th className="py-2.5 px-4">Status</th>
                      <th className="py-2.5 px-4 text-right">Edit / Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7E0D6]">
                    {worksList.map((work) => (
                      <tr key={work.id} className="hover:bg-[#FAF8F5] transition-colors">
                        {/* Artwork Info */}
                        <td className="py-3 px-4 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xs overflow-hidden bg-[#F0E3C8]/40 border border-[#E7E0D6] shrink-0">
                            <ProtectedImage
                              src={work.image}
                              alt={work.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-[#2B1219]">{work.title}</p>
                            <p className="text-[11px] text-[#8A8986]">{work.medium}</p>
                          </div>
                        </td>

                        {/* Price */}
                        <td className="py-3 px-4 font-semibold text-[#2B1219]">
                          ₹{work.price.toLocaleString("en-IN")}
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${
                              work.status === "Sold"
                                ? "bg-[#FAF5EC] text-[#8A8986] border-[#E7E0D6]"
                                : "bg-[#FAF0EB] text-[#C85A32] border-[#F3CFBF]"
                            }`}
                          >
                            {work.status}
                          </span>
                        </td>

                        {/* Edit / Delete */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-3 text-xs">
                            <Link
                              href={`/artwork/${work.id}`}
                              className="text-[#5E4B4E] hover:text-[#2B1219] flex items-center gap-0.5 font-medium"
                            >
                              <span>Edit</span>
                              <ArrowUpRight className="w-3 h-3" />
                            </Link>
                            <button
                              onClick={() => handleDeleteWork(work.id, work.title)}
                              className="text-[#8A8986] hover:text-[#C85A32] transition-colors cursor-pointer"
                              title="Delete listing"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: ORDERS TABLE */}
        {(activeTab === "orders" || activeTab === "works") && (
          <div className="space-y-4 pt-6">
            <div className="flex items-baseline justify-between">
              <h2 className="font-serif text-xl sm:text-2xl text-[#2B1219] font-medium">
                Orders
              </h2>
              <span className="text-xs text-[#8A8986]">
                Sample order history · 2 orders
              </span>
            </div>

            <div className="bg-[#FFFDF8] border border-[#E7E0D6] rounded-xs overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#FAF0EB] text-[#6E1F2E] text-[10px] font-bold uppercase tracking-wider border-b border-[#F3CFBF]">
                      <th className="py-2.5 px-4">Order / Date</th>
                      <th className="py-2.5 px-4">Artwork / Buyer</th>
                      <th className="py-2.5 px-4">Artwork Total</th>
                      <th className="py-2.5 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7E0D6]">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#FAF8F5] transition-colors">
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-[#2B1219]">{ord.id}</p>
                          <p className="text-[11px] text-[#8A8986]">{ord.date}</p>
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-medium text-[#2B1219]">{ord.artwork}</p>
                          <p className="text-[11px] text-[#5E4B4E]">{ord.buyer}</p>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-[#2B1219]">
                          ₹{ord.total.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#FAF5EC] text-[#5E4B4E] border border-[#E7E0D6]">
                            {ord.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <p className="text-[11px] text-[#8A8986]">
              Earnings reflect artwork totals for the two sample sales above. Shipping is excluded.
            </p>
          </div>
        )}

        {/* SECTION 3: ADD A NEW ARTWORK FORM (Screenshot 7) */}
        <div id="add-artwork-section" className="space-y-4 pt-6">
          <div className="flex items-baseline justify-between">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl text-[#2B1219] font-medium">
                Add a new artwork
              </h2>
              <p className="text-xs text-[#5E4B4E] mt-0.5">
                Start with a good photo. The details help someone picture it at home.
              </p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#FAF5EC] border border-[#E7E0D6] text-[10px] text-[#8A8986] font-medium">
              New listing · not published
            </span>
          </div>

          <form
            onSubmit={handlePublishArtwork}
            className="bg-[#FAF0EB] rounded-xs border border-[#F3CFBF] p-6 sm:p-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: 01 · ADD YOUR PHOTOS */}
              <div className="lg:col-span-5 space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#C85A32]">
                  01 · Add your photos
                </p>

                {/* Dropzone container */}
                <div
                  onClick={handleSimulateUpload}
                  className="aspect-square rounded-xs border-2 border-dashed border-[#D9C4B7] bg-[#FFFFFF] hover:bg-[#FAF8F5] transition-colors p-6 flex flex-col items-center justify-center text-center cursor-pointer relative overflow-hidden"
                >
                  {uploadedPreview ? (
                    <ProtectedImage
                      src={uploadedPreview}
                      alt="Uploaded artwork"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <ImageIcon className="w-8 h-8 text-[#C85A32] mb-2" />
                      <p className="text-xs font-semibold text-[#2B1219]">
                        Let your work do the talking.
                      </p>
                      <p className="text-[10px] text-[#8A8986] mt-1 max-w-[200px] leading-relaxed">
                        Drag photos here or choose a file. JPG or PNG · up to 8 MB each
                      </p>
                      <button
                        type="button"
                        className="mt-3 px-3 py-1.5 rounded-xs border border-[#D4CDC3] bg-[#FFFFFF] text-xs font-medium text-[#2B1219] hover:bg-[#F0E3C8]"
                      >
                        Upload photos
                      </button>
                    </>
                  )}
                </div>

                <p className="text-[10px] text-[#5E4B4E] leading-relaxed">
                  Your first photo is the cover. Use natural light, show the full piece and add a
                  close-up of the surface. Avoid filters that change the colours.
                </p>
              </div>

              {/* Right Column: 02 · TELL US ABOUT THE PIECE */}
              <div className="lg:col-span-7 space-y-3.5 text-xs">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#C85A32]">
                  02 · Tell us about the piece
                </p>

                <div>
                  <label className="block text-[11px] font-medium text-[#5E4B4E] mb-1">
                    Artwork title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sunday light"
                    value={artworkTitle}
                    onChange={(e) => setArtworkTitle(e.target.value)}
                    required
                    className="w-full bg-[#FFFFFF] border border-[#D4CDC3] rounded-xs px-3 py-2 text-xs text-[#2B1219] focus:outline-hidden focus:border-[#6E1F2E]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-[#5E4B4E] mb-1">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 4,500"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                      className="w-full bg-[#FFFFFF] border border-[#D4CDC3] rounded-xs px-3 py-2 text-xs text-[#2B1219] focus:outline-hidden focus:border-[#6E1F2E]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#5E4B4E] mb-1">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-[#FFFFFF] border border-[#D4CDC3] rounded-xs px-3 py-2 text-xs text-[#2B1219] focus:outline-hidden focus:border-[#6E1F2E]"
                    >
                      <option value="Paintings">Paintings</option>
                      <option value="Ceramics">Ceramics</option>
                      <option value="Textiles">Textiles</option>
                      <option value="Prints">Prints</option>
                      <option value="Jewellery">Jewellery</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-[#5E4B4E] mb-1">
                      Size (W × H, cm)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 30 × 40 cm"
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      className="w-full bg-[#FFFFFF] border border-[#D4CDC3] rounded-xs px-3 py-2 text-xs text-[#2B1219] focus:outline-hidden focus:border-[#6E1F2E]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#5E4B4E] mb-1">
                      Medium
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Gouache on cotton paper"
                      value={medium}
                      onChange={(e) => setMedium(e.target.value)}
                      className="w-full bg-[#FFFFFF] border border-[#D4CDC3] rounded-xs px-3 py-2 text-xs text-[#2B1219] focus:outline-hidden focus:border-[#6E1F2E]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#5E4B4E] mb-1">
                      GST (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 225"
                      value={gst}
                      onChange={(e) => setGst(e.target.value)}
                      className="w-full bg-[#FFFFFF] border border-[#D4CDC3] rounded-xs px-3 py-2 text-xs text-[#2B1219] focus:outline-hidden focus:border-[#6E1F2E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#5E4B4E] mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="What inspired this piece? Include the materials, whether it is framed, and any details a buyer should know."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-[#FFFFFF] border border-[#D4CDC3] rounded-xs px-3 py-2 text-xs text-[#2B1219] focus:outline-hidden focus:border-[#6E1F2E]"
                  />
                </div>

                {/* Inset Alert Callout (Screenshot 7) */}
                <div className="p-3 bg-[#FAF5EC] border border-[#E7DEC8] rounded-xs text-[11px] text-[#5E4B4E] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C85A32] shrink-0" />
                  <span>
                    Listing an original? Availability starts at 1. Once sold, it is no longer
                    available to buy.
                  </span>
                </div>

                {/* Bottom Action Bar */}
                <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#F3CFBF]">
                  <span className="text-[11px] text-[#5E4B4E]">
                    Check your photos and details before publishing to your storefront.
                  </span>
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => showToast("GST Verified", "Harmonized tax code approved.", "info")}
                      className="px-4 py-2 rounded-xs bg-[#6E1F2E] hover:bg-[#581723] text-[#FFFDF8] text-xs font-medium transition-colors cursor-pointer"
                    >
                      GST Approve &rarr;
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xs bg-[#6E1F2E] hover:bg-[#581723] text-[#FFFDF8] text-xs font-medium transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
                    >
                      <span>Publish artwork</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Bottom footer credit (Screenshot 7) */}
        <div className="pt-6 border-t border-[#E7E0D6] flex flex-col sm:flex-row items-center justify-between text-xs text-[#8A8986] gap-2">
          <span>Your studio, your pace. Made for independent artists.</span>
          <span>Design preview · Sample works and order history</span>
        </div>
      </div>
    </div>
  );
}
