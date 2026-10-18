"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useHunar } from "@/context/HunarContext";
import { Creator } from "@/lib/data";
import {
  Users,
  Search,
  MapPin,
  CheckCircle2,
  MessageCircle,
  ExternalLink,
  Star,
  Award,
  Filter,
  ArrowRight,
  Heart,
  Bookmark,
  Share2,
  Clock,
  ShieldCheck,
  PhoneCall,
  X
} from "lucide-react";

export default function DiscoverArtisansPage() {
  const {
    creators,
    currentUser,
    language,
    savedCreatorIds,
    toggleSaveCreator,
    createInquiry,
    showToast
  } = useHunar();

  const isHindi = language === "hi";

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArtForm, setSelectedArtForm] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Commission Modal State
  const [selectedCreatorForCommission, setSelectedCreatorForCommission] = useState<Creator | null>(null);
  const [commissionRequirement, setCommissionRequirement] = useState("");
  const [commissionBudget, setCommissionBudget] = useState(15000);
  const [commissionTimeline, setCommissionTimeline] = useState("Within 3 weeks");

  const artForms = [
    "All",
    "Pottery",
    "Madhubani & Folk",
    "Murals",
    "Bridal Mehndi",
    "Performing Arts",
    "Sculpture"
  ];

  const cities = ["All", "Khurja / Delhi NCR", "Madhubani / Delhi NCR", "Delhi NCR", "Lucknow", "Jaipur", "Varanasi"];

  const filteredCreators = creators.filter((c) => {
    const matchForm = selectedArtForm === "All" || c.primaryArtForm.toLowerCase() === selectedArtForm.toLowerCase();
    const matchCity = selectedCity === "All" || c.city.toLowerCase().includes(selectedCity.toLowerCase());
    const matchVerified = !verifiedOnly || c.isVerified;
    const matchSearch =
      searchQuery.trim() === "" ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.primaryArtForm.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.bio.toLowerCase().includes(searchQuery.toLowerCase());

    return matchForm && matchCity && matchVerified && matchSearch;
  });

  const handleCommissionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCreatorForCommission) return;

    createInquiry({
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerEmail: currentUser.email,
      customerPhone: currentUser.phone || "+91 98711 44220",
      sellerId: selectedCreatorForCommission.id,
      sellerName: selectedCreatorForCommission.name,
      sellerAvatar: selectedCreatorForCommission.avatarUrl,
      type: "custom_commission",
      requirements: commissionRequirement || "Bespoke handcrafted art commission.",
      proposedBudget: Number(commissionBudget),
      timeline: commissionTimeline
    });

    setSelectedCreatorForCommission(null);
    setCommissionRequirement("");
    showToast(
      "Commission Inquiry Dispatched",
      `Your custom brief was routed to ${selectedCreatorForCommission.name}'s studio inbox.`,
      "success"
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-10 space-y-10">
      {/* Header Banner */}
      <div className="rounded-sm p-6 sm:p-8 border border-[#E8DEC8] bg-[#FAF7F2] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8A7561]">
                Master Directory
              </span>
              <span className="text-xs text-[#635C53] font-medium">
                • Verified Indian Grassroots Masters
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1E2229]">
              {isHindi ? "क्षेत्रीय पारंपरिक कारीगर व स्टूडियो खोजें" : "Discover Regional Artisans & Master Studios"}
            </h1>
            <p className="text-xs sm:text-sm text-[#635C53] max-w-2xl">
              {isHindi
                ? "मधुबनी चित्रकारों, खुर्जा के कुम्हारों, अवधी मेहंदी कलाकारों और म्यूरलिस्ट से सीधा संपर्क करें। शून्य बिचौलिया कटौती।"
                : "Connect directly with authentic folk painters, master ceramicists, chemical-free henna artists, and large-scale muralists across regional heritage clusters."}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/dashboard/customer/post-gig"
              className="px-4 py-2.5 rounded-sm bg-[#2D583B] text-white text-xs font-medium hover:bg-[#23452E] transition-colors duration-150 flex items-center gap-1.5"
            >
              <span>Post a Custom Brief</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-sm p-4 border border-[#E8DEC8] shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by artist name, craft (e.g. Madhubani, Terracotta), city..."
              className="w-full pl-9 pr-4 py-2.5 rounded-sm border border-[#D3CBBE] text-xs focus:outline-none focus:border-[#B4461F] bg-[#FDFCF9] text-[#1A1816]"
            />
          </div>

          {/* City Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full md:w-44 px-3 py-2.5 rounded-sm border border-[#D3CBBE] text-xs bg-[#FDFCF9] text-[#1A1816] focus:outline-none focus:border-[#B4461F]"
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city === "All" ? "All Cities" : city}
                </option>
              ))}
            </select>

            <button
              onClick={() => setVerifiedOnly(!verifiedOnly)}
              className={`px-3 py-2.5 rounded-sm border text-xs font-medium transition-colors duration-150 shrink-0 flex items-center gap-1.5 ${
                verifiedOnly
                  ? "bg-[#2D583B] text-white border-[#2D583B]"
                  : "bg-white text-[#635C53] border-[#D3CBBE] hover:bg-[#FAF7F2]"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verified Only</span>
            </button>
          </div>
        </div>

        {/* Medium / Art Form Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-semibold text-[#8A7561] uppercase tracking-wider shrink-0 mr-1">
            Medium:
          </span>
          {artForms.map((form) => (
            <button
              key={form}
              onClick={() => setSelectedArtForm(form)}
              className={`px-3 py-1.5 rounded-sm text-xs font-medium whitespace-nowrap transition-colors duration-150 ${
                selectedArtForm === form
                  ? "bg-[#2D583B] text-white"
                  : "bg-[#FAF6ED] text-[#635C53] border border-[#E8DEC8] hover:bg-[#F3EADB]"
              }`}
            >
              {form}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCreators.map((creator) => {
          const isSaved = savedCreatorIds.includes(creator.id);
          const whatsappUrl = `https://wa.me/${creator.whatsapp}?text=${encodeURIComponent(
            `Namaste ${creator.name}, I discovered your studio profile on Hunar and would like to inquire about commissioning custom artwork.`
          )}`;

          return (
            <div
              key={creator.id}
              className="group bg-white rounded-sm border border-[#E8DEC8] hover:border-[#B4461F] transition-all duration-150 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md flex flex-col overflow-hidden"
            >
              {/* Creator Card Top Header */}
              <div className="p-6 pb-5 border-b border-[#E8DEC8] flex items-start justify-between gap-4 bg-[#FAF7F2]">
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={creator.avatarUrl}
                    alt={creator.name}
                    className="w-16 h-16 rounded-full object-cover aspect-square ring-1 ring-[#E8DEC8] group-hover:ring-[#B4461F] transition-colors shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <h3 className="font-serif font-bold text-lg text-[#1E2229] truncate">
                        {creator.name}
                      </h3>
                      {creator.isVerified && (
                        <span title="Verified Master Artisan">
                          <CheckCircle2 className="w-4 h-4 text-[#2D583B] shrink-0" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#B4461F] font-semibold truncate">
                      {creator.primaryArtForm}
                    </p>
                    <div className="flex items-center gap-1 text-[11px] text-[#635C53] mt-0.5">
                      <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                      <span className="truncate">{creator.city}</span>
                    </div>
                  </div>
                </div>

                {/* Bookmark Toggle */}
                <button
                  onClick={() => toggleSaveCreator(creator.id)}
                  className={`p-2 rounded-sm border transition-colors duration-150 shrink-0 ${
                    isSaved
                      ? "bg-[#FAF0E6] border-[#F3CFBF] text-[#B4461F]"
                      : "bg-white border-[#E8DEC8] text-gray-400 hover:text-[#B4461F]"
                  }`}
                  title={isSaved ? "Remove from shortlist" : "Save artisan to shortlist"}
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
                </button>
              </div>

              {/* Bio & Craft Details */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <p className="text-xs text-[#635C53] line-clamp-3 leading-relaxed mb-1">
                  {creator.bio}
                </p>

                {/* Skills & Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {creator.skills.slice(0, 3).map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-medium px-2.5 py-0.5 rounded-xs bg-[#FAF8F5] text-[#1A1816] border border-[#E8DEC8]"
                    >
                      {skill}
                    </span>
                  ))}
                  {creator.experienceLevel && (
                    <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-xs bg-[#FAF5EC] text-[#B4461F] border border-[#E8DEC8]">
                      {creator.experienceLevel}
                    </span>
                  )}
                </div>

                {/* Pricing Guide */}
                <div className="p-4 rounded-sm bg-[#FAF8F5] border border-[#E8DEC8] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-[#635C53] uppercase font-semibold">
                      Base Rate / Pricing:
                    </span>
                    <p className="font-bold text-[#1E2229]">
                      ₹{creator.minPricing.toLocaleString("en-IN")}+
                      <span className="text-[11px] font-normal text-[#635C53] ml-1">
                        ({creator.unitPricingLabel})
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#635C53] uppercase font-semibold">Rating</span>
                    <div className="flex items-center gap-1 font-bold text-[#1E2229]">
                      <Star className="w-3.5 h-3.5 text-[#E5A93B] fill-current" />
                      <span>{creator.rating}</span>
                      <span className="text-gray-400 text-[10px]">({creator.reviewsCount})</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-sm bg-[#2D583B] text-white text-xs font-medium hover:bg-[#23452E] transition-colors duration-150"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  <button
                    onClick={() => setSelectedCreatorForCommission(creator)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-sm border border-[#B4461F] text-[#B4461F] text-xs font-medium hover:bg-[#FAF0EB] transition-colors duration-150"
                  >
                    <span>Commission</span>
                  </button>
                </div>

                <div className="text-center pt-1 border-t border-[#E8DEC8]">
                  <Link
                    href={`/u/${creator.username}`}
                    className="text-[11px] font-medium text-[#635C53] hover:text-[#B4461F] inline-flex items-center gap-1"
                  >
                    <span>View Full Hunar Lookbook Card</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCreators.length === 0 && (
        <div className="text-center py-16 bg-white rounded-sm border border-[#E8DEC8] p-8 space-y-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <Users className="w-10 h-10 text-gray-400 mx-auto" />
          <h3 className="font-serif font-bold text-lg text-[#1E2229]">No Master Artisans Matched</h3>
          <p className="text-xs text-[#635C53] max-w-md mx-auto">
            Try adjusting your search keywords, clearing medium filters, or selecting All Cities to explore verified creators.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedArtForm("All");
              setSelectedCity("All");
              setVerifiedOnly(false);
            }}
            className="px-4 py-2 rounded-sm bg-[#2D583B] text-white text-xs font-medium hover:bg-[#23452E] transition-colors duration-150"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Commission Work Modal */}
      {selectedCreatorForCommission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white rounded-sm max-w-lg w-full p-6 border border-[#E8DEC8] shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0E8D9]">
              <div className="flex items-center gap-3">
                <img
                  src={selectedCreatorForCommission.avatarUrl}
                  alt={selectedCreatorForCommission.name}
                  className="w-10 h-10 rounded-sm object-cover border border-[#E8DEC8]"
                />
                <div>
                  <h3 className="font-serif font-bold text-base text-[#1E2229]">
                    Commission {selectedCreatorForCommission.name}
                  </h3>
                  <p className="text-xs text-[#B4461F] font-medium">
                    {selectedCreatorForCommission.primaryArtForm} • {selectedCreatorForCommission.city}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCreatorForCommission(null)}
                className="p-1 rounded-sm text-gray-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCommissionSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1E2229] mb-1">
                  Commission Requirements / Design Brief *
                </label>
                <textarea
                  rows={3}
                  required
                  value={commissionRequirement}
                  onChange={(e) => setCommissionRequirement(e.target.value)}
                  placeholder="Specify dimensions, medium, custom debossing/motifs, or event details..."
                  className="w-full p-3 rounded-sm border border-[#D3CBBE] text-xs focus:outline-none focus:border-[#B4461F] bg-[#FDFCF9] text-[#1A1816]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1E2229] mb-1">
                    Proposed Budget (INR ₹)
                  </label>
                  <input
                    type="number"
                    min={500}
                    step={500}
                    value={commissionBudget}
                    onChange={(e) => setCommissionBudget(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-sm border border-[#D3CBBE] text-xs focus:outline-none focus:border-[#B4461F] bg-[#FDFCF9] text-[#1A1816]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E2229] mb-1">
                    Expected Timeline
                  </label>
                  <select
                    value={commissionTimeline}
                    onChange={(e) => setCommissionTimeline(e.target.value)}
                    className="w-full px-3 py-2 rounded-sm border border-[#D3CBBE] text-xs bg-[#FDFCF9] text-[#1A1816] focus:outline-none focus:border-[#B4461F]"
                  >
                    <option value="Urgent (Within 7 days)">Urgent (Within 7 days)</option>
                    <option value="Within 14 days">Within 14 days</option>
                    <option value="Within 3 weeks">Within 3 weeks</option>
                    <option value="Flexible (1-2 months)">Flexible (1-2 months)</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-sm bg-[#FAF6ED] border border-[#E8DEC8] text-xs text-[#635C53] flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#2D583B] shrink-0 mt-0.5" />
                <span>
                  Hunar protects patrons and artisans with zero middleman deductions. This brief appears directly in {selectedCreatorForCommission.name}&apos;s studio inbox.
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedCreatorForCommission(null)}
                  className="px-4 py-2 rounded-sm border border-[#DACABA] text-xs font-medium text-[#1E2229] hover:bg-[#FAF6ED] transition-colors duration-150"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-sm bg-[#2D583B] text-white text-xs font-medium hover:bg-[#23452E] transition-colors duration-150"
                >
                  Submit Commission Brief
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
