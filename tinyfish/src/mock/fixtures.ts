/**
 * TinyFish Resilient Fallback Fixtures & Simulated Agent Logs
 * High-fidelity domain datasets for Indian Handicrafts, GI Tag Verification, and Rural Hub Logistics.
 */

export const MOCK_CRAFT_SEARCH_FIXTURES: Record<string, any[]> = {
  default: [
    {
      title: "India Handicrafts Export Promotion Council (EPCH) — Live Intelligence",
      url: "https://epch.in/market-intelligence",
      snippet: "Export demand index for authentic Indian handcrafted goods up 18.4% YoY. Direct artisan collectives securing high-margin European commissions.",
      source: "EPCH India"
    },
    {
      title: "Geographical Indications (GI) Registry Portal — National Database",
      url: "https://ipindia.gov.in/gi-records",
      snippet: "Verified heritage origin specifications, raw material standards, and authorized user directory for heritage craft clusters.",
      source: "Intellectual Property India"
    },
    {
      title: "Surajkund International Crafts Mela 2026 — Master Artisan Guidelines",
      url: "https://haryanatourism.gov.in/surajkund-crafts-mela-2026",
      snippet: "Official guidelines for national awardee and certified master potters and weavers. Stall subsidies up to 60% for direct grassroots artisans.",
      source: "Surajkund Authority"
    }
  ],
  terracotta: [
    {
      title: "Khurja Terracotta & Pottery Raw Clay Wholesale Rates (UP ODOP 2026)",
      url: "https://handicrafts.nic.in/market-index/khurja-terracotta",
      snippet: "Current certified grade-A Khurja terracotta raw clay trading at ₹420 - ₹480 per 50kg sack. Firing fuel subsidy active through UP ODOP initiative.",
      source: "Ministry of Textiles"
    },
    {
      title: "CGCRI Khurja Lead-Safe Glaze Certification Benchmarks",
      url: "https://cgcri.res.in/khurja-ceramic-standards",
      snippet: "Central Glass and Ceramic Research Institute guidelines for export-compliant non-toxic ceramic finishes and solar-assisted hybrid kilns.",
      source: "CSIR-CGCRI Khurja"
    }
  ],
  silk: [
    {
      title: "Chanderi Handloom GI Tag Registry & Authentic Mulberry Silk Yarn Rates",
      url: "https://handlooms.nic.in/yarn-depot/chanderi-silk-spot",
      snippet: "NHDC depot Chanderi 20/22 denier mulberry silk yarn closing at ₹4,150/kg. Registered master weavers eligible for 15% cooperative rebate.",
      source: "National Handloom Development Corporation"
    },
    {
      title: "Natural Indigo & Bagru Dabu Mud-Resist Dye Fair Market Benchmarks",
      url: "https://craftscouncilofindia.org/dye-index/bagru-dabu-rates",
      snippet: "Bagru and Akola cluster raw indigo cakes priced at ₹1,850/kg. High export demand observed across European eco-luxury buyers.",
      source: "Crafts Council of India"
    }
  ]
};

export const MOCK_COURIER_SOPS: Record<string, any> = {
  "terracotta-pottery": {
    craftCategory: "Terracotta & Ceramic Studio Pottery",
    packagingRequirements: [
      "Triple-layer corrugated 5-ply box (minimum 250 GSM burst factor)",
      "Biodegradable cornstarch air pillows or bubble wrap (minimum 15mm thickness)",
      "Void fill with shredded kraft paper; minimum 2-inch clearance from all box outer walls",
      "Prominent 'Fragile / Handle With Care' and 'This Way Up' bilingual labels"
    ],
    recommendedCouriers: [
      { name: "India Post Speed Post", fragileHandling: "Basic", reliabilityScore: 82, pickupAvailable: true },
      { name: "Delhivery Surface Special", fragileHandling: "Secured / Palletized", reliabilityScore: 94, pickupAvailable: true },
      { name: "BlueDart Apex Ground", fragileHandling: "Air Cargo Insured", reliabilityScore: 96, pickupAvailable: true }
    ],
    insuranceAdvice: "Mandatory transit transit risk cover recommended for consignments valued over ₹2,500."
  },
  "textiles-handloom": {
    craftCategory: "Handloom Sarees, Dabu Block Prints & Madhubani Canvases",
    packagingRequirements: [
      "Acid-free butter paper inner wrapping to prevent pigment transfer",
      "Waterproof heat-sealed polybag (minimum 60 microns) to protect against humidity",
      "Rigid cardboard envelope or flat outer mailer box",
      "Handloom Mark / Silk Mark authentic origin seal outside"
    ],
    recommendedCouriers: [
      { name: "India Post Speed Post Express", fragileHandling: "Standard", reliabilityScore: 91, pickupAvailable: true },
      { name: "Delhivery Express Direct", fragileHandling: "Standard Express", reliabilityScore: 93, pickupAvailable: true },
      { name: "XpressBees Surface", fragileHandling: "Economy Surface", reliabilityScore: 88, pickupAvailable: true }
    ],
    insuranceAdvice: "Standard carrier liability sufficient for shipments under ₹10,000."
  }
};

