"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Creator,
  Opportunity,
  Application,
  RoadmapStep,
  Booking,
  Persona,
  UserAccount,
  Product,
  CustomerInquiry,
  SEED_CREATORS,
  SEED_OPPORTUNITIES,
  SEED_ROADMAPS,
  MOCK_PERSONAS,
  DEMO_ACCOUNTS,
  SEED_PRODUCTS,
  SEED_INQUIRIES
} from "@/lib/data";

interface ToastState {
  id: string;
  title: string;
  message: string;
  type: "success" | "info" | "whatsapp";
}

interface HunarContextType {
  language: "en" | "hi";
  setLanguage: (lang: "en" | "hi") => void;
  toggleLanguage: () => void;
  currentPersona: Persona;
  setPersona: (personaId: string) => void;
  creators: Creator[];
  opportunities: Opportunity[];
  roadmaps: Record<string, RoadmapStep[]>;
  applications: Application[];
  bookings: Booking[];
  completedMilestones: Record<string, boolean>;
  toggleMilestone: (milestoneId: string) => void;
  applyToOpportunity: (oppId: string, pitch: string, proposedRate: number) => void;
  hireCreator: (creatorId: string, clientName: string, clientPhone: string, budget: number, note: string) => void;
  postOpportunity: (opp: Partial<Opportunity>) => void;
  registerCreatorFromOnboarding: (newCreator: Partial<Creator>) => Creator;

  // Role-based auth & Demo account states
  currentUser: UserAccount;
  login: (email: string, password?: string) => Promise<UserAccount | null>;
  logout: () => void;
  switchDemoRole: (role: "SELLER" | "CUSTOMER") => void;

  // Products & Studio catalog
  products: Product[];
  savedProductIds: string[];
  toggleSaveProduct: (productId: string) => void;
  savedCreatorIds: string[];
  toggleSaveCreator: (creatorId: string) => void;
  addProduct: (product: Partial<Product>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductStatus: (id: string) => void;

  // Customer inquiries & Commission tracker
  inquiries: CustomerInquiry[];
  createInquiry: (inquiry: Partial<CustomerInquiry>) => CustomerInquiry;
  updateInquiryStatus: (id: string, status: CustomerInquiry["status"], note?: string) => void;

  // Toast
  toast: ToastState | null;
  showToast: (title: string, message: string, type?: "success" | "info" | "whatsapp") => void;
  dismissToast: () => void;
}

const HunarContext = createContext<HunarContextType | undefined>(undefined);

export function HunarProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [currentPersona, setCurrentPersona] = useState<Persona>(MOCK_PERSONAS[0]);
  const [currentUser, setCurrentUser] = useState<UserAccount>(DEMO_ACCOUNTS[0]);
  const [creators, setCreators] = useState<Creator[]>(SEED_CREATORS);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(SEED_OPPORTUNITIES);
  const [roadmaps, setRoadmaps] = useState<Record<string, RoadmapStep[]>>(SEED_ROADMAPS);
  const [applications, setApplications] = useState<Application[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS);
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>(SEED_INQUIRIES);
  const [savedProductIds, setSavedProductIds] = useState<string[]>([
    "prod-khurja-tea-set",
    "prod-mithila-tree-of-life"
  ]);
  const [savedCreatorIds, setSavedCreatorIds] = useState<string[]>([
    "creator-sunita",
    "creator-arif"
  ]);
  const [completedMilestones, setCompletedMilestones] = useState<Record<string, boolean>>({
    m1: true,
    m2: true,
    p_m1: true,
    p_m2: true,
    f_m1: true,
    mh_m1: true,
    mh_m2: true
  });
  const [toast, setToast] = useState<ToastState | null>(null);

  // Load from local storage in browser
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("hunar_lang") as "en" | "hi" | null;
      if (savedLang) setLanguage(savedLang);

      const savedMilestones = localStorage.getItem("hunar_milestones");
      if (savedMilestones) setCompletedMilestones(JSON.parse(savedMilestones));

