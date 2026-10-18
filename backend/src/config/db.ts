import {
  Creator,
  Opportunity,
  Product,
  CustomerInquiry,
  UserAccount,
} from "../models/types";

// In-memory persistent database singleton for backend service
export interface HunarDatabase {
  creators: Creator[];
  opportunities: Opportunity[];
  products: Product[];
  inquiries: CustomerInquiry[];
  accounts: UserAccount[];
}

const SEED_ACCOUNTS: UserAccount[] = [
  {
    id: "user-rohit-seller",
    name: "Rohit Sharma",
    email: "rohit.potter@hunar.in",
    password: "demo_artisan_2026",
    role: "SELLER",
    city: "Khurja / Delhi NCR",
    tagline: "Master Ceramicist & Terracotta Sculptor",
    bio: "4th generation master terracotta craftsman preserving Khurja wheel-throwing techniques.",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    phone: "+91 98118 76543",
    whatsapp: "919811876543",
    artCategory: "Pottery & Terracotta",
    username: "rohit_pottery",
    rating: 4.9,
    reviewsCount: 38,
    isVerified: true,
  },
  {
    id: "user-priya-customer",
    name: "Priya Nair",
    email: "priya.patron@hunar.in",
    password: "demo_buyer_2026",
    role: "CUSTOMER",
    city: "South Delhi, Delhi NCR",
    tagline: "Art Collector & Residential Interior Curator",
    bio: "Passionate patron collecting authentic grassroots Indian art for boutique interiors.",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    phone: "+91 98711 44220",
    whatsapp: "919871144220",
    isVerified: true,
  },
];

const SEED_CREATORS: Creator[] = [
  {
    id: "creator-rohit",
    name: "Rohit Sharma",
    nameHindi: "रोहित शर्मा",
    username: "rohit_pottery",
    phone: "+91 98118 76543",
    whatsapp: "919811876543",
    city: "Khurja / Delhi NCR",
    state: "Uttar Pradesh",
    primaryArtForm: "Pottery",
    artFormHindi: "मिट्टी के बर्तन एवं टेराकोटा",
    languages: ["Hindi", "English"],
    experienceLevel: "Master Artisan (8+ yrs)",
    bio: "Award-winning studio ceramicist from Khurja creating high-fired terracotta planters, tableware, and sculptural vessels.",
    bioHindi: "खुर्जा के सम्मानित शिल्पकार जो प्राकृतिक मिट्टी और खनिज रंगों से उच्च गुणवत्ता वाले बर्तन बनाते हैं।",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80",
    isVerified: true,
    minPricing: 1200,
    hourlyRate: 600,
    unitPricingLabel: "₹1,200 per custom vessel",
    sixMonthIncomeGoal: 180000,
    currentMonthlyIncome: 32000,
    rating: 4.9,
    reviewsCount: 38,
    skills: ["Wheel Throwing", "Terracotta Carving", "Reduction Firing", "Glazing"],
    badges: ["Verified Master", "Zero Middleman Certified", "National Award Nominee"],
    portfolioImages: [
      {
        id: "img-1",
        title: "Smoked Terracotta Urn",
        imageUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
        medium: "Smoked River Clay",
        price: 3400,
      },
    ],
    whatsappInquiryText: "Namaste Rohit, I discovered your studio on Hunar.",
    completedGigsCount: 42,
  },
];

const SEED_PRODUCTS: Product[] = [
  {
    id: "prod-101",
    title: "Hand-Burnished Khurja Terracotta Vase",
    titleHindi: "हस्तनिर्मित खुर्जा टेराकोटा फूलदान",
    description: "Wheel-thrown raw terracotta vase burnished with river stones and wood-fired to deep earthy ochre.",
    price: 2850,
    category: "Terracotta & Pottery",
    images: ["https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80"],
    leadTime: "Ready to ship in 48h",
    stock: 8,
    deliveryFormat: "Physical Artwork",
    status: "Live",
    viewsCount: 142,
    dimensions: "14in height x 6in dia",
    material: "Natural alluvial river clay",
    sellerId: "user-rohit-seller",
    sellerName: "Rohit Sharma",
    sellerCity: "Khurja / Delhi NCR",
    sellerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    sellerPhone: "+91 98118 76543",
    sellerWhatsapp: "919811876543",
    sellerVerified: true,
    createdAt: "2026-10-12",
  },
];

