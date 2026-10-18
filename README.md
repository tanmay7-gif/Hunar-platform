# हुनर • HUNAR
### Authentic, Hyper-Local Career & Monetization Platform for Indian Grassroots Artisans

**Hunar** is a full-stack web application purpose-built to eliminate middlemen, empower traditional craftspeople (Mithila/Madhubani painters, urban muralists, studio ceramicists, Awadhi bridal henna artists, and folk performers), and provide structured financial pathways to sustainable livelihood.

---

## 🎨 Visual Identity & "Vibecoded" Craft Aesthetics
- **Color Palette**:
  - Warm Raw Terracotta (`#C85A32` / `#A33F1C`)
  - Deep Indigo / Kohl (`#1E2229`)
  - Warm Parchment Canvas (`#FDFBF7` / `#F7F4EE`)
  - Subtle Turmeric Accents (`#E5A93B`)
  - Earthy Sage Green (`#2D583B` / `#EEF4F0`)
- **Typography**: Editorial header serifs (*Playfair Display*, *Cinzel*) paired with clean humanist sans-serif (*Plus Jakarta Sans*).
- **Vernacular Dual-Language Engine**: Seamless global English / हिन्दी toggle for terms like "कलाकार", "अवसर एवं बोलियां", "हुनर कार्ड", "कारीगर", "गुरु गिल्ड", "कला रोडमैप".

---

## 🚀 Core Features & User Flows

1. **Craft-First Onboarding Wizard (`/onboarding`)**:
   - 4-step progressive onboarding with craft specialization, location, vernacular language, experience level, and 6-month income goal.
   - Dynamic real-time calculation of order volume and recommended base rate.
   - Live Hunar Card lookbook preview and confetti celebration.

2. **The "Hunar Card" — Shareable Creator Profile (`/u/[username]`)**:
   - Tactile lookbook format resembling an artisanal craft seal.
   - Verified badge, craft medium, unit pricing rates (e.g. *Murals starting ₹160/sq ft*, *Bridal Henna from ₹3,500*).
   - WhatsApp direct inquiry integration (`wa.me/...`) with pre-formatted inquiry text.
   - Verified work gallery with client quotes and lightbox zoom.
   - Interactive "Request a Quote / Hire" commission modal.

3. **Opportunity Radar & Matching Board (`/opportunities`)**:
   - Live commercial gigs, cafe murals, packaging illustration tenders, and Dastkar artisan grants.
   - Automatic **"Matched For You"** badge computed from the logged-in creator's craft category.
   - Quick **"Apply / Express Interest"** modal with custom proposed bid rate (₹).
   - Client **"Post an Opportunity"** modal for cafes and design agencies.

4. **Kala Roadmap Engine (`/roadmap`)**:
   - Practical 6-month career progression trajectory (Month 1: Groundwork & Unit Pricing, Month 3: Commercial Retainers, Month 6: Scaled Crew & Agency Partnerships).
   - Real benchmark numbers (e.g., ₹15k–₹25k/mo to ₹85k–₹1.4L/mo).
   - Interactive, persistent checklist state saved in local storage.
   - Multi-craft switcher: Murals, Studio Pottery, Madhubani Folk Art, Bridal Mehndi.

5. **Guru / Mentorship Hub (`/mentors`)**:
   - 1-on-1 strategy sessions with National Awardees, master artisans, and design curators.
   - Explicit topics: *How to price bulk handicrafts for export*, *Corporate mural retainers*, *Converting process reels to paying clients*.
   - 1-click 30-min slot calendar selector and instant booking confirmation.

6. **Active Persona Switcher**:
   - Switch anytime between 6 distinct personas in the top bar:
     - *Rameshwar Jha* (Mithila / Madhubani Master Artisan)
     - *Ananya Sharma* (Jaipur Studio Ceramicist)
     - *Vikram Rathore* (Delhi NCR Urban Muralist)
     - *Shazia Parveen* (Lucknow Bridal Henna Artist)
     - *Siddharth Rao* (Blue Tokai Coffee Roasters Manager — Client)
     - *Laila Tyabji Office* (Dastkar Craft Collective — Client)

---

## 🛠️ Tech Stack & Database Models
- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS v4, Lucide Icons, Canvas Confetti.
- **Data & Schema**: Prisma Schema (`prisma/schema.prisma`) defining `User`, `Opportunity`, `Application`, `RoadmapStep`, `MentorshipSession`.
- **State Management**: `HunarContext` with local storage persistence and mock database seed.

## 🏃 Running the Application
The development server is actively running at:
`http://localhost:3000`
