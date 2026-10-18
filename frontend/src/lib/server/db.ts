// Hunar Server Database Layer
// Supports complete CRUD operations with robust data models matching Prisma schema
import {
  Creator,
  Opportunity,
  Application,
  RoadmapStep,
  Booking,
  UserAccount,
  Product,
  CustomerInquiry,
  SEED_CREATORS,
  SEED_OPPORTUNITIES,
  SEED_ROADMAPS,
  DEMO_ACCOUNTS,
  SEED_PRODUCTS,
  SEED_INQUIRIES
} from "@/lib/data";

// In-memory persistent singleton in Node runtime
declare global {
  // eslint-disable-next-line no-var
  var __HUNAR_DB__: {
    creators: Creator[];
    opportunities: Opportunity[];
    applications: Application[];
    roadmaps: Record<string, RoadmapStep[]>;
    bookings: Booking[];
    completedMilestones: Record<string, boolean>;
    accounts: UserAccount[];
    products: Product[];
    inquiries: CustomerInquiry[];
  } | undefined;
}

function getDatabase() {
  if (!global.__HUNAR_DB__) {
    global.__HUNAR_DB__ = {
      creators: [...SEED_CREATORS],
      opportunities: [...SEED_OPPORTUNITIES],
      applications: [
        {
          id: "app-seed-1",
          opportunityId: "opp-1",
          creatorId: "creator-arif",
          creatorName: "Arif Khan",
          proposedRate: 38000,
          pitch: "I have painted 8+ flagship specialty cafe walls in Hauz Khas & Jaipur. I can complete this within 6 days using washable moisture-sealed acrylics.",
          status: "pending",
          createdAt: "2026-10-14"
        }
      ],
      roadmaps: { ...SEED_ROADMAPS },
      bookings: [],
      completedMilestones: {
        m1: true,
        m2: true,
        p_m1: true,
        p_m2: true,
        f_m1: true,
        mh_m1: true,
        mh_m2: true
      },
      accounts: [...DEMO_ACCOUNTS],
      products: [...SEED_PRODUCTS],
      inquiries: [...SEED_INQUIRIES]
    };
  }
  // Defensive fallbacks in case singleton was initialized in earlier hot-reloads
  if (!global.__HUNAR_DB__.accounts) global.__HUNAR_DB__.accounts = [...DEMO_ACCOUNTS];
  if (!global.__HUNAR_DB__.products) global.__HUNAR_DB__.products = [...SEED_PRODUCTS];
  if (!global.__HUNAR_DB__.inquiries) global.__HUNAR_DB__.inquiries = [...SEED_INQUIRIES];
  return global.__HUNAR_DB__;
}