const SEED_INQUIRIES: CustomerInquiry[] = [
  {
    id: "inq-101",
    customerId: "user-priya-customer",
    customerName: "Priya Nair",
    customerPhone: "+91 98711 44220",
    customerEmail: "priya.patron@hunar.in",
    sellerId: "user-rohit-seller",
    sellerName: "Rohit Sharma",
    sellerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    productId: "prod-101",
    productTitle: "Hand-Burnished Khurja Terracotta Vase",
    productImage: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
    type: "product_order",
    requirements: "Need 2 matching vessels with natural matte sealant for our foyer dining setup.",
    proposedBudget: 5700,
    timeline: "Within 14 days",
    status: "Crafting in Progress",
    statusUpdates: [
      { timestamp: "2026-10-14 11:30", note: "Wheel throwing complete. Drying in shade." },
      { timestamp: "2026-10-16 16:45", note: "First low-fire cycle initiated." },
    ],
    createdAt: "2026-10-13",
  },
];

const SEED_OPPORTUNITIES: Opportunity[] = [
  {
    id: "opp-101",
    title: "14ft Heritage Wall Mural for Artisan Bistro",
    titleHindi: "कारीगर बिस्ट्रो के लिए 14 फीट हेरिटेज भित्तिचित्र",
    description: "Looking for a seasoned folk or terracotta muralist to design a 14ft facade mural featuring botanical Madhubani or terracotta motifs.",
    category: "Mural Design",
    type: "Murals",
    typeHindi: "म्यूरल्स",
    location: "South Delhi / Delhi NCR",
    budgetMin: 28000,
    budgetMax: 45000,
    deadline: "Within 30 days",
    postedBy: "Priya Nair",
    postedByOrg: "Private Patron Commission",
    postedByAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    postedByVerified: true,
    requirements: [
      "Authentic organic mineral pigments",
      "Prior commercial or cafe wall portfolio",
      "Direct milestone updates",
    ],
    tags: ["Mural", "Heritage", "Mineral Paint"],
    featured: true,
    matchedCategories: ["Mural Design", "Folk Art"],
    applicationsCount: 4,
    createdAt: "2026-10-15",
  },
];

class DatabaseSingleton {
  private db: HunarDatabase;

  constructor() {
    this.db = {
      creators: [...SEED_CREATORS],
      opportunities: [...SEED_OPPORTUNITIES],
      products: [...SEED_PRODUCTS],
      inquiries: [...SEED_INQUIRIES],
      accounts: [...SEED_ACCOUNTS],
    };
  }

  getProducts(): Product[] {
    return this.db.products;
  }

  getProductById(id: string): Product | undefined {
    return this.db.products.find((p) => p.id === id);
  }

  createProduct(data: Omit<Product, "id" | "createdAt">): Product {
    const newProduct: Product = {
      ...data,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
    };
    this.db.products.unshift(newProduct);
    return newProduct;
  }

  getCreators(): Creator[] {
    return this.db.creators;
  }

  getCreatorByUsername(username: string): Creator | undefined {
    return this.db.creators.find(
      (c) => c.username.toLowerCase() === username.toLowerCase()
    );
  }

  getInquiries(): CustomerInquiry[] {
    return this.db.inquiries;
  }

  createInquiry(data: Omit<CustomerInquiry, "id" | "createdAt">): CustomerInquiry {
    const newInquiry: CustomerInquiry = {
      ...data,
      id: `inq-${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
      statusUpdates: [
        {
          timestamp: new Date().toLocaleString("en-IN"),
          note: "Inquiry registered and routed to artisan studio.",
        },
      ],
    };
    this.db.inquiries.unshift(newInquiry);
    return newInquiry;
  }

  updateInquiryStatus(id: string, status: CustomerInquiry["status"], note?: string): CustomerInquiry | null {
    const inquiry = this.db.inquiries.find((i) => i.id === id);
    if (!inquiry) return null;

    inquiry.status = status;
    if (note) {
      if (!inquiry.statusUpdates) inquiry.statusUpdates = [];
      inquiry.statusUpdates.push({
        timestamp: new Date().toLocaleString("en-IN"),
        note,
      });
    }
    return inquiry;
  }

  getOpportunities(): Opportunity[] {
    return this.db.opportunities;
  }

  createOpportunity(data: Omit<Opportunity, "id" | "createdAt" | "applicationsCount">): Opportunity {
    const newOpportunity: Opportunity = {
      ...data,
      id: `opp-${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
      applicationsCount: 0,
    };
    this.db.opportunities.unshift(newOpportunity);
    return newOpportunity;
  }

  getAccounts(): UserAccount[] {
    return this.db.accounts;
  }

  authenticate(email: string): UserAccount | undefined {
    return this.db.accounts.find(
      (a) => a.email.toLowerCase() === email.toLowerCase()
    );
  }
}

export const db = new DatabaseSingleton();
