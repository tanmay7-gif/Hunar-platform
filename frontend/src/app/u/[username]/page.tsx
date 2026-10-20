"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useHunar } from "@/context/HunarContext";
import {
  Sparkles,
  MapPin,
  CheckCircle,
  Share2,
  Copy,
  MessageCircle,
  MessageSquare,
  Star,
  Award,
  Layers,
  Phone,
  Calendar,
  Clock,
  Video,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  X,
  ExternalLink,
  ChevronLeft
} from "lucide-react";
import { MentorshipBookingModal } from "@/components/customer/MentorshipBookingModal";
import { ProtectedImage } from "@/components/ui/ProtectedImage";

function HunarCardContent() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;
  const { language, creators, hireCreator, showToast, startOrGetConversation } = useHunar();
  const isHindi = language === "hi";

  const creator = creators.find((c) => c.username === username) || creators[0];

  const handleStartDirectChat = () => {
    const conv = startOrGetConversation({
      sellerId: creator.id,
      initialMessage: `Namaste ${creator.name}! I am viewing your verified Hunar Lookbook and would like to inquire about commissioning custom artwork.`
    });
    router.push(`/dashboard/chat/${conv.id}`);
  };

  // State for "Book Mentorship" Modal
  const [mentorshipModalOpen, setMentorshipModalOpen] = useState(false);

  // State for "Request a Quote / Hire" Modal
  const [hireModalOpen, setHireModalOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [proposedBudget, setProposedBudget] = useState(creator.minPricing);
  const [projectNote, setProjectNote] = useState("");

  // State for portfolio image lightbox
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleHireSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone) return;

    hireCreator(
      creator.id,
      clientName,
      clientPhone,
      Number(proposedBudget),
      projectNote || "Inquiry via Hunar Card"
    );

    setHireModalOpen(false);
    setClientName("");
    setClientPhone("");
    setProjectNote("");
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      showToast(
        isHindi ? "लिंक कॉपी हो गया!" : "Link Copied!",
        isHindi ? "हुनर कार्ड का लिंक क्लिपबोर्ड में कॉपी किया गया।" : "Hunar Card share link copied to clipboard.",
        "info"
      );
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#635C53] hover:text-[#B4461F] transition-colors duration-150"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{isHindi ? "सभी कलाकार देखें" : "Back to Artists"}</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-sm bg-white border border-[#E8E2D7] text-xs font-medium text-[#1A1816] hover:bg-[#FAF7F2] transition-colors duration-150 flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5 text-[#B4461F]" />
              <span>{isHindi ? "कार्ड लिंक कॉपी करें" : "Copy Link"}</span>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* THE TACTILE "HUNAR CARD" PROFILE CONTAINER                */}
        {/* ========================================================= */}
        <div className="rounded-sm bg-white border border-[#E8E2D7] shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden relative">
          {/* Top Artisanal Solid Header Banner */}
          <div className="relative h-48 sm:h-64 bg-[#1E2229] border-b border-[#2C323D] overflow-hidden">
            {creator.coverImage && (
              <ProtectedImage
                src={creator.coverImage}
                alt="Craft texture"
                className="w-full h-full object-cover opacity-20"
                wrapperClassName="w-full h-full"
              />
            )}

            {/* Official Hunar Verified Tag */}
            <div className="absolute top-4 left-4 flex items-center gap-2.5 px-3 py-1.5 rounded-sm bg-[#FAF7F2]/95 backdrop-blur-sm text-[#1E2229] border border-[#E8E2D7] shadow-xs">
              <div className="relative w-5 h-5 flex-shrink-0">
                <Image
                  src="/assets/logo-compact.png"
                  alt="Hunar Mark"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col select-none">
                <span className="text-[11px] font-bold text-[#C85A32] leading-none">
                  {isHindi ? "सत्यापित हुनर कार्ड" : "Verified Hunar Card"}
                </span>
                <span className="text-[8px] font-medium tracking-wider uppercase text-[#635C53]">
                  By Flytech
                </span>
              </div>
            </div>

            {/* Direct In-App Chat button in top right */}
            <div className="absolute top-4 right-4">
              <button
                type="button"
                onClick={handleStartDirectChat}
                className="px-3.5 py-1.5 rounded-sm bg-[#B4461F] text-white text-xs font-medium hover:bg-[#963715] transition-colors duration-150 flex items-center gap-1.5 shadow-xs"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{isHindi ? "कारीगर से चैट करें" : "Inquire / Direct Chat"}</span>
              </button>
            </div>
          </div>

          {/* Main Card Profile Body */}
          <div className="px-6 sm:px-10 pb-10">
            {/* Header row: Avatar, Name, Rating, and Quick Hire CTA */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 relative z-10 pb-6 border-b border-[#E8E2D7]">
              <div className="flex items-end gap-5">
                <ProtectedImage
                  src={creator.avatarUrl}
                  alt={creator.name}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-sm object-cover aspect-square"
                  wrapperClassName="w-28 h-28 sm:w-32 sm:h-32 rounded-sm border-2 border-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] bg-white shrink-0"
                />
                <div className="pb-1">
                  <div className="flex items-center gap-2">
                    <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E2229]">
                      {isHindi ? creator.nameHindi : creator.name}
                    </h1>
                    {creator.isVerified && (
                      <span className="p-1 rounded-xs bg-[#00E676]/15 text-[#00C853] dark:text-[#00E676] border border-[#00E676]/40 flex items-center justify-center" title="Verified Artisan">
                        <CheckCircle className="w-3.5 h-3.5 text-[#00C853] dark:text-[#00E676]" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-[#B4461F] mt-0.5">
                    {isHindi ? creator.artFormHindi : creator.primaryArtForm} • {creator.city}
                  </p>
                  <p className="text-xs text-[#635C53] mt-0.5">{creator.experienceLevel}</p>
                </div>
              </div>

              {/* Profile Actions: Mentorship + Commission */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full sm:w-auto">
                {creator.offersMentorship !== false && (
                  <button
                    onClick={() => setMentorshipModalOpen(true)}
                    className="flex-1 sm:flex-initial px-4 sm:px-5 py-2.5 rounded-sm font-semibold text-xs flex items-center justify-center gap-2 bg-[#1E2229] text-white hover:bg-[#2D3440] transition-colors duration-150 shadow-sm border border-[#3E4756]"
                  >
                    <Video className="w-3.5 h-3.5 text-[#E5A93B]" />
                    <span>
                      {isHindi
                        ? `१-ऑन-१ मेंटरशिप (₹${(creator.mentorshipFee || 899).toLocaleString("en-IN")})`
                        : `Book 1-on-1 Guidance (₹${(creator.mentorshipFee || 899).toLocaleString("en-IN")})`}
                    </span>
                  </button>
                )}

                <button
                  onClick={() => setHireModalOpen(true)}
                  className="btn-terracotta flex-1 sm:flex-initial px-4 sm:px-5 py-2.5 rounded-sm font-medium text-xs flex items-center justify-center gap-2 transition-colors duration-150"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{isHindi ? "कोटेशन मांगें / कमीशन" : "Commission Work"}</span>
                </button>
              </div>
            </div>

            {/* Transparent Rate & Unit Economics Strip */}
            <div className="my-8 p-6 rounded-sm bg-[#FAF7F2] border border-[#E8E2D7] grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <p className="text-[11px] font-bold text-[#8A7561] uppercase tracking-wider">
                  {isHindi ? "प्रारंभिक बुकिंग दर" : "Base Booking Rate"}
                </p>
                <p className="text-lg font-serif font-bold text-[#1E2229] mt-0.5">
                  ₹{creator.minPricing.toLocaleString("en-IN")}
                </p>
                <p className="text-[11px] text-[#635C53]">{creator.unitPricingLabel}</p>
              </div>

              <div>
                <p className="text-[11px] font-bold text-[#8A7561] uppercase tracking-wider">
                  {isHindi ? "संतुष्टि व समीक्षाएं" : "Artisan Reputation"}
                </p>
                <p className="text-lg font-serif font-bold text-[#B4461F] mt-0.5 flex items-center gap-1">
                  <Star className="w-4 h-4 fill-[#B4461F]" />
                  <span>{creator.rating} / 5.0</span>
                </p>
                <p className="text-[11px] text-[#635C53]">
                  {creator.reviewsCount} {isHindi ? "प्रमाणित समीक्षाएं" : "Verified Client Reviews"}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-bold text-[#8A7561] uppercase tracking-wider">
                  {isHindi ? "पूर्ण किए गए प्रोजेक्ट्स" : "Completed Commissions"}
                </p>
                <p className="text-lg font-serif font-bold text-[#00C853] dark:text-[#00E676] mt-0.5">
                  {creator.completedGigsCount}+
                </p>
                <p className="text-[11px] text-[#635C53]">
                  {isHindi ? "0% मध्यस्थ हस्तक्षेप" : "100% Direct Payouts"}
                </p>
              </div>
            </div>

            {/* About / Bio Statement */}
            <div className="py-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#8A7561] mb-2">
                {isHindi ? "शिल्पी परिचय एवं विरासत" : "Artisan Heritage & Statement"}
              </h2>
              <p className="text-sm text-[#535A66] leading-relaxed font-normal">
                {isHindi ? creator.bioHindi : creator.bio}
              </p>

              {/* Skills and Badges */}
              <div className="mt-4 flex flex-wrap gap-2">
                {creator.badges.map((b) => (
                  <span
                    key={b}
                    className="px-2.5 py-1 rounded-xs text-xs font-medium bg-[#FAF0E6] text-[#B4461F] border border-[#F3CFBF]"
                  >
                    {b}
                  </span>
                ))}
                {creator.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-xs text-xs font-medium bg-white text-[#1A1816] border border-[#E8E2D7]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* ========================================================= */}
            {/* DEDICATED MENTORSHIP & MASTERCLASS SECTION               */}
            {/* ========================================================= */}
            {creator.offersMentorship !== false && (
              <div
                id="mentorship"
                className="mt-8 p-6 sm:p-8 rounded-sm bg-[#FAF7F2] border border-[#E8DEC8] shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-[#E8DEC8]">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-xs text-[10px] font-semibold uppercase tracking-wider bg-[#00E676]/15 text-[#00C853] dark:text-[#00E676] border border-[#00E676]/40 flex items-center gap-1.5">
                        <Video className="w-3 h-3 text-[#00C853] dark:text-[#00E676]" />
                        <span>{isHindi ? "१-ऑन-१ मेंटरशिप" : "1-on-1 Paid Masterclass"}</span>
                      </span>
                      <span className="px-2 py-0.5 rounded-xs text-[10px] font-semibold bg-white text-[#B4461F] border border-[#E8DEC8]">
                        100% Direct Payouts
                      </span>
                    </div>

                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1E2229]">
                      {creator.mentorshipTitle || `${creator.primaryArtForm} Technique & 1-on-1 Masterclass`}
                    </h3>

                    <p className="text-xs text-[#535A66] max-w-xl leading-relaxed">
                      {isHindi
                        ? `शिल्पी ${creator.nameHindi || creator.name} से सीधे वीडियो कॉल पर सीखें। तकनीक, खनिज वर्णक, भट्टी तापमान और बाज़ार मूल्य निर्धारण पर व्यक्तिगत मार्गदर्शन प्राप्त करें।`
                        : `Learn ancestral techniques directly from ${creator.name}. A private ${creator.mentorshipDuration || 45}-minute video session tailored to your portfolio, craft questions, or business inquiries.`}
                    </p>
                  </div>

                  {/* Pricing & Booking CTA Card */}
                  <div className="p-4 rounded-sm bg-white border border-[#E8DEC8] shadow-xs text-center sm:text-right shrink-0 space-y-2">
                    <div>
                      <span className="text-[10px] font-bold text-[#8A7561] uppercase tracking-wider">
                        {isHindi ? "सत्र शुल्क" : "Consultation Fee"}
                      </span>
                      <p className="text-2xl font-serif font-bold text-[#1E2229]">
                        ₹{(creator.mentorshipFee || 899).toLocaleString("en-IN")}
                      </p>
                      <p className="text-[11px] text-[#635C53]">
                        {creator.mentorshipDuration || 45} Mins via Video Call
                      </p>
                    </div>

                    <button
                      onClick={() => setMentorshipModalOpen(true)}
                      className="w-full px-5 py-2.5 rounded-sm bg-[#1E2229] hover:bg-[#2C323D] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors duration-150"
                    >
                      <Calendar className="w-3.5 h-3.5 text-[#E5A93B]" />
                      <span>{isHindi ? "सत्र बुक करें" : "Book Mentorship Session"}</span>
                    </button>
                  </div>
                </div>

                {/* Agenda & Availability Sub-strip */}
                <div className="pt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  <div className="md:col-span-8 space-y-2">
                    <p className="text-[11px] font-bold text-[#8A7561] uppercase tracking-wider">
                      {isHindi ? "सत्र का मुख्य एजेंडा" : "Curated Session Agenda:"}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {(creator.mentorshipTopics || [
                        "Raw material sourcing & organic pigment extraction",
                        "Ancestral line balance & precision finishing",
                        "Commercial client proposals & milestone budgeting",
                        "Packaging & weatherproofing fragile handmade works"
                      ]).map((topic, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xs bg-white border border-[#E8DEC8] flex items-start gap-2 text-xs text-[#1E2229]"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#B4461F] mt-1.5 shrink-0" />
                          <span className="leading-snug">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-4 p-4 rounded-xs bg-white border border-[#E8DEC8] space-y-2 text-xs">
                    <p className="text-[11px] font-bold text-[#8A7561] uppercase tracking-wider">
                      {isHindi ? "उपलब्ध समय" : "Availability Window:"}
                    </p>
                    <div className="flex items-center gap-2 text-[#1E2229] font-medium">
                      <Clock className="w-4 h-4 text-[#B4461F] shrink-0" />
                      <span>{creator.mentorshipAvailability || "Saturdays & Sundays, 4 PM – 7 PM"}</span>
                    </div>
                    <p className="text-[11px] text-[#635C53] leading-relaxed pt-1 border-t border-[#E8DEC8]">
                      Confirmed upon instant checkout with automated Google Meet & Calendar links.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Verified Portfolio Gallery */}
            <div className="mt-8 pt-8 border-t border-[#E8E2D7]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#1E2229]">
                    {isHindi ? "प्रमाणित कार्य संग्रह" : "Verified Work Lookbook"}
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {creator.portfolioImages.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-sm border border-[#E8E2D7] bg-white overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] group cursor-pointer"
                    onClick={() => setSelectedImage(item.imageUrl)}
                  >
                    <div className="relative h-60 bg-[#FAF7F2] overflow-hidden">
                      <ProtectedImage
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
                        wrapperClassName="w-full h-full"
                        shieldClassName="cursor-pointer"
                      />
                      {item.price && (
                        <div className="absolute bottom-3 right-3 z-20 px-2.5 py-1 rounded-xs bg-[#1E2229] text-[#FAF7F2] text-xs font-medium">
                          ₹{item.price.toLocaleString("en-IN")}
                        </div>
                      )}
                    </div>

                    <div className="p-4 space-y-2">
                      <h4 className="font-serif font-bold text-sm text-[#1E2229] group-hover:text-[#B4461F] transition-colors duration-150">
                        {item.title}
                      </h4>
                      <p className="text-xs text-[#635C53] leading-normal">
                        <span className="font-semibold text-[#B4461F]">Medium: </span>
                        {item.medium}
                      </p>

                      {item.clientQuote && (
                        <div className="mt-2 pt-2 border-t border-[#E8E2D7] text-xs italic text-[#535A66] bg-[#FAF7F2] p-2.5 rounded-xs border border-[#E8E2D7]">
                          &ldquo;{item.clientQuote}&rdquo;
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct WhatsApp Callout Banner */}
            <div className="mt-10 p-6 rounded-sm bg-[#00E676]/10 border border-[#00E676]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-sm bg-[#00E676] text-slate-950 shadow-[0_0_8px_#00E676] flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5 text-slate-950" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-[#1E2229]">
                    {isHindi
                      ? `${creator.nameHindi || creator.name} से सीधे चैट पर बात करें`
                      : `Chat with ${creator.name} directly in-app`}
                  </h4>
                  <p className="text-xs text-[#535A66] mt-0.5">
                    {isHindi
                      ? "बिना किसी बिचौलिए के अपना विचार साझा करें और इन-चैट सुरक्षित भुगतान करें।"
                      : "Send requirements, photo references, finalize custom sizes, and pay securely in-chat."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleStartDirectChat}
                className="px-4 py-2.5 rounded-sm btn-terracotta text-white text-xs font-semibold hover:bg-[#963715] transition-colors duration-150 shrink-0 flex items-center gap-1.5 shadow-xs"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{isHindi ? "सीधा संदेश व चैट शुरू करें" : "Start In-App Chat"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* MODAL: Request a Quote / Hire                            */}
        {/* ========================================================= */}
        {hireModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="bg-white rounded-sm max-w-lg w-full p-6 sm:p-8 border border-[#E8E2D7] shadow-xl relative">
              <button
                onClick={() => setHireModalOpen(false)}
                className="absolute top-4 right-4 text-[#8A7561] hover:text-[#1E2229] transition-colors duration-150"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-4 pb-3 border-b border-[#E8E2D7]">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#8A7561]">
                  {isHindi ? "सीधा कोटेशन अनुरोध" : "Direct Commission / Hire Request"}
                </p>
                <h3 className="font-serif text-xl font-bold text-[#1E2229] mt-1">
                  {creator.name} ({creator.primaryArtForm})
                </h3>
              </div>

              <form onSubmit={handleHireSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1A1816] mb-1">
                    {isHindi ? "आपका नाम / संस्था का नाम:" : "Your Name / Organization:"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isHindi ? "जैसे: सिद्धार्थ (ब्लू टोकाई कैफे)" : "e.g. Siddharth (Blue Tokai)"}
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-sm bg-[#FDFCF9] border border-[#D3CBBE] text-xs text-[#1A1816] focus:outline-none focus:border-[#B4461F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1816] mb-1">
                    {isHindi ? "आपका फोन / व्हाट्सएप नंबर:" : "Phone / WhatsApp Number:"}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98112 34567"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-sm bg-[#FDFCF9] border border-[#D3CBBE] text-xs text-[#1A1816] focus:outline-none focus:border-[#B4461F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1816] mb-1 flex items-center justify-between">
                    <span>{isHindi ? "प्रस्तावित बजट (₹):" : "Proposed Budget (₹):"}</span>
                    <span className="text-[#635C53] font-normal">Min: ₹{creator.minPricing}</span>
                  </label>
                  <input
                    type="number"
                    min={creator.minPricing}
                    step={500}
                    value={proposedBudget}
                    onChange={(e) => setProposedBudget(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-sm bg-[#FDFCF9] border border-[#D3CBBE] text-xs text-[#1A1816] font-semibold focus:outline-none focus:border-[#B4461F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1816] mb-1">
                    {isHindi ? "कार्य का विवरण (वॉल साइज़, तारीख, या आवश्यकताएं):" : "Project Details / Requirements:"}
                  </label>
                  <textarea
                    rows={3}
                    placeholder={
                      isHindi
                        ? "जैसे: हमें अपने नए कैफे के लिए 12x8 फीट की दीवार पर चित्रकारी करवानी है..."
                        : "e.g. Need a 14x10 ft cafe mural in Hauz Khas next weekend..."
                    }
                    value={projectNote}
                    onChange={(e) => setProjectNote(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-sm bg-[#FDFCF9] border border-[#D3CBBE] text-xs text-[#1A1816] focus:outline-none focus:border-[#B4461F]"
                  />
                </div>

                <div className="pt-3 border-t border-[#E8E2D7] flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setHireModalOpen(false)}
                    className="btn-craft-secondary px-4 py-2 rounded-sm text-xs"
                  >
                    {isHindi ? "रद्द करें" : "Cancel"}
                  </button>
                  <button
                    type="submit"
                    className="btn-terracotta px-5 py-2 rounded-sm text-xs font-medium inline-flex items-center gap-1.5 transition-colors duration-150"
                  >
                    <span>{isHindi ? "प्रस्ताव भेजें" : "Submit Inquiry"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Lightbox Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-3xl max-h-[90vh]">
              <ProtectedImage
                src={selectedImage}
                alt="Enlarged artwork"
                className="max-h-[85vh] w-auto rounded-sm object-contain shadow-2xl"
                wrapperClassName="max-h-[85vh] w-auto rounded-sm"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 z-20 p-1.5 bg-[#1E2229] rounded-sm text-white hover:bg-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Mentorship Booking Modal */}
        <MentorshipBookingModal
          isOpen={mentorshipModalOpen}
          onClose={() => setMentorshipModalOpen(false)}
          creator={creator}
          isHindi={isHindi}
        />
      </div>
    </div>
  );
}

export default function HunarCardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F9F6F0] flex items-center justify-center text-stone-500 font-medium">Loading artisan profile...</div>}>
      <HunarCardContent />
    </Suspense>
  );
}
