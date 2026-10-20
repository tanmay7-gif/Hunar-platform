"use client";

import React, { useState } from "react";
import { QRCodeDisplay } from "./QRCodeDisplay";
import {
  X,
  QrCode,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Smartphone,
  RefreshCw,
  AlertCircle
} from "lucide-react";

export interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  amount: number;
  productTitle?: string;
  productImage?: string;
  sellerName: string;
  sellerCity?: string;
  onConfirmPayment: (method: "UPI_QR" | "NETBANKING_CARD", details?: any) => Promise<any>;
}

export function PaymentModal({
  isOpen,
  onClose,
  orderId,
  amount,
  productTitle = "The quiet courtyard",
  productImage = "/artworks/the-quiet-courtyard.png",
  sellerName,
  sellerCity = "Jaipur",
  onConfirmPayment
}: PaymentModalProps) {
  const [method, setMethod] = useState<"UPI_QR" | "NETBANKING_CARD">("UPI_QR");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedTxnRef, setCompletedTxnRef] = useState("");

  // Card Simulator State
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  if (!isOpen) return null;

  // Format Card Number with 4-digit spacing
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(" ") || raw;
    setCardNumber(formatted);
  };

  // Format Expiry with MM/YY
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (raw.length >= 3) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    setExpiry(raw);
  };

  // One-click quick-fill test button
  const handleFillDemoCard = () => {
    setCardNumber("4532 8920 1144 8821");
    setCardHolder("Aarav Mehta (Patron)");
    setExpiry("08/29");
    setCvv("892");
  };

  // Construct official UPI payment intent URI
  const upiUri = `upi://pay?pa=seller.hunar@upi&pn=${encodeURIComponent(
    sellerName
  )}&am=${amount}&cu=INR&tn=HunarOrder_${orderId}`;

  // Execute payment confirmation
  const handlePay = async () => {
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const res = await onConfirmPayment(method, {
        cardNumber,
        cardHolder,
        orderId
      });
      setCompletedTxnRef(res?.transactionRef || `HN-ORD6-1843`);
      setIsCompleted(true);
    } catch (err) {
      console.error("Payment submission error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E2229]/50 animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-[#FFFDF8] rounded-xs border border-[#D4CDC3] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-[#FAF7F2] border-b border-[#E7E0D6] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xs bg-[#FAF0EB] border border-[#F3CFBF] flex items-center justify-center text-[#C85A32]">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-semibold text-base text-[#2B1219]">
                Direct Artisan Checkout
              </h3>
              <p className="text-[11px] text-[#5E4B4E]">
                100% Direct to Artisan Studio • Zero Hidden Commissions
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-xs text-[#8A8986] hover:text-[#2B1219] hover:bg-[#F0E3C8] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Caution notification banner matching Screenshot 5 */}
        <div className="mx-6 mt-4 p-3 bg-[#FAF0EB] border border-[#F3CFBF] rounded-xs text-[11px] text-[#5E4B4E] flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C85A32] shrink-0" />
          <span>
            Make payment with cautions. Please enter correct payment details. After payment
            verification, Order is placed.
          </span>
        </div>

        {/* Order Summary Strip */}
        <div className="px-6 py-3 bg-[#FAF7F2] border-y border-[#E7E0D6] mt-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {productImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={productImage}
                alt={productTitle}
                className="w-10 h-10 rounded-xs object-cover border border-[#E7E0D6] shrink-0"
              />
            )}
            <div className="min-w-0">
              <span className="text-[10px] text-[#8A8986] block truncate">
                ORDER ID: {orderId}
              </span>
              <h4 className="font-serif font-semibold text-xs text-[#2B1219] truncate">
                {productTitle}
              </h4>
              <p className="text-[11px] text-[#5E4B4E] truncate">
                Artisan: <strong className="text-[#2B1219]">{sellerName}</strong> ({sellerCity})
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] text-[#8A8986] block uppercase tracking-wider font-semibold">
              Total Amount
            </span>
            <span className="font-serif font-bold text-lg text-[#2B1219]">
              ₹{amount.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {isCompleted ? (
            /* ========================================================= */
            /* SUCCESS CONFIRMATION RECEIPT SCREEN (Screenshot 5 Match)   */
            /* ========================================================= */
            <div className="py-4 text-center space-y-4 animate-in zoom-in-95 duration-150">
              <div className="w-14 h-14 rounded-full bg-[#EEF4F0] border-2 border-[#4E6E58] flex items-center justify-center mx-auto text-[#4E6E58] shadow-2xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C85A32]">
                  ORDER NO. : {completedTxnRef || "HN-ORD6-1843"}
                </span>
                <h4 className="font-serif font-medium text-2xl text-[#2B1219]">
                  A little more art in your everyday.
                </h4>
                <p className="text-xs text-[#5E4B4E] max-w-sm mx-auto leading-relaxed">
                  {productTitle} • Total ₹{amount.toLocaleString("en-IN")}. Payment was taken and
                  the order is sent to {sellerName}&apos;s studio for packaging.
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="bg-[#FAF7F2] p-4 rounded-xs border border-[#E7E0D6] text-left text-xs space-y-2 max-w-sm mx-auto">
                <div className="flex items-center justify-between">
                  <span className="text-[#5E4B4E]">Transaction Ref:</span>
                  <span className="font-mono font-bold text-[#2B1219]">
                    {completedTxnRef || "HN-ORD6-1843"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#5E4B4E]">Order ID:</span>
                  <span className="font-mono text-[#2B1219]">{orderId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#5E4B4E]">Payment Method:</span>
                  <span className="font-medium text-[#2B1219]">
                    {method === "UPI_QR" ? "Dynamic UPI QR Code" : "Netbanking / RuPay Card"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#5E4B4E]">Status:</span>
                  <span className="font-semibold text-[#4E6E58]">PAID &amp; CONFIRMED</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xs bg-[#6E1F2E] hover:bg-[#581723] text-[#FFFDF8] text-xs font-medium transition-colors"
              >
                Return to Chat Thread
              </button>
            </div>
          ) : (
            /* ========================================================= */
            /* METHOD SELECTOR & PAYMENT SIMULATOR                      */
            /* ========================================================= */
            <>
              {/* Payment Method Selector Tabs */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMethod("UPI_QR")}
                  className={`p-3.5 rounded-xs border text-left flex items-start gap-3 transition-colors ${
                    method === "UPI_QR"
                      ? "border-[#6E1F2E] bg-[#FAF0EB] ring-1 ring-[#6E1F2E]"
                      : "border-[#E7E0D6] bg-white hover:bg-[#FAF7F2]"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-xs flex items-center justify-center shrink-0 ${
                      method === "UPI_QR"
                        ? "bg-[#6E1F2E] text-white"
                        : "bg-[#F0E3C8] text-[#2B1219]"
                    }`}
                  >
                    <QrCode className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-serif font-semibold text-xs text-[#2B1219] block">
                      Option A: UPI QR
                    </span>
                    <span className="text-[10px] text-[#5E4B4E] block mt-0.5">
                      GPay, PhonePe, Paytm
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod("NETBANKING_CARD")}
                  className={`p-3.5 rounded-xs border text-left flex items-start gap-3 transition-colors ${
                    method === "NETBANKING_CARD"
                      ? "border-[#6E1F2E] bg-[#FAF0EB] ring-1 ring-[#6E1F2E]"
                      : "border-[#E7E0D6] bg-white hover:bg-[#FAF7F2]"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-xs flex items-center justify-center shrink-0 ${
                      method === "NETBANKING_CARD"
                        ? "bg-[#6E1F2E] text-white"
                        : "bg-[#F0E3C8] text-[#2B1219]"
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-serif font-semibold text-xs text-[#2B1219] block">
                      Option B: Card / Netbanking
                    </span>
                    <span className="text-[10px] text-[#5E4B4E] block mt-0.5">
                      RuPay, Visa, Mastercard
                    </span>
                  </div>
                </button>
              </div>

              {/* Method A: Dynamic UPI QR Code */}
              {method === "UPI_QR" && (
                <div className="space-y-4 pt-1 animate-in fade-in duration-150 text-center">
                  <div className="bg-[#F0E3C8] p-5 rounded-xs border border-[#D4CDC3] inline-block mx-auto shadow-2xs">
                    <QRCodeDisplay value={upiUri} size={180} />

                    <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-[#5E4B4E]">
                      <Smartphone className="w-3.5 h-3.5 text-[#4E6E58]" />
                      <span className="font-mono font-medium">seller.hunar@upi</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-center">
                    <p className="text-xs font-semibold text-[#2B1219]">
                      Scan with GPay, PhonePe, or Paytm to complete transaction.
                    </p>
                    <p className="text-[11px] text-[#5E4B4E]">
                      Amount of ₹{amount.toLocaleString("en-IN")} will be held in escrow until
                      crafting begins.
                    </p>
                  </div>

                  {/* Immediate Verification Action */}
                  <div className="pt-2">
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={handlePay}
                      className="w-full py-2.5 px-4 rounded-xs bg-[#6E1F2E] hover:bg-[#581723] text-[#FFFDF8] font-medium text-xs transition-colors duration-150 flex items-center justify-center gap-2 shadow-2xs disabled:opacity-75 cursor-pointer"
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Verifying UPI Webhook &amp; Escrow...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Pay ₹{amount.toLocaleString("en-IN")} via UPI</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Method B: Netbanking & Card Simulator */}
              {method === "NETBANKING_CARD" && (
                <div className="space-y-4 pt-1 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#2B1219]">
                      Indian Banking Card Details
                    </span>
                    <button
                      type="button"
                      onClick={handleFillDemoCard}
                      className="text-[11px] font-semibold text-[#C85A32] hover:underline flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Fill Demo Card</span>
                    </button>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-medium text-[#5E4B4E] mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="4532 •••• •••• 8821"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        className="w-full bg-[#FFFFFF] border border-[#D4CDC3] rounded-xs px-3 py-2 text-xs font-mono text-[#2B1219] focus:outline-hidden focus:border-[#6E1F2E]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-[#5E4B4E] mb-1">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        placeholder="Aarav Mehta"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        className="w-full bg-[#FFFFFF] border border-[#D4CDC3] rounded-xs px-3 py-2 text-xs text-[#2B1219] focus:outline-hidden focus:border-[#6E1F2E]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-[#5E4B4E] mb-1">
                          Expiry (MM/YY)
                        </label>
                        <input
                          type="text"
                          placeholder="08/29"
                          value={expiry}
                          onChange={handleExpiryChange}
                          className="w-full bg-[#FFFFFF] border border-[#D4CDC3] rounded-xs px-3 py-2 text-xs font-mono text-[#2B1219] focus:outline-hidden focus:border-[#6E1F2E]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-[#5E4B4E] mb-1">
                          CVV
                        </label>
                        <input
                          type="password"
                          maxLength={3}
                          placeholder="•••"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          className="w-full bg-[#FFFFFF] border border-[#D4CDC3] rounded-xs px-3 py-2 text-xs font-mono text-[#2B1219] focus:outline-hidden focus:border-[#6E1F2E]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={handlePay}
                      className="w-full py-2.5 px-4 rounded-xs bg-[#6E1F2E] hover:bg-[#581723] text-[#FFFDF8] font-medium text-xs transition-colors duration-150 flex items-center justify-center gap-2 shadow-2xs disabled:opacity-75 cursor-pointer"
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Verifying Card Gateway...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Pay ₹{amount.toLocaleString("en-IN")} via Card</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