export const MOCK_COURIER_RATE_COMPARISONS = [
  {
    provider: "India Post Speed Post (Rural Dawk)",
    estimatedCost: 145,
    transitDays: "3-5 Days",
    trackingQuality: "SMS & Web (Moderate)",
    ruralReachScore: 99,
    bestFor: "Grassroots Tier-3/Tier-4 PIN codes (Madhubani, Khurja, Bagru)",
    badge: "Maximum Rural Coverage"
  },
  {
    provider: "Delhivery Surface B2C Special",
    estimatedCost: 180,
    transitDays: "2-4 Days",
    trackingQuality: "Real-time GPS & WhatsApp Updates",
    ruralReachScore: 92,
    bestFor: "Direct studio doorstep pickup with prepaid label generation",
    badge: "Best Value for Studio Artisans"
  },
  {
    provider: "BlueDart Apex Fragile Express",
    estimatedCost: 320,
    transitDays: "1-2 Days",
    trackingQuality: "Priority Commercial Tracking & Air Freight",
    ruralReachScore: 86,
    bestFor: "High-value fine art commissions (>₹10,000) and delicate terracotta murals",
    badge: "Highest Transit Safety"
  },
  {
    provider: "XpressBees Regional Ground",
    estimatedCost: 160,
    transitDays: "3-4 Days",
    trackingQuality: "Standard App Tracking",
    ruralReachScore: 89,
    bestFor: "Bulk wholesale orders and corporate gifting consignments",
    badge: "Economic Bulk Freight"
  }
];

export const MOCK_RURAL_HUBS = [
  {
    hubId: "HUB-KHA-01",
    clusterName: "Khurja Ceramic Hub",
    state: "Uttar Pradesh",
    pinCode: "203131",
    activeArtisansCount: 48,
    primaryCraft: "Glazed Terracotta & Tableware",
    partnerCouriers: ["India Post Speed Post Depot", "Delhivery Rural Express"],
    dailyConsignmentCapacity: "450 kg",
    status: "Active & Monitored"
  },
  {
    hubId: "HUB-MDB-02",
    clusterName: "Jitwarpur Madhubani Guild Hub",
    state: "Bihar",
    pinCode: "847211",
    activeArtisansCount: 64,
    primaryCraft: "Mithila Folk Painting on Canvas & Paper",
    partnerCouriers: ["India Post Jitwarpur Sub-Post", "BlueDart Hub Darbhanga"],
    dailyConsignmentCapacity: "220 kg",
    status: "Active & Monitored"
  },
  {
    hubId: "HUB-BGR-03",
    clusterName: "Bagru Hand-Block Textile Hub",
    state: "Rajasthan",
    pinCode: "303007",
    activeArtisansCount: 52,
    primaryCraft: "Dabu Mud-Resist & Natural Vegetable Dyeing",
    partnerCouriers: ["Delhivery Bagru Industrial Hub", "India Post Bagru"],
    dailyConsignmentCapacity: "600 kg",
    status: "Active & Monitored"
  },
  {
    hubId: "HUB-CHN-04",
    clusterName: "Chanderi Heritage Handloom Cluster",
    state: "Madhya Pradesh",
    pinCode: "473446",
    activeArtisansCount: 71,
    primaryCraft: "Chanderi Zari & Mulberry Silk Weaving",
    partnerCouriers: ["India Post Chanderi H.O.", "Delhivery Guna Feeder"],
    dailyConsignmentCapacity: "350 kg",
    status: "Active & Monitored"
  }
];
