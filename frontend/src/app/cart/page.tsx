"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useHunar } from "@/context/HunarContext";
import { ProtectedImage } from "@/components/ui/ProtectedImage";
import { AlertCircle, ArrowUpRight, Check, CheckCircle2, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, clearCart, showToast } = useHunar();

  // Shipping form state pre-filled as in Screenshot 5
  const [formData, setFormData] = useState({
    fullName: "Aarav Mehta",
    mobileNumber: "+91 98765 XXXXX",
    emailAddress: "aarav@example.com",
    address: "24, Gulmohar Apartments, 12th Main Road",
    landmark: "Flat 302, near Indiranagar metro",
    city: "Bengaluru",
    pinCode: "560038",
    state: "Karnataka",
    country: "India"
  });

  // Payment confirmation state
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("HN-ORD6-1843");

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);
  const gst = cart.length > 0 ? 920 : 0;
  const shipping = cart.length > 0 ? 450 : 0;
  const total = subtotal + gst + shipping;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      showToast("Cart is empty", "Add a piece before placing an order.", "info");
      return;
    }
    const generatedOrderNum = `HN-ORD6-1843`;
    setOrderNumber(generatedOrderNum);
    setOrderPlaced(true);
    showToast("Order Placed", `Confirmation: ${generatedOrderNum}`, "success");
  };

  const handleBackToShop = () => {
    clearCart();
    setOrderPlaced(false);
    router.push("/shop");
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#2B1219] py-8 sm:py-12 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header (Screenshot 5: GOOD THINGS, COMING HOME / Your Cart / Keep exploring ↗) */}
        <div className="flex items-end justify-between border-b border-[#E7E0D6] pb-5 mb-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#C85A32] mb-1">
              GOOD THINGS, COMING HOME
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#2B1219] font-medium tracking-tight">
              Your Cart
            </h1>
          </div>
          <Link
            href="/shop"
            className="text-xs text-[#5E4B4E] hover:text-[#2B1219] flex items-center gap-1 font-medium transition-colors"
          >
            <span>Keep exploring</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Caution Notice Banner (Screenshot 5) */}
        <div className="mb-8 p-3.5 rounded-xs bg-[#F0E3C8] border border-[#D4CDC3] flex items-start gap-2.5 text-xs text-[#5E4B4E]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C85A32] shrink-0 mt-1" />
          <p className="leading-relaxed">
            Make payment with cautions. Please enter correct payment details. After payment
            verification, Order is placed.
          </p>
        </div>

        {/* ALTERNATE STATE: AFTER PAYMENT (Confirmed receipt matching Screenshot 5) */}
        {orderPlaced ? (
          <div className="my-8 bg-[#F0E3C8] border border-[#D4CDC3] rounded-xs p-8 sm:p-10 max-w-2xl mx-auto shadow-2xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#6E1F2E] text-white flex items-center justify-center shrink-0 mt-1">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-[#C85A32] font-bold">
                    ORDER NO. : {orderNumber}
                  </p>
                  <h2 className="font-serif text-2xl text-[#2B1219] font-medium">
                    A little more art in your everyday.
                  </h2>
                  <p className="text-xs text-[#5E4B4E] font-medium">
                    {cart.map((c) => c.title).join(" + ") || "The quiet courtyard + Earth & sky vase"} · Total ₹{total.toLocaleString("en-IN")}
                  </p>
                  <p className="text-[11px] text-[#5E4B4E] leading-relaxed max-w-md">
                    Shipping to {formData.fullName}, {formData.city} {formData.pinCode}. This is a preview
                    confirmation; payment was taken or order sent to the artists.
                  </p>
                </div>
              </div>
              <button
                onClick={handleBackToShop}
                className="px-5 py-2.5 rounded-xs bg-[#FFFDF8] border border-[#D4CDC3] hover:bg-[#FAF8F5] text-xs font-medium text-[#2B1219] transition-colors shrink-0 self-start sm:self-center cursor-pointer"
              >
                Back to shop
              </button>
            </div>
          </div>
        ) : (
          /* Normal Cart & Checkout Split Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Cart items & Shipping address */}
            <div className="lg:col-span-7 space-y-10">
              {/* Cart Items List */}
              <div>
                <h2 className="font-serif text-xl text-[#2B1219] font-medium mb-4">
                  Your pieces ({cart.length})
                </h2>

                {cart.length > 0 ? (
                  <div className="divide-y divide-[#E7E0D6] border-t border-b border-[#E7E0D6]">
                    {cart.map((item) => (
                      <div key={item.id} className="py-4 flex gap-4 items-start">
                        {/* Thumbnail */}
                        <div className="w-20 h-20 rounded-xs overflow-hidden bg-[#F0E3C8]/40 border border-[#E7E0D6] shrink-0">
                          <ProtectedImage
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-xs font-semibold text-[#2B1219] truncate">
                              {item.title}
                            </h3>
                            <span className="text-xs font-bold text-[#2B1219] shrink-0">
                              ₹{(item.price * (item.quantity || 1)).toLocaleString("en-IN")}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#5E4B4E] mt-0.5">
                            {item.artist} · {item.medium}
                          </p>
                          <p className="text-[10px] text-[#8A8986] mt-0.5">{item.dimensions}</p>

                          <div className="mt-2 flex items-center justify-between text-[11px]">
                            <span className="text-[#5E4B4E]">
                              Quantity <span className="font-medium text-[#2B1219] bg-[#FFFDF8] border border-[#E7E0D6] px-1.5 py-0.5 rounded-xs">{item.quantity || 1}</span> {item.presentation || "One-of-a-kind piece"}
                            </span>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-[#6E1F2E] hover:underline font-medium flex items-center gap-0.5 cursor-pointer"
                            >
                              <span>Remove</span>
                              <ArrowUpRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-xs text-[#8A8986] bg-[#FFFDF8] border border-[#E7E0D6] rounded-xs">
                    Your cart is currently empty.
                  </div>
                )}
              </div>

              {/* Where should they go? Shipping Address Form */}
              <div>
                <h2 className="font-serif text-xl text-[#2B1219] font-medium">
                  Where should they go?
                </h2>
                <p className="text-xs text-[#8A8986] mt-0.5 mb-5">
                  Shipping address · All fields required unless marked optional.
                </p>

                <form onSubmit={handlePay} className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-medium text-[#5E4B4E] mb-1">
                        Full name
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        required
                        className="w-full bg-[#FFFFFF] border border-[#D4CDC3] rounded-xs px-3 py-2 text-xs text-[#2B1219] focus:outline-hidden focus:border-[#6E1F2E]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-[#5E4B4E] mb-1">
                        Mobile number
                      </label>
                      <input
                        type="text"
                        value={formData.mobileNumber}
                        onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                        required
                        className="w-full bg-[#FFFFFF] border border-[#D4CDC3] rounded-xs px-3 py-2 text-xs text-[#2B1219] focus:outline-hidden focus:border-[#6E1F2E]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#5E4B4E] mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.emailAddress}
                      onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
                      required
                      className="w-full bg-[#FFFFFF] border border-[#D4CDC3] rounded-xs px-3 py-2 text-xs text-[#2B1219] focus:outline-hidden focus:border-[#6E1F2E]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#5E4B4E] mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                      className="w-full bg-[#FFFFFF] border border-[#D4CDC3] rounded-xs px-3 py-2 text-xs text-[#2B1219] focus:outline-hidden focus:border-[#6E1F2E]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#5E4B4E] mb-1">
                      Apartment, floor or landmark (optional)
                    </label>
                    <input
                      type="text"
                      value={formData.landmark}
                      onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                      className="w-full bg-[#FFFFFF] border border-[#D4CDC3] rounded-xs px-3 py-2 text-xs text-[#2B1219] focus:outline-hidden focus:border-[#6E1F2E]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-medium text-[#5E4B4E] mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        required
                        className="w-full bg-[#FFFFFF] border border-[#D4CDC3] rounded-xs px-3 py-2 text-xs text-[#2B1219] focus:outline-hidden focus:border-[#6E1F2E]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-[#5E4B4E] mb-1">
                        PIN code
                      </label>
                      <input
                        type="text"
                        value={formData.pinCode}
                        onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                        required
                        className="w-full bg-[#FFFFFF] border border-[#D4CDC3] rounded-xs px-3 py-2 text-xs text-[#2B1219] focus:outline-hidden focus:border-[#6E1F2E]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-medium text-[#5E4B4E] mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        required
                        className="w-full bg-[#FFFFFF] border border-[#D4CDC3] rounded-xs px-3 py-2 text-xs text-[#2B1219] focus:outline-hidden focus:border-[#6E1F2E]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-[#5E4B4E] mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        required
                        className="w-full bg-[#FFFFFF] border border-[#D4CDC3] rounded-xs px-3 py-2 text-xs text-[#2B1219] focus:outline-hidden focus:border-[#6E1F2E]"
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Column: Order Summary Card (Screenshot 5) */}
            <div className="lg:col-span-5">
              <div className="sticky top-20 bg-[#FFFDF8] border border-[#E7E0D6] rounded-xs p-6 space-y-4 shadow-2xs">
                <h3 className="font-serif text-xl text-[#2B1219] font-medium">Order summary</h3>

                <div className="space-y-2 text-xs divide-y divide-[#E7E0D6]">
                  {cart.map((item) => (
                    <div key={item.id} className="pt-2 flex justify-between text-[#5E4B4E]">
                      <span className="truncate pr-2">{item.title}</span>
                      <span className="font-medium text-[#2B1219] shrink-0">
                        ₹{(item.price * (item.quantity || 1)).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}

                  <div className="pt-2 flex justify-between text-[#5E4B4E]">
                    <span>GST (on products)</span>
                    <span className="font-medium text-[#2B1219]">₹{gst.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="pt-2 flex justify-between text-[#5E4B4E]">
                    <span>Shipping · {cart.length > 1 ? "2 studios" : "1 studio"}</span>
                    <span className="font-medium text-[#2B1219]">₹{shipping.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E7E0D6] flex items-baseline justify-between">
                  <span className="text-xs text-[#2B1219] font-semibold">Total</span>
                  <span className="font-serif text-2xl font-bold text-[#2B1219]">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handlePay}
                  disabled={cart.length === 0}
                  className="w-full py-3 px-4 rounded-xs bg-[#6E1F2E] hover:bg-[#581723] text-[#FFFDF8] text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
                >
                  Pay ₹{total.toLocaleString("en-IN")}
                </button>

                <p className="text-[10px] text-center text-[#8A8986]">
                  Make payment action. Card or UPI details needed.
                </p>

                <p className="text-[11px] text-[#5E4B4E] leading-relaxed pt-2 border-t border-[#E7E0D6]">
                  These pieces come from two independent studios. Each maker prepares their own work
                  for dispatch.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
