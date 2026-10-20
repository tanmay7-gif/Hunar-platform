"use client";

import React, { useState } from "react";
import { tinyFishFrontendService, TinyFishBrowserResult } from "@/lib/tinyfish-agent";
import {
  Monitor,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  X,
  ExternalLink,
  Lock,
  Terminal,
  Camera,
  Layers
} from "lucide-react";

interface CloudBrowserViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialUrl?: string;
}

export function CloudBrowserViewerModal({
  isOpen,
  onClose,
  initialUrl = "https://ipindia.gov.in/gi-records"
}: CloudBrowserViewerModalProps) {
  const [url, setUrl] = useState(initialUrl);
  const [loading, setLoading] = useState(false);
  const [browserResult, setBrowserResult] = useState<TinyFishBrowserResult | null>(null);

  if (!isOpen) return null;

  const handleExecute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    try {
      const result = await tinyFishFrontendService.executeBrowser(url);
      setBrowserResult(result);
    } catch (err) {
      console.error("Cloud browser error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#1E2229] border border-[#2C323D] rounded-sm max-w-3xl w-full p-6 text-[#FAF7F2] shadow-2xl relative space-y-5 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#E5A93B] bg-[#E5A93B]/10 border border-[#E5A93B]/30 px-2 py-0.5 rounded-xs">
                TinyFish Browser Infrastructure
              </span>
              <span className="text-xs text-stone-400">Playwright / CDP Cloud Browser Sandbox</span>
            </div>
            <h2 className="text-xl font-serif font-bold text-[#FAF7F2]">
              Remote Craft Verification & Cloud Browser Runner
            </h2>
            <p className="text-xs text-stone-300">
              Executes headless Playwright/CDP sessions in the TinyFish cloud container to inspect official registries, verify GI tag licenses, and capture authenticated DOM snapshots.
            </p>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-white p-1 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Browser URL Bar */}
        <form onSubmit={handleExecute} className="flex items-center gap-2 bg-[#16191F] border border-[#2C323D] p-1.5 rounded-xs">
          <div className="flex items-center gap-1.5 text-stone-400 px-2 text-xs">
            <Lock className="w-3.5 h-3.5 text-[#4E9B6E]" />
            <span className="font-mono text-[11px] text-[#4E9B6E]">https://</span>
          </div>
          <input
            type="text"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Official craft registry URL (e.g. ipindia.gov.in/gi-records)"
            className="flex-1 bg-transparent text-xs text-[#FAF7F2] focus:outline-none placeholder-stone-500 font-mono"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xs flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Monitor className="w-3.5 h-3.5" />}
            <span>Launch Cloud Browser</span>
          </button>
        </form>

        {/* Viewport Simulation / Result */}
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-stone-400 text-xs bg-[#16191F] border border-[#2C323D] rounded-xs">
            <RefreshCw className="w-6 h-6 animate-spin text-[#E5A93B]" />
            <span>Spawning Chromium instance in TinyFish Cloud Sandbox (1440x900)...</span>
          </div>
        ) : browserResult ? (
          <div className="space-y-4">
            {/* Viewport Header Bar */}
            <div className="flex items-center justify-between text-xs bg-[#16191F] border border-[#2C323D] p-2 rounded-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4E9B6E]"></span>
                <span className="font-medium text-[#FAF7F2]">{browserResult.title}</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-stone-400 font-mono">
                <span>Playwright CDP v1.57</span>
                <span>Rendered in {browserResult.executionTimeMs}ms</span>
              </div>
            </div>

            {/* Visual Viewport Screenshot */}
            <div className="relative border border-[#2C323D] rounded-xs overflow-hidden bg-black aspect-video max-h-64 flex items-center justify-center">
              <img
                src={browserResult.screenshotUrl}
                alt="Cloud Browser Viewport"
                className="w-full h-full object-cover opacity-85"
              />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-xs bg-black/80 border border-white/10 text-[10px] text-stone-300 flex items-center gap-1 font-mono">
                <Camera className="w-3 h-3 text-[#E5A93B]" />
                <span>TinyFish Cloud Viewport Snapshot</span>
              </div>
              <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-xs bg-[#2D583B]/90 text-white text-[10px] font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Verified SSL/TLS Origin</span>
              </div>
            </div>

            {/* Console Log Stream */}
            <div className="p-3 bg-black/75 border border-[#2C323D] rounded-xs font-mono text-[10px] space-y-1 text-stone-400">
              <div className="text-[#E5A93B] font-bold pb-1 flex items-center gap-1">
                <Terminal className="w-3 h-3" />
                <span>Cloud CDP DevTools Protocol Logs:</span>
              </div>
              {browserResult.consoleLogs?.map((log, i) => (
                <div key={i} className="text-stone-300">
                  {log}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-stone-400 bg-[#16191F] border border-[#2C323D] rounded-xs space-y-2">
            <Monitor className="w-8 h-8 text-[#E5A93B] mx-auto opacity-70" />
            <p>Click "Launch Cloud Browser" to inspect any external craft authority portal with remote CDP execution.</p>
          </div>
        )}
      </div>
    </div>
  );
}
