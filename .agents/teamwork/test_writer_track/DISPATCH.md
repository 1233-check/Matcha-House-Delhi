# DISPATCH — E2E Test Writer Track

## Assignment
You are the teamwork_preview_test_writer for the Matcha House Delhi rebuild project.

## Working Directory
`/Users/iyumriba/Documents/antigravity/Matcha House Delhi/.agents/teamwork/test_writer_track/`

## Source of Truth Files to Read
1. `/Users/iyumriba/Documents/antigravity/Matcha House Delhi/.agents/teamwork/ORIGINAL_REQUEST.md` (read completely, especially 2026-10-02T22:33:45Z)
2. `/Users/iyumriba/Documents/antigravity/Matcha House Delhi/PROJECT.md`
3. `/Users/iyumriba/Documents/antigravity/Matcha House Delhi/TEST_INFRA.md`
4. `/Users/iyumriba/Documents/antigravity/Matcha House Delhi/.agents/teamwork/spec_miner_survey/handoff.md`

## Write Ownership
- `tests/` directory (e.g. `tests/e2e_test_suite.py`)
- `/Users/iyumriba/Documents/antigravity/Matcha House Delhi/TEST_READY.md`

## Objectives
1. Build a comprehensive, automated E2E test suite in Python (`tests/e2e_test_suite.py`) covering all acceptance criteria across the 4 tiers:
   - **Tier 1 (Feature & Content Coverage)**:
     - Hero section byte-for-byte SHA256 integrity check (`fdbd20f70c1fd43b3355bd704d15321568c43ee92782059a21141d265a84932b`, length 364 bytes).
     - Exact 32 menu items verification (each name, base price, category).
     - Events section present with Basic (₹1,500) and Premium (₹2,500) tiers, date display, seats counter, WhatsApp CTA.
     - Reviews carousel present with at least 5 curated reviews and star ratings.
     - Instagram feed present (`@matchahouseldelhi`).
     - Loyalty club section present ("Matcha Insider", name input, free cookie hook, WhatsApp CTA).
     - Location section: Google Maps embed iframe, "Book a Table" WhatsApp CTA, Hauz Khas metro info.
     - SEO: Schema.org LocalBusiness/CafeOrCoffeeShop JSON-LD valid, OpenGraph tags, GA4 placeholder.
     - Footer: operating hours, social links, franchise enquiry mailto link.
   - **Tier 2 (Boundary & Logic Verification)**:
     - Oat milk toggle logic (+₹80 applied to all 32 base prices).
     - WhatsApp URL validation: valid `wa.me/919999999999` links with proper URL encoding and prefilled drink/name/event data.
     - Live store hours calculation: Asia/Kolkata timezone verification (8:00 AM – 9:00 PM IST is OPEN, otherwise CLOSED).
     - Anchor links: every internal anchor href (`#about`, `#menu`, `#events`, `#reviews`, `#insider`, `#location`, `#visit`, `#secret-ritual`) resolves to a valid DOM element with matching id.
   - **Tier 3 & Tier 4 (Integration & Responsiveness)**:
     - CSS check: custom cursor scoped to `@media (hover: hover) and (pointer: fine)` so mobile is not impacted.
     - CSS check: 320px viewport grid overflow bug resolved (no `minmax(300px, 1fr)` unconstrained).
     - Zero console errors / syntax errors in JS scripts.
2. The test script must run cleanly via `python3 tests/e2e_test_suite.py` and exit with code 0 if all tests pass, or non-zero with detailed failure diagnostics.
3. Publish `/Users/iyumriba/Documents/antigravity/Matcha House Delhi/TEST_READY.md` summarizing the test suite once written.
4. Output your handoff to:
   `/Users/iyumriba/Documents/antigravity/Matcha House Delhi/.agents/teamwork/test_writer_track/handoff.md`

## 2026-10-02T22:44:50Z
Read /Users/iyumriba/Documents/antigravity/Matcha House Delhi/.agents/teamwork/test_writer_track/DISPATCH.md and /Users/iyumriba/Documents/antigravity/Matcha House Delhi/.agents/teamwork/ORIGINAL_REQUEST.md.
Your working directory is /Users/iyumriba/Documents/antigravity/Matcha House Delhi/.agents/teamwork/test_writer_track/
Your identity is test_writer_track (teamwork_preview_test_writer).
Develop tests/e2e_test_suite.py covering all 4 tiers of acceptance criteria (hero byte/SHA256 integrity, 32 menu items, oat milk +₹80 math, WhatsApp URLs, events, reviews, loyalty, Google Maps, IST hours, SEO JSON-LD, 320px responsive, zero console errors). Run the test suite against the codebase, publish TEST_READY.md at project root, and write handoff.md in your working directory. Send a message to orchestrator when finished.
