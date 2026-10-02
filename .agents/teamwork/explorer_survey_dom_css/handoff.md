# Handoff Report — DOM Tree Survey, Hero CSS Isolation & Gap Analysis

**Agent**: `explorer_survey_dom_css` (teamwork_preview_explorer)  
**Working Directory**: `/Users/iyumriba/Documents/antigravity/Matcha House Delhi/.agents/teamwork/explorer_survey_dom_css/`  
**Timestamp**: 2026-10-02T22:42:00Z  
**Type**: Hard Handoff (Survey Complete)

---

## 1. Observation

Direct code examination of `/Users/iyumriba/Documents/antigravity/Matcha House Delhi/index.html` (470 lines) and `/Users/iyumriba/Documents/antigravity/Matcha House Delhi/styles.css` (1076 lines).

### 1.1 Complete DOM Map of `index.html`

The existing document structure spans lines 1 to 470:

| DOM Element / Selector | Lines in `index.html` | Purpose & Contents |
|---|---|---|
| `<head>` | 1–20 | Metadata, viewport, fonts (`Cinzel`, `Inter`, `Playfair Display`), `styles.css` link, Three.js r164 importmap |
| `div#cursorDot.cursor-dot`, `div#cursorOutline.cursor-outline` | 23–24 | Custom bamboo cursor graphic and golden tracking circle |
| `div#scrollProgress.scroll-progress` | 27 | Top golden progress bar tracking scroll percentage |
| `div#weatherWidget.weather-widget` | 29–32 | Fixed bottom-left Delhi live weather pill (`#weatherIcon`, `#weatherText`) |
| `nav.navbar` | 34–43 | Fixed frosted glass nav with `.nav-left` (Our Story, Menu), `.logo`, `.nav-right` ("Visit Us" `.btn-primary`) |
| **`header#home.hero`** | **45–52** | **CRITICAL HERO SECTION (FROZEN BASELINE)**: `#cupCanvas`, `.hero-content`, `h1`, `p`, `.btn-secondary` |
| `section#secret-ritual.ritual-section` | 54–85 | "The Secret Whisk Ritual", Sketchfab iframe (`src=""`), SVG progress ring, unlock reveal overlay |
| `section#about.editorial-section` | 87–105 | "From Uji to New Delhi.", 2 tilt images (`assets/fields.png`, `assets/whisk.png`), 2-column text, pull quote |
| `section#menu.menu-section` | 108–377 | Full 32-item menu: `.signature-gallery` (2 cards), `.menu-grid` (3 columns), `.menu-footer` (milk/sweeteners) |
| `section#taste-profile.taste-section` | 380–426 | 3-step interactive taste quiz (`#quizSlide1`, `#quizSlide2`, `#quizSlide3`), result card with barcode graphic |
| `section#location.location-section` | 429–445 | Location header, `.map-container` with static `assets/map.png`, overlay button, radar pulse pin |
| `footer#visit.footer` | 447–463 | Footer brand, location address (123 Matcha Lane, Hauz Khas), copyright 2026 |
| Scripts | 465–467 | `script.js` (UI logic), `cup3d.js` (WebGL 3D cup), `scroll-whisk.js` (Sketchfab ritual logic) |

#### Exact Canonical Hero Markup (`index.html` lines 45–52)
```html
    <header class="hero" id="home">
        <canvas id="cupCanvas"></canvas>
        <div class="hero-content">
            <h1>Awaken Your<br>Senses.</h1>
            <p>Experience the purest, ceremonial-grade matcha<br>right in the heart of Delhi.</p>
            <a href="#secret-ritual" class="btn-secondary">Unlock the Secret</a>
        </div>
    </header>
```

#### Menu Section Inventory (32 Items Verified)
- **Pure & Refreshing** (11 items, lines 134–213):
  1. Matcha Iced Tea (₹380, line 141)
  2. Kaffir Lime Matcha (₹370, line 148)
  3. Watermelon Matcha Refresher (₹370, line 155)
  4. Forestberry Matcha (₹350, line 162)
  5. Orange Matcha (₹380, line 169)
  6. Yuzu Matcha (₹350, line 176)
  7. Peachy Matcha (₹330, line 183)
  8. Passionfruit Matcha (₹330, line 190)
  9. Litchi Jelly Matcha (₹350, line 197)
  10. Strawberry Matcha Soda (₹370, line 204)
  11. Raspberry Matcha (₹250, line 211)
