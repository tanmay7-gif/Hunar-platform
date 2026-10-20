"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useHunar } from "@/context/HunarContext";
import {
  Store,
  Heart,
  Mail,
  Lock,
  User,
  MapPin,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { language, register, currentUser, showToast } = useHunar();
  const isHindi = language === "hi";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"SELLER" | "CUSTOMER">("SELLER");
  const [city, setCity] = useState("Delhi NCR");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const popularCities = [
    "Delhi NCR",
    "Khurja",
    "Jaipur",
    "Madhubani",
    "Udaipur",
    "Kolkata",
    "Varanasi",
    "Mumbai",
    "Bengaluru"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!name.trim()) {
      setErrorMessage(isHindi ? "कृपया अपना पूरा नाम दर्ज करें।" : "Please enter your full name.");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setErrorMessage(isHindi ? "कृपया एक मान्य ईमेल पता दर्ज करें।" : "Please enter a valid email address.");
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage(
        isHindi
          ? "पासवर्ड कम से कम ६ अक्षरों का होना चाहिए।"
          : "Password must be at least 6 characters long."
      );
      return;
    }

    setLoading(true);
    const result = await register({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role,
      city: city.trim() || "Delhi NCR"
    });
    setLoading(false);

    if (result.success && result.user) {
      if (result.user.role === "SELLER" && !result.user.onboardingCompleted) {
        router.push("/onboarding");
      } else if (result.user.role === "SELLER") {
        router.push("/dashboard/seller");
      } else {
        router.push("/dashboard/customer");
      }
    } else {
      setErrorMessage(
        result.error ||
          (isHindi
            ? "खाता बनाने में त्रुटि हुई। कृपया दोबारा प्रयास करें।"
            : "Failed to create account. Please check your details.")
      );
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header Tagline & Brand */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-3 mb-5 focus:outline-none focus:ring-2 focus:ring-[#C85A32] focus:ring-offset-2 rounded-sm group"
          >
            <div className="relative h-12 w-12 flex-shrink-0">
              <Image
                alt="Hunar logo showing hand-held paintbrush shaping the letter H"
                className="object-contain"
                fill
                priority
                src="/assets/logo-compact.png"
              />
            </div>
            <div className="flex flex-col text-left select-none">
              <span className="font-serif text-2xl font-bold tracking-tight text-[#C85A32]">
                Hunar
              </span>
              <span className="text-[10px] font-medium tracking-wide uppercase text-[#635C53] -mt-0.5">
                A home for art. By Flytech
              </span>
            </div>
          </Link>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#8A7561] mb-2">
            {isHindi ? "नया खाता पंजीकरण" : "Grassroots Artisans & Patrons Guild"}
          </p>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1E2229]">
            {isHindi ? "हुनर मंच से जुड़ें" : "Join the Hunar Community"}
          </h1>
          <p className="text-xs sm:text-sm text-[#635C53] mt-2">
            {isHindi
              ? "सीधे कारीगर स्टूडियो शुरू करें या क्षेत्रीय कला संरक्षक के रूप में विशिष्ट शिल्पों की खोज करें।"
              : "Create your personal profile to manage your craft studio or commission authentic artworks directly."}
          </p>
        </div>

        {/* Signup Form Container */}
        <div className="rounded-sm bg-white border border-[#E8E2D7] p-6 sm:p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          {/* Role Selection Tabs */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-[#1A1816] mb-2">
              {isHindi ? "आप हुनर से किस रूप में जुड़ना चाहते हैं? *" : "Select Your Role on Hunar *"}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* ARTISAN / SELLER CARD */}
              <div
                onClick={() => setRole("SELLER")}
                className={`p-4 rounded-sm border cursor-pointer transition-colors duration-150 relative ${
                  role === "SELLER"
                    ? "border-[#B4461F] bg-[#FAF7F2] ring-1 ring-[#B4461F]"
                    : "border-[#E8E2D7] bg-white hover:border-[#B4461F]/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      role === "SELLER" ? "bg-[#B4461F] text-white" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-serif font-bold text-sm text-[#1E2229]">
                        {isHindi ? "कारीगर / शिल्पी (Seller)" : "Artisan / Creator (Seller)"}
                      </span>
                      {role === "SELLER" && <CheckCircle2 className="w-3.5 h-3.5 text-[#B4461F]" />}
                    </div>
                    <p className="text-[11px] text-[#635C53] mt-0.5 leading-snug">
                      {isHindi
                        ? "स्टूडियो इन्वेंटरी प्रबंधित करें, ०% कमीशन और सीधे WhatsApp ग्राहक लीड प्राप्त करें।"
                        : "Manage workshop listings, receive direct WhatsApp inquiries, 0% platform cuts."}
                    </p>
                  </div>
                </div>
              </div>

              {/* CUSTOMER / PATRON CARD */}
              <div
                onClick={() => setRole("CUSTOMER")}
                className={`p-4 rounded-sm border cursor-pointer transition-colors duration-150 relative ${
                  role === "CUSTOMER"
                    ? "border-[#2D583B] bg-[#EEF4F0] ring-1 ring-[#2D583B]"
                    : "border-[#E8E2D7] bg-white hover:border-[#2D583B]/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      role === "CUSTOMER" ? "bg-[#2D583B] text-white" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <Heart className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-serif font-bold text-sm text-[#1E2229]">
                        {isHindi ? "कला संरक्षक (Customer)" : "Patron / Collector (Customer)"}
                      </span>
                      {role === "CUSTOMER" && <CheckCircle2 className="w-3.5 h-3.5 text-[#2D583B]" />}
                    </div>
                    <p className="text-[11px] text-[#635C53] mt-0.5 leading-snug">
                      {isHindi
                        ? "हस्तनिर्मित शिल्प खोजें, कस्टम म्यूरल व सेरेमिक्स का ऑर्डर दें और कारीगरों से सीधे जुड़ें।"
                        : "Discover folk artworks, commission custom murals & pottery, 100% creator equity."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Inline Error Banner */}
            {errorMessage && (
              <div className="p-3.5 rounded-sm bg-[#FFF5F5] border border-[#FCA5A5] text-[#991B1B] text-xs flex items-start gap-2.5 shadow-xs">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#DC2626] mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-xs">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Name Field */}
            <div>
              <label className="block text-xs font-medium text-[#1A1816] mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#8A7561]" />
                <span>{isHindi ? "पूरा नाम: *" : "Full Name: *"}</span>
              </label>
              <input
                type="text"
                required
                placeholder={role === "SELLER" ? "e.g. Ramesh Kumar Prajapati" : "e.g. Neha Sengupta"}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errorMessage) setErrorMessage("");
                }}
                className="w-full px-4 py-2.5 rounded-sm bg-[#FDFCF9] border border-[#D3CBBE] text-sm text-[#1A1816] focus:outline-none focus:border-[#1E2229]"
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-medium text-[#1A1816] mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#8A7561]" />
                <span>{isHindi ? "ईमेल पता: *" : "Email Address: *"}</span>
              </label>
              <input
                type="email"
                required
                placeholder="your.name@domain.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMessage) setErrorMessage("");
                }}
                className="w-full px-4 py-2.5 rounded-sm bg-[#FDFCF9] border border-[#D3CBBE] text-sm text-[#1A1816] focus:outline-none focus:border-[#1E2229]"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-medium text-[#1A1816] mb-1 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#8A7561]" />
                <span>{isHindi ? "पासवर्ड (न्यूनतम ६ अक्षर): *" : "Password (min 6 characters): *"}</span>
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage("");
                }}
                className="w-full px-4 py-2.5 rounded-sm bg-[#FDFCF9] border border-[#D3CBBE] text-sm text-[#1A1816] focus:outline-none focus:border-[#1E2229]"
              />
            </div>

            {/* City / Location Field */}
            <div>
              <label className="block text-xs font-medium text-[#1A1816] mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#8A7561]" />
                <span>{isHindi ? "शहर / शिल्प क्लस्टर:" : "City / Craft Cluster:"}</span>
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Khurja, Madhubani, Jaipur, Delhi NCR"
                className="w-full px-4 py-2.5 rounded-sm bg-[#FDFCF9] border border-[#D3CBBE] text-sm text-[#1A1816] focus:outline-none focus:border-[#1E2229]"
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {popularCities.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCity(c)}
                    className={`px-2 py-0.5 rounded-xs text-[10px] font-mono border transition-colors ${
                      city === c
                        ? "bg-[#1E2229] text-white border-[#1E2229]"
                        : "bg-[#FAF7F2] text-[#635C53] border-[#E8E2D7] hover:border-[#1E2229]"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#E8E2D7]">
              <p className="text-xs text-[#635C53]">
                {isHindi ? "पहले से खाता है? " : "Already have an account? "}
                <Link href="/login" className="font-semibold text-[#B4461F] hover:underline">
                  {isHindi ? "साइन इन करें" : "Sign In"}
                </Link>
              </p>

              <button
                type="submit"
                disabled={loading}
                className={`w-full sm:w-auto px-6 py-2.5 rounded-sm font-medium text-xs text-white transition-colors duration-150 flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 cursor-pointer ${
                  role === "SELLER" ? "bg-[#1E2229] hover:bg-[#111418]" : "bg-[#2D583B] hover:bg-[#23452E]"
                }`}
              >
                <span>
                  {loading
                    ? isHindi
                      ? "खाता बन रहा है..."
                      : "Creating Account..."
                    : isHindi
                    ? "पंजीकरण पूरा करें"
                    : `Create ${role === "SELLER" ? "Artisan" : "Patron"} Account`}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>

        {/* Security & Guarantee Strip */}
        <div className="mt-8 p-4 rounded-sm bg-[#FAF7F2] border border-[#E8E2D7] flex items-center justify-between text-xs text-gray-600">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#2D583B]" />
            <span>
              {isHindi
                ? "प्रत्यक्ष कारीगर इक्विटी • कोई मध्यस्थ शुल्क नहीं • सुरक्षित स्थानीय सत्र"
                : "100% Direct Creator Equity • No Middleman Markups • Authenticated Sessions"}
            </span>
          </span>
          <span className="font-mono text-[11px] text-gray-400 hidden sm:inline">Hunar Auth v2</span>
        </div>
      </div>
    </div>
  );
}
