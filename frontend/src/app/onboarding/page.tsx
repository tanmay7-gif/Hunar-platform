"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useHunar } from "@/context/HunarContext";
import confetti from "canvas-confetti";
import {
  Sparkles,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  Palette,
  Globe,
  Share2,
  CreditCard,
  Briefcase,
  Star,
  Check,
  Zap,
  Phone
} from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const { language, registerCreatorFromOnboarding, showToast } = useHunar();
  const isHindi = language === "hi";

  const [step, setStep] = useState<number>(1);

  // Form State
  const [artForm, setArtForm] = useState<string>("Madhubani & Folk");
  const [city, setCity] = useState<string>("Jaipur");
  const [primaryLang, setPrimaryLang] = useState<string>("Hindi");
  const [experienceLevel, setExperienceLevel] = useState<string>("Emerging (1-3 yrs)");
  const [incomeGoal, setIncomeGoal] = useState<number>(50000);
  const [minPricing, setMinPricing] = useState<number>(3500);
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [createdUsername, setCreatedUsername] = useState<string | null>(null);

  const artForms = [
    {
      id: "Madhubani & Folk",
      label: isHindi ? "मधुबनी एवं मिथिला लोक कला" : "Madhubani & Folk Craft",
      desc: isHindi ? "कैनवस, टसर सिल्क और कागज़ पर पारंपरिक चित्रकारी" : "Traditional mineral pigment & line art on canvas, silk & paper",
      icon: "MF"
    },
    {
      id: "Murals",
      label: isHindi ? "कैफे व भित्ति चित्र (Murals)" : "Urban Wall Murals",
      desc: isHindi ? "रेस्तरां, दफ्तरों और हेरिटेज दीवारों पर बड़े पैमाने का चित्रण" : "Large-scale narrative art on brick, concrete & cafe facades",
      icon: "WM"
    },
    {
      id: "Pottery",
      label: isHindi ? "टेराकोटा एवं स्टूडियो पॉटरी" : "Studio Pottery & Ceramics",
      desc: isHindi ? "हाथ से गढ़े टेबलवेयर, कुल्हड़ एवं मिट्टी के सजावटी बर्तन" : "Wheel-thrown tableware, planters & custom glazed ceramics",
      icon: "TC"
    },
    {
      id: "Bridal Mehndi",
      label: isHindi ? "पारंपरिक ब्राइडल मेहंदी" : "Bridal & Festive Henna",
      desc: isHindi ? "100% प्राकृतिक सोजत मेहंदी से गहरा महरून रंग" : "Chemical-free organic henna for luxury weddings & bridal portraits",
      icon: "BH"
    },
    {
      id: "Visual Arts",
      label: isHindi ? "समकालीन दृश्य कला (Fine Arts)" : "Visual & Fine Arts",
      desc: isHindi ? "ऑयल, ऐक्रेलिक एवं मिश्रित माध्यमों में कैनवस कला" : "Original oils, acrylics, sketches & bespoke commissions",
      icon: "FA"
    },
    {
      id: "Performing Arts",
      label: isHindi ? "पारंपरिक लोक संगीत एवं वादन" : "Folk Music & Instruments",
      desc: isHindi ? "सारंगी, सितार, बांसुरी व लोक गायन प्रस्तुतियां" : "Acoustic folk instruments, baithak concerts & cultural events",
      icon: "FM"
    }
  ];

  const cities = [
    "Delhi NCR",
    "Jaipur, Rajasthan",
    "Lucknow, UP",
    "Varanasi, UP",
    "Madhubani, Bihar",
    "Mumbai, Maharashtra",
    "Kolkata, WB"
  ];

  const experienceOptions = [
    { id: "Beginner", label: isHindi ? "आरंभिक (0-1 वर्ष)" : "Beginner (Under 1 yr)" },
    { id: "Emerging (1-3 yrs)", label: isHindi ? "उभरते कलाकार (1-3 वर्ष)" : "Emerging (1-3 yrs)" },
    { id: "Established (3-7 yrs)", label: isHindi ? "स्थापित शिल्पी (3-7 वर्ष)" : "Established (3-7 yrs)" },
    { id: "Master Artisan", label: isHindi ? "वरिष्ठ उस्ताद (8+ वर्ष)" : "Master Artisan (8+ yrs)" }
  ];

  const incomeGoals = [
    { value: 25000, label: "₹25,000 / mo", subtitle: isHindi ? "स्थानीय ऑर्डर आधार" : "Foundation Stage" },
    { value: 50000, label: "₹50,000 / mo", subtitle: isHindi ? "नियमित कमर्शियल क्लाइंट्स" : "Regular Commercial Gigs" },
    { value: 80000, label: "₹80,000 / mo", subtitle: isHindi ? "एजेंसी रिटेनर व कमीशन" : "Retainers & Scaled Craft" },
    { value: 125000, label: "₹1,25,000+ / mo", subtitle: isHindi ? "लक्जरी एक्सपोर्ट व वर्कशॉप्स" : "High-Ticket & Workshops" }
  ];

  // Calculated recommended minimum price based on artForm & incomeGoal
  const calculatedRecommendedPrice = Math.max(
    minPricing,
    artForm === "Murals" ? 8000 : artForm === "Bridal Mehndi" ? 4500 : artForm === "Pottery" ? 2800 : 3500
  );

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();

    const artistName = name.trim() || (isHindi ? "शिल्पकार साथी" : "Artisan Creator");
    const artistBio =
      bio.trim() ||
      (isHindi
        ? `पारंपरिक ${artForm} के कुशल कारीगर। हस्तनिर्मित कला और प्रामाणिक कार्य के लिए उपलब्ध।`
        : `Dedicated grassroots artisan specializing in authentic ${artForm}. Open for bespoke commissions and regional bookings.`);

    const created = registerCreatorFromOnboarding({
      name: artistName,
      city: city.split(",")[0],
      primaryArtForm: artForm,
      languages: [primaryLang, primaryLang === "Hindi" ? "English" : "Hindi"],
      experienceLevel,
      sixMonthIncomeGoal: incomeGoal,
      minPricing: calculatedRecommendedPrice,
      phone: phone || "+91 98765 43210",
      bio: artistBio
    });

    setCreatedUsername(created.username);

    // Fire celebratory confetti!
    try {
      confetti({
        particleCount: 110,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    showToast(
      isHindi ? "बधाई हो! आपका हुनर कार्ड तैयार है" : "Congratulations! Your Hunar Card is Live",
      isHindi
        ? `${created.name} के नाम से डिजिटल लुकबुक सक्रिय कर दी गई है।`
        : `Your shareable portfolio card has been generated at /u/${created.username}`,
      "success"
    );
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Onboarding Header & Brand */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-3 mb-4 focus:outline-none focus:ring-2 focus:ring-[#C85A32] focus:ring-offset-2 rounded-sm group"
          >
            <div className="relative h-11 w-11 flex-shrink-0">
              <Image
                alt="Hunar logo showing hand-held paintbrush shaping the letter H"
                className="object-contain"
                fill
                priority
                src="/assets/logo-compact.png"
              />
            </div>
            <div className="flex flex-col text-left select-none">
              <span className="font-serif text-xl font-bold tracking-tight text-[#C85A32]">
                Hunar
              </span>
              <span className="text-[9px] font-medium tracking-wide uppercase text-[#635C53] -mt-0.5">
                A home for art. By Flytech
              </span>
            </div>
          </Link>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#8A7561] mb-1">
            {isHindi ? "कारीगर ऑनबोर्डिंग विज़ार्ड" : "Artisan Onboarding Process"}
          </p>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1E2229]">
            {isHindi ? "अपना निःशुल्क हुनर कार्ड बनाएं" : "Create Your Free Hunar Card"}
          </h1>

          {/* Stepper Progress Bar */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-xs transition-all duration-150 ${
                  s === step
                    ? "w-10 bg-[#1E2229]"
                    : s < step
                    ? "w-6 bg-[#2D583B]"
                    : "w-6 bg-[#D9D0C3]"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Wizard Card Container */}
        <div className="rounded-sm bg-white border border-[#E8E2D7] p-6 sm:p-10 shadow-[0_2px_8px_rgba(0,0,0,0.04)] relative overflow-hidden">
          {/* STEP 1: Select Art Form */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-[#F0E8D9] pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C85A32]">
                  {isHindi ? "चरण 1 / 4: कला विधा" : "Step 1 of 4: Craft Specialization"}
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1E2229] mt-1">
                  {isHindi ? "आपकी मुख्य कला या शिल्प क्या है?" : "What is your primary art or craft form?"}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  {isHindi
                    ? "जिस विधा में आप सबसे अधिक कार्य करते हैं या ग्राहक लेना चाहते हैं।"
                    : "Select the discipline you want to showcase and get matched gigs for."}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {artForms.map((item) => {
                  const isSelected = artForm === item.id;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setArtForm(item.id)}
                      className={`text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                        isSelected
                          ? "bg-[#FAF0E6] border-[#C85A32] ring-2 ring-[#C85A32]/20 shadow-xs"
                          : "bg-[#FFFDF9] border-[#E8DEC8] hover:bg-[#FAF6ED]"
                      }`}
                    >
                      <span className="text-2xl p-1 bg-white rounded-lg border border-[#E8DEC8] shrink-0">
                        {item.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-[#1E2229]">{item.label}</h4>
                          {isSelected && <Check className="w-4 h-4 text-[#C85A32] shrink-0" />}
                        </div>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-6 border-t border-[#F0E8D9] flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-xl bg-[#C85A32] text-white font-bold text-xs shadow-md hover:bg-[#B94F28] transition-all flex items-center gap-2"
                >
                  <span>{isHindi ? "आगे बढ़ें (शहर व भाषा)" : "Next: City & Language"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: City & Language */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-[#F0E8D9] pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C85A32]">
                  {isHindi ? "चरण 2 / 4: क्षेत्र व भाषा" : "Step 2 of 4: Location & Vernacular"}
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1E2229] mt-1">
                  {isHindi ? "आप किस शहर से हैं और किस भाषा में सहज हैं?" : "Where are you based and what language do you prefer?"}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  {isHindi
                    ? "स्थानीय क्लाइंट्स को आपके निकटतम होने की जानकारी मिलती है।"
                    : "Allows clients to find local artisans without long outstation travel costs."}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#1E2229] mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#C85A32]" />
                    <span>{isHindi ? "आपका प्राथमिक शहर (City):" : "Your Base City:"}</span>
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#FFFDF9] border border-[#DACABA] text-sm font-semibold text-[#1E2229] focus:outline-none focus:ring-2 focus:ring-[#C85A32]"
                  >
                    {cities.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E2229] mb-1.5 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#C85A32]" />
                    <span>{isHindi ? "बातचीत की मुख्य भाषा (Primary Language):" : "Preferred Language for Client Inquiries:"}</span>
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {["Hindi", "English", "Hinglish / Regional"].map((l) => (
                      <button
                        type="button"
                        key={l}
                        onClick={() => setPrimaryLang(l)}
                        className={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${
                          primaryLang === l
                            ? "bg-[#FAF0E6] border-[#C85A32] text-[#C85A32]"
                            : "bg-[#FFFDF9] border-[#E8DEC8] text-[#1E2229] hover:bg-[#FAF6ED]"
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#F0E8D9] flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl border border-[#DACABA] text-xs font-bold text-[#1E2229] hover:bg-[#FAF6ED] transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{isHindi ? "पीछे" : "Back"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-3 rounded-xl bg-[#C85A32] text-white font-bold text-xs shadow-md hover:bg-[#B94F28] transition-all flex items-center gap-2"
                >
                  <span>{isHindi ? "आगे बढ़ें (आय लक्ष्य)" : "Next: Income Goals"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Experience & 6-month Income Goal */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-[#F0E8D9] pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C85A32]">
                  {isHindi ? "चरण 3 / 4: अनुभव व 6-महीने का आय लक्ष्य" : "Step 3 of 4: Experience & 6-Month Income Goal"}
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1E2229] mt-1">
                  {isHindi ? "आप अगले 6 महीने में कितनी मासिक आय हासिल करना चाहते हैं?" : "What is your target monthly income in 6 months?"}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  {isHindi
                    ? "हम आपके लक्ष्य के अनुसार आपकी न्यूनतम बेस प्राइसिंग और कस्टमाइज्ड रोडमैप तैयार करेंगे।"
                    : "Hunar calculates your required order volume and generates a realistic milestone roadmap."}
                </p>
              </div>

              {/* Experience selection */}
              <div>
                <label className="block text-xs font-bold text-[#1E2229] mb-2">
                  {isHindi ? "कार्य अनुभव स्तर:" : "Experience Level:"}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {experienceOptions.map((opt) => (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => setExperienceLevel(opt.id)}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                        experienceLevel === opt.id
                          ? "bg-[#FAF0E6] border-[#C85A32] text-[#C85A32]"
                          : "bg-[#FFFDF9] border-[#E8DEC8] text-[#1E2229] hover:bg-[#FAF6ED]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Income Goals selector */}
              <div>
                <label className="block text-xs font-bold text-[#1E2229] mb-2 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-[#C85A32]" />
                  <span>{isHindi ? "6 महीने का मासिक आय लक्ष्य:" : "Target Monthly Income:"}</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {incomeGoals.map((g) => {
                    const isSelected = incomeGoal === g.value;
                    return (
                      <button
                        type="button"
                        key={g.value}
                        onClick={() => setIncomeGoal(g.value)}
                        className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                          isSelected
                            ? "bg-[#FAF0E6] border-[#C85A32] shadow-xs"
                            : "bg-[#FFFDF9] border-[#E8DEC8] hover:bg-[#FAF6ED]"
                        }`}
                      >
                        <div>
                          <p className="text-base font-serif font-bold text-[#1E2229]">{g.label}</p>
                          <p className="text-[11px] text-gray-500">{g.subtitle}</p>
                        </div>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-[#C85A32]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Instant calculation summary card */}
              <div className="p-4 rounded-xl bg-[#FAF5EC] border border-[#DACABA] flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#C85A32]/10 flex items-center justify-center shrink-0 text-[#C85A32]">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-[#1E2229]">
                    {isHindi ? "हुनर स्वचालित गणना:" : "Instant Milestone Calculation:"}
                  </p>
                  <p className="text-gray-600 mt-0.5 leading-relaxed">
                    {isHindi ? (
                      <>
                        ₹{incomeGoal.toLocaleString("en-IN")}/माह कमाने के लिए आपको प्रति माह लगभग{" "}
                        <span className="font-bold text-[#C85A32]">
                          {Math.ceil(incomeGoal / calculatedRecommendedPrice)} ऑर्डर
                        </span>{" "}
                        (औसत ₹{calculatedRecommendedPrice.toLocaleString("en-IN")}/ऑर्डर) की आवश्यकता होगी।
                      </>
                    ) : (
                      <>
                        To reach ₹{incomeGoal.toLocaleString("en-IN")}/mo in {artForm}, you will need approximately{" "}
                        <span className="font-bold text-[#C85A32]">
                          {Math.ceil(incomeGoal / calculatedRecommendedPrice)} confirmed commissions
                        </span>{" "}
                        at a recommended base rate of ₹{calculatedRecommendedPrice.toLocaleString("en-IN")}.
                      </>
                    )}
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-[#F0E8D9] flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 rounded-xl border border-[#DACABA] text-xs font-bold text-[#1E2229] hover:bg-[#FAF6ED] transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{isHindi ? "पीछे" : "Back"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-6 py-3 rounded-xl bg-[#C85A32] text-white font-bold text-xs shadow-md hover:bg-[#B94F28] transition-all flex items-center gap-2"
                >
                  <span>{isHindi ? "आगे बढ़ें (नाम व पूर्वावलोकन)" : "Next: Details & Preview"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Name, Bio & Dynamic Hunar Card Preview */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-[#F0E8D9] pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C85A32]">
                  {isHindi ? "चरण 4 / 4: प्रोफ़ाइल व लाइव प्रीव्यू" : "Step 4 of 4: Live Hunar Card Preview"}
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1E2229] mt-1">
                  {isHindi ? "अपना नाम दर्ज करें और अपना हुनर कार्ड देखें" : "Enter your name to generate your shareable card"}
                </h2>
              </div>

              {!createdUsername ? (
                <form onSubmit={handleFinish} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#1E2229] mb-1">
                        {isHindi ? "आपका पूरा नाम:" : "Full Name:"}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={isHindi ? "जैसे: राजेश कुमार" : "e.g. Rajesh Kumar"}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#DACABA] text-sm text-[#1E2229] focus:outline-none focus:ring-2 focus:ring-[#C85A32]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1E2229] mb-1 flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-[#2D583B]" />
                        <span>{isHindi ? "व्हाट्सएप नंबर (क्लाइंट संपर्क हेतु):" : "WhatsApp Number for Inquiries:"}</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#DACABA] text-sm text-[#1E2229] focus:outline-none focus:ring-2 focus:ring-[#C85A32]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1E2229] mb-1">
                      {isHindi ? "संक्षिप्त परिचय (Bio):" : "Brief Bio / Artist Statement:"}
                    </label>
                    <textarea
                      rows={2}
                      placeholder={
                        isHindi
                          ? "अपनी कला, अनुभव और तकनीक के बारे में 2 वाक्य लिखें..."
                          : "Write a short 2-sentence note on your technique, materials and heritage..."
                      }
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-[#FFFDF9] border border-[#DACABA] text-xs text-[#1E2229] focus:outline-none focus:ring-2 focus:ring-[#C85A32]"
                    />
                  </div>

                  {/* Dynamic Live Hunar Card Preview */}
                  <div className="pt-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#C85A32] mb-2 flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>{isHindi ? "लाइव हुनर कार्ड पूर्वावलोकन" : "Live Hunar Card Lookbook Preview"}</span>
                    </p>

                    <div className="p-5 rounded-2xl bg-[#FFFDF9] border-2 border-dashed border-[#C85A32]/40 shadow-sm relative">
                      {/* Hunar watermark / branding header in preview */}
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#F0E8D9]">
                        <div className="flex items-center gap-1.5">
                          <div className="relative w-4 h-4 flex-shrink-0">
                            <Image
                              src="/assets/logo-compact.png"
                              alt="Hunar"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <span className="text-[10px] font-bold text-[#C85A32]">Official Hunar Card</span>
                        </div>
                        <span className="text-[8px] font-medium uppercase text-[#635C53]">By Flytech</span>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#F0E8D9]">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-[#C85A32] text-white flex items-center justify-center font-serif text-lg font-bold shadow-xs">
                            {name ? name.charAt(0).toUpperCase() : "H"}
                          </div>
                          <div>
                            <h3 className="font-serif text-lg font-bold text-[#1E2229] flex items-center gap-1.5">
                              {name || (isHindi ? "आपका नाम यहाँ दिखेगा" : "Your Name Here")}
                              <span className="px-2 py-0.2 rounded-full bg-[#2D583B] text-white text-[9px] font-bold">
                                Verified
                              </span>
                            </h3>
                            <p className="text-xs text-gray-500">
                              {artForm} • {city}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">
                            Base Booking Price
                          </p>
                          <p className="text-sm font-serif font-bold text-[#C85A32]">
                            Starting from ₹{calculatedRecommendedPrice.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between text-xs text-gray-600">
                        <span className="flex items-center gap-1 text-[#2D583B] font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>100% Direct UPI / WhatsApp Shareable</span>
                        </span>
                        <span className="text-gray-400">Target: ₹{incomeGoal.toLocaleString("en-IN")}/mo</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#E8E2D7] flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="px-4 py-2.5 rounded-sm border border-[#D9D0C3] text-xs font-medium text-[#1A1816] hover:bg-[#EFEAE1] transition-colors duration-150 flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>{isHindi ? "पीछे" : "Back"}</span>
                    </button>

                    <button
                      type="submit"
                      className="px-6 py-3 rounded-sm bg-[#1E2229] hover:bg-[#111418] text-white font-medium text-xs sm:text-sm shadow-sm transition-colors duration-150 flex items-center gap-2"
                    >
                      <span>{isHindi ? "हुनर कार्ड प्रकाशित करें" : "Publish My Hunar Card"}</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* Success Confirmation State */
                <div className="text-center py-6 space-y-5 animate-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 rounded-full bg-[#EEF4F0] text-[#2D583B] flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-serif font-bold text-[#1E2229]">
                      {isHindi ? "बधाई! आपका डिजिटल हुनर कार्ड लाइव है" : "Your Hunar Card is Live!"}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto mt-1">
                      {isHindi
                        ? "आपका प्रोफ़ाइल लिंक तैयार है। आप इसे सीधे व्हाट्सएप पर शेयर कर सकते हैं या अवसरों के लिए बोली लगा सकते हैं।"
                        : "Your shareable portfolio lookbook is registered. Clients can view your verified medium, rates, and message you on WhatsApp."}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <Link
                      href="/dashboard/seller"
                      className="px-6 py-3 rounded-sm bg-[#1E2229] hover:bg-[#111418] text-white font-medium text-xs shadow-sm transition-colors duration-150 flex items-center gap-2"
                    >
                      <span>{isHindi ? "स्टूडियो डैशबोर्ड पर जाएं" : "Go to Studio Dashboard"}</span>
                      <ArrowRight className="w-4 h-4 text-[#E5A93B]" />
                    </Link>

                    <Link
                      href={`/u/${createdUsername}`}
                      className="px-6 py-3 rounded-sm bg-[#B4461F] text-white font-medium text-xs shadow-sm hover:bg-[#963715] transition-colors duration-150 flex items-center gap-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>{isHindi ? "अपना हुनर कार्ड खोलें" : "Open My Hunar Card"}</span>
                    </Link>

                    <Link
                      href="/dashboard/seller/opportunities"
                      className="px-6 py-3 rounded-sm bg-[#FAF5EC] border border-[#DACABA] text-[#1E2229] font-medium text-xs hover:bg-[#F4ECE0] transition-colors duration-150 flex items-center gap-2"
                    >
                      <Briefcase className="w-4 h-4 text-[#B4461F]" />
                      <span>{isHindi ? "मैच किए गए अवसर देखें" : "View Matched Gigs"}</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
