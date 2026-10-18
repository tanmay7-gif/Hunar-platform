"use client";

import React, { useState } from "react";
import { Code, Play, CheckCircle2, Copy, X, Terminal, Server } from "lucide-react";

interface Endpoint {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  description: string;
  payload?: Record<string, unknown>;
}

export function ApiExplorerModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeEndpoint, setActiveEndpoint] = useState<number>(0);
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const endpoints: Endpoint[] = [
    {
      method: "POST",
      path: "/api/auth/login",
      description: "1-Click login preset for Artisan (SELLER) Rohit Sharma",
      payload: {
        email: "rohit.potter@hunar.in",
        password: "demo_artisan_2026"
      }
    },
    {
      method: "GET",
      path: "/api/products",
      description: "List all handcrafted products in marketplace feed with category & price filters"
    },
    {
      method: "GET",
      path: "/api/products/prod-khurja-tea-set",
      description: "Fetch single artwork product details & seller studio profile"
    },
    {
      method: "POST",
      path: "/api/products",
      description: "Add new product to studio catalog",
      payload: {
        title: "Khurja Terracotta Coffee Dripper",
        price: 1850,
        category: "Terracotta & Pottery",
        leadTime: "Ready to ship",
        stock: 4,
        deliveryFormat: "Physical Artwork",
        description: "Unglazed cone dripper for slow pour-over brewing."
      }
    },
    {
      method: "GET",
      path: "/api/inquiries?customerId=user-priya-customer",
      description: "Fetch customer commission tracker orders and status updates"
    },
    {
      method: "POST",
      path: "/api/inquiries",
      description: "Submit custom commission brief to artisan studio",
      payload: {
        customerId: "user-priya-customer",
        sellerId: "user-rohit-seller",
        requirements: "2 oversized unglazed terracotta floor urns for dining terrace.",
        proposedBudget: 9500,
        timeline: "Within 10 days"
      }
    },
    {
      method: "GET",
      path: "/api/stats",
      description: "Platform summary counters (artisans, total gig volume in INR, top cities, crafts)"
    },
    {
      method: "GET",
      path: "/api/creators",
      description: "List all verified grassroots creators with portfolio & unit pricing"
    },
    {
      method: "GET",
      path: "/api/creators/rameshwar-mithila",
      description: "Fetch individual Master Artisan Hunar Card profile"
    },
    {
      method: "GET",
      path: "/api/opportunities?category=Murals",
      description: "Query opportunity radar filtered by craft category"
    },
    {
      method: "GET",
      path: "/api/roadmap?artForm=Murals",
      description: "Fetch stage-by-stage Kala Roadmap and milestone state"
    },
    {
      method: "POST",
      path: "/api/hire",
      description: "Direct commission and booking request to artisan studio",
      payload: {
        creatorId: "creator-sunita",
        clientName: "Priya Nair",
        clientPhone: "+91 98711 44220",
        budget: 15000,
        note: "Need 3 framed Madhubani heritage tree paintings for boutique lounge."
      }
    }
  ];

  const handleExecute = async (endpoint: Endpoint) => {
    setLoading(true);
    setResponse(null);
    try {
      const options: RequestInit = {
        method: endpoint.method,
        headers: { "Content-Type": "application/json" }
      };

      if (endpoint.payload && endpoint.method !== "GET") {
        options.body = JSON.stringify(endpoint.payload);
      }

      const res = await fetch(endpoint.path, options);
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (err: unknown) {
      setResponse(
        JSON.stringify(
          { error: "Failed to fetch API", details: err instanceof Error ? err.message : String(err) },
          null,
          2
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (response) {
      navigator.clipboard.writeText(response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      {/* Trigger Button in Footer */}
      <button
        onClick={() => {
          setIsOpen(true);
          handleExecute(endpoints[activeEndpoint]);
        }}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#252A33] border border-[#3E4654] text-xs font-semibold text-[#E8DEC8] hover:text-white hover:border-[#C85A32] transition-colors"
      >
        <Server className="w-3.5 h-3.5 text-[#E5A93B]" />
        <span>REST API Explorer</span>
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 animate-in fade-in duration-150">
          <div className="bg-[#1E2229] border border-[#343B47] text-[#FDFBF7] rounded-sm w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#2C323D] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#C85A32]/20 text-[#E5A93B] flex items-center justify-center">
                  <Terminal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#FDFBF7]">
                    Hunar Backend REST API Explorer
                  </h3>
                  <p className="text-[11px] text-[#A6AFBF]">
                    Interactive testbench for Next.js App Route Handlers & Prisma schema
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Content: Left Endpoints list, Right Response viewer */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-5 overflow-hidden">
              {/* Endpoint selection sidebar */}
              <div className="md:col-span-2 border-r border-[#2C323D] p-3 overflow-y-auto space-y-1.5 bg-[#171A1F]">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-2 py-1">
                  Available Routes ({endpoints.length})
                </p>

                {endpoints.map((ep, idx) => {
                  const isSelected = activeEndpoint === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveEndpoint(idx);
                        handleExecute(ep);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all ${
                        isSelected
                          ? "bg-[#252A33] border-[#C85A32] text-white"
                          : "bg-transparent border-transparent text-[#A6AFBF] hover:bg-[#1E2229] hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            ep.method === "GET"
                              ? "bg-[#2D583B]/60 text-[#86D49D]"
                              : "bg-[#C85A32]/40 text-[#FFA07A]"
                          }`}
                        >
                          {ep.method}
                        </span>
                        <span className="font-mono text-[11px] truncate text-[#FDFBF7]">
                          {ep.path}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 line-clamp-1">{ep.description}</p>
                    </button>
                  );
                })}
              </div>

              {/* Response viewer panel */}
              <div className="md:col-span-3 p-4 flex flex-col justify-between overflow-hidden bg-[#1E2229]">
                <div>
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#2C323D]">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-bold ${
                          endpoints[activeEndpoint].method === "GET"
                            ? "bg-[#2D583B] text-white"
                            : "bg-[#C85A32] text-white"
                        }`}
                      >
                        {endpoints[activeEndpoint].method}
                      </span>
                      <span className="font-mono text-xs text-[#E5A93B]">
                        {endpoints[activeEndpoint].path}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleExecute(endpoints[activeEndpoint])}
                        disabled={loading}
                        className="px-3 py-1 rounded-lg bg-[#C85A32] text-white text-xs font-bold hover:bg-[#B94F28] transition-colors flex items-center gap-1 shadow-xs disabled:opacity-50"
                      >
                        <Play className="w-3 h-3 fill-white" />
                        <span>{loading ? "Running..." : "Send Request"}</span>
                      </button>

                      {response && (
                        <button
                          onClick={copyToClipboard}
                          className="p-1 rounded-lg hover:bg-[#252A33] text-gray-400 hover:text-white transition-colors"
                          title="Copy JSON response"
                        >
                          {copied ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {endpoints[activeEndpoint].payload && (
                    <div className="mb-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                        Request Payload (JSON)
                      </p>
                      <pre className="text-[11px] font-mono bg-[#14171C] p-2.5 rounded-lg border border-[#2C323D] text-[#86D49D] overflow-x-auto">
                        {JSON.stringify(endpoints[activeEndpoint].payload, null, 2)}
                      </pre>
                    </div>
                  )}

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                      Response (Status: 200 OK)
                    </p>
                    <div className="bg-[#14171C] border border-[#2C323D] rounded-xl p-3 h-64 overflow-y-auto text-[11px] font-mono text-[#E8DEC8]">
                      {loading ? (
                        <div className="h-full flex items-center justify-center text-gray-400">
                          <span className="animate-pulse">Executing request...</span>
                        </div>
                      ) : response ? (
                        <pre className="whitespace-pre-wrap">{response}</pre>
                      ) : (
                        <span className="text-gray-500">Click &ldquo;Send Request&rdquo; to test endpoint</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-3 text-[11px] text-gray-400 flex items-center justify-between border-t border-[#2C323D] mt-3">
                  <span>Prisma Schema & SQLite / PostgreSQL compatible</span>
                  <span className="text-[#86D49D]">● Server Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
