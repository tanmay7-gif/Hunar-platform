"use client";

import React, { useState, useEffect, useRef } from "react";
import { QRCodeDisplay } from "./QRCodeDisplay";
import { useHunar } from "@/context/HunarContext";
import { ApiService } from "@/lib/api";
import { PaymentMethod } from "@/types";
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
  DollarSign,
  AlertCircle,
  Info,
  ExternalLink
} from "lucide-react";

declare global {
  interface Window {
    paypal?: any;
  }
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  amount: number;
  productTitle?: string;
  productImage?: string;
  sellerName: string;
  sellerCity?: string;
  conversationId?: string;
  onConfirmPayment: (method: PaymentMethod, details?: any) => Promise<any>;
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
  conversationId,
  onConfirmPayment
}: PaymentModalProps) {
  const { showToast } = useHunar();
  const [method, setMethod] = useState<PaymentMethod>("UPI_QR");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedTxnRef, setCompletedTxnRef] = useState("");

  // Card Simulator State
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  // PayPal Sandbox State
  const [isSdkLoading, setIsSdkLoading] = useState(false);
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);
  const [paypalError, setPaypalError] = useState<string | null>(null);
  const [paypalNotice, setPaypalNotice] = useState<string | null>(null);
  const [useMockMode, setUseMockMode] = useState(false);
  const paypalContainerRef = useRef<HTMLDivElement>(null);
  const buttonsRenderedRef = useRef(false);

  // Currency Conversion (INR to USD: standard conversion approx 1 USD = 85 INR)
  const usdAmount = Number((amount / 85).toFixed(2));

  // Load PayPal SDK when PayPal tab is selected
  useEffect(() => {
    if (!isOpen || method !== "PAYPAL" || isCompleted) return;

    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "your_sandbox_client_id";
    const isPlaceholder =
      !clientId ||
      clientId === "your_sandbox_client_id" ||
      clientId.startsWith("your_") ||
      clientId === "dummy";

    if (isPlaceholder) {
      setUseMockMode(true);
      setIsSdkLoading(false);
      return;
    }

    if (window.paypal) {
      setIsSdkLoaded(true);
      setIsSdkLoading(false);
      return;
    }

    setIsSdkLoading(true);
    setPaypalError(null);

    const scriptId = "paypal-sdk-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(
        clientId
      )}&currency=USD&intent=capture`;
      script.async = true;

      script.onload = () => {
        setIsSdkLoaded(true);
        setIsSdkLoading(false);
      };

      script.onerror = () => {
        console.warn("[PayPal SDK] Script loading blocked or failed. Activating Sandbox Simulator.");
        setIsSdkLoading(false);
        setUseMockMode(true);
      };

      document.body.appendChild(script);
    } else {
      if (window.paypal) {
        setIsSdkLoaded(true);
        setIsSdkLoading(false);
      } else {
        const handleLoad = () => {
          setIsSdkLoaded(true);
          setIsSdkLoading(false);
        };
        const handleError = () => {
          setIsSdkLoading(false);
          setUseMockMode(true);
        };
        script.addEventListener("load", handleLoad);
        script.addEventListener("error", handleError);
        return () => {
          script?.removeEventListener("load", handleLoad);
          script?.removeEventListener("error", handleError);
        };
      }
    }
  }, [isOpen, method, isCompleted]);

  // Render PayPal Smart Payment Buttons
  useEffect(() => {
    if (
      !isOpen ||
      method !== "PAYPAL" ||
      !isSdkLoaded ||
      useMockMode ||
      !paypalContainerRef.current ||
      !window.paypal?.Buttons ||
      isCompleted
    ) {
      return;
    }

    // Clean up container before rendering
    paypalContainerRef.current.innerHTML = "";
    buttonsRenderedRef.current = false;

    try {
      window.paypal
        .Buttons({
          style: {
            layout: "vertical",
            color: "gold",
            shape: "rect",
            label: "paypal",
            height: 42,
          },
          createOrder: async () => {
            setPaypalError(null);
            setPaypalNotice(null);
            try {
              const res = await fetch("/api/payment/paypal/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  amount: usdAmount,
                  currency: "USD",
                  orderId,
                  description: `Hunar Order #${orderId}: ${productTitle}`,
                }),
              });
              if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.message || `Could not initialize PayPal order (${res.status})`);
              }
              const orderData = await res.json();
              return orderData.orderID || orderData.id;
            } catch (err: any) {
              setPaypalError(err.message || "Could not initialize PayPal order.");
              throw err;
            }
          },
          onApprove: async (data: any) => {
            setIsProcessing(true);
            setPaypalError(null);
            try {
              const res = await fetch("/api/payment/paypal/capture-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  orderID: data.orderID,
                  conversationId,
                  orderId,
                }),
              });
              if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.message || `Failed to capture PayPal payment (${res.status})`);
              }
              const captureRes = await res.json();

              const txnRef =
                captureRes.captureId ||
                captureRes.transactionRef ||
                `PAYPAL-${data.orderID}`;

              setPaypalError(null);
              setCompletedTxnRef(txnRef);

              await onConfirmPayment("PAYPAL", {
                orderID: data.orderID,
                captureId: captureRes.captureId || txnRef,
                transactionRef: txnRef,
                captureDetails: captureRes.capture,
              });

              showToast(
                "Payment Successful",
                `Order ${orderId} successfully captured via PayPal Sandbox ($${usdAmount.toFixed(2)} USD).`,
                "success"
              );

              setIsCompleted(true);
              setTimeout(() => {
                onClose();
              }, 1200);
            } catch (err: any) {
              setPaypalError(err.message || "Failed to capture PayPal payment.");
            } finally {
              setIsProcessing(false);
            }
          },
          onCancel: () => {
            setPaypalNotice("PayPal checkout window was closed. No funds were debited.");
          },
          onError: (err: any) => {
            console.error("[PayPal SDK Button Error]:", err);
            setPaypalError("A PayPal SDK error occurred. You can also simulate approval below.");
          },
        })
        .render(paypalContainerRef.current);

      buttonsRenderedRef.current = true;
    } catch (err) {
      console.warn("[PayPal SDK] Render Buttons failed, switching to fallback simulator:", err);
      setUseMockMode(true);
    }
  }, [
    isOpen,
    method,
    isSdkLoaded,
    useMockMode,
    isCompleted,
    orderId,
    usdAmount,
    productTitle,
    conversationId,
    onConfirmPayment,
    showToast,
  ]);

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

  // One-click quick-fill test button for Card
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

  // Execute payment confirmation for UPI or Card
  const handlePay = async () => {
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 900));
      const res = await onConfirmPayment(method, {
        cardNumber,
        cardHolder,
        orderId,
      });
      setCompletedTxnRef(
        res?.transactionRef || `HNR-TXN-${Math.floor(10000 + Math.random() * 90000)}`
      );
      setIsCompleted(true);
    } catch (err) {
      console.error("Payment submission error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Execute PayPal Sandbox simulation / fallback capture
  const handleSimulatePayPal = async () => {
    setIsProcessing(true);
    setPaypalError(null);
    setPaypalNotice(null);

    try {
      // 1. Create PayPal Order via relative Next.js route
      const createResponse = await fetch("/api/payment/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: usdAmount,
          currency: "USD",
          orderId,
          description: `Hunar Order #${orderId}: ${productTitle}`,
        }),
      });

      if (!createResponse.ok) {
        const err = await createResponse.json().catch(() => ({}));
        throw new Error(err.message || `Failed to create PayPal order (${createResponse.status})`);
      }
      const createRes = await createResponse.json();

      // Brief realistic delay
      await new Promise((r) => setTimeout(r, 700));

      // 2. Capture PayPal Order via relative Next.js route
      const captureResponse = await fetch("/api/payment/paypal/capture-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderID: createRes.orderID || createRes.id,
          conversationId,
          orderId,
        }),
      });

      if (!captureResponse.ok) {
        const err = await captureResponse.json().catch(() => ({}));
        throw new Error(err.message || `Failed to capture PayPal order (${captureResponse.status})`);
      }
      const captureRes = await captureResponse.json();

      const txnRef =
        captureRes.captureId ||
        captureRes.transactionRef ||
        `PAYPAL-${createRes.orderID}`;

      setPaypalError(null);
      setCompletedTxnRef(txnRef);

      await onConfirmPayment("PAYPAL", {
        orderID: createRes.orderID,
        captureId: captureRes.captureId || txnRef,
        transactionRef: txnRef,
        captureDetails: captureRes.capture,
      });

      showToast(
        "Payment Successful",
        `Order ${orderId} successfully captured via PayPal Sandbox ($${usdAmount.toFixed(2)} USD).`,
        "success"
      );

      setIsCompleted(true);
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error("PayPal simulation error:", err);
      setPaypalError(err.message || "Failed to execute PayPal transaction.");
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
            <div className="flex flex-col items-end">
              <span className="font-serif font-bold text-xl text-[#B4461F]">
                ₹{amount.toLocaleString("en-IN")}
              </span>
              <span className="text-[10px] font-mono text-[#635C53]">
                ≈ ${usdAmount.toFixed(2)} USD
              </span>
            </div>
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
                  ₹{amount.toLocaleString("en-IN")}{" "}
                  {method === "PAYPAL" && (
                    <span className="text-lg font-normal text-sky-700">
                      (${usdAmount.toFixed(2)} USD)
                    </span>
                  )}{" "}
                  Paid Securely
                </h4>
                <p className="text-xs text-[#635C53] max-w-sm mx-auto">
                  Transaction verified on the Hunar network. Receipt card has been posted to your direct chat thread with {sellerName}.
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="bg-[#FAF7F2] p-4 rounded-sm border border-[#E8DEC8] text-left text-xs space-y-2 max-w-sm mx-auto">
                <div className="flex items-center justify-between">
                  <span className="text-[#8A7561]">Transaction ID:</span>
                  <span className="font-mono font-bold text-[#1E2229] truncate max-w-[200px]">
                    {completedTxnRef}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8A7561]">Order ID:</span>
                  <span className="font-mono text-[#1E2229]">{orderId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8A7561]">Payment Method:</span>
                  <span className="font-medium text-[#1E2229]">
                    {method === "UPI_QR"
                      ? "Dynamic UPI QR Code"
                      : method === "PAYPAL"
                      ? "PayPal Sandbox (REST v2)"
                      : "Netbanking / RuPay Card"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8A7561]">Amount Captured:</span>
                  <span className="font-bold text-[#2D583B]">
                    ₹{amount.toLocaleString("en-IN")}{" "}
                    <span className="text-[11px] font-normal text-[#635C53]">
                      (${usdAmount.toFixed(2)} USD)
                    </span>
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
            /* METHOD SELECTOR & PAYMENT VIEWS                          */
            /* ========================================================= */
            <>
              {/* Payment Method Selector Tabs: 3 Options */}
              <div className="grid grid-cols-3 gap-2">
                {/* Option A: UPI */}
                <button
                  type="button"
                  onClick={() => setMethod("UPI_QR")}
                  className={`p-2.5 rounded-sm border text-left flex flex-col sm:flex-row items-start sm:items-center gap-2 transition-all duration-150 ${
                    method === "UPI_QR"
                      ? "border-[#B4461F] bg-[#FBF0EB] ring-1 ring-[#B4461F]"
                      : "border-[#E8DEC8] bg-white hover:bg-[#FAF7F2]"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-xs flex items-center justify-center shrink-0 ${
                      method === "UPI_QR"
                        ? "bg-[#B4461F] text-white"
                        : "bg-[#F5F2EB] text-[#8A7561]"
                    }`}
                  >
                    <QrCode className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-serif font-bold text-xs text-[#1E2229] block truncate">
                      UPI QR
                    </span>
                    <span className="text-[10px] text-[#635C53] block truncate">
                      GPay, PhonePe
                    </span>
                  </div>
                </button>

                {/* Option B: Card */}
                <button
                  type="button"
                  onClick={() => setMethod("NETBANKING_CARD")}
                  className={`p-2.5 rounded-sm border text-left flex flex-col sm:flex-row items-start sm:items-center gap-2 transition-all duration-150 ${
                    method === "NETBANKING_CARD"
                      ? "border-[#B4461F] bg-[#FBF0EB] ring-1 ring-[#B4461F]"
                      : "border-[#E8DEC8] bg-white hover:bg-[#FAF7F2]"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-xs flex items-center justify-center shrink-0 ${
                      method === "NETBANKING_CARD"
                        ? "bg-[#B4461F] text-white"
                        : "bg-[#F5F2EB] text-[#8A7561]"
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-serif font-bold text-xs text-[#1E2229] block truncate">
                      Card / Net
                    </span>
                    <span className="text-[10px] text-[#635C53] block truncate">
                      RuPay, Visa
                    </span>
                  </div>
                </button>

                {/* Option C: PayPal Sandbox */}
                <button
                  type="button"
                  onClick={() => setMethod("PAYPAL")}
                  className={`p-2.5 rounded-sm border text-left flex flex-col sm:flex-row items-start sm:items-center gap-2 transition-all duration-150 ${
                    method === "PAYPAL"
                      ? "border-sky-500 bg-sky-50/70 ring-1 ring-sky-500"
                      : "border-[#E8DEC8] bg-white hover:bg-[#FAF7F2]"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-xs flex items-center justify-center shrink-0 ${
                      method === "PAYPAL"
                        ? "bg-sky-600 text-white"
                        : "bg-sky-50 text-sky-700"
                    }`}
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="font-serif font-bold text-xs text-[#1E2229] block truncate">
                        PayPal
                      </span>
                      <span className="text-[9px] font-bold px-1 py-0.2 rounded-xs bg-sky-100 text-sky-700 border border-sky-200">
                        Sandbox
                      </span>
                    </div>
                    <span className="text-[10px] text-[#635C53] block truncate">
                      USD Checkout
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

              {/* Method C: PayPal Sandbox (REST API v2) */}
              {method === "PAYPAL" && (
                <div className="space-y-4 pt-1 animate-in fade-in duration-150">
                  {/* Currency Conversion & Sandbox Banner */}
                  <div className="p-3.5 bg-sky-50/70 border border-sky-200 rounded-sm space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-sky-900 font-semibold">
                        <DollarSign className="w-4 h-4 text-sky-600" />
                        <span>PayPal Sandbox Checkout (USD)</span>
                      </div>
                      <span className="px-1.5 py-0.5 rounded-xs text-[9px] font-mono font-bold bg-sky-100 text-sky-700 border border-sky-300">
                        API v2 CAPTURE
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-sky-100">
                      <div>
                        <span className="text-[#635C53] block text-[10px]">Hunar Base Price:</span>
                        <strong className="text-[#1E2229]">₹{amount.toLocaleString("en-IN")} INR</strong>
                      </div>
                      <div>
                        <span className="text-[#635C53] block text-[10px]">USD Target (1 USD ≈ ₹85):</span>
                        <strong className="text-sky-700 font-mono">${usdAmount.toFixed(2)} USD</strong>
                      </div>
                    </div>
                  </div>

                  {/* Notice or Warning Alert */}
                  {paypalNotice && (
                    <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-sm text-xs flex items-start gap-2">
                      <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                      <div>
                        <span className="font-semibold block">Checkout Notice</span>
                        <span>{paypalNotice}</span>
                      </div>
                    </div>
                  )}

                  {/* Error Alert */}
                  {paypalError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-sm text-xs flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                      <div>
                        <span className="font-semibold block">PayPal Error</span>
                        <span>{paypalError}</span>
                      </div>
                    </div>
                  )}

                  {/* SDK Loading Spinner */}
                  {isSdkLoading && (
                    <div className="py-8 text-center space-y-2 text-xs text-[#635C53]">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto text-sky-600" />
                      <p className="font-medium text-[#1E2229]">Connecting to PayPal Sandbox...</p>
                      <p className="text-[11px] text-[#8A7561]">Initializing Smart Payment Buttons v2</p>
                    </div>
                  )}

                  {/* Official PayPal Buttons Container */}
                  <div
                    ref={paypalContainerRef}
                    id="paypal-button-container"
                    className={`w-full min-h-[44px] transition-all ${
                      isSdkLoading || useMockMode ? "hidden" : "block"
                    }`}
                  />

                  {/* Sandbox Simulator / Fallback Card (for offline/dummy/mock mode) */}
                  {(useMockMode || !isSdkLoaded) && !isSdkLoading && (
                    <div className="bg-[#FAF7F2] p-4 rounded-sm border border-[#E8DEC8] space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#1E2229]">
                          PayPal Sandbox Test Simulator
                        </span>
                        <span className="text-[10px] font-mono text-[#8A7561]">
                          buyer@sandbox.hunar.art
                        </span>
                      </div>

                      <p className="text-[11px] text-[#635C53] leading-relaxed">
                        Seamlessly test PayPal REST v2 order creation and capture endpoints directly without live PayPal popups.
                      </p>

                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={handleSimulatePayPal}
                        className="w-full py-3 px-4 rounded-sm bg-sky-600 text-white font-medium text-xs hover:bg-sky-700 transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-75"
                      >
                        {isProcessing ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Capturing PayPal Order (${usdAmount.toFixed(2)} USD)...</span>
                          </>
                        ) : (
                          <>
                            <DollarSign className="w-4 h-4" />
                            <span>
                              Simulate PayPal Sandbox Checkout (${usdAmount.toFixed(2)} USD)
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Optional developer toggle for fast testing when live SDK is rendered */}
                  {isSdkLoaded && !useMockMode && !isSdkLoading && (
                    <div className="pt-1 text-center">
                      <button
                        type="button"
                        onClick={handleSimulatePayPal}
                        disabled={isProcessing}
                        className="text-[11px] text-sky-700 hover:text-sky-800 hover:underline inline-flex items-center gap-1 font-medium"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Or click here to Fast-Simulate Sandbox Approval</span>
                      </button>
                    </div>
                  )}

                  {/* Security Guarantee Strip */}
                  <div className="pt-2 flex items-center justify-center gap-2 text-[10px] text-[#8A7561]">
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                    <span>PayPal Sandbox API v2 • Escrow-Secured Artisan Payout</span>
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