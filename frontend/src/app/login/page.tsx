"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useHunar } from "@/context/HunarContext";
import { useLanguage } from "@/context/LanguageContext";
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  Store,
  Heart,
  User,
  MapPin,
  AlertCircle,
  Eye,
  EyeOff
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, register, currentUser, showToast } = useHunar();
  const { t, currentLanguage } = useLanguage();
  const isHindi = currentLanguage === "hi";

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("Delhi NCR");
  const [role, setRole] = useState<"SELLER" | "CUSTOMER">("SELLER");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const popularCities = [
    "Delhi NCR",
    "Khurja",
    "Jaipur",
    "Madhubani",
    "Varanasi",
    "Mumbai",
    "Bengaluru"
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("mode") === "signup" || params.get("tab") === "signup") {
        setMode("signup");
      }
    }
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setErrorMessage("");

    const normalizedEmail = email.trim();
    if (!normalizedEmail) {
      setErrorMessage(isHindi ? "कृपया अपना ईमेल पता दर्ज करें।" : "Please enter your email address.");
      return;
    }

    if (!password) {
      setErrorMessage(isHindi ? "कृपया अपना पासवर्ड दर्ज करें।" : "Please enter your password.");
      return;
    }

    setLoading(true);
    const result = await login(normalizedEmail, password);
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setErrorMessage("");

    if (!name.trim()) {
      setErrorMessage(isHindi ? "कृपया अपना पूरा नाम दर्ज करें।" : "Please enter your full name.");
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !normalizedEmail.includes("@")) {
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
      email: normalizedEmail,
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
    <div className="min-h-screen bg-[#FAF7F2] py-12 px-4 sm:px-6 flex flex-col justify-center items-center">
      <div className="w-full max-w-xl mx-auto">
        <div className="text-center max-w-md mx-auto mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-3 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-sm group"
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
              <span className="font-serif text-2xl font-bold tracking-tight text-orange-600">
                Hunar
              </span>
              <span className="text-[10px] font-medium tracking-wide uppercase text-[#635C53] -mt-0.5">
                A home for art. By Flytech
              </span>
            </div>
          </Link>

          <p className="text-xs font-semibold uppercase tracking-wider text-orange-800/80 mb-1">
            {isHindi ? "प्रमाणीकरण एवं सत्र प्रबंधन" : "Grassroots Artisans & Patrons Guild"}
          </p>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1E2229]">
            {mode === "signin"
              ? isHindi
                ? "हुनर खाते में प्रवेश करें"
                : "Sign In to Hunar"
              : isHindi
              ? "नया हुनर खाता बनाएं"
              : "Create Your Hunar Account"}
          </h1>
          <p className="text-xs sm:text-sm text-[#635C53] mt-1.5">
            {mode === "signin"
              ? isHindi
                ? "अपने पंजीकृत ईमेल और पासवर्ड से प्रवेश करें।"
                : "Enter your registered email and password to access your studio or patron guild."
              : isHindi
              ? "सीधे कारीगर स्टूडियो शुरू करें या क्षेत्रीय कला संरक्षक के रूप में विशिष्ट शिल्पों की खोज करें।"
              : "Set up your artisan workshop profile or join as a patron to collect authentic crafts."}
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-[#E8E2D7] shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="grid grid-cols-2 border-b border-[#E8E2D7] bg-[#FAF7F2]/60 p-1">
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setErrorMessage("");
              }}
              className={`py-3 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer ${
                mode === "signin"
                  ? "bg-white text-orange-600 shadow-sm border border-orange-200/80"
                  : "text-[#635C53] hover:text-[#1E2229]"
              }`}
            >
              <Lock className="w-4 h-4 text-orange-600" />
              <span>{isHindi ? "साइन इन" : "Sign In"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setErrorMessage("");
              }}
              className={`py-3 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer ${
                mode === "signup"
                  ? "bg-white text-orange-600 shadow-sm border border-orange-200/80"
                  : "text-[#635C53] hover:text-[#1E2229]"
              }`}
            >
              <User className="w-4 h-4 text-orange-600" />
              <span>{isHindi ? "नया खाता बनाएं" : "Create Account"}</span>
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {errorMessage && (
              <div className="mb-6 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 shadow-xs">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-xs">{errorMessage}</p>
                  {mode === "signin" && (
                    <p className="text-[11px] text-red-600">
                      {isHindi ? "खाता नहीं है? " : "Don't have an account yet? "}
                      <button
                        type="button"
                        onClick={() => {
                          setMode("signup");
                          setErrorMessage("");
                        }}
                        className="underline font-bold hover:text-red-800 cursor-pointer"
                      >
                        {isHindi ? "नया खाता बनाएं" : "Register here"}
                      </button>
                    </p>
                  )}
                </div>
              </div>
            )}

            {mode === "signin" ? (
              <form onSubmit={handleSignIn} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-[#1A1816] mb-2 flex items-center justify-between">
                    <span>{isHindi ? "खाता प्रकार / भूमिका" : "Account Role"}</span>
                    <span className="text-[11px] font-normal text-gray-500">
                      {isHindi ? "स्टूडियो या संरक्षक" : "Select role to verify"}
                    </span>
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setRole("SELLER")}
                      className={`p-2.5 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        role === "SELLER"
                          ? "bg-orange-50 border-orange-300 text-orange-900 font-semibold ring-1 ring-orange-400"
                          : "border-gray-200 bg-white text-gray-600 hover:border-orange-200"
                      }`}
                    >
                      <Store className="w-3.5 h-3.5 text-orange-600" />
                      <span>{isHindi ? "कारीगर / शिल्पी" : "Artisan / Studio"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole("CUSTOMER")}
                      className={`p-2.5 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        role === "CUSTOMER"
                          ? "bg-orange-50 border-orange-300 text-orange-900 font-semibold ring-1 ring-orange-400"
                          : "border-gray-200 bg-white text-gray-600 hover:border-orange-200"
                      }`}
                    >
                      <Heart className="w-3.5 h-3.5 text-orange-600" />
                      <span>{isHindi ? "कला संरक्षक" : "Patron / Collector"}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1816] mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-orange-600" />
                    <span>{isHindi ? "ईमेल पता: *" : "Email Address: *"}</span>
                  </label>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="e.g. yourname@domain.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMessage) setErrorMessage("");
                    }}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#FDFCF9] border border-gray-300 text-sm text-[#1A1816] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1816] mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-orange-600" />
                      <span>{isHindi ? "पासवर्ड: *" : "Password: *"}</span>
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="current-password"
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errorMessage) setErrorMessage("");
                      }}
                      className="w-full px-4 py-2.5 pr-10 rounded-lg bg-[#FDFCF9] border border-gray-300 text-sm text-[#1A1816] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-6 rounded-lg bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-semibold text-sm transition-colors duration-150 flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {loading && (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    )}
                    <span>
                      {loading
                        ? isHindi
                          ? "प्रवेश हो रहा है..."
                          : "Authenticating..."
                        : isHindi
                        ? "साइन इन करें"
                        : "Sign In"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-center pt-2">
                  <p className="text-xs text-[#635C53]">
                    {isHindi ? "खाता नहीं है? " : "Don't have an account yet? "}
                    <button
                      type="button"
                      onClick={() => {
                        setMode("signup");
                        setErrorMessage("");
                      }}
                      className="font-semibold text-orange-600 hover:text-orange-700 hover:underline cursor-pointer"
                    >
                      {isHindi ? "नया खाता बनाएं" : "Create an account"}
                    </button>
                  </p>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1A1816] mb-2">
                    {isHindi ? "आप हुनर से किस रूप में जुड़ना चाहते हैं? *" : "Select Your Role on Hunar *"}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div
                      onClick={() => setRole("SELLER")}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-150 relative ${
                        role === "SELLER"
                          ? "border-orange-500 bg-orange-50/60 ring-1 ring-orange-500 shadow-xs"
                          : "border-gray-200 bg-white hover:border-orange-300"
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            role === "SELLER" ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          <Store className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-serif font-bold text-xs sm:text-sm text-[#1E2229]">
                              {isHindi ? "कारीगर / शिल्पी" : "Artisan Studio"}
                            </span>
                            {role === "SELLER" && <CheckCircle2 className="w-3.5 h-3.5 text-orange-600" />}
                          </div>
                          <p className="text-[11px] text-[#635C53] mt-0.5 leading-snug">
                            {isHindi
                              ? "०% कमीशन, सीधे WhatsApp लीड और स्टूडियो इन्वेंटरी प्रबंधन।"
                              : "Showcase listings, receive direct WhatsApp inquiries, 0% platform cuts."}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      onClick={() => setRole("CUSTOMER")}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-150 relative ${
                        role === "CUSTOMER"
                          ? "border-orange-500 bg-orange-50/60 ring-1 ring-orange-500 shadow-xs"
                          : "border-gray-200 bg-white hover:border-orange-300"
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            role === "CUSTOMER" ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          <Heart className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-serif font-bold text-xs sm:text-sm text-[#1E2229]">
                              {isHindi ? "कला संरक्षक" : "Patron Guild"}
                            </span>
                            {role === "CUSTOMER" && <CheckCircle2 className="w-3.5 h-3.5 text-orange-600" />}
                          </div>
                          <p className="text-[11px] text-[#635C53] mt-0.5 leading-snug">
                            {isHindi
                              ? "हस्तनिर्मित शिल्प खोजें और कारीगरों से सीधे कमीशन कराएं।"
                              : "Discover folk artworks, commission custom murals, 100% creator equity."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1816] mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-orange-600" />
                    <span>{isHindi ? "पूरा नाम: *" : "Full Name: *"}</span>
                  </label>
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    placeholder={role === "SELLER" ? "e.g. Ramesh Kumar Prajapati" : "e.g. Neha Sengupta"}
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errorMessage) setErrorMessage("");
                    }}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#FDFCF9] border border-gray-300 text-sm text-[#1A1816] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1816] mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-orange-600" />
                    <span>{isHindi ? "ईमेल पता: *" : "Email Address: *"}</span>
                  </label>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="your.name@domain.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMessage) setErrorMessage("");
                    }}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#FDFCF9] border border-gray-300 text-sm text-[#1A1816] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1816] mb-1 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-orange-600" />
                    <span>{isHindi ? "पासवर्ड (कम से कम ६ अक्षर): *" : "Password (min 6 characters): *"}</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="new-password"
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errorMessage) setErrorMessage("");
                      }}
                      className="w-full px-4 py-2.5 pr-10 rounded-lg bg-[#FDFCF9] border border-gray-300 text-sm text-[#1A1816] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1816] mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-orange-600" />
                    <span>{isHindi ? "शहर / शिल्प क्लस्टर:" : "City / Craft Cluster:"}</span>
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Khurja, Madhubani, Jaipur, Delhi NCR"
                    className="w-full px-4 py-2.5 rounded-lg bg-[#FDFCF9] border border-gray-300 text-sm text-[#1A1816] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-gray-400"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {popularCities.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCity(c)}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-mono border transition-colors cursor-pointer ${
                          city === c
                            ? "bg-orange-50 text-orange-800 border-orange-300 font-semibold"
                            : "bg-[#FAF7F2] text-[#635C53] border-gray-200 hover:border-orange-300"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-6 rounded-lg bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-semibold text-sm transition-colors duration-150 flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {loading && (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    )}
                    <span>
                      {loading
                        ? isHindi
                          ? "खाता बन रहा है..."
                          : "Creating Account..."
                        : isHindi
                        ? "पंजीकरण पूरा करें"
                        : `Create ${role === "SELLER" ? "Artisan Studio" : "Patron"} Account`}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-center pt-2">
                  <p className="text-xs text-[#635C53]">
                    {isHindi ? "पहले से खाता है? " : "Already have an account? "}
                    <button
                      type="button"
                      onClick={() => {
                        setMode("signin");
                        setErrorMessage("");
                      }}
                      className="font-semibold text-orange-600 hover:text-orange-700 hover:underline cursor-pointer"
                    >
                      {isHindi ? "साइन इन करें" : "Sign In"}
                    </button>
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="mt-8 p-4 rounded-xl bg-white border border-[#E8E2D7] shadow-xs flex items-center justify-between text-xs text-gray-600">
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
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
