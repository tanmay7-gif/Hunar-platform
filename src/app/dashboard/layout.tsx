"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardTopbar } from "@/components/dashboard/DashboardTopbar";
import { useHunar } from "@/context/HunarContext";

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { currentUser } = useHunar();

  const isCustomerPath = pathname.startsWith("/dashboard/customer");
  const isSellerPath = pathname.startsWith("/dashboard/seller");
  const isSeller = isSellerPath ? true : isCustomerPath ? false : currentUser.role === "SELLER";

  return (
    <div
      className="min-h-[calc(100vh-57px)] flex flex-col bg-[#F9F6F0]"
    >
      <div className="flex-1 flex">
        {/* Mobile Backdrop Overlay */}
        {mobileSidebarOpen && (
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-black/60 lg:hidden transition-opacity"
          />
        )}

        {/* Dedicated Role-Differentiated Sidebar */}
        <DashboardSidebar
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Main Content Area with Contextual Topbar */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <DashboardTopbar
            mobileSidebarOpen={mobileSidebarOpen}
            onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          />

          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
