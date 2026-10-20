"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useHunar } from "@/context/HunarContext";
import { ProtectedImage } from "@/components/ui/ProtectedImage";
import { Feather, ShoppingBag, ArrowRight, ArrowUpRight } from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const { register, showToast } = useHunar();

  // Role selection
  const [role, setRole] = useState<"SELLER" | "CUSTOMER">("SELLER");

  // Signup form
  const [fullName, setFullName] = useState("Rhea Sharma");
  const [age, setAge] = useState("27");
  const [email, setEmail] = useState("rhea@example.com");
  const [password, setPassword] = useState("password123");
  const [mobileNumber, setMobileNumber] = useState("+91 93235 XXXXX");

  // Onboarding setup form
  const [displayName, setDisplayName] = useState("Rhea Sharma");
  const [city, setCity] = useState("Jaipur, Rajasthan");
  const [languageSpoken, setLanguageSpoken] = useState("English & Hindi");
  const [artistTagline, setArtistTagline] = useState("Turning feelings into colours, one canvas at a time.");
  const [artCategory, setArtCategory] = useState("Painting");
  const [aboutYou, setAboutYou] = useState(
    "I'm a painter in Jaipur, finding colour in courtyards, quiet corners and everyday life. I work with gouache and acrylic."
  );
  const [socialLink, setSocialLink] = useState("https://rheaart.studio");

  const [loading, setLoading] = useState(false);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({
        name: fullName,
        email,
        password,
        role,
        city
      });
      showToast("Account Created", "Welcome to Hunar! Setting up your maker studio.", "success");
      const setupEl = document.getElementById("profile-setup-section");
      if (setupEl) {
        setupEl.scrollIntoView({ behavior: "smooth" });
      }
    } catch {
      showToast("Ready", "Proceeding with profile setup.", "info");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndAddArtwork = () => {
    showToast("Profile Saved", "Navigating to studio artwork publisher.", "success");
    router.push("/dashboard/seller");
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#2B1219] py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Top Split Section (Screenshot 6: Hello, welcome to Hunar) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Inspiration & Artisan Testimonial */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#C85A32] mb-1">
                Make a little room for your art.
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#2B1219] font-medium leading-tight">
                Your work deserves a place of its own.
              </h1>
              <p className="text-xs sm:text-sm text-[#5E4B4E] mt-2 max-w-md leading-relaxed">
                Not another busy feed. A simple space to show what you make, tell your story and let
                people bring it home.
              </p>
            </div>

            <div className="aspect-4/3 rounded-xs overflow-hidden border border-[#E7E0D6] bg-[#F0E3C8] shadow-xs">
              <ProtectedImage
                src="/artworks/rhea-process.png"
                alt="Artisan working in studio"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-[#E7E0D6] shrink-0 bg-[#F0E3C8]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/artworks/rhea-sharma-portrait.png"
                  alt="Rhea Sharma"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#2B1219]">Rhea Sharma · Painter, Jaipur</p>
                <p className="text-[11px] text-[#8A8986]">
                  A few photos. A few words. A storefront that feels like you.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Hello, welcome to Hunar. Signup Form */}
          <div className="lg:col-span-6 space-y-5 bg-[#FFFDF8] border border-[#E7E0D6] rounded-xs p-6 sm:p-8 shadow-xs">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#2B1219] font-medium">
                Hello, welcome to Hunar.
              </h2>
              <p className="text-xs text-[#8A8986] mt-1">
                Create an account to start your next chapter.
              </p>
            </div>

            {/* Persona Role Selection Cards (Screenshot 6) */}
            <div className="space-y-1.5">
              <p className="text-[11px] text-[#5E4B4E] font-medium">I&apos;m here as a...</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Option 1: Artist / maker */}
                <button
                  type="button"
                  onClick={() => setRole("SELLER")}
                  className={`p-3 rounded-xs border text-left transition-colors flex items-start justify-between cursor-pointer ${
                    role === "SELLER"
                      ? "bg-[#F0E3C8] border-[#D4CDC3] ring-1 ring-[#D4CDC3]"
                      : "bg-[#FAF7F2] border-[#E7E0D6] hover:border-[#D4CDC3]"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Feather className="w-3.5 h-3.5 text-[#C85A32]" />
                      <span className="text-xs font-semibold text-[#2B1219]">Artist / maker</span>
                    </div>
                    <p className="text-[10px] text-[#5E4B4E]">Showcase and sell what you create.</p>
                  </div>
                  <div
                    className={`w-3.5 h-3.5 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                      role === "SELLER" ? "border-[#2B1219] bg-[#2B1219]" : "border-[#8A8986]"
                    }`}
                  >
                    {role === "SELLER" && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </button>

                {/* Option 2: Buyer / art lover */}
                <button
                  type="button"
                  onClick={() => setRole("CUSTOMER")}
                  className={`p-3 rounded-xs border text-left transition-colors flex items-start justify-between cursor-pointer ${
                    role === "CUSTOMER"
                      ? "bg-[#F0E3C8] border-[#D4CDC3] ring-1 ring-[#D4CDC3]"
                      : "bg-[#FAF7F2] border-[#E7E0D6] hover:border-[#D4CDC3]"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <ShoppingBag className="w-3.5 h-3.5 text-[#5E4B4E]" />
                      <span className="text-xs font-semibold text-[#2B1219]">Buyer / art lover</span>
                    </div>
                    <p className="text-[10px] text-[#5E4B4E]">Discover and collect independent work.</p>
                  </div>
                  <div
                    className={`w-3.5 h-3.5 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                      role === "CUSTOMER" ? "border-[#2B1219] bg-[#2B1219]" : "border-[#8A8986]"
                    }`}
                  >
                    {role === "CUSTOMER" && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleCreateAccount} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-[#5E4B4E] mb-1">
                  Full name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full bg-[#F7F5EF] border border-[#E7E0D6] rounded-xs px-3 py-2 text-xs text-[#2B1219] focus:outline-hidden focus:border-[#6E1F2E]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#5E4B4E] mb-1">
                  Age
                </label>
                <input
                  type="text"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full bg-[#F7F5EF] border border-[#E7E0D6] rounded-xs px-3 py-2 text-xs text-[#2B1219] focus:outline-hidden focus:border-[#6E1F2E]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#5E4B4E] mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#F7F5EF] border border-[#E7E0D6] rounded-xs px-3 py-2 text-xs text-[#2B1219] focus:outline-hidden focus:border-[#6E1F2E]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#5E4B4E] mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#F7F5EF] border border-[#E7E0D6] rounded-xs px-3 py-2 text-xs text-[#2B1219] focus:outline-hidden focus:border-[#6E1F2E]"
                />
                <p className="text-[10px] text-[#8A8986] mt-1">Use at least 8 characters.</p>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#5E4B4E] mb-1">
                  Mobile number
                </label>
                <input
                  type="text"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full bg-[#F7F5EF] border border-[#E7E0D6] rounded-xs px-3 py-2 text-xs text-[#2B1219] focus:outline-hidden focus:border-[#6E1F2E]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 px-4 rounded-xs bg-[#6E1F2E] hover:bg-[#581723] text-[#FAF8F5] text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Create {role === "SELLER" ? "artist" : "buyer"} account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="pt-2 text-center text-xs text-[#5E4B4E]">
              <span>Already have an account? </span>
              <Link href="/login" className="text-[#6E1F2E] font-semibold hover:underline inline-flex items-center gap-0.5">
                <span>Sign in</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            <p className="text-[10px] text-center text-[#8A8986]">
              Design preview · account creation is connected to demo state.
            </p>
          </div>
        </section>

        {/* COMBINED STEP: ARTIST PROFILE SETUP, AFTER SIGNUP (Screenshot 6 bottom section) */}
        <section id="profile-setup-section" className="pt-8 border-t border-[#E7E0D6]">
          <p className="text-[10px] font-mono uppercase tracking-wider text-[#8A8986] mb-3">
            Combined step · Artist profile setup, after signup
          </p>

          <div className="bg-[#F0E3C8] rounded-xs border border-[#D4CDC3] p-6 sm:p-10 shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Heading & Photo Upload */}
              <div className="lg:col-span-4 space-y-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#C85A32] mb-1">
                    A few details, then you&apos;re in.
                  </p>
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#2B1219] font-medium leading-tight">
                    Let people meet the maker.
                  </h3>
                  <p className="text-xs text-[#5E4B4E] mt-1.5 leading-relaxed">
                    Keep it simple. You can update your profile anytime from your dashboard.
                  </p>
                </div>

                {/* Profile Photo Preview & Change Button */}
                <div className="pt-2">
                  <p className="text-[11px] font-medium text-[#5E4B4E] mb-2">Profile photo (optional)</p>
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full overflow-hidden border border-[#E7E0D6] bg-[#FFFDF8] shadow-xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/artworks/rhea-sharma-portrait.png"
                        alt="Rhea Sharma"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => showToast("Photo Updated", "Profile image updated.", "info")}
                      className="px-3 py-1.5 rounded-xs border border-[#D4CDC3] bg-[#FFFDF8] hover:bg-[#F7F5EF] text-xs font-medium text-[#2B1219] transition-colors cursor-pointer"
                    >
                      Change photo
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Form Fields */}
              <div className="lg:col-span-8 space-y-3.5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-[#5E4B4E] mb-1">
                      Display name
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full bg-[#FFFDF8] border border-[#E7E0D6] rounded-xs px-3 py-2 text-xs text-[#2B1219] focus:outline-hidden focus:border-[#6E1F2E]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#5E4B4E] mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-[#FFFDF8] border border-[#E7E0D6] rounded-xs px-3 py-2 text-xs text-[#2B1219] focus:outline-hidden focus:border-[#6E1F2E]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#5E4B4E] mb-1">
                      Language Spoken
                    </label>
                    <input
                      type="text"
                      value={languageSpoken}
                      onChange={(e) => setLanguageSpoken(e.target.value)}
                      className="w-full bg-[#FFFDF8] border border-[#E7E0D6] rounded-xs px-3 py-2 text-xs text-[#2B1219] focus:outline-hidden focus:border-[#6E1F2E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-[#5E4B4E] mb-1">
                      Artist Tagline
                    </label>
                    <input
                      type="text"
                      value={artistTagline}
                      onChange={(e) => setArtistTagline(e.target.value)}
                      className="w-full bg-[#FFFDF8] border border-[#E7E0D6] rounded-xs px-3 py-2 text-xs text-[#2B1219] focus:outline-hidden focus:border-[#6E1F2E]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#5E4B4E] mb-1">
                      Art Category
                    </label>
                    <input
                      type="text"
                      value={artCategory}
                      onChange={(e) => setArtCategory(e.target.value)}
                      className="w-full bg-[#FFFDF8] border border-[#E7E0D6] rounded-xs px-3 py-2 text-xs text-[#2B1219] focus:outline-hidden focus:border-[#6E1F2E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#5E4B4E] mb-1">
                    A little about you
                  </label>
                  <textarea
                    rows={3}
                    value={aboutYou}
                    onChange={(e) => setAboutYou(e.target.value)}
                    className="w-full bg-[#FFFDF8] border border-[#E7E0D6] rounded-xs px-3 py-2 text-xs text-[#2B1219] focus:outline-hidden focus:border-[#6E1F2E]"
                  />
                  <p className="text-[10px] text-[#8A8986] mt-1">A short bio is plenty. Write in your own voice.</p>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#5E4B4E] mb-1">
                    Social media/ Other website link
                  </label>
                  <input
                    type="text"
                    value={socialLink}
                    onChange={(e) => setSocialLink(e.target.value)}
                    className="w-full bg-[#FFFDF8] border border-[#E7E0D6] rounded-xs px-3 py-2 text-xs text-[#2B1219] focus:outline-hidden focus:border-[#6E1F2E]"
                  />
                </div>

                {/* Action Bar */}
                <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#D4CDC3]">
                  <span className="text-[11px] text-[#5E4B4E]">
                    Next: add photos of your first artwork
                  </span>
                  <button
                    type="button"
                    onClick={handleSaveAndAddArtwork}
                    className="px-5 py-2.5 rounded-xs bg-[#6E1F2E] hover:bg-[#581723] text-[#FAF8F5] text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Save &amp; add my first artwork</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
