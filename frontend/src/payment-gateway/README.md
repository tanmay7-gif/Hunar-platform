# 💳 Hunar Payment Gateway Architecture (Paytm & PayPal)

This module provides a unified, production-ready payment integration for the **Hunar** artisan marketplace. It powers two core financial channels:
1. **Domestic Checkout (INR):** **Paytm Payment Gateway (Staging / Sandbox)** with integrated UPI QR, Paytm Wallet, and NetBanking/Card sub-methods.
2. **International Patron Checkout (USD):** **PayPal Developer Platform (Sandbox REST API v2)** with automated INR-to-USD conversion and smart button capture.

---

## 📂 Repository Directory Layout

```
payment-gateway/
├── README.md                           # This architecture documentation
│
frontend/src/payment-gateway/
├── index.ts                            # Clean barrel export for frontend
├── types.ts                            # Core payment types & interfaces
├── components/
│   ├── PaymentModal.tsx                # Unified 2-tab direct negotiation checkout modal
│   └── QRCodeDisplay.tsx               # Deterministic SVG UPI QR code generator
├── paytm/
│   ├── index.ts                        # Paytm client barrel
│   ├── types.ts                        # Paytm request/response types
│   └── paytm.client.ts                 # Client helper functions (initiate, verify, simulate)
└── paypal/
    ├── index.ts                        # PayPal client barrel
    ├── types.ts                        # PayPal REST v2 types
    └── paypal.client.ts                # Client helpers (inrToUsd, createOrder, captureOrder)

backend/src/payment-gateway/
├── index.ts                            # Clean barrel export for backend
├── payment.controller.ts               # Express payment controller
├── payment.routes.ts                   # Express payment router (/api/payment/*)
├── paytm/
│   ├── index.ts                        # Paytm service barrel
│   ├── paytm.checksum.ts               # SHA256 / HMAC checksum generation & validation
│   └── paytm.service.ts                # Transaction initiation & status check logic
└── paypal/
    ├── index.ts                        # PayPal service barrel
    └── paypal.service.ts               # OAuth token caching, order creation & capture
```

---

## 🇮🇳 1. Paytm Payment Gateway (Staging / Sandbox)

The Paytm module connects to the official Paytm Staging Gateway (`securegw-stage.paytm.in`) using merchant test credentials and SHA256 HMAC checksums.

### Payment Flow
```
[User Selects Sub-Method: UPI QR / Wallet / Card]
                       │
                       ▼
POST /api/payment/paytm/initiate
   ├── Computes SHA256 HMAC signature using PAYTM_MERCHANT_KEY
   ├── Calls Paytm /theia/api/v1/initiateTransaction
   └── Returns txnToken & order details
                       │
                       ▼
[Customer Completes Payment / Simulation]
                       │
                       ▼
POST /api/payment/paytm/verify (or /api/payment/paytm/simulate)
   ├── Queries /v3/order/status with signature verification
   ├── Updates transaction history in persistent store
   └── Transitions order state to "Crafting in Progress"
```

### Endpoints
| Route | Method | Description |
|---|---|---|
| `/api/payment/paytm/initiate` | `POST` | Generates a staging `txnToken` with SHA256 signature |
| `/api/payment/paytm/verify` | `POST` | Verifies payment completion with Paytm Staging servers |
| `/api/payment/paytm/simulate` | `POST` | Instant test fallback for offline hackathon evaluation |

### Supported Sub-Methods
- **Paytm UPI:** Live NPCI-compliant UPI URI (`upi://pay?pa=...`) rendered into an interactive QR code with one-click UPI ID copying.
- **Paytm Wallet:** Dedicated simulation wallet with pre-funded patron balance and instant debit authorization.
- **NetBanking & Cards:** Form inputs supporting RuPay, Visa, and major Indian banking institutions.

---

## 🌐 2. PayPal Developer Platform (Sandbox REST API v2)

The PayPal module enables cross-border art patrons to sponsor, commission, and purchase master artisan goods in USD using PayPal Smart Buttons or direct sandbox checkout.

### Currency Conversion
Artisan products in Hunar are listed in Indian Rupees (INR). When the patron switches to the **PayPal Sandbox** tab, the frontend dynamically calculates the equivalent USD amount using real-time rounding:
```typescript
usdAmount = (inrAmount / 86.5).toFixed(2);
```

### Payment Flow
```
[Patron Opens PayPal Tab]
          │
          ▼
POST /api/payment/paypal/create-order
   ├── Obtains OAuth2 access_token from /v1/oauth2/token (cached in memory)
   ├── Submits order payload to /v2/checkout/orders with intent: "CAPTURE"
   └── Returns PayPal order ID and approval link
          │
          ▼
[Patron Approves in PayPal Sandbox Popup]
          │
          ▼
POST /api/payment/paypal/capture-order
   ├── Executes server-side capture at /v2/checkout/orders/{id}/capture
   ├── Records transactionRef in ledger
   └── Dispatches confirmation receipt into in-app chat
```

### Endpoints
| Route | Method | Description |
|---|---|---|
| `/api/payment/paypal/create-order` | `POST` | Creates a v2 Sandbox Checkout order in USD |
| `/api/payment/paypal/capture-order` | `POST` | Captures funds server-side and logs transaction |

---

## 🧪 Evaluator & Judge Simulator Mode

For seamless live demonstrations at hackathons and judging sessions where network connectivity or external sandboxes may be restricted:
1. **Paytm Staging Simulator:** If merchant keys are omitted or the upstream Paytm staging server is unreachable, the system automatically activates the **Sandbox Simulator**, issuing valid test tokens and recording verified transactions.
2. **PayPal Mock Mode:** If PayPal client credentials are dummy or unconfigured, the checkout modal renders a sandbox testing card allowing instant mock capture with full receipt generation.
