import "./server";

async function runTests() {
  console.log("=== Running PayPal Integration Tests ===");
  // Wait a brief moment for the express server to start
  await new Promise((r) => setTimeout(r, 800));

  const baseUrl = `http://localhost:5000/api/payment`;

  try {
    // 1. Test Create PayPal Order (with INR amount)
    console.log("\n[TEST 1] Testing POST /paypal/create-order with INR amount...");
    const createRes = await fetch(`${baseUrl}/paypal/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: 2450,
        currency: "INR",
        orderId: "HNR-TEST-001",
        description: "Custom Terracotta Vase Commission",
      }),
    });

    const createData = (await createRes.json()) as any;
    console.log("Create Order Response Status:", createRes.status);
    console.log("Create Order Response Body:", JSON.stringify(createData, null, 2));

    if (!createData.success || !createData.orderID) {
      throw new Error("Create order test failed: orderID missing or success is false");
    }
    if (createData.currency !== "USD") {
      throw new Error(`Expected currency USD, got ${createData.currency}`);
    }
    if (Math.abs(createData.amount - 28.82) > 0.1) {
      throw new Error(`Expected amount around 28.82 USD, got ${createData.amount}`);
    }
    if (createData.inrEquivalent !== 2450) {
      throw new Error(`Expected inrEquivalent 2450, got ${createData.inrEquivalent}`);
    }
    console.log("✓ TEST 1 PASSED: Order created successfully with currency conversion.");

    // 2. Test Create PayPal Order (direct USD)
    console.log("\n[TEST 2] Testing POST /paypal/create-order with direct USD amount...");
    const createUsdRes = await fetch(`${baseUrl}/paypal/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: 45.0,
        currency: "USD",
        orderId: "HNR-TEST-002",
      }),
    });
    const createUsdData = (await createUsdRes.json()) as any;
    if (!createUsdData.success || createUsdData.amount !== 45) {
      throw new Error("Create direct USD order test failed");
    }
    console.log("✓ TEST 2 PASSED: Direct USD order created successfully.");

    // 3. Test Capture PayPal Order
    console.log("\n[TEST 3] Testing POST /paypal/capture-order with generated orderID...");
    const captureRes = await fetch(`${baseUrl}/paypal/capture-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderID: createData.orderID,
        conversationId: "conv-12345",
        orderId: "HNR-TEST-001",
      }),
    });

    const captureData = (await captureRes.json()) as any;
    console.log("Capture Order Response Status:", captureRes.status);
    console.log("Capture Order Response Body:", JSON.stringify(captureData, null, 2));

    if (!captureData.success || captureData.status !== "COMPLETED") {
      throw new Error("Capture order test failed: status is not COMPLETED");
    }
    if (!captureData.captureId || !captureData.transactionRef) {
      throw new Error("Capture order test failed: captureId or transactionRef missing");
    }
    console.log("✓ TEST 3 PASSED: PayPal Order captured successfully.");

    // 4. Test Payment History Reflection
    console.log("\n[TEST 4] Testing GET /history to verify payment record reflection...");
    const historyRes = await fetch(`${baseUrl}/history`);
    const historyData = (await historyRes.json()) as any;
    console.log("History Count:", historyData.count);

    const loggedPayment = historyData.payments.find(
      (p: any) => p.paypalOrderId === createData.orderID || p.method === "PAYPAL"
    );

    if (!loggedPayment) {
      throw new Error("PayPal payment was not found in payments history store");
    }
    if (loggedPayment.status !== "PAID" || loggedPayment.method !== "PAYPAL") {
      throw new Error("PayPal payment record fields invalid");
    }
    console.log("Found Logged PayPal Payment in Store:", loggedPayment);
    console.log("✓ TEST 4 PASSED: Payment logged in platform history store.");

    console.log("\n🎉 ALL 4 PAYPAL INTEGRATION TESTS PASSED PERFECTLY!\n");
    setTimeout(() => {
      process.exit(0);
    }, 100);
  } catch (err) {
    console.error("Test failed:", err);
    process.exit(1);
  }
}

runTests();
