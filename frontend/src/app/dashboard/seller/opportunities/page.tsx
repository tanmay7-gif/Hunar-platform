"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useHunar } from "@/context/HunarContext";
import { Opportunity } from "@/lib/data";
import { useTinyFishOpportunityRadar } from "@tinyfish/core";
import { MarketIntelligenceBar } from "@/components/tinyfish/MarketIntelligenceBar";
import { AutonomousOpportunityAgentModal } from "@/components/tinyfish/AutonomousOpportunityAgentModal";
import { CloudBrowserViewerModal } from "@/components/tinyfish/CloudBrowserViewerModal";
import {
  Target,
  Briefcase,
  MapPin,
  Calendar,
  CheckCircle2,
  DollarSign,
  Sparkles,
  Search,
  Filter,
  Send,
  Building2,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Check,
  Bot,
  Monitor,
  Globe
} from "lucide-react";

export default function SellerOpportunitiesPage() {
  const {
    opportunities,
    currentUser,
    language,
    applyToOpportunity,
    applications,
    showToast
  } = useHunar();

  const isHindi = language === "hi";

  // TinyFish Modal States
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [isCloudBrowserOpen, setIsCloudBrowserOpen] = useState(false);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [onlyTopMatches, setOnlyTopMatches] = useState(false);

  // Apply Modal
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [pitch, setPitch] = useState("");
  const [proposedRate, setProposedRate] = useState<number>(0);

  const categories = ["All", "Mural Design", "Folk & Studio Commission", "Wedding & Henna", "Corporate Bulk"];
  const types = ["All", "Murals", "Commission", "Event Booking", "Exhibition", "Grant"];

  // TinyFish Local Opportunity Radar Match Engine - instant, client-side scoring
  const {
    opportunities: filteredOpportunities,
    stats: radarStats,
    executionTimeMs
  } = useTinyFishOpportunityRadar(
    currentUser,
    opportunities,
    {
      category: selectedCategory,
      type: selectedType,
      searchQuery,
      minScore: onlyTopMatches ? 75 : 0,
      sortByScore: true
    }
  );

  const handleOpenApply = (opp: Opportunity) => {
    setSelectedOpportunity(opp);
    setProposedRate(opp.budgetMax);
    setPitch(
      `Namaste, I am ${currentUser.name} (${currentUser.tagline || "Master Artisan"}). I specialize in this craft with 12+ years of verified studio experience.`
    );
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOpportunity) return;

    applyToOpportunity(selectedOpportunity.id, pitch, proposedRate);
    setSelectedOpportunity(null);
    setPitch("");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-10 space-y-10">
      {/* Header Banner */}
      <div className="rounded-sm p-6 sm:p-8 border border-[#2C323D] bg-[#1E2229] text-[#FAF7F2] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-xs text-[10px] font-semibold uppercase tracking-wider bg-sky-600 text-white">
                Live Gigs Radar
              </span>
              <span className="text-xs text-sky-400 font-mono">Grassroots Boli & Direct Bids</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#FAF7F2]">
              {isHindi ? "अवसर एवं गिग रडार" : "Open Gigs Radar"}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsAgentModalOpen(true)}
              className="px-3.5 py-2.5 rounded-sm bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
              title="Deploy autonomous AI web agent to scout schemes on handicrafts.nic.in, Dastkar, and TRIFED"
            >
              <Bot className="w-4 h-4 text-sky-200" />
              <span>Deploy Scout Agent (Web Agent)</span>
            </button>
            <button
              onClick={() => setIsCloudBrowserOpen(true)}
              className="px-3.5 py-2.5 rounded-sm bg-[#2A313D] hover:bg-[#343C4B] text-[#FAF7F2] text-xs font-medium flex items-center gap-2 border border-[#3E4756] transition-colors cursor-pointer"
              title="Remote Playwright/CDP cloud browser inspection for official craft portals"
            >
              <Monitor className="w-3.5 h-3.5 text-[#00E676]" />
              <span>Cloud Browser (CDP Sandbox)</span>
            </button>
            <div className="px-3 py-2 rounded-sm bg-[#121417] border border-[#00E676]/40 text-xs">
              <span className="text-[#86A890] block text-[10px] uppercase font-semibold">Top Studio Fits:</span>
              <span className="text-sm font-bold text-[#00E676]">{radarStats.topPicks} Priority Matches</span>
            </div>
          </div>
        </div>
      </div>

      {/* TinyFish Search API: Live Craft Market Intelligence & Raw Material Index */}
      <MarketIntelligenceBar />

      {/* Filter and Search Bar with TinyFish Telemetry */}
      <div className="bg-white rounded-sm p-4 border border-[#E8E2D7] shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A7561]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search gigs by title, location (Delhi, Jaipur...), client..."
              className="w-full pl-9 pr-4 py-2 rounded-sm border border-[#D3CBBE] text-xs bg-[#FDFCF9] text-[#1A1816] focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Top Matches Filter Toggle */}
            <button
              onClick={() => setOnlyTopMatches(!onlyTopMatches)}
              className={`px-3 py-2 rounded-sm text-xs font-semibold transition-colors duration-150 flex items-center gap-1.5 border ${
                onlyTopMatches
                  ? "bg-[#00E676]/15 text-[#00C853] dark:text-[#00E676] border-[#00E676]/40 font-semibold"
                  : "bg-[#FAF7F2] text-[#635C53] border-[#E8DEC8] hover:border-sky-500 hover:text-sky-600"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E5A93B]" />
              <span>{isHindi ? "केवल 75%+ उपयुक्त मैच" : "Top Studio Fits (75%+)"}</span>
              <span className="text-[10px] px-1 py-0.2 rounded-xs bg-black/10">
                {radarStats.topPicks + radarStats.recommended}
              </span>
            </button>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 rounded-sm border border-[#D3CBBE] text-xs bg-[#FDFCF9] text-[#1A1816] focus:outline-none focus:border-sky-500"
            >
              {types.map((type) => (
                <option key={type} value={type}>
                  {type === "All" ? "All Gigs Types" : type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* TinyFish Radar Benchmark Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#E8E2D7]/60 text-xs text-[#635C53]">
          <div className="flex items-center gap-2">
            <span className="font-medium text-[#1E2229]">
              {filteredOpportunities.length} {isHindi ? "अवसर रडार पर सक्रिय" : "opportunities indexed on radar"}
            </span>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-xs bg-[#FAF7F2] border border-[#E8DEC8] text-[10px] text-[#8A7561]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] shadow-[0_0_6px_#00E676] animate-pulse"></span>
              <span className="font-mono text-sky-600 font-semibold">{executionTimeMs}ms</span>
              <span>{isHindi ? "• टाइनीफिश एज रडार स्कोरिंग" : "• TinyFish zero-latency match scored"}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-[#00C853] dark:text-[#00E676] font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#00C853] dark:text-[#00E676]" />
            <span>{isHindi ? "शून्य बिचौलिया शुल्क • सीधी क्लाइंट बोली" : "0% platform commission on direct bids"}</span>
          </div>
        </div>
      </div>

      {/* Opportunity Cards Grid with TinyFish Match Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredOpportunities.map((opp) => {
          const hasApplied = applications.some((app) => app.opportunityId === opp.id);
          const isTop = opp.match.isTopPick;
          const isRec = opp.match.isRecommended;

          return (
            <div
              key={opp.id}
              className={`bg-white rounded-sm border p-6 sm:p-7 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col justify-between space-y-5 transition-all duration-150 ${
                isTop
                  ? "border-[#00E676]/50 ring-1 ring-[#00E676]/30 bg-[#FDFAF5]"
                  : isRec
                  ? "border-sky-300 dark:border-sky-800 ring-1 ring-sky-300/30 bg-sky-50/30"
                  : "border-[#E8E2D7]"
              }`}
            >
              <div className="space-y-4">
                {/* Header: Type, Match Badge & Proximity */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Match Score Badge */}
                    <div
                      className={`px-2.5 py-1 rounded-sm text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-2xs ${
                        isTop
                          ? "bg-[#00E676]/15 text-[#00C853] dark:text-[#00E676] border border-[#00E676]/40 font-semibold"
                          : isRec
                          ? "bg-sky-50 text-sky-700 border border-sky-200"
                          : "bg-[#FAF7F2] text-[#8A7561] border border-[#E8DEC8]"
                      }`}
                      title="TinyFish Deterministic Craft Alignment Score"
                    >
                      <Sparkles className={`w-3 h-3 ${isRec ? "text-sky-600" : isTop ? "text-[#00C853] dark:text-[#00E676]" : "text-[#8A7561]"}`} />
                      <span>{opp.match.overallScore}% {isHindi ? "स्टूडियो मिलान" : "Studio Match"}</span>
                    </div>

                    <span className="bg-sky-50 text-sky-700 border border-sky-200 text-xs font-semibold px-2.5 py-1 rounded-sm uppercase tracking-wider">
                      {opp.type}
                    </span>

                    <span className="text-xs text-[#635C53] font-medium flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#8A7561]" />
                      {opp.location}
                    </span>
                  </div>

                  <span className="text-xs text-[#635C53] shrink-0 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-sky-600" />
                    {opp.deadline}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#1E2229] mb-1.5 hover:text-sky-600 transition-colors">
                    {opp.title}
                  </h3>
                  <p className="text-xs text-[#635C53] line-clamp-2 leading-relaxed">
                    {opp.description}
                  </p>
                </div>

                {/* TinyFish Deterministic Match Criteria Breakdown (Craft-Rooted, Non-AI) */}
                <div className="p-3 rounded-xs bg-[#FAF7F2] border border-[#E8DEC8] space-y-2 text-[11px]">
                  <div className="flex items-center justify-between text-[#8A7561]">
                    <span className="font-semibold text-[#1E2229] flex items-center gap-1">
                      <Target className="w-3 h-3 text-sky-600" />
                      <span>{isHindi ? "शिल्प विधा अनुकूलता:" : "Craft Medium Fit:"}</span>
                    </span>
                    <span className="text-sky-600 font-bold font-mono">{opp.match.factors.craftScore}%</span>
                  </div>
                  <p className="text-[#635C53] text-[10.5px] leading-tight">
                    {isHindi ? opp.match.craftRationaleHindi : opp.match.craftRationale}
                  </p>

                  <div className="flex items-center justify-between text-[#8A7561] pt-1.5 border-t border-[#E8DEC8]/50">
                    <span className="font-semibold text-[#1E2229] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#00C853] dark:text-[#00E676]" />
                      <span>{isHindi ? "क्षेत्रीय निकटता:" : "Regional Proximity:"}</span>
                    </span>
                    <span className="text-[#00C853] dark:text-[#00E676] font-bold font-mono">{opp.match.factors.proximityScore}%</span>
                  </div>
                  <p className="text-[#635C53] text-[10.5px] leading-tight">
                    {isHindi ? opp.match.proximityRationaleHindi : opp.match.proximityRationale}
                  </p>
                </div>

                {/* Client Box */}
                <div className="flex items-center gap-3 p-2.5 rounded-sm bg-[#FAF7F2] border border-[#E8DEC8] text-xs">
                  <img
                    src={opp.postedByAvatar}
                    alt={opp.postedBy}
                    className="w-8 h-8 rounded-sm object-cover aspect-square border border-[#E8DEC8] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#1A1816] truncate text-[11px]">{opp.postedBy}</p>
                    <p className="text-[10px] text-[#635C53] truncate">{opp.postedByOrg}</p>
                  </div>
                  {opp.postedByVerified && (
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-[#00C853] dark:text-[#00E676] shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified Patron
                    </span>
                  )}
                </div>

                {/* Match Tags Strip */}
                <div className="flex flex-wrap gap-1.5">
                  {opp.match.matchedTags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-sky-50 text-sky-700 border border-sky-200 text-xs font-semibold px-2.5 py-1 rounded-sm"
                    >
                      ✓ {tag}
                    </span>
                  ))}
                  {opp.requirements.slice(0, 1).map((req, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded-xs bg-[#FAF7F2] border border-[#E8DEC8] text-[#1A1816] truncate max-w-[200px]"
                    >
                      {req}
                    </span>
                  ))}
                </div>
              </div>

              {/* Payout & Action */}
              <div className="pt-4 border-t border-[#E8DEC8] flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-[#8A7561] uppercase font-semibold block">
                    {isHindi ? "अनुमानित बजट / दर:" : "Estimated Payout:"}
                  </span>
                  <p className="font-serif font-bold text-base text-sky-700">
                    ₹{opp.budgetMin.toLocaleString("en-IN")} - ₹{opp.budgetMax.toLocaleString("en-IN")}
                  </p>
                </div>

                {hasApplied ? (
                  <span className="px-3 py-1.5 rounded-sm bg-[#00E676]/15 text-[#00C853] dark:text-[#00E676] border border-[#00E676]/40 text-xs font-semibold flex items-center gap-1.5 shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-[#00C853] dark:text-[#00E676]" />
                    <span>Quote Submitted</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleOpenApply(opp)}
                    className="bg-sky-600 hover:bg-sky-700 text-white font-medium px-4 py-2 rounded-sm transition-colors text-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <span>Express Interest</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Express Interest Modal */}
      {selectedOpportunity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white rounded-sm max-w-lg w-full p-6 border border-[#E8E2D7] shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D7]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#8A7561]">
                  Commission Proposal
                </p>
                <h3 className="font-serif font-bold text-base text-[#1E2229] mt-0.5">
                  Send Studio Quote & Pitch
                </h3>
                <p className="text-xs text-sky-700 font-semibold mt-0.5">{selectedOpportunity.title}</p>
              </div>
              <button
                onClick={() => setSelectedOpportunity(null)}
                className="p-1 text-[#8A7561] hover:text-[#1E2229]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1A1816] mb-1">
                  Proposed Payout / Rate (INR ₹) *
                </label>
                <input
                  type="number"
                  required
                  min={selectedOpportunity.budgetMin}
                  value={proposedRate}
                  onChange={(e) => setProposedRate(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-sm border border-[#D3CBBE] text-xs bg-[#FDFCF9] text-[#1A1816] focus:outline-none focus:border-sky-500"
                />
                <p className="text-[10px] text-[#635C53] mt-1">
                  Client budget: ₹{selectedOpportunity.budgetMin.toLocaleString("en-IN")} - ₹{selectedOpportunity.budgetMax.toLocaleString("en-IN")}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A1816] mb-1">
                  Artisan Pitch & Craft Experience *
                </label>
                <textarea
                  rows={4}
                  required
                  value={pitch}
                  onChange={(e) => setPitch(e.target.value)}
                  placeholder="Mention previous works, materials you'll use, timeline commitment..."
                  className="w-full p-3 rounded-sm border border-[#D3CBBE] text-xs bg-[#FDFCF9] text-[#1A1816] focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8E2D7]">
                <button
                  type="button"
                  onClick={() => setSelectedOpportunity(null)}
                  className="btn-craft-secondary px-4 py-2 rounded-sm text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-sky-600 hover:bg-sky-700 text-white font-medium px-5 py-2 rounded-sm text-xs transition-colors cursor-pointer"
                >
                  Submit Studio Quote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TinyFish Web Agent: Autonomous Opportunity & Grant Scout Modal */}
      <AutonomousOpportunityAgentModal
        isOpen={isAgentModalOpen}
        onClose={() => setIsAgentModalOpen(false)}
      />

      {/* TinyFish Browser Infrastructure: Playwright/CDP Cloud Browser Modal */}
      <CloudBrowserViewerModal
        isOpen={isCloudBrowserOpen}
        onClose={() => setIsCloudBrowserOpen(false)}
      />
    </div>
  );
}
