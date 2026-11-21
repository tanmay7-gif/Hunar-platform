"use client";

import React from "react";
import {
  Scale,
  Shield,
  BookOpen,
  ExternalLink,
  CheckCircle2,
  FileCheck,
  AlertCircle,
  HelpCircle
} from "lucide-react";

export function CreatorLegalGuide() {
  const officialResources = [
    {
      name: "Copyright Office (India)",
      dept: "Department for Promotion of Industry and Internal Trade (DPIIT)",
      url: "https://copyright.gov.in",
      purpose: "Official statutory registration for artistic, literary, and musical creations."
    },
    {
      name: "IP India",
      dept: "Controller General of Patents, Designs and Trade Marks",
      url: "https://ipindia.gov.in",
      purpose: "Statutory registration for unique industrial and handcrafted 3D designs under Designs Act 2000."
    },
    {
      name: "CIPAM (Cell for IPR Promotion and Management)",
      dept: "DPIIT, Ministry of Commerce & Industry",
      url: "https://cipam.gov.in",
      purpose: "Government IP awareness, grassroots creator support, and commercialization guides."
    }
  ];

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-white border border-[#E8E2D7] shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-[#E8E2D7]">
          <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-[#1E2229]">
              Grassroots Artisan & Creator Intellectual Property Guide (India)
            </h3>
            <p className="text-xs text-[#635C53]">
              Core statutory legal frameworks protecting original handmade works and crafts
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-orange-50/60 border border-orange-200/80 space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase bg-orange-200/80 text-orange-900 font-mono">
                Statute 01
              </span>
              <h4 className="font-serif font-bold text-sm text-[#1E2229]">
                The Copyright Act, 1957
              </h4>
            </div>
            <p className="text-xs text-[#1E2229] leading-relaxed">
              <strong>Automatic Protection Upon Creation:</strong> Under Indian copyright law, copyright in an original artistic work (paintings, drawings, sculptures, and photographs) automatically subsists the moment it is fixed in a tangible medium.
            </p>
            <ul className="text-[11px] text-[#635C53] space-y-1 list-disc list-inside leading-normal">
              <li>Registration is recommended for evidentiary advantages, but not mandatory to own copyright.</li>
              <li>Protects the creator&apos;s exclusive rights to reproduce, distribute, and display the artwork.</li>
              <li>Includes Moral Rights (Section 57): Right of paternity (attribution) and right to integrity against distortion.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase bg-amber-200/80 text-amber-900 font-mono">
                Statute 02
              </span>
              <h4 className="font-serif font-bold text-sm text-[#1E2229]">
                The Designs Act, 2000
              </h4>
            </div>
            <p className="text-xs text-[#1E2229] leading-relaxed">
              <strong>Protection for Functional Crafted Articles:</strong> Protects novel visual features of shape, configuration, pattern, or ornament applied to an article (e.g., pottery silhouettes, ceramic lamp shapes, carved wooden furniture).
            </p>
            <ul className="text-[11px] text-[#635C53] space-y-1 list-disc list-inside leading-normal">
              <li>Applies when an artistic design is industrially multiplied (more than 50 times by an industrial process).</li>
              <li>Requires formal registration with IP India to claim statutory design monopoly.</li>
              <li>Prevents competitors from manufacturing lookalike duplicates of your functional craft forms.</li>
            </ul>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E2D7] space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E2229]">
            <FileCheck className="w-4 h-4 text-orange-600" />
            <span>Digital Evidence Preservation Best Practices for Artisans:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-[#635C53]">
            <div className="p-2.5 rounded-lg bg-white border border-[#E8E2D7]">
              <strong className="text-[#1E2229] block mb-1">1. Keep Raw Master Files</strong>
              Always save uncompressed original camera captures or dated raw files privately. Never distribute unwatermarked high-res originals.
            </div>
            <div className="p-2.5 rounded-lg bg-white border border-[#E8E2D7]">
              <strong className="text-[#1E2229] block mb-1">2. Dated Physical Records</strong>
              Maintain dated sketchbooks, workshop purchase invoices for raw clay/pigments, and photographic stages of wheel throwing or kiln firing.
            </div>
            <div className="p-2.5 rounded-lg bg-white border border-[#E8E2D7]">
              <strong className="text-[#1E2229] block mb-1">3. Hunar SHA-256 Fingerprint</strong>
              Every upload creates an immutable cryptographic hash and timestamp establishing public platform priority.
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <h4 className="font-serif font-bold text-sm text-[#1E2229]">
            Official Indian Government Intellectual Property Portals
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {officialResources.map((res) => (
              <a
                key={res.name}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-xl border border-gray-200 hover:border-orange-300 hover:bg-orange-50/30 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-serif font-bold text-xs text-[#1E2229] group-hover:text-orange-600 transition-colors">
                      {res.name}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-orange-600" />
                  </div>
                  <p className="text-[10px] text-gray-500 font-medium mb-1.5">{res.dept}</p>
                  <p className="text-[11px] text-[#635C53] leading-snug">{res.purpose}</p>
                </div>
                <span className="text-[10px] text-orange-600 font-semibold pt-2 group-hover:underline inline-flex items-center gap-1">
                  Visit Official Portal →
                </span>
              </a>
            ))}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-600 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <strong>Legal Notice:</strong> This guidance is provided for general informational purposes only and does not constitute formal legal counsel. For specific infringement disputes, statutory notice drafting, or litigation, artisans should consult a qualified intellectual property advocate or IP attorney registered with the Bar Council of India.
          </p>
        </div>
      </div>
    </div>
  );
}
