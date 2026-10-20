"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useHunar } from "@/context/HunarContext";
import { ShieldCheck, HeartHandshake, PhoneCall, Sparkles } from "lucide-react";
import { ApiExplorerModal } from "@/components/ApiExplorerModal";

import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
  const { t, currentLanguage } = useLanguage();
  const isHindi = currentLanguage === "hi";

  return (
    <footer className="bg-[#1E2229] text-[#FDFBF7] border-t border-[#2C323D] pt-14 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Grassroots Value Props Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-[#2C323D]">
          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[#252A33] border border-[#343B47]">
            <div className="w-10 h-10 rounded-lg bg-[#C85A32]/20 flex items-center justify-center shrink-0 text-[#E5A93B]">
              <ShieldCheck className="w-5 h-5 text-[#E5A93B]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#FDFBF7]">
                {t("footer.zeroCut")}
              </h4>
              <p className="text-xs text-[#E8DEC8]/80 mt-1 leading-relaxed">
                {t("footer.zeroCutDesc")}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[#252A33] border border-[#343B47]">
            <div className="w-10 h-10 rounded-lg bg-[#C85A32]/20 flex items-center justify-center shrink-0 text-[#E5A93B]">
              <HeartHandshake className="w-5 h-5 text-[#E5A93B]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#FDFBF7]">
                {t("footer.authentic")}
              </h4>
              <p className="text-xs text-[#E8DEC8]/80 mt-1 leading-relaxed">
                {t("footer.authenticDesc")}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[#252A33] border border-[#343B47]">
            <div className="w-10 h-10 rounded-lg bg-[#C85A32]/20 flex items-center justify-center shrink-0 text-[#E5A93B]">
              <PhoneCall className="w-5 h-5 text-[#E5A93B]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#FDFBF7]">
                {t("footer.whatsappFirst")}
              </h4>
              <p className="text-xs text-[#E8DEC8]/80 mt-1 leading-relaxed">
                {t("footer.whatsappFirstDesc")}
              </p>
            </div>
          </div>
        </div>

        {/* Links & Brand Description */}
        <div className="pt-10 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 flex-shrink-0 bg-white/10 rounded-sm p-1">
                <Image
                  src="/assets/logo-compact.png"
                  alt="Hunar Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col select-none">
                <span className="font-serif text-xl font-bold tracking-tight text-[#FAF7F2]">
                  Hunar
                </span>
                <span className="text-[10px] font-medium tracking-wide uppercase text-[#E8DEC8]/80">
                  A home for art. By Flytech
                </span>
              </div>
            </div>
            <p className="text-xs text-[#E8DEC8]/80 leading-relaxed">
              {t("footer.tagline")}
            </p>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#E5A93B] mb-3">
              {t("nav.studioHub")} / {t("nav.bazaar")}
            </h5>
            <ul className="space-y-2 text-xs text-[#E8DEC8]/80">
              <li>
                <Link href="/" className="hover:text-[#FDFBF7] transition-colors">
                  {t("nav.artisans")}
                </Link>
              </li>
              <li>
                <Link href="/opportunities" className="hover:text-[#FDFBF7] transition-colors">
                  {t("nav.gigsRadar")}
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="hover:text-[#FDFBF7] transition-colors">
                  {t("nav.roadmap")}
                </Link>
              </li>
              <li>
                <Link href="/dashboard/customer" className="hover:text-[#FDFBF7] transition-colors">
                  {t("nav.bazaar")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#E5A93B] mb-3">
              {isHindi ? "शिल्प विधाएं" : "Art & Craft Forms"}
            </h5>
            <ul className="space-y-2 text-xs text-[#E8DEC8]/80">
              <li>
                <span className="hover:text-[#FDFBF7] transition-colors">
                  {isHindi ? "मधुबनी एवं मिथिला कला" : "Mithila / Madhubani Folk Art"}
                </span>
              </li>
              <li>
                <span className="hover:text-[#FDFBF7] transition-colors">
                  {isHindi ? "कैफे एवं स्ट्रीट म्यूरल्स" : "Urban & Cafe Murals"}
                </span>
              </li>
              <li>
                <span className="hover:text-[#FDFBF7] transition-colors">
                  {isHindi ? "टेराकोटा एवं स्टूडियो पॉटरी" : "Terracotta & Studio Ceramics"}
                </span>
              </li>
              <li>
                <span className="hover:text-[#FDFBF7] transition-colors">
                  {isHindi ? "प्राकृतिक ब्राइडल मेहंदी" : "Chemical-Free Bridal Henna"}
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#E5A93B] mb-3">
              {isHindi ? "शुरुआत करें" : "Get Started"}
            </h5>
            <p className="text-xs text-[#E8DEC8]/80 mb-3 leading-relaxed">
              {isHindi
                ? "2 मिनट में अपना डिजिटल हुनर कार्ड बनाएं और नए क्लाइंट्स से जुड़ें।"
                : "Create your free shareable lookbook card in under 2 minutes and start matching with regional gigs."}
            </p>
            <Link
              href="/onboarding"
              className="inline-flex items-center justify-center px-4 py-2 rounded-sm bg-[#1E2229] border border-[#3E4756] text-[#FAF7F2] text-xs font-medium hover:bg-[#111418] transition-colors duration-150"
            >
              <span>{isHindi ? "नया हुनर कार्ड बनाएं" : "Create My Card Now"}</span>
            </Link>
          </div>
        </div>

        {/* Bottom copyright bar & developer explorer */}
        <div className="pt-8 mt-8 border-t border-[#2C323D] flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© 2026 Hunar — A home for art. By Flytech • Crafted with pride for Indian Grassroots Creators.</p>
          <div className="flex items-center gap-4">
            <span className="text-gray-500 hidden md:inline">Rooted in Jaipur, Varanasi, Madhubani & Delhi</span>
            <ApiExplorerModal />
          </div>
        </div>
      </div>
    </footer>
  );
}
