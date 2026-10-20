"use client";

import React, { useState } from "react";
import { useHunar } from "@/context/HunarContext";
import { ProtectedImage } from "@/components/ui/ProtectedImage";
import { PaymentModal } from "./PaymentModal";
import {
  X,
  Send,
  CreditCard,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  Paperclip,
  Clock,
  ArrowUpRight
} from "lucide-react";

export interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  sellerId: string;
  sellerName: string;
  sellerCity?: string;
  productId?: string;
  productTitle?: string;
  productImage?: string;
  price?: number;
  initialMessage?: string;
}

export function ChatModal({
  isOpen,
  onClose,
  sellerId,
  sellerName = "Rhea Sharma",
  sellerCity = "Jaipur",
  productId = "prod-quiet-courtyard",
  productTitle = "The quiet courtyard",
  productImage = "/artworks/the-quiet-courtyard.png",
  price = 8400,
  initialMessage
}: ChatModalProps) {
  const { currentUser, processPayment, showToast } = useHunar();

  const [messages, setMessages] = useState<Array<{ id: string; sender: "customer" | "seller"; text: string; time: string }>>([
    {
      id: "msg-1",
      sender: "seller",
      text: `Namaste! Thank you for your interest in "${productTitle}". I hand-paint every original in my ${sellerCity} studio. Let me know if you have questions regarding dimensions or custom framing.`,
      time: "10:15 AM"
    },
    ...(initialMessage
      ? [
          {
            id: "msg-2",
            sender: "customer" as const,
            text: initialMessage,
            time: "10:18 AM"
          }
        ]
      : [])
  ]);

  const [inputText, setInputText] = useState("");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: "customer" as const,
      text: inputText.trim(),
      time: "Just now"
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText("");

    // Simulate artisan response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: "seller",
          text: `Thank you for the note! I can prepare this piece for secure dispatched packaging within 48 hours. You can complete the escrow payment directly using the QR or Card button above.`,
          time: "Just now"
        }
      ]);
    }, 1200);
  };

  const handleConfirmPayment = async (method: "UPI_QR" | "NETBANKING_CARD", details?: any) => {
    const orderId = `HN-${Date.now().toString().slice(-6)}`;
    try {
      if (processPayment) {
        return await processPayment("conv-sample", orderId, price, method, details);
      }
    } catch {
      // Fallback graceful simulation
    }
    return { transactionRef: "HN-ORD6-1843" };
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-[#1E2229]/50 animate-in fade-in duration-150">
        <div className="relative w-full max-w-2xl bg-[#FFFDF8] rounded-xs border border-[#D4CDC3] shadow-2xl overflow-hidden flex flex-col h-[650px] max-h-[90vh]">
          {/* Header */}
          <div className="px-5 py-3.5 bg-[#FAF7F2] border-b border-[#E7E0D6] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xs bg-[#F0E3C8] border border-[#D4CDC3] flex items-center justify-center text-xs font-serif font-bold text-[#2B1219]">
                {sellerName[0]}
              </div>
              <div>
                <h3 className="font-serif font-semibold text-sm text-[#2B1219] flex items-center gap-2">
                  <span>{sellerName}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4E6E58]" />
                  <span className="text-[10px] font-sans font-normal text-[#5E4B4E]">Active now</span>
                </h3>
                <p className="text-[11px] text-[#5E4B4E]">{sellerCity} · Independent Artist</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-xs text-[#8A8986] hover:text-[#2B1219] hover:bg-[#F0E3C8] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Piece Meta / Payment Bar */}
          <div className="px-5 py-2.5 bg-[#FAF0EB] border-b border-[#F3CFBF] flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xs overflow-hidden bg-[#EAE2D5] border border-[#E7E0D6] shrink-0">
                <ProtectedImage
                  src={productImage}
                  alt={productTitle}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <h4 className="font-serif font-semibold text-xs text-[#2B1219] truncate">
                  {productTitle}
                </h4>
                <p className="text-[11px] text-[#C85A32] font-semibold">
                  ₹{price.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xs bg-[#6E1F2E] hover:bg-[#581723] text-[#FFFDF8] font-medium text-xs transition-colors flex items-center gap-1.5 shrink-0 shadow-2xs"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Pay with QR / Card</span>
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-5 overflow-y-auto space-y-3 bg-[#F7F5EF]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col max-w-[80%] ${
                  m.sender === "customer" ? "ml-auto items-end" : "mr-auto items-start"
                }`}
              >
                <div
                  className={`p-3 rounded-xs text-xs leading-relaxed ${
                    m.sender === "customer"
                      ? "bg-[#6E1F2E] text-[#FFFDF8]"
                      : "bg-[#FFFDF8] border border-[#E7E0D6] text-[#2B1219] shadow-2xs"
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[10px] text-[#8A8986] mt-1 px-1">{m.time}</span>
              </div>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-[#FAF7F2] border-t border-[#E7E0D6] flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={`Write a message to ${sellerName}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-[#FFFFFF] border border-[#D4CDC3] rounded-xs px-3.5 py-2 text-xs text-[#2B1219] focus:outline-hidden focus:border-[#6E1F2E]"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#6E1F2E] hover:bg-[#581723] text-[#FFFDF8] rounded-xs text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>

      {/* Embedded In-App Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        orderId={`HN-${Date.now().toString().slice(-6)}`}
        amount={price}
        productTitle={productTitle}
        productImage={productImage}
        sellerName={sellerName}
        sellerCity={sellerCity}
        onConfirmPayment={handleConfirmPayment}
      />
    </>
  );
}

export default ChatModal;
