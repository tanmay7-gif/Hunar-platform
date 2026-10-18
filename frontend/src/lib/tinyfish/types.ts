/**
 * TinyFish Core Engine - TypeScript Definitions
 * Reactive, client-side/edge in-memory indexing and match scoring engine
 */

export interface Identifiable {
  id: string;
  [key: string]: any;
}

export interface IndexFieldConfig {
  /** Text fields to tokenize and index for zero-latency full-text search */
  textFields: { field: string; weight?: number }[];
  /** Categorical fields for fast exact-match and multi-select faceted filtering */
  facetFields: string[];
  /** Numeric fields for range filtering (e.g. price, budget, rating) */
  rangeFields: string[];
}

export interface RangeFilter {
  min?: number;
  max?: number;
}

export interface QueryOptions<T> {
  /** Full-text search query string (tokenized, prefix & typo-tolerant) */
  text?: string;
  /** Categorical filters (field -> value or array of values) */
  facets?: Record<string, string | string[] | undefined>;
  /** Numeric range filters (field -> { min, max }) */
  range?: Record<string, RangeFilter | undefined>;
  /** Custom predicate filter */
  filter?: (item: T) => boolean;
  /** Sort by field name, "relevance", or custom comparator */
  sortBy?: string | "relevance" | ((a: T, b: T) => number);
  /** Sort order */
  sortOrder?: "asc" | "desc";
  /** Pagination offset */
  offset?: number;
  /** Pagination limit */
  limit?: number;
}

export interface QueryResult<T> {
  items: T[];
  totalCount: number;
  executionTimeMs: number;
  facets: Record<string, Record<string, number>>;
  query: QueryOptions<T>;
}

export type Subscriber = () => void;
export type EventCallback = (payload: any) => void;

export interface OpportunityMatchFactors {
  craftScore: number;
  proximityScore: number;
  budgetScore: number;
  provenanceScore: number;
}

export interface OpportunityMatchResult {
  opportunityId: string;
  overallScore: number; // 0 - 100
  factors: OpportunityMatchFactors;
  isTopPick: boolean;
  isRecommended: boolean;
  craftRationale: string;
  craftRationaleHindi: string;
  proximityRationale: string;
  proximityRationaleHindi: string;
  budgetRationale: string;
  budgetRationaleHindi: string;
  matchedTags: string[];
  benchmarkBadge: string;
  benchmarkBadgeHindi: string;
}

export interface TinyFishTelemetry {
  collectionName: string;
  documentCount: number;
  indexedTokensCount: number;
  totalQueriesExecuted: number;
  lastQueryExecutionMs: number;
  averageQueryExecutionMs: number;
  memoryEstimateKb: number;
}

export type SyncAction = "create" | "update" | "delete" | "status_change";

export interface PendingSyncItem {
  id: string;
  collection: string;
  action: SyncAction;
  payload: any;
  timestamp: number;
  retryCount: number;
  status: "pending" | "syncing" | "failed";
  error?: string;
}

export interface SyncResult {
  syncedCount: number;
  failedCount: number;
  remainingCount: number;
  items: PendingSyncItem[];
}

export interface PricingBenchmarkResult {
  category: string;
  city: string;
  sampleSize: number;
  sampleCount?: number;
  p25: number;
  p50: number; // Median
  p75: number;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  suggestedMin: number;
  suggestedMax: number;
  marketTierLabel: string;
  marketTierLabelHindi: string;
  marketTier?: string;
  notes?: string;
  currency: string;
  executionTimeMs: number;
}
