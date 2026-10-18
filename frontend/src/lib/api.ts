// Hunar Frontend API Client

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
};
