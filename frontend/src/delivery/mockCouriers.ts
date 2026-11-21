import { CourierOption, PackagingOption, Shipment, ShippingMetrics, TrackingStatus } from "./types";

export const COURIER_OPTIONS: CourierOption[] = [
  {
    id: "courier-standard",
    name: "Standard Courier",
    tagline: "Economical ground shipping across PAN-India network",
    buyerFee: 110,
    courierCost: 80,
    grossMargin: 30,
    eta: "4–5 days"
  },
  {
    id: "courier-express",
    name: "Express Delivery",
    tagline: "Air priority line for time-sensitive customer orders",
    buyerFee: 180,
    courierCost: 135,
    grossMargin: 45,
    eta: "1–2 days",
    badge: "Fastest"
  },
  {
    id: "courier-fragile",
    name: "Fragile-Safe Partner",
    tagline: "Specialized gentle handling for pottery, glass & fine crafts",
    buyerFee: 150,
    courierCost: 110,
    grossMargin: 40,
    eta: "3–4 days",
    badge: "Artisan Recommended"
  }
];

export const PACKAGING_OPTIONS: PackagingOption[] = [
  {
    id: "pkg-basic",
    name: "Basic Packaging",
    description: "Standard corrugated 3-ply carton with kraft paper wrap",
    price: 0
  },
  {
    id: "pkg-fragile",
    name: "Fragile Protection",
    description: "Double bubble wrap, thermo-foam corner buffers & fragile security tape",
    price: 40,
    badge: "Popular"
  },
  {
    id: "pkg-crate",
    name: "Premium Artwork Crate",
    description: "Reinforced wooden frame with weather-seal vapor liner for heritage pieces",
    price: 90,
    badge: "Heritage Grade"
  }
];

export const INITIAL_SAMPLE_SHIPMENTS: Shipment[] = [
  {
    id: "ship-101",
    awbNumber: "HNR-AWB-20268491",
    orderId: "ORD-9421",
    artworkTitle: "Blue Pottery Peacock Royal Vase",
    artworkPrice: 4200,
    artisanName: "Rohit Sharma",
    pickupAddress: "Pottery Hub, Khurja G.T. Road",
    pickupCity: "Khurja",
    buyerName: "Priya Nair",
    deliveryAddress: "Flat 402, Sea Green Apts, Worli",
    deliveryCity: "Mumbai",
    weightKg: 1.8,
    dimensions: "28 x 20 x 20 cm",
    courier: COURIER_OPTIONS[2],
    packaging: PACKAGING_OPTIONS[1],
    shippingFee: 150,
    packagingFee: 40,
    totalCustomerPaid: 4390,
    courierCost: 110,
    grossMargin: 80, // 40 courier margin + 40 packaging fee
    status: "Delivered",
    checkpoints: [
      { status: "Placed", timestamp: "18 Nov, 10:30 AM", location: "Khurja Studio", note: "Shipment booked and manifest generated" },
      { status: "Packed", timestamp: "18 Nov, 03:15 PM", location: "Khurja Studio", note: "Packed with Fragile Protection double cushioning" },
      { status: "Picked Up", timestamp: "19 Nov, 11:00 AM", location: "Khurja Hub", note: "Picked up by Fragile-Safe Partner rider" },
      { status: "In Transit", timestamp: "20 Nov, 07:45 AM", location: "Bhiwandi Sorting Facility", note: "Arrived at destination transit hub" },
      { status: "Delivered", timestamp: "20 Nov, 04:20 PM", location: "Worli, Mumbai", note: "Signed and received by Priya Nair" }
    ],
    createdAt: "2026-11-18T10:30:00Z"
  },
  {
    id: "ship-102",
    awbNumber: "HNR-AWB-20269312",
    orderId: "ORD-9422",
    artworkTitle: "Madhubani Tree of Life Mithila Canvas",
    artworkPrice: 6500,
    artisanName: "Sunita Devi",
    pickupAddress: "Ranti Village, Madhubani",
    pickupCity: "Madhubani",
    buyerName: "Aditya Verma",
    deliveryAddress: "C-12, Indiranagar 100ft Road",
    deliveryCity: "Bengaluru",
    weightKg: 1.2,
    dimensions: "60 x 45 x 6 cm",
    courier: COURIER_OPTIONS[1],
    packaging: PACKAGING_OPTIONS[2],
    shippingFee: 180,
    packagingFee: 90,
    totalCustomerPaid: 6770,
    courierCost: 135,
    grossMargin: 135, // 45 courier margin + 90 packaging fee
    status: "In Transit",
    checkpoints: [
      { status: "Placed", timestamp: "19 Nov, 09:10 AM", location: "Madhubani Studio", note: "Order confirmed by artisan" },
      { status: "Packed", timestamp: "19 Nov, 02:00 PM", location: "Madhubani Studio", note: "Enclosed in Premium Wooden Crate" },
      { status: "Picked Up", timestamp: "20 Nov, 10:15 AM", location: "Patna Airport Hub", note: "Air express scan completed" },
      { status: "In Transit", timestamp: "21 Nov, 06:30 AM", location: "Bengaluru Cargo Gateway", note: "Dispatched to local last-mile facility" }
    ],
    createdAt: "2026-11-19T09:10:00Z"
  },
  {
    id: "ship-103",
    awbNumber: "HNR-AWB-20264188",
    orderId: "ORD-9423",
    artworkTitle: "Botanical Chai Oasis Handpainted Tiles (Set of 6)",
    artworkPrice: 3200,
    artisanName: "Arif Khan",
    pickupAddress: "Amer Road Studio Workshop",
    pickupCity: "Jaipur",
    buyerName: "Rohan Kapoor",
    deliveryAddress: "Plot 88, Banjara Hills Road No. 12",
    deliveryCity: "Hyderabad",
    weightKg: 2.4,
    dimensions: "35 x 35 x 12 cm",
    courier: COURIER_OPTIONS[0],
    packaging: PACKAGING_OPTIONS[1],
    shippingFee: 110,
    packagingFee: 40,
    totalCustomerPaid: 3350,
    courierCost: 80,
    grossMargin: 70, // 30 courier margin + 40 packaging fee
    status: "Picked Up",
    checkpoints: [
      { status: "Placed", timestamp: "20 Nov, 11:20 AM", location: "Jaipur Studio", note: "Label generated" },
      { status: "Packed", timestamp: "20 Nov, 05:00 PM", location: "Jaipur Studio", note: "Packed with bubble buffers" },
      { status: "Picked Up", timestamp: "21 Nov, 09:40 AM", location: "Jaipur Main Center", note: "Handed over to Standard Courier courier fleet" }
    ],
    createdAt: "2026-11-20T11:20:00Z"
  },
  {
    id: "ship-104",
    awbNumber: "HNR-AWB-20265219",
    orderId: "ORD-9424",
    artworkTitle: "Chikankari Hand-Embroidered Silk Stole",
    artworkPrice: 2800,
    artisanName: "Shazia Parveen",
    pickupAddress: "Aminabad Heritage Lane",
    pickupCity: "Lucknow",
    buyerName: "Sneha Sen",
    deliveryAddress: "B-404, Salt Lake Sector 1",
    deliveryCity: "Kolkata",
    weightKg: 0.6,
    dimensions: "25 x 18 x 5 cm",
    courier: COURIER_OPTIONS[0],
    packaging: PACKAGING_OPTIONS[0],
    shippingFee: 110,
    packagingFee: 0,
    totalCustomerPaid: 2910,
    courierCost: 80,
    grossMargin: 30, // 30 courier margin
    status: "Packed",
    checkpoints: [
      { status: "Placed", timestamp: "21 Nov, 08:30 AM", location: "Lucknow Studio", note: "Shipment manifested" },
      { status: "Packed", timestamp: "21 Nov, 10:00 AM", location: "Lucknow Studio", note: "Artisan sealed package, ready for rider pickup" }
    ],
    createdAt: "2026-11-21T08:30:00Z"
  }
];

