"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useHunar } from "@/context/HunarContext";
import { useLanguage } from "@/context/LanguageContext";
import { Conversation, Message } from "@/types";
import { PaymentModal } from "./PaymentModal";
import {
  MessageSquare,
  Send,
  Paperclip,
  CheckCircle2,
  Clock,
  CreditCard,
  QrCode,
  ShieldCheck,
  Search,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  MapPin,
  Image as ImageIcon,
  DollarSign
} from "lucide-react";

interface ChatModuleProps {
  initialConversationId?: string;
  defaultRoleView?: "CUSTOMER" | "SELLER";
}

export function ChatModule({ initialConversationId, defaultRoleView }: ChatModuleProps) {
  const router = useRouter();
  const {
    currentUser,
    conversations,
    activeConversationId,
    setActiveConversationId,
    getConversation,
    sendMessage,
    createPaymentRequest,
    processPayment
  } = useHunar();
  const { t, currentLanguage } = useLanguage();
  const isHindi = currentLanguage === "hi";

  const [searchQuery, setSearchQuery] = useState("");
  const [inputText, setInputText] = useState("");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [modalPaymentParams, setModalPaymentParams] = useState<{
    orderId: string;
    amount: number;
    productTitle?: string;
    productImage?: string;
  }>({
    orderId: "HNR-ORD-89214",
    amount: 2450
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Determine current active conversation
  const selectedConvId =
    initialConversationId ||
    activeConversationId ||
    (conversations.length > 0 ? conversations[0].id : null);

  const activeConv = selectedConvId
    ? conversations.find((c) => c.id === selectedConvId)
    : conversations[0];

  useEffect(() => {
    if (selectedConvId && selectedConvId !== activeConversationId) {
      setActiveConversationId(selectedConvId);
    }
  }, [selectedConvId, activeConversationId, setActiveConversationId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConv?.messages]);

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    const isCustomer = currentUser.role === "CUSTOMER";
    const partnerName = isCustomer ? c.sellerName : c.customerName;
    const craft = c.craftTitle || "";
    const prod = c.productTitle || "";
    const q = searchQuery.toLowerCase();
    return (
      partnerName.toLowerCase().includes(q) ||
      craft.toLowerCase().includes(q) ||
      prod.toLowerCase().includes(q)
    );
  });

  // Handle sending a standard text message
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeConv) return;
    sendMessage(activeConv.id, inputText.trim());
    setInputText("");
  };

  // Open Payment Modal for the active conversation
  const handleOpenPayment = (amountOverride?: number, orderIdOverride?: string) => {
    if (!activeConv) return;
    const orderId = orderIdOverride || `HNR-ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const amount = amountOverride || activeConv.productPrice || 2450;
    setModalPaymentParams({
      orderId,
      amount,
      productTitle: activeConv.productTitle,
      productImage: activeConv.productImage
    });
    setIsPaymentModalOpen(true);
  };

  // Handle seller creating an invoice request
  const handleSellerRequestPayment = () => {
    if (!activeConv) return;
    const amount = activeConv.productPrice || 3500;
    createPaymentRequest(activeConv.id, amount, activeConv.productTitle);
  };

  // Confirm payment handler
  const handleConfirmPayment = async (
    method: "UPI_QR" | "NETBANKING_CARD",
    details?: any
  ) => {
    if (!activeConv) return;
    return await processPayment(
      activeConv.id,
      modalPaymentParams.orderId,
      modalPaymentParams.amount,
      method,
      details
    );
  };

  return (
    <div className="bg-white rounded-sm border border-[#E8DEC8] shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col md:flex-row h-[calc(100vh-140px)] min-h-[600px]">
      {/* ========================================================= */}
      {/* LEFT SIDEBAR: ACTIVE CONVERSATIONS LIST                   */}
      {/* ========================================================= */}
      <div className="w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-r border-[#E8DEC8] flex flex-col bg-[#FAF7F2] shrink-0">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-[#E8DEC8] space-y-3 bg-[#FAF7F2]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#B4461F]" />
              <h2 className="font-serif font-bold text-base text-[#1E2229]">
                {isHindi ? "सीधा शिल्प संवाद" : "Direct Artisan Messaging"}
              </h2>
            </div>
            <span className="px-2 py-0.5 rounded-xs text-[10px] font-bold uppercase tracking-wider bg-[#FAF0EB] text-[#B4461F] border border-[#F3CFBF]">
              Live In-App
            </span>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#8A7561] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={isHindi ? "संवाद या कारीगर खोजें..." : "Search threads or crafts..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-sm border border-[#D3CBBE] bg-white text-xs text-[#1E2229] focus:outline-none focus:border-[#B4461F]"
            />
          </div>
        </div>

        {/* Conversation Items List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#E8DEC8]">
          {filteredConversations.map((conv) => {
            const isSelected = activeConv?.id === conv.id;
            const isCustomer = currentUser.role === "CUSTOMER";
            const partnerName = isCustomer ? conv.sellerName : conv.customerName;
            const partnerAvatar = isCustomer ? conv.sellerAvatar : conv.customerAvatar;
            const partnerCity = isCustomer ? conv.sellerCity : conv.customerCity;
            const unread = isCustomer ? conv.unreadCountCustomer : conv.unreadCountSeller;

            return (
              <button
                key={conv.id}
                onClick={() => {
                  setActiveConversationId(conv.id);
                  router.push(`/dashboard/chat/${conv.id}`);
                }}
                className={`w-full p-4 text-left transition-colors duration-150 flex items-start gap-3.5 relative ${
                  isSelected ? "bg-white border-l-4 border-l-[#B4461F] shadow-xs" : "hover:bg-[#F3EADB]"
                }`}
              >
                {/* Avatar with Verified Craft Badge */}
                <div className="relative shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={partnerAvatar}
                    alt={partnerName}
                    className="w-12 h-12 rounded-sm object-cover border border-[#D3CBBE]"
                  />
                  {conv.sellerVerified && (
                    <div
                      className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#2D583B] text-white flex items-center justify-center ring-2 ring-white"
                      title="Verified Master Guild"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h3 className="font-serif font-bold text-xs text-[#1E2229] truncate">
                      {partnerName}
                    </h3>
                    <span className="text-[10px] text-[#8A7561] shrink-0 font-mono">
                      {conv.lastMessageAt || "Today"}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#B4461F] font-medium truncate mb-1">
                    {conv.craftTitle || "Handmade Artisan Studio"} {partnerCity ? `• ${partnerCity}` : ""}
                  </p>

                  {/* Active Product Reference Pill */}
                  {conv.productTitle && (
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs bg-[#FAF5EC] border border-[#DACABA] text-[10px] text-[#1E2229] max-w-full truncate mb-1.5">
                      <span className="font-semibold text-[#B4461F]">Ref:</span>
                      <span className="truncate">{conv.productTitle}</span>
                      {conv.productPrice && (
                        <span className="font-bold text-[#2D583B]">₹{conv.productPrice}</span>
                      )}
                    </div>
                  )}

                  <p className="text-xs text-[#635C53] truncate">
                    {conv.lastMessageText || "No messages yet."}
                  </p>
                </div>

                {/* Unread indicator */}
                {Boolean(unread && unread > 0) && (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#B4461F] shrink-0 mt-1" />
                )}
              </button>
            );
          })}

          {filteredConversations.length === 0 && (
            <div className="p-8 text-center text-xs text-[#635C53]">
              No active conversations matching your search.
            </div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* ACTIVE CHAT PANEL                                         */}
      {/* ========================================================= */}
      {activeConv ? (
        <div className="flex-1 flex flex-col bg-[#FDFCF9] overflow-hidden">
          {/* Top Header: Partner info & Active Product Reference Card */}
          <div className="px-6 py-3.5 bg-[#FAF7F2] border-b border-[#E8DEC8] flex flex-wrap items-center justify-between gap-3 shrink-0">
            {/* Counterpart info */}
            <div className="flex items-center gap-3 min-w-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  currentUser.role === "CUSTOMER"
                    ? activeConv.sellerAvatar
                    : activeConv.customerAvatar
                }
                alt={
                  currentUser.role === "CUSTOMER"
                    ? activeConv.sellerName
                    : activeConv.customerName
                }
                className="w-11 h-11 rounded-sm object-cover border border-[#D3CBBE] shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-sm text-[#1E2229] truncate">
                    {currentUser.role === "CUSTOMER"
                      ? activeConv.sellerName
                      : activeConv.customerName}
                  </h3>
                  {activeConv.sellerVerified && (
                    <span className="px-1.5 py-0.2 rounded-xs bg-[#EEF4F0] text-[#2D583B] text-[10px] font-semibold border border-[#C5DCCB] shrink-0 flex items-center gap-0.5">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      <span>Verified Artisan</span>
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#635C53] truncate flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-[#8A7561]" />
                  <span>
                    {currentUser.role === "CUSTOMER"
                      ? activeConv.sellerCity || "Studio Master"
                      : activeConv.customerCity || "Patron Member"}
                  </span>
                  <span>•</span>
                  <span className="text-[#2D583B] font-medium">Active in Session</span>
                </p>
              </div>
            </div>

            {/* Active Product Reference Card + Pay Trigger */}
            <div className="flex items-center gap-3">
              {activeConv.productTitle && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-sm bg-white border border-[#E8DEC8] shadow-xs max-w-xs">
                  {activeConv.productImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={activeConv.productImage}
                      alt={activeConv.productTitle}
                      className="w-8 h-8 rounded-xs object-cover border border-[#E8DEC8] shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <span className="text-[10px] text-[#8A7561] block leading-tight truncate">
                      Referenced Artwork
                    </span>
                    <span className="font-serif font-bold text-xs text-[#1E2229] truncate block">
                      {activeConv.productTitle}
                    </span>
                  </div>
                  {activeConv.productPrice && (
                    <span className="font-bold text-xs text-[#B4461F] shrink-0 ml-1">
                      ₹{activeConv.productPrice}
                    </span>
                  )}
                </div>
              )}

              {/* Persistent Header Payment Button */}
              {currentUser.role === "CUSTOMER" ? (
                <button
                  type="button"
                  onClick={() => handleOpenPayment()}
                  className="btn-terracotta px-4 py-2 rounded-sm text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Complete Payment (₹)</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSellerRequestPayment}
                  className="px-4 py-2 rounded-sm bg-[#2D583B] text-white hover:bg-[#23452E] text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Request Payment (₹)</span>
                </button>
              )}
            </div>
          </div>

          {/* Message History Feed */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Conversation Introduction Banner */}
            <div className="text-center py-4 space-y-1 bg-[#FAF7F2] rounded-sm border border-[#E8DEC8] max-w-lg mx-auto p-4">
              <span className="px-2 py-0.5 rounded-xs text-[10px] font-bold uppercase tracking-wider bg-white text-[#8A7561] border border-[#E8DEC8]">
                Protected Artisan Channel
              </span>
              <h4 className="font-serif font-bold text-xs text-[#1E2229] pt-1">
                Direct Discussion with {activeConv.sellerName}
              </h4>
              <p className="text-[11px] text-[#635C53]">
                Discuss custom sizing, glaze variations, material sourcing, and dispatch timelines. Payments completed in-chat are protected by Hunar escrow.
              </p>
            </div>

            {/* Messages Stream */}
            {activeConv.messages.map((msg) => {
              const isMe = msg.senderId === currentUser.id;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                >
                  {/* Standard Message Bubble OR Payment Card */}
                  {msg.isPaymentCard && msg.paymentDetails ? (
                    /* ========================================================= */
                    /* IN-CHAT PAYMENT REQUEST OR CONFIRMED RECEIPT CARD         */
                    /* ========================================================= */
                    <div className="w-full max-w-md my-2 rounded-sm border border-[#E8DEC8] bg-white shadow-md overflow-hidden">
                      {msg.paymentDetails.status === "PAID" ? (
                        /* Confirmed Payment Receipt Card */
                        <div className="p-5 space-y-3 bg-[#FAF7F2]">
                          <div className="flex items-center justify-between border-b border-[#E8DEC8] pb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-[#EEF4F0] border border-[#2D583B] text-[#2D583B] flex items-center justify-center">
                                <CheckCircle2 className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="font-serif font-bold text-xs text-[#1E2229] block">
                                  Payment Confirmed
                                </span>
                                <span className="text-[10px] text-[#8A7561] font-mono">
                                  Txn ID: {msg.paymentDetails.transactionRef || "HNR-TXN-89214"}
                                </span>
                              </div>
                            </div>

                            <span className="px-2 py-0.5 rounded-xs text-[10px] font-bold uppercase tracking-wider bg-[#2D583B] text-white">
                              Crafting in Progress
                            </span>
                          </div>

                          <div className="flex items-baseline justify-between pt-1">
                            <span className="text-xs text-[#635C53]">Amount Paid:</span>
                            <span className="font-serif font-bold text-xl text-[#2D583B]">
                              ₹{msg.paymentDetails.amount.toLocaleString("en-IN")}
                            </span>
                          </div>

                          <p className="text-[11px] text-[#635C53] leading-relaxed bg-white p-2.5 rounded-xs border border-[#E8DEC8]">
                            Funds held securely in escrow. {activeConv.sellerName} has been notified to begin handcrafting.
                          </p>

                          <div className="flex items-center justify-between text-[10px] text-[#8A7561] pt-1">
                            <span>Method: {msg.paymentDetails.method || "UPI QR / Card"}</span>
                            <span>{msg.paymentDetails.timestamp || msg.createdAt}</span>
                          </div>
                        </div>
                      ) : (
                        /* Pending Payment Request / Invoice Card */
                        <div className="p-5 space-y-3 bg-[#FAF7F2]">
                          <div className="flex items-center justify-between border-b border-[#E8DEC8] pb-3">
                            <div>
                              <span className="font-serif font-bold text-xs text-[#1E2229] block">
                                Commission Payment Request
                              </span>
                              <span className="text-[10px] text-[#8A7561] font-mono">
                                Order #{msg.paymentDetails.orderId}
                              </span>
                            </div>
                            <span className="px-2 py-0.5 rounded-xs text-[10px] font-bold uppercase tracking-wider bg-[#FAF0EB] text-[#B4461F] border border-[#F3CFBF]">
                              Payment Pending
                            </span>
                          </div>

                          <p className="text-xs text-[#635C53]">
                            {msg.paymentDetails.productTitle || activeConv.productTitle || "Custom Craft Commission"}
                          </p>

                          <div className="flex items-baseline justify-between pt-1">
                            <span className="text-xs text-[#635C53]">Total Payable:</span>
                            <span className="font-serif font-bold text-xl text-[#B4461F]">
                              ₹{msg.paymentDetails.amount.toLocaleString("en-IN")}
                            </span>
                          </div>

                          {currentUser.role === "CUSTOMER" ? (
                            <button
                              type="button"
                              onClick={() =>
                                handleOpenPayment(
                                  msg.paymentDetails?.amount,
                                  msg.paymentDetails?.orderId
                                )
                              }
                              className="w-full py-2.5 px-4 rounded-sm btn-terracotta text-white font-medium text-xs flex items-center justify-center gap-2 shadow-sm"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>Pay ₹{msg.paymentDetails.amount.toLocaleString("en-IN")} Now</span>
                            </button>
                          ) : (
                            <div className="text-center py-2 text-[11px] text-[#8A7561] bg-white rounded-xs border border-[#E8DEC8]">
                              Awaiting patron completion via UPI QR or Card.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Standard Speech Bubble */
                    <div
                      className={`max-w-md p-3.5 rounded-sm text-xs leading-relaxed ${
                        isMe
                          ? "bg-[#FAF0EB] text-[#1E2229] border border-[#F3CFBF] rounded-br-xs"
                          : "bg-white text-[#1E2229] border border-[#E8DEC8] rounded-bl-xs shadow-xs"
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span className="text-[10px] text-[#8A7561] block text-right mt-1 font-mono">
                        {msg.createdAt}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Action Bar */}
          <div className="p-4 bg-[#FAF7F2] border-t border-[#E8DEC8] shrink-0">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              {/* Attachment Button */}
              <button
                type="button"
                onClick={() => {
                  sendMessage(
                    activeConv.id,
                    "Attached photo reference for custom size requirements.",
                    {
                      attachmentUrl:
                        activeConv.productImage ||
                        "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800"
                    }
                  );
                }}
                className="p-2.5 rounded-sm bg-white border border-[#D3CBBE] text-[#635C53] hover:text-[#1E2229] hover:bg-[#FAF7F2] transition-colors"
                title="Attach Photo Reference / Sketch"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              {/* Text Input */}
              <input
                type="text"
                placeholder={
                  isHindi
                    ? "संदेश लिखें (कस्टम साइज़, रंग या डिलीवरी पर चर्चा करें)..."
                    : `Write a message to ${
                        currentUser.role === "CUSTOMER"
                          ? activeConv.sellerName
                          : activeConv.customerName
                      }...`
                }
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-sm border border-[#D3CBBE] bg-white text-xs text-[#1E2229] focus:outline-none focus:border-[#B4461F]"
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="btn-terracotta px-4 py-2.5 rounded-sm text-xs font-medium flex items-center gap-1.5 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isHindi ? "भेजें" : "Send"}</span>
              </button>

              {/* Prominent Payment Button */}
              <button
                type="button"
                onClick={() => {
                  if (currentUser.role === "CUSTOMER") {
                    handleOpenPayment();
                  } else {
                    handleSellerRequestPayment();
                  }
                }}
                className={`px-4 py-2.5 rounded-sm text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs ${
                  currentUser.role === "CUSTOMER"
                    ? "bg-[#2D583B] text-white hover:bg-[#23452E]"
                    : "bg-[#1E2229] text-[#FAF7F2] hover:bg-[#2C323D]"
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>
                  {currentUser.role === "CUSTOMER"
                    ? "Pay (₹)"
                    : "Send Payment Invoice (₹)"}
                </span>
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-xs text-[#635C53]">
          <MessageSquare className="w-12 h-12 text-[#D3CBBE] mb-3" />
          <h3 className="font-serif font-bold text-base text-[#1E2229]">No Conversation Selected</h3>
          <p className="max-w-sm mt-1">
            Select a thread from the left sidebar to start messaging your patrons and master artisans.
          </p>
        </div>
      )}

      {/* Integrated In-Chat Payment Modal */}
      {isPaymentModalOpen && activeConv && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          orderId={modalPaymentParams.orderId}
          amount={modalPaymentParams.amount}
          productTitle={modalPaymentParams.productTitle}
          productImage={modalPaymentParams.productImage}
          sellerName={activeConv.sellerName}
          sellerCity={activeConv.sellerCity}
          onConfirmPayment={handleConfirmPayment}
        />
      )}
    </div>
  );
}
