/**
 * TinyFish Match Scorer
 * Deterministic, client-side match scoring engine for the Seller Opportunity Radar.
 * Strictly adheres to the craft-rooted, non-AI aesthetic with genuine artisanal criteria.
 */

import { Opportunity } from "@/types";
import { OpportunityMatchResult, OpportunityMatchFactors } from "./types";

interface ArtisanProfile {
  id?: string;
  name?: string;
  city?: string;
  artCategory?: string;
  primaryArtForm?: string;
  skills?: string[];
  minPricing?: number;
  hourlyRate?: number;
  isVerified?: boolean;
  completedGigsCount?: number;
  tagline?: string;
}

// Craft synonym graph for deep domain matching
const CRAFT_SYNONYMS: Record<string, string[]> = {
  pottery: ["pottery", "ceramics", "terracotta", "clay", "khurja", "studio pottery", "stoneware", "vessel", "glazing"],
  ceramics: ["pottery", "ceramics", "terracotta", "clay", "khurja", "studio pottery"],
  terracotta: ["pottery", "terracotta", "clay", "figurines", "relief", "pots", "khurja"],
  murals: ["mural", "murals", "wall art", "facade", "acrylics", "large scale", "exterior wall", "cafe mural"],
  muraldesign: ["mural", "murals", "wall art", "facade", "acrylics", "cafe mural"],
  madhubani: ["madhubani", "mithila", "folk", "folk art", "pattachitra", "kalamkari", "traditional painting", "nib"],
  folk: ["madhubani", "mithila", "folk", "warli", "gond", "pattachitra", "traditional art"],
  henna: ["henna", "mehndi", "bridal mehndi", "bridal", "organic henna", "awadhi", "arabic", "cone"],
  bridalmehndi: ["henna", "mehndi", "bridal mehndi", "bridal", "wedding"],
  textiles: ["textile", "textiles", "weaving", "handloom", "banarasi", "embroidery", "silk", "cotton"],
  sculpture: ["sculpture", "woodcarving", "woodwork", "stone", "carving", "figurine"]
};

// Regional geographic clustering for India
const REGIONAL_CLUSTERS: Record<string, string[]> = {
  "delhi ncr": ["delhi", "delhi ncr", "gurugram", "noida", "ghaziabad", "faridabad", "khurja", "meerut"],
  "khurja": ["khurja", "delhi ncr", "delhi", "uttar pradesh", "aligarh", "noida"],
  "jaipur": ["jaipur", "rajasthan", "udaipur", "jodhpur", "kota", "delhi ncr"],
  "madhubani": ["madhubani", "bihar", "patna", "darbhanga", "mithila", "kolkata"],
  "lucknow": ["lucknow", "uttar pradesh", "kanpur", "varanasi", "awadh", "delhi ncr"],
  "kolkata": ["kolkata", "west bengal", "shantiniketan", "bihar"]
};

