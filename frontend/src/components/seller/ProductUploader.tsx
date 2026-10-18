"use client";

import React, { useState } from "react";
import { Product, ProductCategory, DeliveryFormat } from "@/types";
import { Upload, CheckCircle2 } from "lucide-react";

interface ProductUploaderProps {
  onPublish: (product: Partial<Product>) => void;
  isHindi?: boolean;
}

export function ProductUploader({ onPublish, isHindi = false }: ProductUploaderProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ProductCategory>("Terracotta & Pottery");
  const [price, setPrice] = useState(2500);
  const [description, setDescription] = useState("");
  const [deliveryFormat, setDeliveryFormat] = useState<DeliveryFormat>("Physical Artwork");
  const [leadTime, setLeadTime] = useState("Made to order: 7-10 days");
  const [material, setMaterial] = useState("Natural red river clay, hand-burnished");
  const [dimensions, setDimensions] = useState("12in x 6in x 6in");
  const [stock, setStock] = useState(5);

  const categories: ProductCategory[] = [
    "Terracotta & Pottery",
    "Madhubani Folk Art",
    "Handloom & Textiles",
    "Mural Design",
    "Bridal Mehndi",
    "Woodwork & Stone",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPublish({
      title,
      category,
      price: Number(price),
      description,
      deliveryFormat,
      leadTime,
      material,
      dimensions,
      stock: Number(stock),
      images: [
        "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80",
      ],
      status: "Live",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#1E2229] mb-1">
            {isHindi ? "कलाकृति का शीर्षक *" : "Artwork Title *"}
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Hand-burnished Khurja Terracotta Vase"
            className="w-full px-4 py-2.5 rounded-sm border border-[#D3CBBE] text-xs focus:outline-none focus:border-[#B4461F] bg-[#FDFCF9] text-[#1A1816]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#1E2229] mb-1">
              {isHindi ? "शिल्प श्रेणी *" : "Craft Category *"}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ProductCategory)}
              className="w-full px-3 py-2.5 rounded-sm border border-[#D3CBBE] text-xs bg-[#FDFCF9] text-[#1A1816] focus:outline-none focus:border-[#B4461F]"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1E2229] mb-1">
              {isHindi ? "मूल्य (₹) *" : "Price (₹ INR) *"}
            </label>
            <input
              type="number"
              required
              min={100}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-sm border border-[#D3CBBE] text-xs focus:outline-none focus:border-[#B4461F] bg-[#FDFCF9] text-[#1A1816]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#1E2229] mb-1">
            {isHindi ? "विवरण और निर्माण कथा *" : "Craft Description & Provenance *"}
          </label>
          <textarea
            rows={3}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe origin, materials, firing techniques, motifs..."
            className="w-full p-3 rounded-sm border border-[#D3CBBE] text-xs focus:outline-none focus:border-[#B4461F] bg-[#FDFCF9] text-[#1A1816]"
          />
        </div>
      </div>

      <button
        type="submit"
        className="px-6 py-2.5 rounded-sm bg-[#B4461F] text-white text-xs font-medium hover:bg-[#963716] transition-colors duration-150 flex items-center gap-2"
      >
        <Upload className="w-4 h-4" />
        <span>{isHindi ? "कैटलॉग में प्रकाशित करें" : "Publish to Catalog"}</span>
      </button>
    </form>
  );
}
