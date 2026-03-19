# CLAUDE.md — EcoFeast Nutrients Website

This file provides context for Claude (or any AI assistant) working on this codebase.

## Project Overview

EcoFeast Nutrients Pvt. Ltd. is an Indian export company dealing in agricultural commodities and food products (onions, mangoes, rice, spices, etc.). This is their portfolio/display website designed to build trust with international buyers.

## Tech Stack

- **Frontend:** React 18 + Vite + Tailwind CSS (no routing library yet — single page)
- **Backend:** .NET 8 Web API + Entity Framework Core
- **Database:** PostgreSQL
- **Auth:** JWT (BCrypt password hashing)
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
- **No admin panel UI yet:** Stats are updated via API (Swagger/cURL) or direct SQL for now. Admin panel is planned.

## Brand & Design

- **Color palette:** Dark forest green (`#0C1A0A`) + Gold (`#C9A96E`) + Cream (`#E8E0D0`)
- **Fonts:** Playfair Display (headings) + DM Sans (body)
- **Aesthetic:** Premium, organic, trust-building. Inspired by https://www.theweddingcompany.com/ (elegant hero, big stat counters, smooth scroll)
- **Reference files in `/docs`:** Business cards, company profile brochure, original JSX prototype

## Folder Structure

```
EcoFeast.API/
  Controllers/     → PublicController (no auth), AuthController, AdminController (JWT)
  Models/          → EF Core entities (StatCounter, Product, Strength, ContactInquiry, AdminUser, SiteSetting)
  DTOs/            → Request/response records
  Data/            → AppDbContext + DbSeeder
  Services/        → TokenService (JWT generation)

EcoFeast.Client/src/
  components/      → One component per section (HeroSection, ProductsSection, etc.)
  hooks/           → useInView (intersection observer), useCounter (animated numbers)
  services/        → api.js (axios client with all endpoints)
  styles/          → Tailwind + custom keyframe animations
```

## Entity Models

| Entity          | Purpose                                        |
|-----------------|------------------------------------------------|
| StatCounter     | Hero numbers (trades, buyers, countries, products) |
| Product         | Product catalog with HS codes and categories   |
| Strength        | USP/competitive advantage cards                |
| ContactInquiry  | Form submissions from visitors                 |
| AdminUser       | Admin authentication                           |
| SiteSetting     | Key-value pairs (phone, email, tagline, etc.)  |

## API Endpoints Summary

**Public (no auth):**
- `GET  /api/public/sitedata` — all frontend data
- `POST /api/public/contact` — submit inquiry

**Auth:**
- `POST /api/auth/login` — returns JWT

**Admin (Bearer token):**
- CRUD on `/api/admin/stats`, `/api/admin/products`, `/api/admin/strengths`
- Read `/api/admin/inquiries`, update `/api/admin/settings`

## Running Locally

1. PostgreSQL running with `ecofeast_db` database created
2. `dotnet run` in EcoFeast.API (or F5 in Visual Studio) — runs on :5000
3. `npm run dev` in EcoFeast.Client — runs on :5173 with proxy to :5000

## What Needs Building Next

- [ ] Admin panel UI (React pages behind login)
- [ ] Image upload for products (currently using emoji placeholders)
- [ ] Email notification on new contact inquiry
- [ ] SEO meta tags per section
- [ ] Analytics integration
- [ ] Testimonials/client logos section
- [ ] Blog/news section for export updates

## Company Details (for reference)

- **Company:** EcoFeast Nutrients Pvt. Ltd.
- **Director:** Kaustubh Chavan
- **Phone:** +91 96531 56090
- **Email:** ecofeastnutrients@gmail.com
- **Address:** B 504, Navbhagyashree, Mahatma Phule Road, Mulund(E), Mumbai - 81
- **Certifications:** FSSAI, APEDA (RCMC), IEC, GST, PAN
- **Products:** 11 items across Fresh Vegetables, Fresh Fruits, Cereals, Spices, Processed Foods, Frozen
- **Target Markets:** Africa, Middle East, Europe, USA, South America, Asia
- **Tagline:** "Premium by Nature. Powerful by Supply."
