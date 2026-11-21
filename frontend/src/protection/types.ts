export type InfringementStatus =
  | "Pending Review"
  | "Under Review"
  | "Listing Temporarily Restricted"
  | "Resolved / Dismissed";

export interface OwnershipDeclaration {
  declared: boolean;
  declarationText: string;
  declaredAt: string;
  declaredBy: string;
}

export interface ArtworkRecord {
  id: string;
  productId?: string;
  title: string;
  creatorId: string;
  creatorName: string;
  creatorCity?: string;
  creatorAvatar?: string;
  creatorVerified?: boolean;
  uploadedAt: string;
  sha256Hash: string;
  ownershipDeclared: boolean;
  ownershipDeclarationText: string;
  rawOriginalUrl: string;
  watermarkedPreviewUrl: string;
  fileSizeBytes?: number;
  mimeType?: string;
  dimensions?: string;
  category?: string;
  status: "Registered" | "Under Review" | "Restricted";
  notes?: string;
}

export interface InfringementReport {
  id: string;
  artworkId?: string;
  artworkTitle: string;
  originalListingUrl: string;
  suspectedCopiedUrl: string;
  reporterName: string;
  reporterEmail: string;
  reporterRole: "CREATOR" | "PATRON" | "COMMUNITY";
  description: string;
  evidenceUrls: string[];
  evidenceDescription?: string;
  status: InfringementStatus;
  submittedAt: string;
  moderatorNotes?: string;
  updatedAt?: string;
}

export interface ProtectionStats {
  totalProtectedArtworks: number;
  totalVerifiedArtisans: number;
  activeReportsCount: number;
  resolvedReportsCount: number;
}