- **Signature Lattes** (11 items, lines 215–294):
  12. Classic Matcha Latte (₹310, line 222)
  13. Hojicha Matcha Latte (₹310, line 229)
  14. Blueberry Matcha Latte (₹350, line 236)
  15. Triple Berry Matcha Latte (₹395, line 243)
  16. Raspberry Matcha Latte (₹350, line 250)
  17. Strawberry Matcha Latte (₹380, line 257)
  18. Mango Matcha Latte (₹395, line 264)
  19. Watermelon Matcha Latte (₹395, line 271)
  20. Banana Matcha Latte (₹395, line 278)
  21. Pandan Matcha Latte (₹380, line 285)
  22. Strawberry Hojicha Latte (₹395, line 292)
- **Clouds, Fusions & Treats** (10 items, lines 296–368):
  23. Coconut Cream Matcha (₹395, line 303)
  24. Mango Coconut Cloud (₹395, line 310)
  25. Coconut Cloud Matcha (₹390, line 317)
  26. Matcha Espresso Fusion (₹395, line 324)
  27. Yakult Matcha Latte (₹350, line 331)
  28. Honey Cinnamon Matcha Latte (₹350, line 338)
  29. Oreo Matcha Latte (₹350, line 345)
  30. Matcha Affogato (₹380, line 352)
  31. Vanilla Float Matcha (₹390, line 359)
  32. Mango Matcha Pudding (₹200, line 366)

---

### 1.2 Hero CSS Isolation Map (`styles.css`)

The following rules in `styles.css` directly control the layout, aesthetics, and WebGL behavior of the Hero Section:

#### A. Global Ancestor Dependencies (DO NOT MODIFY VALUES)
1. **Root Variables** (`styles.css:1-10`):
   ```css
   :root {
       --color-cream: #F9F9F4;        /* Critical: body background & hero text-shadow */
       --color-matcha-dark: #3A4A1C;   /* Hero H1 color & btn-secondary text */
       --color-gold: #D4AF37;          /* Hero btn-secondary border & hover accent */
       --font-heading: 'Cinzel', serif;/* Hero H1 & btn-secondary font */
       --font-body: 'Inter', sans-serif;/* Inherited by hero p */
   }
   ```
2. **Global Resets & Body** (`styles.css:15-37`):
   - `* { margin: 0; padding: 0; box-sizing: border-box; }` — Coordinates absolute positioning of `#cupCanvas`.
   - `body { background-color: var(--color-cream); color: var(--color-matcha-dark); ... }` — Directly interacts with `#cupCanvas { mix-blend-mode: multiply; }`.
   - `h1, h2, h3, .logo { font-family: var(--font-heading); font-weight: 600; }` — Styles `.hero-content h1`.

#### B. Direct Hero Rules (`styles.css:102-189`)
```css
.hero {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    text-align: center;
    padding-top: 80px; /* offset for nav */
}

.hero-content {
    z-index: 2;
    position: relative;
    pointer-events: none; /* Let mouse interact with the 3D canvas behind */
}

.hero-content h1, .hero-content p, .hero-content a {
    pointer-events: auto;
}

.hero-content h1 {
    font-size: 5.5rem;
    color: var(--color-matcha-dark);
    line-height: 1.1;
    margin-bottom: 1.5rem;
    letter-spacing: -2px;
    opacity: 0;
    animation: fadeUp 1.2s ease forwards 0.2s;
    text-shadow: 0 10px 30px rgba(249, 249, 244, 0.8), 0 0 40px rgba(255, 255, 255, 0.9);
}

.hero-content p {
    font-size: 1.3rem;
    color: #333;
    margin-bottom: 3rem;
    opacity: 0;
    letter-spacing: 0.5px;
    animation: fadeUp 1.2s ease forwards 0.5s;
    text-shadow: 0 5px 15px rgba(249, 249, 244, 0.9);
}

.btn-secondary {
    display: inline-block;
    border: 2px solid var(--color-gold);
    color: var(--color-matcha-dark);
    text-decoration: none;
    padding: 1rem 2rem;
    font-family: var(--font-heading);
    font-weight: 600;
    letter-spacing: 1px;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    opacity: 0;
    animation: fadeUp 1s ease forwards 0.6s;
}

.btn-secondary::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--color-gold);
    z-index: -1;
    transition: transform 0.3s ease;
    transform: scaleX(0);
    transform-origin: right;
}

.btn-secondary:hover {
    color: white;
}

.btn-secondary:hover::after {
    transform: scaleX(1);
    transform-origin: left;
}
```

