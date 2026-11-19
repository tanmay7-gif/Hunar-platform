"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useHunar } from "@/context/HunarContext";
import {
  User,
  MapPin,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Edit3,
  Save,
  MessageSquare,
  LayoutDashboard,
  Compass,
  ArrowRight,
  ExternalLink,
  Sparkles,
  RefreshCw,
  LogOut,
  Camera
} from "lucide-react";

export default function UserProfilePage() {
  const router = useRouter();
  const { currentUser, updateUserProfile, language, logout, switchDemoRole } = useHunar();
  const isHindi = language === "hi";

  const isSeller = currentUser.role === "SELLER";

  // Form edit states initialized from currentUser
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser.name || "");
  const [city, setCity] = useState(currentUser.city || "Jaipur");
  const [bio, setBio] = useState(currentUser.bio || "");
  const [tagline, setTagline] = useState(currentUser.tagline || "");
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl || "");
  const [artCategory, setArtCategory] = useState(currentUser.artCategory || "Pottery");
  const [isSaving, setIsSaving] = useState(false);

  // Synchronize when currentUser changes (e.g. role toggle)
  useEffect(() => {
    setName(currentUser.name || "");
    setCity(currentUser.city || "Jaipur");
    setBio(
      currentUser.bio ||
        (currentUser.role === "SELLER"
          ? "Grassroots artisan studio dedicated to authentic handmade crafts."
          : "Art patron and supporter of traditional Indian craftsmanship.")
    );
    setTagline(currentUser.tagline || "");
    setAvatarUrl(currentUser.avatarUrl || "");
    if (currentUser.artCategory) setArtCategory(currentUser.artCategory);
  }, [currentUser]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    updateUserProfile({
      name: name.trim() || currentUser.name,
      city: city.trim() || currentUser.city,
      bio: bio.trim(),
      tagline: tagline.trim() || undefined,
      avatarUrl: avatarUrl.trim() || undefined,
      artCategory: isSeller ? artCategory : undefined
    });

    setIsSaving(false);
    setIsEditing(false);
  };

  const sampleAvatars = [
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80"
  ];

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1E2229] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between text-xs text-[#635C53] border-b border-[#EAE6DF] pb-3">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-[#B4461F] transition-colors">
              Hunar
            </Link>
            <span>/</span>
            <span className="font-semibold text-[#1E2229]">
              {isHindi ? "मेरी प्रोफ़ाइल" : "My Profile"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => switchDemoRole(isSeller ? "CUSTOMER" : "SELLER")}
              className="text-[11px] font-semibold text-[#B4461F] hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{isSeller ? "Switch to Patron Demo" : "Switch to Artisan Demo"}</span>
            </button>
          </div>
        </div>

        {/* Profile Header Hero Card */}
        <div className="bg-white rounded-lg border border-[#EAE6DF] shadow-xs p-6 sm:p-8 relative overflow-hidden">
          {/* Subtle Accent Stripe */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#00BAF2] via-[#2D583B] to-[#C85A32]" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-2">
            {/* Avatar & Key Info */}
            <div className="flex items-center gap-4 sm:gap-6 min-w-0">
              <div className="relative">
                <img
                  src={avatarUrl || currentUser.avatarUrl}
                  alt={name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover aspect-square ring-4 ring-[#EAE6DF] shadow-xs"
                />
                <span
                  className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white font-bold ${
                    isSeller ? "bg-[#B4461F]" : "bg-[#2D583B]"
                  }`}
                  title={isSeller ? "Verified Artisan Studio" : "Verified Art Patron"}
                >
                  ✓
                </span>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E2229] truncate">
                    {name}
                  </h1>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase ${
                      isSeller
                        ? "bg-[#FAF0EB] text-[#B4461F] border border-[#F3CFBF]"
                        : "bg-[#EEF4F0] text-[#2D583B] border border-[#C5DCCB]"
                    }`}
                  >
                    {isSeller ? (isHindi ? "कारीगर स्टूडियो" : "Artisan Creator") : (isHindi ? "कला संरक्षक" : "Art Patron")}
                  </span>
                </div>

                <div className="text-xs text-[#635C53] mt-2 flex items-center gap-3 flex-wrap">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200/80 text-orange-800 text-xs font-medium shadow-2xs">
                    <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    <span>
                      {(() => {
                        const rawCity = city || "Jaipur";
                        const parts = rawCity.split("/").map((p) => p.trim());
                        if (parts.length > 1) {
                          return (
                            <>
                              <span>{parts[0]}</span>
                              <span className="text-orange-400 mx-1">/</span>
                              <span>{parts.slice(1).join(" / ")}</span>
                            </>
                          );
                        }
                        return rawCity;
                      })()}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-stone-500">
                    <Mail className="w-3.5 h-3.5 text-[#8A7561]" />
                    <span className="font-mono text-[11px]">{currentUser.email}</span>
                  </span>
                </div>

                <p className="text-xs text-[#8A7561] font-medium mt-1">
                  {tagline || (isSeller ? "Master Craftsman & Studio Workshop" : "Patron Member")}
                </p>
              </div>
            </div>

            {/* Edit Profile CTA */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 rounded-sm border border-[#D3CBBE] hover:border-[#1E2229] bg-[#FAF8F5] text-xs font-semibold text-[#1E2229] hover:bg-white transition-all flex items-center gap-1.5 shadow-2xs shrink-0 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#B4461F]" />
              <span>{isEditing ? (isHindi ? "रद्द करें" : "Cancel Edit") : (isHindi ? "प्रोफ़ाइल संपादित करें" : "Edit Profile")}</span>
            </button>
          </div>

          {/* Quick Dashboard Action Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-[#EAE6DF]">
            <Link
              href={isSeller ? "/dashboard/seller" : "/dashboard/customer"}
              className="p-3 rounded-sm bg-[#F9FBFB] border border-[#E3EDEC] hover:border-[#00BAF2] transition-colors flex items-center gap-2 group"
            >
              <LayoutDashboard className="w-4 h-4 text-[#00BAF2] group-hover:scale-110 transition-transform" />
              <div>
                <span className="text-[10px] uppercase font-bold text-[#635C53] block">Dashboard</span>
                <span className="text-xs font-semibold text-[#1E2229] group-hover:text-[#00BAF2]">
                  {isSeller ? "Seller Studio" : "Customer Hub"}
                </span>
              </div>
            </Link>

            <Link
              href="/dashboard/chat"
              className="p-3 rounded-sm bg-[#F9FBFB] border border-[#E3EDEC] hover:border-[#2D583B] transition-colors flex items-center gap-2 group"
            >
              <MessageSquare className="w-4 h-4 text-[#2D583B] group-hover:scale-110 transition-transform" />
              <div>
                <span className="text-[10px] uppercase font-bold text-[#635C53] block">Messages</span>
                <span className="text-xs font-semibold text-[#1E2229] group-hover:text-[#2D583B]">
                  Active Conversations
                </span>
              </div>
            </Link>

            {isSeller ? (
              <Link
                href={`/artisans/${currentUser.id}`}
                className="p-3 rounded-sm bg-[#F9FBFB] border border-[#E3EDEC] hover:border-[#C85A32] transition-colors flex items-center gap-2 group"
              >
                <Sparkles className="w-4 h-4 text-[#C85A32] group-hover:scale-110 transition-transform" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#635C53] block">Public Card</span>
                  <span className="text-xs font-semibold text-[#1E2229] group-hover:text-[#C85A32]">
                    View Public Lookbook
                  </span>
                </div>
              </Link>
            ) : (
              <Link
                href="/dashboard/customer/artisans"
                className="p-3 rounded-sm bg-[#F9FBFB] border border-[#E3EDEC] hover:border-[#C85A32] transition-colors flex items-center gap-2 group"
              >
                <Compass className="w-4 h-4 text-[#C85A32] group-hover:scale-110 transition-transform" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#635C53] block">Artisans</span>
                  <span className="text-xs font-semibold text-[#1E2229] group-hover:text-[#C85A32]">
                    Explore Creators
                  </span>
                </div>
              </Link>
            )}

            <button
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="p-3 rounded-sm bg-[#FAF8F5] border border-[#EAE6DF] hover:border-rose-400 hover:bg-rose-50/50 transition-colors flex items-center gap-2 group text-left cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-gray-500 group-hover:text-rose-600 transition-colors" />
              <div>
                <span className="text-[10px] uppercase font-bold text-[#635C53] block">Session</span>
                <span className="text-xs font-semibold text-[#1E2229] group-hover:text-rose-600">
                  Sign Out
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Quick Edit Form Container */}
        {isEditing ? (
          <div className="bg-white rounded-lg border border-[#EAE6DF] shadow-xs p-6 sm:p-8 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#EAE6DF] mb-5">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1E2229]">
                  {isHindi ? "प्रोफ़ाइल विवरण संपादित करें" : "Edit Profile Details"}
                </h3>
                <p className="text-xs text-[#635C53]">
                  {isHindi
                    ? "बदलाव तुरंत सहेजे जाएंगे और आपकी सार्वजनिक प्रोफ़ाइल पर दिखाई देंगे।"
                    : "Changes are permanently persisted to your account and public artisan cards."}
                </p>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1E2229] mb-1">
                    {isHindi ? "पूरा नाम" : "Full Name"} *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-sm bg-[#FDFCFB] border border-[#D3CBBE] text-xs text-[#1E2229] focus:outline-none focus:border-[#1E2229]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E2229] mb-1">
                    {isHindi ? "शहर / स्थान" : "City / Location"} *
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    placeholder="e.g. Khurja, Jaipur, Delhi NCR"
                    className="w-full px-3.5 py-2.5 rounded-sm bg-[#FDFCFB] border border-[#D3CBBE] text-xs text-[#1E2229] focus:outline-none focus:border-[#1E2229]"
                  />
                </div>
              </div>

              {isSeller && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1E2229] mb-1">
                      {isHindi ? "मुख्य कला / शिल्प" : "Primary Craft Specialty"}
                    </label>
                    <input
                      type="text"
                      value={artCategory}
                      onChange={(e) => setArtCategory(e.target.value)}
                      placeholder="e.g. Pottery, Blue Art, Murals, Madhubani"
                      className="w-full px-3.5 py-2.5 rounded-sm bg-[#FDFCFB] border border-[#D3CBBE] text-xs text-[#1E2229] focus:outline-none focus:border-[#1E2229]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1E2229] mb-1">
                      {isHindi ? "टैगलाइन" : "Studio Tagline"}
                    </label>
                    <input
                      type="text"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      placeholder="e.g. Traditional Master Potter & Ceramicist"
                      className="w-full px-3.5 py-2.5 rounded-sm bg-[#FDFCFB] border border-[#D3CBBE] text-xs text-[#1E2229] focus:outline-none focus:border-[#1E2229]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#1E2229] mb-1">
                  {isHindi ? "परिचय / बायो" : "Biography & Background"}
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share details about your craft practice, lineage, or commission interests..."
                  className="w-full px-3.5 py-2.5 rounded-sm bg-[#FDFCFB] border border-[#D3CBBE] text-xs text-[#1E2229] focus:outline-none focus:border-[#1E2229]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E2229] mb-1">
                  {isHindi ? "अवतार छवि चुनें" : "Profile Avatar URL"}
                </label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-sm bg-[#FDFCFB] border border-[#D3CBBE] text-xs text-[#1E2229] focus:outline-none focus:border-[#1E2229]"
                />
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] text-[#635C53]">Quick choices:</span>
                  {sampleAvatars.map((av, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatarUrl(av)}
                      className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-transform ${
                        avatarUrl === av ? "border-[#1E2229] scale-110" : "border-[#E8DEC8] hover:scale-105"
                      }`}
                    >
                      <img src={av} alt="sample avatar" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EAE6DF]">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-sm border border-[#D3CBBE] text-xs font-semibold text-[#635C53] hover:text-[#1E2229]"
                >
                  {isHindi ? "रद्द करें" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-sm bg-[#1E2229] hover:bg-[#111418] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? (isHindi ? "सहेजा जा रहा है..." : "Saving...") : (isHindi ? "परिवर्तन सहेजें" : "Save Changes")}</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Profile Details View */
          <div className="bg-white rounded-lg border border-[#EAE6DF] shadow-xs p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#1E2229] mb-2">
                {isHindi ? "के बारे में" : "About"}
              </h3>
              <p className="text-xs sm:text-sm text-[#4A453E] leading-relaxed max-w-3xl">
                {bio ||
                  (isSeller
                    ? "Dedicated grassroots artisan crafting authentic traditional works with sustainable materials."
                    : "Patron member supporting cultural arts and direct artisan commissioning.")}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#EAE6DF]">
              <div className="p-4 rounded-sm bg-[#FAF8F5] border border-[#EAE6DF]">
                <span className="text-[10px] uppercase font-bold text-[#635C53] block">
                  {isHindi ? "खाता स्थिति" : "Account Status"}
                </span>
                <span className="text-xs font-bold text-[#2D583B] flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Identity</span>
                </span>
              </div>

              <div className="p-4 rounded-sm bg-[#FAF8F5] border border-[#EAE6DF]">
                <span className="text-[10px] uppercase font-bold text-[#635C53] block">
                  {isHindi ? "सुरक्षा एवं गारंटी" : "Escrow Protection"}
                </span>
                <span className="text-xs font-bold text-[#1E2229] flex items-center gap-1 mt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00BAF2]" />
                  <span>100% Direct Payouts</span>
                </span>
              </div>

              <div className="p-4 rounded-sm bg-[#FAF8F5] border border-[#EAE6DF]">
                <span className="text-[10px] uppercase font-bold text-[#635C53] block">
                  {isHindi ? "स्थानीय भाषा" : "Vernacular Language"}
                </span>
                <span className="text-xs font-bold text-[#1E2229] flex items-center gap-1 mt-1">
                  <span>{isHindi ? "हिंदी (Hindi)" : "English (Indian)"}</span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
