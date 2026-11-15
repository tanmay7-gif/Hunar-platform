import { PaymentController } from "./controllers/payment.controller";

async function runPaytmTests() {
  console.log("=== Testing Paytm Staging Integration ===");

  const testOrderId = `TEST-PTM-${Date.now()}`;
  const testAmount = 2450;

  // 1. Test Transaction Initiation
  console.log("\n[Test 1] Initiating Paytm Staging Transaction...");
  let initiateResult: any = null;

  const mockReqInitiate: any = {
    body: {
      orderId: testOrderId,
      amount: testAmount,
      customerId: "CUST-TEST-123",
      customerPhone: "9876543210",
      customerEmail: "patron@hunar.art",
    },
  };

  const mockResInitiate: any = {
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(data: any) {
      initiateResult = data;
      return this;
    },
  };

  await PaymentController.initiatePaytmTransaction(mockReqInitiate, mockResInitiate);

  console.log("Initiate Status Code:", mockResInitiate.statusCode || 200);
  console.log("Initiate Response:", {
    success: initiateResult?.success,
    orderId: initiateResult?.orderId,
    amount: initiateResult?.amount,
    hasToken: Boolean(initiateResult?.txnToken),
    txnTokenPreview: initiateResult?.txnToken?.slice(0, 24) + "...",
    isMock: initiateResult?.isMock,
  });

  if (!initiateResult?.txnToken) {
    throw new Error("Paytm initiation did not return a txnToken!");
  }

  // 2. Test Transaction Verification
  console.log("\n[Test 2] Verifying Paytm Staging Transaction...");
  let verifyResult: any = null;

  const mockReqVerify: any = {
    body: {
      orderId: testOrderId,
      txnToken: initiateResult.txnToken,
      amount: testAmount,
      conversationId: "conv-test-99",
    },
  };

  const mockResVerify: any = {
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(data: any) {
      verifyResult = data;
      return this;
    },
  };

  await PaymentController.verifyPaytmTransaction(mockReqVerify, mockResVerify);

  console.log("Verify Status Code:", mockResVerify.statusCode || 200);
  console.log("Verify Response:", {
    success: verifyResult?.success,
    status: verifyResult?.status,
    orderId: verifyResult?.orderId,
    txnId: verifyResult?.txnId,
    bankTxnId: verifyResult?.bankTxnId,
    paymentMode: verifyResult?.paymentMode,
    isMock: verifyResult?.isMock,
  });

  if (verifyResult?.status !== "TXN_SUCCESS") {
    throw new Error(`Paytm verification returned unexpected status: ${verifyResult?.status}`);
  }

  console.log("\n✅ All Paytm Gateway Staging unit tests PASSED successfully!");
}

runPaytmTests().catch((err) => {
  console.error("❌ Paytm Test Failed:", err);
  process.exit(1);
});

