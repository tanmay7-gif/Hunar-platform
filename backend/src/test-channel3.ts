import "./server";

async function runTests() {
  console.log("=== Running Channel3 Integration Tests ===");
  await new Promise((r) => setTimeout(r, 800));

  const baseUrl = "http://localhost:5000/api/channel3";

  try {
    // 1. Test POST /api/channel3/valuation
    console.log("\n[TEST 1] Testing POST /valuation for Terracotta Vase...");
    const valRes = await fetch(`${baseUrl}/valuation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: "Hand-burnished Khurja Terracotta Vase",
        category: "Terracotta & Pottery",
        costOfMaterials: 650,
        hoursToCraft: 8,
        currency: "INR",
      }),
    });

    const valData = (await valRes.json()) as any;
    console.log("Valuation Response Status:", valRes.status);
    console.log("Valuation Result:", JSON.stringify(valData.valuation, null, 2));

    if (!valData.success || !valData.valuation) {
      throw new Error("Valuation test failed: success is false or valuation missing");
    }

    const { valuation } = valData;
    if (!valuation.benchmarks || valuation.benchmarks.length === 0) {
      throw new Error("Valuation benchmarks missing or empty");
    }
    if (valuation.averageMarketPrice <= 0) {
      throw new Error("Invalid averageMarketPrice");
    }
    if (valuation.suggestedOptimalPrice <= valuation.averageMarketPrice) {
      throw new Error("Optimal price should command an authenticity premium over commercial retail price");
    }
    if (valuation.artisanWageProtection.floorWage <= 0) {
      throw new Error("Artisan floor wage must be positive");
    }
    console.log("✓ TEST 1 PASSED: Valuation calculated successfully with living wage floor and craft premium.");

    // 2. Test POST /api/channel3/search
    console.log("\n[TEST 2] Testing POST /search for Pashmina Shawls...");
    const searchRes = await fetch(`${baseUrl}/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: "Handwoven Pashmina Shawl",
        category: "Handloom & Textiles",
        limit: 3,
      }),
    });

    const searchData = (await searchRes.json()) as any;
    console.log("Search Response Status:", searchRes.status);
    console.log("Search Products Count:", searchData.count);

    if (!searchData.success || !Array.isArray(searchData.products) || searchData.products.length === 0) {
      throw new Error("Search test failed: products missing or empty");
    }
    console.log("✓ TEST 2 PASSED: Channel3 commercial products retrieved successfully.");

    // 3. Test GET /api/channel3/trends
    console.log("\n[TEST 3] Testing GET /trends for Market Intelligence Bar...");
    const trendsRes = await fetch(`${baseUrl}/trends`);
    const trendsData = (await trendsRes.json()) as any;
    console.log("Trends Response Status:", trendsRes.status);
    console.log("Trends Count:", trendsData.count);

    if (!trendsData.success || !Array.isArray(trendsData.trends) || trendsData.trends.length < 3) {
      throw new Error("Trends test failed: trends missing or insufficient");
    }
    console.log("Sample Trend Metric:", trendsData.trends[0]);
    console.log("✓ TEST 3 PASSED: Channel3 platform-wide market trends retrieved successfully.");

    console.log("\n🎉 ALL CHANNEL3 INTEGRATION TESTS PASSED PERFECTLY!\n");
    setTimeout(() => {
      process.exit(0);
    }, 100);
  } catch (err) {
    console.error("Channel3 Test failed:", err);
    process.exit(1);
  }
}

runTests();

