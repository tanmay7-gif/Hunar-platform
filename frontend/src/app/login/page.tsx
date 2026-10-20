"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useHunar } from "@/context/HunarContext";
import { useLanguage } from "@/context/LanguageContext";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  Store,
  Heart,
  Palette,
  ShoppingBag,
  HelpCircle,
  Zap,
  AlertCircle
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, loginAsDemo, currentUser, showToast } = useHunar();
  const { t, currentLanguage } = useLanguage();
  const isHindi = currentLanguage === "hi";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<"SELLER" | "CUSTOMER">("SELLER");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 1-Click Demo Profiles
  const demoSeller = {
    email: "rohit.potter@hunar.in",
    password: "demo_artisan_2026",
    role: "SELLER" as const,
    name: "Rohit Sharma",
    title: isHindi ? "मास्टर सेरेमिक एवं टेराकोटा शिल्पकार" : "Master Ceramicist & Terracotta Sculptor",
    cluster: "Khurja Ceramic Cluster / Delhi NCR",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
    badge: isHindi ? "सत्यापित शिल्पी स्टूडियो" : "Verified Artisan Studio",
    stat: isHindi ? "८ लाइव उत्पाद • ४.९६★ रेटिंग" : "8 Active Listings • 4.96★ Rating"
  };

  const demoCustomer = {
    email: "priya.patron@hunar.in",
    password: "demo_buyer_2026",
    role: "CUSTOMER" as const,
    name: "Priya Nair",
    title: isHindi ? "कला संरक्षक एवं इंटीरियर क्यूरेटर" : "Art Collector & Interior Curator",
    cluster: "South Delhi / PAN-India Patron",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    badge: isHindi ? "प्रीमियम कला संरक्षक" : "Patron Member",
    stat: isHindi ? "३ सक्रिय कमीशन आदेश • २ पसंदीदा शिल्पी" : "3 Active Inquiries • 2 Favorited Artisans"
  };

  const handleStandardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim()) {
      setErrorMessage(isHindi ? "कृपया अपना ईमेल पता दर्ज करें।" : "Please enter your email address.");
      return;
    }

    if (!password) {
      setErrorMessage(isHindi ? "कृपया अपना पासवर्ड दर्ज करें।" : "Please enter your password.");
      return;
    }

    setLoading(true);
    const result = await login(email, password);
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
            ? "अमान्य ईमेल या पासवर्ड। कृपया अपनी साख जांचें या नया खाता बनाएं।"
            : "Invalid email or password. Please check your credentials or register.")
      );
    }
  };

  const handle1ClickLogin = async (presetRole: "SELLER" | "CUSTOMER") => {
    setErrorMessage("");
    setLoading(true);
    const user = loginAsDemo(presetRole);
    setLoading(false);

    if (user.role === "SELLER") {
      router.push("/dashboard/seller");
    } else {
      router.push("/dashboard/customer");
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Tagline */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#8A7561] mb-2">
            {isHindi ? "भूमिका आधारित प्रवेश" : "Role-Based Studio & Patron Access"}
          </p>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1E2229]">
            {t("auth.loginTitle")}
          </h1>
        </div>

        {/* 1-Click Demo Profiles Showcase */}
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#1A1816] mb-3">
            {isHindi ? "1-क्लिक त्वरित डेमो लॉगिन (बिना पासवर्ड टाइप किए)" : "1-Click Instant Demo Credentials"}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* SELLER / ARTISAN DEMO CARD */}
            <div
              onClick={() => handle1ClickLogin("SELLER")}
              className="p-6 sm:p-7 rounded-sm bg-[#FFFFFF] border border-[#E8E2D7] hover:border-[#B4461F] cursor-pointer transition-colors duration-150 shadow-[0_2px_8px_rgba(0,0,0,0.04)] group relative overflow-hidden"
            >
              <div className="relative z-10 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={demoSeller.avatar}
                      alt={demoSeller.name}
                      className="w-14 h-14 rounded-full object-cover aspect-square ring-2 ring-[#E8E2D7] shrink-0 shadow-xs"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-serif font-bold text-base text-[#1E2229] group-hover:text-[#B4461F] transition-colors duration-150">
                          {demoSeller.name}
                        </h3>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2D583B]" />
                      </div>
                      <p className="text-[11px] text-gray-500 font-medium">{demoSeller.title}</p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-xs text-[10px] font-bold uppercase tracking-wider bg-[#FAF7F2] text-[#8B3B18] border border-[#E8E2D7] shrink-0">
                    SELLER / ARTISAN
                  </span>
                </div>

                <div className="p-3.5 rounded-xs bg-[#FAF7F2] border border-[#E8E2D7] text-xs space-y-1.5">
                  <p className="font-mono text-[11px] text-[#1E2229] flex items-center justify-between">
                    <span className="text-gray-500">Email:</span>
                    <span className="font-bold">{demoSeller.email}</span>
                  </p>
                  <p className="font-mono text-[11px] text-[#1E2229] flex items-center justify-between">
                    <span className="text-gray-500">Cluster:</span>
                    <span>{demoSeller.cluster}</span>
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-[#2D583B] font-semibold">{demoSeller.stat}</span>
                  <div className="px-3.5 py-1.5 rounded-sm bg-[#1E2229] text-white text-xs font-medium flex items-center gap-1.5 group-hover:bg-[#111418] transition-colors duration-150 shadow-xs">
                    <span>{isHindi ? "स्टूडियो खोलें" : "Launch Studio"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>

            {/* CUSTOMER / PATRON DEMO CARD */}
            <div
              onClick={() => handle1ClickLogin("CUSTOMER")}
              className="p-6 sm:p-7 rounded-sm bg-[#FFFFFF] border border-[#E8E2D7] hover:border-[#2D583B] cursor-pointer transition-colors duration-150 shadow-[0_2px_8px_rgba(0,0,0,0.04)] group relative overflow-hidden"
            >
              <div className="relative z-10 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={demoCustomer.avatar}
                      alt={demoCustomer.name}
                      className="w-14 h-14 rounded-full object-cover aspect-square ring-2 ring-[#E8E2D7] shrink-0 shadow-xs"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-serif font-bold text-base text-[#1E2229] group-hover:text-[#2D583B] transition-colors duration-150">
                          {demoCustomer.name}
                        </h3>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2D583B]" />
                      </div>
                      <p className="text-[11px] text-gray-500 font-medium">{demoCustomer.title}</p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-xs text-[10px] font-bold uppercase tracking-wider bg-[#EEF4F0] text-[#2D583B] border border-[#C5DCCB] shrink-0">
                    CUSTOMER / PATRON
                  </span>
                </div>

                <div className="p-3.5 rounded-xs bg-[#FAF7F2] border border-[#E8E2D7] text-xs space-y-1.5">
                  <p className="font-mono text-[11px] text-[#1E2229] flex items-center justify-between">
                    <span className="text-gray-500">Email:</span>
                    <span className="font-bold">{demoCustomer.email}</span>
                  </p>
                  <p className="font-mono text-[11px] text-[#1E2229] flex items-center justify-between">
                    <span className="text-gray-500">Region:</span>
                    <span>{demoCustomer.cluster}</span>
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-[#2D583B] font-semibold">{demoCustomer.stat}</span>
                  <div className="px-3.5 py-1.5 rounded-sm bg-[#2D583B] text-white text-xs font-medium flex items-center gap-1.5 group-hover:bg-[#23452E] transition-colors duration-150 shadow-xs">
                    <span>{isHindi ? "डिस्कवरी शुरू करें" : "Open Feed"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Standard Manual Credentials Form */}
        <div className="rounded-sm bg-white border border-[#E8E2D7] p-6 sm:p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="border-b border-[#E8E2D7] pb-4 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-serif font-bold text-lg sm:text-xl text-[#1E2229]">
                {isHindi ? "कस्टम ईमेल से प्रवेश करें" : "Or Sign In with Custom Credentials"}
              </h2>
              <p className="text-xs text-gray-500">
                {isHindi ? "अपने पंजीकृत खाते की साख दर्ज करें।" : "Authenticate with your registered email and password."}
              </p>
            </div>

            {/* Role Switcher in Form */}
            <div className="inline-flex p-1 rounded-sm bg-[#FAF7F2] border border-[#E8E2D7] self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setSelectedRole("SELLER")}
                className={`px-3 py-1.5 rounded-xs text-xs font-medium transition-colors duration-150 flex items-center gap-1.5 ${
                  selectedRole === "SELLER"
                    ? "bg-[#1E2229] text-white shadow-xs"
                    : "text-[#535A66] hover:text-[#1E2229]"
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>{t("auth.seller")}</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole("CUSTOMER")}
                className={`px-3 py-1.5 rounded-xs text-xs font-medium transition-colors duration-150 flex items-center gap-1.5 ${
                  selectedRole === "CUSTOMER"
                    ? "bg-[#2D583B] text-white shadow-xs"
                    : "text-[#535A66] hover:text-[#1E2229]"
                }`}
              >
                <Heart className="w-3.5 h-3.5" />
                <span>{t("auth.customer")}</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleStandardSubmit} className="space-y-4">
            {/* Inline Error Message */}
            {errorMessage && (
              <div className="p-3.5 rounded-sm bg-[#FFF5F5] border border-[#FCA5A5] text-[#991B1B] text-xs flex items-start gap-2.5 shadow-xs">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#DC2626] mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-xs">{errorMessage}</p>
                  <p className="text-[11px] text-[#7F1D1D]">
                    {isHindi ? "खाता नहीं है? " : "Don't have an account yet? "}
                    <Link href="/signup" className="underline font-bold hover:text-[#991B1B]">
                      {isHindi ? "नया कारीगर या संरक्षक खाता बनाएं" : "Create a new Artisan or Patron account"}
                    </Link>
                  </p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-[#1A1816] mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#8A7561]" />
                <span>{t("auth.email")}</span>
              </label>
              <input
                type="email"
                required
                placeholder={selectedRole === "SELLER" ? "artist@studio.in" : "patron@crafts.in"}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMessage) setErrorMessage("");
                }}
                className="w-full px-4 py-2.5 rounded-sm bg-[#FDFCF9] border border-[#D3CBBE] text-sm text-[#1A1816] focus:outline-none focus:border-[#1E2229]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#1A1816] mb-1 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#8A7561]" />
                <span>{t("auth.password")}</span>
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

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-[#635C53]">
                {"New creator or patron? "}
                <Link href="/signup" className="font-semibold text-[#B4461F] hover:underline">
                  {t("cta.signUp")}
                </Link>
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 py-2.5 rounded-sm bg-[#1E2229] text-white font-medium text-xs hover:bg-[#111418] transition-colors duration-150 flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 cursor-pointer"
              >
                <span>{loading ? "Authenticating..." : t("cta.signIn")}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>

        {/* Informative Guarantee Strip */}
        <div className="mt-8 p-4 rounded-sm bg-[#FAF7F2] border border-[#E8E2D7] flex items-center justify-between text-xs text-gray-600">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#2D583B]" />
            <span>{isHindi ? "प्रमाणीकरण सत्र कुकीज व स्थानीय स्टोरेज में सुरक्षित" : "Role-based simulated session synced via cookies and local storage."}</span>
          </span>
          <span className="font-mono text-[11px] text-gray-400 hidden sm:inline">Active: {currentUser.role}</span>
        </div>
      </div>
    </div>
  );
}
