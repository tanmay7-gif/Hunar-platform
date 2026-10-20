# Hunar Design System Specification (`DESIGN.md`)

*Extracted directly from high-fidelity reference screenshots in `frontend/public/design.refs/`.*

---

## Philosophy & Core Principles

The Hunar platform embodies an **artisanal, museum-grade editorial craft aesthetic**. It rejects generic, AI-generated tropes—such as saturated purple-blue gradients, heavy glassmorphic blurs, floating pill badges, and playful bubbly geometry—in favor of:

1. **Tactile Craft Heritage**: Textures and tones inspired by sun-baked terracotta clay, raw mineral gouache, unbleached handmade cotton rag, and kohl ink.
2. **Architectural Restraint**: Crisp, hairline borders (`1px`) and tight architectural corner radii (`2px`–`4px`) that frame artworks like physical gallery mats.
3. **Typographic Elegance**: Classical high-contrast serifs (*Newsreader*, *Cinzel*) for narrative titles, artist quotes, and curator notes, balanced with clean, neutral grotesk sans (*DM Sans*, *Plus Jakarta Sans*) for operational data, prices, and dimensions.
4. **Zero AI-Gimmicks**: No neon glows, no synthetic dropshadows, no floating badges. Depth is achieved through border hierarchy and subtle tonal contrast between canvas and surface.

---

## 1. Color Palette

Every color in this palette has been sampled directly from the production screens in `frontend/public/design.refs/`.

### 1.1 Canvas & Backgrounds (The Natural Ground)

| Token / Variable | Hex | RGB | Description & Usage |
| :--- | :--- | :--- | :--- |
| `canvas-linen` / `--canvas-linen` | `#F7F5EF` | `247, 245, 239` | **Primary Canvas Ground**. Used as the default body background for Home, Shop, Artwork Detail, Artist Story, and Auth screens. Soft warm unbleached paper tone. |
| `canvas-warm` / `--warm-linen` | `#FAF8F5` | `250, 248, 245` | **Soft Linen Variant**. Used for nested section backdrops and alternating sections. |
| `canvas-ochre` / `--mat-ochre` | `#F0E3C8` | `240, 227, 200` | **Museum Matting & Highlight Canvas**. Used for the hero showcase backdrop, artwork matting frames, category thumbnail bases, and filter badge pills. |
| `canvas-terracotta-tint` | `#EBD3CC` | `235, 211, 204` | **Blush Terracotta Wash**. Used for the 3rd pillar hero card ("Sell on Hunar") and subtle callout boxes. |

### 1.2 Surface & Cards (The Matting Layer)

| Token / Variable | Hex | RGB | Description & Usage |
| :--- | :--- | :--- | :--- |
| `surface-card` / `--surface-card` | `#FFFDF8` | `255, 253, 248` | **Default Card Surface**. Crisp, warm-ivory surface providing clean contrast against the `#F7F5EF` canvas. Used for product cards, specifications table, and auth inputs. |
| `surface-white` | `#FFFFFF` | `255, 255, 255` | **High-White Surface**. Used for form fields, active dropdown items, and dashboard inventory cards. |
| `surface-alt` / `--surface-alt` | `#FAF7F2` | `250, 247, 242` | **Subtle Card Contrast**. Used for alternating table rows, secondary info boxes, and cart item panels. |

### 1.3 Primary Brand & Action Colors

| Token / Variable | Hex | RGB | Description & Usage |
| :--- | :--- | :--- | :--- |
| `wine-primary` / `--wine-primary` | `#6E1F2E` | `110, 31, 46` | **High-Intent Primary Action**. Extracted from "Add to cart", "Continue to payment", "Create account", and "Add artwork" buttons. |
| `wine-hover` / `--wine-hover` | `#581723` | `88, 23, 35` | **Primary Action Hover State**. |
| `wine-deep` / `--wine-deep` | `#7A2828` | `122, 40, 40` | **Warm Wine Variant**. Used for hero promotional CTAs and checkout actions. |
| `terracotta` / `--terracotta` | `#C85A32` | `200, 90, 50` | **Brand Soul Accent**. Used for the Hunar seal mark, price accents, active navigation indicators, and artisan tags. |
| `terracotta-dark` | `#A33F1C` | `163, 63, 28` | **Terracotta Press/Active State**. |
| `terracotta-light` | `#FBF0EB` | `251, 240, 235` | **Terracotta Tag Ground**. Background for craft medium tags and verification pills. |

