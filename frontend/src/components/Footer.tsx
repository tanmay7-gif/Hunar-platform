"use client";

import React from "react";
import Link from "next/link";
import { ApiExplorerModal } from "@/components/ApiExplorerModal";

export function Footer() {
  return (
    <footer className="bg-[#1E2229] text-[#FAF8F5] border-t border-[#2C323D] pt-12 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#2C323D]">
          {/* Brand Col */}
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="font-serif text-2xl font-bold tracking-tight text-[#FAF8F5]">
                Hunar
              </span>
              <div className="w-6 h-6 rounded-xs bg-[#FAF5EC] border border-[#E7E0D6] flex items-center justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/artworks/hunar-logo-tile.png"
                  alt="Hunar"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = "none";
                  }}
                />
                <span className="font-serif font-bold text-xs text-[#7A2828]">हु</span>
              </div>
            </div>
            <p className="text-xs text-[#A0A7B4] leading-relaxed max-w-sm">
              Independent hands. Extraordinary things.<br />
              A place for art and craft, made across India.
            </p>
          </div>

          {/* Nav links */}
          <div className="md:col-span-3 space-y-2.5">
            <h5 className="text-[10px] font-bold uppercase tracking-wider text-[#A0A7B4]">
              Discover
            </h5>
            <ul className="space-y-1.5 text-xs text-[#E2E6ED]">
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  Shop art
                </Link>
              </li>
              <li>
                <Link href="/artist/rhea-sharma" className="hover:text-white transition-colors">
                  Artist&apos;s story
                </Link>
              </li>
              <li>
                <Link href="/opportunities" className="hover:text-white transition-colors">
                  Mentorship
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-2.5">
            <h5 className="text-[10px] font-bold uppercase tracking-wider text-[#A0A7B4]">
              For Artists
            </h5>
            <ul className="space-y-1.5 text-xs text-[#E2E6ED]">
              <li>
                <Link href="/dashboard/seller" className="hover:text-white transition-colors">
                  Start selling
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Sign in
                </Link>
              </li>
              <li>
                <Link href="/onboarding" className="hover:text-white transition-colors">
                  Artist profile setup
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8E96A4] gap-3">
          <p>© 2026 Hunar. Made for independent creativity.</p>
          <div className="flex items-center gap-4">
            <span className="text-[#8E96A4] italic">Art, with a human connection.</span>
            <ApiExplorerModal />
          </div>
        </div>
      </div>
    </footer>
  );
}
