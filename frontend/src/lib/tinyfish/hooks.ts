"use client";

/**
 * TinyFish React Hooks
 * Reactive client-side hooks for zero-latency queries, sync, and radar scoring
 */

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { tinyFish, TinyFishCollection } from "./engine";
import {
  Identifiable,
  QueryOptions,
  QueryResult,
  TinyFishTelemetry,
  OpportunityMatchResult,
  PendingSyncItem,
  PricingBenchmarkResult
} from "./types";
import { scoreOpportunityForArtisan } from "./matchScorer";
import { Opportunity } from "@/types";

/**
 * Access the global TinyFish singleton
 */
export function useTinyFish() {
  return tinyFish;
}

/**
 * Hook to synchronize external state (e.g. from Context or API) into a TinyFish collection
 */
export function useTinyFishSync<T extends Identifiable>(
  collectionName: string,
  data: T[]
): TinyFishCollection<T> {
  const collection = useMemo(() => tinyFish.getCollection<T>(collectionName), [collectionName]);
  const prevCountRef = useRef<number>(-1);
  const prevChecksumRef = useRef<string>("");

  useEffect(() => {
    if (!data || !Array.isArray(data)) return;

    // Fast shallow checksum check to avoid redundant re-indexing
    const currentChecksum = `${data.length}-${data[0]?.id || ""}-${data[data.length - 1]?.id || ""}`;
    if (prevChecksumRef.current === currentChecksum && collection.count() === data.length) {
      return;
    }

    prevChecksumRef.current = currentChecksum;
    prevCountRef.current = data.length;

    // Seed or update collection batch
    collection.clear();
    collection.insertBatch(data);
  }, [collection, data]);

  return collection;
}

/**
 * Reactive zero-latency query hook for TinyFish collections
 */
export function useTinyFishQuery<T extends Identifiable>(
  collectionName: string,
  queryOptions: QueryOptions<T> = {},
  deps: any[] = []
): QueryResult<T> & { isLoading: boolean; refetch: () => void } {
  const collection = useMemo(() => tinyFish.getCollection<T>(collectionName), [collectionName]);
  const [version, setVersion] = useState(0);

  // Subscribe to collection mutations
  useEffect(() => {
    const unsubscribe = collection.subscribe(() => {
      setVersion((v) => v + 1);
    });
    return unsubscribe;
  }, [collection]);

  const refetch = useCallback(() => {
    setVersion((v) => v + 1);
  }, []);

  // Execute query in-memory
  const result = useMemo(() => {
    return collection.query(queryOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection, version, ...deps, JSON.stringify(queryOptions.facets), JSON.stringify(queryOptions.range), queryOptions.text, queryOptions.sortBy, queryOptions.sortOrder]);

  return {
    ...result,
    isLoading: false,
    refetch
  };
}

export interface OpportunityWithMatch extends Opportunity {
  match: OpportunityMatchResult;
}

export interface RadarFilterOptions {
  category?: string;
  type?: string;
  location?: string;
  searchQuery?: string;
  minScore?: number;
  sortByScore?: boolean;
}

/**
 * Dedicated hook for the Seller Opportunity Radar with deterministic local match scoring
 */
export function useTinyFishOpportunityRadar(
  artisan: any,
  opportunities: Opportunity[],
  options: RadarFilterOptions = {}
) {
  const startTime = typeof performance !== "undefined" ? performance.now() : Date.now();

  const {
    category = "All",
    type = "All",
    location = "All",
    searchQuery = "",
    minScore = 0,
    sortByScore = true
  } = options;

  const scoredOpportunities: OpportunityWithMatch[] = useMemo(() => {
    if (!opportunities || opportunities.length === 0) return [];

    const scored = opportunities.map((opp) => {
      const match = scoreOpportunityForArtisan(artisan || {}, opp);
      return {
        ...opp,
        match
      };
    });

    // Apply filtering
    const filtered = scored.filter((item) => {
      // Minimum match score
      if (minScore > 0 && item.match.overallScore < minScore) return false;

      // Category
      if (category !== "All") {
        const matchCat =
          item.category.toLowerCase().includes(category.toLowerCase()) ||
          (item.matchedCategories || []).some((c) => c.toLowerCase().includes(category.toLowerCase()));
        if (!matchCat) return false;
      }

      // Type
      if (type !== "All" && item.type !== type) return false;

      // Location
      if (location !== "All") {
        const matchLoc =
          item.location.toLowerCase().includes(location.toLowerCase()) ||
          item.location.toLowerCase().includes("pan-india");
        if (!matchLoc) return false;
      }

      // Text search
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const textToSearch = `${item.title} ${item.description} ${item.postedByOrg} ${item.tags.join(" ")}`.toLowerCase();
        if (!textToSearch.includes(q)) return false;
      }

      return true;
    });

    // Sort by score or date
    if (sortByScore) {
      filtered.sort((a, b) => b.match.overallScore - a.match.overallScore);
    }

    return filtered;
  }, [artisan, opportunities, category, type, location, searchQuery, minScore, sortByScore]);

  const endTime = typeof performance !== "undefined" ? performance.now() : Date.now();
  const executionTimeMs = Math.max(0.08, Math.round((endTime - startTime) * 100) / 100);

  // Grouping statistics for radar summary
  const stats = useMemo(() => {
    const total = scoredOpportunities.length;
    const topPicks = scoredOpportunities.filter((o) => o.match.isTopPick).length;
    const recommended = scoredOpportunities.filter((o) => o.match.isRecommended && !o.match.isTopPick).length;
    const avgScore = total > 0
      ? Math.round(scoredOpportunities.reduce((acc, curr) => acc + curr.match.overallScore, 0) / total)
      : 0;

    return {
      total,
      topPicks,
      recommended,
      avgScore
    };
  }, [scoredOpportunities]);

  return {
    opportunities: scoredOpportunities,
    stats,
    executionTimeMs
  };
}