function normalizeString(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Calculates a multi-dimensional craft match between an artisan and a commercial opportunity
 */
export function scoreOpportunityForArtisan(
  artisan: ArtisanProfile,
  opp: Opportunity
): OpportunityMatchResult {
  const artisanCategory = normalizeString(artisan.artCategory || artisan.primaryArtForm || "");
  const artisanCity = (artisan.city || "").toLowerCase().trim();
  const artisanSkills = (artisan.skills || []).map((s) => s.toLowerCase());

  // ---------------------------------------------------------------------------
  // 1. CRAFT & MEDIUM ALIGNMENT (Weight: 40%)
  // ---------------------------------------------------------------------------
  let craftScore = 0;
  const oppCategoryNorm = normalizeString(opp.category);
  const oppMatchedCatsNorm = (opp.matchedCategories || []).map(normalizeString);
  const oppTagsNorm = (opp.tags || []).map((t) => t.toLowerCase());
  const oppText = `${opp.title} ${opp.description} ${opp.requirements.join(" ")}`.toLowerCase();

  // Direct category match
  if (oppCategoryNorm === artisanCategory || oppMatchedCatsNorm.includes(artisanCategory)) {
    craftScore += 70;
  } else {
    // Synonym expansion match
    const synonyms = CRAFT_SYNONYMS[artisanCategory] || [];
    let synonymMatched = false;
    for (const syn of synonyms) {
      if (
        oppText.includes(syn) ||
        oppTagsNorm.some((t) => t.includes(syn)) ||
        oppMatchedCatsNorm.some((c) => c.includes(normalizeString(syn)))
      ) {
        synonymMatched = true;
        break;
      }
    }
    if (synonymMatched) {
      craftScore += 50;
    } else {
      craftScore += 15; // baseline craft affinity
    }
  }

  // Skills overlap
  let skillsMatchCount = 0;
  for (const skill of artisanSkills) {
    if (oppText.includes(skill) || oppTagsNorm.includes(skill)) {
      skillsMatchCount++;
    }
  }
  const skillsBonus = Math.min(30, skillsMatchCount * 10);
  craftScore = Math.min(100, craftScore + skillsBonus);

  // ---------------------------------------------------------------------------
  // 2. GEOGRAPHIC PROXIMITY (Weight: 30%)
  // ---------------------------------------------------------------------------
  let proximityScore = 0;
  const oppLoc = opp.location.toLowerCase();

  const isRemoteOrPanIndia =
    oppLoc.includes("pan-india") ||
    oppLoc.includes("remote") ||
    oppLoc.includes("all india") ||
    opp.type === "Grant" ||
    opp.type === "Exhibition";

  if (isRemoteOrPanIndia) {
    proximityScore = 90; // High accessibility for grants / exhibitions / shippable work
  } else {
    // Check direct city overlap
    const directCityMatch =
      artisanCity.length > 0 &&
      (oppLoc.includes(artisanCity) || artisanCity.includes(oppLoc));

    if (directCityMatch) {
      proximityScore = 100;
    } else {
      // Check regional cluster
      let clusterMatch = false;
      for (const [clusterKey, cities] of Object.entries(REGIONAL_CLUSTERS)) {
        const artisanInCluster = cities.some((c) => artisanCity.includes(c));
        const oppInCluster = cities.some((c) => oppLoc.includes(c));
        if (artisanInCluster && oppInCluster) {
          clusterMatch = true;
          break;
        }
      }

      if (clusterMatch) {
        proximityScore = 80; // Nearby regional hub
      } else {
        proximityScore = 35; // Inter-state / requires travel
      }
    }
  }

  // ---------------------------------------------------------------------------
  // 3. BUDGET & ECONOMIC COMPATIBILITY (Weight: 20%)
  // ---------------------------------------------------------------------------
  let budgetScore = 0;
  const minArtisanRate = artisan.minPricing || 3000;
  const oppMaxBudget = opp.budgetMax;

  if (oppMaxBudget >= minArtisanRate * 2.5) {
    budgetScore = 100; // Lucrative commercial rate
  } else if (oppMaxBudget >= minArtisanRate) {
    budgetScore = 85; // Solid profitable rate
  } else if (oppMaxBudget >= minArtisanRate * 0.75) {
    budgetScore = 65; // Moderate fit
  } else {
    budgetScore = 40; // Low budget relative to studio rate
  }

  // ---------------------------------------------------------------------------
  // 4. PROVENANCE & ARTISAN CREDENTIAL (Weight: 10%)
  // ---------------------------------------------------------------------------
  let provenanceScore = 50;
  if (artisan.isVerified) provenanceScore += 30;
  if ((artisan.completedGigsCount || 0) >= 3) provenanceScore += 20;
  provenanceScore = Math.min(100, provenanceScore);

  // ---------------------------------------------------------------------------
  // OVERALL WEIGHTED CALCULATION
  // ---------------------------------------------------------------------------
  const overallScore = Math.round(
    craftScore * 0.40 +
    proximityScore * 0.30 +
    budgetScore * 0.20 +
    provenanceScore * 0.10
  );

  const isTopPick = overallScore >= 85;
  const isRecommended = overallScore >= 70;

  // ---------------------------------------------------------------------------
  // CRAFT-ROOTED RATIONALES & BENCHMARKS (Strictly Non-AI Tone)
  // ---------------------------------------------------------------------------
  let craftRationale = "General medium alignment with opportunity requirements.";
  let craftRationaleHindi = "अवसर की सामान्य शिल्प आवश्यकताओं के अनुकूल।";
  if (craftScore >= 85) {
    craftRationale = `Exact medium match for ${artisan.artCategory || "your craft"} and studio technique.`;
    craftRationaleHindi = `${artisan.artCategory || "आपकी विधा"} और स्टूडियो तकनीक के लिए सटीक शिल्प मिलान।`;
  } else if (craftScore >= 65) {
    craftRationale = `Strong technique crossover based on your portfolio skills.`;
    craftRationaleHindi = `आपके पोर्टफोलियो कौशल के आधार पर मजबूत शिल्प संगति।`;
  }

  let proximityRationale = "Standard geographic logistics apply.";
  let proximityRationaleHindi = "मानक क्षेत्रीय दूरी लागू होती है।";
  if (proximityScore >= 95) {
    proximityRationale = `Local studio location (${opp.location}) — zero long-distance logistics.`;
    proximityRationaleHindi = `स्थानीय स्टूडियो स्थान (${opp.location}) — शून्य लंबी दूरी का खर्च।`;
  } else if (proximityScore >= 80) {
    proximityRationale = `Regional proximity (${opp.location}) — comfortable travel or freight corridor.`;
    proximityRationaleHindi = `समीपवर्ती क्षेत्र (${opp.location}) — सुगम यात्रा व माल ढुलाई।`;
  } else if (isRemoteOrPanIndia) {
    proximityRationale = `Pan-India opening — open to artisans nationwide.`;
    proximityRationaleHindi = `अखिल भारतीय अवसर — देश भर के कारीगरों के लिए खुला।`;
  }

  let budgetRationale = `Fair quotation range: ₹${opp.budgetMin.toLocaleString("en-IN")} - ₹${opp.budgetMax.toLocaleString("en-IN")}.`;
  let budgetRationaleHindi = `उचित बोली दायरा: ₹${opp.budgetMin.toLocaleString("en-IN")} - ₹${opp.budgetMax.toLocaleString("en-IN")}।`;
  if (budgetScore >= 90) {
    budgetRationale = `High-yield commission exceeding your baseline studio tier.`;
    budgetRationaleHindi = `आपके बेसलाइन स्टूडियो दर से अधिक आकर्षक कमर्शियल भुगतान।`;
  }

  let benchmarkBadge = "Standard Match";
  let benchmarkBadgeHindi = "सामान्य अवसर";
  if (isTopPick) {
    benchmarkBadge = "Top Studio Match (90%+)";
    benchmarkBadgeHindi = "सर्वश्रेष्ठ स्टूडियो मिलान (90%+)";
  } else if (isRecommended) {
    benchmarkBadge = "Strong Opportunity Match";
    benchmarkBadgeHindi = "उत्कृष्ट उपयुक्त अवसर";
  }

  // Matched tags
  const matchedTags: string[] = [];
  if (craftScore >= 70) matchedTags.push("Craft Aligned");
  if (proximityScore >= 85) matchedTags.push(isRemoteOrPanIndia ? "Pan-India Open" : "Local Direct");
  if (budgetScore >= 85) matchedTags.push("High Payout");
  if (artisan.isVerified) matchedTags.push("Master Verified");

  const factors: OpportunityMatchFactors = {
    craftScore,
    proximityScore,
    budgetScore,
    provenanceScore
  };

  return {
    opportunityId: opp.id,
    overallScore,
    factors,
    isTopPick,
    isRecommended,
    craftRationale,
    craftRationaleHindi,
    proximityRationale,
    proximityRationaleHindi,
    budgetRationale,
    budgetRationaleHindi,
    matchedTags,
    benchmarkBadge,
    benchmarkBadgeHindi
  };
}
