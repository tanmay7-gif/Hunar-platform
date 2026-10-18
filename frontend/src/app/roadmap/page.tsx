"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useHunar } from "@/context/HunarContext";
import {
  Compass,
  CheckCircle2,
  Circle,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
  Wrench,
  BookOpen,
  DollarSign,
  Target
} from "lucide-react";

export default function KalaRoadmapPage() {
  const { language, roadmaps, completedMilestones, toggleMilestone, currentPersona } = useHunar();
  const isHindi = language === "hi";

  // Default to persona's craft if found, or Murals
  const initialCraft =
    currentPersona.artCategory && roadmaps[currentPersona.artCategory]
      ? currentPersona.artCategory
      : "Murals";

  const [selectedArtForm, setSelectedArtForm] = useState<string>(initialCraft);

  const availableCrafts = [
    { id: "Murals", label: isHindi ? "कैफे व भित्ति चित्र (Murals)" : "Murals & Wall Art" },
    { id: "Pottery", label: isHindi ? "टेराकोटा व पॉटरी (Pottery)" : "Studio Pottery" },
    { id: "Madhubani & Folk", label: isHindi ? "मधुबनी व लोक कला (Folk)" : "Madhubani & Folk" },
    { id: "Bridal Mehndi", label: isHindi ? "ब्राइडल मेहंदी (Mehndi)" : "Bridal Mehndi" }
  ];

  const currentSteps = roadmaps[selectedArtForm] || roadmaps["Murals"];

  // Calculate completion percentage
  const allMilestones = currentSteps.flatMap((s) => s.milestones);
  const completedCount = allMilestones.filter((m) => completedMilestones[m.id]).length;
  const progressPercent = Math.round((completedCount / (allMilestones.length || 1)) * 100);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#E8E2D7]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#8A7561] mb-2">
              {isHindi ? "कला रोडमैप ढांचा" : "Artisan Career Trajectory"}
            </p>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1E2229]">
              {isHindi ? "शिल्प से स्थायी आजीविका का रोडमैप" : "Grassroots Creator Career Trajectory"}
            </h1>
            <p className="text-xs sm:text-sm text-[#635C53] mt-2 max-w-2xl">
              {isHindi
                ? "महीना 1, 3, और 6 का स्पष्ट व्यावहारिक खाका। वर्ग-फुट की दरें, अनुबंध सुरक्षा और कमर्शियल क्लाइंट्स हासिल करने की चरणबद्ध सूची।"
                : "Field-tested playbooks for independent makers: unit economics, deposit contracts, and steady workshop commissions."}
            </p>
          </div>

          {/* Overall Progress Tracker Badge */}
          <div className="p-5 rounded-sm bg-white border border-[#E8E2D7] shadow-[0_2px_8px_rgba(0,0,0,0.04)] shrink-0 w-full md:w-64">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-[#1A1816] flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-[#B4461F]" />
                {isHindi ? "रोडमैप पूर्णता" : "Milestones Done"}
              </span>
              <span className="font-bold text-[#B4461F]">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-xs bg-[#FAF0E6] overflow-hidden">
              <div
                className="h-full bg-[#B4461F] rounded-xs transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-[#635C53] mt-2 text-right">
              {completedCount} of {allMilestones.length} {isHindi ? "पड़ाव पूरे हुए" : "milestones completed"}
            </p>
          </div>
        </div>

        {/* Craft Selector Tabs */}
        <div className="flex items-center gap-2 py-6 overflow-x-auto no-scrollbar">
          {availableCrafts.map((craft) => {
            const isSelected = selectedArtForm === craft.id;
            return (
              <button
                key={craft.id}
                onClick={() => setSelectedArtForm(craft.id)}
                className={`px-4 py-2 rounded-sm text-xs font-medium whitespace-nowrap transition-colors duration-150 flex items-center gap-2 ${
                  isSelected
                    ? "bg-[#1E2229] text-[#FAF7F2]"
                    : "bg-white border border-[#E8E2D7] text-[#1A1816] hover:bg-[#F4EFE6]"
                }`}
              >
                <span>{craft.label}</span>
              </button>
            );
          })}
        </div>

        {/* Timeline Progression Columns (Month 1, Month 3, Month 6) */}
        <div className="space-y-8 pt-2">
          {currentSteps.map((step) => {
            const stepMilestones = step.milestones;
            const stepDoneCount = stepMilestones.filter((m) => completedMilestones[m.id]).length;
            const isStepComplete = stepDoneCount === stepMilestones.length;

            return (
              <div
                key={step.id}
                className="rounded-sm bg-white border border-[#E8E2D7] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
              >
                {/* Stage Header Banner */}
                <div className="p-5 sm:p-6 bg-[#FAF7F2] border-b border-[#E8E2D7] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-sm bg-[#B4461F] text-white flex items-center justify-center font-serif text-lg font-bold shrink-0">
                      0{step.stageNumber}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#B4461F]">
                        Stage 0{step.stageNumber}
                      </span>
                      <h3 className="font-serif text-xl font-bold text-[#1E2229]">
                        {isHindi ? step.timeframeHindi : step.timeframe}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div className="px-3.5 py-1.5 rounded-sm bg-white border border-[#E8E2D7] text-[#1A1816]">
                      <span className="text-[#635C53] mr-1.5">{isHindi ? "आय बेंचमार्क:" : "Income Benchmark:"}</span>
                      <span className="font-bold text-[#B4461F] font-serif text-sm">
                        {step.incomeBenchmark}
                      </span>
                    </div>

                    {isStepComplete && (
                      <span className="px-2.5 py-1 rounded-sm bg-[#2D583B] text-white text-[10px] font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#E5A93B]" />
                        <span>Completed</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 sm:p-6 space-y-6">
                  {/* Tools / Core Competencies To Learn */}
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#8A7561] mb-2 flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5 text-[#B4461F]" />
                      <span>{isHindi ? "इस चरण में आवश्यक टूल्स व क्षमताएं:" : "Tools & Business Skills to Master:"}</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {step.toolsToLearn.map((tool) => (
                        <span
                          key={tool}
                          className="px-2.5 py-1 rounded-xs text-xs font-medium bg-[#FAF7F2] text-[#1A1816] border border-[#E8E2D7]"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Interactive Milestones Checklist */}
                  <div className="space-y-3">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#8A7561] mb-1 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-[#B4461F]" />
                      <span>{isHindi ? "कार्रवाई योग्य पड़ाव सूची:" : "Actionable Checklist (Click to Mark Complete):"}</span>
                    </p>

                    <div className="grid grid-cols-1 gap-3">
                      {stepMilestones.map((milestone) => {
                        const isDone = !!completedMilestones[milestone.id];
                        return (
                          <div
                            key={milestone.id}
                            onClick={() => toggleMilestone(milestone.id)}
                            className={`p-4 rounded-sm border transition-colors duration-150 cursor-pointer flex items-start gap-3.5 ${
                              isDone
                                ? "bg-[#EEF4F0] border-[#C5DCCB] text-[#1A1816]"
                                : "bg-white border-[#E8E2D7] hover:bg-[#FAF7F2]"
                            }`}
                          >
                            <div className="mt-0.5 shrink-0">
                              {isDone ? (
                                <CheckCircle2 className="w-5 h-5 text-[#2D583B]" />
                              ) : (
                                <Circle className="w-5 h-5 text-[#D3CBBE] hover:text-[#B4461F]" />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <h4
                                  className={`text-sm font-semibold ${
                                    isDone ? "line-through text-[#8A7561]" : "text-[#1A1816]"
                                  }`}
                                >
                                  {isHindi ? milestone.taskHindi : milestone.task}
                                </h4>
                                <span className="px-2 py-0.5 rounded-xs text-[10px] font-semibold bg-[#FAF0E6] text-[#B4461F] border border-[#F3CFBF] shrink-0">
                                  {milestone.actionTag}
                                </span>
                              </div>
                              <p className="text-xs text-[#635C53] mt-1 leading-relaxed">
                                {milestone.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Opportunities Radar CTA */}
        <div className="mt-12 p-8 rounded-sm bg-[#FAF7F2] border border-[#E8E2D7] flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="space-y-1">
            <h3 className="font-serif text-xl font-bold text-[#1E2229]">
              {isHindi ? "तैयार हैं अपने अगले बड़े प्रोजेक्ट के लिए?" : "Ready for Verified Craft Opportunities?"}
            </h3>
            <p className="text-xs text-[#635C53]">
              {isHindi
                ? "होटल म्यूरल्स, शादी के ऑर्डर और कॉर्पोरेट उपहारों के खुले अवसरों पर सीधी बोली लगाएं।"
                : "Browse verified listings for commercial murals, folk decor, and direct commissioned works."}
            </p>
          </div>

          <Link
            href="/opportunities"
            className="btn-terracotta px-5 py-2.5 rounded-sm text-xs font-medium inline-flex items-center gap-2 shrink-0 transition-colors duration-150"
          >
            <span>{isHindi ? "खुले अवसर देखें" : "View Opportunities"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
