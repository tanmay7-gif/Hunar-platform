import { Request, Response } from "express";

let paymentsStore: any[] = [];

export class PaymentController {
  public static async generateUpiIntent(req: Request, res: Response) {
    const { amount, sellerName, orderId } = req.body;
    const cleanSeller = (sellerName || "HunarArtisan").replace(/\s+/g, "");
    const upiUri = `upi://pay?pa=seller.hunar@upi&pn=${encodeURIComponent(cleanSeller)}&am=${amount}&cu=INR&tn=HunarOrder_${orderId || Date.now()}`;

    res.json({
      success: true,
      upiUri,
      amount,
      sellerUpiId: "seller.hunar@upi",
      instructions: "Scan with GPay, PhonePe, or Paytm to complete transaction."
    });
  }

  public static async processPayment(req: Request, res: Response) {
    const { orderId, amount, method, conversationId } = req.body;

    const transactionRef = `HNR-TXN-${Math.floor(10000 + Math.random() * 90000)}`;
    const paymentRecord = {
      id: `pay-${Date.now()}`,
      orderId: orderId || `ORD-${Date.now().toString(36).toUpperCase()}`,
      conversationId,
      amount: Number(amount),
      method: method || "UPI_QR",
      status: "PAID",
      transactionRef,
      createdAt: new Date().toISOString()
    };

    paymentsStore.push(paymentRecord);

    res.json({
      success: true,
      message: "Payment confirmed successfully",
      payment: paymentRecord,
      orderStatus: "Crafting in Progress"
    });
  }

  public static async getPaymentHistory(req: Request, res: Response) {
    res.json({ success: true, count: paymentsStore.length, payments: paymentsStore });
  }
}
