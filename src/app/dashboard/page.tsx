"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useHunar } from "@/context/HunarContext";

export default function DashboardIndexPage() {
  const router = useRouter();
  const { currentUser } = useHunar();

  useEffect(() => {
    if (currentUser.role === "SELLER") {
      router.replace("/dashboard/seller");
    } else {
      router.replace("/dashboard/customer");
    }
  }, [currentUser.role, router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 border-3 border-[#C85A32] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="font-serif text-[#1E2229] text-base">
          {currentUser.role === "SELLER"
            ? "Opening Studio Workbench..."
            : "Entering Artisan Bazaar..."}
        </p>
      </div>
    </div>
  );
}
