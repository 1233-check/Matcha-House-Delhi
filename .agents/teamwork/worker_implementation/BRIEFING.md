# BRIEFING — 2026-10-02T22:58:30Z

## Mission
Implement all requirements R1-R8 for Matcha House Delhi website rebuild while strictly preserving the hero section byte-for-byte (364 bytes, SHA-256 fdbd20f70c1fd43b3355bd704d15321568c43ee92782059a21141d265a84932b) and hero CSS.

## 🔒 My Identity
- Archetype: teamwork_preview_worker
- Roles: implementer, qa, specialist
- Working directory: /Users/iyumriba/Documents/antigravity/Matcha House Delhi/.agents/teamwork/worker_implementation/
- Original parent: 279b5f99-1cae-4d02-b131-3741de12e9ca
- Milestone: M1-M4 Rebuild Complete

## 🔒 Key Constraints
- Lines 45-52 of original index.html (the hero section) must remain byte-for-byte identical (364 bytes, SHA-256 fdbd20f70c1fd43b3355bd704d15321568c43ee92782059a21141d265a84932b).
- Do not alter hero CSS (.hero, .hero-content, .hero-content h1, .hero-content p, .btn-secondary, #cupCanvas, @keyframes fadeUp, root colors).
- Preserve element with id="secret-ritual" in DOM so hero anchor resolves.
- Preserve all 32 existing menu items with exact names, descriptions, and base prices.
- WhatsApp funnel CTA phone placeholder wa.me/919999999999 with properly encoded parameters.
- Live operating hours 8AM-9PM daily calculated using Asia/Kolkata IST.
- Responsive layout across 320px to 4K without horizontal overflow.
- Custom bamboo cursor desktop-only (@media (hover: hover) and (pointer: fine)), hidden on touch.
- Zero console errors in browser.

## Current Parent
- Conversation ID: 279b5f99-1cae-4d02-b131-3741de12e9ca
- Updated: 2026-10-02T22:58:30Z

## Task Summary
- **What to build**: Full website rebuild with R1 (Menu with tabs, badges, oat milk +₹80 toggle, WA order buttons), R2 (WhatsApp funnel), R3 (Events Masterclass), R4 (Social Proof & Reviews carousel, Instagram feed), R5 (Loyalty Matcha Insider club), R6 (Google Maps embed, live IST hours, Hauz Khas metro, Table booking WA), R7 (Schema.org LocalBusiness JSON-LD, OG tags, GA4 placeholder, lazy loading), R8 (Responsive polish, desktop cursor, luxury footer), procedural 3D cup and zero console errors.
- **Success criteria**: All 32 menu items preserved, hero section 364 bytes SHA-256 matches, zero JS errors, all R1-R8 features fully operational.
- **Interface contracts**: PROJECT.md, TEST_INFRA.md
- **Code layout**: index.html, styles.css, script.js, cup3d.js, scroll-whisk.js, server.py, tests/e2e_test_suite.py

## Key Decisions Made
- Line budget architecture: Engineered lines 1-44 of index.html to occupy exactly 44 lines, locking the hero section cleanly at lines 45-52 so that both slice checks `lines[44:52]` and DOM queries match baseline.
- Procedural 3D Cup: Built photorealistic Three.js scene with lathe glass tumbler, ceremonial matcha liquid, animated froth disc, 4 crystal ice cubes, floating particles, and smooth drag/scroll tilt.
- Secret Ritual: Eliminated external Sketchfab network dependencies and console error by replacing with a native ceremonial bowl & SVG progress ring whisking interaction.
- Dynamic Menu Engine: Implemented category tabs, oat milk price modifier (+₹80) updating both DOM price and prefilled WhatsApp text in real-time.
- Live Operating Hours: Evaluated IST 8:00 AM – 9:00 PM using `Asia/Kolkata` timezone with live status pill.

## Artifact Index
- .agents/teamwork/worker_implementation/BRIEFING.md — Persistent situational awareness
- .agents/teamwork/worker_implementation/DISPATCH.md — Task assignment and instructions
- .agents/teamwork/worker_implementation/progress.md — Liveness heartbeat & task progress
- .agents/teamwork/worker_implementation/handoff.md — Final hard handoff report
- tests/e2e_test_suite.py — Automated test suite verifying 13/13 criteria
- TEST_READY.md — Test confirmation attestation

## Change Tracker
- **Files modified**: index.html, styles.css, script.js, cup3d.js, scroll-whisk.js, tests/e2e_test_suite.py
- **Build status**: PASS (13/13 automated tests passed)
- **Pending issues**: None

## Quality Status
- **Build/test result**: PASS (100% pass on 13 E2E test suites)
- **Lint status**: 0 duplicate IDs, 0 unclosed tags, valid HTML5
- **Tests added/modified**: tests/e2e_test_suite.py

## Loaded Skills
- None specified
