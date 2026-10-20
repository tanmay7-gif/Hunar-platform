"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useHunar } from "@/context/HunarContext";
import {
  TrendingUp,
  CheckCircle2,
  Circle,
  Sparkles,
  Milestone,
  ArrowRight,
  DollarSign,
  Target,
  Award,
  BookOpen,
  Briefcase
} from "lucide-react";

export default function SellerRoadmapPage() {
  const {
    roadmaps,
    completedMilestones,
    toggleMilestone,
    currentUser,
    language
  } = useHunar();

  const isHindi = language === "hi";

  const [selectedArtForm, setSelectedArtForm] = useState<string>("Pottery");

  const artFormTabs = [
    { id: "Pottery", label: "Studio Pottery & Ceramics" },
    { id: "Murals", label: "Urban & Cafe Murals" },
    { id: "Madhubani", label: "Madhubani & Folk Arts" },
    { id: "Mehndi", label: "Chemical-Free Bridal Henna" }
  ];

  const currentSteps = roadmaps[selectedArtForm] || roadmaps["Pottery"] || [];

  // Calculate completed count
  const allMilestoneIds = currentSteps.flatMap((s) => s.milestones.map((m) => m.id));
  const completedCount = allMilestoneIds.filter((id) => completedMilestones[id]).length;
  const progressPercent = allMilestoneIds.length > 0 ? Math.round((completedCount / allMilestoneIds.length) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-10 space-y-10">
      {/* Header Banner */}
      <div className="rounded-sm p-6 sm:p-8 border border-[#2C323D] bg-[#1E2229] text-[#FAF7F2] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-xs text-[10px] font-semibold uppercase tracking-wider bg-[#B4461F] text-white">
                Kala Career Engine
              </span>
              <span className="text-xs text-[#E5A93B] font-mono">
                Milestones to Steady Studio Revenue
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#FAF7F2]">
              {isHindi ? "कला रोडमैप" : "Kala Career Roadmap"}
            </h1>
          </div>

          <div className="bg-[#2A313D] p-5 rounded-sm border border-[#3E4756] min-w-[200px] shrink-0 text-center">
            <span className="text-[10px] uppercase font-semibold text-[#8A7561] block mb-1">Overall Studio Progress</span>
            <div className="text-3xl font-serif font-bold text-[#B4461F]">{progressPercent}%</div>
            <p className="text-[11px] text-[#FAF7F2]/80 mt-1">
              {completedCount} of {allMilestoneIds.length} milestones completed
            </p>
            <div className="w-full h-1.5 bg-[#1E2229] rounded-xs mt-2.5 overflow-hidden">
              <div
                className="h-full bg-[#B4461F] rounded-xs transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Art Form Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {artFormTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedArtForm(tab.id)}
            className={`px-4 py-2 rounded-sm text-xs font-medium whitespace-nowrap transition-colors duration-150 ${
              selectedArtForm === tab.id
                ? "bg-[#1E2229] text-[#FAF7F2]"
                : "bg-white text-[#635C53] border border-[#E8E2D7] hover:bg-[#FAF7F2]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Trajectory Steps */}
      <div className="space-y-6">
        {currentSteps.map((step, idx) => {
          const stepMilestones = step.milestones;
          const stepCompleted = stepMilestones.filter((m) => completedMilestones[m.id]).length;

          return (
            <div
              key={step.id}
              className="rounded-sm border border-[#E8E2D7] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-6 sm:p-7 space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8E2D7]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-sm bg-[#FAF0E6] text-[#B4461F] font-serif font-bold text-base flex items-center justify-center shrink-0 border border-[#F3CFBF]">
                    {step.stageNumber}
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#B4461F]">
                      Stage {step.stageNumber} • {step.timeframe}
                    </span>
                    <h3 className="font-serif font-bold text-lg text-[#1E2229]">
                      {step.artForm} Milestone Progression
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-[#00C853] dark:text-[#00E676] bg-[#00E676]/15 px-3 py-1 rounded-xs border border-[#00E676]/40">
                    Benchmark: {step.incomeBenchmark}
                  </span>
                  <span className="text-xs text-[#635C53] font-medium">
                    {stepCompleted}/{stepMilestones.length} Done
                  </span>
                </div>
              </div>

              {step.toolsToLearn && step.toolsToLearn.length > 0 && (
                <div className="flex items-center gap-2 mt-3 mb-4 text-xs">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8A7561]">Key Studio Focus:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {step.toolsToLearn.map((tool, tIdx) => (
                      <span key={tIdx} className="px-2 py-0.5 rounded-xs bg-[#FAF7F2] border border-[#E8E2D7] text-[#1A1816] text-[11px] font-medium">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Milestones Checklist */}
              <div className="space-y-3">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8A7561] block">
                  Actionable Milestones (Click to toggle progress):
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {stepMilestones.map((milestone) => {
                    const done = completedMilestones[milestone.id];

                    return (
                      <div
                        key={milestone.id}
                        onClick={() => toggleMilestone(milestone.id)}
                        className={`p-3.5 rounded-sm border cursor-pointer transition-colors duration-150 flex items-start gap-3 select-none ${
                          done
                            ? "bg-[#00E676]/10 border-[#00E676]/40 text-[#1A1816]"
                            : "bg-[#FAF7F2] border-[#E8E2D7] hover:bg-[#F4EFE6] text-[#1A1816]"
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {done ? (
                            <CheckCircle2 className="w-4 h-4 text-[#00C853] dark:text-[#00E676]" />
                          ) : (
                            <Circle className="w-4 h-4 text-[#D3CBBE] hover:text-[#B4461F]" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-xs bg-white border border-[#E8E2D7] text-[#635C53]">
                              {milestone.actionTag}
                            </span>
                            <p className={`text-xs font-semibold ${done ? "text-[#00C853] dark:text-[#00E676] line-through" : "text-[#1E2229]"}`}>
                              {milestone.task}
                            </p>
                          </div>
                          <p className="text-[11px] text-[#635C53] leading-snug mt-1">
                            {milestone.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Opportunities Radar CTA */}
              <div className="mt-5 p-3.5 rounded-sm bg-[#FAF7F2] border border-[#E8E2D7] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#B4461F] shrink-0" />
                  <span className="text-[#635C53] font-medium">
                    Ready to bid on commercial gigs matching your Stage {idx + 1} mastery?
                  </span>
                </div>
                <Link
                  href="/dashboard/seller/opportunities"
                  className="font-medium text-[#B4461F] hover:underline shrink-0 ml-2"
                >
                  Explore Gigs Radar ➔
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