#### C. Canvas Styling (`styles.css:468-478`)
```css
#cupCanvas {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    cursor: grab;
    pointer-events: auto;
    mix-blend-mode: multiply; /* Seamless blending into cream background */
}
```

#### D. Entrance Keyframes (`styles.css:549-558`)
```css
@keyframes fadeUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
```

#### E. Hero Media Queries (`styles.css:965-971, 1000-1012, 1066-1068`)
- `@media (max-width: 1024px)`:
  - `.hero-content h1 { font-size: 4rem; }`
  - `.hero-content p { font-size: 1.1rem; }`
- `@media (max-width: 768px)`:
  - `.hero { padding-top: 140px; }`
  - `.hero-content h1 { font-size: 3rem; text-shadow: 0 4px 20px rgba(255, 255, 255, 0.9); }`
  - `.hero-content p { font-size: 1.1rem; padding: 0 1rem; text-shadow: 0 2px 10px rgba(255, 255, 255, 0.9); font-weight: 500; }`
- `@media (max-width: 480px)`:
  - `.hero-content h1 { font-size: 2.2rem; }`

---

### 1.3 UI & Styling Gap Analysis (R1 – R8)

| Req | Name | Target Capabilities | Current State in CSS & DOM | Gap / Action Needed |
|---|---|---|---|---|
| **R1** | Revenue-Driving Menu | Category tabs/filters, hover cards with ingredient tags, "🔥 Popular" / "✨ New" badges, WhatsApp order button per item, Oat milk toggle (+₹80 real-time) | Plain 3-column static grid (`.menu-grid`), plain item text. No tabs, no hover card states, no badges, no order buttons, no oat milk toggle. | Add `.menu-tabs` & `.tab-btn` active states, card hover lift, `.badge-popular` & `.badge-new`, `.btn-order-wa`, `.milk-toggle` switch styling. Fix 320px overflow bug (`minmax(300px, 1fr)`). |
| **R2** | WhatsApp-First Funnel | CTAs funneling to `wa.me/919999999999` (order, table reservation, loyalty sign-up, event booking) | Zero WhatsApp styles, zero WhatsApp buttons in HTML/CSS. | Add `--color-wa: #25D366;`, `.btn-whatsapp` luxury styles, WhatsApp brand icons/SVGs, floating CTA or sticky integration. |
| **R3** | Events & Workshops | "Matcha Masterclass" (Basic ₹1,500 / Premium ₹2,500), visual calendar date, seats counter urgency, WhatsApp booking | Completely missing from DOM and CSS. | Add `.events-section`, `.workshop-card` tiered layout, `.date-badge`, `.seats-counter` (urgency badge), WhatsApp registration CTA. |
| **R4** | Social Proof & Trust | Testimonials carousel (5–6 curated reviews with star ratings), Instagram feed placeholder | Completely missing from DOM and CSS. | Add `.testimonials-section`, `.review-card`, star ratings (`--color-gold`), `.instagram-grid` mockup with `@matchahouseldelhi` branding. |
| **R5** | Loyalty Program | "Matcha Insider" WhatsApp club (name field + CTA button: "free matcha cookie on your next visit") | Completely missing from DOM and CSS. | Add `.loyalty-section`, `.loyalty-card` VIP card design, form input field styling with gold/matcha focus rings, submission button. |
| **R6** | Enhanced Location | Embedded Google Maps iframe, live "Open Now / Closed" indicator (8AM-9PM IST), nearest metro info, "Book a Table" WhatsApp button | Static PNG `assets/map.png` with overlay button. No iframe, no live indicator, no metro info, no table booking CTA. | Replace static image with responsive `.map-embed-wrapper`, add `.status-badge.open` (pulsing green dot), `.metro-card`, `.btn-book-table` CTA. |
| **R7** | Local SEO & Tech Quality | Schema.org LocalBusiness JSON-LD, OpenGraph meta tags, GA4 placeholder, image `loading="lazy"` | Basic meta tags only; no JSON-LD, no OpenGraph, no GA4, no lazy loading attributes. | Add JSON-LD in `<head>`, OpenGraph tags, gtag placeholder, `loading="lazy"` on all offscreen images. |
| **R8** | Production Polish & Responsiveness | Scroll-triggered animations, typography hierarchy, mobile responsiveness (320px–4K), custom bamboo cursor desktop-only (hidden on touch), complete footer | Custom cursor sets `body { cursor: none; }` unconditionally (breaks touch UX). 320px viewport causes horizontal overflow in `.menu-grid` and `.signature-gallery`. Footer lacks social links and franchise mailto. `script.js` observer targets non-existent `.about-content`. | Scope cursor to `@media (hover: hover) and (pointer: fine)`. Set mobile `body { cursor: auto; }`. Adjust grid minmax to `1fr` on small screens. Add rich footer with socials, hours, and `mailto:franchise@matchahousedelhi.com`. Implement robust scroll observer. |

