import { ArtworkRecord, InfringementReport, InfringementStatus } from "../types";

export const STORAGE_KEYS = {
  ARTWORK_RECORDS: "hunar_artwork_protection_records",
  REPORTS: "hunar_infringement_reports"
} as const;

export async function computeSha256(data: File | Blob | ArrayBuffer | string): Promise<string> {
  if (typeof window === "undefined" || !window.crypto || !window.crypto.subtle) {
    let hash = 0;
    const str = typeof data === "string" ? data : "hunar-crypto-hash-fallback";
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return `sha256_${Math.abs(hash).toString(16).padStart(16, "0")}${Date.now().toString(16)}`;
  }

  let buffer: ArrayBuffer;

  if (data instanceof ArrayBuffer) {
    buffer = data;
  } else if (data instanceof Blob) {
    buffer = await data.arrayBuffer();
  } else if (typeof data === "string") {
    if (data.startsWith("data:") && data.includes(",")) {
      try {
        const base64 = data.split(",")[1];
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        buffer = bytes.buffer;
      } catch {
        buffer = new TextEncoder().encode(data).buffer;
      }
    } else {
      buffer = new TextEncoder().encode(data).buffer;
    }
  } else {
    buffer = new TextEncoder().encode(String(data)).buffer;
  }

  const hashBuffer = await window.crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function generateArtworkId(): string {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `HUN-ART-2026-${num}`;
}

export function generateReportId(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `HUN-REP-2026-${num}`;
}

export const SEED_ARTWORK_RECORDS: ArtworkRecord[] = [
  {
    id: "HUN-ART-2026-00142",
    productId: "p1",
    title: "Wood-Fired Terracotta Chai Kulhar Set",
    creatorId: "demo-seller-rohit",
    creatorName: "Rohit Sharma",
    creatorCity: "Khurja / Delhi NCR",
    creatorAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
    creatorVerified: true,
    uploadedAt: "2026-10-15T10:30:00.000Z",
    sha256Hash: "4c7d03f0b48a8e19c968f86ef103841029472e389d342f01f4639dbb71d9d45e",
    ownershipDeclared: true,
    ownershipDeclarationText: "I confirm that I created this original work or hold full permission to upload and sell it on Hunar.",
    rawOriginalUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1600&auto=format&fit=crop&q=90",
    watermarkedPreviewUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80",
    dimensions: "12cm x 8cm",
    category: "Terracotta & Pottery",
    status: "Registered"
  },
  {
    id: "HUN-ART-2026-00143",
    productId: "p2",
    title: "Hand-Carved Stone Jali Oil Lamp",
    creatorId: "demo-seller-rohit",
    creatorName: "Rohit Sharma",
    creatorCity: "Khurja / Delhi NCR",
    creatorAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
    creatorVerified: true,
    uploadedAt: "2026-10-18T14:15:00.000Z",
    sha256Hash: "8f12a34b8c9d01e23f4567a89b01c23d4e5f67890123456789abcdef01234567",
    ownershipDeclared: true,
    ownershipDeclarationText: "I confirm that I created this original work or hold full permission to upload and sell it on Hunar.",
    rawOriginalUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1600&auto=format&fit=crop&q=90",
    watermarkedPreviewUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80",
    dimensions: "18cm x 18cm",
    category: "Woodwork & Stone",
    status: "Registered"
  },
  {
    id: "HUN-ART-2026-00144",
    productId: "p3",
    title: "Kohbar Traditional Madhubani Canvas",
    creatorId: "creator-shanti",
    creatorName: "Shanti Devi",
    creatorCity: "Madhubani, Bihar",
    creatorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
    creatorVerified: true,
    uploadedAt: "2026-10-22T09:45:00.000Z",
    sha256Hash: "2a9b4c6d8e0f123456789abcdef0123456789abcdef0123456789abcdef01234",
    ownershipDeclared: true,
    ownershipDeclarationText: "I confirm that I created this original work or hold full permission to upload and sell it on Hunar.",
    rawOriginalUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1600&auto=format&fit=crop&q=90",
    watermarkedPreviewUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80",
    dimensions: "24in x 36in",
    category: "Madhubani Folk Art",
    status: "Registered"
  }
];

export const SEED_INFRINGEMENT_REPORTS: InfringementReport[] = [
  {
    id: "HUN-REP-2026-1042",
    artworkId: "HUN-ART-2026-00142",
    artworkTitle: "Wood-Fired Terracotta Chai Kulhar Set",
    originalListingUrl: "https://hunar.in/products/p1",
    suspectedCopiedUrl: "https://external-reseller-store.in/products/ceramic-kulhar-clone",
    reporterName: "Rohit Sharma",
    reporterEmail: "rohit.potter@hunar.in",
    reporterRole: "CREATOR",
    description: "Third-party reseller downloaded my catalog photo, cropped the lower edge, and is selling factory-molded slip-cast duplicates falsely claiming handmade studio Khurja origin.",
    evidenceUrls: [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80"
    ],
    evidenceDescription: "Original dated high-res studio shot taken in my workshop on Oct 14, 2026 before firing batch.",
    status: "Pending Review",
    submittedAt: "2026-11-05T11:20:00.000Z"
  },
  {
    id: "HUN-REP-2026-1038",
    artworkId: "HUN-ART-2026-00144",
    artworkTitle: "Kohbar Traditional Madhubani Canvas",
    originalListingUrl: "https://hunar.in/products/p3",
    suspectedCopiedUrl: "https://print-on-demand-site.com/tshirts/madhubani-lotus",
    reporterName: "Priya Nair",
    reporterEmail: "priya.patron@hunar.in",
    reporterRole: "PATRON",
    description: "Saw Shanti Devi's original Kohbar motif printed onto mass-market polyester tee shirts without creator attribution or licensing agreement.",
    evidenceUrls: [],
    evidenceDescription: "Attached screenshot of the print-on-demand listing with date stamp.",
    status: "Under Review",
    submittedAt: "2026-11-12T16:45:00.000Z",
    moderatorNotes: "Contacted creator to verify if any commercial licensing had been granted. Awaiting response."
  }
];

export function getStoredArtworkRecords(): ArtworkRecord[] {
  if (typeof window === "undefined") return SEED_ARTWORK_RECORDS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ARTWORK_RECORDS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    localStorage.setItem(STORAGE_KEYS.ARTWORK_RECORDS, JSON.stringify(SEED_ARTWORK_RECORDS));
    return SEED_ARTWORK_RECORDS;
  } catch {
    return SEED_ARTWORK_RECORDS;
  }
}

