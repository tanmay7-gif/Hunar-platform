"use client";

import React, { useState, useEffect } from "react";
import { InfringementReport } from "../types";
import { generateReportId, saveInfringementReport } from "../utils/fingerprint";
import {
  X,
  AlertTriangle,
  Flag,
  Link as LinkIcon,
  Upload,
  FileText,
  User,
  Mail,
  ShieldAlert,
  CheckCircle2,
  HelpCircle
} from "lucide-react";

interface ReportStolenModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialArtworkId?: string;
  initialArtworkTitle?: string;
  initialListingUrl?: string;
  onSubmitted?: (report: InfringementReport) => void;
}

export function ReportStolenModal({
  isOpen,
  onClose,
  initialArtworkId = "",
  initialArtworkTitle = "",
  initialListingUrl = "",
  onSubmitted
}: ReportStolenModalProps) {
  const [artworkId, setArtworkId] = useState(initialArtworkId);
  const [artworkTitle, setArtworkTitle] = useState(initialArtworkTitle);
  const [originalListingUrl, setOriginalListingUrl] = useState(initialListingUrl);
  const [suspectedCopiedUrl, setSuspectedCopiedUrl] = useState("");
  const [description, setDescription] = useState("");
  const [evidenceDescription, setEvidenceDescription] = useState("");
  const [evidenceUrlInput, setEvidenceUrlInput] = useState("");
  const [evidenceUrls, setEvidenceUrls] = useState<string[]>([]);
  const [reporterName, setReporterName] = useState("");
  const [reporterEmail, setReporterEmail] = useState("");
  const [reporterRole, setReporterRole] = useState<"CREATOR" | "PATRON" | "COMMUNITY">("CREATOR");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (initialArtworkId) setArtworkId(initialArtworkId);
    if (initialArtworkTitle) setArtworkTitle(initialArtworkTitle);
    if (initialListingUrl) setOriginalListingUrl(initialListingUrl);
  }, [initialArtworkId, initialArtworkTitle, initialListingUrl]);

  if (!isOpen) return null;

  const handleAddEvidenceUrl = () => {
    if (evidenceUrlInput.trim() && !evidenceUrls.includes(evidenceUrlInput.trim())) {
      setEvidenceUrls([...evidenceUrls, evidenceUrlInput.trim()]);
      setEvidenceUrlInput("");
    }
  };

  const handleRemoveEvidenceUrl = (urlToRemove: string) => {
    setEvidenceUrls(evidenceUrls.filter((u) => u !== urlToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!suspectedCopiedUrl.trim()) {
      setErrorMessage("Please provide the suspected copied listing or external website URL.");
      return;
    }

    if (!description.trim() || description.trim().length < 20) {
      setErrorMessage("Please provide a detailed description (at least 20 characters) explaining what was copied.");
      return;
    }

    if (!reporterName.trim() || !reporterEmail.trim()) {
      setErrorMessage("Please provide your name and contact email for moderation follow-up.");
      return;
    }

    setIsSubmitting(true);

    const report: InfringementReport = {
      id: generateReportId(),
      artworkId: artworkId.trim() || undefined,
      artworkTitle: artworkTitle.trim() || "Untitled Hunar Artwork",
      originalListingUrl: originalListingUrl.trim() || (typeof window !== "undefined" ? window.location.href : "https://hunar.in"),
      suspectedCopiedUrl: suspectedCopiedUrl.trim(),
      reporterName: reporterName.trim(),
      reporterEmail: reporterEmail.trim().toLowerCase(),
      reporterRole,
      description: description.trim(),
      evidenceUrls,
      evidenceDescription: evidenceDescription.trim() || undefined,
      status: "Pending Review",
      submittedAt: new Date().toISOString()
    };

    saveInfringementReport(report);
    setIsSubmitting(false);
    setSubmittedSuccess(true);

    if (onSubmitted) {
      onSubmitted(report);
    }
  };

  const handleResetAndClose = () => {
    setSubmittedSuccess(false);
    setErrorMessage("");
    setSuspectedCopiedUrl("");
    setDescription("");
    setEvidenceDescription("");
    setEvidenceUrls([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl bg-white border border-[#E8E2D7] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-[#E8E2D7] bg-[#FAF7F2] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base text-[#1E2229] leading-tight">
                Report Stolen Artwork or Intellectual Property Theft
              </h2>
              <p className="text-[11px] text-[#635C53]">
                Hunar Moderation Review & Digital Evidence Preservation
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetAndClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedSuccess ? (
          <div className="p-8 text-center space-y-4 overflow-y-auto">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif font-bold text-xl text-[#1E2229]">
                Infringement Report Submitted
              </h3>
              <p className="text-xs text-[#635C53] max-w-md mx-auto">
                Your report has been queued for human moderation review under initial status <strong className="text-amber-800">Pending Review</strong>. Evidence and digital timestamps have been logged securely.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-orange-50/70 border border-orange-200 text-xs text-orange-950 text-left space-y-1 max-w-lg mx-auto">
              <p className="font-bold">Next Moderation Steps:</p>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-[#635C53]">
                <li>Moderators inspect digital SHA-256 fingerprints, upload timestamps, and external URLs.</li>
                <li>Status transitions from <em>Pending Review</em> to <em>Under Review</em>.</li>
                <li>If clear copying is verified, listings may be temporarily restricted or taken down.</li>
              </ul>
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-6 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Done and Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
            <div className="p-6 overflow-y-auto space-y-5">
              {errorMessage && (
                <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 shadow-xs">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                  <p className="font-semibold">{errorMessage}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1A1816] mb-1">
                    Original Artwork Title / Reference
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Wood-Fired Terracotta Chai Kulhar Set"
                    value={artworkTitle}
                    onChange={(e) => setArtworkTitle(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-[#FDFCF9] border border-gray-300 text-xs text-[#1A1816] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1816] mb-1">
                    Original Hunar Listing URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://hunar.in/products/..."
                    value={originalListingUrl}
                    onChange={(e) => setOriginalListingUrl(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-[#FDFCF9] border border-gray-300 text-xs text-[#1A1816] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A1816] mb-1 flex items-center justify-between">
                  <span>Suspected Copied Listing or External Page URL *</span>
                  <span className="text-[11px] font-normal text-rose-600">Required</span>
                </label>
                <div className="relative">
                  <input
                    type="url"
                    required
                    placeholder="https://external-store.com/copied-product-link"
                    value={suspectedCopiedUrl}
                    onChange={(e) => setSuspectedCopiedUrl(e.target.value)}
                    className="w-full px-3.5 py-2 pl-9 rounded-lg bg-[#FDFCF9] border border-gray-300 text-xs text-[#1A1816] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                  <LinkIcon className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A1816] mb-1">
                  What was copied and when was it discovered? *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain specific elements copied (e.g., exact photo cropped, hand-painted motif duplicated onto print-on-demand products, product story copied verbatim) and approximate date discovered."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-[#FDFCF9] border border-gray-300 text-xs text-[#1A1816] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#1A1816]">
                  Supporting Evidence (Sketches, RAW photos, Drafts, Invoices, External URLs)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Paste link to Google Drive / image evidence / invoice"
                    value={evidenceUrlInput}
                    onChange={(e) => setEvidenceUrlInput(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-lg bg-[#FDFCF9] border border-gray-300 text-xs text-[#1A1816] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddEvidenceUrl}
                    className="px-3.5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-700 transition-colors cursor-pointer"
                  >
                    Add Link
                  </button>
                </div>

                {evidenceUrls.length > 0 && (
                  <div className="space-y-1 pt-1">
                    {evidenceUrls.map((url, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-md bg-orange-50/60 border border-orange-200 text-xs text-orange-900">
                        <span className="truncate max-w-[400px] font-mono text-[11px]">{url}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveEvidenceUrl(url)}
                          className="text-rose-600 hover:text-rose-800 text-[11px] font-bold cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <input
                  type="text"
                  placeholder="Or describe offline evidence (e.g. dated physical sketchbook page 42, workshop kiln logs)"
                  value={evidenceDescription}
                  onChange={(e) => setEvidenceDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-[#FDFCF9] border border-gray-300 text-xs text-[#1A1816] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-gray-100">
                <div>
                  <label className="block text-xs font-semibold text-[#1A1816] mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rohit Sharma"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#FDFCF9] border border-gray-300 text-xs text-[#1A1816] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1816] mb-1">
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="your.email@domain.com"
                    value={reporterEmail}
                    onChange={(e) => setReporterEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#FDFCF9] border border-gray-300 text-xs text-[#1A1816] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1816] mb-1">
                    Reporting As
                  </label>
                  <select
                    value={reporterRole}
                    onChange={(e) => setReporterRole(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-[#FDFCF9] border border-gray-300 text-xs font-medium text-[#1A1816] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  >
                    <option value="CREATOR">Original Creator</option>
                    <option value="PATRON">Art Patron / Collector</option>
                    <option value="COMMUNITY">Community Member</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-[#E8E2D7] bg-[#FAF7F2] flex items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>{isSubmitting ? "Submitting..." : "Submit Infringement Report"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