/**
 * Hook to inspect live TinyFish telemetry diagnostics
 */
export function useTinyFishTelemetry(collectionName?: string): TinyFishTelemetry[] {
  const [telemetry, setTelemetry] = useState<TinyFishTelemetry[]>([]);

  useEffect(() => {
    const update = () => {
      if (collectionName) {
        try {
          const col = tinyFish.getCollection(collectionName);
          setTelemetry([col.getTelemetry()]);
        } catch {
          // ignore
        }
      } else {
        setTelemetry(tinyFish.getAllTelemetry());
      }
    };

    update();
    const interval = setInterval(update, 2000);
    return () => clearInterval(interval);
  }, [collectionName]);

  return telemetry;
}

/**
 * Dynamic Budget Estimator Hook:
 * Calculates 25th–75th percentile pricing from indexed listings client-side without API latency
 */
export function useTinyFishPricingBenchmark(
  category: string,
  city?: string
): PricingBenchmarkResult {
  const [version, setVersion] = useState(0);

  // Subscribe to changes in products collection
  useEffect(() => {
    try {
      const prodCol = tinyFish.getCollection("products");
      return prodCol.subscribe(() => setVersion((v) => v + 1));
    } catch {
      // ignore
    }
  }, []);

  const benchmark = useMemo(() => {
    return tinyFish.getPricingBenchmark(category, city);
  }, [category, city, version]);

  return benchmark;
}

/**
 * Offline-ready draft and status sync queue hook
 */
export function useTinyFishSyncQueue() {
  const syncQueue = useMemo(() => tinyFish.getSyncQueue(), []);
  const [queue, setQueue] = useState<PendingSyncItem[]>(() => syncQueue.getQueue());
  const [isOnline, setIsOnline] = useState<boolean>(() => syncQueue.isOnline());
  const [isSyncing, setIsSyncing] = useState<boolean>(() => syncQueue.getIsSyncing());

  useEffect(() => {
    const handleUpdate = () => {
      setQueue(syncQueue.getQueue());
      setIsOnline(syncQueue.isOnline());
      setIsSyncing(syncQueue.getIsSyncing());
    };

    const unsubscribe = syncQueue.subscribe(handleUpdate);

    const onOnline = () => {
      setIsOnline(true);
      handleUpdate();
    };
    const onOffline = () => {
      setIsOnline(false);
      handleUpdate();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("online", onOnline);
      window.addEventListener("offline", onOffline);
    }

    return () => {
      unsubscribe();
      if (typeof window !== "undefined") {
        window.removeEventListener("online", onOnline);
        window.removeEventListener("offline", onOffline);
      }
    };
  }, [syncQueue]);

  const flush = useCallback(
    async (handler?: (item: PendingSyncItem) => Promise<boolean>) => {
      return await syncQueue.flush(handler);
    },
    [syncQueue]
  );

  const enqueue = useCallback(
    (collection: string, action: any, payload: any) => {
      return syncQueue.enqueue(collection, action, payload);
    },
    [syncQueue]
  );

  const enqueueDraft = useCallback(
    (product: any) => {
      return tinyFish.enqueueDraft(product);
    },
    []
  );

  const enqueueStatusUpdate = useCallback(
    (productId: string, status: string) => {
      return tinyFish.enqueueStatusUpdate(productId, status);
    },
    []
  );

  const pendingCount = queue.filter((i) => i.status === "pending" || i.status === "failed").length;

  return {
    queue,
    pendingCount,
    isOnline,
    isSyncing,
    flush,
    flushQueue: flush,
    enqueue,
    enqueueDraft,
    enqueueStatusUpdate,
    clearQueue: () => syncQueue.clearQueue()
  };
}

