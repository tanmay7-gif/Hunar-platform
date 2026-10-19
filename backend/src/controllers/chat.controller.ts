import { Request, Response } from "express";

// In-memory / database seed store for in-app chat
let conversationsStore: any[] = [
  {
    id: "conv-rohit-priya",
    customerId: "cust-rohit",
    customerName: "Rohit Sharma",
    customerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    sellerId: "creator-priya",
    sellerName: "Priya Nair",
    sellerCity: "Bagru, Rajasthan",
    sellerCraft: "Dabu Block Printing & Natural Dyes",
    sellerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    productReference: {
      productId: "prod-saree-01",
      title: "Dabu Hand-Block Printed Chanderi Saree",
      price: 2450,
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&auto=format&fit=crop&q=80"
    },
    messages: [
      {
        id: "msg-1",
        senderId: "cust-rohit",
        text: "Namaste Priya ji! Can you customize this Dabu Chanderi Saree with a deep indigo border for a wedding in November?",
        createdAt: "2026-10-19T10:15:00Z"
      },
      {
        id: "msg-2",
        senderId: "creator-priya",
        text: "Namaste Rohit ji! Yes, we can naturally dye the border with pure alizarin and indigo mud-resist. The lead time will be 7 business days.",
        createdAt: "2026-10-19T10:20:00Z"
      }
    ],
    lastMessageAt: "2026-10-19T10:20:00Z",
    unreadCount: 0
  }
];

export class ChatController {
  public static async getConversations(req: Request, res: Response) {
    res.json({ success: true, count: conversationsStore.length, conversations: conversationsStore });
  }

  public static async getConversationById(req: Request, res: Response) {
    const { id } = req.params;
    const conversation = conversationsStore.find((c) => c.id === id);
    if (!conversation) {
      return res.status(404).json({ success: false, error: "Conversation not found" });
    }
    res.json({ success: true, conversation });
  }

  public static async sendMessage(req: Request, res: Response) {
    const { id } = req.params;
    const { senderId, text } = req.body;

    const conversation = conversationsStore.find((c) => c.id === id);
    if (!conversation) {
      return res.status(404).json({ success: false, error: "Conversation not found" });
    }

    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId,
      text,
      createdAt: new Date().toISOString()
    };

    conversation.messages.push(newMessage);
    conversation.lastMessageAt = newMessage.createdAt;

    res.json({ success: true, message: newMessage });
  }

  public static async createPaymentInvoice(req: Request, res: Response) {
    const { id } = req.params;
    const { amount, description } = req.body;

    const conversation = conversationsStore.find((c) => c.id === id);
    if (!conversation) {
      return res.status(404).json({ success: false, error: "Conversation not found" });
    }

    const invoiceMessage = {
      id: `inv-${Date.now()}`,
      senderId: conversation.sellerId,
      text: `Payment Invoice: ₹${amount} for ${description || conversation.productReference?.title || "Commission Artwork"}`,
      isPaymentCard: true,
      paymentData: {
        amount,
        status: "PENDING",
        orderId: `ORD-${Date.now().toString(36).toUpperCase()}`
      },
      createdAt: new Date().toISOString()
    };

    conversation.messages.push(invoiceMessage);
    res.json({ success: true, invoiceMessage });
  }
}
