import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  databaseUrl: process.env.DATABASE_URL || "",
  jwtSecret: process.env.JWT_SECRET || "hunar_default_secret_key",
  // PayPal Developer Platform (Sandbox API v2)
  PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID || "",
  PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET || "",
  PAYPAL_API_BASE: process.env.PAYPAL_API_BASE || "https://api-m.sandbox.paypal.com",
  paypal: {
    clientId: process.env.PAYPAL_CLIENT_ID || "",
    clientSecret: process.env.PAYPAL_CLIENT_SECRET || "",
    apiBase: process.env.PAYPAL_API_BASE || "https://api-m.sandbox.paypal.com",
  },
  // Channel3 Product Data API
  CHANNEL3_API_KEY: process.env.CHANNEL3_API_KEY || "",
  CHANNEL3_API_BASE: process.env.CHANNEL3_API_BASE || "https://api.trychannel3.com/v1",
  channel3: {
    apiKey: process.env.CHANNEL3_API_KEY || "",
    apiBase: process.env.CHANNEL3_API_BASE || "https://api.trychannel3.com/v1",
  },
};
