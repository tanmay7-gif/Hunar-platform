"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useHunar } from "@/context/HunarContext";
import { Product } from "@/lib/data";
import {
  ArrowLeft,
  Sparkles,
  Upload,
  Image as ImageIcon,
  Check,
  CheckCircle2,
  DollarSign,
  Clock,
  Layers,
  Palette,
  Truck,
  Eye,
  HelpCircle,
  Tag,
  ShieldCheck
} from "lucide-react";
import { getProtectedImageUrl } from "@/lib/imageProtection";

export default function NewProductUploadPage() {
  const router = useRouter();
  const { language, currentUser, addProduct, showToast } = useHunar();
  const isHindi = language === "hi";

  // Form State
  const [title, setTitle] = useState("");
  const [titleHindi, setTitleHindi] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [category, setCategory] = useState<Product["category"]>("Terracotta & Pottery");
  const [material, setMaterial] = useState("Khurja Red Clay, Organic Ash Glaze");
  const [dimensions, setDimensions] = useState("Standard Studio Size");
  const [leadTime, setLeadTime] = useState("Ready to ship");
  const [deliveryFormat, setDeliveryFormat] = useState<Product["deliveryFormat"]>("Physical Artwork");
  const [stock, setStock] = useState<number>(3);
  const [availability, setAvailability] = useState<"In Stock" | "Made to Order" | "Custom Order Only">("In Stock");

  // Visual Image Selector & Upload UI
  const presetPhotos = [
    {
      url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80",
      label: "Glazed Tea Cups with Terracotta Rim"
    },
    {
      url: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80",
      label: "Artisanal Studio Ceramics"
    },
    {
      url: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&auto=format&fit=crop&q=80",
      label: "Ribbed Terracotta Planter Urn"
    },
    {
      url: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&auto=format&fit=crop&q=80",
      label: "Stoneware Dinner Bowls"
    },
    {
      url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80",
      label: "Mithila Tree of Life Canvas"
    },
    {
      url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      label: "Master Artisan Pottery (Cloudinary Protected)"
    },
    {
      url: "https://res.cloudinary.com/demo/image/upload/pottery.jpg",
      label: "Terracotta Planter Master (Cloudinary Protected)"
    },
    {
      url: "https://images.unsplash.com/photo-1549887534-1541e9326642?w=800&auto=format&fit=crop&q=80",
      label: "Botanical Wall Mural Sample"
    }
  ];

  const [selectedImage, setSelectedImage] = useState<string>(presetPhotos[0].url);
  const [customImageUrl, setCustomImageUrl] = useState<string>("");
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories: Product["category"][] = [
    "Terracotta & Pottery",
    "Madhubani Folk Art",
    "Handloom & Textiles",
    "Mural Design",
    "Bridal Mehndi",
    "Woodwork & Stone"
  ];

  const leadTimeOptions = [
    "Ready to ship",
    "Made to order: 3 days",
    "Made to order: 5 days",
    "Made to order: 10 days",
    "On-site: 4-6 days"
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setSelectedImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) return;

    setIsSubmitting(true);

    const imageToUse = customImageUrl.trim() ? customImageUrl.trim() : selectedImage;

    const product = addProduct({
      title,
      titleHindi: titleHindi || title,
      description: description || "Authentic handmade creation crafted in studio with traditional materials.",
      price: Number(price),
      category,
      images: [imageToUse],
      leadTime,
      stock: availability === "Custom Order Only" ? 0 : Number(stock),
      deliveryFormat,
      status: "Live",
      dimensions,
      material,
      sellerId: currentUser.id,
      sellerName: currentUser.name,
      sellerCity: currentUser.city,
      sellerAvatar: currentUser.avatarUrl,
      sellerPhone: currentUser.phone || "+91 98118 76543",
      sellerWhatsapp: currentUser.whatsapp || "919811876543",
      sellerVerified: true
    });

    setIsSubmitting(false);
    router.push("/dashboard/seller/products");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/seller/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#B4461F] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isHindi ? "शिल्प इन्वेंटरी पर वापस" : "Back to Craft Inventory"}</span>
        </Link>

        <span className="text-xs text-gray-400 font-mono">
          Creator: {currentUser.name} ({currentUser.city})
        </span>
      </div>

      {/* Studio Form Container */}
      <div className="rounded-sm bg-white border border-[#E8E2D7] p-6 sm:p-10 shadow-[0_2px_8px_rgba(0,0,0,0.04)] relative overflow-hidden">
        <div className="border-b border-[#E8E2D7] pb-4 mb-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#8A7561] mb-2">
              {isHindi ? "शिल्प अपलोड स्टूडियो" : "Studio Catalog Entry"}
            </p>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1E2229]">
              {isHindi ? "नई हस्तनिर्मित कलाकृति सूचीबद्ध करें" : "Publish a New Artwork to Your Studio Catalog"}
            </h1>
            <p className="text-xs text-[#635C53] mt-2">
              {isHindi
                ? "स्पष्ट विवरण, मूल्य और फ़ोटो जोड़ें। यह तुरंत कला संरक्षकों की डिस्कवरी फीड में लाइव हो जाएगी।"
                : "Structured listing workflow for independent makers: direct pricing, material transparency, and instant inventory tracking."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. Category & Medium */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1A1816] mb-1.5 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-[#B4461F]" />
                  <span>{isHindi ? "शिल्प विधा / श्रेणी:" : "Art Form / Category:"}</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Product["category"])}
                  className="w-full px-3.5 py-2 rounded-sm bg-[#FDFCF9] border border-[#D3CBBE] text-xs font-semibold text-[#1A1816] focus:outline-none focus:border-[#B4461F]"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A1816] mb-1.5 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#B4461F]" />
                  <span>{isHindi ? "माध्यम एवं सामग्री:" : "Medium & Raw Materials:"}</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Khurja red clay, natural ash glaze, or mineral soot on tussar"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-sm bg-[#FDFCF9] border border-[#D3CBBE] text-xs text-[#1A1816] focus:outline-none focus:border-[#B4461F]"
                />
              </div>
            </div>

            {/* 2. Title & Hindi Title */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1A1816] mb-1.5">
                  {isHindi ? "कलाकृति का शीर्षक (Title in English):" : "Product Title & Batch (English):"}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Khurja Terracotta Glazed Tea Set - Batch of 6"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-sm bg-[#FDFCF9] border border-[#D3CBBE] text-xs font-semibold text-[#1A1816] focus:outline-none focus:border-[#B4461F]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A1816] mb-1.5">
                  {isHindi ? "हिंदी शीर्षक (वैकल्पिक):" : "Hindi Title (Optional):"}
                </label>
                <input
                  type="text"
                  placeholder="जैसे: खुर्जा टेराकोटा ग्लेज्ड चाय सेट"
                  value={titleHindi}
                  onChange={(e) => setTitleHindi(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-sm bg-[#FDFCF9] border border-[#D3CBBE] text-xs text-[#1A1816] focus:outline-none focus:border-[#B4461F]"
                />
              </div>
            </div>

            {/* 3. Product Story / Description */}
            <div>
              <label className="block text-xs font-semibold text-[#1A1816] mb-1.5">
                {isHindi ? "कलाकृति की कहानी एवं शिल्प तकनीक:" : "Craft Story & Process Description:"}
              </label>
              <textarea
                rows={3}
                required
                placeholder={
                  isHindi
                    ? "इस कृति को बनाने की तकनीक, परंपरा और उपयोग के बारे में बताएं..."
                    : "Describe the wheel throwing, kiln firing, pigment preparation, and tactile details..."
                }
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2 rounded-sm bg-[#FDFCF9] border border-[#D3CBBE] text-xs text-[#1A1816] focus:outline-none focus:border-[#B4461F]"
              />
            </div>

            {/* 4. Pricing, Estimated Creation Time, Delivery Format */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1A1816] mb-1.5 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-[#B4461F]" />
                  <span>{isHindi ? "मूल्य (INR ₹):" : "Direct Price (INR ₹):"}</span>
                </label>
                <input
                  type="number"
                  required
                  min={100}
                  step={50}
                  placeholder="e.g. 3200"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-sm bg-[#FDFCF9] border border-[#D3CBBE] text-sm font-serif font-bold text-[#1E2229] focus:outline-none focus:border-[#B4461F]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A1816] mb-1.5 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#B4461F]" />
                  <span>{isHindi ? "निर्माण / प्रेषण समय:" : "Creation / Lead Time:"}</span>
                </label>
                <select
                  value={leadTime}
                  onChange={(e) => setLeadTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-sm bg-[#FDFCF9] border border-[#D3CBBE] text-xs font-medium text-[#1A1816] focus:outline-none focus:border-[#B4461F]"
                >
                  {leadTimeOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A1816] mb-1.5 flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-[#B4461F]" />
                  <span>{isHindi ? "वितरण प्रारूप:" : "Delivery Format:"}</span>
                </label>
                <select
                  value={deliveryFormat}
                  onChange={(e) => setDeliveryFormat(e.target.value as Product["deliveryFormat"])}
                  className="w-full px-3 py-2 rounded-sm bg-[#FDFCF9] border border-[#D3CBBE] text-xs font-medium text-[#1A1816] focus:outline-none focus:border-[#B4461F]"
                >
                  <option value="Physical Artwork">Physical Artwork (Courier/Ship)</option>
                  <option value="On-site Commission">On-site Commission (Mural/Event)</option>
                </select>
              </div>
            </div>

            {/* 5. Inventory & Availability Toggle */}
            <div className="p-4 rounded-sm bg-[#FAF7F2] border border-[#E8E2D7] space-y-3">
              <label className="block text-xs font-semibold text-[#1A1816]">
                {isHindi ? "इन्वेंटरी उपलब्धता स्थिति:" : "Inventory Availability Setting:"}
              </label>

              <div className="grid grid-cols-3 gap-3">
                {(["In Stock", "Made to Order", "Custom Order Only"] as const).map((avail) => (
                  <button
                    type="button"
                    key={avail}
                    onClick={() => setAvailability(avail)}
                    className={`py-2 px-3 rounded-sm text-xs font-medium transition-colors duration-150 border text-center ${
                      availability === avail
                        ? "bg-[#1E2229] text-[#FAF7F2] border-[#1E2229]"
                        : "bg-white text-[#635C53] border-[#E8E2D7] hover:bg-[#FAF7F2]"
                    }`}
                  >
                    {avail}
                  </button>
                ))}
              </div>

              {availability !== "Custom Order Only" && (
                <div className="flex items-center gap-3 pt-1">
                  <span className="text-xs text-[#635C53]">Stock Quantity:</span>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-24 px-3 py-1.5 rounded-sm bg-white border border-[#D3CBBE] text-xs font-semibold text-[#1A1816]"
                  />
                  <span className="text-[11px] text-[#635C53]">units available ready in studio</span>
                </div>
              )}
            </div>

            {/* 6. Image Uploader UI (Drag & Drop + Preset Selector) */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-[#1A1816] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[#B4461F]" />
                  <span>{isHindi ? "कलाकृति फ़ोटो चुनें या अपलोड करें:" : "Artwork Primary Photo & Gallery Selector:"}</span>
                </span>
                <span className="text-[11px] text-[#635C53] font-normal">
                  High-res studio photo
                </span>
              </label>

              {/* Drag & Drop Zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`p-6 border border-dashed rounded-sm text-center transition-colors duration-150 ${
                  dragActive
                    ? "border-[#B4461F] bg-[#FAF0E6]"
                    : "border-[#D3CBBE] bg-[#FAF7F2] hover:bg-[#F4EFE6]"
                }`}
              >
                <Upload className="w-6 h-6 text-[#B4461F] mx-auto mb-2" />
                <p className="text-xs font-semibold text-[#1A1816]">
                  {isHindi ? "फ़ाइल यहां खींचें और छोड़ें या नीचे दिए गए नमूनों में से चुनें" : "Drag and drop photo here, or select from artisan preset captures"}
                </p>
                <p className="text-[11px] text-[#635C53] mt-0.5">
                  PNG, JPG, WEBP up to 10MB
                </p>
              </div>

              {/* Preset Gallery Selector */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8A7561] mb-2">
                  Select Visual Lookbook Cover:
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                  {presetPhotos.map((preset, idx) => {
                    const isPicked = selectedImage === preset.url;
                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          setSelectedImage(preset.url);
                          setCustomImageUrl("");
                        }}
                        className={`relative h-20 rounded-sm overflow-hidden cursor-pointer border-2 transition-colors duration-150 ${
                          isPicked
                            ? "border-[#B4461F]"
                            : "border-[#E8E2D7] hover:border-[#8A7561] opacity-80 hover:opacity-100"
                        }`}
                        title={preset.label}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-full h-full object-cover"
                        />
                        {isPicked && (
                          <div className="absolute top-1 right-1 p-0.5 rounded-xs bg-[#B4461F] text-white">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Optional Custom Image URL */}
              <div>
                <input
                  type="url"
                  placeholder="Or paste an image URL directly (e.g. Cloudinary https://res.cloudinary.com/... or Unsplash)"
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-sm bg-[#FDFCF9] border border-[#D3CBBE] text-xs text-[#1A1816] focus:outline-none focus:border-[#B4461F]"
                />
              </div>

              {/* Dynamic Watermark Security Shield Notice */}
              <div className="p-3.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-sm flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-[#B4461F] shrink-0 mt-0.5" />
                <div className="text-xs space-y-1 w-full">
                  <p className="font-semibold text-[#1A1816]">
                    Backend-Enforced Cloudinary Dynamic Watermarking & Resolution Limiting
                  </p>
                  <p className="text-[#635C53] leading-relaxed">
                    Master image assets are never delivered in their raw high-resolution format. All public lookbook views and product cards are automatically watermarked (<code className="bg-[#EFE9DF] px-1 py-0.5 rounded text-[11px] font-mono text-[#8A7561]">Hunar • {currentUser.name}</code>) and restricted to 800px max width via Cloudinary URL transformation.
                  </p>
                  {((customImageUrl && customImageUrl.includes("res.cloudinary.com")) || selectedImage.includes("res.cloudinary.com")) && (
                    <div className="mt-2 pt-2 border-t border-[#E8E2D7] text-[11px] text-[#635C53]">
                      <span className="font-medium text-[#1A1816]">Transformed Public Derivative:</span>
                      <p className="font-mono text-[10px] text-[#B4461F] break-all mt-0.5 bg-white p-2 border border-[#E8E2D7] rounded-xs select-all">
                        {getProtectedImageUrl(customImageUrl.trim() || selectedImage, { watermarkText: `Hunar • ${currentUser.name}` })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Bar */}
            <div className="pt-4 border-t border-[#E8E2D7] flex flex-col sm:flex-row items-center justify-between gap-3">
              <Link
                href="/dashboard/seller"
                className="text-xs font-medium text-[#635C53] hover:text-[#1A1816]"
              >
                Cancel and return
              </Link>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-terracotta w-full sm:w-auto px-6 py-2.5 rounded-sm text-xs font-medium transition-colors duration-150"
              >
                <span>{isSubmitting ? "Publishing..." : (isHindi ? "कैटलॉग में प्रकाशित करें" : "Publish to Studio Catalog")}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
  );
}
