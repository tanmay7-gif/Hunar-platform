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
  | "Woodwork & Stone"
  | "Paintings"
  | "Ceramics"
  | "Textiles"
  | "Prints"
  | "Jewellery"
  | string;

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
  presentation?: string;
  sellerId: string;
  sellerName: string;
  sellerCity: string;
  sellerAvatar: string;
  sellerPhone: string;
  sellerWhatsapp: string;
  sellerVerified: boolean;
  createdAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  artist: string;
  city?: string;
  medium: string;
  dimensions: string;
  price: number;
  image: string;
  quantity: number;
  presentation?: string;
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
    method?: "UPI_QR" | "NETBANKING_CARD";
    transactionRef?: string;
    timestamp?: string;
    productTitle?: string;
  };
  attachmentUrl?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  conversationId: string;
  orderId: string;
  amount: number;
  method: "UPI_QR" | "NETBANKING_CARD";
  status: "PENDING" | "PAID" | "FAILED";
  transactionRef: string;
  createdAt: string;
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

