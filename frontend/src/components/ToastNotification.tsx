"use client";

import React from "react";
import { useHunar } from "@/context/HunarContext";
import { CheckCircle2, Info, MessageSquare, X } from "lucide-react";

export function ToastNotification() {
  const { toast, dismissToast } = useHunar();

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full px-4 animate-in fade-in slide-in-from-bottom-5 duration-150">
      <div className="bg-[#1E2229] text-[#FAF7F2] p-4 rounded-sm shadow-lg border border-[#3E4756] flex items-start gap-3.5">
        <div className="mt-0.5 shrink-0">
          {toast.type === "success" && (
            <div className="w-7 h-7 rounded-sm bg-[#B4461F]/20 flex items-center justify-center text-[#E5A93B]">
              <CheckCircle2 className="w-4 h-4 text-[#E5A93B]" />
            </div>
          )}
          {toast.type === "info" && (
            <div className="w-7 h-7 rounded-sm bg-blue-900/30 flex items-center justify-center text-blue-300">
              <Info className="w-4 h-4" />
            </div>
          )}
          {toast.type === "whatsapp" && (
            <div className="w-7 h-7 rounded-sm bg-emerald-950/40 flex items-center justify-center text-emerald-400">
              <MessageSquare className="w-4 h-4" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold tracking-wide text-[#FDFBF7] flex items-center gap-1.5">
            {toast.title}
          </p>
          <p className="text-xs text-[#E8DEC8]/90 mt-0.5 leading-relaxed">
            {toast.message}
          </p>
        </div>

        <button
          onClick={dismissToast}
          className="text-[#E8DEC8]/60 hover:text-[#FDFBF7] transition-colors p-1"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
