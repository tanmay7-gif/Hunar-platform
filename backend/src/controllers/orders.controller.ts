import { Request, Response } from "express";

let ordersStore: any[] = [
  {
    id: "ord-8921",
    customerId: "cust-rohit",
    customerName: "Rohit Sharma",
    sellerId: "creator-priya",
    sellerName: "Priya Nair",
    productTitle: "Dabu Hand-Block Printed Chanderi Saree",
    amount: 2450,
    status: "Crafting in Progress",
    paidAt: "2026-10-19T10:30:00Z",
    deliveryTimeline: "Dispatches within 7 days",
    transactionId: "HNR-TXN-89214"
  }
];

export class OrdersController {
  public static async getOrders(req: Request, res: Response) {
    res.json({ success: true, count: ordersStore.length, orders: ordersStore });
  }

  public static async updateOrderStatus(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = req.body;
    const order = ordersStore.find((o) => o.id === id);
    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }
    order.status = status;
    res.json({ success: true, order });
  }
}
