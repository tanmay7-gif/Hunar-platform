// Hunar Platform - Rich Grassroots Creator Seed Data and Storage
import { Conversation, Message, Payment } from "@/types";

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
  primaryArtForm: string; // "Murals", "Pottery", "Madhubani & Folk", "Bridal Mehndi", "Performing Arts", "Sculpture"
  artFormHindi: string;
  languages: string[];
  experienceLevel: string; // "Emerging (1-2 yrs)", "Established (3-6 yrs)", "Master Artisan (8+ yrs)"
  bio: string;
  bioHindi: string;
  avatarUrl: string;
  coverImage?: string;
  isVerified: boolean;
  minPricing: number;
  hourlyRate: number;
  unitPricingLabel: string; // e.g. "₹180/sq ft for murals", "₹3,500 base bridal package"
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

export interface Opportunity {
  id: string;
  title: string;
  titleHindi: string;
  description: string;
  category: string;
  type: "Commission" | "Murals" | "Event Booking" | "Exhibition" | "Grant";
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

export interface RoadmapMilestone {
  id: string;
  task: string;
  taskHindi: string;
  description: string;
  completed: boolean;
  actionTag: string; // e.g. "Pricing", "Outreach", "Legal", "Portfolio"
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

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: "SELLER" | "CUSTOMER";
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
  onboardingCompleted?: boolean;
  offersMentorship?: boolean;
  mentorshipTitle?: string;
  mentorshipFee?: number;
  mentorshipDuration?: number;
  mentorshipTopics?: string[];
  mentorshipAvailability?: string;
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

export interface Product {
  id: string;
  title: string;
  titleHindi?: string;
  description: string;
  price: number;
  category: "Terracotta & Pottery" | "Madhubani Folk Art" | "Handloom & Textiles" | "Mural Design" | "Bridal Mehndi" | "Woodwork & Stone";
  images: string[];
  leadTime: string; // e.g. "Ready to ship", "Made to order: 5 days"
  stock: number;
  deliveryFormat: "Physical Artwork" | "On-site Commission";
  status: "Live" | "Draft" | "Sold Out";
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
  status: "Under Review" | "Crafting in Progress" | "Dispatched" | "Completed";
  statusUpdates?: { timestamp: string; note: string }[];
  createdAt: string;
}

// ==========================================
// SEED CREATORS
// ==========================================
export const SEED_CREATORS: Creator[] = [
  {
    id: "creator-sunita",
    name: "Smt. Sunita Devi",
    nameHindi: "श्रीमती सुनीता देवी",
    username: "sunita-madhubani",
    phone: "+91 98112 45890",
    whatsapp: "919811245890",
    city: "Madhubani / Delhi NCR",
    state: "Bihar & Delhi",
    primaryArtForm: "Madhubani & Folk",
    artFormHindi: "मधुबनी एवं मिथिला लोक कला",
    languages: ["Hindi", "Maithili"],
    experienceLevel: "Folk Master (22 yrs)",
    bio: "22 years practicing traditional natural-pigment Madhubani on handmade paper and fabrics. Preserves ancestral Kachni line work and natural soot and mineral pigments.",
    bioHindi: "प्राकृतिक रंगों और पारंपरिक कचनी-भरनी शैली में 22 वर्षों का समृद्ध अनुभव। प्राकृतिक खनिजों और हाथ से बने कागज़ पर प्रामाणिक कलाकृतियों की सर्जक।",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
    coverImage: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&auto=format&fit=crop&q=80",
    isVerified: true,
    minPricing: 4500,
    hourlyRate: 850,
    unitPricingLabel: "Originals from ₹4,500 • Custom scrolls ₹12,000",
    sixMonthIncomeGoal: 75000,
    currentMonthlyIncome: 42000,
    rating: 4.96,
    reviewsCount: 48,
    completedGigsCount: 64,
    skills: ["Natural Pigments", "Kachni Fine Lines", "Bharni Color Fills", "Tussar Silk Painting", "Wall Murals", "Packaging Licensing"],
    badges: ["National Merit 2021", "Verified Folk Master", "Top Rated 4.9★", "Direct Producer"],
    whatsappInquiryText: "Namaste Sunitaji, I saw your Hunar Card for Madhubani art. I would like to inquire about a custom commission.",
    offersMentorship: true,
    mentorshipTitle: "Traditional Madhubani Pigment Prep & Kachni Lines",
    mentorshipFee: 999,
    mentorshipDuration: 60,
    mentorshipTopics: [
      "Extracting organic natural dyes from soot, turmeric & aparajita flowers",
      "Ancestral Kachni geometric fine line brushwork",
      "Bharni solid mineral pigment filling without bleeding",
      "Preserving handmade paper & folk motifs for exhibitions"
    ],
    mentorshipAvailability: "Fridays & Saturdays, 3 PM – 6 PM",
    portfolioImages: [
      {
        id: "p1",
        title: "Tree of Life (Jeevan Vriksha) on Tussar Silk",
        medium: "Natural soot & plant extracts on handwoven Tussar silk",
        imageUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80",
        price: 18500,
        clientQuote: "The intricacy of each peacock feather was breathtaking. Displayed at our Delhi office lobby."
      },
      {
        id: "p2",
        title: "Kohbar Bridal Auspicious Geometry",
        medium: "Rice paste & vermilion mineral dyes on handmade paper",
        imageUrl: "https://images.unsplash.com/photo-1582561424760-0321d75e81fa?w=800&auto=format&fit=crop&q=80",
        price: 12000,
        clientQuote: "Handmade gift for our daughter's wedding. An authentic family heirloom."
      }
    ]
  },
  {
    id: "creator-arif",
    name: "Arif Khan",
    nameHindi: "आरिफ खान",
    username: "arif-murals",
    phone: "+91 98991 77312",
    whatsapp: "919899177312",
    city: "Jaipur",
    state: "Rajasthan & Delhi NCR",
    primaryArtForm: "Murals",
    artFormHindi: "भित्ति चित्र एवं आर्किटेक्चरल म्यूरल्स",
    languages: ["Hindi", "Urdu", "English"],
    experienceLevel: "Architectural Master (14 yrs)",
    bio: "Creates large-scale lime-plaster and acrylic murals for cafes, boutique hotels, and studios. Known for blending vibrant botanical flora with traditional Rajasthani lime-wash techniques.",
    bioHindi: "होटलों, कैफे और वास्तुशिल्प स्थानों के लिए चूना-प्लास्टर और एक्रिलिक में विशाल भित्ति चित्रों के विशेषज्ञ। 14 वर्षों का अनुभव।",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    coverImage: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1200&auto=format&fit=crop&q=80",
    isVerified: true,
    minPricing: 8000,
    hourlyRate: 950,
    unitPricingLabel: "Murals starting from ₹180/sq ft (Min booking ₹8,000)",
    sixMonthIncomeGoal: 95000,
    currentMonthlyIncome: 58000,
    rating: 4.92,
    reviewsCount: 39,
    completedGigsCount: 47,
    skills: ["Exterior Acrylics", "Heritage Wall Restoration", "Spray & Brush Technique", "Weatherproof Top-coating", "Lime Plaster Relief"],
    badges: ["Verified Muralist", "Architectural Guild", "Speed Delivery"],
    whatsappInquiryText: "Hey Arif, saw your Hunar Card portfolio. We have a cafe/office wall we'd like to commission.",
    offersMentorship: true,
    mentorshipTitle: "Large-Scale Lime-Plaster Murals & Bulk Pricing",
    mentorshipFee: 1499,
    mentorshipDuration: 60,
    mentorshipTopics: [
      "Surface preparation on raw masonry & lime-wash walls",
      "Scaling grid artwork to 20ft+ architectural facades",
      "Commercial client contracts & milestone billing",
      "Weatherproof outdoor protective top-sealants"
    ],
    mentorshipAvailability: "Saturdays, 11 AM – 2 PM",
    portfolioImages: [
      {
        id: "p3",
        title: "Botanical Chai Oasis Mural (Hauz Khas)",
        medium: "Weather-resistant masonry acrylics on exposed brick",
        imageUrl: "https://images.unsplash.com/photo-1549887534-1541e9326642?w=800&auto=format&fit=crop&q=80",
        price: 26000,
        clientQuote: "Turned our cafe patio into the #1 photo spot in the neighborhood."
      },
      {
        id: "p4",
        title: "Old Jaipur Spice Route Wall",
        medium: "Mixed pigment emulsion with gold leaf accents",
        imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80",
        price: 42000,
        clientQuote: "Captured the soul of Rajasthan with sharp modern craftsmanship."
      }
    ]
  },
  {
    id: "creator-meenakshi",
    name: "Meenakshi Sundaram",
    nameHindi: "मीनाक्षी सुंदरम",
    username: "meenakshi-handloom",
    phone: "+91 97234 11289",
    whatsapp: "919723411289",
    city: "Kanchipuram",
    state: "Tamil Nadu",
    primaryArtForm: "Woodwork & Stone",
    artFormHindi: "पारंपरिक हथकरघा एवं काष्ठ शिल्प",
    languages: ["Tamil", "Hindi", "English"],
    experienceLevel: "Heritage Master (18 yrs)",
    bio: "Third-generation handloom master preserving heritage dye and wooden block printing techniques. Commands timeless natural indigo and madder root dyeing on organic cotton and raw silk.",
    bioHindi: "तीसरी पीढ़ी की हथकरघा शिल्पी। प्राकृतिक नील और मंजिष्ठा रंगों से पारंपरिक ब्लॉक प्रिंटिंग एवं हाथ से बुनाई की मास्टर शिल्पकार।",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    coverImage: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1200&auto=format&fit=crop&q=80",
    isVerified: true,
    minPricing: 3500,
    hourlyRate: 750,
    unitPricingLabel: "Handwoven wraps from ₹3,500 • Yardage ₹650/meter",
    sixMonthIncomeGoal: 70000,
    currentMonthlyIncome: 45000,
    rating: 4.95,
    reviewsCount: 36,
    completedGigsCount: 52,
    skills: ["Natural Indigo Dyeing", "Hand-carved Teak Blocks", "Organic Mulmul", "Tussar Weaving", "Export Quality"],
    badges: ["Heritage Loom Master", "Eco Certified", "Top Rated 4.9★"],
    whatsappInquiryText: "Namaste Meenakshiji, I found your Hunar Card. I am interested in custom block printed textiles.",
    portfolioImages: [
      {
        id: "p5",
        title: "Indigo Mud-Resist (Dabu) Stole",
        medium: "Organic handspun cotton dyed in 8-dip fermented natural indigo",
        imageUrl: "https://images.unsplash.com/photo-1582561424760-0321d75e81fa?w=800&auto=format&fit=crop&q=80",
        price: 4200,
        clientQuote: "Incredible depth of blue. The scent of genuine indigo is unmistakably authentic."
      }
    ]
  },
  {
    id: "creator-zeeshan",
    name: "Zeeshan Ali",
    nameHindi: "ज़ीशान अली",
    username: "zeeshan-brass",
    phone: "+91 99182 33412",
    whatsapp: "919918233412",
    city: "Moradabad",
    state: "Uttar Pradesh",
    primaryArtForm: "Sculpture",
    artFormHindi: "पीतल नक्काशी व धातु शिल्प",
    languages: ["Hindi", "Urdu"],
    experienceLevel: "Master Metal Engraver (15 yrs)",
    bio: "Hand-carved brass lamps, decorative platters, and heritage metal artifacts. Specializes in traditional Moradabadi Naqqashi fine chisel engraving and antique patina finishes.",
    bioHindi: "मुरादाबाद की पारंपरिक नक्काशी कला में पारंगत। हाथ से तराशे गए पीतल के दीये, नक्काशीदार थालियां और प्राचीन धातु कलाकृतियां।",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    coverImage: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1200&auto=format&fit=crop&q=80",
    isVerified: true,
    minPricing: 5000,
    hourlyRate: 800,
    unitPricingLabel: "Carved lamps from ₹5,000 • Custom platters from ₹8,500",
    sixMonthIncomeGoal: 85000,
    currentMonthlyIncome: 52000,
    rating: 4.94,
    reviewsCount: 42,
    completedGigsCount: 58,
    skills: ["Fine Chisel Naqqashi", "Hand-cast Solid Brass", "Antique Patina", "Laser-free Craftsmanship"],
    badges: ["Moradabad Metal Guild", "Master Artisan", "Direct Studio"],
    whatsappInquiryText: "Salaam Zeeshanbhai, saw your Hunar Card. I would like to order custom hand-carved brassware.",
    portfolioImages: [
      {
        id: "p6",
        title: "Perforated Brass Temple Lantern",
        medium: "Hand-hammered brass with geometric filigree piercings",
        imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=80",
        price: 7800,
        clientQuote: "Casts mesmerizing shadow geometries across our living room ceiling."
      }
    ]
  },
  {
    id: "creator-rohit",
    name: "Rohit Sharma",
    nameHindi: "रोहित शर्मा",
    username: "rohit-pottery",
    phone: "+91 98118 76543",
    whatsapp: "919811876543",
    city: "Khurja / Delhi NCR",
    state: "Uttar Pradesh & Delhi",
    primaryArtForm: "Pottery",
    artFormHindi: "टेराकोटा एवं स्टूडियो पॉटरी",
    languages: ["Hindi", "English"],
    experienceLevel: "Pottery Master (12 yrs)",
    bio: "Award-winning pottery master from Khurja ceramic heritage cluster. 12+ years perfecting wood-fired unglazed terracotta, wheel-thrown studio ceramics, and custom dinnerware for luxury boutique cafes and heritage homes.",
    bioHindi: "खुर्जा टेराकोटा एवं स्टूडियो सिरेमिक्स के मास्टर पॉटर। 12 वर्षों का अनुभव। कैफे एवं बुटीक होटलों के लिए विशेष कुल्हड़ और क्रॉकरी के निर्माता।",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
    coverImage: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1200&auto=format&fit=crop&q=80",
    isVerified: true,
    minPricing: 2800,
    hourlyRate: 750,
    unitPricingLabel: "Studio batches from ₹2,800 • Dinnerware sets from ₹6,500",
    sixMonthIncomeGoal: 80000,
    currentMonthlyIncome: 55000,
    rating: 4.97,
    reviewsCount: 54,
    completedGigsCount: 72,
    skills: ["Wheel Throwing", "Wood-fired Kilns", "Food-safe Glazes", "Terracotta Tableware", "Custom Logo Stamping"],
    badges: ["Khurja Heritage Master", "Eco Artisan", "Top Rated 4.9★", "Direct Producer"],
    whatsappInquiryText: "Namaste Rohitji, I found your Hunar Card. I would like to inquire about studio terracotta pieces.",
    offersMentorship: true,
    mentorshipTitle: "Khurja Terracotta Glazing & Kiln Setup",
    mentorshipFee: 899,
    mentorshipDuration: 45,
    mentorshipTopics: [
      "Wheel-throwing centering & trimming precision",
      "Wood-fired kiln temperature management (Cone 04-06)",
      "Formulating food-safe, non-toxic studio glazes",
      "Bulk tableware pricing & safe transit packaging"
    ],
    mentorshipAvailability: "Saturdays & Sundays, 4 PM – 7 PM",
    portfolioImages: [
      {
        id: "p7",
        title: "Khurja Terracotta Glazed Tea Set - Batch of 6",
        medium: "Khurja Red Clay, Non-toxic Wood Ash Glaze",
        imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80",
        price: 3200,
        clientQuote: "Keeps chai piping hot with an authentic earthen fragrance."
      }
    ]
  }
];

// ==========================================
// SEED OPPORTUNITIES
// ==========================================
export const SEED_OPPORTUNITIES: Opportunity[] = [
  {
    id: "opp-blue-tokai",
    title: "Heritage Cafe Wall Mural (16ft x 11ft)",
    titleHindi: "हेरिटेज कैफे वॉल म्यूरल (16x11 फीट)",
    description: "Seeking a muralist or folk visual artist to paint a feature brick wall in our new Hauz Khas roastery. The mural should celebrate Indian coffee farming heritage (Coorg, Araku Valley) using warm terracotta, kohl, and turmeric tones. Scaffolding and premium masonry paints provided.",
    category: "Murals",
    type: "Murals",
    typeHindi: "म्यूरल / दीवार कला",
    location: "Delhi NCR (Hauz Khas)",
    budgetMin: 22000,
    budgetMax: 35000,
    deadline: "5 days left",
    postedBy: "Siddharth Rao",
    postedByOrg: "Blue Tokai Coffee Roasters",
    postedByAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80",
    postedByVerified: true,
    requirements: [
      "Prior outdoor or interior mural experience (minimum 2 verified portfolio walls)",
      "Ability to complete within 3 consecutive working days (night access available)",
      "Submit a preliminary sketch or color study with the application"
    ],
    tags: ["Wall Art", "Cafe Interior", "Terracotta Palette", "On-site Delhi"],
    featured: true,
    matchedCategories: ["Murals", "Visual Arts"],
    applicationsCount: 7,
    createdAt: "2026-10-14"
  },
  {
    id: "opp-vahdam-chai",
    title: "Madhubani Packaging Motifs for Festive Gift Sets",
    titleHindi: "दिवाली गिफ्ट पैक्स हेतु मधुबनी पैकेजिंग आर्ट",
    description: "Looking for a genuine Madhubani or Mithila folk artisan to illustrate 3 original motifs (Peacock of Monsoon, Sun Goddess of Chhath, Lotus Blossom) for limited-edition tea caddies. Artist name and village origin will be prominently credited on every box distributed globally.",
    category: "Madhubani & Folk",
    type: "Commission",
    typeHindi: "कला कमीशन",
    location: "Remote / Pan-India",
    budgetMin: 45000,
    budgetMax: 65000,
    deadline: "12 days left",
    postedBy: "Pooja Singhania",
    postedByOrg: "Vahdam Artisanal Teas",
    postedByAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
    postedByVerified: true,
    requirements: [
      "Traditional handmade ink/color artwork on handmade paper (high-res scan will be coordinated)",
      "Authentic Kachni or Bharni styling with traditional narrative symbolism",
      "Full non-exclusive commercial packaging rights with royalty retainer"
    ],
    tags: ["Madhubani", "Folk Art", "Commercial Packaging", "Remote Work"],
    featured: true,
    matchedCategories: ["Madhubani & Folk", "Visual Arts"],
    applicationsCount: 14,
    createdAt: "2026-10-12"
  },
  {
    id: "opp-rajvilas-wedding",
    title: "Bridal & Royal Sangeet Mehndi for 3-Day Destination Wedding",
    titleHindi: "रॉयल डेस्टिनेशन वेडिंग हेतु ब्राइडल मेहंदी बुकिंग",
    description: "Seeking an experienced bridal mehndi artist and 1 assistant for a destination royal wedding at The Oberoi Rajvilas, Jaipur. Responsibilities include full bridal arms and feet on Day 1, and 25 close family guests on Day 2 Sangeet afternoon.",
    category: "Bridal Mehndi",
    type: "Event Booking",
    typeHindi: "इवेंट बुकिंग",
    location: "Jaipur, Rajasthan",
    budgetMin: 35000,
    budgetMax: 55000,
    deadline: "8 days left",
    postedBy: "Meenakshi Khandelwal",
    postedByOrg: "Royal Rajputana Weddings",
    postedByAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80",
    postedByVerified: true,
    requirements: [
      "100% chemical-free organic henna cones guaranteed (must provide patch-test assurance)",
      "High-speed precision (minimum 4 bridal lookbook samples)",
      "Travel and stay at property provided by hosts in addition to artist fee"
    ],
    tags: ["Bridal Mehndi", "Luxury Wedding", "Jaipur Onsite", "Meals & Stay Included"],
    featured: false,
    matchedCategories: ["Bridal Mehndi"],
    applicationsCount: 9,
    createdAt: "2026-10-15"
  },
  {
    id: "opp-earth-table",
    title: "Terracotta Tableware Bulk Batch (250 Dinner Plates & Chai Cups)",
    titleHindi: "250 पीस सेरेमिक एवं टेराकोटा टेबलवेयर ऑर्डर",
    description: "A farm-to-table organic restaurant opening in Mehrauli is commissioning an artisan potter to produce 150 rustic shallow dinner plates and 100 ribbed chai cups with custom restaurant debossed seal. Food grade, lead-free certified glaze required.",
    category: "Pottery",
    type: "Commission",
    typeHindi: "थोक कमीशन",
    location: "Delhi NCR or Jaipur",
    budgetMin: 50000,
    budgetMax: 78000,
    deadline: "16 days left",
    postedBy: "Chef Armaan Gill",
    postedByOrg: "The Earth Table Bistro",
    postedByAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80",
    postedByVerified: true,
    requirements: [
      "Stoneware or high-fired terracotta with food-safe non-toxic glaze",
      "Produce 2 prototype samples within 7 days of confirmation",
      "50% milestone payment upon prototype sign-off"
    ],
    tags: ["Studio Pottery", "Bulk Order", "Cafe Tableware", "Food Safe"],
    featured: false,
    matchedCategories: ["Pottery"],
    applicationsCount: 5,
    createdAt: "2026-10-10"
  },
  {
    id: "opp-dastkar-grant",
    title: "Dastkar Winter Artisan Bazaar Stall Grant & Travel Stipend",
    titleHindi: "दस्तकार कारीगर बाज़ार स्टॉल ग्रांट एवं यात्रा भत्ता",
    description: "Annual grant for 5 emerging folk craft and pottery artisans under age 35. Covers 100% stall fee waiver (worth ₹30,000) at Delhi Nature Bazaar, ₹10,000 round-trip travel stipend, and free inventory storage during the 10-day festival.",
    category: "Madhubani & Folk",
    type: "Grant",
    typeHindi: "कारीगर ग्रांट / फेलोशिप",
    location: "Delhi NCR (Kisan Haat)",
    budgetMin: 40000,
    budgetMax: 40000,
    deadline: "20 days left",
    postedBy: "Laila Tyabji Office",
    postedByOrg: "Dastkar Craft Collective",
    postedByAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80",
    postedByVerified: true,
    requirements: [
      "Direct artisan/craftsperson or craft cooperative member (no traders or middlemen)",
      "Produce authentic handmade folk craft, pottery, or textiles",
      "Simple 1-page story and 4 photos of you making your craft in your workshop"
    ],
    tags: ["Artisan Grant", "Zero Stall Fee", "Stipend", "Exhibition"],
    featured: true,
    matchedCategories: ["Madhubani & Folk", "Pottery", "Visual Arts"],
    applicationsCount: 22,
    createdAt: "2026-10-08"
  }
];

// ==========================================
// SEED ROADMAPS (Kala Roadmap Engine)
// ==========================================
export const SEED_ROADMAPS: Record<string, RoadmapStep[]> = {
  "Murals": [
    {
      id: "rm-mural-1",
      artForm: "Murals",
      stageNumber: 1,
      timeframe: "Month 1: Groundwork & Unit Pricing",
      timeframeHindi: "महीना 1: आधारशिला एवं वर्ग-फुट दर निर्धारण",
      incomeBenchmark: "₹15,000 - ₹25,000 / month",
      toolsToLearn: ["Square-foot pricing formula", "Masonry primer application", "Grid enlargement technique", "Digital mockup on iPad/Phone"],
      milestones: [
        {
          id: "m1",
          task: "Photograph 3 local cafe or exterior test walls with day lighting",
          taskHindi: "3 स्थानीय कैफे या दीवारों के साफ फोटो लें",
          description: "Clear high-res photos build your initial reference library. Practice imposing your digital sketches on these walls.",
          completed: true,
          actionTag: "Portfolio"
        },
        {
          id: "m2",
          task: "Formalize your per-sq-ft unit economics (Base ₹150 - ₹180/sq ft)",
          taskHindi: "प्रति वर्ग फुट लागत और लाभ तय करें (₹150-180/sq ft)",
          description: "Calculate raw exterior primer (₹20/sq ft) + acrylic pigments (₹25/sq ft) + scaffolding/ladders + labor profit (₹110/sq ft). Never quote random lump sums.",
          completed: true,
          actionTag: "Pricing"
        },
        {
          id: "m3",
          task: "Create a 1-page PDF rate card with 3 standard size tiers",
          taskHindi: "3 साइज़ टियर वाला 1-पेज का रेट कार्ड बनाएं",
          description: "Tier A: Feature Corner (50 sq ft - ₹8,500), Tier B: Cafe Dining Wall (150 sq ft - ₹24,000), Tier C: Heritage Facade (300+ sq ft).",
          completed: false,
          actionTag: "Packaging"
        },
        {
          id: "m4",
          task: "Distribute your shareable 'Hunar Card' to 10 local interior designers",
          taskHindi: "10 इंटीरियर डिजाइनरों को अपना हुनर कार्ड भेजें",
          description: "Send direct WhatsApp lookbook links. 70% of cafe murals originate through local architecture interns.",
          completed: false,
          actionTag: "Outreach"
        }
      ]
    },
    {
      id: "rm-mural-2",
      artForm: "Murals",
      stageNumber: 2,
      timeframe: "Month 3: Commercial Hubs & Retainer Clients",
      timeframeHindi: "महीना 3: कमर्शियल हब एवं प्रथम 5 क्लाइंट्स",
      incomeBenchmark: "₹40,000 - ₹65,000 / month",
      toolsToLearn: ["50% milestone advance contract", "Weather-resistant PU top-coats", "Project time-lapse creation"],
      milestones: [
        {
          id: "m5",
          task: "Offer a 'Coffee Wall Exchange' with 2 local independent cafes",
          taskHindi: "2 कैफे के साथ 'कॉफ़ी वॉल एक्सचेंज' करें",
          description: "Offer a 20% discount in return for tag credits on their menu card and permission to record 4K reels while painting.",
          completed: false,
          actionTag: "Outreach"
        },
        {
          id: "m6",
          task: "Enforce a non-negotiable 50% advance deposit contract",
          taskHindi: "50% एडवांस भुगतान का लिखित अनुबंध लागू करें",
          description: "Zero brush strokes until materials advance clears. Protects you from client cancellations.",
          completed: false,
          actionTag: "Legal"
        },
        {
          id: "m7",
          task: "Create high-speed paint process reels with trending Hindi/folk music",
          taskHindi: "रंग भरते हुए टाइम-लैप्स वीडियो बनाकर हुनर प्रोफाइल से जोड़ें",
          description: "Process videos convert 4x better than static wall photos. Pin them to your Hunar Card.",
          completed: false,
          actionTag: "Marketing"
        }
      ]
    },
    {
      id: "rm-mural-3",
      artForm: "Murals",
      stageNumber: 3,
      timeframe: "Month 6: Scaled Crew & Hospitality Agencies",
      timeframeHindi: "महीना 6: टीम विस्तार एवं हॉस्पिटैलिटी एजेंसी अनुबंध",
      incomeBenchmark: "₹85,000 - ₹1,40,000 / month",
      toolsToLearn: ["Apprentice crew management", "High-volume corporate proposals", "GST invoicing"],
      milestones: [
        {
          id: "m8",
          task: "Sign recurring retainer contracts with 2 boutique interior firms",
          taskHindi: "2 इंटीरियर फर्मों के साथ मासिक/प्रोजेक्ट रिटेनर साइन करें",
          description: "Become their default muralist for all new commercial fit-outs at agreed baseline square-foot rates.",
          completed: false,
          actionTag: "Scaling"
        },
        {
          id: "m9",
          task: "Train 2 local art students as prep assistants",
          taskHindi: "2 स्थानीय कला छात्रों को सहायक के रूप में तैयार करें",
          description: "They handle wall priming, grid drawing, and base coating, allowing you to double your monthly wall throughput.",
          completed: false,
          actionTag: "Team"
        },
        {
          id: "m10",
          task: "Add a 2-Year Weatherproof Guarantee Surcharge (+25% margin)",
          taskHindi: "2 साल की वेदरप्रूफ वारंटी के साथ प्रीमियम पैकेज लॉन्च करें",
          description: "Using marine-grade polyurethane clear coats gives commercial clients peace of mind and increases your ticket size.",
          completed: false,
          actionTag: "Revenue"
        }
      ]
    }
  ],
  "Pottery": [
    {
      id: "rm-pottery-1",
      artForm: "Pottery",
      stageNumber: 1,
      timeframe: "Month 1: Kiln Firing & Standard Tableware Line",
      timeframeHindi: "महीना 1: भट्टी फायरिंग एवं मानक टेबलवेयर लाइन",
      incomeBenchmark: "₹12,000 - ₹22,000 / month",
      toolsToLearn: ["Shrinkage rate calculations", "Food-safe cone 6 glazes", "Secure zero-breakage corrugated packaging"],
      milestones: [
        {
          id: "p_m1",
          task: "Standardize 3 signature shapes: Flat White Cup, Pasta Bowl, Urn Planter",
          taskHindi: "3 मुख्य आकार तय करें: कप, पास्ता बाउल, एवं टेराकोटा गमला",
          description: "Mastering reproducible dimensions allows you to quote cafe owners confidently.",
          completed: true,
          actionTag: "Craft"
        },
        {
          id: "p_m2",
          task: "Calculate kiln pack economics and break-even batch size",
          taskHindi: "भट्टी फायरिंग की लागत और प्रति पीस न्यूनतम मूल्य निकालें",
          description: "Factor in electricity/wood cost, 8% firing crack allowance, and clay weight.",
          completed: true,
          actionTag: "Pricing"
        },
        {
          id: "p_m3",
          task: "Conduct water-leach test for lead & food safety certification",
          taskHindi: "फूड-सेफ और नॉन-टॉक्सिक ग्लेज़ की जांच करें",
          description: "Cafes require food-grade assurance. Keep certification photos on your Hunar Card.",
          completed: false,
          actionTag: "Quality"
        }
      ]
    },
    {
      id: "rm-pottery-2",
      artForm: "Pottery",
      stageNumber: 2,
      timeframe: "Month 3: Cafe Batch Commissions & Weekend Markets",
      timeframeHindi: "महीना 3: कैफे थोक ऑर्डर एवं हस्तशिल्प बाज़ार",
      incomeBenchmark: "₹35,000 - ₹55,000 / month",
      toolsToLearn: ["Custom ceramic logo stamping", "Wholesale B2B pricing sheets (35% margin)"],
      milestones: [
        {
          id: "p_m4",
          task: "Pitch 5 local cafes for 100-piece branded chai kulhar / cup orders",
          taskHindi: "5 स्थानीय कैफे में जाकर 100 कप के कस्टमाइज्ड सैंपल दिखाएं",
          description: "Offer to stamp their cafe logo on the raw base before bisquing.",
          completed: false,
          actionTag: "Outreach"
        },
        {
          id: "p_m5",
          task: "Set up a weekend pop-up stall at regional Dastkar / Sunday Organic Market",
          taskHindi: "लोकल ऑर्गेनिक मार्केट में वीकेंड स्टॉल लगाएं",
          description: "Direct retail customers pay full price and generate high word-of-mouth.",
          completed: false,
          actionTag: "Sales"
        }
      ]
    },
    {
      id: "rm-pottery-3",
      artForm: "Pottery",
      stageNumber: 3,
      timeframe: "Month 6: Studio Membership & D2C Limited Batch Drops",
      timeframeHindi: "महीना 6: स्टूडियो वर्कशॉप्स एवं लिमिटेड एडिशन ड्रोप्स",
      incomeBenchmark: "₹70,000 - ₹1,20,000 / month",
      toolsToLearn: ["D2C online drop management", "Studio workshop curriculum"],
      milestones: [
        {
          id: "p_m6",
          task: "Host 4-person weekend pottery wheel workshops (₹2,000/person for 2 hrs)",
          taskHindi: "वीकेंड पर 2 घंटे की पॉटरी वर्कशॉप्स आयोजित करें (₹2,000/व्यक्ति)",
          description: "Zero extra material cost, high engagement, and creates ardent lifelong collectors.",
          completed: false,
          actionTag: "Workshops"
        },
        {
          id: "p_m7",
          task: "Launch quarterly 'Limited Batch Drops' of 40 numbered art vases",
          taskHindi: "40 सीमित-संस्करण कलात्मक फूलदानों का एक्सक्लूसिव ड्रॉप निकालें",
          description: "Scarcity allows you to command ₹3,500 - ₹7,000 per art piece.",
          completed: false,
          actionTag: "Scaling"
        }
      ]
    }
  ],
  "Madhubani & Folk": [
    {
      id: "rm-folk-1",
      artForm: "Madhubani & Folk",
      stageNumber: 1,
      timeframe: "Month 1: Traditional Authenticity & Medium Diversity",
      timeframeHindi: "महीना 1: प्रामाणिकता एवं विभिन्न माध्यमों पर प्रयोग",
      incomeBenchmark: "₹12,000 - ₹20,000 / month",
      toolsToLearn: ["Natural plant pigment preparation", "Handmade paper curation", "Archival framing basics"],
      milestones: [
        {
          id: "f_m1",
          task: "Document the making of your natural mineral & leaf pigments on video",
          taskHindi: "प्राकृतिक रंगों को बनाने की प्रक्रिया का 30-सेकंड वीडियो बनाएं",
          description: "Authenticity proof is the single biggest conversion trigger for folk art collectors.",
          completed: true,
          actionTag: "Proof"
        },
        {
          id: "f_m2",
          task: "Create 3 sample works across paper, handwoven tussar silk, and wooden boxes",
          taskHindi: "कागज़, सिल्क और लकड़ी पर 3 विविध नमूने तैयार करें",
          description: "Broadens your market beyond wall hung frames to lifestyle decor.",
          completed: false,
          actionTag: "Portfolio"
        }
      ]
    },
    {
      id: "rm-folk-2",
      artForm: "Madhubani & Folk",
      stageNumber: 2,
      timeframe: "Month 3: Commercial Licensing & Festive Gifting",
      timeframeHindi: "महीना 3: पैकेजिंग लाइसेंसिंग एवं कॉर्पोरेट उपहार",
      incomeBenchmark: "₹30,000 - ₹50,000 / month",
      toolsToLearn: ["High-res 600 DPI flatbed scanning", "Basic copyright licensing terms"],
      milestones: [
        {
          id: "f_m3",
          task: "Pitch 3 organic packaging brands (tea, incense, organic spices)",
          taskHindi: "चाय या जैविक मसालों के 3 ब्रांड्स को पैकेजिंग हेतु लोक कला पिच करें",
          description: "Brands pay ₹25,000 - ₹50,000 per motif while leaving copyright with the artist.",
          completed: false,
          actionTag: "Licensing"
        },
        {
          id: "f_m4",
          task: "Apply for the Dastkar or TRIFED Grassroots Artisan Grant",
          taskHindi: "ट्राइफेड (TRIFED) या दस्तकार कारीगर सहायता हेतु आवेदन करें",
          description: "Grants access to subsidized exhibition stalls and institutional buyer access.",
          completed: false,
          actionTag: "Grants"
        }
      ]
    },
    {
      id: "rm-folk-3",
      artForm: "Madhubani & Folk",
      stageNumber: 3,
      timeframe: "Month 6: High-Value Gallery Commissions & Studio Expansion",
      timeframeHindi: "महीना 6: गैलरी प्रदर्शनियां एवं अंतर्राष्ट्रीय खरीदार",
      incomeBenchmark: "₹65,000 - ₹1,10,000 / month",
      toolsToLearn: ["Certificate of Authenticity generation", "International art shipping"],
      milestones: [
        {
          id: "f_m5",
          task: "Partner with an art gallery in Delhi or Mumbai for solo display",
          taskHindi: "दिल्ली या मुंबई की कला दीर्घा में अपनी कला का प्रदर्शन करें",
          description: "Commands artwork prices of ₹25,000 to ₹1,00,000 per framed canvas.",
          completed: false,
          actionTag: "Exhibition"
        },
        {
          id: "f_m6",
          task: "Apply for National Heritage Master Artisan Certification",
          taskHindi: "राष्ट्रीय विरासत मास्टर शिल्पकार प्रमाणन के लिए आवेदन करें",
          description: "Achieve verified national master rank and direct corporate acquisition retainers.",
          completed: false,
          actionTag: "Heritage"
        }
      ]
    }
  ],
  "Bridal Mehndi": [
    {
      id: "rm-mehndi-1",
      artForm: "Bridal Mehndi",
      stageNumber: 1,
      timeframe: "Month 1: Organic Stain Mastery & Lookbook Card",
      timeframeHindi: "महीना 1: प्राकृतिक गहरे रंग की विधि एवं लुकबुक निर्माण",
      incomeBenchmark: "₹15,000 - ₹25,000 / month",
      toolsToLearn: ["Eucalyptus-clove essential oil infusion", "Smooth 0.38mm cellophane cone rolling", "Macro bridal photography"],
      milestones: [
        {
          id: "mh_m1",
          task: "Formulate your signature 100% chemical-free organic henna recipe",
          taskHindi: "100% केमिकल-मुक्त प्राकृतिक मेंहदी पेस्ट तैयार करें",
          description: "High-paying bridal clients strictly refuse chemical cone burns. Highlight 'Zero PPD' on your Hunar Card.",
          completed: true,
          actionTag: "Safety"
        },
        {
          id: "mh_m2",
          task: "Photograph 4 high-contrast 48-hour dark stain photos on natural sunlight",
          taskHindi: "48 घंटे बाद के गहरे महरून रंग की 4 सुंदर तस्वीरें लें",
          description: "The dark stain after 2 days is what brides actually judge before booking.",
          completed: true,
          actionTag: "Portfolio"
        },
        {
          id: "mh_m3",
          task: "Publish your 3-tier Bridal Lookbook (Classic, Jharokha, Royal Portrait)",
          taskHindi: "3-टियर ब्राइडल पैकेज रेट कार्ड बनाएं (₹7,500, ₹11,000, ₹16,000)",
          description: "Clear fixed packages prevent uncomfortable bargaining on the wedding day.",
          completed: false,
          actionTag: "Pricing"
        }
      ]
    },
    {
      id: "rm-mehndi-2",
      artForm: "Bridal Mehndi",
      stageNumber: 2,
      timeframe: "Month 3: Wedding Planner Guilds & Destination Packages",
      timeframeHindi: "महीना 3: वेडिंग प्लानर्स से टाई-अप एवं डेस्टिनेशन बुकिंग",
      incomeBenchmark: "₹45,000 - ₹75,000 / month",
      toolsToLearn: ["Speed henna techniques for 30+ sangeet guests", "Wedding planner referral commissions (10%)"],
      milestones: [
        {
          id: "mh_m4",
          task: "Connect with 5 regional boutique wedding planners in Jaipur, Delhi or Lucknow",
          taskHindi: "5 वेडिंग प्लानर्स के साथ पार्टनरशिप करें",
          description: "Planners bundle mehndi into comprehensive bridal packages.",
          completed: false,
          actionTag: "Networking"
        },
        {
          id: "mh_m5",
          task: "Train 2 junior assistants for family guest hands during sangeet",
          taskHindi: "2 जूनियर सहायकों को साथ रखें ताकि परिवार के हाथ तेज़ी से लग सकें",
          description: "You focus on the bride (high fee), assistants handle 20+ aunts and cousins.",
          completed: false,
          actionTag: "Team"
        }
      ]
    },
    {
      id: "rm-mehndi-3",
      artForm: "Bridal Mehndi",
      stageNumber: 3,
      timeframe: "Month 6: Destination Weddings & Masterclass Workshops",
      timeframeHindi: "महीना 6: डेस्टिनेशन वेडिंग्स एवं मेंहदी मास्टरक्लास",
      incomeBenchmark: "₹90,000 - ₹1,60,000 / month",
      toolsToLearn: ["Luxury contract clauses for outstation travel", "Masterclass student certification"],
      milestones: [
        {
          id: "mh_m6",
          task: "Book 2 outstation luxury destination weddings (₹35,000+ per event)",
          taskHindi: "2 आउटस्टेशन लक्जरी डेस्टिनेशन वेडिंग्स लॉक करें",
          description: "Includes flight/train and hotel stay covered by the client.",
          completed: false,
          actionTag: "Luxury"
        },
        {
          id: "mh_m7",
          task: "Conduct a 5-day professional bridal mehndi masterclass for 10 students",
          taskHindi: "10 छात्राओं के लिए 5-दिवसीय व्यावसायिक ब्राइडल मेंहदी कोर्स आयोजित करें",
          description: "Charging ₹6,000/student generates ₹60,000 in pure recurring teaching revenue during off-season.",
          completed: false,
          actionTag: "Teaching"
        }
      ]
    }
  ]
};

// ==========================================
// Mock personas for instant switching
export interface Persona {
  id: string;
  name: string;
  role: "creator" | "client";
  title: string;
  avatar: string;
  city: string;
  artCategory?: string;
  username?: string;
}

export const MOCK_PERSONAS: Persona[] = [
  {
    id: "persona-sunita",
    name: "Smt. Sunita Devi",
    role: "creator",
    title: "Mithila Folk Master (Madhubani)",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
    city: "Madhubani / Delhi NCR",
    artCategory: "Madhubani & Folk",
    username: "sunita-madhubani"
  },
  {
    id: "persona-rohit",
    name: "Rohit Sharma",
    role: "creator",
    title: "Master Ceramicist (Khurja)",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
    city: "Khurja / Delhi NCR",
    artCategory: "Pottery",
    username: "rohit-pottery"
  },
  {
    id: "persona-arif",
    name: "Arif Khan",
    role: "creator",
    title: "Architectural Muralist (Jaipur)",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    city: "Jaipur",
    artCategory: "Murals",
    username: "arif-murals"
  },
  {
    id: "persona-meenakshi",
    name: "Meenakshi Sundaram",
    role: "creator",
    title: "Handloom Master (Kanchipuram)",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    city: "Kanchipuram",
    artCategory: "Woodwork & Stone",
    username: "meenakshi-handloom"
  },
  {
    id: "persona-client-priya",
    name: "Priya Nair (Patron)",
    role: "client",
    title: "Interior Designer & Art Curator",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    city: "South Delhi"
  }
];

// ==========================================
// DEMO ACCOUNTS FOR ROLE-BASED AUTH
// ==========================================
export const DEMO_ACCOUNTS: UserAccount[] = [
  {
    id: "demo-seller-rohit",
    name: "Rohit Sharma",
    email: "rohit.potter@hunar.in",
    password: "demo_artisan_2026",
    role: "SELLER",
    city: "Khurja / Delhi NCR",
    tagline: "Master Ceramicist & Terracotta Sculptor",
    bio: "Award-winning pottery master from Khurja ceramic heritage cluster. 12+ years perfecting wood-fired unglazed terracotta, wheel-thrown studio ceramics, and custom dinnerware for luxury boutique cafes and heritage homes.",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
    phone: "+91 98118 76543",
    whatsapp: "919811876543",
    artCategory: "Terracotta & Pottery",
    username: "rohit-pottery",
    rating: 4.96,
    reviewsCount: 38,
    isVerified: true,
    onboardingCompleted: true,
    offersMentorship: true,
    mentorshipTitle: "Khurja Terracotta Glazing & Kiln Setup",
    mentorshipFee: 899,
    mentorshipDuration: 45,
    mentorshipTopics: [
      "Wheel-throwing centering & trimming precision",
      "Wood-fired kiln temperature management (Cone 04-06)",
      "Formulating food-safe, non-toxic studio glazes",
      "Bulk tableware pricing & safe transit packaging"
    ],
    mentorshipAvailability: "Saturdays & Sundays, 4 PM – 7 PM"
  },
  {
    id: "demo-customer-priya",
    name: "Priya Nair",
    email: "priya.patron@hunar.in",
    password: "demo_buyer_2026",
    role: "CUSTOMER",
    city: "South Delhi",
    tagline: "Art Collector & Interior Curator",
    bio: "Independent curator and design consultant sourcing authentic Indian folk arts, muralists, and ceramic tableware for boutique luxury hospitality and private estates. Dedicated to direct artisan equity.",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    phone: "+91 98711 44220",
    whatsapp: "919871144220",
    onboardingCompleted: true
  }
];

// ==========================================
// SEED PRODUCTS & ARTWORK CATALOG
// ==========================================
export const SEED_PRODUCTS: Product[] = [
  {
    id: "prod-khurja-tea-set",
    title: "Khurja Terracotta Glazed Tea Set - Batch of 6",
    titleHindi: "खुर्जा टेराकोटा ग्लेज्ड चाय सेट (६ कप व केतली)",
    description: "Hand-thrown in Khurja red clay, wood-fired with organic ash glaze and terracotta unglazed rims. Keeps beverages piping hot with an authentic earthy aroma. Includes 1 pouring kettle and 6 ribbed kulhad mugs.",
    price: 3200,
    category: "Terracotta & Pottery",
    images: [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80"
    ],
    leadTime: "Ready to ship",
    stock: 8,
    deliveryFormat: "Physical Artwork",
    status: "Live",
    dimensions: "Kettle: 750ml, Cups: 180ml each",
    material: "Khurja Red Clay, Non-toxic Wood Ash Glaze",
    sellerId: "demo-seller-rohit",
    sellerName: "Rohit Sharma",
    sellerCity: "Khurja / Delhi NCR",
    sellerAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
    sellerPhone: "+91 98118 76543",
    sellerWhatsapp: "919811876543",
    sellerVerified: true,
    createdAt: "2026-10-10"
  },
  {
    id: "prod-terracotta-urn",
    title: "Sculptural Ribbed Terracotta Urn Planter",
    titleHindi: "हस्तनिर्मित धारीदार टेराकोटा कलश व प्लांटर",
    description: "Wheel-thrown statement garden urn with hand-chiseled concentric ribs. Naturally porous terracotta allows root aeration and keeps soil cool in intense heat. Ideal for indoor monstera or foyer entrance statement decor.",
    price: 4800,
    category: "Terracotta & Pottery",
    images: [
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80"
    ],
    leadTime: "Ready to ship",
    stock: 3,
    deliveryFormat: "Physical Artwork",
    status: "Live",
    dimensions: "22 inches height x 14 inches diameter",
    material: "High-fired Porous Terracotta",
    sellerId: "demo-seller-rohit",
    sellerName: "Rohit Sharma",
    sellerCity: "Khurja / Delhi NCR",
    sellerAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
    sellerPhone: "+91 98118 76543",
    sellerWhatsapp: "919811876543",
    sellerVerified: true,
    createdAt: "2026-10-12"
  },
  {
    id: "prod-stoneware-bowls",
    title: "Speckled Stoneware Pasta & Curry Bowls (Set of 4)",
    titleHindi: "हस्तनिर्मित सेरेमिक पास्ता व करी बाउल्स (४ का सेट)",
    description: "Stoneware clay with hand-sprinkled iron speckles and a satin eggshell finish. Microwave and dishwasher safe, durable for commercial cafe or residential dining.",
    price: 3600,
    category: "Terracotta & Pottery",
    images: [
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&auto=format&fit=crop&q=80"
    ],
    leadTime: "Made to order: 5 days",
    stock: 5,
    deliveryFormat: "Physical Artwork",
    status: "Live",
    dimensions: "8.5 inches diameter, 2 inches depth",
    material: "Stoneware, Food-safe Satin Glaze",
    sellerId: "demo-seller-rohit",
    sellerName: "Rohit Sharma",
    sellerCity: "Khurja / Delhi NCR",
    sellerAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
    sellerPhone: "+91 98118 76543",
    sellerWhatsapp: "919811876543",
    sellerVerified: true,
    createdAt: "2026-10-14"
  },
  {
    id: "prod-mithila-tree-of-life",
    title: "Tree of Life (Jeevan Vriksha) on Tussar Silk",
    titleHindi: "जीवन वृक्ष • टसर सिल्क पर हस्तनिर्मित मधुबनी चित्र",
    description: "Masterwork by Smt. Sunita Devi using bamboo nib and mineral soot ink on handwoven Bhagalpur Tussar silk. Depicts peacocks, river turtles, and sacred flora symbolizing cosmic fertility.",
    price: 18500,
    category: "Madhubani Folk Art",
    images: [
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1582561424760-0321d75e81fa?w=800&auto=format&fit=crop&q=80"
    ],
    leadTime: "Ready to ship",
    stock: 1,
    deliveryFormat: "Physical Artwork",
    status: "Live",
    dimensions: "36 x 24 inches (Unframed, Archival Backing)",
    material: "Handwoven Tussar Silk, Organic Mineral Pigments",
    sellerId: "creator-sunita",
    sellerName: "Smt. Sunita Devi",
    sellerCity: "Madhubani / Delhi NCR",
    sellerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
    sellerPhone: "+91 98112 45890",
    sellerWhatsapp: "919811245890",
    sellerVerified: true,
    createdAt: "2026-10-08"
  },
  {
    id: "prod-kohbar-scroll",
    title: "Kohbar Bridal Auspicious Geometry Scroll",
    titleHindi: "कोहबर विवाह मांगलिक भित्ति पटल",
    description: "Traditional Mithila ceremonial artwork drawn with rice paste, vermilion cinnabar, and soot black. Intricate Kachni linework depicting lotus ponds, bamboo stalks, and celestial constellations.",
    price: 12000,
    category: "Madhubani Folk Art",
    images: [
      "https://images.unsplash.com/photo-1582561424760-0321d75e81fa?w=800&auto=format&fit=crop&q=80"
    ],
    leadTime: "Made to order: 7 days",
    stock: 2,
    deliveryFormat: "Physical Artwork",
    status: "Live",
    dimensions: "28 x 20 inches",
    material: "Handmade Banana Fiber Paper, Natural Dyes",
    sellerId: "creator-sunita",
    sellerName: "Smt. Sunita Devi",
    sellerCity: "Madhubani / Delhi NCR",
    sellerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
    sellerPhone: "+91 98112 45890",
    sellerWhatsapp: "919811245890",
    sellerVerified: true,
    createdAt: "2026-10-09"
  },
  {
    id: "prod-mural-botanical-oasis",
    title: "Botanical Chai Oasis Custom Cafe Wall Mural",
    titleHindi: "कैफे वानस्पतिक म्यूरल कमीशन (प्रति वर्ग फुट)",
    description: "Large-scale narrative mural painted directly on cafe or restaurant facades. Combines Indian botanical flora (cassia fistula, banyan aerial roots) in warm ochre, terracotta, and indigo.",
    price: 24000,
    category: "Mural Design",
    images: [
      "https://images.unsplash.com/photo-1549887534-1541e9326642?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=80"
    ],
    leadTime: "On-site: 4-6 days",
    stock: 4,
    deliveryFormat: "On-site Commission",
    status: "Live",
    dimensions: "Standard 12ft x 9ft wall (customizable)",
    material: "Weatherproof Acrylic Emulsion, Anti-dust Topcoat",
    sellerId: "creator-arif",
    sellerName: "Arif Khan",
    sellerCity: "Jaipur",
    sellerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    sellerPhone: "+91 98991 77312",
    sellerWhatsapp: "919899177312",
    sellerVerified: true,
    createdAt: "2026-10-05"
  },
  {
    id: "prod-bridal-henna-royal",
    title: "Royal Awadhi Dulha-Dulhan Organic Henna Package",
    titleHindi: "रॉयल अवधी ब्राइडल मेहंदी पैकेज (100% प्राकृतिक सोजत)",
    description: "Bespoke bridal mehndi application using 100% organic triple-filtered Sojat henna ground with nilgiri and clove oils for a guaranteed rich burgundy stain. Includes intricate portraiture.",
    price: 11500,
    category: "Bridal Mehndi",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop&q=80"
    ],
    leadTime: "Book 14 days in advance",
    stock: 6,
    deliveryFormat: "On-site Commission",
    status: "Live",
    dimensions: "Elbow to fingertips (both hands) & Feet",
    material: "Organic Sojat Rajasthani Henna, Essential Oils",
    sellerId: "creator-shazia",
    sellerName: "Shazia Parveen",
    sellerCity: "Lucknow",
    sellerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
    sellerPhone: "+91 99182 33412",
    sellerWhatsapp: "919918233412",
    sellerVerified: true,
    createdAt: "2026-10-04"
  },
  {
    id: "prod-woodwork-jharokha",
    title: "Hand-carved Teakwood Jharokha Window Mirror",
    titleHindi: "हाथ से तराशा सागवान झरोखा दर्पण",
    description: "Reclaimed seasoned teakwood hand-chiseled with Rajasthani lattice jaali work and vintage brass latch pins. Distressed antique chalk patina.",
    price: 7800,
    category: "Woodwork & Stone",
    images: [
      "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&auto=format&fit=crop&q=80"
    ],
    leadTime: "Ready to ship",
    stock: 2,
    deliveryFormat: "Physical Artwork",
    status: "Live",
    dimensions: "26 inches height x 18 inches width",
    material: "Seasoned Teakwood, Beveled Glass Mirror",
    sellerId: "demo-seller-rohit",
    sellerName: "Rohit Sharma",
    sellerCity: "Khurja / Delhi NCR",
    sellerAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
    sellerPhone: "+91 98118 76543",
    sellerWhatsapp: "919811876543",
    sellerVerified: true,
    createdAt: "2026-10-15"
  }
];

// ==========================================
// SEED CUSTOMER INQUIRIES & ORDERS
// ==========================================
export const SEED_INQUIRIES: CustomerInquiry[] = [
  {
    id: "inq-101",
    customerId: "demo-customer-priya",
    customerName: "Priya Nair",
    customerPhone: "+91 98711 44220",
    customerEmail: "priya.patron@hunar.in",
    sellerId: "demo-seller-rohit",
    sellerName: "Rohit Sharma",
    sellerAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
    productId: "prod-khurja-tea-set",
    productTitle: "Khurja Terracotta Glazed Tea Set - Batch of 6",
    productImage: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80",
    type: "product_order",
    requirements: "Need 2 full sets (12 cups + 2 kettles) with custom cafe debossed initials 'TR' on the bottom rim. Safe transport to Greater Kailash.",
    proposedBudget: 6800,
    timeline: "Needed within 10 days",
    status: "Crafting in Progress",
    statusUpdates: [
      { timestamp: "2026-10-15", note: "Inquiry received and specifications confirmed" },
      { timestamp: "2026-10-16", note: "Wheel throwing and debossing completed; kiln drying" }
    ],
    createdAt: "2026-10-15"
  },
  {
    id: "inq-102",
    customerId: "demo-customer-priya",
    customerName: "Priya Nair",
    customerPhone: "+91 98711 44220",
    customerEmail: "priya.patron@hunar.in",
    sellerId: "demo-seller-rohit",
    sellerName: "Rohit Sharma",
    sellerAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
    type: "custom_commission",
    requirements: "Commissioning 4 oversized unglazed terracotta floor amphoras (30 inches each) for a farmhouse courtyard in Chattarpur.",
    proposedBudget: 22000,
    timeline: "Ready by early November",
    status: "Under Review",
    statusUpdates: [
      { timestamp: "2026-10-17", note: "Initial design brief submitted with courtyard photo references" }
    ],
    createdAt: "2026-10-17"
  },
  {
    id: "inq-103",
    customerId: "demo-customer-priya",
    customerName: "Priya Nair",
    customerPhone: "+91 98711 44220",
    customerEmail: "priya.patron@hunar.in",
    sellerId: "creator-sunita",
    sellerName: "Smt. Sunita Devi",
    sellerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
    productId: "prod-mithila-tree-of-life",
    productTitle: "Tree of Life (Jeevan Vriksha) on Tussar Silk",
    productImage: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80",
    type: "product_order",
    requirements: "Gift wrapped with artist certificate of authenticity on handmade paper. Dispatch to Defence Colony.",
    proposedBudget: 18500,
    timeline: "Delivered",
    status: "Dispatched",
    statusUpdates: [
      { timestamp: "2026-10-14", note: "Order confirmed with artisan" },
      { timestamp: "2026-10-16", note: "Inspected, securely rolled in PVC postal cylinder, dispatched via BlueDart Express" }
    ],
    createdAt: "2026-10-14"
  }
];

// ==========================================
// SEED MENTORSHIP BOOKINGS
// ==========================================
export const SEED_MENTORSHIP_BOOKINGS: MentorshipBooking[] = [
  {
    id: "mb-booking-01",
    mentorId: "demo-seller-rohit",
    mentorName: "Rohit Sharma",
    mentorAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
    learnerId: "demo-customer-priya",
    learnerName: "Aditya Verma",
    learnerPhone: "+91 98201 45678",
    learnerEmail: "aditya.v@craftdesign.in",
    topic: "Khurja Terracotta Glazing & Kiln Setup",
    learnerQuery: "Building a small electric kiln studio in Gurgaon. Struggling with pinholing and blistering on our terracotta glazes.",
    scheduledDate: "Tomorrow",
    scheduledTime: "04:30 PM",
    scheduledAt: "2026-10-21T11:00:00.000Z",
    duration: 45,
    feePaid: 899,
    status: "CONFIRMED",
    meetingLink: "https://meet.google.com/hun-roht-pottery",
    createdAt: "2026-10-18T14:20:00.000Z"
  },
  {
    id: "mb-booking-02",
    mentorId: "demo-seller-rohit",
    mentorName: "Rohit Sharma",
    mentorAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
    learnerId: "user-meera-p",
    learnerName: "Meera Patel",
    learnerPhone: "+91 97123 88990",
    learnerEmail: "meera.patel@gmail.com",
    topic: "Bulk Tableware Pricing for Boutique Cafes",
    learnerQuery: "Need mentorship on cost calculations, material loss percentages, and packing fragile tea mugs for long-distance transport.",
    scheduledDate: "Saturday, Oct 24",
    scheduledTime: "05:30 PM",
    scheduledAt: "2026-10-24T12:00:00.000Z",
    duration: 45,
    feePaid: 899,
    status: "CONFIRMED",
    meetingLink: "https://meet.google.com/hun-roht-pottery",
    createdAt: "2026-10-19T09:15:00.000Z"
  },
  {
    id: "mb-booking-03",
    mentorId: "creator-sunita",
    mentorName: "Smt. Sunita Devi",
    mentorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
    learnerId: "demo-customer-priya",
    learnerName: "Priya Nair",
    learnerPhone: "+91 98711 44220",
    learnerEmail: "priya.patron@hunar.in",
    topic: "Traditional Madhubani Pigment Prep & Kachni Lines",
    learnerQuery: "Learning organic soot pigment binder ratios with neem gum for canvas painting.",
    scheduledDate: "Friday, Oct 23",
    scheduledTime: "03:30 PM",
    scheduledAt: "2026-10-23T10:00:00.000Z",
    duration: 60,
    feePaid: 999,
    status: "CONFIRMED",
    meetingLink: "https://meet.google.com/hun-sunt-madhubani",
    createdAt: "2026-10-18T16:00:00.000Z"
  }
];

// ==========================================
// SEED IN-APP CONVERSATIONS & CHAT THREADS
// ==========================================
export const SEED_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-rohit-priya",
    productId: "prod-khurja-tea-set",
    productTitle: "Hand-thrown Terracotta Chai Set (6 Kulhads + Kettle)",
    productImage: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80",
    productPrice: 2450,
    customerId: "demo-customer-priya",
    customerName: "Priya Nair",
    customerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    customerCity: "New Delhi",
    sellerId: "demo-seller-rohit",
    sellerName: "Rohit Sharma",
    sellerAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
    sellerCity: "Khurja / Greater Noida",
    sellerVerified: true,
    craftTitle: "Khurja Terracotta & Ceramic Studio",
    lastMessageText: "Payment request sent for custom glaze batch (₹2,450).",
    lastMessageAt: "10 mins ago",
    unreadCountCustomer: 1,
    unreadCountSeller: 0,
    createdAt: "2026-10-18T10:30:00.000Z",
    payments: [],
    messages: [
      {
        id: "msg-101",
        conversationId: "conv-rohit-priya",
        senderId: "demo-customer-priya",
        text: "Namaste Rohit ji! I adore this Hand-thrown Khurja Chai Set. Could we get this custom glazed in an earthy indigo ash finish for 6 cups?",
        createdAt: "Yesterday, 4:20 PM"
      },
      {
        id: "msg-102",
        conversationId: "conv-rohit-priya",
        senderId: "demo-seller-rohit",
        text: "Namaste Priya ji! Thank you so much for appreciating our studio work. Yes, absolutely! We formulate our own natural wood-ash glazes. It will require 4 days for wheel shaping, bisque firing, and the high-temperature glaze kiln.",
        createdAt: "Yesterday, 4:35 PM"
      },
      {
        id: "msg-103",
        conversationId: "conv-rohit-priya",
        senderId: "demo-customer-priya",
        text: "That timeline works great for our anniversary gathering. Could you please send across the direct payment invoice so I can confirm the order?",
        createdAt: "Yesterday, 5:10 PM"
      },
      {
        id: "msg-104",
        conversationId: "conv-rohit-priya",
        senderId: "demo-seller-rohit",
        text: "Certainly! Generating the studio commission invoice below. Once payment is confirmed, we'll immediately prep the clay batch.",
        isPaymentCard: true,
        paymentDetails: {
          orderId: "HNR-ORD-89214",
          amount: 2450,
          status: "PENDING",
          productTitle: "Custom Hand-thrown Terracotta Chai Set (Indigo Ash Glaze)"
        },
        createdAt: "10 mins ago"
      }
    ]
  },
  {
    id: "conv-sunita-priya",
    productId: "prod-mithila-tree-of-life",
    productTitle: "Tree of Life (Kohbar Kachni Madhubani Scroll)",
    productImage: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80",
    productPrice: 6800,
    customerId: "demo-customer-priya",
    customerName: "Priya Nair",
    customerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    customerCity: "New Delhi",
    sellerId: "creator-sunita",
    sellerName: "Smt. Sunita Devi",
    sellerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
    sellerCity: "Madhubani / Delhi NCR",
    sellerVerified: true,
    craftTitle: "Madhubani & Mithila Folk Master",
    lastMessageText: "Payment Confirmed: ₹6,800 received via UPI QR.",
    lastMessageAt: "Yesterday",
    unreadCountCustomer: 0,
    unreadCountSeller: 0,
    createdAt: "2026-10-17T14:15:00.000Z",
    payments: [
      {
        id: "pay-sunita-01",
        conversationId: "conv-sunita-priya",
        orderId: "HNR-ORD-44129",
        amount: 6800,
        method: "UPI_QR",
        status: "PAID",
        transactionRef: "HNR-TXN-44129",
        createdAt: "2026-10-17T16:45:00.000Z"
      }
    ],
    messages: [
      {
        id: "msg-201",
        conversationId: "conv-sunita-priya",
        senderId: "demo-customer-priya",
        text: "Sunita ji, Namaste! We have a living room niche (4x3 ft). Is it possible to commission this Tree of Life with intricate peacock border lines?",
        createdAt: "Oct 17, 2:15 PM"
      },
      {
        id: "msg-202",
        conversationId: "conv-sunita-priya",
        senderId: "creator-sunita",
        text: "Namaste Priya beti! Bilkul. I prepare all pigments myself with cow dung wash, neem gum, and turmeric extract on pure handmade paper.",
        createdAt: "Oct 17, 3:00 PM"
      },
      {
        id: "msg-203",
        conversationId: "conv-sunita-priya",
        senderId: "creator-sunita",
        text: "Payment invoice for ₹6,800 sent.",
        isPaymentCard: true,
        paymentDetails: {
          orderId: "HNR-ORD-44129",
          amount: 6800,
          status: "PAID",
          method: "UPI_QR",
          transactionRef: "HNR-TXN-44129",
          timestamp: "Oct 17, 4:45 PM",
          productTitle: "Tree of Life (Kohbar Kachni Madhubani Scroll)"
        },
        createdAt: "Oct 17, 4:45 PM"
      },
      {
        id: "msg-204",
        conversationId: "conv-sunita-priya",
        senderId: "creator-sunita",
        text: "Dhanyawad Priya ji! Payment is verified. Natural pigment grinding has begun in our Madhubani workshop. Crafting in Progress!",
        createdAt: "Oct 17, 5:02 PM"
      }
    ]
  },
  {
    id: "conv-meenakshi-priya",
    productId: "prod-sanganeri-dupatta",
    productTitle: "Hand-block Sanganeri Dabu Indigo Dupatta",
    productImage: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80",
    productPrice: 3200,
    customerId: "demo-customer-priya",
    customerName: "Priya Nair",
    customerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    customerCity: "New Delhi",
    sellerId: "creator-meenakshi",
    sellerName: "Meenakshi Chhipa",
    sellerAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    sellerCity: "Sanganer, Jaipur",
    sellerVerified: true,
    craftTitle: "Handloom & Wooden Block Printing",
    lastMessageText: "Would you like vegetable indigo dye or natural madder red?",
    lastMessageAt: "2 days ago",
    unreadCountCustomer: 0,
    unreadCountSeller: 0,
    createdAt: "2026-10-16T11:00:00.000Z",
    payments: [],
    messages: [
      {
        id: "msg-301",
        conversationId: "conv-meenakshi-priya",
        senderId: "demo-customer-priya",
        text: "Hello Meenakshi ji! I want to order 2 custom stoles in Chanderi silk with your traditional floral wooden block motifs.",
        createdAt: "Oct 16, 11:00 AM"
      },
      {
        id: "msg-302",
        conversationId: "conv-meenakshi-priya",
        senderId: "creator-meenakshi",
        text: "Khamma Ghani Priya ji! We can hand-print those on hand-spun Chanderi. Would you like vegetable indigo dye or natural madder red?",
        createdAt: "Oct 16, 11:45 AM"
      }
    ]
  }
];


