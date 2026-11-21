"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useHunar } from "@/context/HunarContext";
import {
  ArtworkRecord,
  InfringementReport,
  InfringementStatus
} from "@/protection/types";
import {
  getStoredArtworkRecords,
  getStoredInfringementReports,
  updateInfringementReportStatus
} from "@/protection/utils/fingerprint";
import { ArtworkRecordModal } from "@/protection/components/ArtworkRecordModal";
import { ReportStolenModal } from "@/protection/components/ReportStolenModal";
import { CreatorLegalGuide } from "@/protection/components/CreatorLegalGuide";
import {
  ShieldCheck,
  ShieldAlert,
  FileCheck,
  Scale,
  Flag,
  Search,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Eye,
  Filter,
  RefreshCw,
  Clock,
  User,
  ArrowRight,
  X
} from "lucide-react";
import { ProtectedImage } from "@/components/ui/ProtectedImage";

export default function ProtectionHubPage() {
  const { currentUser, showToast } = useHunar();

  const [activeTab, setActiveTab] = useState<"queue" | "registry" | "legal">("queue");
  const [artworkRecords, setArtworkRecords] = useState<ArtworkRecord[]>([]);
  const [reports, setReports] = useState<InfringementReport[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<ArtworkRecord | null>(null);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedReportForInspect, setSelectedReportForInspect] = useState<InfringementReport | null>(null);

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState<"ALL" | InfringementStatus>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingNotes, setEditingNotes] = useState("");

  const refreshData = () => {
    setArtworkRecords(getStoredArtworkRecords());
    setReports(getStoredInfringementReports());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleStatusChange = (reportId: string, newStatus: InfringementStatus) => {
    const updated = updateInfringementReportStatus(reportId, newStatus, editingNotes || undefined);
    setReports(updated);
    if (selectedReportForInspect && selectedReportForInspect.id === reportId) {
      setSelectedReportForInspect({ ...selectedReportForInspect, status: newStatus });
    }
    showToast(
      "Report Status Updated",
      `Infringement report status changed to "${newStatus}".`,
      "success"
    );
  };

  const filteredReports = reports.filter((rep) => {
    const matchesStatus = statusFilter === "ALL" || rep.status === statusFilter;
    const matchesSearch =
      searchQuery.trim() === "" ||
      rep.artworkTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.reporterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.suspectedCopiedUrl.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const activeReportsCount = reports.filter(
    (r) => r.status === "Pending Review" || r.status === "Under Review" || r.status === "Listing Temporarily Restricted"
  ).length;

  const resolvedReportsCount = reports.filter((r) => r.status === "Resolved / Dismissed").length;

  const getStatusBadge = (status: InfringementStatus) => {
    switch (status) {
      case "Pending Review":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "Under Review":
        return "bg-sky-50 text-sky-800 border-sky-200";
      case "Listing Temporarily Restricted":
        return "bg-rose-50 text-rose-800 border-rose-200";
      case "Resolved / Dismissed":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      default:
        return "bg-gray-50 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner / Hero */}
      <div className="rounded-2xl p-6 sm:p-8 border border-orange-200/80 bg-gradient-to-br from-orange-50/80 via-white to-amber-50/40 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-600 text-white">
                Creator Security
              </span>
              <span className="text-xs font-semibold text-orange-950/80">
                Phase 1 MVP Protection Framework
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E2229] tracking-tight">
              Hunar Creator & Artwork Protection Hub
            </h1>
            <p className="text-xs sm:text-sm text-[#635C53] leading-relaxed">
              Attribution establishment, client-side cryptographic SHA-256 file fingerprinting, Cloudinary/Canvas dynamic watermarked previews, and human moderation workflows to deter digital art theft.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsReportModalOpen(true)}
              className="px-4 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Flag className="w-3.5 h-3.5" />
              <span>Report Stolen Artwork</span>
            </button>

            <Link
              href="/dashboard/seller/products/new"
              className="px-4 py-2.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-[#1E2229] text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <FileCheck className="w-3.5 h-3.5 text-orange-600" />
              <span>Upload Protected Craft</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-[#E8E2D7] shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-xs font-medium">Protected Artworks</span>
            <ShieldCheck className="w-4 h-4 text-orange-600" />
          </div>
          <p className="font-serif font-bold text-2xl text-[#1E2229]">{artworkRecords.length}</p>
          <span className="text-[10px] text-emerald-700 font-medium">SHA-256 fingerprinted</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E8E2D7] shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-xs font-medium">Verified Sellers</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="font-serif font-bold text-2xl text-[#1E2229]">100%</p>
          <span className="text-[10px] text-gray-500">Ownership declared</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E8E2D7] shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-xs font-medium">In Review Queue</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="font-serif font-bold text-2xl text-amber-900">{activeReportsCount}</p>
          <span className="text-[10px] text-amber-700 font-medium">Human verification pending</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E8E2D7] shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-xs font-medium">Resolved Cases</span>
            <FileCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="font-serif font-bold text-2xl text-emerald-900">{resolvedReportsCount}</p>
          <span className="text-[10px] text-emerald-700 font-medium">Investigated & settled</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#E8E2D7] gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("queue")}
          className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "queue"
              ? "border-orange-600 text-orange-600 bg-orange-50/40"
              : "border-transparent text-gray-600 hover:text-[#1E2229]"
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-orange-600" />
          <span>Moderation Review Queue</span>
          {activeReportsCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-orange-600 text-white">
              {activeReportsCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("registry")}
          className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "registry"
              ? "border-orange-600 text-orange-600 bg-orange-50/40"
              : "border-transparent text-gray-600 hover:text-[#1E2229]"
          }`}
        >
          <FileCheck className="w-4 h-4 text-orange-600" />
          <span>Protected Artwork Registry</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-gray-200 text-gray-700">
            {artworkRecords.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("legal")}
          className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "legal"
              ? "border-orange-600 text-orange-600 bg-orange-50/40"
              : "border-transparent text-gray-600 hover:text-[#1E2229]"
          }`}
        >
          <Scale className="w-4 h-4 text-orange-600" />
          <span>India IP Legal Guidance</span>
        </button>
      </div>

      {/* Tab 1: Moderation Review Queue */}
      {activeTab === "queue" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-white border border-[#E8E2D7]">
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Search report by artwork or reporter..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#FAF7F2] border border-gray-300 text-xs text-[#1E2229] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-3.5 h-3.5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 rounded-lg bg-[#FAF7F2] border border-gray-300 text-xs font-medium text-[#1E2229] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              >
                <option value="ALL">All Statuses ({reports.length})</option>
                <option value="Pending Review">Pending Review</option>
                <option value="Under Review">Under Review</option>
                <option value="Listing Temporarily Restricted">Listing Temporarily Restricted</option>
                <option value="Resolved / Dismissed">Resolved / Dismissed</option>
              </select>

              <button
                type="button"
                onClick={refreshData}
                className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-600"
                title="Refresh reports"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="rounded-xl bg-white border border-[#E8E2D7] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#FAF7F2] border-b border-[#E8E2D7] text-gray-600 font-semibold">
                    <th className="py-3 px-4">Report ID</th>
                    <th className="py-3 px-4">Artwork Subject</th>
                    <th className="py-3 px-4">Suspected Copy / URL</th>
                    <th className="py-3 px-4">Reporter</th>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Moderation Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredReports.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-gray-500">
                        <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                        <p className="font-semibold text-sm">No infringement reports match this filter</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">The moderation queue is currently clear.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredReports.map((report) => (
                      <tr key={report.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-orange-950">
                          {report.id}
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-[#1E2229] truncate max-w-[180px]">
                            {report.artworkTitle}
                          </p>
                          {report.artworkId && (
                            <span className="font-mono text-[10px] text-gray-400">
                              {report.artworkId}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 max-w-[200px]">
                          <a
                            href={report.suspectedCopiedUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-600 hover:underline truncate block font-mono text-[11px]"
                            title={report.suspectedCopiedUrl}
                          >
                            {report.suspectedCopiedUrl}
                          </a>
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-medium text-[#1E2229]">{report.reporterName}</p>
                          <span className="text-[10px] text-gray-400 font-mono">
                            {report.reporterRole}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap">
                          {new Date(report.submittedAt).toLocaleDateString("en-IN", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(
                              report.status
                            )}`}
                          >
                            <span>{report.status}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => setSelectedReportForInspect(report)}
                            className="px-3 py-1.5 rounded-lg border border-orange-200 bg-orange-50/60 hover:bg-orange-100 text-orange-900 font-semibold text-xs transition-colors cursor-pointer"
                          >
                            Inspect & Review
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Protected Artwork Registry */}
      {activeTab === "registry" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {artworkRecords.map((rec) => (
              <div
                key={rec.id}
                className="rounded-xl bg-white border border-[#E8E2D7] p-5 shadow-xs space-y-4 flex flex-col justify-between hover:border-orange-300 transition-all"
              >
                <div className="space-y-3">
                  <div className="relative w-full h-44 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                    <ProtectedImage
                      src={rec.watermarkedPreviewUrl || rec.rawOriginalUrl}
                      alt={rec.title}
                      fill
                      className="object-cover"
                    />
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/70 text-white font-mono">
                      {rec.id}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono uppercase font-bold text-orange-800">
                        {rec.category || "Studio Artwork"}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Verified</span>
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-base text-[#1E2229] leading-snug line-clamp-1">
                      {rec.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">By {rec.creatorName}</p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-gray-900 border border-gray-800 text-emerald-400 font-mono text-[10px] truncate select-all">
                    SHA-256: {rec.sha256Hash}
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[10px] text-gray-400 font-mono">
                    {new Date(rec.uploadedAt).toLocaleDateString("en-IN", {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    })}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRecord(rec);
                      setIsRecordModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    View Certificate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: India IP Legal Guidance */}
      {activeTab === "legal" && <CreatorLegalGuide />}

      {/* Modals */}
      <ArtworkRecordModal
        isOpen={isRecordModalOpen}
        onClose={() => {
          setIsRecordModalOpen(false);
          setSelectedRecord(null);
        }}
        record={selectedRecord}
        onReportStolen={(rec) => {
          setIsRecordModalOpen(false);
          setIsReportModalOpen(true);
        }}
      />

      <ReportStolenModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmitted={() => refreshData()}
      />

      {/* Inspection Modal for Moderation Review */}
      {selectedReportForInspect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-xl max-h-[85vh] flex flex-col rounded-2xl bg-white border border-[#E8E2D7] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-[#E8E2D7] bg-[#FAF7F2] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-orange-600" />
                <h3 className="font-serif font-bold text-base text-[#1E2229]">
                  Moderate Infringement Report ({selectedReportForInspect.id})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReportForInspect(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <span className="text-gray-500 block mb-0.5">Reported Artwork Subject:</span>
                <p className="font-serif font-bold text-base text-[#1E2229]">
                  {selectedReportForInspect.artworkTitle}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-orange-50/60 border border-orange-200/80 space-y-1">
                <span className="font-semibold text-orange-950 block">Suspected Copy / External URL:</span>
                <a
                  href={selectedReportForInspect.suspectedCopiedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-orange-700 hover:underline break-all block"
                >
                  {selectedReportForInspect.suspectedCopiedUrl}
                </a>
              </div>

              <div>
                <span className="text-gray-500 block mb-0.5">Infringement Allegation & Notes:</span>
                <p className="p-3 rounded-lg bg-[#FAF7F2] border border-[#E8E2D7] text-[#1E2229] leading-relaxed">
                  {selectedReportForInspect.description}
                </p>
              </div>

              {selectedReportForInspect.evidenceDescription && (
                <div>
                  <span className="text-gray-500 block mb-0.5">Supporting Evidence:</span>
                  <p className="p-2.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-700">
                    {selectedReportForInspect.evidenceDescription}
                  </p>
                </div>
              )}

              <div className="pt-2 border-t border-gray-200 space-y-3">
                <label className="block font-semibold text-[#1E2229]">
                  Update Moderation Workflow Status:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      "Pending Review",
                      "Under Review",
                      "Listing Temporarily Restricted",
                      "Resolved / Dismissed"
                    ] as InfringementStatus[]
                  ).map((st) => (
                    <button
                      type="button"
                      key={st}
                      onClick={() => handleStatusChange(selectedReportForInspect.id, st)}
                      className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                        selectedReportForInspect.status === st
                          ? "bg-orange-600 text-white border-orange-600 shadow-xs"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-[#E8E2D7] bg-[#FAF7F2] flex items-center justify-end shrink-0">
              <button
                type="button"
                onClick={() => setSelectedReportForInspect(null)}
                className="px-5 py-2 rounded-lg bg-orange-600 text-white font-semibold text-xs shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