      const savedUser = localStorage.getItem("hunar_user_account");
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }

      const savedFavs = localStorage.getItem("hunar_saved_products");
      if (savedFavs) {
        setSavedProductIds(JSON.parse(savedFavs));
      }

      const savedArtists = localStorage.getItem("hunar_saved_creators");
      if (savedArtists) {
        setSavedCreatorIds(JSON.parse(savedArtists));
      }
    } catch {
      // ignore in SSR
    }
  }, []);

  const toggleLanguage = () => {
    const next = language === "en" ? "hi" : "en";
    setLanguage(next);
    try {
      localStorage.setItem("hunar_lang", next);
    } catch {
      // ignore
    }
  };

  const showToast = (title: string, message: string, type: "success" | "info" | "whatsapp" = "success") => {
    const id = Date.now().toString();
    setToast({ id, title, message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 4500);
  };

  const dismissToast = () => setToast(null);

  // Authentication & Demo preset handling
  const login = async (email: string, password?: string): Promise<UserAccount | null> => {
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const matched = DEMO_ACCOUNTS.find(
        (a) => a.email.toLowerCase() === normalizedEmail
      );

      const userToSet: UserAccount = matched || {
        id: `user-${Date.now()}`,
        name: normalizedEmail.includes("seller") || normalizedEmail.includes("artisan") ? "Studio Artisan" : "Patron Member",
        email: normalizedEmail,
        role: normalizedEmail.includes("seller") || normalizedEmail.includes("artisan") ? "SELLER" : "CUSTOMER",
        city: "Delhi NCR",
        avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80"
      };

      setCurrentUser(userToSet);
      try {
        localStorage.setItem("hunar_user_account", JSON.stringify(userToSet));
        document.cookie = `hunar_user_role=${userToSet.role}; path=/; max-age=604800`;
        document.cookie = `hunar_user_id=${userToSet.id}; path=/; max-age=604800`;
      } catch {
        // ignore
      }

      showToast(
        language === "hi" ? "लॉगिन सफल" : "Authentication Successful",
        language === "hi"
          ? `${userToSet.name} (${userToSet.role === "SELLER" ? "कारीगर स्टूडियो" : "कला संरक्षक"}) के रूप में स्वागत है`
          : `Signed in as ${userToSet.name} (${userToSet.role})`,
        "success"
      );

      return userToSet;
    } catch (err) {
      console.error("Login failed:", err);
      return null;
    }
  };

  const logout = () => {
    const defaultUser = DEMO_ACCOUNTS[1]; // Switch to customer by default
    setCurrentUser(defaultUser);
    try {
      localStorage.setItem("hunar_user_account", JSON.stringify(defaultUser));
      document.cookie = `hunar_user_role=; path=/; max-age=0`;
      document.cookie = `hunar_user_id=; path=/; max-age=0`;
    } catch {
      // ignore
    }
    showToast(
      language === "hi" ? "लॉगआउट" : "Signed Out",
      language === "hi" ? "अतिथि सत्र पर वापस ले जाया गया।" : "Switched to guest session.",
      "info"
    );
  };

  const switchDemoRole = (role: "SELLER" | "CUSTOMER") => {
    const target = role === "SELLER" ? DEMO_ACCOUNTS[0] : DEMO_ACCOUNTS[1];
    setCurrentUser(target);
    try {
      localStorage.setItem("hunar_user_account", JSON.stringify(target));
      document.cookie = `hunar_user_role=${target.role}; path=/; max-age=604800`;
      document.cookie = `hunar_user_id=${target.id}; path=/; max-age=604800`;
    } catch {
      // ignore
    }

    showToast(
      language === "hi" ? "भूमिका बदली गई" : "Demo Account Switched",
      language === "hi"
        ? `अब आप ${target.name} (${target.role}) के रूप में सक्रिय हैं`
        : `Active account switched to ${target.name} (${target.role})`,
      "info"
    );
  };

  const setPersona = (personaId: string) => {
    const p = MOCK_PERSONAS.find((item) => item.id === personaId);
    if (p) {
      setCurrentPersona(p);
      localStorage.setItem("hunar_persona", p.id);
      showToast(
        language === "hi" ? "प्रोफ़ाइल बदली गई" : "Persona Switched",
        language === "hi"
          ? `अब आप ${p.name} के रूप में देख रहे हैं (${p.title})`
          : `Now viewing as ${p.name} (${p.title})`,
        "info"
      );
    }
  };

  // Products CRUD
  const toggleSaveProduct = (productId: string) => {
    setSavedProductIds((prev) => {
      const exists = prev.includes(productId);
      const next = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      try {
        localStorage.setItem("hunar_saved_products", JSON.stringify(next));
      } catch {
        // ignore
      }
      showToast(
        exists ? (language === "hi" ? "सहेजे गए से हटाया" : "Removed from Saved") : (language === "hi" ? "सहेज लिया गया!" : "Added to Saved! ❤️"),
        exists
          ? (language === "hi" ? "कलाकृति आपकी सहेजी गई सूची से हटा दी गई है।" : "Artwork removed from your patron shortlist.")
          : (language === "hi" ? "कलाकृति आपकी सहेजी गई सूची में जोड़ दी गई है।" : "Artwork bookmarked in your patron dashboard collection."),
        "info"
      );
      return next;
    });
  };

  const toggleSaveCreator = (creatorId: string) => {
    setSavedCreatorIds((prev) => {
      const exists = prev.includes(creatorId);
      const next = exists ? prev.filter((id) => id !== creatorId) : [...prev, creatorId];
      try {
        localStorage.setItem("hunar_saved_creators", JSON.stringify(next));
      } catch {
        // ignore
      }
      showToast(
        exists
          ? (language === "hi" ? "कारीगर शॉर्टलिस्ट से हटाया" : "Artisan Removed from Shortlist")
          : (language === "hi" ? "कारीगर शॉर्टलिस्ट में जोड़ा" : "Artisan Shortlisted"),
        exists
          ? (language === "hi" ? "कारीगर आपकी संरक्षित सूची से हटा दिया गया है।" : "Artisan removed from your saved patrons shortlist.")
          : (language === "hi" ? "कारीगर आपकी संरक्षित सूची में जोड़ दिया गया है।" : "Artisan bookmarked in your Patron discovery list."),
        "info"
      );
      return next;
    });
  };

  const addProduct = (prodData: Partial<Product>): Product => {
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      title: prodData.title || "Handmade Artisan Piece",
      titleHindi: prodData.titleHindi || prodData.title,
      description: prodData.description || "Authentic handmade piece created with traditional techniques.",
      price: Number(prodData.price || 2500),
      category: (prodData.category as Product["category"]) || "Terracotta & Pottery",
      images: prodData.images && prodData.images.length > 0
        ? prodData.images
        : ["https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80"],
      leadTime: prodData.leadTime || "Ready to ship",
      stock: Number(prodData.stock ?? 1),
      deliveryFormat: (prodData.deliveryFormat as Product["deliveryFormat"]) || "Physical Artwork",
      status: (prodData.status as Product["status"]) || "Live",
      dimensions: prodData.dimensions || "Handcrafted dimensions",
      material: prodData.material || "Raw organic clay & minerals",
      sellerId: currentUser.id || "user-rohit-seller",
      sellerName: currentUser.name || "Rohit Sharma",
      sellerCity: currentUser.city || "Khurja / Delhi NCR",
      sellerAvatar: currentUser.avatarUrl,
      sellerPhone: currentUser.phone || "+91 98118 76543",
      sellerWhatsapp: currentUser.whatsapp || "919811876543",
      sellerVerified: currentUser.isVerified ?? true,
      createdAt: new Date().toISOString().split("T")[0]
    };

    setProducts((prev) => [newProduct, ...prev]);

    showToast(
      language === "hi" ? "कलाकृति सफलतापूर्वक सूचीबद्ध!" : "Product Published to Studio Catalog",
      language === "hi"
        ? `'${newProduct.title}' अब ग्राहकों को प्रदर्शित हो रही है।`
        : `'${newProduct.title}' is now live in the customer discovery feed.`,
      "success"
    );

    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    showToast(
      language === "hi" ? "उत्पाद अद्यतन हुआ" : "Product Updated",
      language === "hi" ? "कलाकृति का विवरण सहेज लिया गया है।" : "Catalog item details updated successfully.",
      "success"
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast(
      language === "hi" ? "उत्पाद हटाया गया" : "Product Removed",
      language === "hi" ? "कलाकृति को स्टूडियो कैटलॉग से हटा दिया गया।" : "Item removed from studio catalog.",
      "info"
    );
  };

  const toggleProductStatus = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextStatus = p.status === "Live" ? "Draft" : "Live";
          showToast(
            language === "hi" ? "स्थिति बदली गई" : "Visibility Toggled",
            language === "hi" ? `उत्पाद स्थिति अब '${nextStatus}' है।` : `Product visibility set to '${nextStatus}'.`,
            "info"
          );
          return { ...p, status: nextStatus };
        }
        return p;
      })
    );
  };

  // Inquiries & Commissions
  const createInquiry = (inqData: Partial<CustomerInquiry>): CustomerInquiry => {
    const newInquiry: CustomerInquiry = {
      id: `inq-${Date.now()}`,
      customerId: currentUser.id || "user-priya-customer",
      customerName: inqData.customerName || currentUser.name || "Priya Nair",
      customerPhone: inqData.customerPhone || currentUser.phone || "+91 98711 44220",
      customerEmail: inqData.customerEmail || currentUser.email || "priya.patron@hunar.in",
      sellerId: inqData.sellerId || "user-rohit-seller",
      sellerName: inqData.sellerName || "Rohit Sharma",
      sellerAvatar: inqData.sellerAvatar || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80",
      productId: inqData.productId,
      productTitle: inqData.productTitle,
      productImage: inqData.productImage,
      type: inqData.type || "custom_commission",
      requirements: inqData.requirements || "Custom commission inquiry via Hunar.",
      proposedBudget: Number(inqData.proposedBudget || 5000),
      timeline: inqData.timeline || "Within 14 days",
      status: "Under Review",
      statusUpdates: [
        {
          timestamp: new Date().toISOString().split("T")[0],
          note: "Commission brief dispatched to artisan studio."
        }
      ],
      createdAt: new Date().toISOString().split("T")[0]
    };

    setInquiries((prev) => [newInquiry, ...prev]);

    showToast(
      language === "hi" ? "पूछताछ व कमीशन आदेश प्रेषित!" : "Commission Inquiry Dispatched",
      language === "hi"
        ? `${newInquiry.sellerName} को आपका प्रस्ताव भेजा गया है। ट्रैकर में प्रगति देखें।`
        : `Sent to ${newInquiry.sellerName}. Track progress in your Customer Activity Panel.`,
      "whatsapp"
    );

    return newInquiry;
  };

  const updateInquiryStatus = (id: string, status: CustomerInquiry["status"], note?: string) => {
    setInquiries((prev) =>
      prev.map((inq) => {
        if (inq.id === id) {
          const updates = inq.statusUpdates || [];
          return {
            ...inq,
            status,
            statusUpdates: [
              ...updates,
              {
                timestamp: new Date().toISOString().split("T")[0],
                note: note || `Status updated to ${status}`
              }
            ]
          };
        }
        return inq;
      })
    );

    showToast(
      language === "hi" ? "ऑर्डर स्थिति अद्यतित!" : "Order Status Updated",
      language === "hi" ? `कमीशन की स्थिति '${status}' कर दी गई है।` : `Commission tracker updated to '${status}'.`,
      "success"
    );
  };

  const toggleMilestone = (milestoneId: string) => {
    setCompletedMilestones((prev) => {
      const nextState = { ...prev, [milestoneId]: !prev[milestoneId] };
      try {
        localStorage.setItem("hunar_milestones", JSON.stringify(nextState));
      } catch {
        // ignore
      }
      return nextState;
    });

    const isNowDone = !completedMilestones[milestoneId];
    if (isNowDone) {
      showToast(
        language === "hi" ? "पड़ाव पूर्ण हुआ" : "Milestone Completed",
        language === "hi" ? "आपकी कला रोडमैप में प्रगति जुड़ गई है।" : "Progress updated in your Kala Roadmap.",
        "success"
      );
    }
  };

  const applyToOpportunity = (oppId: string, pitch: string, proposedRate: number) => {
    const opp = opportunities.find((o) => o.id === oppId);
    const newApp: Application = {
      id: `app-${Date.now()}`,
      opportunityId: oppId,
      creatorId: currentUser.id,
      creatorName: currentUser.name,
      proposedRate,
      pitch,
      status: "pending",
      createdAt: new Date().toISOString().split("T")[0]
    };

    setApplications((prev) => [newApp, ...prev]);
    setOpportunities((prev) =>
      prev.map((o) => (o.id === oppId ? { ...o, applicationsCount: o.applicationsCount + 1 } : o))
    );

    showToast(
      language === "hi" ? "आवेदन / बोली सफलतापूर्वक भेजी गई!" : "Application Sent Successfully!",
      language === "hi"
        ? `₹${proposedRate.toLocaleString("en-IN")} की बोली '${opp?.titleHindi || opp?.title}' के लिए प्रेषित।`
        : `Bid of ₹${proposedRate.toLocaleString("en-IN")} submitted for '${opp?.title}'. Client notified.`,
      "success"
    );
  };



  const hireCreator = (
    creatorId: string,
    clientName: string,
    clientPhone: string,
    budget: number,
    note: string
  ) => {
    const creator = creators.find((c) => c.id === creatorId);
    const newBooking: Booking = {
      id: `hire-${Date.now()}`,
      creatorId,
      title: `Direct Commission / Booking for ${creator?.name}`,
      type: "creator_hire",
      clientName,
      clientPhone,
      budgetProposed: budget,
      selectedSlot: "Immediate / Within 14 days",
      note,
      createdAt: new Date().toISOString().split("T")[0],
      status: "pending"
    };

    setBookings((prev) => [newBooking, ...prev]);
    showToast(
      language === "hi" ? "पूछताछ प्रेषित हुई!" : "Commission Inquiry Dispatched!",
      language === "hi"
        ? `${creator?.nameHindi || creator?.name} को सीधे संपर्क विवरण और ₹${budget.toLocaleString("en-IN")} का प्रस्ताव भेजा गया।`
        : `Direct inquiry & ₹${budget.toLocaleString("en-IN")} proposed to ${creator?.name}.`,
      "whatsapp"
    );
  };

  const postOpportunity = (oppData: Partial<Opportunity>) => {
    const newOpp: Opportunity = {
      id: `opp-${Date.now()}`,
      title: oppData.title || "Custom Artisan Opportunity",
      titleHindi: oppData.titleHindi || oppData.title || "नया अवसर",
      description: oppData.description || "",
      category: oppData.category || "Folk Craft",
      type: oppData.type || "Commission",
      typeHindi: oppData.type || "कमीशन",
      location: oppData.location || "Delhi NCR",
      budgetMin: oppData.budgetMin || 10000,
      budgetMax: oppData.budgetMax || 25000,
      deadline: oppData.deadline || "10 days left",
      postedBy: currentUser.name,
      postedByOrg: currentUser.tagline || "Patron Member",
      postedByAvatar: currentUser.avatarUrl,
      postedByVerified: true,
      requirements: oppData.requirements || ["Verified portfolio with at least 2 relevant works"],
      tags: oppData.tags || ["Custom Commission", "Local Artist"],
      featured: false,
      matchedCategories: [oppData.category || "Folk Craft"],
      applicationsCount: 0,
      createdAt: new Date().toISOString().split("T")[0]
    };

    setOpportunities((prev) => [newOpp, ...prev]);
    showToast(
      language === "hi" ? "नया अवसर प्रकाशित हुआ!" : "Opportunity Published!",
      language === "hi" ? "स्थानीय कारीगरों को नोटिफिकेशन भेजा गया है।" : "Listed on Hunar Radar. Regional artists can now apply.",
      "success"
    );
  };

  const registerCreatorFromOnboarding = (newCreatorData: Partial<Creator>): Creator => {
    const username = (newCreatorData.name || "creator")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-") + `-${Math.floor(Math.random() * 899 + 100)}`;

    const fullCreator: Creator = {
      id: `creator-${Date.now()}`,
      name: newCreatorData.name || "Artisan Creator",
      nameHindi: newCreatorData.nameHindi || newCreatorData.name || "कलाकार",
      username,
      phone: newCreatorData.phone || "+91 98765 43210",
      whatsapp: "919876543210",
      city: newCreatorData.city || "Jaipur",
      state: "Rajasthan",
      primaryArtForm: newCreatorData.primaryArtForm || "Visual Arts",
      artFormHindi: newCreatorData.primaryArtForm || "दृश्य कला",
      languages: newCreatorData.languages || ["Hindi", "English"],
      experienceLevel: newCreatorData.experienceLevel || "Emerging (1-3 yrs)",
      bio: newCreatorData.bio || "Dedicated grassroots artisan creating authentic handmade art.",
      bioHindi: "पारंपरिक एवं प्रामाणिक कला में समर्पित स्थानीय कारीगर।",
      avatarUrl:
        newCreatorData.avatarUrl ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      coverImage: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&auto=format&fit=crop&q=80",
      isVerified: true,
      minPricing: newCreatorData.minPricing || 2500,
      hourlyRate: 500,
      unitPricingLabel: `Commissions from ₹${(newCreatorData.minPricing || 2500).toLocaleString("en-IN")}`,
      sixMonthIncomeGoal: newCreatorData.sixMonthIncomeGoal || 35000,
      currentMonthlyIncome: 12000,
      rating: 5.0,
      reviewsCount: 1,
      completedGigsCount: 3,
      skills: ["Handmade Craft", "Local Materials", "Custom Orders"],
      badges: ["Newly Verified", "Hunar Pioneer"],
      whatsappInquiryText: `Namaste, I saw your Hunar Card. I would like to inquire about your art.`,
      portfolioImages: [
        {
          id: "new-p1",
          title: "Inaugural Signature Craft Work",
          medium: "Organic local materials",
          imageUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80",
          price: newCreatorData.minPricing || 3500,
          clientQuote: "Outstanding dedication and authentic traditional feel."
        }
      ]
    };

    setCreators((prev) => [fullCreator, ...prev]);

    return fullCreator;
  };

  return (
    <HunarContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        currentPersona,
        setPersona,
        creators,
        opportunities,
        roadmaps,
        applications,
        bookings,
        completedMilestones,
        toggleMilestone,
        applyToOpportunity,
        hireCreator,
        postOpportunity,
        registerCreatorFromOnboarding,

        // Auth & Roles
        currentUser,
        login,
        logout,
        switchDemoRole,

        // Products & Wishlist
        products,
        savedProductIds,
        toggleSaveProduct,
        savedCreatorIds,
        toggleSaveCreator,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductStatus,

        // Inquiries
        inquiries,
        createInquiry,
        updateInquiryStatus,

        // Toast
        toast,
        showToast,
        dismissToast
      }}
    >
      {children}
    </HunarContext.Provider>
  );
}

export function useHunar() {
  const context = useContext(HunarContext);
  if (!context) {
    throw new Error("useHunar must be used within a HunarProvider");
  }
  return context;
}
