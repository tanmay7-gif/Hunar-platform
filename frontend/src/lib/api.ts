// Hunar Frontend API Client
import {
  PayPalCreateOrderRequest,
  PayPalCreateOrderResponse,
  PayPalCaptureRequest,
  PayPalCaptureResponse,
  Channel3Product,
  Channel3ValuationRequest,
  Channel3ValuationResponse,
  Channel3TrendMetric,
} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function fetchFromApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || `API request failed with status ${response.status}`);
  }

  return response.json();
}

export const ApiService = {
  // Products
  getProducts: () => fetchFromApi("/products"),
  getProductById: (id: string) => fetchFromApi(`/products/${id}`),
  createProduct: (data: unknown) =>
    fetchFromApi("/products", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Creators
  getCreators: () => fetchFromApi("/creators"),
  getCreatorByUsername: (username: string) => fetchFromApi(`/creators/${username}`),

  // Inquiries
  getInquiries: () => fetchFromApi("/inquiries"),
  createInquiry: (data: unknown) =>
    fetchFromApi("/inquiries", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateInquiryStatus: (id: string, status: string, note?: string) =>
    fetchFromApi(`/inquiries/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status, note }),
    }),

  // Opportunities
  getOpportunities: () => fetchFromApi("/opportunities"),
  createOpportunity: (data: unknown) =>
    fetchFromApi("/opportunities", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Stats
  getStats: () => fetchFromApi("/stats"),

  // PayPal Sandbox v2
  createPayPalOrder: (data: PayPalCreateOrderRequest) =>
    fetchFromApi<PayPalCreateOrderResponse>("/payment/paypal/create-order", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  capturePayPalOrder: (data: PayPalCaptureRequest) =>
    fetchFromApi<PayPalCaptureResponse>("/payment/paypal/capture-order", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Channel3 Product Data & Valuation
  getChannel3Valuation: (data: Channel3ValuationRequest) =>
    fetchFromApi<{ success: boolean; valuation: Channel3ValuationResponse }>(
      "/channel3/valuation",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    ),

  searchChannel3Products: (query: string, category?: string, limit = 5) =>
    fetchFromApi<{ success: boolean; count: number; products: Channel3Product[]; isMock: boolean }>(
      "/channel3/search",
      {
        method: "POST",
        body: JSON.stringify({ query, category, limit }),
      }
    ),

  getChannel3Trends: () =>
    fetchFromApi<{ success: boolean; count: number; trends: Channel3TrendMetric[] }>(
      "/channel3/trends"
    ),
};
