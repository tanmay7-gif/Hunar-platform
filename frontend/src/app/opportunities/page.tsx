"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useHunar } from "@/context/HunarContext";
import {
  Briefcase,
  MapPin,
  Clock,
  Sparkles,
  Filter,
  Search,
  CheckCircle,
  PlusCircle,
  X,
  ArrowRight,
  ShieldCheck,
  Send,
  Building,
  Tag,
  DollarSign
} from "lucide-react";
import { Opportunity } from "@/lib/data";
import { useTinyFishOpportunityRadar } from "@tinyfish/core";

export default function OpportunitiesPage() {
  const { language, opportunities, currentPersona, applyToOpportunity, postOpportunity } = useHunar();
  const isHindi = language === "hi";

  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [locationFilter, setLocationFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Apply Modal state
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [bidRate, setBidRate] = useState<number>(25000);
  const [pitchText, setPitchText] = useState<string>("");

  // Post Opportunity Modal state
  const [postModalOpen, setPostModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Murals");
  const [newType, setNewType] = useState<"Commission" | "Murals" | "Event Booking" | "Exhibition" | "Grant">("Murals");
  const [newLocation, setNewLocation] = useState("Delhi NCR");
  const [newBudgetMin, setNewBudgetMin] = useState(20000);
  const [newBudgetMax, setNewBudgetMax] = useState(35000);
  const [newDescription, setNewDescription] = useState("");

  const categories = [
    { id: "All", label: isHindi ? "सभी विधाएं" : "All Categories" },
    { id: "Murals", label: isHindi ? "म्यूरल्स (Murals)" : "Murals" },
    { id: "Madhubani & Folk", label: isHindi ? "मधुबनी व लोक कला" : "Madhubani & Folk" },
    { id: "Pottery", label: isHindi ? "पॉटरी एवं टेराकोटा" : "Studio Pottery" },
    { id: "Bridal Mehndi", label: isHindi ? "ब्राइडल मेहंदी" : "Bridal Mehndi" }
  ];

  const types = ["All", "Murals", "Commission", "Event Booking", "Grant", "Exhibition"];
  const locations = ["All", "Delhi NCR", "Jaipur", "Lucknow", "Remote / Pan-India"];

  // TinyFish Opportunity Radar Match Engine
  const {
    opportunities: filteredOpportunities,
    stats: radarStats,
    executionTimeMs
  } = useTinyFishOpportunityRadar(
    currentPersona,
    opportunities,
    {
      category: categoryFilter,
      type: typeFilter,
      location: locationFilter,
      searchQuery,
      sortByScore: true
    }
  );

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOpp) return;

    applyToOpportunity(selectedOpp.id, pitchText, Number(bidRate));
    setSelectedOpp(null);
    setPitchText("");
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    postOpportunity({
      title: newTitle,
      category: newCategory,
      type: newType,
      location: newLocation,
      budgetMin: Number(newBudgetMin),
      budgetMax: Number(newBudgetMax),
      description: newDescription,
      deadline: "14 days left",
      requirements: ["Experienced portfolio in relevant craft", "Ability to deliver on agreed milestones"],
      tags: [newCategory, newLocation]
    });

    setPostModalOpen(false);
    setNewTitle("");
    setNewDescription("");
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header & Client "Post Opportunity" Button */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#E8E2D7]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#8A7561] mb-2">
              {isHindi ? "अवसर एवं बोलियां" : "Opportunity Radar & Matching Board"}
            </p>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1E2229]">
              {isHindi ? "अवसर एवं बोलियां" : "Opportunities & Gigs"}
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setPostModalOpen(true)}
              className="px-4 py-2.5 rounded-sm bg-[#1E2229] hover:bg-[#111418] text-white text-xs font-medium shadow-xs transition-colors duration-150 flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4 text-[#E5A93B]" />
              <span>{isHindi ? "नया अवसर पोस्ट करें (Client)" : "Post an Opportunity"}</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="my-6 p-4 rounded-sm bg-white border border-[#E8E2D7] shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={isHindi ? "अवसर, कैफे या टैग खोजें..." : "Search gigs, cafe or tags..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-sm bg-[#FDFCF9] border border-[#D3CBBE] text-xs text-[#1A1816] focus:outline-none focus:border-[#1E2229]"
            />
          </div>

          {/* Dropdown filters */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {/* Category */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-sm bg-[#FDFCF9] border border-[#D3CBBE] text-xs font-medium text-[#1A1816] focus:outline-none focus:border-[#1E2229]"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>

            {/* Type */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 rounded-sm bg-[#FDFCF9] border border-[#D3CBBE] text-xs font-medium text-[#1A1816] focus:outline-none focus:border-[#1E2229]"
            >
              {types.map((t) => (
                <option key={t} value={t}>
                  {t === "All" ? (isHindi ? "सभी प्रकार" : "All Types") : t}
                </option>
              ))}
            </select>

            {/* Location */}
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="px-3 py-2 rounded-sm bg-[#FDFCF9] border border-[#D3CBBE] text-xs font-medium text-[#1A1816] focus:outline-none focus:border-[#1E2229]"
            >
              {locations.map((l) => (
                <option key={l} value={l}>
                  {l === "All" ? (isHindi ? "सभी स्थान" : "All Locations") : l}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* TinyFish Edge Radar Telemetry Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 -mt-3 mb-6 px-1 text-xs text-[#635C53]">
          <div className="flex items-center gap-2">
            <span className="font-medium text-[#1E2229]">
              {filteredOpportunities.length} {isHindi ? "अवसर रडार पर उपलब्ध" : "opportunities live on matching board"}
            </span>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-xs bg-[#FAF7F2] border border-[#E8DEC8] text-[10px] text-[#8A7561]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2D583B]"></span>
              <span className="font-mono text-[#B4461F] font-semibold">{executionTimeMs}ms</span>
              <span>{isHindi ? "• टाइनीफिश एज मैचिंग" : "• TinyFish zero-latency match scored"}</span>
            </div>
          </div>
        </div>

        {/* Opportunities List */}
        <div className="space-y-4">
          {filteredOpportunities.map((opp) => {
            const isMatchedForUser = opp.match.overallScore >= 70;

            return (
              <div
                key={opp.id}
                className={`craft-card rounded-2xl p-6 bg-white border transition-all ${
                  isMatchedForUser
                    ? "border-[#C85A32]/60 ring-2 ring-[#C85A32]/10 bg-[#FFFCF8]"
                    : "border-[#E8DEC8]"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                  <div className="flex-1 space-y-3">
                    {/* Header Badges with TinyFish Match */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs ${
                        opp.match.isTopPick 
                          ? "bg-[#2D583B] text-white" 
                          : opp.match.isRecommended 
                          ? "bg-[#C85A32] text-white" 
                          : "bg-[#FAF7F2] text-[#8A7561] border border-[#E8DEC8]"
                      }`}>
                        <Sparkles className="w-3 h-3 text-[#E5A93B]" />
                        <span>{opp.match.overallScore}% {isHindi ? "शिल्प मिलान" : "Craft Match"}</span>
                      </span>

                      <span className="px-2.5 py-0.5 rounded-full bg-[#FAF0E6] text-[#A33F1C] border border-[#F3CFBF] text-[11px] font-bold">
                        {isHindi ? opp.typeHindi : opp.type}
                      </span>

                      <span className="px-2.5 py-0.5 rounded-full bg-[#FAF6ED] text-[#535A66] border border-[#E8DEC8] text-[11px] font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#C85A32]" />
                        <span>{opp.location}</span>
                      </span>

                      <span className="px-2 py-0.5 rounded text-[11px] font-medium text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{opp.deadline}</span>
                      </span>
                    </div>

                    {/* Title & Organization */}
                    <div>
                      <h3 className="text-xl font-serif font-bold text-[#1E2229] hover:text-[#C85A32] transition-colors">
                        {isHindi ? opp.titleHindi : opp.title}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium mt-0.5 flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-gray-400" />
                        <span>{opp.postedByOrg}</span>
                        {opp.postedByVerified && (
                          <span className="text-[#2D583B] text-[11px] font-bold flex items-center gap-0.5">
                            <CheckCircle className="w-3 h-3" />
                            Verified Client
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-[#535A66] leading-relaxed">
                      {opp.description}
                    </p>

                    {/* Requirements checklist */}
                    <div className="pt-1">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                        {isHindi ? "मुख्य आवश्यकताएं:" : "Key Requirements:"}
                      </p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {opp.requirements.map((req, idx) => (
                          <li
                            key={idx}
                            className="text-xs text-gray-600 flex items-start gap-1.5"
                          >
                            <span className="text-[#C85A32] font-bold mt-0.5">•</span>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {opp.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded text-[10px] bg-[#FAF6ED] text-[#535A66] border border-[#E8DEC8]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right side: Budget & Quick Apply CTA */}
                  <div className="lg:text-right shrink-0 lg:w-56 pt-4 lg:pt-0 border-t lg:border-t-0 border-[#E8DEC8] flex flex-row lg:flex-col justify-between items-center lg:items-end gap-3">
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                        {isHindi ? "बजट दायरा" : "Budget Range"}
                      </p>
                      <p className="text-lg sm:text-xl font-serif font-bold text-[#C85A32]">
                        ₹{opp.budgetMin.toLocaleString("en-IN")} - ₹
                        {opp.budgetMax.toLocaleString("en-IN")}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        {opp.applicationsCount} {isHindi ? "बोलियां प्रेषित" : "Bids Submitted"}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedOpp(opp);
                        setBidRate(opp.budgetMin);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-[#C85A32] text-white text-xs font-bold shadow-md hover:bg-[#B94F28] transition-all flex items-center gap-1.5"
                    >
                      <span>{isHindi ? "बोली लगाएं / आवेदन करें" : "Express Interest / Bid"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* APPLY / EXPRESS INTEREST MODAL                            */}
        {/* ========================================================= */}
        {selectedOpp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 animate-in fade-in duration-150">
            <div className="bg-white rounded-sm max-w-lg w-full p-6 sm:p-8 border border-[#E8E2D7] shadow-2xl relative">
              <button
                onClick={() => setSelectedOpp(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-[#1E2229]"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-4 pb-3 border-b border-[#F0E8D9]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C85A32]">
                  {isHindi ? "प्रस्ताव एवं बोली जमा करें" : "Submit Your Proposal & Rate"}
                </span>
                <h3 className="font-serif text-lg font-bold text-[#1E2229] mt-0.5">
                  {selectedOpp.title}
                </h3>
                <p className="text-xs text-gray-500">
                  {selectedOpp.postedByOrg} • Budget ₹{selectedOpp.budgetMin.toLocaleString("en-IN")} - ₹{selectedOpp.budgetMax.toLocaleString("en-IN")}
                </p>
              </div>

              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#1E2229] mb-1">
                    {isHindi ? "आपकी प्रस्तावित दर (₹):" : "Your Proposed Bid / Quotation (₹):"}
                  </label>
                  <input
                    type="number"
                    required
                    step={500}
                    value={bidRate}
                    onChange={(e) => setBidRate(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FFFDF9] border border-[#DACABA] text-sm font-bold text-[#1E2229] focus:outline-none focus:ring-2 focus:ring-[#C85A32]"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">
                    {isHindi ? "100% राशि सीधे आपके बैंक खाते में आएगी। शून्य बिचौलिया शुल्क।" : "0% platform commission deducted. Direct client settlement."}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E2229] mb-1">
                    {isHindi ? "संक्षिप्त पिच व तकनीक विवरण:" : "Short Pitch & Technique Statement:"}
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder={
                      isHindi
                        ? "जैसे: मैं पारंपरिक प्राकृतिक रंगों में काम करता हूँ और 3 दिनों में यह दीवार पूरी कर सकता हूँ। मेरे हालिया नमूने हुनर कार्ड पर उपलब्ध हैं..."
                        : "e.g. I have painted 4 cafe walls in Hauz Khas using weather-proof acrylics. Ready to start immediately with full scaffolding..."
                    }
                    value={pitchText}
                    onChange={(e) => setPitchText(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FFFDF9] border border-[#DACABA] text-xs text-[#1E2229] focus:outline-none focus:ring-2 focus:ring-[#C85A32]"
                  />
                </div>

                {/* Profile Attachment Notice */}
                <div className="p-3 rounded-xl bg-[#FAF6ED] border border-[#E8DEC8] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#C85A32]" />
                    <span className="font-semibold text-gray-700">
                      {isHindi ? "हुनर कार्ड संलग्न होगा:" : "Your Hunar Card Attached:"}
                    </span>
                  </div>
                  <span className="font-bold text-[#C85A32]">{currentPersona.name}</span>
                </div>

                <div className="pt-3 border-t border-[#F0E8D9] flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedOpp(null)}
                    className="px-4 py-2 rounded-xl border border-[#DACABA] text-xs font-bold text-gray-600 hover:bg-[#FAF6ED]"
                  >
                    {isHindi ? "रद्द करें" : "Cancel"}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#C85A32] text-white text-xs font-bold shadow-md hover:bg-[#B94F28] transition-all flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isHindi ? "बोली भेजें" : "Submit Proposal"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* POST OPPORTUNITY MODAL (CLIENT ACTION)                    */}
        {/* ========================================================= */}
        {postModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 animate-in fade-in duration-150">
            <div className="bg-white rounded-sm max-w-lg w-full p-6 sm:p-8 border border-[#E8E2D7] shadow-2xl relative">
              <button
                onClick={() => setPostModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-[#1E2229]"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-4 pb-3 border-b border-[#F0E8D9]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2D583B]">
                  {isHindi ? "नया अवसर प्रकाशित करें" : "Post a New Opportunity for Local Artisans"}
                </span>
                <h3 className="font-serif text-xl font-bold text-[#1E2229] mt-0.5">
                  {isHindi ? "कारीगरों को सीधे काम दें" : "Direct Commission / Mural / Event Gig"}
                </h3>
              </div>

              <form onSubmit={handlePostSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#1E2229] mb-1">
                    {isHindi ? "अवसर का शीर्षक:" : "Opportunity Title:"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={
                      isHindi
                        ? "जैसे: नए आउटलेट हेतु 18x10 फीट कैफे भित्ति चित्र"
                        : "e.g. 18x10 ft Brick Wall Mural for Heritage Cafe"
                    }
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FFFDF9] border border-[#DACABA] text-xs text-[#1E2229] focus:outline-none focus:ring-2 focus:ring-[#C85A32]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#1E2229] mb-1">
                      {isHindi ? "कला विधा:" : "Craft Category:"}
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#FFFDF9] border border-[#DACABA] text-xs font-semibold"
                    >
                      <option value="Murals">Murals</option>
                      <option value="Madhubani & Folk">Madhubani & Folk</option>
                      <option value="Pottery">Pottery</option>
                      <option value="Bridal Mehndi">Bridal Mehndi</option>
                      <option value="Visual Arts">Visual Arts</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1E2229] mb-1">
                      {isHindi ? "स्थान (Location):" : "Location:"}
                    </label>
                    <input
                      type="text"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      placeholder="e.g. Delhi NCR / Jaipur / Remote"
                      className="w-full px-3 py-2 rounded-xl bg-[#FFFDF9] border border-[#DACABA] text-xs text-[#1E2229]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#1E2229] mb-1">
                      {isHindi ? "न्यूनतम बजट (₹):" : "Min Budget (₹):"}
                    </label>
                    <input
                      type="number"
                      step={1000}
                      value={newBudgetMin}
                      onChange={(e) => setNewBudgetMin(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-[#FFFDF9] border border-[#DACABA] text-xs text-[#1E2229] font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1E2229] mb-1">
                      {isHindi ? "अधिकतम बजट (₹):" : "Max Budget (₹):"}
                    </label>
                    <input
                      type="number"
                      step={1000}
                      value={newBudgetMax}
                      onChange={(e) => setNewBudgetMax(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-[#FFFDF9] border border-[#DACABA] text-xs text-[#1E2229] font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E2229] mb-1">
                    {isHindi ? "कार्य का विस्तृत विवरण:" : "Detailed Description:"}
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder={
                      isHindi
                        ? "दीवार का साइज़, विषय, समय सीमा और सामग्री के बारे में विवरण लिखें..."
                        : "Describe the dimensions, theme, dates, and materials provided..."
                    }
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FFFDF9] border border-[#DACABA] text-xs text-[#1E2229]"
                  />
                </div>

                <div className="pt-3 border-t border-[#F0E8D9] flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setPostModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-[#DACABA] text-xs font-bold text-gray-600 hover:bg-[#FAF6ED]"
                  >
                    {isHindi ? "रद्द करें" : "Cancel"}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#2D583B] text-white text-xs font-bold shadow-md hover:bg-[#23452E] transition-all"
                  >
                    {isHindi ? "अवसर प्रकाशित करें" : "Publish Opportunity"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
