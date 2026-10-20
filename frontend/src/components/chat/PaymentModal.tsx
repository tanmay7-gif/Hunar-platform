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
  RefreshCw
} from "lucide-react";

interface PaymentModalProps {
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
  productTitle = "Custom Artisan Commission",
  productImage,
  sellerName,
  sellerCity = "India",
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
    setCardHolder("Priya Nair (Hunar Patron)");
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
      // Simulate realistic payment verification latency
      await new Promise((resolve) => setTimeout(resolve, 900));
      const res = await onConfirmPayment(method, {
        cardNumber,
        cardHolder,
        orderId
      });
      setCompletedTxnRef(res?.transactionRef || `HNR-TXN-${Math.floor(10000 + Math.random() * 90000)}`);
      setIsCompleted(true);
    } catch (err) {
      console.error("Payment submission error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-[#FDFCF9] rounded-sm border border-[#E8DEC8] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="px-6 py-4.5 bg-[#FAF7F2] border-b border-[#E8DEC8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#FAF0EB] border border-[#F3CFBF] flex items-center justify-center text-[#B4461F]">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#1E2229]">
                Secure Direct Artisan Checkout
              </h3>
              <p className="text-[11px] text-[#635C53]">
                0% Middleman • 100% Direct to Artisan Guild
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-sm text-[#8A7561] hover:text-[#1E2229] hover:bg-[#EFEAE1] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Summary Strip */}
        <div className="px-6 py-3.5 bg-[#F6F1E8] border-b border-[#E8DEC8] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {productImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={productImage}
                alt={productTitle}
                className="w-11 h-11 rounded-xs object-cover border border-[#D3CBBE] shrink-0"
              />
            )}
            <div className="min-w-0">
              <span className="text-[10px] font-mono text-[#8A7561] block truncate">
                ORDER ID: {orderId}
              </span>
              <h4 className="font-serif font-bold text-xs text-[#1E2229] truncate">
                {productTitle}
              </h4>
              <p className="text-[11px] text-[#635C53] truncate">
                Artisan: <strong className="text-[#1E2229]">{sellerName}</strong> ({sellerCity})
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] text-[#8A7561] block uppercase tracking-wider font-semibold">
              Total Amount
            </span>
            <span className="font-serif font-bold text-xl text-[#B4461F]">
              ₹{amount.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {isCompleted ? (
            /* ========================================================= */
            /* SUCCESS CONFIRMATION RECEIPT SCREEN                      */
            /* ========================================================= */
            <div className="py-6 text-center space-y-5 animate-in zoom-in-95 duration-150">
              <div className="w-16 h-16 rounded-full bg-[#EEF4F0] border-2 border-[#2D583B] flex items-center justify-center mx-auto text-[#2D583B] shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-xs text-[10px] font-bold uppercase tracking-wider bg-[#EEF4F0] text-[#2D583B] border border-[#C5DCCB]">
                  Payment Confirmed • Crafting in Progress
                </span>
                <h4 className="font-serif font-bold text-2xl text-[#1E2229] pt-1">
                  ₹{amount.toLocaleString("en-IN")} Paid Securely
                </h4>
                <p className="text-xs text-[#635C53] max-w-sm mx-auto">
                  Transaction verified on the Hunar network. Receipt card has been posted to your direct chat thread with {sellerName}.
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="bg-[#FAF7F2] p-4 rounded-sm border border-[#E8DEC8] text-left text-xs space-y-2 max-w-sm mx-auto">
                <div className="flex items-center justify-between">
                  <span className="text-[#8A7561]">Transaction ID:</span>
                  <span className="font-mono font-bold text-[#1E2229]">{completedTxnRef}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8A7561]">Order ID:</span>
                  <span className="font-mono text-[#1E2229]">{orderId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8A7561]">Payment Method:</span>
                  <span className="font-medium text-[#1E2229]">
                    {method === "UPI_QR" ? "Dynamic UPI QR Code" : "Netbanking / RuPay Card"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8A7561]">Status:</span>
                  <span className="font-bold text-[#2D583B]">PAID & DISPATCHED TO STUDIO</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="btn-terracotta px-6 py-2.5 rounded-sm text-xs font-semibold"
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
                  className={`p-3.5 rounded-sm border text-left flex items-start gap-3 transition-all duration-150 ${
                    method === "UPI_QR"
                      ? "border-[#B4461F] bg-[#FBF0EB] ring-1 ring-[#B4461F]"
                      : "border-[#E8DEC8] bg-white hover:bg-[#FAF7F2]"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xs flex items-center justify-center shrink-0 ${
                      method === "UPI_QR"
                        ? "bg-[#B4461F] text-white"
                        : "bg-[#F5F2EB] text-[#8A7561]"
                    }`}
                  >
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-serif font-bold text-xs text-[#1E2229] block">
                      Option A: Dynamic UPI QR
                    </span>
                    <span className="text-[10px] text-[#635C53] block mt-0.5">
                      GPay, PhonePe, Paytm
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod("NETBANKING_CARD")}
                  className={`p-3.5 rounded-sm border text-left flex items-start gap-3 transition-all duration-150 ${
                    method === "NETBANKING_CARD"
                      ? "border-[#B4461F] bg-[#FBF0EB] ring-1 ring-[#B4461F]"
                      : "border-[#E8DEC8] bg-white hover:bg-[#FAF7F2]"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xs flex items-center justify-center shrink-0 ${
                      method === "NETBANKING_CARD"
                        ? "bg-[#B4461F] text-white"
                        : "bg-[#F5F2EB] text-[#8A7561]"
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-serif font-bold text-xs text-[#1E2229] block">
                      Option B: Card / Netbanking
                    </span>
                    <span className="text-[10px] text-[#635C53] block mt-0.5">
                      RuPay, Visa, Master, Netbanking
                    </span>
                  </div>
                </button>
              </div>

              {/* Method A: Dynamic UPI QR Code */}
              {method === "UPI_QR" && (
                <div className="space-y-4 pt-1 animate-in fade-in duration-150 text-center">
                  <div className="bg-[#FAF7F2] p-5 rounded-sm border border-[#E8DEC8] inline-block mx-auto">
                    <QRCodeDisplay value={upiUri} size={190} />

                    <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-[#635C53]">
                      <Smartphone className="w-3.5 h-3.5 text-[#2D583B]" />
                      <span className="font-mono font-medium">seller.hunar@upi</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-center">
                    <p className="text-xs font-semibold text-[#1E2229]">
                      Scan with GPay, PhonePe, or Paytm to complete transaction.
                    </p>
                    <p className="text-[11px] text-[#8A7561]">
                      Amount of ₹{amount.toLocaleString("en-IN")} will be held in escrow until crafting begins.
                    </p>
                  </div>

                  {/* Immediate Verification Action */}
                  <div className="pt-2">
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={handlePay}
                      className="w-full py-3 px-4 rounded-sm bg-[#2D583B] text-white font-medium text-xs hover:bg-[#23452E] transition-colors duration-150 flex items-center justify-center gap-2 shadow-sm disabled:opacity-75"
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Verifying UPI Webhook & Escrow...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Simulate Scan & Pay ₹{amount.toLocaleString("en-IN")}</span>
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
                    <span className="text-xs font-semibold text-[#1E2229]">
                      Indian Banking Card Details
                    </span>
                    <button
                      type="button"
                      onClick={handleFillDemoCard}
                      className="text-[11px] font-semibold text-[#B4461F] hover:underline flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Fill Demo Card Details</span>
                    </button>
                  </div>

                  <div className="space-y-3 text-xs">
                    {/* Card Number */}
                    <div>
                      <label className="block text-[11px] font-semibold text-[#8A7561] mb-1 uppercase tracking-wider">
                        Card / Account Number
                      </label>
                      <input
                        type="text"
                        placeholder="4532 •••• •••• 8821"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        className="w-full px-3.5 py-2.5 rounded-sm border border-[#D3CBBE] bg-white text-[#1E2229] font-mono tracking-wider focus:outline-none focus:border-[#B4461F]"
                      />
                    </div>

                    {/* Cardholder Name */}
                    <div>
                      <label className="block text-[11px] font-semibold text-[#8A7561] mb-1 uppercase tracking-wider">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        placeholder="Priya Nair"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-sm border border-[#D3CBBE] bg-white text-[#1E2229] focus:outline-none focus:border-[#B4461F]"
                      />
                    </div>

                    {/* Expiry & CVV */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#8A7561] mb-1 uppercase tracking-wider">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={expiry}
                          onChange={handleExpiryChange}
                          className="w-full px-3.5 py-2.5 rounded-sm border border-[#D3CBBE] bg-white text-[#1E2229] font-mono focus:outline-none focus:border-[#B4461F]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#8A7561] mb-1 uppercase tracking-wider">
                          CVV / Netbanking PIN
                        </label>
                        <input
                          type="password"
                          maxLength={4}
                          placeholder="•••"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                          className="w-full px-3.5 py-2.5 rounded-sm border border-[#D3CBBE] bg-white text-[#1E2229] font-mono tracking-widest focus:outline-none focus:border-[#B4461F]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit CTA */}
                  <div className="pt-2 space-y-2">
                    <button
                      type="button"
                      disabled={isProcessing || !cardNumber}
                      onClick={handlePay}
                      className="w-full py-3 px-4 rounded-sm btn-terracotta text-white font-medium text-xs flex items-center justify-center gap-2 shadow-sm disabled:opacity-60"
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Authorizing via Banking Gateway...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>Pay ₹{amount.toLocaleString("en-IN")} Securely</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-center gap-2 text-[10px] text-[#8A7561]">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#2D583B]" />
                      <span>256-bit Encrypted • Direct Artisan Escrow</span>
                    </div>
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
