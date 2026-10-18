"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useHunar } from "@/context/HunarContext";
import { useTinyFishPricingBenchmark } from "@tinyfish/core";
import {
  MapPin,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  FilePlus,
  Palette,
  HeartHandshake,
  DollarSign,
  Sparkles
} from "lucide-react";

export default function PostRequirementPage() {
  const router = useRouter();
  const { currentUser, language, postOpportunity, createInquiry, showToast } = useHunar();
  const isHindi = language === "hi";

  const [projectType, setProjectType] = useState<
    "Murals" | "Commission" | "Event Booking" | "Exhibition" | "Grant"
  >("Murals");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budgetMin, setBudgetMin] = useState(15000);
  const [budgetMax, setBudgetMax] = useState(35000);
  const [city, setCity] = useState("Delhi NCR");
  const [deadline, setDeadline] = useState("Within 30 days");
  const [deliveryFormat, setDeliveryFormat] = useState<"On-site Commission" | "Physical Artwork">("On-site Commission");
  const [requirementsList, setRequirementsList] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // TinyFish zero-latency dynamic pricing benchmark calculated client-side from indexed listings
  const pricingBenchmark = useTinyFishPricingBenchmark(projectType, city);

  const projectTypes = [
    {
      id: "Murals" as const,
      label: "Cafe / Wall Mural",
      description: "On-site facade or interior narrative paintings (acrylic / mineral)",
      defaultFormat: "On-site Commission" as const
    },
    {
      id: "Commission" as const,
      label: "Custom Canvas / Artwork",
      description: "Madhubani scrolls, commissioned folk art, or gallery pieces",
      defaultFormat: "Physical Artwork" as const
    },
    {
      id: "Event Booking" as const,
      label: "Bridal Mehndi / Live Art",
      description: "Traditional chemical-free henna packages or live artisan performance",
      defaultFormat: "On-site Commission" as const
    },
    {
      id: "Commission" as const,
      label: "Bulk Studio Tableware / Gifts",
      description: "Custom wheel-thrown ceramics, kulhad sets, or corporate pottery",
      defaultFormat: "Physical Artwork" as const
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Post to Opportunities Radar so grassroots artisans see it on their Seller radar!
      postOpportunity({
        title: title || `${projectType} Custom Request in ${city}`,
        titleHindi: title,
        description: description,
        category: projectType === "Murals" ? "Mural Design" : "Folk & Studio Commission",
        type: projectType,
        typeHindi: projectType,
        location: city,
        budgetMin: Number(budgetMin),
        budgetMax: Number(budgetMax),
        deadline: deadline,
        postedBy: currentUser.name,
        postedByOrg: "Private Patron Commission",
        postedByAvatar: currentUser.avatarUrl,
        postedByVerified: true,
        requirements: requirementsList
          ? requirementsList.split("\n").filter((r) => r.trim().length > 0)
          : ["Authentic handmade craftsmanship", "Direct artisan coordination over WhatsApp"]
      });

      // 2. Also register in inquiries so customer tracks it on /dashboard/customer/orders!
      createInquiry({
        customerId: currentUser.id,
        customerName: currentUser.name,
        customerEmail: currentUser.email,
        customerPhone: currentUser.phone || "+91 98711 44220",
        sellerId: "guild-pool",
        sellerName: "Artisans Guild Pool",
        type: "custom_commission",
        requirements: `${title ? `${title}: ` : ""}${description}`,
        proposedBudget: Number(budgetMax),
        timeline: deadline,
        status: "Under Review"
      });

      showToast(
        "Custom Requirement Posted!",
        "Matched artisans can now review your brief and send direct quotes.",
        "success"
      );

      // Navigate to orders tracker
      router.push("/dashboard/customer/orders");
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-12 py-10 space-y-10">
      {/* Page Header */}
      <div className="rounded-sm p-6 sm:p-8 border border-[#E8DEC8] bg-[#FAF7F2] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8A7561]">
              Patron Curation Desk
            </span>
            <span className="text-xs text-[#635C53] font-medium">• Direct Creator Commissioning</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1E2229]">
            {isHindi ? "कारीगरों के लिए कस्टम कार्य पोस्ट करें" : "Post a Custom Art / Craft Requirement"}
          </h1>
          <p className="text-xs sm:text-sm text-[#635C53] max-w-2xl">
            {isHindi
              ? "कैफे की दीवार, शादी की प्राकृतिक मेहंदी, व्यक्तिगत कैनवास या थोक मिट्टी के बर्तनों के लिए अपनी आवश्यकताएं साझा करें।"
              : "Commission authentic handcrafted creations directly from regional Indian masters. Your brief appears on the artisan Open Gigs Radar without agency markups."}
          </p>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-sm border border-[#E8DEC8] p-6 sm:p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-8">
        {/* Step 1: Project Type Selection */}
        <div>
          <label className="block text-xs font-semibold text-[#1E2229] uppercase tracking-wider mb-2">
            1. Select Project Type / Discipline *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {projectTypes.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setProjectType(item.id);
                  setDeliveryFormat(item.defaultFormat);
                }}
                className={`p-3.5 rounded-sm border text-left transition-colors duration-150 ${
                  projectType === item.id
                    ? "bg-[#EEF4F0] border-[#2D583B] text-[#1D3E29]"
                    : "bg-[#FDFBF7] border-[#D3CBBE] hover:border-gray-400 text-[#1A1816]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs">{item.label}</span>
                  {projectType === item.id && (
                    <CheckCircle2 className="w-4 h-4 text-[#2D583B]" />
                  )}
                </div>
                <p className="text-[11px] text-[#635C53] leading-snug">{item.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Title and Story Brief */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1E2229] mb-1">
              Project Title / Artwork Summary *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 14ft Specialty Coffee Wall Mural with Botanical Flora, or Batch of 50 Studio Terracotta Chai Mugs"
              className="w-full px-4 py-2.5 rounded-sm border border-[#D3CBBE] text-xs focus:outline-none focus:border-[#B4461F] bg-[#FDFCF9] text-[#1A1816]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1E2229] mb-1">
              Design Brief & Craft Specifications *
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your vision, preferred colors (e.g. raw terracotta, indigo, natural turmeric dyes), dimensions, surface preparation, or custom monogram initials..."
              className="w-full p-4 rounded-sm border border-[#D3CBBE] text-xs focus:outline-none focus:border-[#B4461F] bg-[#FDFCF9] text-[#1A1816]"
            />
          </div>
        </div>

        {/* Step 3: Budget & Timeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-[#1E2229] mb-1">
              Target Budget Range (₹) *
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={500}
                step={500}
                value={budgetMin}
                onChange={(e) => setBudgetMin(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-sm border border-[#D3CBBE] text-xs focus:outline-none focus:border-[#B4461F] bg-[#FDFCF9] text-[#1A1816]"
                placeholder="Min ₹"
              />
              <span className="text-gray-400 text-xs font-semibold">to</span>
              <input
                type="number"
                min={1000}
                step={500}
                value={budgetMax}
                onChange={(e) => setBudgetMax(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-sm border border-[#D3CBBE] text-xs focus:outline-none focus:border-[#B4461F] bg-[#FDFCF9] text-[#1A1816]"
                placeholder="Max ₹"
              />
            </div>
            <p className="text-[10px] text-[#635C53] mt-1">100% of this budget goes directly to the creator.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1E2229] mb-1">
              City / Location *
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Delhi NCR, Khurja, Jaipur..."
                className="w-full pl-9 pr-3 py-2 rounded-sm border border-[#D3CBBE] text-xs focus:outline-none focus:border-[#B4461F] bg-[#FDFCF9] text-[#1A1816]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1E2229] mb-1">
              Expected Deadline *
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                placeholder="e.g. By mid-November 2026"
                className="w-full pl-9 pr-3 py-2 rounded-sm border border-[#D3CBBE] text-xs focus:outline-none focus:border-[#B4461F] bg-[#FDFCF9] text-[#1A1816]"
              />
            </div>
          </div>

          {/* TinyFish Client-Side Pricing Benchmark Hint */}
          <div className="sm:col-span-2 lg:col-span-3 bg-[#FAF7F2] border border-[#E6E1D8] rounded-sm p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#B4461F]/10 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-[#B4461F]" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-serif font-semibold text-[#1E2229]">
                    Artisan Pricing Benchmark: {pricingBenchmark.category}
                    {pricingBenchmark.city ? ` in ${pricingBenchmark.city}` : ""}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-xs bg-[#2D583B]/10 text-[#2D583B]">
                    {pricingBenchmark.marketTier}
                  </span>
                  <span className="text-[10px] text-[#635C53]">
                    ({pricingBenchmark.sampleCount} listings indexed)
                  </span>
                </div>
                <p className="text-[11px] text-[#635C53] mt-0.5">
                  25th–75th Percentile:{" "}
                  <strong className="text-[#1E2229]">
                    ₹{pricingBenchmark.p25.toLocaleString("en-IN")} – ₹{pricingBenchmark.p75.toLocaleString("en-IN")}
                  </strong>{" "}
                  (Median ₹{pricingBenchmark.p50.toLocaleString("en-IN")}) • {pricingBenchmark.notes}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setBudgetMin(pricingBenchmark.suggestedMin);
                setBudgetMax(pricingBenchmark.suggestedMax);
              }}
              className="shrink-0 px-3 py-1.5 text-[11px] font-semibold text-[#B4461F] border border-[#B4461F]/30 hover:bg-[#B4461F]/5 rounded-sm transition-colors cursor-pointer"
            >
              Apply Range (₹{pricingBenchmark.suggestedMin.toLocaleString("en-IN")} - ₹{pricingBenchmark.suggestedMax.toLocaleString("en-IN")})
            </button>
          </div>
        </div>

        {/* Step 4: Specific Artisan Requirements / Checklist */}
        <div>
          <label className="block text-xs font-semibold text-[#1E2229] mb-1">
            Artisan Experience / Qualification Points (One per line)
          </label>
          <textarea
            rows={2}
            value={requirementsList}
            onChange={(e) => setRequirementsList(e.target.value)}
            placeholder="e.g.&#10;Must use organic chemical-free mineral pigments&#10;Prior commercial cafe facade portfolio required"
            className="w-full p-3 rounded-sm border border-[#D3CBBE] text-xs focus:outline-none focus:border-[#B4461F] bg-[#FDFCF9] text-[#1A1816]"
          />
        </div>

        {/* Protection Guarantee Banner */}
        <div className="p-4 rounded-sm bg-[#FAF8F5] border border-[#E8DEC8] flex items-start gap-3 text-xs text-[#635C53]">
          <ShieldCheck className="w-5 h-5 text-[#2D583B] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold text-[#1E2229]">Hunar Direct Patron Equity</p>
            <p>
              Your requirement will be visible immediately to verified artisans in your region. Interested creators can send quotes directly to your <strong>My Orders & Custom Bids</strong> dashboard and start WhatsApp discussions.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8DEC8]">
          <Link
            href="/dashboard/customer"
            className="px-5 py-2.5 rounded-sm border border-[#D3CBBE] text-xs font-medium text-[#635C53] hover:bg-[#FAF7F2] transition-colors duration-150"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-sm bg-[#2D583B] text-white text-xs font-medium hover:bg-[#23452E] transition-colors duration-150 flex items-center gap-2 disabled:opacity-50"
          >
            <span>{isSubmitting ? "Dispatching..." : "Post Custom Requirement (₹)"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