// ====================================================
// 1. CREATORS / USERS CRUD
// ====================================================
export const CreatorService = {
  getAll: (filters?: { artForm?: string; city?: string; search?: string; verifiedOnly?: boolean }) => {
    const db = getDatabase();
    let results = [...db.creators];

    if (filters?.artForm && filters.artForm !== "All") {
      results = results.filter(
        (c) => c.primaryArtForm.toLowerCase() === filters.artForm?.toLowerCase()
      );
    }

    if (filters?.city && filters.city !== "All") {
      results = results.filter((c) =>
        c.city.toLowerCase().includes(filters.city!.toLowerCase())
      );
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.nameHindi.toLowerCase().includes(q) ||
          c.bio.toLowerCase().includes(q) ||
          c.skills.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (filters?.verifiedOnly) {
      results = results.filter((c) => c.isVerified);
    }

    return results;
  },

  getByUsername: (username: string) => {
    const db = getDatabase();
    return db.creators.find((c) => c.username.toLowerCase() === username.toLowerCase());
  },

  getById: (id: string) => {
    const db = getDatabase();
    return db.creators.find((c) => c.id === id);
  },

  create: (data: Partial<Creator>) => {
    const db = getDatabase();
    const username = (data.name || "artisan")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-") + `-${Math.floor(Math.random() * 899 + 100)}`;

    const newCreator: Creator = {
      id: `creator-${Date.now()}`,
      name: data.name || "Artisan Creator",
      nameHindi: data.nameHindi || data.name || "कारीगर",
      username: data.username || username,
      phone: data.phone || "+91 98765 43210",
      whatsapp: data.whatsapp || "919876543210",
      city: data.city || "Jaipur",
      state: data.state || "Rajasthan",
      primaryArtForm: data.primaryArtForm || "Visual Arts",
      artFormHindi: data.artFormHindi || data.primaryArtForm || "दृश्य कला",
      languages: data.languages || ["Hindi", "English"],
      experienceLevel: data.experienceLevel || "Emerging (1-3 yrs)",
      bio: data.bio || "Dedicated grassroots artisan crafting authentic traditional works.",
      bioHindi: data.bioHindi || "पारंपरिक एवं प्रामाणिक कला में समर्पित स्थानीय कारीगर।",
      avatarUrl:
        data.avatarUrl ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      coverImage:
        data.coverImage ||
        "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&auto=format&fit=crop&q=80",
      isVerified: data.isVerified ?? true,
      minPricing: data.minPricing || 2500,
      hourlyRate: data.hourlyRate || 500,
      unitPricingLabel: data.unitPricingLabel || `Commissions from ₹${(data.minPricing || 2500).toLocaleString("en-IN")}`,
      sixMonthIncomeGoal: data.sixMonthIncomeGoal || 35000,
      currentMonthlyIncome: data.currentMonthlyIncome || 12000,
      rating: 5.0,
      reviewsCount: 1,
      completedGigsCount: 1,
      skills: data.skills || ["Handcrafted Art", "Custom Orders", "Local Materials"],
      badges: ["Verified Artisan", "Hunar Pioneer"],
      whatsappInquiryText: `Namaste, I saw your Hunar Card. I would like to inquire about commissioning artwork.`,
      portfolioImages: data.portfolioImages?.length
        ? data.portfolioImages
        : [
            {
              id: `p-${Date.now()}`,
              title: "Signature Traditional Handcrafted Masterpiece",
              medium: "Natural pigments on archival canvas",
              imageUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80",
              price: data.minPricing || 3500,
              clientQuote: "Flawless craft and deep cultural authenticity."
            }
          ]
    };

    db.creators.unshift(newCreator);
    return newCreator;
  },

  update: (username: string, updates: Partial<Creator>) => {
    const db = getDatabase();
    const index = db.creators.findIndex((c) => c.username.toLowerCase() === username.toLowerCase());
    if (index === -1) return null;

    db.creators[index] = { ...db.creators[index], ...updates };
    return db.creators[index];
  },

  delete: (id: string) => {
    const db = getDatabase();
    const initialLen = db.creators.length;
    db.creators = db.creators.filter((c) => c.id !== id);
    return db.creators.length < initialLen;
  }
};

// ====================================================
// 2. OPPORTUNITIES CRUD
// ====================================================
export const OpportunityService = {
  getAll: (filters?: {
    category?: string;
    type?: string;
    location?: string;
    search?: string;
    minBudget?: number;
    maxBudget?: number;
  }) => {
    const db = getDatabase();
    let results = [...db.opportunities];

    if (filters?.category && filters.category !== "All") {
      results = results.filter(
        (o) =>
          o.category.toLowerCase() === filters.category?.toLowerCase() ||
          o.matchedCategories.some((mc) => mc.toLowerCase() === filters.category?.toLowerCase())
      );
    }

    if (filters?.type && filters.type !== "All") {
      results = results.filter((o) => o.type.toLowerCase() === filters.type?.toLowerCase());
    }

    if (filters?.location && filters.location !== "All") {
      results = results.filter((o) =>
        o.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    if (filters?.minBudget) {
      results = results.filter((o) => o.budgetMax >= filters.minBudget!);
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(
        (o) =>
          o.title.toLowerCase().includes(q) ||
          o.titleHindi.toLowerCase().includes(q) ||
          o.description.toLowerCase().includes(q) ||
          o.postedByOrg.toLowerCase().includes(q) ||
          o.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return results;
  },

  getById: (id: string) => {
    const db = getDatabase();
    return db.opportunities.find((o) => o.id === id);
  },

  create: (data: Partial<Opportunity>) => {
    const db = getDatabase();
    const newOpp: Opportunity = {
      id: `opp-${Date.now()}`,
      title: data.title || "Custom Artisan Opportunity",
      titleHindi: data.titleHindi || data.title || "कला अवसर",
      description: data.description || "Detailed gig requirements for local artisan.",
      category: data.category || "Murals",
      type: data.type || "Commission",
      typeHindi: data.typeHindi || "कमीशन",
      location: data.location || "Delhi NCR",
      budgetMin: data.budgetMin || 15000,
      budgetMax: data.budgetMax || 30000,
      deadline: data.deadline || "14 days left",
      postedBy: data.postedBy || "Verified Partner",
      postedByOrg: data.postedByOrg || "Hunar Patron Network",
      postedByAvatar:
        data.postedByAvatar ||
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80",
      postedByVerified: true,
      requirements: data.requirements || [
        "Proven experience and portfolio in relevant craft",
        "Timely milestone deliveries with weekly photos"
      ],
      tags: data.tags || ["Direct Booking", "Fair Price Guaranteed"],
      featured: data.featured ?? false,
      matchedCategories: [data.category || "Murals"],
      applicationsCount: 0,
      createdAt: new Date().toISOString().split("T")[0]
    };

    db.opportunities.unshift(newOpp);
    return newOpp;
  },

  update: (id: string, updates: Partial<Opportunity>) => {
    const db = getDatabase();
    const index = db.opportunities.findIndex((o) => o.id === id);
    if (index === -1) return null;

    db.opportunities[index] = { ...db.opportunities[index], ...updates };
    return db.opportunities[index];
  },

  delete: (id: string) => {
    const db = getDatabase();
    const initialLen = db.opportunities.length;
    db.opportunities = db.opportunities.filter((o) => o.id !== id);
    return db.opportunities.length < initialLen;
  },

  apply: (oppId: string, applicationData: { creatorId: string; creatorName?: string; proposedRate: number; pitch: string }) => {
    const db = getDatabase();
    const opp = db.opportunities.find((o) => o.id === oppId);
    if (!opp) return null;

    const newApp: Application = {
      id: `app-${Date.now()}`,
      opportunityId: oppId,
      creatorId: applicationData.creatorId,
      creatorName: applicationData.creatorName || "Grassroots Creator",
      proposedRate: applicationData.proposedRate,
      pitch: applicationData.pitch,
      status: "pending",
      createdAt: new Date().toISOString().split("T")[0]
    };

    db.applications.unshift(newApp);
    opp.applicationsCount += 1;
    return newApp;
  },

  getApplications: (oppId?: string) => {
    const db = getDatabase();
    if (oppId) {
      return db.applications.filter((a) => a.opportunityId === oppId);
    }
    return db.applications;
  }
};

// ====================================================
// 3. ROADMAP SERVICES
// ====================================================
export const RoadmapService = {
  getStepsByCraft: (craftName: string) => {
    const db = getDatabase();
    return db.roadmaps[craftName] || db.roadmaps["Murals"] || [];
  },

  getAllRoadmaps: () => {
    const db = getDatabase();
    return db.roadmaps;
  },

  toggleMilestone: (milestoneId: string) => {
    const db = getDatabase();
    const currentState = !!db.completedMilestones[milestoneId];
    db.completedMilestones[milestoneId] = !currentState;
    return { milestoneId, completed: !currentState };
  },

  getMilestoneStates: () => {
    const db = getDatabase();
    return db.completedMilestones;
  }
};

// ====================================================
// 4. BOOKINGS & COMMISSIONS CRUD
// ====================================================
export const BookingService = {
  createHireRequest: (data: {
    creatorId: string;
    clientName: string;
    clientPhone: string;
    budget: number;
    note: string;
  }) => {
    const db = getDatabase();
    const creator = db.creators.find((c) => c.id === data.creatorId);

    const booking: Booking = {
      id: `hire-${Date.now()}`,
      creatorId: data.creatorId,
      title: `Direct Commission for ${creator?.name || "Artisan"}`,
      type: "creator_hire",
      clientName: data.clientName,
      clientPhone: data.clientPhone,
      budgetProposed: data.budget,
      selectedSlot: "Immediate / 14-day window",
      note: data.note,
      createdAt: new Date().toISOString().split("T")[0],
      status: "pending"
    };

    db.bookings.unshift(booking);
    return booking;
  },

  getBookings: () => {
    const db = getDatabase();
    return db.bookings;
  }
};

// ====================================================
// 5. PLATFORM METRICS & STATS
// ====================================================
export const StatsService = {
  getSummary: () => {
    const db = getDatabase();
    const totalEarningsFacilitated = db.creators.reduce(
      (acc, c) => acc + c.completedGigsCount * c.minPricing,
      0
    );

    return {
      activeArtisansCount: db.creators.length,
      verifiedMastersCount: db.creators.filter((c) => c.isVerified).length,
      activeOpportunitiesCount: db.opportunities.length,
      totalGigsVolumeInr: totalEarningsFacilitated,
      completedGigsCount: db.creators.reduce((acc, c) => acc + c.completedGigsCount, 0),
      topCities: ["Delhi NCR", "Jaipur", "Lucknow", "Madhubani", "Varanasi", "Mumbai"],
      supportedCrafts: [
        "Madhubani & Mithila Folk",
        "Urban Wall Murals",
        "Studio Pottery & Terracotta",
        "Bridal & Festive Mehndi",
        "Visual & Fine Arts",
        "Traditional Acoustic Performing Arts"
      ]
    };
  }
};

// ====================================================
// 6. PRODUCTS & ARTWORK CATALOG CRUD
// ====================================================
export const ProductService = {
  getAll: (filters?: {
    category?: string;
    city?: string;
    search?: string;
    deliveryFormat?: string;
    minPrice?: number;
    maxPrice?: number;
    sellerId?: string;
    status?: string;
  }) => {
    const db = getDatabase();
    let results = [...db.products];

    if (filters?.sellerId) {
      results = results.filter((p) => p.sellerId === filters.sellerId);
    }

    if (filters?.category && filters.category !== "All") {
      results = results.filter(
        (p) => p.category.toLowerCase() === filters.category!.toLowerCase()
      );
    }

    if (filters?.city && filters.city !== "All") {
      results = results.filter((p) =>
        p.sellerCity.toLowerCase().includes(filters.city!.toLowerCase())
      );
    }

    if (filters?.deliveryFormat && filters.deliveryFormat !== "All") {
      results = results.filter((p) => p.deliveryFormat === filters.deliveryFormat);
    }

    if (filters?.status && filters.status !== "All") {
      results = results.filter((p) => p.status === filters.status);
    } else if (!filters?.sellerId) {
      // By default for customer discovery, show only Live items unless specified
      results = results.filter((p) => p.status === "Live");
    }

    if (filters?.minPrice !== undefined) {
      results = results.filter((p) => p.price >= filters.minPrice!);
    }

    if (filters?.maxPrice !== undefined) {
      results = results.filter((p) => p.price <= filters.maxPrice!);
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.titleHindi && p.titleHindi.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q) ||
          p.sellerName.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.material && p.material.toLowerCase().includes(q))
      );
    }

    return results;
  },

  getById: (id: string) => {
    const db = getDatabase();
    return db.products.find((p) => p.id === id);
  },

  create: (data: Partial<Product>) => {
    const db = getDatabase();
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      title: data.title || "Handmade Artisan Creation",
      titleHindi: data.titleHindi || data.title,
      description: data.description || "Authentic handmade piece crafted by grassroots artisan.",
      price: Number(data.price || 1500),
      category: (data.category as Product["category"]) || "Terracotta & Pottery",
      images: data.images && data.images.length > 0
        ? data.images
        : ["https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80"],
      leadTime: data.leadTime || "Ready to ship",
      stock: Number(data.stock ?? 1),
      deliveryFormat: (data.deliveryFormat as Product["deliveryFormat"]) || "Physical Artwork",
      status: (data.status as Product["status"]) || "Live",
      dimensions: data.dimensions || "Custom handcrafted dimensions",
      material: data.material || "Natural raw materials",
      sellerId: data.sellerId || "user-rohit-seller",
      sellerName: data.sellerName || "Rohit Sharma",
      sellerCity: data.sellerCity || "Khurja / Delhi NCR",
      sellerAvatar:
        data.sellerAvatar ||
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80",
      sellerPhone: data.sellerPhone || "+91 98118 76543",
      sellerWhatsapp: data.sellerWhatsapp || "919811876543",
      sellerVerified: data.sellerVerified ?? true,
      createdAt: new Date().toISOString().split("T")[0]
    };

    db.products.unshift(newProduct);
    return newProduct;
  },

  update: (id: string, updates: Partial<Product>) => {
    const db = getDatabase();
    const index = db.products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    db.products[index] = { ...db.products[index], ...updates };
    return db.products[index];
  },

  delete: (id: string) => {
    const db = getDatabase();
    const initialLen = db.products.length;
    db.products = db.products.filter((p) => p.id !== id);
    return db.products.length < initialLen;
  },

  toggleStatus: (id: string) => {
    const db = getDatabase();
    const product = db.products.find((p) => p.id === id);
    if (!product) return null;

    product.status = product.status === "Live" ? "Draft" : "Live";
    return product;
  }
};

// ====================================================
// 7. INQUIRIES & COMMISSIONS CRUD
// ====================================================
export const InquiryService = {
  getAll: () => {
    const db = getDatabase();
    return db.inquiries;
  },

  getByCustomer: (customerId: string) => {
    const db = getDatabase();
    return db.inquiries.filter((inq) => inq.customerId === customerId);
  },

  getBySeller: (sellerId: string) => {
    const db = getDatabase();
    return db.inquiries.filter((inq) => inq.sellerId === sellerId);
  },

  create: (data: Partial<CustomerInquiry>) => {
    const db = getDatabase();
    const newInquiry: CustomerInquiry = {
      id: `inq-${Date.now()}`,
      customerId: data.customerId || "user-priya-customer",
      customerName: data.customerName || "Priya Nair",
      customerPhone: data.customerPhone || "+91 98711 44220",
      customerEmail: data.customerEmail || "priya.patron@hunar.in",
      sellerId: data.sellerId || "user-rohit-seller",
      sellerName: data.sellerName || "Rohit Sharma",
      sellerAvatar:
        data.sellerAvatar ||
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80",
      productId: data.productId,
      productTitle: data.productTitle,
      productImage: data.productImage,
      type: data.type || "custom_commission",
      requirements: data.requirements || "Custom commission inquiry via Hunar Card.",
      proposedBudget: Number(data.proposedBudget || 5000),
      timeline: data.timeline || "Within 14 days",
      status: "Under Review",
      statusUpdates: [
        {
          timestamp: new Date().toISOString().split("T")[0],
          note: "Inquiry dispatched to artisan studio."
        }
      ],
      createdAt: new Date().toISOString().split("T")[0]
    };

    db.inquiries.unshift(newInquiry);
    return newInquiry;
  },

  updateStatus: (id: string, status: CustomerInquiry["status"], note?: string) => {
    const db = getDatabase();
    const inquiry = db.inquiries.find((inq) => inq.id === id);
    if (!inquiry) return null;

    inquiry.status = status;
    if (!inquiry.statusUpdates) inquiry.statusUpdates = [];
    inquiry.statusUpdates.push({
      timestamp: new Date().toISOString().split("T")[0],
      note: note || `Status updated to ${status}`
    });

    return inquiry;
  }
};

// ====================================================
// 8. AUTHENTICATION & DEMO ACCOUNTS
// ====================================================
export const AuthService = {
  getDemoAccounts: () => {
    const db = getDatabase();
    return db.accounts;
  },

  login: (email: string, pass: string) => {
    const db = getDatabase();
    const normalizedEmail = email.trim().toLowerCase();
    const user = db.accounts.find((a) => a.email.toLowerCase() === normalizedEmail);

    if (!user) {
      // If not in demo accounts, create a flexible session for any testing email
      const isSeller = normalizedEmail.includes("artisan") || normalizedEmail.includes("seller") || normalizedEmail.includes("potter");
      const fallbackUser: UserAccount = {
        id: `user-${Date.now()}`,
        name: isSeller ? "Studio Artisan" : "Patron Member",
        email: normalizedEmail,
        role: isSeller ? "SELLER" : "CUSTOMER",
        city: "Delhi NCR",
        avatarUrl: isSeller
          ? "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80"
          : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
      };
      db.accounts.push(fallbackUser);
      return fallbackUser;
    }

    if (user.password && user.password !== pass) {
      return null;
    }

    return user;
  },

  getUserById: (id: string) => {
    const db = getDatabase();
    return db.accounts.find((a) => a.id === id);
  }
};
