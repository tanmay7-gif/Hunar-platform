"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useHunar } from "@/context/HunarContext";
import { MentorshipBooking, MentorshipOffering } from "@/types";
import {
  Video,
  Clock,
  Calendar,
  CheckCircle2,
  DollarSign,
  Plus,
  Trash2,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  AlertCircle,
  ChevronRight,
  UserCheck,
  Check,
  Phone,
  Mail,
  Copy
} from "lucide-react";

interface MentorshipManagerProps {
  isHindi?: boolean;
}

export function MentorshipManager({ isHindi = false }: MentorshipManagerProps) {
  const {
    currentUser,
    creators,
    mentorshipBookings,
    updateMentorshipOffering,
    updateMentorshipBookingStatus,
    showToast
  } = useHunar();

  // Find corresponding creator profile to sync initial state
  const matchingCreator =
    creators.find(
      (c) =>
        c.id === currentUser.id ||
        (currentUser.username && c.username === currentUser.username) ||
        (currentUser.id === "demo-seller-rohit" && c.id === "creator-rohit")
    ) || creators[0];

  // Local offering form state
  const [enabled, setEnabled] = useState<boolean>(
    currentUser.offersMentorship ?? matchingCreator.offersMentorship ?? true
  );
  const [title, setTitle] = useState<string>(
    currentUser.mentorshipTitle ||
      matchingCreator.mentorshipTitle ||
      "Khurja Terracotta Glazing & Kiln Setup"
  );
  const [duration, setDuration] = useState<number>(
    currentUser.mentorshipDuration || matchingCreator.mentorshipDuration || 45
  );
  const [fee, setFee] = useState<number>(
    currentUser.mentorshipFee || matchingCreator.mentorshipFee || 899
  );
  const [availability, setAvailability] = useState<string>(
    currentUser.mentorshipAvailability ||
      matchingCreator.mentorshipAvailability ||
      "Saturdays & Sundays, 4 PM – 7 PM"
  );
  const [agenda, setAgenda] = useState<string[]>(
    currentUser.mentorshipTopics ||
      matchingCreator.mentorshipTopics || [
        "Wheel-throwing centering & balance precision",
        "Wood-fired kiln temperature management (Cone 04-06)",
        "Formulating food-safe, non-toxic studio glazes",
        "Packaging fragile ceramic dinnerware for courier transit"
      ]
  );
  const [newTopicInput, setNewTopicInput] = useState("");
  const [bookingFilter, setBookingFilter] = useState<"ALL" | "CONFIRMED" | "COMPLETED">("ALL");
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync state if currentUser changes
  useEffect(() => {
    if (currentUser.offersMentorship !== undefined) {
      setEnabled(currentUser.offersMentorship);
    }
    if (currentUser.mentorshipTitle) {
      setTitle(currentUser.mentorshipTitle);
    }
    if (currentUser.mentorshipFee) {
      setFee(currentUser.mentorshipFee);
    }
    if (currentUser.mentorshipDuration) {
      setDuration(currentUser.mentorshipDuration);
    }
    if (currentUser.mentorshipTopics && currentUser.mentorshipTopics.length > 0) {
      setAgenda(currentUser.mentorshipTopics);
    }
    if (currentUser.mentorshipAvailability) {
      setAvailability(currentUser.mentorshipAvailability);
    }
  }, [currentUser]);

  // Relevant bookings for this artisan
  const sellerBookings = mentorshipBookings.filter(
    (b) =>
      b.mentorId === currentUser.id ||
      b.mentorId === "demo-seller-rohit" ||
      (currentUser.username && b.mentorId === "creator-rohit") ||
      b.mentorName === currentUser.name
  );

  const filteredBookings = sellerBookings.filter((b) => {
    if (bookingFilter === "ALL") return true;
    return b.status === bookingFilter;
  });

  const totalRevenue = sellerBookings
    .filter((b) => b.status === "CONFIRMED" || b.status === "COMPLETED")
    .reduce((acc, b) => acc + (b.feePaid || fee), 0);

  const upcomingCount = sellerBookings.filter((b) => b.status === "CONFIRMED").length;

  const handleAddAgendaTopic = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newTopicInput.trim()) return;
    setAgenda([...agenda, newTopicInput.trim()]);
    setNewTopicInput("");
  };

  const handleRemoveAgendaTopic = (indexToRemove: number) => {
    setAgenda(agenda.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSaveOffering = () => {
    updateMentorshipOffering(currentUser.id, {
      enabled,
      title: title.trim(),
      duration: Number(duration),
      fee: Number(fee),
      agenda,
      availability: availability.trim()
    });
  };

  const handleCopyProfileLink = () => {
    if (typeof window !== "undefined") {
      const username = currentUser.username || matchingCreator.username || "rohit-pottery";
      const url = `${window.location.origin}/u/${username}#mentorship`;
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
      showToast(
        isHindi ? "लिंक कॉपी हो गया!" : "Mentorship Link Copied!",
        isHindi
          ? "परामर्श बुकिंग का सीधा लिंक क्लिपबोर्ड में कॉपी किया गया।"
          : "Direct link to your Hunar Card mentorship section copied to clipboard.",
        "info"
      );
    }
  };

  // Preset topic ideas for quick 1-click filling
  const suggestedTitles = [
    "Khurja Terracotta Glazing & Kiln Setup",
    "Traditional Madhubani Pigment Prep & Kachni Lines",
    "Bulk Order Pricing & Contracts for Wall Murals",
    "Wheel-Throwing Ergonomics & Centering Heavy Clay",
    "Pricing Studio Ceramics for Luxury Cafes"
  ];

  return (
    <div className="space-y-10">
      {/* Overview & Header Banner */}
      <div className="p-6 sm:p-8 rounded-sm bg-[#FAF7F2] border border-[#E8DEC8] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#E8DEC8]">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-xs text-[10px] font-semibold uppercase tracking-wider bg-[#00E676]/15 text-[#00C853] dark:text-[#00E676] border border-[#00E676]/40 flex items-center gap-1.5">
                <Video className="w-3 h-3 text-[#00C853] dark:text-[#00E676]" />
                <span>{isHindi ? "१-ऑन-१ शिल्प परामर्श" : "1-on-1 Artisan Mentorship"}</span>
              </span>
              <span className="px-2 py-0.5 rounded-xs text-[10px] font-semibold uppercase tracking-wider bg-[#FAF0E6] text-[#B4461F] border border-[#F3CFBF]">
                100% Direct Payouts (0% Platform Cut)
              </span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#1E2229]">
              {isHindi ? "कारीगर मेंटरशिप" : "Artisan Mentorship"}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleCopyProfileLink}
              className="px-3.5 py-2 rounded-sm bg-white border border-[#E8DEC8] text-xs font-medium text-[#1E2229] hover:bg-[#FAF7F2] transition-colors duration-150 flex items-center gap-1.5"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#00C853] dark:text-[#00E676]" />
                  <span className="text-[#00C853] dark:text-[#00E676]">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#8A7561]" />
                  <span>Share Booking Link</span>
                </>
              )}
            </button>

            <Link
              href={`/u/${currentUser.username || matchingCreator.username || "rohit-pottery"}`}
              target="_blank"
              className="px-3.5 py-2 rounded-sm bg-[#1E2229] text-[#FAF7F2] text-xs font-medium hover:bg-[#2C323D] transition-colors duration-150 flex items-center gap-1.5"
            >
              <span>{isHindi ? "हुनर कार्ड पर देखें" : "View Live Card"}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Studio Mentorship Key Metrics Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 pt-6">
          <div>
            <p className="text-[11px] font-bold text-[#8A7561] uppercase tracking-wider">
              {isHindi ? "कुल परामर्श आय" : "Mentorship Revenue"}
            </p>
            <p className="text-2xl font-serif font-bold text-[#1E2229] mt-0.5">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </p>
            <p className="text-[11px] text-[#00C853] dark:text-[#00E676] font-semibold mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-[#00C853] dark:text-[#00E676]" />
              <span>100% Retained Equity</span>
            </p>
          </div>

          <div>
            <p className="text-[11px] font-bold text-[#8A7561] uppercase tracking-wider">
              {isHindi ? "आगामी सत्र" : "Upcoming Sessions"}
            </p>
            <p className="text-2xl font-serif font-bold text-[#B4461F] mt-0.5">
              {upcomingCount}
            </p>
            <p className="text-[11px] text-[#635C53] mt-0.5">
              {sellerBookings.length} total sessions booked
            </p>
          </div>

          <div>
            <p className="text-[11px] font-bold text-[#8A7561] uppercase tracking-wider">
              {isHindi ? "प्रति सत्र निर्धारित शुल्क" : "Active Rate / Session"}
            </p>
            <p className="text-2xl font-serif font-bold text-[#1E2229] mt-0.5">
              ₹{fee}
            </p>
            <p className="text-[11px] text-[#635C53] mt-0.5">
              {duration} Mins (₹{Math.round((fee / duration) * 60)}/hr equiv.)
            </p>
          </div>

          <div>
            <p className="text-[11px] font-bold text-[#8A7561] uppercase tracking-wider">
              {isHindi ? "प्रस्ताव स्थिति" : "Public Status"}
            </p>
            <div className="mt-1 flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  enabled ? "bg-[#00E676] animate-pulse shadow-[0_0_8px_#00E676]" : "bg-[#8A7561]"
                }`}
              />
              <span className="text-sm font-semibold text-[#1E2229]">
                {enabled
                  ? isHindi
                    ? "सक्रिय • बुकिंग चालू"
                    : "Live on Hunar Card"
                  : isHindi
                  ? "निष्क्रिय (Opted Out)"
                  : "Paused / Inactive"}
              </span>
            </div>
            <p className="text-[11px] text-[#635C53] mt-0.5">
              {enabled ? "Visible on your public lookbook" : "Hidden from profile"}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Form on Left, Live Preview & Bookings on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ========================================================= */}
        {/* CONFIGURATION FORM (8 COLS)                               */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 sm:p-8 rounded-sm bg-white border border-[#E8DEC8] shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8DEC8]">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#1E2229]">
                  {isHindi ? "सत्र सेटिंग्स एवं विषय" : "Mentorship Offering Configuration"}
                </h3>
                <p className="text-xs text-[#635C53]">
                  Configure your 1-on-1 masterclass topic, pricing, and weekly schedule.
                </p>
              </div>

              {/* Master Opt-in / Opt-out Switch */}
              <div className="flex items-center gap-2.5 bg-[#FAF7F2] px-3.5 py-1.5 rounded-sm border border-[#E8DEC8]">
                <span className="text-xs font-semibold text-[#1E2229]">
                  {enabled ? "Accepting Bookings" : "Mentorship Paused"}
                </span>
                <button
                  type="button"
                  onClick={() => setEnabled(!enabled)}
                  className={`w-11 h-6 rounded-full transition-colors duration-200 relative focus:outline-hidden ${
                    enabled ? "bg-[#00E676] shadow-[0_0_8px_rgba(0,230,118,0.5)]" : "bg-[#D5CEBF]"
                  }`}
                  aria-label="Toggle mentorship availability"
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform duration-200 shadow-sm absolute top-1 ${
                      enabled ? "right-1" : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Session Title & Quick Suggestions */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#1E2229] uppercase tracking-wider">
                {isHindi ? "सत्र का मुख्य शीर्षक / विषय" : "Masterclass Title / Primary Topic"}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Khurja Terracotta Glazing & Kiln Setup"
                className="w-full px-3.5 py-2.5 rounded-sm border border-[#E8DEC8] text-sm text-[#1E2229] focus:outline-hidden focus:border-[#B4461F] transition-colors duration-150 font-medium"
              />
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[11px] text-[#8A7561] font-semibold">Quick ideas:</span>
                {suggestedTitles.slice(0, 3).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setTitle(item)}
                    className="text-[10px] px-2 py-0.5 rounded-xs bg-[#FAF7F2] text-[#635C53] hover:text-[#B4461F] hover:border-[#B4461F] border border-[#E8DEC8] transition-colors duration-150"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration & Fee Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              {/* Duration Presets */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#1E2229] uppercase tracking-wider">
                  {isHindi ? "सत्र अवधि (मिनट)" : "Session Duration"}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[30, 45, 60].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setDuration(mins)}
                      className={`py-2 px-3 rounded-sm text-xs font-semibold border transition-all duration-150 flex flex-col items-center gap-0.5 ${
                        duration === mins
                          ? "bg-[#1E2229] text-white border-[#1E2229]"
                          : "bg-white text-[#635C53] border-[#E8DEC8] hover:border-[#B4461F]"
                      }`}
                    >
                      <span>{mins} Mins</span>
                      <span className="text-[9px] opacity-75 font-normal">
                        {mins === 30 ? "Quick Review" : mins === 45 ? "Standard" : "Deep Dive"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Session Fee (INR ₹) */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#1E2229] uppercase tracking-wider">
                  {isHindi ? "सत्र शुल्क (₹ INR)" : "Session Fee (INR ₹)"}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-sm font-semibold text-[#8A7561]">
                    ₹
                  </span>
                  <input
                    type="number"
                    min={100}
                    step={50}
                    value={fee}
                    onChange={(e) => setFee(Number(e.target.value))}
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-sm border border-[#E8DEC8] text-sm text-[#1E2229] font-bold focus:outline-hidden focus:border-[#B4461F] transition-colors duration-150"
                  />
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[499, 899, 1299, 1499].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setFee(preset)}
                      className={`text-[10px] px-2 py-0.5 rounded-xs border transition-colors duration-150 ${
                        fee === preset
                          ? "bg-[#FAF0E6] text-[#B4461F] border-[#F3CFBF] font-semibold"
                          : "bg-white text-[#635C53] border-[#E8DEC8]"
                      }`}
                    >
                      ₹{preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Available Days & Time Windows */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-[#1E2229] uppercase tracking-wider">
                {isHindi ? "उपलब्ध दिन एवं समय विंडो" : "Available Days & Time Windows"}
              </label>
              <input
                type="text"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                placeholder="e.g., Saturdays & Sundays, 4 PM – 7 PM"
                className="w-full px-3.5 py-2.5 rounded-sm border border-[#E8DEC8] text-sm text-[#1E2229] focus:outline-hidden focus:border-[#B4461F] transition-colors duration-150"
              />
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  "Saturdays & Sundays, 4 PM – 7 PM",
                  "Tuesdays & Thursdays, 6 PM – 8 PM",
                  "Daily, 5 PM – 7 PM"
                ].map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setAvailability(slot)}
                    className="text-[10px] px-2 py-0.5 rounded-xs bg-[#FAF7F2] text-[#635C53] hover:text-[#B4461F] border border-[#E8DEC8] transition-colors duration-150"
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* What You'll Learn / Agenda Breakdown */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-[#1E2229] uppercase tracking-wider">
                  {isHindi ? "सत्र का एजेंडा (आप क्या सीखेंगे)" : "Session Agenda / What You'll Learn"}
                </label>
                <span className="text-[11px] text-[#8A7561]">{agenda.length} focus topics</span>
              </div>

              <div className="space-y-2">
                {agenda.map((topic, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-sm bg-[#FAF7F2] border border-[#E8DEC8]"
                  >
                    <div className="flex items-start gap-2.5 flex-1">
                      <span className="w-5 h-5 rounded-xs bg-white text-[#B4461F] border border-[#E8DEC8] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-xs text-[#1E2229] leading-snug">{topic}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAgendaTopic(index)}
                      className="text-[#8A7561] hover:text-[#B4461F] transition-colors duration-150 p-1"
                      title="Remove topic"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Topic Input */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={newTopicInput}
                  onChange={(e) => setNewTopicInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddAgendaTopic()}
                  placeholder="Add another agenda topic or specific technique..."
                  className="flex-1 px-3.5 py-2 rounded-sm border border-[#E8DEC8] text-xs text-[#1E2229] focus:outline-hidden focus:border-[#B4461F]"
                />
                <button
                  type="button"
                  onClick={() => handleAddAgendaTopic()}
                  className="px-3 py-2 rounded-sm bg-[#FAF7F2] border border-[#E8DEC8] text-xs font-semibold text-[#1E2229] hover:bg-white hover:border-[#B4461F] transition-colors duration-150 flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5 text-[#B4461F]" />
                  <span>Add Topic</span>
                </button>
              </div>
            </div>

            {/* Save Action Strip */}
            <div className="pt-4 border-t border-[#E8DEC8] flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-[#635C53]">
                <ShieldCheck className="w-4 h-4 text-[#00C853] dark:text-[#00E676]" />
                <span>Instant update across all Hunar profile lookbooks</span>
              </div>

              <button
                type="button"
                onClick={handleSaveOffering}
                className="btn-terracotta px-6 py-2.5 rounded-sm text-xs font-semibold flex items-center gap-2 transition-colors duration-150 shadow-sm"
              >
                <Check className="w-4 h-4" />
                <span>{isHindi ? "परामर्श सेटिंग्स सहेजें" : "Save Mentorship Settings"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* PUBLIC PREVIEW CARD (5 COLS)                             */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-sm bg-[#FAF7F2] border border-[#E8DEC8] shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DEC8]">
              <span className="text-[10px] font-bold text-[#8A7561] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#B4461F]" />
                <span>Public Hunar Card Preview</span>
              </span>
              <span className="px-2 py-0.5 rounded-xs text-[10px] font-semibold bg-[#00E676]/15 text-[#00C853] dark:text-[#00E676] border border-[#00E676]/40">
                Patron View
              </span>
            </div>

            {/* Simulated Public Card Component */}
            <div className="p-5 rounded-sm bg-white border border-[#E8DEC8] shadow-sm space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="px-2 py-0.5 rounded-xs text-[10px] font-semibold uppercase tracking-wider bg-[#FAF0E6] text-[#B4461F] border border-[#F3CFBF]">
                    1-on-1 Masterclass
                  </span>
                  <h4 className="font-serif font-bold text-base text-[#1E2229] mt-1.5 leading-snug">
                    {title || "Craft Mentorship Session"}
                  </h4>
                  <p className="text-xs text-[#635C53] mt-0.5">
                    with {currentUser.name} ({duration} Mins via Video Call)
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-lg font-serif font-bold text-[#1E2229]">
                    ₹{fee.toLocaleString("en-IN")}
                  </span>
                  <p className="text-[10px] text-[#00C853] dark:text-[#00E676] font-semibold">100% to Master</p>
                </div>
              </div>

              <div className="p-2.5 rounded-xs bg-[#FAF7F2] border border-[#E8DEC8] text-xs text-[#635C53] flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#B4461F] shrink-0" />
                <span>{availability}</span>
              </div>

              <div className="space-y-1.5">
                <p className="text-[11px] font-bold text-[#8A7561] uppercase tracking-wider">
                  Session Focus Topics:
                </p>
                <ul className="space-y-1">
                  {agenda.slice(0, 3).map((item, idx) => (
                    <li key={idx} className="text-xs text-[#1E2229] flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B4461F] mt-1.5 shrink-0" />
                      <span className="line-clamp-1">{item}</span>
                    </li>
                  ))}
                  {agenda.length > 3 && (
                    <li className="text-[11px] text-[#8A7561] italic pl-3.5">
                      + {agenda.length - 3} more topics covered
                    </li>
                  )}
                </ul>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  disabled
                  className="w-full py-2.5 rounded-sm bg-[#1E2229] text-white text-xs font-semibold flex items-center justify-center gap-2 opacity-90 cursor-default"
                >
                  <Video className="w-3.5 h-3.5 text-[#E5A93B]" />
                  <span>Book 1-on-1 Guidance (₹{fee})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SELLER MENTORSHIP BOOKINGS VIEW                           */}
      {/* ========================================================= */}
      <div className="space-y-6">
        <div className="rounded-sm bg-white border border-[#E8DEC8] shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
          {/* Header & Filter Bar */}
          <div className="p-6 border-b border-[#E8DEC8] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#1E2229]">
                {isHindi ? "प्राप्त परामर्श बुकिंग्स" : "Incoming Paid Mentorship Bookings"}
              </h3>
              <p className="text-xs text-[#635C53] mt-0.5">
                Confirmed 1-on-1 video sessions with learners, payment confirmations, and Google Meet channels.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {(["ALL", "CONFIRMED", "COMPLETED"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setBookingFilter(filter)}
                  className={`px-3 py-1.5 rounded-sm text-xs font-medium transition-colors duration-150 ${
                    bookingFilter === filter
                      ? "bg-[#1E2229] text-white"
                      : "bg-[#FAF7F2] text-[#635C53] hover:text-[#1E2229] border border-[#E8DEC8]"
                  }`}
                >
                  {filter === "ALL"
                    ? `All (${sellerBookings.length})`
                    : filter === "CONFIRMED"
                    ? `Confirmed (${upcomingCount})`
                    : `Completed (${sellerBookings.filter((b) => b.status === "COMPLETED").length})`}
                </button>
              ))}
            </div>
          </div>

          {/* Bookings List */}
          {filteredBookings.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#E8DEC8] flex items-center justify-center mx-auto text-[#8A7561]">
                <Calendar className="w-6 h-6" />
              </div>
              <p className="font-serif font-bold text-base text-[#1E2229]">
                {isHindi ? "कोई बुकिंग नहीं मिली" : "No mentorship bookings in this view"}
              </p>
              <p className="text-xs text-[#635C53] max-w-sm mx-auto">
                When patrons and aspiring artisans book 1-on-1 consultations from your Hunar Card, they will appear here with instant Google Meet and WhatsApp links.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#E8DEC8]">
              {filteredBookings.map((booking) => {
                const isConfirmed = booking.status === "CONFIRMED";
                const isCompleted = booking.status === "COMPLETED";

                return (
                  <div
                    key={booking.id}
                    className="p-6 hover:bg-[#FAF7F2]/60 transition-colors duration-150 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                  >
                    {/* Learner & Session Details */}
                    <div className="space-y-3 max-w-2xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-sm bg-[#1E2229] text-white font-serif font-bold text-sm flex items-center justify-center shrink-0">
                          {booking.learnerName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-serif font-bold text-base text-[#1E2229]">
                              {booking.learnerName}
                            </h4>
                            <span
                              className={`px-2.5 py-1 rounded-sm text-[10px] font-semibold uppercase tracking-wider ${
                                isConfirmed
                                  ? "bg-[#00E676]/15 text-[#00C853] dark:text-[#00E676] border border-[#00E676]/40"
                                  : isCompleted
                                  ? "bg-[#FAF7F2] text-[#635C53] border border-[#E8DEC8]"
                                  : "bg-[#B4461F] text-white"
                              }`}
                            >
                              {booking.status} • ₹{booking.feePaid} Paid
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-[#635C53] mt-0.5">
                            <span className="flex items-center gap-1 font-mono">
                              <Phone className="w-3 h-3 text-[#8A7561]" />
                              {booking.learnerPhone}
                            </span>
                            {booking.learnerEmail && (
                              <span className="flex items-center gap-1 font-mono">
                                <Mail className="w-3 h-3 text-[#8A7561]" />
                                {booking.learnerEmail}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Topic & Slot */}
                      <div className="p-3.5 rounded-sm bg-[#FAF7F2] border border-[#E8DEC8] space-y-1.5">
                        <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                          <span className="font-semibold text-[#1E2229] flex items-center gap-1.5">
                            <Video className="w-3.5 h-3.5 text-[#B4461F]" />
                            <span>{booking.topic}</span>
                          </span>
                          <span className="px-2 py-0.5 rounded-xs bg-white text-[#1E2229] border border-[#E8DEC8] font-mono text-[11px] font-medium flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-[#8A7561]" />
                            <span>{booking.scheduledDate} at {booking.scheduledTime}</span>
                            <span>({booking.duration} Mins)</span>
                          </span>
                        </div>

                        {booking.learnerQuery && (
                          <p className="text-xs text-[#635C53] italic pl-5 border-l-2 border-[#B4461F]">
                            &ldquo;{booking.learnerQuery}&rdquo;
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap lg:flex-col items-stretch sm:items-end gap-2.5 shrink-0">
                      {booking.meetingLink && (
                        <a
                          href={booking.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-sm bg-[#00C853] hover:bg-[#00E676] text-[#121417] text-xs font-bold transition-colors duration-150 flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(0,230,118,0.25)]"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Join Video Meeting</span>
                          <ExternalLink className="w-3 h-3 opacity-75" />
                        </a>
                      )}

                      <a
                        href={`https://wa.me/${booking.learnerPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                          `Namaste ${booking.learnerName}, Rohit Sharma here from Hunar. Regarding our upcoming mentorship session on "${booking.topic}" scheduled for ${booking.scheduledDate} at ${booking.scheduledTime}.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-sm bg-[#00E676]/10 border border-[#00E676]/40 text-[#00C853] dark:text-[#00E676] text-xs font-semibold hover:bg-[#00E676]/20 transition-colors duration-150 flex items-center justify-center gap-1.5"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp Learner</span>
                      </a>

                      {isConfirmed && (
                        <button
                          type="button"
                          onClick={() => updateMentorshipBookingStatus(booking.id, "COMPLETED")}
                          className="px-3 py-1.5 rounded-sm bg-[#FAF7F2] text-[#635C53] hover:text-[#1E2229] border border-[#E8DEC8] text-xs font-medium transition-colors duration-150 flex items-center justify-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#00C853] dark:text-[#00E676]" />
                          <span>Mark as Completed</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
