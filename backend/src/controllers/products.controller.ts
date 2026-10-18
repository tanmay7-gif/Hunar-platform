import { Request, Response } from "express";
import { db } from "../config/db";

export const ProductsController = {
  getAll: (req: Request, res: Response) => {
    try {
      const { category, city, status, search } = req.query;
      let products = db.getProducts();

      if (category && category !== "All") {
        products = products.filter(
          (p) => p.category.toLowerCase() === String(category).toLowerCase()
        );
      }

      if (city && city !== "All") {
        products = products.filter((p) =>
          p.sellerCity.toLowerCase().includes(String(city).toLowerCase())
        );
      }

      if (status) {
        products = products.filter((p) => p.status === status);
      }

      if (search) {
        const q = String(search).toLowerCase();
        products = products.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.sellerName.toLowerCase().includes(q)
        );
      }

      return res.status(200).json(products);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to fetch products";
      return res.status(500).json({ error: message });
    }
  },

  getById: (req: Request, res: Response) => {
    const { id } = req.params;
    const product = db.getProductById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    return res.status(200).json(product);
  },

  create: (req: Request, res: Response) => {
    try {
      const {
        title,
        titleHindi,
        description,
        price,
        category,
        images,
        leadTime,
        stock,
        deliveryFormat,
        status,
        dimensions,
        material,
        sellerId,
        sellerName,
        sellerCity,
        sellerAvatar,
        sellerPhone,
        sellerWhatsapp,
        sellerVerified,
      } = req.body;

      if (!title || !price || !category) {
        return res.status(400).json({ error: "Title, price, and category are required" });
      }

      const newProduct = db.createProduct({
        title,
        titleHindi,
        description: description || "Authentic handcrafted regional piece.",
        price: Number(price),
        category,
        images: images && images.length > 0 ? images : ["https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80"],
        leadTime: leadTime || "Ready to ship",
        stock: stock ? Number(stock) : 1,
        deliveryFormat: deliveryFormat || "Physical Artwork",
        status: status || "Live",
        dimensions,
        material,
        sellerId: sellerId || "user-rohit-seller",
        sellerName: sellerName || "Rohit Sharma",
        sellerCity: sellerCity || "Khurja / Delhi NCR",
        sellerAvatar: sellerAvatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
        sellerPhone: sellerPhone || "+91 98118 76543",
        sellerWhatsapp: sellerWhatsapp || "919811876543",
        sellerVerified: sellerVerified ?? true,
      });

      return res.status(201).json(newProduct);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create product";
      return res.status(500).json({ error: message });
    }
  },
};