### 1.4 Neutrals & Typography Colors (Kohl & Charcoal)

| Token / Variable | Hex | RGB | Description & Usage |
| :--- | :--- | :--- | :--- |
| `kohl-plum` / `--kohl-plum` | `#2B1219` | `43, 18, 25` | **Deep Plum Kohl**. The dominant text color sampled across all headings, logo wordmarks, card titles, and dark footer blocks. |
| `kohl-charcoal` / `--kohl-charcoal` | `#1E2229` | `30, 34, 41` | **Solid Charcoal Dark**. Used for footer backgrounds, high-contrast dark buttons, and navigation bar text. |
| `kohl-muted` / `--kohl-muted` | `#5E4B4E` | `94, 75, 78` | **Secondary Muted Text**. Used for artist origin cities, artwork dimensions, specs labels, and breadcrumbs. |
| `kohl-light` / `--kohl-light` | `#8A8986` | `138, 137, 134` | **Tertiary Text / Placeholder**. Form input placeholders, character counts, and inactive tab headers. |

### 1.5 Hairline Borders & Dividers

| Token / Variable | Hex | RGB | Description & Usage |
| :--- | :--- | :--- | :--- |
| `sand-hairline` / `--sand-hairline` | `#E7E0D6` | `231, 224, 214` | **Standard Hairline Border**. 1px border framing cards, museum mats, navigation bottom edges, and table dividers. |
| `sand-border` / `--sand-border` | `#D4CDC3` | `212, 205, 195` | **Defined Border**. Outline buttons, search bar borders, and input strokes. |
| `sand-hover` | `#C8B8A6` | `200, 184, 166` | **Border Hover State**. Triggered on card and button hover. |
| `sand-subtle` | `#F0EFE8` | `240, 239, 232` | **Subtle Inner Divider**. Internal card separators and list dividers. |

### 1.6 Functional & Status Accents

| Token / Variable | Hex | RGB | Description & Usage |
| :--- | :--- | :--- | :--- |
| `turmeric-gold` | `#E5A93B` | `229, 169, 59` | Star ratings, certified artisan insignia, and special awards. |
| `turmeric-light` | `#FEF7E6` | `254, 247, 230` | Background for certified artisan badges. |
| `sage-green` | `#4E6E58` | `78, 110, 88` | "In Stock", "Ready to Ship", and order completed status. |
| `sage-light` | `#EEF4F0` | `238, 244, 240` | Background for active order status pills. |

---

## 2. Typography Hierarchy

### 2.1 Font Families

```css
/* Editorial serif for emotional impact and craft authenticity */
--font-serif: "Newsreader", "Cinzel", Georgia, Cambria, serif;

/* Precision sans-serif for UI controls, data tables, and metadata */
--font-sans: "DM Sans", "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

/* Native Nastaliq for Urdu / Kashmiri script */
--font-nastaliq: "Noto Nastaliq Urdu", Georgia, serif;
```

### 2.2 Complete Typographic Scale