---

## 2. Logic Chain

1. **Premise 1 (Zero-Regression Hero Section)**:
   - The user specification mandates: *"Lines 45-52 of index.html ... must remain EXACTLY as they are. Do not change any CSS that affects the hero section's appearance."*
   - Direct observation shows that the hero section relies on:
     - Root variables: `--color-cream`, `--color-matcha-dark`, `--color-gold`, `--font-heading`, `--font-body`.
     - Direct selectors: `.hero`, `.hero-content`, `.hero-content h1`, `.hero-content p`, `.btn-secondary`, `.btn-secondary::after`, `.btn-secondary:hover`, `#cupCanvas`, `@keyframes fadeUp`.
     - Inherited reset: `* { box-sizing: border-box; }`, `body { background-color: var(--color-cream); }`.
   - *Inference*: Any worker modifying these existing selectors or root variables will directly alter the Hero section rendering, violating the core constraint.
   - *Actionable Rule*: These selectors and variable values must be declared **FROZEN**. New buttons and layouts must introduce new scoped class names (e.g. `.btn-whatsapp`, `.btn-filter`, `.btn-secondary-custom`) rather than altering `.btn-secondary`.

2. **Premise 2 (3D Cup Interaction Integrity)**:
   - Observation: `.hero-content` has `pointer-events: none`, while its children (`h1, p, a`) have `pointer-events: auto`. `#cupCanvas` has `z-index: 1; pointer-events: auto;`.
   - *Inference*: This architecture allows mouse movement across the hero section to reach `#cupCanvas` for 3D camera/tilt interaction while preserving clickability for the CTA button and text selection.
   - *Actionable Rule*: Neither the z-index nor pointer-events hierarchy of `.hero`, `.hero-content`, or `#cupCanvas` can be altered.

