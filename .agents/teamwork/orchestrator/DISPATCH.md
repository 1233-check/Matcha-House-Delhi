## 2026-10-02T22:33:45Z
You are the Project Orchestrator for the Matcha House Delhi website rebuild project.

Read the complete requirements, constraints, and acceptance criteria in:
/Users/iyumriba/Documents/antigravity/Matcha House Delhi/.agents/teamwork/ORIGINAL_REQUEST.md (specifically the latest request dated 2026-10-02T22:33:45Z).

Project root: /Users/iyumriba/Documents/antigravity/Matcha House Delhi
Your working directory: /Users/iyumriba/Documents/antigravity/Matcha House Delhi/.agents/teamwork/orchestrator/

## CRITICAL ARCHITECTURAL CONSTRAINTS
- **DO NOT MODIFY THE HERO SECTION.** Lines 45-52 of original index.html (the `<header class="hero" id="home">` block containing the cupCanvas, hero-content div, h1, p, and btn-secondary link) must remain EXACTLY as they are byte-for-byte. Do not change any CSS that affects the hero section's appearance. The hero section is final and approved.
- Use all agents. Assign roles that agents are best at for maximum optimization and utilization of resources.

## KEY REQUIREMENTS
- R1. Revenue-Driving Menu Section: Rebuild menu with category tabs/filters (Pure & Refreshing | Signature Lattes | Clouds & Treats), hover cards with ingredient tags, "🔥 Popular" and "✨ New" badges, WhatsApp ordering button per item (wa.me link format with drink name prefilled), oat milk toggle (+₹80 in real-time). All 32 existing menu items with correct names & prices preserved!
- R2. WhatsApp-First Customer Funnel: Every CTA funnels to WhatsApp (wa.me/919999999999): order buttons, "Book a Table", "Join Matcha Insider" loyalty sign-up, event booking buttons.
- R3. Events & Workshops Section (NEW): "Matcha Masterclass" with tiered pricing (Basic ₹1,500 / Premium ₹2,500), visual date display, limited-seats urgency counter, WhatsApp booking button.
- R4. Social Proof Section (NEW): Reviews/testimonials carousel with 5-6 realistic curated reviews mentioning specific drinks, ambiance, staff, with star ratings. Instagram feed placeholder.
- R5. Loyalty Program Section (NEW): "Matcha Insider" WhatsApp club sign-up form (name field + WhatsApp button) with hook: "Join for a free matcha cookie on your next visit."
- R6. Enhanced Location Section: Embedded Google Maps iframe (https://maps.app.goo.gl/P87DF1ftjVhMzjde6), live "Open Now" / "Closed" indicator based on 8AM-9PM IST hours, nearest metro station info, "Book a Table" WhatsApp button.
- R7. Local SEO & Technical Quality: Schema.org LocalBusiness JSON-LD, OpenGraph meta tags, Google Analytics 4 placeholder, lazy-load images, zero console errors, all internal/external links valid, HTML validation.
- R8. Production-Level Polish: Smooth scroll-triggered animations for section entries, consistent typography hierarchy, professional spacing/whitespace, mobile-first responsive (320px to 4K), touch-optimized, custom bamboo cursor (desktop only, hidden on touch), footer with social links, hours, "Franchise Enquiries" mailto link.

## KEY DELIVERABLES & PROCESS
1. Maintain your own BRIEFING.md and progress.md in your working directory. Keep progress.md regularly updated with concrete milestone statuses.
2. Formulate and maintain an execution plan and architecture decomposition.
3. Decompose and dispatch specialized subagents to implement, review, test, and audit.
4. Verify all acceptance criteria rigorously (test with `python3 server.py` on port 8080).
5. Report completion when all acceptance criteria are met.
