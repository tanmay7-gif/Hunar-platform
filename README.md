# हुनर • HUNAR Platform
### Authentic Grassroots Artisan Monetization & Career Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.4-black.svg)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey.svg)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Hunar** is an authentic, hyper-local career and direct patronage platform purpose-built for India's grassroots creators: visual artists, Madhubani folk masters, Khurja ceramicists, Awadhi bridal henna artists, and large-scale muralists. 

It eliminates intermediary exploitation by guaranteeing **100% direct artisan equity**, transparent physical provenance tracking, WhatsApp-first client negotiations, and milestone-based commissions.

---

## 🏛️ Monorepo Architecture

The repository is organized as a clean, decoupled monorepo separating client presentation from core business logic:

```text
hunar-platform/
├── backend/
│   ├── src/
│   │   ├── config/           # Database connections, env setup, seed singletons
│   │   ├── controllers/      # Route logic & request handlers
│   │   ├── middleware/       # Auth validation, error handling, request logger
│   │   ├── models/           # Data schemas (Prisma & TypeScript interfaces)
│   │   ├── routes/           # REST endpoints / API routers
│   │   └── server.ts         # Express application entry point
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── public/               # Static assets, logos, craft lookbook media
│   ├── src/
│   │   ├── app/              # Next.js App Router (Public & Dashboard routes)
│   │   ├── components/
│   │   │   ├── ui/           # Tactile, physical UI elements (Button, Card, Input, Badge)
│   │   │   ├── customer/     # Customer modules (BazaarFeed, OrderTracker)
│   │   │   ├── seller/       # Seller modules (StudioHub, ProductUploader)
│   │   │   ├── dashboard/    # Differentiated Topbar & Sidebar layouts
│   │   │   └── Navbar.tsx    # Responsive header with dual-language toggle
│   │   ├── context/          # Global state (HunarContext) with persistent mock store
│   │   ├── lib/              # Client API helpers & craft dataset
│   │   └── types/            # TypeScript interfaces & domain models
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   └── tsconfig.json
├── .gitignore
├── package.json              # Monorepo workspace configuration
└── README.md
```

---

## 🎨 Craftsmanship-First Design System ("Anti-AI Slop")

Hunar strictly rejects generic template patterns (no purple-to-blue neon gradients, no floating pill badges, no three-box feature clones, and no glassmorphic blurs). The interface is grounded in tactile Indian materiality:

- **Palette**:
  - **Kohl Charcoal** (`#1E2229`): Deep mineral typography and grounded slate buttons.
  - **Raw Terracotta** (`#B4461F` / `#963716`): Primary accents, craftsmanship seals, and milestones.
  - **Forest Sage** (`#2D583B` / `#23452E`): WhatsApp channels, verified master badges, and customer action buttons.
  - **Matte Linen / Canvas** (`#F9F6F0` / `#FAF7F2`): Tactile card surfaces with subtle hairline borders (`#E8DEC8`).
- **Typography**:
  - **Headings**: Upright **Cinzel** and **Plus Jakarta Sans** (Weights 600/700).
  - **Body Copy**: Humanist **DM Sans** for high-density catalog specifications.
- **Physical Geometry**:
  - Structured `rounded-sm` corners with snappy `duration-150` transitions.

---

## 👥 Dual Persona Workflows

### 1. Seller / Artisan Experience (`/dashboard/seller/*`)
- **Studio Hub** (`/dashboard/seller`): Real-time metrics on catalog valuation, quote requests, and active gigs.
- **Craft Inventory** (`/dashboard/seller/products`): Inventory management with stock levels, lead times, and physical dimensions.
- **Listing Studio** (`/dashboard/seller/products/new`): Structured artwork publisher.
- **Client Leads & Boli** (`/dashboard/seller/inquiries`): Interactive commission workflow (*Under Review* ➔ *Crafting in Progress* ➔ *Dispatched* ➔ *Completed*).
- **Open Gigs Radar** (`/dashboard/seller/opportunities`): Commercial tenders and cafe facade commissions matched to artisan categories.
- **Kala Roadmap** (`/dashboard/seller/roadmap`): Practical 6-month earnings milestones and commercial pricing benchmarks.

### 2. Customer / Patron Experience (`/dashboard/customer/*`)
- **Curated Craft Bazaar** (`/dashboard/customer`): Regional feed filterable by medium (Pottery, Madhubani, Murals, Bridal Mehndi) and city.
- **Master Directory** (`/dashboard/customer/artisans`): Directory of grassroots masters with verification status and base rates.
- **Commission Tracker** (`/dashboard/customer/orders`): 4-stage visual timeline tracking raw pigment preparation to safe packaging.
- **Post a Requirement** (`/dashboard/customer/post-gig`): Patron curation desk to post custom wall mural or bulk gifting requirements.
- **Saved Moodboard** (`/dashboard/customer/wishlist`): Shortlisted artists and pieces for interior commissions.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher

### 1. Clone & Setup
```bash
git clone https://github.com/tanmay7-gif/Hunar-platform.git
cd Hunar-platform
```

### 2. Install Dependencies
Install root workspace dependencies, which automatically installs both frontend and backend:
```bash
npm install
```

### 3. Environment Setup
Create environment files from the examples:
```bash
# Frontend
cp frontend/.env.example frontend/.env.local

# Backend
cp backend/.env.example backend/.env
```

### 4. Running the Development Servers

#### Option A: Run Both Concurrently (Workspaces)
```bash
# Frontend (Next.js App on http://localhost:3000)
npm run dev:frontend

# Backend (Express API on http://localhost:5000)
npm run dev:backend
```

---

## 📡 REST API Reference

The backend exposes a structured REST API under `/api`:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate user or switch 1-click demo personas |
| `GET` | `/api/auth/me` | Fetch active session profile |
| `GET` | `/api/products` | Retrieve catalog artworks with category & city filters |
| `GET` | `/api/products/:id` | Fetch detailed artwork specifications and provenance |
| `POST` | `/api/products` | Publish new artwork to studio inventory |
| `GET` | `/api/creators` | Discover verified regional artisan profiles |
| `GET` | `/api/creators/:username`| Retrieve public Hunar Lookbook card |
| `GET` | `/api/inquiries` | Fetch customer/seller commission inquiries |
| `POST` | `/api/inquiries` | Submit custom commission brief |
| `PATCH`| `/api/inquiries/:id` | Update milestone progress and studio notes |
| `GET` | `/api/opportunities` | List open gigs and cafe mural tenders |
| `POST` | `/api/opportunities` | Post patron requirements to Gigs Radar |
| `GET` | `/api/stats` | Platform-wide artisan metrics & GMV statistics |
| `GET` | `/api/health` | Service health status check |

---

## 🔒 Security & Data Integrity
- Direct client-to-artisan WhatsApp routing prevents commission interception.
- Strict TypeScript schemas shared across frontend models and backend controllers.
- Cross-Origin Resource Sharing (CORS) restricted to authenticated frontend origin.

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
