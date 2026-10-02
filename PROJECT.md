# Project: Matcha House Delhi Website Rebuild

## Architecture
- **Tech Stack**: Static HTML5, CSS3, ES6 JavaScript, Three.js r164 (CDN importmap), Python 3 `http.server` on port 8080.
- **Client-Side Architecture**: Pure static client-side application. All dynamic interactions (pricing calculators, filters, WhatsApp URL generation, timezone-aware hours) are implemented in client-side ES6 modules.
- **Hero Isolation Architecture**: The hero section in `index.html` (lines 45–52) and its associated CSS rules are strictly FROZEN (364 bytes, SHA-256 `fdbd20f70c1fd43b3355bd704d15321568c43ee92782059a21141d265a84932b`). Three.js binds dynamically to `<canvas id="cupCanvas">`.
- **Component Layout**:
  1. Header / Navigation: Frosted glass navbar (`#about`, `#menu`, `#events`, `#reviews`, `#insider`, `#location`, `#visit`)
  2. Hero Section: `<header class="hero" id="home">` (364 bytes, byte-for-byte immutable)
  3. Secret Ritual Section: `#secret-ritual` (self-contained whisk experience, zero console errors)
  4. Editorial "Our Story": `#about`
  5. Revenue Menu Section: `#menu` (32 items, tabs, oat milk toggle, WhatsApp order CTAs, badges)
  6. Events & Workshops: `#events` (Matcha Masterclass, Basic ₹1500 / Premium ₹2500, seats counter)
  7. Social Proof: `#reviews` (Curated testimonials carousel, Instagram gallery grid)
  8. Loyalty Club: `#insider` (Matcha Insider sign-up, free cookie incentive)
  9. Taste Profiler Quiz: `#taste-profile`
  10. Location & Hours: `#location` (Google Maps embed, live IST Open/Closed pill, metro info, Table Booking CTA)
  11. Footer: `#visit` (Social links, operating hours, franchise enquiry mailto)

## Feature Inventory
| # | Feature | Description | Milestone | Source | Status |
|---|---------|-------------|-----------|--------|:------:|
| 1 | Hero Section Byte Preservation | Byte-for-byte preservation of lines 45–52 (364 bytes, SHA-256 `fdbd...`) | M0 (Baseline) | User Constraint 1 | DONE |
| 2 | Procedural 3D Cup in Hero | Procedural Three.js cup on `#cupCanvas`, zero console errors | M1 (3D/Ritual) | R1 (Original) | DONE |
| 3 | Whisk Ritual Polish | Zero external Sketchfab console errors; preserve `#secret-ritual` | M1 (3D/Ritual) | R8 / AC | DONE |
| 4 | 32-Item Revenue Menu | Category tabs (All, Pure & Refreshing, Signature Lattes, Clouds & Treats) | M2 (Menu/WA) | R1 | DONE |
| 5 | Oat Milk Price Toggle | Dynamic +₹80 pricing across all 32 items in real time | M2 (Menu/WA) | R1 | DONE |
| 6 | WhatsApp Order CTAs | Per-item `wa.me/919999999999` order link with drink name, milk, price | M2 (Menu/WA) | R1 & R2 | DONE |
| 7 | Menu Badges & Tags | "🔥 Popular" and "✨ New" badges, ingredient tags on hover/tap | M2 (Menu/WA) | R1 | DONE |
| 8 | Masterclass Events Section | Tiered pricing (Basic ₹1500 / Premium ₹2500), date, seats counter, WA CTA | M3 (Events/Social/Loyalty) | R3 & R2 | DONE |
| 9 | Social Proof Reviews Carousel | 5–6 authentic reviews with star ratings, touch/swipe support | M3 (Events/Social/Loyalty) | R4 | DONE |
| 10 | Instagram Feed Grid | Curated aesthetic matcha photo grid with handle `@matchahouseldelhi` | M3 (Events/Social/Loyalty) | R4 | DONE |
| 11 | Matcha Insider Loyalty Club | Name field form with WhatsApp join link and free cookie hook | M3 (Events/Social/Loyalty) | R5 & R2 | DONE |
| 12 | Enhanced Location & Google Maps | Embedded Google Maps iframe, directions link, Hauz Khas metro info | M4 (Location/SEO/Polish) | R6 | DONE |
| 13 | Live IST Hours Status | Real-time Open/Closed indicator (8 AM – 9 PM IST, Asia/Kolkata safe) | M4 (Location/SEO/Polish) | R6 | DONE |
| 14 | WhatsApp Table Booking | "Book a Table" CTA funneled to `wa.me/919999999999` | M4 (Location/SEO/Polish) | R6 & R2 | DONE |
| 15 | Local SEO & Metadata | Schema.org LocalBusiness JSON-LD, OpenGraph tags, GA4 placeholder | M4 (Location/SEO/Polish) | R7 | DONE |
| 16 | Responsive & Touch Polish | 320px–4K responsiveness (no overflow), custom bamboo cursor desktop only | M4 (Location/SEO/Polish) | R8 & AC | DONE |
| 17 | Luxury Footer | Social links, operating hours, Franchise Enquiries mailto link | M4 (Location/SEO/Polish) | R8 | DONE |
| 18 | Automated E2E Test Suite | Automated Python test suite verifying all criteria on port 8080 | Track B (E2E Test) | Acceptance Criteria | DONE |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|:------:|
| Track B | E2E Testing Suite | Create automated test suite and runner testing port 8080 | None | DONE |
| M1 | 3D Cup & Ritual Stability | Procedural cup on `#cupCanvas`, eliminate Sketchfab console error | None | DONE |
| M2 | Revenue Menu & WhatsApp Ordering | 32 items, category tabs, oat milk toggle (+₹80), WhatsApp order links | None | DONE |
| M3 | Events, Social Proof & Loyalty | Masterclass section, reviews carousel, Instagram grid, Insider club | M2 | DONE |
| M4 | Location, SEO, Polish & Footer | Maps embed, live IST status, LocalBusiness JSON-LD, 320px responsive, cursor | M3 | DONE |
| M5 | Multi-Agent Review & Forensic Audit | Reviewer, Critic, Challenger stress tests, Forensic Auditor integrity check | Track B, M1-M4 | DONE |

## Code Layout
- `index.html`: Main landing page document. Lines 45–52 strictly FROZEN (364 bytes, SHA-256 `fdbd20f...`).
- `styles.css`: Luxury corporate stylesheet. Hero classes strictly FROZEN; new modular classes appended.
- `script.js`: Main UI logic (menu filter, oat milk toggle, WA generator, carousel, hours, loyalty, cursor).
- `cup3d.js`: Three.js procedural 3D cup attached to `<canvas id="cupCanvas">`.
- `server.py`: Local development HTTP server on port 8080.
- `tests/`: Automated test suite (`e2e_test_suite.py`, `adversarial_stress_test.py`, `test_e2e_suite.py`).
