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
  offersMentorship?: boolean;
  mentorshipTitle?: string;
  mentorshipFee?: number;
  mentorshipDuration?: number;
  mentorshipTopics?: string[];
  mentorshipAvailability?: string;
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
  offersMentorship?: boolean;
  mentorshipTitle?: string;
  mentorshipFee?: number;
  mentorshipDuration?: number;
  mentorshipTopics?: string[];
  mentorshipAvailability?: string;
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

export interface MentorshipOffering {
  enabled: boolean;
  title: string;
  duration: number; // in minutes (30, 45, 60)
  fee: number;
  agenda: string[];
  availability: string;
}

export interface MentorshipBooking {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorAvatar?: string;
  learnerId?: string;
  learnerName: string;
  learnerPhone: string;
  learnerEmail?: string;
  topic: string;
  learnerQuery?: string;
  scheduledDate: string;
  scheduledTime: string;
  scheduledAt: string;
  duration: number;
  feePaid: number;
  status: "CONFIRMED" | "COMPLETED" | "CANCELLED";
  meetingLink?: string;
  createdAt: string;
}

export type PaymentMethod = "UPI_QR" | "NETBANKING_CARD" | "PAYPAL";

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  isPaymentCard?: boolean;
  paymentDetails?: {
    orderId: string;
    amount: number;
    status: "PENDING" | "PAID" | "FAILED";
    method?: PaymentMethod;
    transactionRef?: string;
    timestamp?: string;
    productTitle?: string;
    currency?: string;
  };
  attachmentUrl?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  conversationId: string;
  orderId: string;
  amount: number;
  method: PaymentMethod;
  status: "PENDING" | "PAID" | "FAILED";
  transactionRef: string;
  createdAt: string;
  paypalOrderId?: string;
  captureId?: string;
  currency?: string;
}

// PayPal Sandbox v2 Interfaces
export interface PayPalCreateOrderRequest {
  amount: number;
  currency?: string;
  orderId?: string;
  description?: string;
}

export interface PayPalOrderLink {
  href: string;
  rel: string;
  method: string;
}

export interface PayPalCreateOrderResponse {
  success: boolean;
  orderID: string;
  id: string;
  status: string;
  currency: string;
  amount: number;
  inrEquivalent?: number;
  links: PayPalOrderLink[];
  isMock?: boolean;
  warning?: string;
}

export interface PayPalCaptureRequest {
  orderID: string;
  conversationId?: string;
  orderId?: string;
  internalOrderId?: string;
}

export interface PayPalCaptureResponse {
  success: boolean;
  status: string;
  orderID: string;
  id?: string;
  payer?: {
    email_address?: string;
    [key: string]: unknown;
  };
  captureId?: string;
  transactionRef?: string;
  payment?: Record<string, unknown>;
  capture?: Record<string, unknown>;
  orderStatus?: string;
  isMock?: boolean;
  message?: string;
}

// Channel3 Product Data & Valuation Interfaces
export interface Channel3Product {
  id: string;
  title: string;
  price: number;
  priceUsd?: number;
  currency: string;
  merchant?: string;
  imageUrl?: string;
  url?: string;
  category?: string;
  isCommercialAlternative?: boolean;
}

export interface Channel3ValuationRequest {
  query: string;
  category?: string;
  costOfMaterials?: number;
  hoursToCraft?: number;
  currency?: string;
}

export interface Channel3ValuationResponse {
  query: string;
  category?: string;
  benchmarks: Channel3Product[];
  averageMarketPrice: number;
  averageMarketPriceUsd?: number;
  suggestedMinPrice: number;
  suggestedOptimalPrice: number;
  suggestedPremiumPrice: number;
  craftPremiumPercentage: number;
  currency: string;
  reasoning: string;
  artisanWageProtection: {
    floorWage: number;
    handmadeAuthenticityFactor: string;
  };
  isMock?: boolean;
}

export interface Channel3TrendMetric {
  category: string;
  averageCommercialPrice: number;
  suggestedHandmadePrice: number;
  premiumPercentage: number;
  sampleCommercialTitle: string;
  merchant: string;
}

export interface Conversation {
  id: string;
  productId?: string;
  productTitle?: string;
  productImage?: string;
  productPrice?: number;
  customerId: string;
  customerName: string;
  customerAvatar: string;
  customerCity?: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  sellerCity?: string;
  sellerVerified?: boolean;
  craftTitle?: string;
  messages: Message[];
  payments: Payment[];
  unreadCountCustomer?: number;
  unreadCountSeller?: number;
  lastMessageText?: string;
  lastMessageAt?: string;
  createdAt: string;
}

