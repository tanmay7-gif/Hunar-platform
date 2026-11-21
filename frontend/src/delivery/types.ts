export type TrackingStatus = "Placed" | "Packed" | "Picked Up" | "In Transit" | "Delivered";

export interface CourierOption {
  id: string;
  name: string;
  tagline: string;
  buyerFee: number;
  courierCost: number;
  grossMargin: number;
  eta: string;
  badge?: string;
}

export interface PackagingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  badge?: string;
}

export interface TrackingCheckpoint {
  status: TrackingStatus;
  timestamp: string;
  location: string;
  note: string;
}

export interface Shipment {
  id: string;
  awbNumber: string;
  orderId: string;
  artworkTitle: string;
  artworkPrice: number;
  artisanName: string;
  pickupAddress: string;
  pickupCity: string;
  buyerName: string;
  deliveryAddress: string;
  deliveryCity: string;
  weightKg: number;
  dimensions: string;
  courier: CourierOption;
  packaging: PackagingOption;
  shippingFee: number;
  packagingFee: number;
  totalCustomerPaid: number;
  courierCost: number;
  grossMargin: number;
  status: TrackingStatus;
  checkpoints: TrackingCheckpoint[];
  createdAt: string;
}

export interface ShippingMetrics {
  totalCollected: number;
  totalCourierCost: number;
  totalGrossMargin: number;
  completedDeliveries: number;
  activeShipments: number;
  marginPercentage: number;
}
