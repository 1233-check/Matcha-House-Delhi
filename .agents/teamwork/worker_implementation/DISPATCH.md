# DISPATCH — Implementation Worker

## Assignment
You are the teamwork_preview_worker for the Matcha House Delhi rebuild project.

## Working Directory
`/Users/iyumriba/Documents/antigravity/Matcha House Delhi/.agents/teamwork/worker_implementation/`

## Source of Truth Files to Read
1. `/Users/iyumriba/Documents/antigravity/Matcha House Delhi/.agents/teamwork/ORIGINAL_REQUEST.md` (read completely, especially 2026-10-02T22:33:45Z)
2. `/Users/iyumriba/Documents/antigravity/Matcha House Delhi/PROJECT.md`
3. `/Users/iyumriba/Documents/antigravity/Matcha House Delhi/.agents/teamwork/spec_miner_survey/handoff.md`
4. `/Users/iyumriba/Documents/antigravity/Matcha House Delhi/.agents/teamwork/explorer_survey_dom_css/handoff.md`
5. `/Users/iyumriba/Documents/antigravity/Matcha House Delhi/.agents/teamwork/explorer_survey_js_server/handoff.md`

## Write Ownership
You exclusively own:
- `/Users/iyumriba/Documents/antigravity/Matcha House Delhi/index.html`
- `/Users/iyumriba/Documents/antigravity/Matcha House Delhi/styles.css`
- `/Users/iyumriba/Documents/antigravity/Matcha House Delhi/script.js`
- `/Users/iyumriba/Documents/antigravity/Matcha House Delhi/cup3d.js`
- `/Users/iyumriba/Documents/antigravity/Matcha House Delhi/scroll-whisk.js`

## MANDATORY INTEGRITY WARNING
> DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## CRITICAL ARCHITECTURAL CONSTRAINTS
1. **DO NOT MODIFY THE HERO SECTION.** Lines 45-52 of original `index.html` (the `<header class="hero" id="home">` block containing the cupCanvas, hero-content div, h1, p, and btn-secondary link) must remain EXACTLY as they are byte-for-byte:
   - Length: exactly 364 bytes
   - SHA-256: `fdbd20f70c1fd43b3355bd704d15321568c43ee92782059a21141d265a84932b`
   - Content:
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
2. **DO NOT MODIFY HERO CSS.** Do not touch the root variables or selectors styling `.hero`, `.hero-content`, `.hero-content h1`, `.hero-content p`, `.btn-secondary`, `#cupCanvas`, `@keyframes fadeUp`. Append new classes and styles cleanly without modifying the hero appearance.
3. Keep `#secret-ritual` element present in DOM so the hero button anchor resolves.
4. **All 32 existing menu items** must be preserved with exact names, descriptions, and base prices.
5. Fulfill all requirements R1 through R8:
   - R1: Rebuild menu with category tabs (All, Pure & Refreshing, Signature Lattes, Clouds & Treats), hover cards with ingredient tags, "🔥 Popular" & "✨ New" badges, WhatsApp ordering button per item, Oat milk toggle (+₹80 in real-time).
   - R2: WhatsApp-First funnel: Every CTA points to `wa.me/919999999999` with pre-filled messages (menu order, table booking, loyalty signup, event booking).
   - R3: Events & Workshops: "Matcha Masterclass" section with tiered pricing (Basic ₹1,500 / Premium ₹2,500), visual date display, urgency seats counter, WhatsApp booking button.
   - R4: Social Proof: Curated reviews carousel with 5-6 realistic reviews and star ratings. Instagram feed placeholder (`@matchahouseldelhi`).
   - R5: Loyalty Program: "Matcha Insider" WhatsApp club form (name input + button) with hook: "Join for a free matcha cookie on your next visit."
   - R6: Enhanced Location: Embedded Google Maps iframe, live "Open Now" / "Closed" indicator (8AM-9PM IST daily, using `Intl.DateTimeFormat` or `Asia/Kolkata` time calculation), Hauz Khas metro info, "Book a Table" WhatsApp CTA.
   - R7: Local SEO: Schema.org LocalBusiness JSON-LD in `<head>`, OpenGraph meta tags, Google Analytics 4 placeholder, lazy-load images, zero console errors, valid HTML.
   - R8: Production Polish: Smooth scroll animations, luxury typography, responsive from 320px to 4K (fix `minmax(300px, 1fr)` overflow), custom bamboo cursor desktop only (`@media (hover: hover) and (pointer: fine)`), footer with social links, hours, franchise enquiry mailto link (`mailto:franchise@matchahousedelhi.com`).
   - 3D Cup: Procedural Three.js cup on `#cupCanvas`, procedural geometry, smooth auto-rotate, zero console errors (ensure `scroll-whisk.js` / Sketchfab does not throw errors).

## Verification Method
Test using Python:
1. Verify hero section SHA256 matches `fdbd20f70c1fd43b3355bd704d15321568c43ee92782059a21141d265a84932b` and length 364.
2. Verify all 32 menu items are present.
3. Test that server runs and serves correctly on port 8080.
4. Check for zero JS errors and HTML validity.

Output full implementation details and test verification results to:
`/Users/iyumriba/Documents/antigravity/Matcha House Delhi/.agents/teamwork/worker_implementation/handoff.md`

## 2026-10-02T22:44:50Z
Read /Users/iyumriba/Documents/antigravity/Matcha House Delhi/.agents/teamwork/worker_implementation/DISPATCH.md and /Users/iyumriba/Documents/antigravity/Matcha House Delhi/.agents/teamwork/ORIGINAL_REQUEST.md.
Your working directory is /Users/iyumriba/Documents/antigravity/Matcha House Delhi/.agents/teamwork/worker_implementation/
Your identity is worker_implementation (teamwork_preview_worker).
Implement all requirements R1-R8 for Matcha House Delhi website rebuild. CRITICAL CONSTRAINT: lines 45-52 of original index.html (the hero section) must remain byte-for-byte identical (364 bytes, SHA-256 fdbd20f70c1fd43b3355bd704d15321568c43ee92782059a21141d265a84932b). Do not alter hero CSS. Preserve all 32 menu items. Rebuild menu with tabs, badges, oat milk toggle (+₹80), WhatsApp order buttons. Build WhatsApp funnel, events masterclass section, social proof carousel & Instagram feed, loyalty club, location with Google Maps embed & live IST hours, SEO JSON-LD & OG tags, responsive polish & desktop-only cursor, procedural 3D cup and zero console errors. Run verifications and report results in handoff.md. Send a message to orchestrator when finished.
