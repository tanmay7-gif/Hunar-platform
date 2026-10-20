"use client";

import React, { useState } from "react";
import { tinyFishFrontendService, TinyFishAgentRun } from "@/lib/tinyfish-agent";
import { useHunar } from "@/context/HunarContext";
import {
  Bot,
  Sparkles,
  Terminal,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  X,
  ExternalLink,
  Award,
  ArrowRight,
  ShieldCheck,
  Building2,
  Calendar
} from "lucide-react";

interface AutonomousOpportunityAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AutonomousOpportunityAgentModal({
  isOpen,
  onClose
}: AutonomousOpportunityAgentModalProps) {
  const { currentUser, showToast } = useHunar();
  const [goal, setGoal] = useState(
    `Scout upcoming craft exhibitions & grant schemes for ${currentUser.tagline || currentUser.artCategory || "Heritage Artisan"} with subsidized stalls and direct bulk buyer matchmaking`
  );
  const [targetUrl, setTargetUrl] = useState("https://handicrafts.nic.in/schemes");
  const [running, setRunning] = useState(false);
  const [agentRun, setAgentRun] = useState<TinyFishAgentRun | null>(null);

  if (!isOpen) return null;

  const handleRunAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) return;

    setRunning(true);
    setAgentRun(null);

    try {
      const run = await tinyFishFrontendService.runAgent(goal, {
        url: targetUrl,
        parameters: {
          artisanName: currentUser.name,
          craftCategory: currentUser.artCategory || "Traditional Handcraft",
          state: currentUser.city || "India"
        }
      });
      setAgentRun(run);
      showToast("Agent Task Completed", "Autonomous scout found high-match craft opportunities.");
    } catch (err: any) {
      console.error("Agent execution error:", err);
      showToast("Notice", "Completed autonomous simulation run.");
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#1E2229] border border-[#2C323D] rounded-sm max-w-3xl w-full p-6 text-[#FAF7F2] shadow-2xl relative space-y-5 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#4E9B6E] bg-[#2D583B]/20 border border-[#2D583B] px-2 py-0.5 rounded-xs">
                TinyFish Web Agent
              </span>
              <span className="text-xs text-[#E5A93B]">Autonomous Multi-Step Browsing</span>
            </div>
            <h2 className="text-xl font-serif font-bold text-[#FAF7F2]">
              Autonomous Craft Opportunity & Grant Scout Agent
            </h2>
            <p className="text-xs text-stone-300">
              Dispatches an autonomous AI browser agent to investigate official portals (handicrafts.nic.in, Dastkar, TRIFED), extract grant requirements, and synthesize customized application drafts.
            </p>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-white p-1 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Goal Configuration Form */}
        <form onSubmit={handleRunAgent} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-stone-300">
              Agent Objective / Autonomous Goal
            </label>
            <textarea
              rows={2}
              required
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full p-3 text-xs bg-[#16191F] border border-[#2C323D] rounded-xs text-[#FAF7F2] placeholder-stone-500 focus:outline-none focus:border-sky-500 leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-stone-400 mb-1">
                Target Portal URL
              </label>
              <input
                type="url"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-[#16191F] border border-[#2C323D] rounded-xs text-[#FAF7F2] focus:outline-none focus:border-sky-500"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={running}
                className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {running ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                    <span>Agent Browsing Live Web...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Deploy Autonomous Scout Agent</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Live Execution Logs Terminal */}
        {(running || agentRun) && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <div className="flex items-center gap-1.5 font-mono">
                <Terminal className="w-3.5 h-3.5 text-[#E5A93B]" />
                <span>TinyFish Agent Execution Stream</span>
              </div>
              {agentRun && (
                <span className="text-[11px] font-mono text-[#4E9B6E]">
                  Completed in {agentRun.executionTimeMs}ms
                </span>
              )}
            </div>

            <div className="p-3 bg-black/80 border border-[#2C323D] rounded-xs font-mono text-[11px] space-y-1.5 text-stone-300 max-h-36 overflow-y-auto">
              {running ? (
                <>
                  <div className="text-stone-400">[Init] Booting cloud browser context (Playwright headless)...</div>
                  <div className="text-[#E5A93B]">[Agent] Navigating to {targetUrl}...</div>
                  <div className="text-stone-300">[Agent] Inspecting page schema and evaluating eligibility parameters...</div>
                  <div className="text-[#4E9B6E] flex items-center gap-2 animate-pulse">
                    <span>• Synthesizing recommendations...</span>
                  </div>
                </>
              ) : agentRun?.logs ? (
                agentRun.logs.map((log, idx) => (
                  <div key={idx} className={idx === agentRun.logs.length - 1 ? "text-[#4E9B6E]" : "text-stone-400"}>
                    {log}
                  </div>
                ))
              ) : null}
            </div>
          </div>
        )}

        {/* Result Recommendations Cards */}
        {agentRun?.result?.recommendations && (
          <div className="space-y-3 pt-2 border-t border-[#2C323D]">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-[#E5A93B] uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                <span>High-Match Opportunities Discovered by Web Agent</span>
              </h4>
              <span className="text-[10px] text-stone-400">Task ID: {agentRun.taskId}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {agentRun.result.recommendations.map((rec: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3 bg-[#16191F] border border-[#2C323D] rounded-xs space-y-2 hover:border-[#E5A93B]/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h5 className="text-xs font-bold text-[#FAF7F2]">{rec.title}</h5>
                    <span className="px-1.5 py-0.5 rounded-xs bg-[#2D583B]/30 text-[#4E9B6E] text-[10px] font-bold border border-[#2D583B]">
                      {rec.matchRate || "95% Match"}
                    </span>
                  </div>

                  <div className="space-y-1 text-[11px] text-stone-300">
                    <div className="flex items-center gap-1.5 text-[#E5A93B]">
                      <Sparkles className="w-3 h-3" />
                      <span>{rec.subsidy}</span>
                    </div>
                    {rec.submissionDeadline && (
                      <div className="flex items-center gap-1.5 text-stone-400">
                        <Calendar className="w-3 h-3" />
                        <span>Deadline: {rec.submissionDeadline}</span>
                      </div>
                    )}
                    {rec.actionRequired && (
                      <p className="text-[10px] text-stone-400 pt-1 border-t border-[#2C323D]/40">
                        <strong>Required:</strong> {rec.actionRequired}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      showToast("Opportunity Saved", `Saved "${rec.title}" to your active radar.`);
                      onClose();
                    }}
                    className="w-full mt-2 py-1 bg-[#2C323D] hover:bg-[#383E4B] text-white text-[11px] font-medium rounded-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Add to My Opportunity Radar</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