export function saveArtworkRecord(record: ArtworkRecord): ArtworkRecord[] {
  if (typeof window === "undefined") return [record];
  try {
    const current = getStoredArtworkRecords();
    const existingIndex = current.findIndex((r) => r.id === record.id || (r.productId && r.productId === record.productId));
    let updated: ArtworkRecord[];
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = { ...updated[existingIndex], ...record };
    } else {
      updated = [record, ...current];
    }
    localStorage.setItem(STORAGE_KEYS.ARTWORK_RECORDS, JSON.stringify(updated));
    return updated;
  } catch {
    return [record];
  }
}

export function getStoredInfringementReports(): InfringementReport[] {
  if (typeof window === "undefined") return SEED_INFRINGEMENT_REPORTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REPORTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(SEED_INFRINGEMENT_REPORTS));
    return SEED_INFRINGEMENT_REPORTS;
  } catch {
    return SEED_INFRINGEMENT_REPORTS;
  }
}

export function saveInfringementReport(report: InfringementReport): InfringementReport[] {
  if (typeof window === "undefined") return [report];
  try {
    const current = getStoredInfringementReports();
    const updated = [report, ...current.filter((r) => r.id !== report.id)];
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(updated));
    return updated;
  } catch {
    return [report];
  }
}

export function updateInfringementReportStatus(
  reportId: string,
  newStatus: InfringementStatus,
  moderatorNotes?: string
): InfringementReport[] {
  if (typeof window === "undefined") return [];
  try {
    const current = getStoredInfringementReports();
    const updated = current.map((r) =>
      r.id === reportId
        ? {
            ...r,
            status: newStatus,
            moderatorNotes: moderatorNotes !== undefined ? moderatorNotes : r.moderatorNotes,
            updatedAt: new Date().toISOString()
          }
        : r
    );
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function getProductArtworkRecord(
  product: {
    id: string;
    title: string;
    images: string[];
    price: number;
    category?: string;
    dimensions?: string;
    sellerId?: string;
    sellerName?: string;
    sellerCity?: string;
    sellerAvatar?: string;
    sellerVerified?: boolean;
    createdAt?: string;
    artworkId?: string;
    sha256Hash?: string;
    ownershipDeclared?: boolean;
    rawOriginalUrl?: string;
  },
  creatorFallbackName: string = "Artisan"
): ArtworkRecord {
  const records = getStoredArtworkRecords();
  const found = records.find(
    (r) => r.productId === product.id || (product.artworkId && r.id === product.artworkId)
  );
  if (found) return found;

  let hashVal = 0;
  const keyStr = product.id + product.title;
  for (let i = 0; i < keyStr.length; i++) {
    hashVal = (hashVal << 5) - hashVal + keyStr.charCodeAt(i);
    hashVal |= 0;
  }
  const suffix = Math.abs(hashVal).toString().slice(0, 5).padStart(5, "0");
  const fallbackId = product.artworkId || `HUN-ART-2026-${suffix}`;
  const fallbackHash =
    product.sha256Hash ||
    `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852${suffix.slice(0, 4)}`;

  return {
    id: fallbackId,
    productId: product.id,
    title: product.title,
    creatorId: product.sellerId || "artisan-studio",
    creatorName: product.sellerName || creatorFallbackName,
    creatorCity: product.sellerCity,
    creatorAvatar: product.sellerAvatar,
    creatorVerified: product.sellerVerified ?? true,
    uploadedAt: product.createdAt || "2026-10-20T12:00:00.000Z",
    sha256Hash: fallbackHash,
    ownershipDeclared: true,
    ownershipDeclarationText:
      "I confirm that I created this original work or hold full permission to upload and sell it on Hunar.",
    rawOriginalUrl: product.rawOriginalUrl || product.images[0],
    watermarkedPreviewUrl: product.images[0],
    dimensions: product.dimensions,
    category: product.category,
    status: "Registered"
  };
}
