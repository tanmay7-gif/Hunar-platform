import { Request, Response } from "express";
import { PayPalService } from "./paypal/paypal.service";
import { PaytmService } from "./paytm/paytm.service";
import {
  PayPalCreateOrderRequest,
  PayPalCaptureRequest,
  PaytmInitiateRequest,
  PaytmVerifyRequest,
} from "../models/types";

export let paymentsStore: any[] = [];

export class PaymentController {
  // Static delegations for testing & external module compatibility
  public static isDummyCredentials(): boolean {
    return PayPalService.isDummyCredentials();
  }

  public static isDummyPaytmCredentials(): boolean {
    return PaytmService.isDummyCredentials();
  }

  public static async getPayPalAccessToken(): Promise<string> {
    return PayPalService.getAccessToken();
  }

  /**
   * Create PayPal Sandbox Order (POST /api/payment/paypal/create-order)
   */
  public static async createPayPalOrder(req: Request<{}, {}, PayPalCreateOrderRequest>, res: Response) {
    try {
      const result = await PayPalService.createOrder(req.body);
      return res.status(200).json(result);
    } catch (error: any) {
      console.error("[PayPal Sandbox] Order creation error:", error);
      return res.status(500).json({
        success: false,
        error: error.message || "Failed to create PayPal order",
      });
    }
  }

  /**
   * Capture PayPal Sandbox Order (POST /api/payment/paypal/capture-order)
   */
  public static async capturePayPalOrder(req: Request<{}, {}, PayPalCaptureRequest>, res: Response) {
    try {
      const { orderID } = req.body;
      if (!orderID) {
        return res.status(400).json({
          success: false,
          error: "orderID is required to capture payment",
        });
      }

      const result = await PayPalService.captureOrder(orderID);
      if (result.payment) {
        paymentsStore.push(result.payment);
      }
      return res.status(200).json(result);
    } catch (error: any) {
      console.error("[PayPal Sandbox] Order capture error:", error);
      return res.status(500).json({
        success: false,
        error: error.message || "Failed to capture PayPal order",
      });
    }
  }

  /**
   * Initiate Paytm Staging Transaction (POST /api/payment/paytm/initiate)
   */
  public static async initiatePaytmTransaction(req: Request<{}, {}, PaytmInitiateRequest>, res: Response) {
    try {
      const result = await PaytmService.initiateTransaction(req.body);
      return res.status(200).json(result);
    } catch (error: any) {
      console.error("[Paytm Staging] Transaction initiate error:", error);
      return res.status(500).json({
        success: false,
        error: error.message || "Failed to initiate Paytm transaction",
      });
    }
  }

  /**
   * Verify Paytm Transaction (POST /api/payment/paytm/verify)
   */
  public static async verifyPaytmTransaction(req: Request<{}, {}, PaytmVerifyRequest>, res: Response) {
    try {
      const result = await PaytmService.verifyTransaction(req.body);
      if (result.payment) {
        paymentsStore.push(result.payment);
      }
      return res.status(200).json(result);
    } catch (error: any) {
      console.error("[Paytm Staging] Transaction verification error:", error);
      return res.status(500).json({
        success: false,
        error: error.message || "Failed to verify Paytm transaction",
      });
    }
  }

  /**
   * Generate Direct UPI Intent String & Deep Link
   */
  public static async generateUpiIntent(req: Request, res: Response) {
    try {
      const {
        amount = 1500,
        artisanUpiId = "hunar.artisan@upi",
        artisanName = "Hunar Studio Master",
        orderId = `HNR-${Date.now()}`,
      } = req.body;

      const pa = encodeURIComponent(artisanUpiId);
      const pn = encodeURIComponent(artisanName);
      const am = Number(amount).toFixed(2);
      const tr = encodeURIComponent(orderId);
      const tn = encodeURIComponent(`Hunar Order ${orderId}`);

      const upiUri = `upi://pay?pa=${pa}&pn=${pn}&am=${am}&cu=INR&tr=${tr}&tn=${tn}`;
      return res.json({
        success: true,
        upiUri,
        orderId,
        amount: Number(am),
        artisanUpiId,
        artisanName,
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Process Direct Payment Confirmation & Log History
   */
  public static async processPayment(req: Request, res: Response) {
    try {
      const { orderId, amount, method, transactionRef, customerId, sellerId } = req.body;
      const paymentRecord = {
        id: `pay-${Date.now()}`,
        orderId: orderId || `HNR-${Date.now()}`,
        amount: Number(amount) || 0,
        currency: "INR",
        method: method || "UPI_DIRECT",
        transactionRef: transactionRef || `TXN-${Date.now()}`,
        status: "PAID",
        customerId,
        sellerId,
        createdAt: new Date().toISOString(),
      };

      paymentsStore.push(paymentRecord);
      return res.json({
        success: true,
        message: "Payment confirmed successfully",
        payment: paymentRecord,
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Payment Audit History Retrieval
   */
  public static async getPaymentHistory(req: Request, res: Response) {
    return res.json({
      success: true,
      count: paymentsStore.length,
      payments: paymentsStore,
    });
  }
}