| Level | Size (rem / px) | Weight | Line Height | Tracking | Font Family | Example Usage |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Display (h1)** | `2.75rem` / `44px` | 400 (Regular/Italic) | `1.15` | `-0.02em` | Serif | *"Art from the living rooms of India."* |
| **Section Title (h2)** | `2.0rem` / `32px` | 500 (Medium) | `1.25` | `-0.015em` | Serif | *"Curator's picks"*, *"The artisan's studio"* |
| **Card / Artwork Title (h3)** | `1.375rem` / `22px` | 500 (Medium) | `1.3` | `-0.01em` | Serif | *"The quiet courtyard"*, *"Earth & sky vase"* |
| **Subhead / Section Lead** | `1.125rem` / `18px` | 400 (Italic) | `1.5` | `0` | Serif | *"I paint the hours when the house is quiet..."* |
| **Body Large** | `1.0rem` / `16px` | 400 | `1.6` | `0` | Sans | Editorial artisan biographical paragraphs |
| **Body Regular** | `0.875rem` / `14px` | 400 | `1.55` | `0` | Sans | Form inputs, cart items, delivery notes |
| **UI Control / Button** | `0.875rem` / `14px` | 500 (Medium) | `1.0` | `0.01em` | Sans | Buttons ("Add to cart", "Filter", "Checkout") |
| **Metadata / Caption** | `0.75rem` / `12px` | 500 | `1.4` | `0.02em` | Sans | Artist location (`Jaipur, Rajasthan`), dimensions (`32 × 24 cm`) |
| **Micro Badge / Tag** | `0.65rem` / `10.5px` | 600 (Semibold) | `1.2` | `0.06em` | Sans | Uppercase craft pills (`WATERCOLOUR`, `CERAMIC`, `LANG: ENG`) |

---

## 3. Spacing & Elevation

### 3.1 Spacing Scale

Hunar follows an architectural spacing grid built upon multiples of `4px` (`0.25rem`):

| Token | Size (px / rem) | Common UI Usages |
| :--- | :--- | :--- |
| `space-1` | `4px` / `0.25rem` | Badge inline padding, indicator dots, tight icon gaps |
| `space-2` | `8px` / `0.5rem` | Input field gap, button icon offset, thumbnail row spacing |
| `space-3` | `12px` / `0.75rem` | Compact card padding, dropdown menu items |
| `space-4` | `16px` / `1.0rem` | Default container padding, form row spacing |
| `space-5` | `20px` / `1.25rem` | Card internal padding (product cards, cart rows) |
| `space-6` | `24px` / `1.5rem` | Standard section gaps, modal content padding |
| `space-8` | `32px` / `2.0rem` | Hero block padding, studio facts grid padding |
| `space-12`| `48px` / `3.0rem` | Major section vertical padding (`py-12`) |
| `space-16`| `64px` / `4.0rem` | Hero banner vertical padding (`py-16`) |

### 3.2 Responsive Grid Gaps

- **Shop Catalog Grid**: `gap-6` (`24px`) on tablet/desktop, `gap-4` (`16px`) on mobile.
- **Hero 3-Card Split**: `gap-4` (`16px`) to create an intimate gallery triptych.
- **Artwork Detail Page (2-Column)**: `gap-10` to `gap-14` (`40px`–`56px`) ensuring ample breathing space between image matting and narrative specifications.
- **Dashboard KPI Cards (3-Column)**: `gap-4` (`16px`).

### 3.3 Border Radii

Strict craft geometry:
- **Cards, Frames, & Mat Containers**: `2px`–`4px` (`rounded-sm` / `rounded`). Sharp, gallery-like framing.
- **Buttons & Form Inputs**: `2px`–`4px` (`rounded-sm`). Solid, grounded rectangular feel.
- **Category Filter Pills**: `9999px` (`rounded-full`) for quick tactile thumb-tapping.
- **User Avatar / Studio Profile**: `2px` (framed portrait) or `rounded-full` (nav status).

### 3.4 Elevation & Shadows

Depth in Hunar is **border-driven**, not shadow-driven. Shadows are faint and natural:

```css
/* Card at rest - clean hairline border, near-zero shadow */
.craft-card {
  border: 1px solid #E7E0D6;
  box-shadow: 0 1px 3px rgba(43, 18, 25, 0.02);
}

/* Card hover - subtle tactile lift */
.craft-card:hover {
  border-color: #C8B8A6;
  box-shadow: 0 4px 12px rgba(43, 18, 25, 0.05);
}

/* Modal dialog elevation */
.craft-modal {
  border: 1px solid #D4CDC3;
  box-shadow: 0 16px 32px -8px rgba(43, 18, 25, 0.12), 0 4px 8px -2px rgba(43, 18, 25, 0.04);
}
```

---

