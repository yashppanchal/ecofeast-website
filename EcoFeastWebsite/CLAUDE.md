# CLAUDE.md — EcoFeast Nutrients Website

This file provides context for Claude (or any AI assistant) working on this codebase.

## AI Assistant Rules (ALWAYS FOLLOW)

1. **Always read context files before any task.** At the start of every session or task, read:
   - This file (`CLAUDE.md`)
   - `README.md`
   - `docs/reference-design.jsx` (if working on UI/design)
   - Any relevant component or controller file before modifying it

2. **Ask before making any changes.** Before editing, creating, or deleting any file:
   - Briefly describe what you plan to change and why
   - Wait for explicit user confirmation before proceeding
   - Do not make changes speculatively or "just to be safe"

3. **One change at a time.** Propose one logical change, confirm, then proceed. Do not batch unrelated changes.

## Project Overview

EcoFeast Nutrients Pvt. Ltd. is an Indian export company dealing in agricultural commodities and food products (onions, mangoes, rice, spices, etc.). This is their portfolio/display website designed to build trust with international buyers.

## Tech Stack

- **Frontend:** React 18 + Vite + Tailwind CSS + React Router DOM
- **Backend:** .NET 8 Web API + Entity Framework Core
- **Database:** PostgreSQL
- **Auth:** JWT (BCrypt password hashing)
- **Map:** react-simple-maps (TopoJSON world map)
- **Deployment:** Railway (Docker multi-stage build)

## Architecture

```
React (Vite dev on :5173)  →  /api proxy  →  .NET API (:5000)  →  PostgreSQL
                                                  ↑
                                          JWT auth for admin
```

In production, React is built into static files and served from .NET's `wwwroot/` — single container on Railway.

## Key Design Decisions

- **Single API call for frontend:** `GET /api/public/sitedata` returns stats, products, strengths, and settings all at once. This avoids waterfall requests on page load.
- **Fallback data in App.jsx:** If the API is down, the React app renders with hardcoded data so the frontend can be developed independently.
- **Seed data:** `DbSeeder.cs` populates all initial data on first migration. Default admin: `admin` / `EcoFeast@2025`.
- **Configurable hero design:** `HERO_DESIGN = 'Design1' | 'Design2'` in HeroSection.jsx. Design2 = botanical leaves + falling leaves.
- **Configurable product layout:** `PRODUCT_LAYOUT = 'scrollable' | 'grid-card'` in ProductsSection.jsx. Scrollable = tabs + horizontal scroll cards, Grid-card = bento/masonry grid.
- **Image storage:** Uses `IStorageService` interface (currently `LocalStorageService` saving to `wwwroot/uploads/`). Swap to `CloudinaryStorageService` with one line change in Program.cs.
- **FormFields extracted outside components:** Prevents React remounting/focus loss on state change (learned fix from AdminProducts/AdminStrengths bug).

## Brand & Design

- **Color palette:** Dark forest green (`#0C1A0A`) + Gold (`#C9A96E`) + Cream (`#E8E0D0`)
- **Fonts:** Playfair Display (headings) + DM Sans (body)
- **Aesthetic:** Premium, organic, trust-building. Inspired by https://www.theweddingcompany.com/ (elegant hero, big stat counters, smooth scroll)
- **Reference files in `/docs`:** Business cards, company profile brochure, original JSX prototype

## Folder Structure

```
EcoFeast.API/
  Controllers/     → PublicController (no auth), AuthController, AdminController (JWT)
  Models/          → EF Core entities (Entities.cs: StatCounter, Product, Strength, ContactInquiry, AdminUser, SiteSetting)
  DTOs/            → Request/response records (Dtos.cs)
  Data/            → AppDbContext + DbSeeder
  Services/        → TokenService (JWT), EmailService (MailKit SMTP), IStorageService + LocalStorageService (image upload)
  wwwroot/uploads/ → Uploaded product images stored here

EcoFeast.Client/src/
  components/      → One component per section (HeroSection, ProductsSection, ProductCard, WorldMap, etc.)
  admin/           → Admin panel pages (AdminProducts, AdminStats, AdminStrengths, AdminInquiries, AdminSettings, AdminUsers, AdminLayout, AdminLogin, AdminDashboard)
  hooks/           → useInView (intersection observer), useCounter (animated numbers)
  services/        → api.js (axios client with all endpoints including uploadImage)
  styles/          → Tailwind + custom keyframe animations (index.css)
```

