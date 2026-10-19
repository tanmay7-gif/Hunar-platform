"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useHunar } from "@/context/HunarContext";
import {
  Sparkles,
  MapPin,
  CheckCircle,
  Share2,
  ArrowRight,
  TrendingUp,
  Compass,
  Briefcase,
  Star,
  MessageCircle,
  MessageSquare,
  ExternalLink,
  Shield,
  Layers,
  Award
} from "lucide-react";
import { ProtectedImage } from "@/components/ui/ProtectedImage";

export default function HomePage() {
  const router = useRouter();
  const { language, creators, currentPersona, opportunities, startOrGetConversation } = useHunar();
  const isHindi = language === "hi";

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedCity, setSelectedCity] = useState<string>("All");

  const categories = [
    { id: "All", label: isHindi ? "सभी विधाएं" : "All Crafts" },
    { id: "Madhubani & Folk", label: isHindi ? "मधुबनी एवं लोक कला" : "Madhubani & Folk" },
    { id: "Murals", label: isHindi ? "कैफे व भित्ति चित्र" : "Wall Murals" },
    { id: "Pottery", label: isHindi ? "टेराकोटा व पॉटरी" : "Studio Pottery" },
    { id: "Bridal Mehndi", label: isHindi ? "ब्राइडल मेहंदी" : "Bridal Mehndi" }
  ];

  const cities = ["All", "Delhi NCR", "Jaipur", "Lucknow", "Madhubani / Delhi NCR"];

  const filteredCreators = creators.filter((c) => {
    const matchCat = selectedCategory === "All" || c.primaryArtForm === selectedCategory;
    const matchCity = selectedCity === "All" || c.city.toLowerCase().includes(selectedCity.toLowerCase());
    return matchCat && matchCity;
  });

  return (
    <div className="min-h-screen">
      {/* Editorial Artisanal Hero Section */}
      <section className="relative overflow-hidden bg-[#FAF7F2] border-b border-[#E8E2D7] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 relative z-10">
          <div className="max-w-3xl">
            {/* Grounded Editorial Section Label */}
            <p className="text-xs font-semibold uppercase tracking-wider text-[#8A7561] mb-3">
              {isHindi ? "जमीनी भारतीय कलाकारों का स्वावलंबी मंच" : "Grassroots Creator & Artisan Guild"}
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#1E2229] leading-[1.15] tracking-tight">
              {isHindi ? (
                <>
                  हस्तकला की सच्ची कीमत। <br />
                  <span className="text-[#B4461F]">बिना किसी बिचौलिए के।</span>
                </>
              ) : (
                <>
                  Dignity, Direct Gigs & <br />
                  <span className="text-[#B4461F]">Fair Value for Grassroots Masters.</span>
                </>
              )}
            </h1>

            <p className="mt-5 text-base sm:text-lg text-[#635C53] leading-relaxed max-w-2xl font-normal">
              {isHindi
                ? "मधुबनी चित्रकारों, भित्ति कलाकारों, कुम्हारों और मेंहदी शिल्पकारों के लिए एक प्रामाणिक डिजिटल मंच। शेयर करें अपना डिजिटल हुनर कार्ड, सीधे व्हाट्सएप पर पाएं क्लाइंट्स और बढ़ाएं अपनी आजीविका।"
                : "The hyper-local career and monetization platform for India's folk painters, muralists, studio potters, and henna artisans. Share your lookbook Hunar Card, match with regional gigs, and scale income with structured roadmaps."}
            </p>

            {/* Hero CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Link
                href="/onboarding"
                className="px-6 py-3 rounded-sm bg-[#1E2229] hover:bg-[#111418] text-[#FAF7F2] font-medium text-xs sm:text-sm shadow-sm transition-colors duration-150 flex items-center gap-2 group"
              >
                <span>{isHindi ? "2 मिनट में हुनर कार्ड बनाएं" : "Create My Hunar Card (Free)"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/opportunities"
                className="px-5 py-3 rounded-sm border border-[#D9D0C3] bg-transparent text-[#2D2A26] hover:bg-[#EFEAE1] font-medium text-xs sm:text-sm transition-colors duration-150 flex items-center gap-2"
              >
                <Briefcase className="w-4 h-4 text-[#B4461F]" />
                <span>{isHindi ? "ताज़ा अवसर व बोलियां देखें" : "Explore Opportunity Radar"}</span>
              </Link>
            </div>

            {/* Live stats summary */}
            <div className="mt-12 pt-8 border-t border-[#E8E2D7] grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div>
                <p className="text-2xl sm:text-3xl font-serif font-bold text-[#1E2229]">450+</p>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  {isHindi ? "सत्यापित कलाकार" : "Verified Artisans"}
                </p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-serif font-bold text-[#B4461F]">0%</p>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  {isHindi ? "बिचौलिया कमीशन" : "Commission Taken"}
                </p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-serif font-bold text-[#1E2229]">₹1.4 Cr+</p>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  {isHindi ? "सीधी कमाई कराई" : "Direct Gig Payouts"}
                </p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-serif font-bold text-[#1E2229]">4.94★</p>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  {isHindi ? "क्लाइंट संतुष्टि दर" : "Client Satisfaction"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative artisanal motif watermark */}
        <div className="absolute right-[-60px] top-[-40px] opacity-10 pointer-events-none select-none text-[280px] font-serif text-[#B4461F]">
          हु
        </div>
      </section>

      {/* Dynamic Matched Banner for active Persona */}
      {currentPersona && currentPersona.role === "creator" && (
        <section className="bg-[#FAF7F2] border-b border-[#E8E2D7] py-3.5 px-6 md:px-12">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <p className="text-[#8B3B18] font-semibold">
                {isHindi ? (
                  <>
                    नमस्ते <span className="underline">{currentPersona.name}</span>! आपकी कला विधा (
                    {currentPersona.artCategory}) के लिए{" "}
                    <span className="font-bold">
                      {opportunities.filter((o) => o.matchedCategories.includes(currentPersona.artCategory || "")).length} नए अवसर
                    </span>{" "}
                    उपलब्ध हैं।
                  </>
                ) : (
                  <>
                    Active Persona: <span className="font-bold underline">{currentPersona.name}</span> • We found{" "}
                    <span className="font-bold">
                      {opportunities.filter((o) => o.matchedCategories.includes(currentPersona.artCategory || "")).length} gigs
                    </span>{" "}
                    matching your craft category ({currentPersona.artCategory})!
                  </>
                )}
              </p>
            </div>
            <Link
              href="/opportunities"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#1E2229] text-white font-medium hover:bg-[#111418] transition-colors duration-150 shrink-0"
            >
              <span>{isHindi ? "मैच किए गए अवसर देखें" : "View Matched Gigs"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      )}

      {/* Main Creator Showcase & Filter Board */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-16 sm:py-24">
        {/* Section Title & Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#E8E2D7]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#8A7561] mb-2">
              {isHindi ? "हस्तनिर्मित विरासत" : "Regional Directory & Lookbook"}
            </p>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1E2229]">
              {isHindi ? "प्रमाणित भारतीय कलाकार एवं कारीगर" : "Featured Verified Artisans"}
            </h2>
            <p className="text-xs sm:text-sm text-[#635C53] mt-1">
              {isHindi
                ? "सीधे कलाकारों से जुड़ें, उनकी कार्यशैली देखें और बिना किसी मध्यस्थ के ऑर्डर दें।"
                : "Browse verified craft profiles, transparent pricing, and connect directly on WhatsApp."}
            </p>
          </div>

          {/* City Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 whitespace-nowrap flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#B4461F]" />
              {isHindi ? "शहर चुनें:" : "City:"}
            </span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-3 py-1.5 rounded-sm bg-[#FDFCF9] border border-[#D3CBBE] text-xs font-semibold text-[#1A1816] focus:outline-none focus:border-[#1E2229]"
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city === "All" ? (isHindi ? "सभी शहर" : "All Cities") : city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 py-6 overflow-x-auto no-scrollbar">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-sm text-xs font-medium whitespace-nowrap transition-colors duration-150 ${
                  isSelected
                    ? "bg-[#1E2229] text-[#FAF7F2] shadow-xs"
                    : "bg-[#FFFFFF] border border-[#D9D0C3] text-[#2D2A26] hover:bg-[#EFEAE1]"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Creator "Hunar Card" Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
          {filteredCreators.map((creator) => {
            const primarySample = creator.portfolioImages[0];
            return (
              <div
                key={creator.id}
                className="rounded-sm overflow-hidden flex flex-col group border border-[#E8E2D7] bg-[#FFFFFF] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow duration-150"
              >
                {/* Cover & Portfolio Image Preview */}
                <div className="relative h-60 bg-[#F5EFE6] overflow-hidden">
                  <ProtectedImage
                    src={primarySample ? primarySample.imageUrl : creator.avatarUrl}
                    alt={creator.name}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    wrapperClassName="w-full h-full"
                  />

                  {/* Primary Craft Tag */}
                  <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-xs text-[11px] font-semibold bg-[#FAF7F2] text-[#1A1816] border border-[#E8E2D7] shadow-xs">
                      {isHindi ? creator.artFormHindi : creator.primaryArtForm}
                    </span>
                  </div>

                  {/* Verified Seal Stamp */}
                  {creator.isVerified && (
                    <div className="absolute top-3 right-3 z-20 flex items-center gap-1 px-2.5 py-0.5 rounded-xs bg-[#2D583B] text-white text-[10px] font-bold shadow-xs">
                      <CheckCircle className="w-3 h-3 text-[#E5A93B]" />
                      <span>{isHindi ? "प्रमाणित" : "Verified"}</span>
                    </div>
                  )}

                  {/* Base Pricing Box on bottom right */}
                  <div className="absolute bottom-3 right-3 z-20 bg-[#1E2229] text-[#FAF7F2] px-2.5 py-1 rounded-xs text-xs font-mono">
                    {creator.unitPricingLabel.split("•")[0]}
                  </div>

                  {/* Location badge on bottom left */}
                  <div className="absolute bottom-3 left-3 z-20 text-[#FAF7F2] text-xs flex items-center gap-1 font-medium bg-[#1E2229]/80 px-2 py-0.5 rounded-xs">
                    <MapPin className="w-3.5 h-3.5 text-[#E5A93B]" />
                    <span>{creator.city}</span>
                  </div>
                </div>

                {/* Creator Information Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Avatar & Name */}
                    <div className="flex items-start gap-3.5">
                      <ProtectedImage
                        src={creator.avatarUrl}
                        alt={creator.name}
                        className="w-14 h-14 rounded-full object-cover aspect-square"
                        wrapperClassName="w-14 h-14 rounded-full ring-2 ring-[#E8E2D7] border-2 border-white shadow-sm shrink-0 -mt-10 relative z-20 bg-white"
                      />
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/u/${creator.username}`}
                          className="hover:text-[#B4461F] transition-colors duration-150"
                        >
                          <h3 className="font-serif text-lg font-bold text-[#1A1816] truncate flex items-center gap-1.5 mb-0.5">
                            {isHindi ? creator.nameHindi : creator.name}
                          </h3>
                        </Link>
                        <p className="text-xs text-gray-500 truncate">
                          {creator.experienceLevel}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-bold text-[#1A1816]">
                        <Star className="w-3.5 h-3.5 fill-[#E5A93B] text-[#E5A93B]" />
                        <span>{creator.rating}</span>
                        <span className="text-gray-400 font-normal">({creator.reviewsCount})</span>
                      </div>
                    </div>

                    {/* Bio snippet */}
                    <p className="mt-3.5 text-xs text-[#635C53] leading-relaxed line-clamp-2">
                      {isHindi ? creator.bioHindi : creator.bio}
                    </p>

                    {/* Skill tags */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {creator.skills.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 rounded-xs text-[10px] font-medium bg-[#FAF7F2] text-[#635C53] border border-[#E8E2D7]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions & WhatsApp button */}
                  <div className="mt-5 pt-4 border-t border-[#E8E2D7] flex items-center gap-2">
                    <Link
                      href={`/u/${creator.username}`}
                      className="flex-1 text-center py-2 px-3 rounded-sm bg-[#FAF7F2] border border-[#D9D0C3] text-[#1A1816] text-xs font-medium hover:bg-[#EFEAE1] transition-colors duration-150 flex items-center justify-center gap-1.5"
                    >
                      <span>{isHindi ? "हुनर कार्ड देखें" : "View Lookbook"}</span>
                      <ArrowRight className="w-3 h-3 text-[#B4461F]" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        const conv = startOrGetConversation({
                          sellerId: creator.id,
                          initialMessage: `Namaste ${creator.name}! I discovered your featured studio on Hunar and would like to chat about custom artwork.`
                        });
                        router.push(`/dashboard/chat/${conv.id}`);
                      }}
                      className="p-2 rounded-sm bg-[#B4461F] text-white hover:bg-[#963715] transition-colors duration-150"
                      title={isHindi ? "सीधा संदेश भेजें" : "Direct In-App Chat"}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Asymmetric Purposeful Kala Roadmap Section */}
      <section className="bg-[#FAF7F2] border-y border-[#E8E2D7] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Purpose & Blueprint Strategy */}
            <div className="lg:col-span-5 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#8A7561] mb-2">
                {isHindi ? "कला रोडमैप प्रणाली" : "Field-Tested Artisan Playbook"}
              </p>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1E2229] leading-tight">
                {isHindi ? (
                  <>
                    शिल्प से स्वावलंबन: <br />
                    <span className="text-[#B4461F]">महीना 1, 3, और 6 का स्पष्ट मार्ग।</span>
                  </>
                ) : (
                  <>
                    From Raw Craft to Scaled Income: <br />
                    <span className="text-[#B4461F]">A Practical 6-Month Trajectory.</span>
                  </>
                )}
              </h2>
              <p className="text-sm text-[#635C53] leading-relaxed">
                {isHindi
                  ? "कोई अस्पष्ट सलाह नहीं। वर्ग-फुट की दरें तय करने से लेकर कैफे मालिकों से 50% एडवांस अनुबंध हासिल करने तक के व्यावहारिक कदम।"
                  : "No generic corporate advice. Concrete micro-steps: calculating per-sq-ft unit rates for murals, lead-free certification for pottery, and enforcing a 50% advance contract."}
              </p>

              <div className="pt-2">
                <Link
                  href="/roadmap"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-[#1E2229] hover:bg-[#111418] text-[#FAF7F2] font-medium text-xs shadow-xs transition-colors duration-150"
                >
                  <span>{isHindi ? "अपनी विधा का रोडमैप चुनें" : "Explore Kala Roadmap"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Column: Asymmetric Structured Lookbook Table */}
            <div className="lg:col-span-7 bg-white border border-[#E8E2D7] rounded-sm p-6 sm:p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <h3 className="font-serif text-base font-bold text-[#1E2229] mb-4 pb-3 border-b border-[#E8E2D7]">
                Milestone Execution Framework (6-Month Trajectory)
              </h3>

              <div className="divide-y divide-[#E8E2D7] text-xs">
                {/* Stage 1 */}
                <div className="py-4 first:pt-0 grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                  <div className="md:col-span-3">
                    <span className="px-2 py-0.5 rounded-xs bg-[#FAF7F2] border border-[#E8E2D7] text-[#1A1816] font-mono font-bold text-[11px]">
                      Phase 01
                    </span>
                    <p className="font-bold text-[#1A1816] mt-1.5">Groundwork & Unit Rates</p>
                    <p className="text-[11px] text-[#8B3B18] font-mono font-semibold">₹15,000 – ₹25,000/mo</p>
                  </div>
                  <div className="md:col-span-9 text-[#635C53] leading-relaxed">
                    Photo 3 test walls, lock unit economics (₹150–180/sq ft for murals, lead-free certification for studio pottery), and publish a verified 1-page PDF lookbook for WhatsApp sharing.
                  </div>
                </div>

                {/* Stage 2 */}
                <div className="py-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                  <div className="md:col-span-3">
                    <span className="px-2 py-0.5 rounded-xs bg-[#FAF7F2] border border-[#E8E2D7] text-[#1A1816] font-mono font-bold text-[11px]">
                      Phase 02
                    </span>
                    <p className="font-bold text-[#1A1816] mt-1.5">First 5 B2B Clients</p>
                    <p className="text-[11px] text-[#8B3B18] font-mono font-semibold">₹40,000 – ₹65,000/mo</p>
                  </div>
                  <div className="md:col-span-9 text-[#635C53] leading-relaxed">
                    Pitch 10 cafes and boutique studios with digital surface mockups, enforce a strict 50% advance milestone escrow, and record natural process videos for organic patron inquiries.
                  </div>
                </div>

                {/* Stage 3 */}
                <div className="py-4 last:pb-0 grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                  <div className="md:col-span-3">
                    <span className="px-2 py-0.5 rounded-xs bg-[#FAF7F2] border border-[#E8E2D7] text-[#1A1816] font-mono font-bold text-[11px]">
                      Phase 03
                    </span>
                    <p className="font-bold text-[#1A1816] mt-1.5">Retainers & Scaled Crew</p>
                    <p className="text-[11px] text-[#8B3B18] font-mono font-semibold">₹85,000 – ₹1,40,000/mo</p>
                  </div>
                  <div className="md:col-span-9 text-[#635C53] leading-relaxed">
                    Sign ongoing retainer contracts with 2 interior architectural firms, train 2 apprentice artisans from your local cluster, and integrate 2-year weatherproofing warranty guarantees.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Direct Guild Artisan Discovery Callout */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-16 sm:py-24">
        <div className="rounded-sm bg-[#1E2229] text-[#FAF7F2] p-8 sm:p-12 relative overflow-hidden border border-[#343B47]">
          <div className="relative z-10 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#E5A93B] mb-2">
              {isHindi ? "शिल्प बाज़ार • सीधा कारीगर संपर्क" : "Direct Guild Trade"}
            </p>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#FAF7F2]">
              {isHindi
                ? "सीधे भारत के प्रामाणिक कारीगरों से कलाकृतियां प्राप्त करें"
                : "Source Bespoke Craft Directly from India's Master Artisans"}
            </h3>
            <p className="mt-3 text-xs sm:text-sm text-[#D9D0C3] leading-relaxed font-normal">
              {isHindi
                ? "बिना किसी बिचौलिए के सीधे कलाकारों से हाथ से बनी टेराकोटा, मधुबनी चित्रकला और भित्ति म्यूरल्स का ऑर्डर दें। 100% भुगतान सीधे कारीगर को।"
                : "From studio pottery to heritage Mithila folk paintings and architectural murals. Browse ready inventory or commission custom work with zero middleman commissions."}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/dashboard/customer"
                className="px-5 py-2.5 rounded-sm bg-[#B4461F] text-white font-medium text-xs hover:bg-[#963715] transition-colors duration-150 flex items-center gap-2"
              >
                <span>{isHindi ? "हस्तशिल्प बाज़ार देखें" : "Explore Handmade Bazaar"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/dashboard/customer/post-gig"
                className="px-5 py-2.5 rounded-sm bg-[#2A313D] border border-[#4B5565] text-white font-medium text-xs hover:bg-[#343C4B] transition-colors duration-150 flex items-center gap-2"
              >
                <span>{isHindi ? "कस्टम ऑर्डर पोस्ट करें" : "Post a Custom Brief"}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