export const STORAGE_KEY_SHIPMENTS = "hunar_delivery_shipments";

export function loadShipments(): Shipment[] {
  if (typeof window === "undefined") {
    return INITIAL_SAMPLE_SHIPMENTS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SHIPMENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_SHIPMENTS, JSON.stringify(INITIAL_SAMPLE_SHIPMENTS));
      return INITIAL_SAMPLE_SHIPMENTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_SAMPLE_SHIPMENTS;
  } catch (err) {
    console.warn("Failed to load shipments from localStorage:", err);
    return INITIAL_SAMPLE_SHIPMENTS;
  }
}

export function saveShipments(shipments: Shipment[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_SHIPMENTS, JSON.stringify(shipments));
  } catch (err) {
    console.warn("Failed to persist shipments:", err);
  }
}

export function calculateMetrics(shipments: Shipment[]): ShippingMetrics {
  const totalCollected = shipments.reduce((sum, s) => sum + s.shippingFee + s.packagingFee, 0);
  const totalCourierCost = shipments.reduce((sum, s) => sum + s.courierCost, 0);
  const totalGrossMargin = shipments.reduce((sum, s) => sum + s.grossMargin, 0);
  const completedDeliveries = shipments.filter((s) => s.status === "Delivered").length;
  const activeShipments = shipments.filter((s) => s.status !== "Delivered").length;
  const marginPercentage = totalCollected > 0 ? Math.round((totalGrossMargin / totalCollected) * 100) : 0;

  return {
    totalCollected,
    totalCourierCost,
    totalGrossMargin,
    completedDeliveries,
    activeShipments,
    marginPercentage
  };
}

export const TRACKING_STEPS: TrackingStatus[] = [
  "Placed",
  "Packed",
  "Picked Up",
  "In Transit",
  "Delivered"
];

export function advanceShipmentStatus(shipment: Shipment): Shipment {
  const currentIndex = TRACKING_STEPS.indexOf(shipment.status);
  let nextStatus: TrackingStatus;

  if (currentIndex < TRACKING_STEPS.length - 1) {
    nextStatus = TRACKING_STEPS[currentIndex + 1];
  } else {
    nextStatus = "Placed";
  }

  const nowFormatted = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });

  const locationNotes: Record<TrackingStatus, { loc: string; note: string }> = {
    Placed: { loc: `${shipment.pickupCity} Studio`, note: "Tracking reset (Demo Mode) — manifest regenerated" },
    Packed: { loc: `${shipment.pickupCity} Studio`, note: `Carefully packed with ${shipment.packaging.name}` },
    "Picked Up": { loc: `${shipment.pickupCity} Transit Hub`, note: `Handed over to ${shipment.courier.name} dispatch team` },
    "In Transit": { loc: `${shipment.deliveryCity} Distribution Gateway`, note: "In transit on priority line, out for delivery soon" },
    Delivered: { loc: shipment.deliveryAddress, note: `Successfully handed over to ${shipment.buyerName}` }
  };

  const checkpoint = {
    status: nextStatus,
    timestamp: nowFormatted,
    location: locationNotes[nextStatus].loc,
    note: locationNotes[nextStatus].note
  };

  const newCheckpoints = nextStatus === "Placed"
    ? [checkpoint]
    : [...shipment.checkpoints, checkpoint];

  return {
    ...shipment,
    status: nextStatus,
    checkpoints: newCheckpoints
  };
}
