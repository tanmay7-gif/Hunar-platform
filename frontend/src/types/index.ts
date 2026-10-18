// Hunar Platform - Core TypeScript Interfaces & Domain Models

export type UserRole = "SELLER" | "CUSTOMER";

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  city: string;
  bio?: string;
  avatarUrl: string;
  phone?: string;
  whatsapp?: string;
  tagline?: string;
  artCategory?: string;
  username?: string;
  rating?: number;
  reviewsCount?: number;
  isVerified?: boolean;
}

export interface CreatorPortfolioItem {
  id: string;
  title: string;
  imageUrl: string;
  medium: string;
  price?: number;
  clientQuote?: string;
}

export interface Creator {
  id: string;
  name: string;
  nameHindi: string;
  username: string;
  phone: string;
  whatsapp: string;
  city: string;
  state: string;
  primaryArtForm: string;
  artFormHindi: string;
  languages: string[];
  experienceLevel: string;
  bio: string;
  bioHindi: string;
  avatarUrl: string;
  coverImage?: string;
  isVerified: boolean;
  minPricing: number;
  hourlyRate: number;
  unitPricingLabel: string;
  sixMonthIncomeGoal: number;
  currentMonthlyIncome: number;
  rating: number;
  reviewsCount: number;
  skills: string[];
  badges: string[];
  portfolioImages: CreatorPortfolioItem[];
  whatsappInquiryText: string;
  completedGigsCount: number;
}

export type ProductCategory =
  | "Terracotta & Pottery"
  | "Madhubani Folk Art"
  | "Handloom & Textiles"
  | "Mural Design"
  | "Bridal Mehndi"
  | "Woodwork & Stone";

export type DeliveryFormat = "Physical Artwork" | "On-site Commission";
export type ProductStatus = "Live" | "Draft" | "Sold Out";

export interface Product {
  id: string;
  title: string;
  titleHindi?: string;
  description: string;
  price: number;
  category: ProductCategory;
  images: string[];
  leadTime: string;
  stock: number;
  deliveryFormat: DeliveryFormat;
  status: ProductStatus;
  viewsCount?: number;
  dimensions?: string;
  material?: string;
  sellerId: string;
  sellerName: string;
  sellerCity: string;
  sellerAvatar: string;
  sellerPhone: string;
  sellerWhatsapp: string;
  sellerVerified: boolean;
  createdAt: string;
}

export type OpportunityType = "Commission" | "Murals" | "Event Booking" | "Exhibition" | "Grant";

export interface Opportunity {
  id: string;
  title: string;
  titleHindi: string;
  description: string;
  category: string;
  type: OpportunityType;
  typeHindi: string;
  location: string;
  budgetMin: number;
  budgetMax: number;
  deadline: string;
  postedBy: string;
  postedByOrg: string;
  postedByAvatar: string;
  postedByVerified: boolean;
  requirements: string[];
  tags: string[];
  featured: boolean;
  matchedCategories: string[];
  applicationsCount: number;
  createdAt: string;
}

export interface Application {
  id: string;
  opportunityId: string;
  creatorId: string;
  creatorName: string;
  proposedRate: number;
  pitch: string;
  portfolioAttachment?: string;
  status: "pending" | "shortlisted" | "accepted";
  createdAt: string;
}

export type InquiryStatus = "Under Review" | "Crafting in Progress" | "Dispatched" | "Completed";

export interface CustomerInquiry {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  productId?: string;
  productTitle?: string;
  productImage?: string;
  type: "product_order" | "custom_commission";
  requirements: string;
  proposedBudget: number;
  timeline: string;
  status: InquiryStatus;
  statusUpdates?: { timestamp: string; note: string }[];
  createdAt: string;
}

export interface RoadmapMilestone {
  id: string;
  task: string;
  taskHindi: string;
  description: string;
  completed: boolean;
  actionTag: string;
}

export interface RoadmapStep {
  id: string;
  artForm: string;
  stageNumber: number;
  timeframe: string;
  timeframeHindi: string;
  incomeBenchmark: string;
  toolsToLearn: string[];
  milestones: RoadmapMilestone[];
}

export interface Booking {
  id: string;
  creatorId?: string;
  title: string;
  type: "creator_hire";
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  selectedSlot?: string;
  budgetProposed?: number;
  note: string;
  createdAt: string;
  status: "confirmed" | "pending";
}