3. **Premise 3 (Canvas Blend Mode Dependency)**:
   - Observation: `#cupCanvas` has `mix-blend-mode: multiply;` to blend the WebGL render seamlessly into `body { background-color: var(--color-cream); }` (#F9F9F4).
   - *Inference*: If `body` background color is changed or gradient-overlaid, the WebGL canvas edge will become visibly clipped or discolored.
   - *Actionable Rule*: Body background color must remain `#F9F9F4`.

4. **Premise 4 (Mobile Responsiveness Bug Identification)**:
   - Observation: In `styles.css:688-691`, `.menu-grid` has `grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));`.
   - On a 320px viewport (e.g., iPhone SE/5), `.menu-section` has `padding: 8rem 10%`, leaving `320px * 0.8 = 256px` for the content box. Because `minmax(300px, ...)` enforces a minimum column width of 300px, the grid overflows the 256px container by 44px, causing a horizontal scrollbar.
   - *Inference*: This violates acceptance criterion *"No horizontal scrollbar appears on any screen width from 320px to 2560px"*.
   - *Actionable Rule*: Downstream workers must add a media query (e.g. `@media (max-width: 480px)`) setting `.menu-grid` and `.signature-gallery` to `grid-template-columns: 1fr;` and reducing section padding to `3rem 1rem`.

5. **Premise 5 (Touch Device Cursor Usability)**:
   - Observation: `body { cursor: none; }` is declared unconditionally on line 31 of `styles.css`.
   - *Inference*: On touch devices (smartphones/tablets), touch taps leave floating cursor ghost artifacts and can cause touch interaction anomalies.
   - *Actionable Rule*: Cursor styles must be encapsulated in `@media (hover: hover) and (pointer: fine)`. For `@media (hover: none) or (pointer: coarse)`, set `body { cursor: auto; }` and hide `.cursor-dot`, `.cursor-outline`.

---

## 3. Caveats

1. **3D Shader Implementation**:
   - This survey examined `index.html` and `styles.css`. The procedural WebGL 3D cup implementation (`cup3d.js`) is concurrently analyzed by `explorer_survey_js_server`. The CSS `#cupCanvas` is confirmed to occupy `100%` width/height of `.hero`.
2. **Sketchfab Secret Whisk Section**:
   - `scroll-whisk.js` dynamically mutates inline styles of `#secret-ritual` (`section.style.height = '200vh'`). Any changes to this section by workers must account for this script or replace it with a native, zero-external-dependency ritual if needed.
3. **No Code Modification Undertaken**:
   - Consistent with the read-only Explorer archetype, zero source code modifications have been made. All recommendations are packaged for the Implementation Track workers.

---

## 4. Conclusion

1. **Hero Section Isolation is 100% Feasible**:
   - Lines 45–52 of `index.html` are cleanly bounded.
   - All Hero CSS in `styles.css` is localized to lines 1–13 (root vars), lines 15–37 (resets/typography), lines 102–189 (hero & btn-secondary), lines 468–478 (`#cupCanvas`), lines 549–558 (`fadeUp`), and lines 965–971, 1000–1012, 1066–1068 (media queries).
   - Preserving these exact blocks guarantees 0% visual or layout regression.
2. **Scope of Additions for R1–R8**:
   - **DOM Additions**: Insert 3 new sections into `index.html` (`#workshops` for R3, `#reviews` for R4, `#insider` for R5), upgrade menu markup with tabs/toggle/badges/WhatsApp CTAs (R1/R2), upgrade location section with Google Maps embed and status badge (R6), upgrade `<head>` with SEO JSON-LD & OG tags (R7), and upgrade footer (R8).
   - **CSS Additions**: Append modular CSS blocks at the bottom of `styles.css` for each requirement, strictly avoiding collisions with `.hero` or `.btn-secondary`.
   - **Responsive Fixes**: Add 320px container constraints and touch cursor media queries to satisfy mobile criteria.

---

## 5. Verification Method

To independently verify the observations and boundaries documented in this report:

1. **Verify Hero Markup Baseline**:
   ```bash
   sed -n '45,52p' "/Users/iyumriba/Documents/antigravity/Matcha House Delhi/index.html"
   ```
   *Expected Output*:
   ```html
       <header class="hero" id="home">
           <canvas id="cupCanvas"></canvas>
           <div class="hero-content">
               <h1>Awaken Your<br>Senses.</h1>
               <p>Experience the purest, ceremonial-grade matcha<br>right in the heart of Delhi.</p>
               <a href="#secret-ritual" class="btn-secondary">Unlock the Secret</a>
           </div>
       </header>
   ```

2. **Verify All 32 Menu Items**:
   ```bash
   grep -c 'class="menu-item"' "/Users/iyumriba/Documents/antigravity/Matcha House Delhi/index.html"
   ```
   *Expected Output*: `32` (11 Pure & Refreshing + 11 Signature Lattes + 10 Clouds & Treats).

3. **Verify Hero CSS Selectors**:
   ```bash
   grep -nE '(\.hero|#cupCanvas|\.hero-content|\.btn-secondary)' "/Users/iyumriba/Documents/antigravity/Matcha House Delhi/styles.css"
   ```
   *Expected Output*: Matches exactly lines 102, 114, 127, 131, 142, 152, 168, 182, 186, 468, 966, 969, 1000, 1003, 1007, 1066.

4. **Verify Absence of Horizontal Scrollbar**:
   Open `http://localhost:8080` in Chrome/Firefox devtools, toggle responsive mode to `320px`, inspect `document.documentElement.scrollWidth > window.innerWidth`.
