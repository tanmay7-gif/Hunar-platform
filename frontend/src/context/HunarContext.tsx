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
import { tinyFish } from "@tinyfish/core";

interface ToastState {
  id: string;
  title: string;
  message: string;
  type: "success" | "info" | "whatsapp";
}

export interface AuthResponse {
  success: boolean;
  user?: UserAccount;
  error?: string;
}

interface HunarContextType {
  tinyFish: typeof tinyFish;
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
  login: (email: string, password?: string) => Promise<AuthResponse>;
  loginAsDemo: (role: "SELLER" | "CUSTOMER") => UserAccount;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    role: "SELLER" | "CUSTOMER";
    city?: string;
  }) => Promise<AuthResponse>;
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
  const [savedProductIds, setSavedProductIds] = useState<string[]>([]);
  const [savedCreatorIds, setSavedCreatorIds] = useState<string[]>([]);
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

  // Helper to load user-specific saved collections (Wishlist & Shortlists)
  const loadUserSavedData = (user: UserAccount) => {
    if (typeof window === "undefined") return;
    try {
      const userFavsKey = `hunar_saved_products_${user.id}`;
      const savedFavs = localStorage.getItem(userFavsKey);
      if (savedFavs) {
        setSavedProductIds(JSON.parse(savedFavs));
      } else if (user.id === "demo-customer-priya") {
        setSavedProductIds(["prod-khurja-tea-set", "prod-mithila-tree-of-life"]);
      } else {
        setSavedProductIds([]);
      }

      const userArtistsKey = `hunar_saved_creators_${user.id}`;
      const savedArtists = localStorage.getItem(userArtistsKey);
      if (savedArtists) {
        setSavedCreatorIds(JSON.parse(savedArtists));
      } else if (user.id === "demo-customer-priya") {
        setSavedCreatorIds(["creator-sunita", "creator-arif"]);
      } else {
        setSavedCreatorIds([]);
      }
    } catch {
      // ignore in SSR
    }
  };

  // Load from local storage in browser
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("hunar_lang") as "en" | "hi" | null;
      if (savedLang) setLanguage(savedLang);

      const savedMilestones = localStorage.getItem("hunar_milestones");
      if (savedMilestones) setCompletedMilestones(JSON.parse(savedMilestones));

      const savedUser = localStorage.getItem("hunar_user_account");
      if (savedUser) {
        const parsed = JSON.parse(savedUser) as UserAccount;
        setCurrentUser(parsed);
        loadUserSavedData(parsed);
      } else {
        loadUserSavedData(DEMO_ACCOUNTS[0]);
      }
    } catch {
      // ignore in SSR
    }
  }, []);

  // Synchronize TinyFish reactive client-side/edge indexing engine
  useEffect(() => {
    try {
      const prodCol = tinyFish.getCollection<Product>("products");
      prodCol.clear();
      prodCol.insertBatch(products);

      const oppCol = tinyFish.getCollection<Opportunity>("opportunities");
      oppCol.clear();
      oppCol.insertBatch(opportunities);

      const creatorCol = tinyFish.getCollection<Creator>("creators");
      creatorCol.clear();
      creatorCol.insertBatch(creators);
    } catch (err) {
      console.error("TinyFish indexing sync error:", err);
    }
  }, [products, opportunities, creators]);

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

  // Local helper for persistent registered custom accounts
  const getLocalRegisteredUsers = (): UserAccount[] => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem("hunar_registered_users");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const saveLocalRegisteredUser = (user: UserAccount) => {
    if (typeof window === "undefined") return;
    try {
      const current = getLocalRegisteredUsers();
      const filtered = current.filter((u) => u.email.toLowerCase() !== user.email.toLowerCase());
      filtered.push(user);
      localStorage.setItem("hunar_registered_users", JSON.stringify(filtered));
    } catch {
      // ignore
    }
  };

  // Dedicated 1-Click Demo Profiles Login
  const loginAsDemo = (role: "SELLER" | "CUSTOMER"): UserAccount => {
    const target = role === "SELLER" ? DEMO_ACCOUNTS[0] : DEMO_ACCOUNTS[1];
    setCurrentUser(target);
    loadUserSavedData(target);
    try {
      localStorage.setItem("hunar_user_account", JSON.stringify(target));
      document.cookie = `hunar_user_role=${target.role}; path=/; max-age=604800`;
      document.cookie = `hunar_user_id=${target.id}; path=/; max-age=604800`;
      document.cookie = `hunar_user_name=${encodeURIComponent(target.name)}; path=/; max-age=604800`;
    } catch {
      // ignore
    }

    showToast(
      language === "hi" ? "डेमो खाता सक्रिय" : "Demo Profile Active",
      language === "hi"
        ? `${target.name} (${target.role === "SELLER" ? "कारीगर स्टूडियो" : "कला संरक्षक"}) के रूप में प्रवेश किया गया`
        : `Signed in as demo: ${target.name} (${target.role})`,
      "info"
    );

    return target;
  };

  // Manual Credentials Authentication: Strictly checks entered email & password
  const login = async (email: string, password?: string): Promise<AuthResponse> => {
    try {
      const normalizedEmail = email.trim().toLowerCase();
      if (!normalizedEmail) {
        return { success: false, error: "Please enter your email address." };
      }
      if (!password) {
        return { success: false, error: "Please enter your password." };
      }

      // 1. Try server API authentication
      let serverUser: UserAccount | null = null;
      let serverError: string | null = null;

      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: normalizedEmail, password })
        });
        const data = await res.json();
        if (res.ok && data.success && data.data) {
          serverUser = data.data;
        } else {
          serverError = data.error || "Invalid email or password.";
        }
      } catch (e) {
        console.warn("Server auth endpoint unavailable, falling back to local verification:", e);
      }

      // If server responded with an error (e.g. 401), honor it strictly
      if (serverError && !serverUser) {
        return { success: false, error: serverError };
      }

      if (serverUser) {
        setCurrentUser(serverUser);
        loadUserSavedData(serverUser);
        try {
          localStorage.setItem("hunar_user_account", JSON.stringify(serverUser));
          document.cookie = `hunar_user_role=${serverUser.role}; path=/; max-age=604800`;
          document.cookie = `hunar_user_id=${serverUser.id}; path=/; max-age=604800`;
          document.cookie = `hunar_user_name=${encodeURIComponent(serverUser.name)}; path=/; max-age=604800`;
        } catch {
          // ignore
        }

        showToast(
          language === "hi" ? "लॉगिन सफल" : "Authentication Successful",
          language === "hi"
            ? `${serverUser.name} (${serverUser.role === "SELLER" ? "कारीगर स्टूडियो" : "कला संरक्षक"}) के रूप में स्वागत है`
            : `Signed in as ${serverUser.name} (${serverUser.role})`,
          "success"
        );

        return { success: true, user: serverUser };
      }

      // 2. Client-side local verification fallback
      const localUsers = getLocalRegisteredUsers();
      const allKnown = [...DEMO_ACCOUNTS, ...localUsers];
      const matched = allKnown.find((a) => a.email.toLowerCase() === normalizedEmail);

      if (!matched) {
        return {
          success: false,
          error: "No account found with this email. Please check your credentials or register."
        };
      }

      if (matched.password && matched.password !== password) {
        return {
          success: false,
          error: "Invalid email or password."
        };
      }

      setCurrentUser(matched);
      loadUserSavedData(matched);
      try {
        localStorage.setItem("hunar_user_account", JSON.stringify(matched));
        document.cookie = `hunar_user_role=${matched.role}; path=/; max-age=604800`;
        document.cookie = `hunar_user_id=${matched.id}; path=/; max-age=604800`;
        document.cookie = `hunar_user_name=${encodeURIComponent(matched.name)}; path=/; max-age=604800`;
      } catch {
        // ignore
      }

      showToast(
        language === "hi" ? "लॉगिन सफल" : "Authentication Successful",
        language === "hi"
          ? `${matched.name} (${matched.role === "SELLER" ? "कारीगर स्टूडियो" : "कला संरक्षक"}) के रूप में स्वागत है`
          : `Signed in as ${matched.name} (${matched.role})`,
        "success"
      );

      return { success: true, user: matched };
    } catch (err) {
      console.error("Login failed:", err);
      return { success: false, error: "An unexpected authentication error occurred." };
    }
  };

  // Register a new user account
  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    role: "SELLER" | "CUSTOMER";
    city?: string;
  }): Promise<AuthResponse> => {
    try {
      const normalizedEmail = userData.email.trim().toLowerCase();

      if (!userData.name || !userData.name.trim()) {
        return { success: false, error: "Please enter your full name." };
      }
      if (!normalizedEmail || !normalizedEmail.includes("@")) {
        return { success: false, error: "Please enter a valid email address." };
      }
      if (!userData.password || userData.password.length < 6) {
        return { success: false, error: "Password must be at least 6 characters." };
      }

      // Check client-side duplicate
      const localUsers = getLocalRegisteredUsers();
      if ([...DEMO_ACCOUNTS, ...localUsers].some((u) => u.email.toLowerCase() === normalizedEmail)) {
        return { success: false, error: "An account with this email already exists. Please sign in instead." };
      }

      // 1. Try server register endpoint
      let serverUser: UserAccount | null = null;
      let serverError: string | null = null;

      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...userData, email: normalizedEmail })
        });
        const data = await res.json();
        if (res.ok && data.success && data.data) {
          serverUser = data.data;
        } else {
          serverError = data.error || "Failed to create account.";
        }
      } catch (e) {
        console.warn("Server register endpoint error, falling back locally:", e);
      }

      if (serverError && !serverUser) {
        return { success: false, error: serverError };
      }

      const generatedUuid =
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      const initialsFallback = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        userData.name.trim()
      )}&backgroundColor=b4461f,2d583b`;

      const newUser: UserAccount = serverUser || {
        id: generatedUuid,
        name: userData.name.trim(),
        email: normalizedEmail,
        password: userData.password,
        role: userData.role,
        city: userData.city?.trim() || "Delhi NCR",
        avatarUrl: initialsFallback,
        isVerified: true,
        tagline: userData.role === "SELLER" ? "Studio Artisan & Craftsman" : "Art Patron & Collector",
        onboardingCompleted: userData.role === "SELLER" ? false : true
      };

      saveLocalRegisteredUser(newUser);

      // Initialize empty user-scoped relational tables/arrays
      try {
        localStorage.setItem(`hunar_saved_products_${newUser.id}`, JSON.stringify([]));
        localStorage.setItem(`hunar_saved_creators_${newUser.id}`, JSON.stringify([]));
      } catch {
        // ignore
      }
      setSavedProductIds([]);
      setSavedCreatorIds([]);

      // If new user is a seller, register their creator profile so they appear in creator discovery
      if (newUser.role === "SELLER") {
        const username = newUser.email.split("@")[0].replace(/[^a-zA-Z0-9_-]/g, "");
        const newCreator: Creator = {
          id: `creator-${newUser.id}`,
          name: newUser.name,
          nameHindi: newUser.name,
          username,
          phone: "+91 98765 43210",
          whatsapp: "919876543210",
          city: newUser.city,
          state: "India",
          primaryArtForm: "Crafts & Studio Art",
          artFormHindi: "शिल्प एवं स्टूडियो कला",
          languages: ["Hindi", "English"],
          experienceLevel: "Artisan Studio",
          bio: `Verified creator studio on Hunar. Based in ${newUser.city}.`,
          bioHindi: `हुनर पर सत्यापित शिल्प स्टूडियो। ${newUser.city} में स्थित।`,
          avatarUrl: newUser.avatarUrl,
          coverImage: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1200&auto=format&fit=crop&q=80",
          isVerified: true,
          minPricing: 1500,
          hourlyRate: 500,
          unitPricingLabel: "Commissions from ₹1,500",
          sixMonthIncomeGoal: 35000,
          currentMonthlyIncome: 15000,
          rating: 5.0,
          reviewsCount: 1,
          completedGigsCount: 1,
          skills: ["Handcrafted", "Studio Commission"],
          badges: ["New Creator", "Direct Artisan"],
          whatsappInquiryText: "Namaste! I saw your Hunar Card. I would like to inquire about your craft.",
          portfolioImages: []
        };
        setCreators((prev) => [newCreator, ...prev]);
      }

      setCurrentUser(newUser);
      loadUserSavedData(newUser);
      try {
        localStorage.setItem("hunar_user_account", JSON.stringify(newUser));
        document.cookie = `hunar_user_role=${newUser.role}; path=/; max-age=604800`;
        document.cookie = `hunar_user_id=${newUser.id}; path=/; max-age=604800`;
        document.cookie = `hunar_user_name=${encodeURIComponent(newUser.name)}; path=/; max-age=604800`;
      } catch {
        // ignore
      }

      showToast(
        language === "hi" ? "खाता सफलतापूर्वक बना" : "Account Created",
        language === "hi"
          ? `हुनर में स्वागत है, ${newUser.name}!`
          : `Welcome to Hunar, ${newUser.name}! Your ${newUser.role === "SELLER" ? "Artisan Studio" : "Patron"} account is active.`,
        "success"
      );

      return { success: true, user: newUser };
    } catch (err) {
      console.error("Registration failed:", err);
      return { success: false, error: "An unexpected registration error occurred." };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    } catch {
      // ignore
    }

    try {
      localStorage.removeItem("hunar_user_account");
      document.cookie = "hunar_user_role=; path=/; max-age=0";
      document.cookie = "hunar_user_id=; path=/; max-age=0";
      document.cookie = "hunar_user_name=; path=/; max-age=0";
    } catch {
      // ignore
    }

    // Reset to clean unauthenticated guest state
    const guestUser: UserAccount = {
      id: "guest",
      name: "Guest",
      email: "",
      role: "CUSTOMER",
      city: "Delhi NCR",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
    };
    setCurrentUser(guestUser);
    setSavedProductIds([]);
    setSavedCreatorIds([]);

    showToast(
      language === "hi" ? "लॉगआउट सफल" : "Signed Out",
      language === "hi" ? "आप अपने सत्र से सफलतापूर्वक बाहर हो चुके हैं।" : "You have been signed out of your account.",
      "info"
    );
  };

  const switchDemoRole = (role: "SELLER" | "CUSTOMER") => {
    const target = role === "SELLER" ? DEMO_ACCOUNTS[0] : DEMO_ACCOUNTS[1];
    setCurrentUser(target);
    loadUserSavedData(target);
    try {
      localStorage.setItem("hunar_user_account", JSON.stringify(target));
      document.cookie = `hunar_user_role=${target.role}; path=/; max-age=604800`;
      document.cookie = `hunar_user_id=${target.id}; path=/; max-age=604800`;
      document.cookie = `hunar_user_name=${encodeURIComponent(target.name)}; path=/; max-age=604800`;
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
        localStorage.setItem(`hunar_saved_products_${currentUser.id}`, JSON.stringify(next));
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
        localStorage.setItem(`hunar_saved_creators_${currentUser.id}`, JSON.stringify(next));
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
      sellerId: currentUser.id || "demo-seller-rohit",
      sellerName: currentUser.name || "Rohit Sharma",
      sellerCity: currentUser.city || "Khurja / Delhi NCR",
      sellerAvatar: currentUser.avatarUrl,
      sellerPhone: currentUser.phone || "+91 98118 76543",
      sellerWhatsapp: currentUser.whatsapp || "919811876543",
      sellerVerified: currentUser.isVerified ?? true,
      createdAt: new Date().toISOString().split("T")[0]
    };

    setProducts((prev) => [newProduct, ...prev]);

    // Enqueue in TinyFish offline-ready sync queue & in-memory index
    try {
      tinyFish.enqueueDraft(newProduct);
    } catch (err) {
      console.warn("TinyFish draft enqueue error:", err);
    }

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

    // Enqueue update in TinyFish offline-ready sync queue
    try {
      tinyFish.getSyncQueue().enqueue("products", "update", { id, ...updates });
    } catch (err) {
      console.warn("TinyFish update enqueue error:", err);
    }

    showToast(
      language === "hi" ? "उत्पाद अद्यतन हुआ" : "Product Updated",
      language === "hi" ? "कलाकृति का विवरण सहेज लिया गया है।" : "Catalog item details updated successfully.",
      "success"
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    try {
      tinyFish.getCollection<Product>("products").delete(id);
      tinyFish.getSyncQueue().enqueue("products", "delete", { id });
    } catch {
      // ignore
    }
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

          // Enqueue status update in TinyFish offline-ready sync queue
          try {
            tinyFish.enqueueStatusUpdate(id, nextStatus);
          } catch (err) {
            console.warn("TinyFish status enqueue error:", err);
          }

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
      customerId: currentUser.id || "demo-customer-priya",
      customerName: inqData.customerName || currentUser.name || "Priya Nair",
      customerPhone: inqData.customerPhone || currentUser.phone || "+91 98711 44220",
      customerEmail: inqData.customerEmail || currentUser.email || "priya.patron@hunar.in",
      sellerId: inqData.sellerId || "demo-seller-rohit",
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

    setCurrentUser((prev) => {
      const updated: UserAccount = {
        ...prev,
        city: newCreatorData.city || prev.city,
        bio: newCreatorData.bio || prev.bio,
        artCategory: newCreatorData.primaryArtForm || prev.artCategory,
        tagline: newCreatorData.primaryArtForm
          ? `${newCreatorData.primaryArtForm} Studio Master`
          : prev.tagline,
        onboardingCompleted: true
      };
      try {
        localStorage.setItem("hunar_user_account", JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    return fullCreator;
  };

  return (
    <HunarContext.Provider
      value={{
        tinyFish,
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
        loginAsDemo,
        register,
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
