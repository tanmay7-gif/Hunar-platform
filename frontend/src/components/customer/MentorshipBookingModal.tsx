"use client";

import React, { useState } from "react";
import { Creator, MentorshipBooking } from "@/types";
import { useHunar } from "@/context/HunarContext";
import confetti from "canvas-confetti";
import {
  X,
  Video,
  Calendar,
  Clock,
  ShieldCheck,
  CreditCard,
  QrCode,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Award
} from "lucide-react";

interface MentorshipBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  creator: Creator;
  isHindi?: boolean;
}

export function MentorshipBookingModal({
  isOpen,
  onClose,
  creator,
  isHindi = false
}: MentorshipBookingModalProps) {
  const { currentUser, bookMentorship, showToast } = useHunar();

  // Step state: "SCHEDULE" | "CHECKOUT" | "SUCCESS"
  const [step, setStep] = useState<"SCHEDULE" | "CHECKOUT" | "SUCCESS">("SCHEDULE");

  // Date and slot selection
  const sessionFee = creator.mentorshipFee || 899;
  const sessionDuration = creator.mentorshipDuration || 45;
  const sessionTitle =
    creator.mentorshipTitle || `${creator.primaryArtForm} Technique & 1-on-1 Masterclass`;
  const sessionAgenda = creator.mentorshipTopics || [
    "Raw material sourcing & mineral pigment prep",
    "Traditional craftsmanship techniques & tool maintenance",
    "Commercial commission pricing & scaling client inquiries"
  ];

  const dateOptions = [
    { label: "Tomorrow", dateStr: "Wednesday, Oct 21", iso: "2026-10-21" },
    { label: "Thursday", dateStr: "Thursday, Oct 22", iso: "2026-10-22" },
    { label: "Friday", dateStr: "Friday, Oct 23", iso: "2026-10-23" },
    { label: "Saturday", dateStr: "Saturday, Oct 24", iso: "2026-10-24" },
    { label: "Sunday", dateStr: "Sunday, Oct 25", iso: "2026-10-25" }
  ];

  const timeOptions = ["04:00 PM", "04:45 PM", "05:30 PM", "06:15 PM"];

  const [selectedDateObj, setSelectedDateObj] = useState(dateOptions[0]);
  const [selectedTime, setSelectedTime] = useState(timeOptions[1]);

  // Learner form inputs
  const [learnerName, setLearnerName] = useState(currentUser.name || "");
  const [learnerPhone, setLearnerPhone] = useState(currentUser.phone || "+91 98711 44220");
  const [learnerEmail, setLearnerEmail] = useState(currentUser.email || "patron@hunar.in");
  const [learnerQuery, setLearnerQuery] = useState("");

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "CARD">("UPI");
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<MentorshipBooking | null>(null);
  const [copiedMeetLink, setCopiedMeetLink] = useState(false);

  if (!isOpen) return null;

  const handleProceedToCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!learnerName.trim() || !learnerPhone.trim()) {
      showToast("Missing Details", "Please provide your name and WhatsApp phone number.", "info");
      return;
    }
    setStep("CHECKOUT");
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);

      // Book session in global store
      const booking = bookMentorship({
        mentorId: creator.id,
        mentorName: creator.name,
        mentorAvatar: creator.avatarUrl,
        learnerId: currentUser.id,
        learnerName: learnerName.trim(),
        learnerPhone: learnerPhone.trim(),
        learnerEmail: learnerEmail.trim(),
        topic: sessionTitle,
        learnerQuery: learnerQuery.trim(),
        scheduledDate: selectedDateObj.dateStr,
        scheduledTime: selectedTime,
        scheduledAt: `${selectedDateObj.iso}T${selectedTime.includes("PM") ? "12:00:00" : "06:00:00"}.000Z`,
        duration: sessionDuration,
        feePaid: sessionFee
      });

      setCreatedBooking(booking);
      setStep("SUCCESS");

      // Trigger celebratory craft confetti
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#B4461F", "#2D583B", "#1E2229", "#E5A93B"]
        });
      } catch {
        // ignore if not supported
      }
    }, 1200);
  };

  const handleCopyMeet = () => {
    if (createdBooking?.meetingLink) {
      navigator.clipboard.writeText(createdBooking.meetingLink);
      setCopiedMeetLink(true);
      setTimeout(() => setCopiedMeetLink(false), 2500);
    }
  };

  // Google Calendar URL generation
  const calendarUrl = createdBooking
    ? `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        `Hunar Mentorship: ${createdBooking.topic} with ${creator.name}`
      )}&details=${encodeURIComponent(
        `1-on-1 Craft Mentorship Session on Hunar Platform.\nMentor: ${creator.name}\nLearner: ${createdBooking.learnerName}\nGoogle Meet Link: ${createdBooking.meetingLink}\nTopic: ${createdBooking.topic}\nLearner Notes: ${createdBooking.learnerQuery || "N/A"}`
      )}&location=${encodeURIComponent(createdBooking.meetingLink || "Google Meet")}`
    : "#";

  // Pre-filled WhatsApp preview URL
  const whatsappPreviewUrl = createdBooking
    ? `https://wa.me/${creator.whatsapp}?text=${encodeURIComponent(
        `Namaste ${creator.name}! I have booked and paid for a 1-on-1 Hunar Mentorship session on "${createdBooking.topic}" for ${createdBooking.scheduledDate} at ${createdBooking.scheduledTime}. Looking forward to our session! Google Meet link: ${createdBooking.meetingLink}`
      )}`
    : "#";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 overflow-y-auto">
      <div className="bg-white rounded-sm max-w-2xl w-full border border-[#E8DEC8] shadow-2xl relative my-8 overflow-hidden">
        {/* Modal Artisanal Header */}
        <div className="p-6 bg-[#1E2229] text-[#FAF7F2] border-b border-[#2C323D] flex items-start justify-between">
          <div className="flex items-start gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={creator.avatarUrl}
              alt={creator.name}
              className="w-14 h-14 rounded-sm object-cover aspect-square border border-[#3E4756] shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-xs text-[10px] font-semibold uppercase tracking-wider bg-[#2D583B] text-white">
                  1-on-1 Paid Masterclass
                </span>
                <span className="text-xs text-[#E5A93B] font-mono">
                  {creator.experienceLevel}
                </span>
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#FAF7F2]">
                {creator.name}
              </h3>
              <p className="text-xs text-[#FAF7F2]/80 mt-0.5">
                {isHindi ? creator.artFormHindi : creator.primaryArtForm} • {creator.city}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xs text-[#FAF7F2]/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ========================================================= */}
        {/* STEP 1: SCHEDULE & LEARNER DETAILS                        */}
        {/* ========================================================= */}
        {step === "SCHEDULE" && (
          <form onSubmit={handleProceedToCheckout} className="p-6 sm:p-8 space-y-6">
            {/* Session Outline & Fee Strip */}
            <div className="p-4 rounded-sm bg-[#FAF7F2] border border-[#E8DEC8] space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold text-[#8A7561] uppercase tracking-wider">
                    Session Focus
                  </span>
                  <h4 className="font-serif font-bold text-sm text-[#1E2229] mt-0.5">
                    {sessionTitle}
                  </h4>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xl font-serif font-bold text-[#1E2229]">
                    ₹{sessionFee.toLocaleString("en-IN")}
                  </span>
                  <p className="text-[10px] text-[#2D583B] font-bold">100% Direct to Artisan</p>
                </div>
              </div>

              {/* Agenda Bullets */}
              <div className="space-y-1 pt-1 border-t border-[#E8DEC8]">
                <p className="text-[11px] font-bold text-[#8A7561] uppercase tracking-wider">
                  What you will learn during this {sessionDuration}-minute consultation:
                </p>
                <ul className="space-y-1">
                  {sessionAgenda.slice(0, 3).map((item, idx) => (
                    <li key={idx} className="text-xs text-[#1E2229] flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B4461F] mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Slot Picker: Select Date & Time */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1E2229] uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>1. Choose Session Date</span>
                  <span className="text-[11px] text-[#635C53] font-normal">
                    {creator.mentorshipAvailability || "Saturdays & Sundays, 4 PM – 7 PM"}
                  </span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {dateOptions.map((opt) => (
                    <button
                      key={opt.iso}
                      type="button"
                      onClick={() => setSelectedDateObj(opt)}
                      className={`p-2.5 rounded-sm text-left border transition-all duration-150 flex flex-col justify-between ${
                        selectedDateObj.iso === opt.iso
                          ? "bg-[#1E2229] text-white border-[#1E2229]"
                          : "bg-white text-[#1E2229] border-[#E8DEC8] hover:border-[#B4461F]"
                      }`}
                    >
                      <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">
                        {opt.label}
                      </span>
                      <span className="text-xs font-semibold mt-1">
                        {opt.dateStr.split(",")[1]?.trim() || opt.dateStr}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E2229] uppercase tracking-wider mb-2">
                  2. Choose Time Slot ({sessionDuration} Mins via Video Call)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {timeOptions.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`py-2 px-3 rounded-sm text-xs font-medium border text-center transition-colors duration-150 flex items-center justify-center gap-1.5 ${
                        selectedTime === time
                          ? "bg-[#2D583B] text-white border-[#2D583B] font-semibold"
                          : "bg-white text-[#635C53] border-[#E8DEC8] hover:border-[#2D583B]"
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>{time}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Learner Info & Specific Question */}
            <div className="space-y-4 pt-2 border-t border-[#E8DEC8]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1E2229] mb-1">
                    Your Full Name: <span className="text-[#B4461F]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={learnerName}
                    onChange={(e) => setLearnerName(e.target.value)}
                    placeholder="e.g. Priya Nair"
                    className="w-full px-3.5 py-2 rounded-sm border border-[#E8DEC8] text-xs text-[#1E2229] focus:outline-hidden focus:border-[#B4461F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E2229] mb-1">
                    WhatsApp Phone Number: <span className="text-[#B4461F]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={learnerPhone}
                    onChange={(e) => setLearnerPhone(e.target.value)}
                    placeholder="+91 98711 44220"
                    className="w-full px-3.5 py-2 rounded-sm border border-[#E8DEC8] text-xs text-[#1E2229] focus:outline-hidden focus:border-[#B4461F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E2229] mb-1">
                  Email Address (for calendar invitation & session link):
                </label>
                <input
                  type="email"
                  value={learnerEmail}
                  onChange={(e) => setLearnerEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full px-3.5 py-2 rounded-sm border border-[#E8DEC8] text-xs text-[#1E2229] focus:outline-hidden focus:border-[#B4461F]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E2229] mb-1">
                  What specific question or craft technique do you want help with?
                </label>
                <textarea
                  rows={2}
                  value={learnerQuery}
                  onChange={(e) => setLearnerQuery(e.target.value)}
                  placeholder="e.g. I am building a small terracotta studio and want to understand natural pigment binders and wood kiln firings..."
                  className="w-full px-3.5 py-2 rounded-sm border border-[#E8DEC8] text-xs text-[#1E2229] focus:outline-hidden focus:border-[#B4461F]"
                />
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="pt-4 border-t border-[#E8DEC8] flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-sm text-xs font-medium text-[#635C53] hover:text-[#1E2229]"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn-terracotta px-6 py-2.5 rounded-sm text-xs font-semibold flex items-center gap-2 transition-colors duration-150"
              >
                <span>Continue to Checkout (₹{sessionFee})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* ========================================================= */}
        {/* STEP 2: PAID CHECKOUT SIMULATION                          */}
        {/* ========================================================= */}
        {step === "CHECKOUT" && (
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <p className="text-xs font-bold text-[#8A7561] uppercase tracking-wider">
                Step 2 of 2: Confirm & Pay
              </p>
              <h4 className="font-serif text-xl font-bold text-[#1E2229] mt-0.5">
                Paid Mentorship Checkout
              </h4>
            </div>

            {/* Itemized Fee Breakdown */}
            <div className="p-5 rounded-sm bg-[#FAF7F2] border border-[#E8DEC8] space-y-3">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-[#E8DEC8]">
                <span className="text-[#635C53]">Selected Master:</span>
                <span className="font-semibold text-[#1E2229]">{creator.name}</span>
              </div>

              <div className="flex items-center justify-between text-xs pb-2 border-b border-[#E8DEC8]">
                <span className="text-[#635C53]">Slot Reserved:</span>
                <span className="font-semibold text-[#1E2229]">
                  {selectedDateObj.dateStr} at {selectedTime} ({sessionDuration} Mins)
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pb-2 border-b border-[#E8DEC8]">
                <span className="text-[#635C53]">1-on-1 Consultation Fee:</span>
                <span className="font-mono font-semibold text-[#1E2229]">
                  ₹{sessionFee.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pb-2 border-b border-[#E8DEC8]">
                <span className="text-[#2D583B] flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Hunar Platform Support Fee:</span>
                </span>
                <span className="font-mono font-semibold text-[#2D583B]">₹0 (100% Artisan Direct)</span>
              </div>

              <div className="flex items-center justify-between text-sm pt-2">
                <span className="font-bold text-[#1E2229]">Total Payable:</span>
                <span className="font-serif text-xl font-bold text-[#B4461F]">
                  ₹{sessionFee.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-[#1E2229] uppercase tracking-wider">
                Select Instant Payment Method:
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("UPI")}
                  className={`p-3.5 rounded-sm border text-left transition-colors duration-150 flex items-center gap-3 ${
                    paymentMethod === "UPI"
                      ? "bg-[#FAF7F2] border-[#B4461F] text-[#1E2229]"
                      : "bg-white border-[#E8DEC8] text-[#635C53]"
                  }`}
                >
                  <QrCode className="w-5 h-5 text-[#B4461F] shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-[#1E2229]">UPI Instant</p>
                    <p className="text-[10px] text-[#635C53]">GPay, PhonePe, Paytm, BHIM</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("CARD")}
                  className={`p-3.5 rounded-sm border text-left transition-colors duration-150 flex items-center gap-3 ${
                    paymentMethod === "CARD"
                      ? "bg-[#FAF7F2] border-[#B4461F] text-[#1E2229]"
                      : "bg-white border-[#E8DEC8] text-[#635C53]"
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-[#2D583B] shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-[#1E2229]">Card / NetBanking</p>
                    <p className="text-[10px] text-[#635C53]">Debit, Credit & RuPay</p>
                  </div>
                </button>
              </div>

              <div className="p-3 rounded-xs bg-[#EEF4F0] border border-[#C5DCCB] text-[11px] text-[#2D583B] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>
                  Mock simulated checkout for Hunar development. No actual bank charge will occur.
                </span>
              </div>
            </div>

            {/* Navigation Actions */}
            <div className="pt-4 border-t border-[#E8DEC8] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep("SCHEDULE")}
                className="px-4 py-2 rounded-sm text-xs font-medium text-[#635C53] hover:text-[#1E2229]"
              >
                Back to Slot Picker
              </button>

              <button
                type="button"
                disabled={isProcessing}
                onClick={handleConfirmPayment}
                className="btn-terracotta px-7 py-2.5 rounded-sm text-xs font-semibold flex items-center gap-2 transition-all duration-150 shadow-sm"
              >
                {isProcessing ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm & Pay ₹{sessionFee}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 3: SUCCESS & CALENDAR / WHATSAPP INTEGRATION         */}
        {/* ========================================================= */}
        {step === "SUCCESS" && createdBooking && (
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-[#EEF4F0] border-2 border-[#2D583B] flex items-center justify-center mx-auto text-[#2D583B]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="px-2.5 py-0.5 rounded-xs text-[10px] font-bold uppercase tracking-wider bg-[#2D583B] text-white">
                Payment Confirmed • ₹{createdBooking.feePaid} Paid
              </span>
              <h4 className="font-serif text-2xl font-bold text-[#1E2229] mt-2">
                Mentorship Session Confirmed!
              </h4>
              <p className="text-xs text-[#635C53] mt-1 max-w-md mx-auto">
                Your 1-on-1 session with <strong className="text-[#1E2229]">{creator.name}</strong> has been booked and registered on the Hunar platform.
              </p>
            </div>

            {/* Confirmed Details Strip */}
            <div className="p-4 rounded-sm bg-[#FAF7F2] border border-[#E8DEC8] text-left space-y-2 text-xs">
              <div className="flex items-center justify-between pb-1.5 border-b border-[#E8DEC8]">
                <span className="text-[#8A7561] font-semibold">Topic:</span>
                <span className="font-bold text-[#1E2229]">{createdBooking.topic}</span>
              </div>
              <div className="flex items-center justify-between pb-1.5 border-b border-[#E8DEC8]">
                <span className="text-[#8A7561] font-semibold">Scheduled Window:</span>
                <span className="font-bold text-[#2D583B]">
                  {createdBooking.scheduledDate} at {createdBooking.scheduledTime} ({createdBooking.duration} Mins)
                </span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[#8A7561] font-semibold">Google Meet Channel:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[#1E2229] text-[11px] underline">
                    {createdBooking.meetingLink}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyMeet}
                    className="p-1 rounded-xs hover:bg-white text-[#8A7561] hover:text-[#1E2229]"
                    title="Copy Google Meet link"
                  >
                    {copiedMeetLink ? (
                      <Check className="w-3.5 h-3.5 text-[#2D583B]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Direct Links Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <a
                href={calendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-sm bg-[#1E2229] text-white text-xs font-semibold hover:bg-[#2C323D] transition-colors duration-150 flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4 text-[#E5A93B]" />
                <span>Add to Google Calendar</span>
                <ExternalLink className="w-3 h-3 opacity-75" />
              </a>

              <a
                href={whatsappPreviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-sm bg-[#2D583B] text-white text-xs font-semibold hover:bg-[#23452E] transition-colors duration-150 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Open WhatsApp Preview</span>
                <ExternalLink className="w-3 h-3 opacity-75" />
              </a>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 rounded-sm bg-[#FAF7F2] text-[#635C53] hover:text-[#1E2229] border border-[#E8DEC8] text-xs font-medium transition-colors"
              >
                Done / Back to Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