## 4. Component Patterns

### 4.1 Buttons

#### Primary Button (`.btn-wine` / `btn-primary`)
- **Background**: `#6E1F2E` (Deep Wine)
- **Hover**: `#581723`
- **Text**: `#FFFDF8` (Warm White), `0.875rem`, `font-medium`
- **Border**: None
- **Radius**: `2px`–`4px`
- **Padding**: `0.625rem 1.25rem` (`py-2.5 px-5`)
- **Usage**: Main conversion points ("Add to cart", "Continue to checkout", "Sign in").

#### Secondary / Outline Button (`.btn-craft-secondary`)
- **Background**: `transparent`
- **Hover**: `#F0E3C8` (Warm Ochre Wash)
- **Text**: `#2B1219` (Kohl Plum)
- **Border**: `1px solid #D4CDC3` (hover: `#C8B8A6`)
- **Radius**: `2px`–`4px`
- **Padding**: `0.625rem 1.25rem`
- **Usage**: Secondary actions ("Reset filters", "Download invoice", "Edit piece").

#### Dark Accent Button (`.btn-kohl`)
- **Background**: `#2B1219` / `#1E2229` (Kohl Charcoal)
- **Hover**: `#14171C`
- **Text**: `#FAF8F5`
- **Padding**: `0.625rem 1.25rem`
- **Usage**: Alternative primary action in high-contrast sections.

### 4.2 Card Borders & Matting Containers

1. **Standard Artwork Card**:
   - Background: `#FFFDF8`
   - Border: `1px solid #E7E0D6`
   - Image wrapper: Wrapped in `<ProtectedImage />` with museum ratio (`4:5` or `1:1`).
   - Bottom Info: Serif title, italic medium, price in bold, and subtle terracotta category tag.

2. **Museum Matting Container** (from Artwork Detail screen):
   - Outer container: `#F0E3C8` (Warm Ochre Sand) with `p-6` to `p-10`.
   - Inner frame: Pure white/warm linen mount with `1px solid #D4CDC3`.
   - Artwork viewport: Protected high-resolution image with subtle corner registration.

3. **Curator / Brand Highlight Cards**:
   - Card 1: Warm Linen `#F7F5EF` with wine CTA button.
   - Card 2: Ochre Sand `#F0E3C8` featuring studio ceramics.
   - Card 3: Blush Terracotta `#EBD3CC` for creator empowerment manifesto.

### 4.3 Navigation Headers

- **Background**: `#F7F5EF` with hairline bottom border `1px solid #E7E0D6`.
- **Height**: `64px` (`h-16`).
- **Brand Emblem**: Terracotta emblem tile (`#C85A32`) with handcrafted seal pattern, accompanied by serif wordmark `Hunar`.
- **Nav Links**: Sans-serif medium weight (`Shop art`, `Artist's story`, `Mentorship`, `Sell on Hunar` / `My dashboard`), hover state transition to terracotta.
- **Utility Group**:
  - Language indicator pill (`Lang: [Eng]`) with dropdown for Hindi and Telugu.
  - Cart status trigger with real-time count badge (`Cart (2)`).
  - User status indicator with avatar tile.

### 4.4 Modals & Drawer Overlays

- **Backdrop Overlay**: `rgba(30, 34, 41, 0.45)` backdrop (no artificial frosted glass blur, just crisp warm darkening).
- **Dialog Container**: Centered, max-width `480px` to `640px`.
- **Card Styling**: Background `#FFFDF8`, `1px solid #D4CDC3`, `rounded-sm`.
- **Header**: High-contrast serif title (`h3`), hairline divider `#E7E0D6`, minimalist close cross (`×`).
- **Content Area**: Generous `p-6` padding, form rows separated by `space-4`.
- **Footer**: Right-aligned buttons with outline "Cancel" and wine "Confirm / Pay".

---

## 5. Tailwind Configuration Reference

This design system is implemented in `frontend/tailwind.config.js` and `frontend/src/app/globals.css`.

All components across `src/app/` and `src/components/` must use these canonical token names rather than arbitrary hex values.
