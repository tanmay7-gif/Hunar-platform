"use client";

import React, { useState } from "react";
import { ArtworkRecord } from "../types";
import {
  X,
  ShieldCheck,
  Copy,
  Check,
  CheckCircle2,
  Calendar,
  User,
  Hash,
  AlertTriangle,
  ExternalLink,
  Flag,
  FileText
} from "lucide-react";
import { ProtectedImage } from "@/components/ui/ProtectedImage";

interface ArtworkRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: ArtworkRecord | null;
  onReportStolen?: (record: ArtworkRecord) => void;
}

export function ArtworkRecordModal({
  isOpen,
  onClose,
  record,
  onReportStolen
}: ArtworkRecordModalProps) {
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  if (!isOpen || !record) return null;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(record.sha256Hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(record.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const formattedDate = new Date(record.uploadedAt).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl bg-white border border-[#E8E2D7] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-[#E8E2D7] bg-[#FAF7F2] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base text-[#1E2229] leading-tight">
                Artwork Digital Protection Record
              </h2>
              <p className="text-[11px] text-[#635C53]">
                Hunar Verified Creation Certificate & SHA-256 Fingerprint
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          <div className="flex flex-col sm:flex-row gap-5 p-4 rounded-xl bg-orange-50/50 border border-orange-200/80">
            <div className="relative w-full sm:w-36 h-36 rounded-lg overflow-hidden shrink-0 border border-orange-200 bg-white">
              <ProtectedImage
                src={record.watermarkedPreviewUrl || record.rawOriginalUrl}
                alt={record.title}
                fill
                className="object-cover"
              />
              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-xs text-[9px] font-mono bg-black/75 text-white">
                Watermarked
              </span>
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-orange-800 font-bold">
                    {record.category || "Handcrafted Artwork"}
                  </span>
                  <h3 className="font-serif font-bold text-lg text-[#1E2229] leading-snug">
                    {record.title}
                  </h3>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{record.status}</span>
                </span>
              </div>

              <div className="flex items-center gap-2 pt-1 text-xs text-[#1E2229]">
                <User className="w-3.5 h-3.5 text-orange-600" />
                <span className="font-semibold">{record.creatorName}</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Verified Seller</span>
                </span>
              </div>

              {record.creatorCity && (
                <p className="text-[11px] text-gray-500">
                  Cluster Origin: <span className="font-medium text-gray-700">{record.creatorCity}</span>
                </p>
              )}

              <div className="flex items-center gap-1.5 text-[11px] text-[#635C53]">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>Timestamp: {formattedDate}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-orange-600" />
                <span>Unique Artwork ID</span>
              </span>
              <button
                type="button"
                onClick={handleCopyId}
                className="text-[11px] font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
              >
                {copiedId ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedId ? "Copied" : "Copy ID"}</span>
              </button>
            </div>
            <div className="p-3 rounded-lg bg-[#FAF7F2] border border-[#E8E2D7] font-mono text-xs font-bold text-orange-950 flex items-center justify-between">
              <span>{record.id}</span>
              <span className="text-[10px] font-sans font-medium text-gray-500">Hunar Master Registry</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-orange-600" />
                <span>SHA-256 Digital Fingerprint (Web Crypto API)</span>
              </span>
              <button
                type="button"
                onClick={handleCopyHash}
                className="text-[11px] font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
              >
                {copiedHash ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedHash ? "Copied" : "Copy Hash"}</span>
              </button>
            </div>
            <div className="p-3 rounded-lg bg-gray-900 border border-gray-800 text-emerald-400 font-mono text-[11px] break-all select-all leading-relaxed">
              {record.sha256Hash}
            </div>
            <p className="text-[10px] text-gray-500">
              Computed mathematically from the master pixel payload before compression. Any modification or cropping permanently changes this hash.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Attested Ownership Declaration</span>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed italic">
              &quot;{record.ownershipDeclarationText}&quot;
            </p>
            <p className="text-[10px] text-emerald-700 pt-1">
              Signed digitally by {record.creatorName} at time of studio upload.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1 leading-relaxed text-[11px]">
              <p className="font-bold text-amber-950">Platform Evidentiary Disclaimer:</p>
              <p>
                This is a Hunar platform submission record and file fingerprint—not conclusive legal proof of ownership. Editing or cropping an image changes its SHA-256 hash. In India, copyright protects qualifying original artistic works upon creation under the Copyright Act, 1957.
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-[#E8E2D7] bg-[#FAF7F2] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          {onReportStolen ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                onReportStolen(record);
              }}
              className="text-xs font-semibold text-rose-700 hover:text-rose-800 hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <Flag className="w-3.5 h-3.5 text-rose-600" />
              <span>Report Suspicious Copy or Theft</span>
            </button>
          ) : (
            <span className="text-[11px] text-gray-500 font-mono">Record: {record.id}</span>
          )}

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleCopyHash}
              className="flex-1 sm:flex-none px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors cursor-pointer"
            >
              {copiedHash ? "Hash Copied" : "Copy Hash"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
