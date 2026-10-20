"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useHunar } from "@/context/HunarContext";
import { useLanguage } from "@/context/LanguageContext";
import {
  MOCK_COURIER_RATE_COMPARISONS,
  MOCK_RURAL_HUBS,
  MOCK_COURIER_SOPS
} from "../../../../../tinyfish/src/mock/fixtures";
import {
  ShieldAlert,
  Truck,
  MapPin,
  Activity,
  Bot,
  Terminal,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Layers,
  ArrowRight,
  ShieldCheck,
  Package,
  Globe,
  Monitor
} from "lucide-react";

export default function AdminLogisticsMonitorPage() {
  const { currentUser, showToast } = useHunar();
  const { currentLanguage } = useLanguage();
  const isHindi = currentLanguage === "hi";

  const [activeTab, setActiveTab] = useState<"monitor" | "hubs" | "logistics">("monitor");
  const [selectedHub, setSelectedHub] = useState(MOCK_RURAL_HUBS[0]);
  const [agentGoal, setAgentGoal] = useState("Compare courier rates for 3.5kg terracotta pottery from Khurja to New Delhi");
  const [agentRunning, setAgentRunning] = useState(false);
  const [agentLogs, setAgentLogs] = useState<string[]>([
    "[System] TinyFish Agent microservice operational",
    "[Infra] Headless CDP sandbox listening on 1440x900 container",
    "[Health] All 4 API pipelines active: Search, Fetch, Web Agent, Browser"
  ]);

  const [healthStatus, setHealthStatus] = useState<any>({
    status: "connected",
    latency: "128ms",
    activeTasks: 4
  });

  const handleRunAgentSimulation = async () => {
    setAgentRunning(true);
    setAgentLogs((prev) => [
      ...prev,
      `[Agent] Dispatched goal: "${agentGoal}"`,
      `[Agent] Querying India Post Speed Post API for PIN ${selectedHub.pinCode}...`,
      `[Agent] Scraping Delhivery Direct B2C matrix for fragile consignment...`,
      `[Agent] Inspecting BlueDart Apex transit protection surcharge...`,
      `[Agent] Benchmark complete: India Post lowest rate (₹145), Delhivery best direct studio pickup (₹180)`
    ]);

    setTimeout(() => {
      setAgentRunning(false);
      showToast("Agent Task Completed", "Multi-carrier benchmark synchronized.");
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-10 space-y-10">
      {/* Admin Header Banner */}
      <div className="rounded-sm p-6 sm:p-8 border border-[#2C323D] bg-[#1E2229] text-[#FAF7F2] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-xs text-[10px] font-semibold uppercase tracking-wider bg-[#B4461F] text-white">
                Admin Control Tower
              </span>
              <span className="text-xs text-[#E5A93B] font-mono">
                Logistics & TinyFish Monitor
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#FAF7F2]">
              {isHindi ? "लॉजिस्टिक्स हब मॉनिटर" : "Rural Hubs & Logistics Monitor"}
            </h1>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            <div className="px-3.5 py-2 rounded-sm bg-[#223528] border border-[#2D583B] text-xs">
              <span className="text-[#86A890] block text-[10px] uppercase font-semibold">Active Hubs:</span>
              <span className="text-sm font-bold text-[#81C784]">{MOCK_RURAL_HUBS.length} Rural Clusters</span>
            </div>
            <div className="px-3.5 py-2 rounded-sm bg-[#252B35] border border-[#374151] text-xs font-mono">
              <span className="text-stone-400 block text-[10px] uppercase font-semibold">Agent Engine:</span>
              <span className="text-sm font-bold text-[#E5A93B]">@hunar/tinyfish v1.0</span>
            </div>
          </div>
        </div>

        {/* Quick KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#2C323D] text-xs">
          <div>
            <span className="text-stone-400 text-[10px] uppercase font-semibold">Search API:</span>
            <p className="font-semibold text-sm text-[#4E9B6E] mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 99.8% Online
            </p>
          </div>
          <div>
            <span className="text-stone-400 text-[10px] uppercase font-semibold">Fetch API:</span>
            <p className="font-semibold text-sm text-[#4E9B6E] mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Scraping SOPs
            </p>
          </div>
          <div>
            <span className="text-stone-400 text-[10px] uppercase font-semibold">Web Agent:</span>
            <p className="font-semibold text-sm text-[#E5A93B] mt-0.5 flex items-center gap-1">
              <Bot className="w-3.5 h-3.5" /> Multi-Step Ready
            </p>
          </div>
          <div>
            <span className="text-stone-400 text-[10px] uppercase font-semibold">Cloud Browser:</span>
            <p className="font-semibold text-sm text-[#FAF7F2] mt-0.5 flex items-center gap-1">
              <Monitor className="w-3.5 h-3.5 text-[#E5A93B]" /> Playwright CDP Active
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-3 border-b border-[#E8E2D7] pb-2">
        <button
          onClick={() => setActiveTab("monitor")}
          className={`px-4 py-2 rounded-sm text-xs font-medium transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === "monitor"
              ? "border-[#B4461F] text-[#B4461F] bg-[#FAF7F2]"
              : "border-transparent text-[#635C53] hover:text-[#1E2229]"
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>TinyFish Live Agent Telemetry</span>
        </button>

        <button
          onClick={() => setActiveTab("hubs")}
          className={`px-4 py-2 rounded-sm text-xs font-medium transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === "hubs"
              ? "border-[#B4461F] text-[#B4461F] bg-[#FAF7F2]"
              : "border-transparent text-[#635C53] hover:text-[#1E2229]"
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Rural Feeder Hubs ({MOCK_RURAL_HUBS.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("logistics")}
          className={`px-4 py-2 rounded-sm text-xs font-medium transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === "logistics"
              ? "border-[#B4461F] text-[#B4461F] bg-[#FAF7F2]"
              : "border-transparent text-[#635C53] hover:text-[#1E2229]"
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Courier Benchmarks & Fragile SOPs</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: TINYFISH AGENT TELEMETRY & RUNNER                  */}
      {/* ========================================================= */}
      {activeTab === "monitor" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Dispatch Action Card */}
            <div className="lg:col-span-1 bg-white border border-[#E8E2D7] rounded-sm p-6 shadow-sm space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-[#B4461F]">Autonomous Web Agent</span>
                <h3 className="font-serif font-bold text-base text-[#1E2229]">
                  Trigger Multi-Carrier Benchmark
                </h3>
                <p className="text-xs text-[#635C53] leading-relaxed">
                  Deploys TinyFish Web Agent to browse carrier calculators and benchmark shipping rates for fragile crafts.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#1E2229] mb-1">
                    Origin Cluster Hub
                  </label>
                  <select
                    value={selectedHub.hubId}
                    onChange={(e) => {
                      const h = MOCK_RURAL_HUBS.find((hub) => hub.hubId === e.target.value);
                      if (h) setSelectedHub(h);
                    }}
                    className="w-full p-2 text-xs bg-[#FAF7F2] border border-[#D3CBBE] rounded-xs text-[#1E2229] focus:outline-none focus:border-[#B4461F]"
                  >
                    {MOCK_RURAL_HUBS.map((hub) => (
                      <option key={hub.hubId} value={hub.hubId}>
                        {hub.clusterName} ({hub.state} - {hub.pinCode})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#1E2229] mb-1">
                    Agent Goal
                  </label>
                  <textarea
                    rows={3}
                    value={agentGoal}
                    onChange={(e) => setAgentGoal(e.target.value)}
                    className="w-full p-2.5 text-xs bg-[#FAF7F2] border border-[#D3CBBE] rounded-xs text-[#1E2229] focus:outline-none focus:border-[#B4461F]"
                  />
                </div>

                <button
                  onClick={handleRunAgentSimulation}
                  disabled={agentRunning}
                  className="w-full py-2.5 bg-[#B4461F] hover:bg-[#963816] text-white text-xs font-semibold rounded-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {agentRunning ? (
                    <>
                      <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                      <span>Executing Multi-Step Browsing...</span>
                    </>
                  ) : (
                    <>
                      <Bot className="w-3.5 h-3.5" />
                      <span>Dispatch TinyFish Web Agent</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right: Real-time Terminal Log Stream */}
            <div className="lg:col-span-2 bg-[#16191F] border border-[#2C323D] rounded-sm p-6 shadow-sm space-y-3 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-[#2C323D] pb-3 text-xs">
                <div className="flex items-center gap-2 font-mono text-stone-300">
                  <Terminal className="w-4 h-4 text-[#E5A93B]" />
                  <span>TinyFish Microservice Event Stream</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-[#4E9B6E]">
                  <span className="w-2 h-2 rounded-full bg-[#4E9B6E] animate-pulse" />
                  <span>Live Stream Active</span>
                </div>
              </div>

              <div className="font-mono text-xs text-stone-300 space-y-2 h-64 overflow-y-auto p-2 bg-black/50 rounded-xs">
                {agentLogs.map((log, idx) => (
                  <div key={idx} className={idx === agentLogs.length - 1 ? "text-[#E5A93B]" : "text-stone-400"}>
                    {log}
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-stone-400 font-mono">
                <span>Microservice: @hunar/tinyfish (Isolated Package)</span>
                <span>Port: Next.js :3000 / Express :5000</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: RURAL FEEDER HUBS                                  */}
      {/* ========================================================= */}
      {activeTab === "hubs" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_RURAL_HUBS.map((hub) => (
              <div
                key={hub.hubId}
                className="p-6 bg-white border border-[#E8E2D7] rounded-sm shadow-sm space-y-4 hover:border-[#B4461F]/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[#E5A93B] uppercase font-bold bg-[#FAF7F2] border border-[#E8DEC8] px-2 py-0.5 rounded-xs">
                      {hub.hubId} • PIN {hub.pinCode}
                    </span>
                    <h3 className="font-serif font-bold text-lg text-[#1E2229]">
                      {hub.clusterName}
                    </h3>
                    <p className="text-xs text-[#635C53] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#B4461F]" />
                      <span>{hub.state}, India</span>
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-xs bg-[#2D583B]/10 text-[#2D583B] text-[11px] font-semibold border border-[#2D583B]/30">
                    {hub.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-[#E8E2D7]">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-semibold">Primary Craft:</span>
                    <p className="font-medium text-[#1E2229] mt-0.5">{hub.primaryCraft}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-semibold">Active Artisans:</span>
                    <p className="font-bold text-[#B4461F] mt-0.5">{hub.activeArtisansCount} Masters</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-semibold">Daily Capacity:</span>
                    <p className="font-medium text-[#1E2229] mt-0.5">{hub.dailyConsignmentCapacity}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-semibold">Partner Couriers:</span>
                    <p className="font-medium text-[#2D583B] mt-0.5">{hub.partnerCouriers.join(", ")}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: COURIER RATE BENCHMARKS & FRAGILE SOPS            */}
      {/* ========================================================= */}
      {activeTab === "logistics" && (
        <div className="space-y-6">
          {/* Rate Benchmarks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {MOCK_COURIER_RATE_COMPARISONS.map((courier, idx) => (
              <div
                key={idx}
                className="p-5 bg-white border border-[#E8E2D7] rounded-sm shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <span className="px-2 py-0.5 rounded-xs bg-[#B4461F]/10 text-[#B4461F] text-[10px] font-bold border border-[#B4461F]/20">
                    {courier.badge}
                  </span>
                  <h4 className="font-bold text-sm text-[#1E2229]">{courier.provider}</h4>
                  <p className="text-2xl font-serif font-bold text-[#B4461F]">₹{courier.estimatedCost}</p>
                  <p className="text-xs text-stone-500">Transit: <strong>{courier.transitDays}</strong></p>
                </div>

                <div className="space-y-1 text-[11px] text-stone-600 pt-2 border-t border-[#E8E2D7]">
                  <p><strong>Rural Reach:</strong> {courier.ruralReachScore}%</p>
                  <p><strong>Tracking:</strong> {courier.trackingQuality}</p>
                  <p className="text-[10px] text-[#635C53] mt-1">{courier.bestFor}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Fragile Packaging SOPs */}
          <div className="p-6 bg-[#FAF7F2] border border-[#E8DEC8] rounded-sm space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#2D583B]" />
              <h3 className="font-serif font-bold text-base text-[#1E2229]">
                Fragile Craft Shipping Standards (TinyFish Fetch SOPs)
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#635C53]">
              <div className="p-4 bg-white border border-[#E8E2D7] rounded-xs space-y-2">
                <h4 className="font-bold text-sm text-[#B4461F]">Terracotta & Studio Pottery SOP</h4>
                <ul className="list-disc list-inside space-y-1">
                  {MOCK_COURIER_SOPS["terracotta-pottery"].packagingRequirements.map((r: string, i: number) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
              <div className="p-4 bg-white border border-[#E8E2D7] rounded-xs space-y-2">
                <h4 className="font-bold text-sm text-[#2D583B]">Handloom & Folk Canvas SOP</h4>
                <ul className="list-disc list-inside space-y-1">
                  {MOCK_COURIER_SOPS["textiles-handloom"].packagingRequirements.map((r: string, i: number) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