## Entity Models

| Entity          | Purpose                                                          |
|-----------------|------------------------------------------------------------------|
| StatCounter     | Hero numbers (trades, buyers, countries, products)               |
| Product         | Product catalog: name, hsCode, category, emoji, imageUrl, description, price, currency, isActive, displayOrder |
| Strength        | USP/competitive advantage cards                                  |
| ContactInquiry  | Form submissions from visitors                                   |
| AdminUser       | Admin authentication (username, passwordHash, email)             |
| SiteSetting     | Key-value pairs (phone, email, tagline, etc.)                    |

## API Endpoints Summary

**Public (no auth):**
- `GET  /api/public/sitedata` — all frontend data (stats, products, strengths, settings)
- `POST /api/public/contact` — submit inquiry (sends email notification)

**Auth:**
- `POST /api/auth/login` — returns JWT

**Admin (Bearer token):**
- CRUD on `/api/admin/stats`, `/api/admin/products`, `/api/admin/strengths`
- `POST /api/admin/upload?folder=products` — image upload (multipart/form-data, max 5MB, returns `{ url }`)
- Read `/api/admin/inquiries`, mark read `/api/admin/inquiries/{id}/read`
- Update `/api/admin/settings`
- CRUD on `/api/admin/users` — user management (create, list, delete)
- `PUT /api/admin/users/change-password` — change own password

## Configurable Toggles

| Toggle | File | Values | Purpose |
|--------|------|--------|---------|
| `HERO_DESIGN` | `HeroSection.jsx` line ~top | `'Design1'` \| `'Design2'` | Hero background style |
| `PRODUCT_LAYOUT` | `ProductsSection.jsx` line 7 | `'scrollable'` \| `'grid-card'` | Product cards layout |

## Running Locally

1. PostgreSQL running with `ecofeast_db` database created
2. `dotnet run` in EcoFeast.API (or F5 in Visual Studio) — runs on :5000
3. `npm run dev` in EcoFeast.Client — runs on :5173 with proxy to :5000
4. After model changes: `dotnet ef database update` in EcoFeast.API

## Environment Variables

**API (.env.local / Railway):**
- `DATABASE_URL` — PostgreSQL connection (Railway format: `postgresql://user:pass@host:port/db`)
- `JWT_KEY` — JWT signing key
- `EMAIL_SMTP_HOST`, `EMAIL_SMTP_PORT`, `EMAIL_SENDER_EMAIL`, `EMAIL_SENDER_PASSWORD`, `EMAIL_NOTIFY_EMAIL`

**Client (.env.local):**
- `VITE_API_URL` — API base URL (defaults to `/api` via Vite proxy)

## What Needs Building Next

- [x] Admin panel UI (React pages behind login)
- [x] Image upload for products (local storage with IStorageService interface)
- [x] Email notification on new contact inquiry (MailKit + Gmail SMTP)
- [x] Product pricing with multi-currency support (USD, EUR, GBP, INR, AED)
- [x] Configurable product card layouts (scrollable / grid-card)
- [x] World map with react-simple-maps
- [x] Admin user management (create, change password, delete)
- [x] Botanical hero design (Design2 with leaves + falling leaves)
- [ ] Switch to Cloudinary for image storage (when Railway ephemeral FS is an issue)
- [ ] SEO meta tags per section
- [ ] Analytics integration
- [ ] Testimonials/client logos section
- [ ] Blog/news section for export updates

## Company Details (for reference)

- **Company:** EcoFeast Nutrients Pvt. Ltd.
- **Directors:** Kaustubh Chavan (+91 96531 56090), Chaitanya Asarkar (+91 83692 95601)
- **Email:** ecofeastnutrients@gmail.com
- **Notify Emails:** ecofeastnutrients@gmail.com, yashppanchal.work@gmail.com
- **Address:** B 504, Navbhagyashree, Mahatma Phule Road, Mulund(E), Mumbai - 81
- **Certifications:** FSSAI, APEDA (RCMC), IEC, GST, PAN
- **Products:** 11 items across Fresh Vegetables, Fresh Fruits, Cereals, Spices, Processed Foods, Frozen
- **Target Markets:** Africa, Middle East, Europe, USA, South America, Asia
- **Tagline:** "Premium by Nature. Powerful by Supply."
