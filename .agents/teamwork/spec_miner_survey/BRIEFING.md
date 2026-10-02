# BRIEFING — 2026-10-02T22:43:00Z

## Mission
Extract exact hero section byte baseline from lines 45-52 of index.html, inventory all 32 menu items with prices/categories/ingredients, and document requirements R1-R8 with acceptance criteria into handoff.md.

## 🔒 My Identity
- Archetype: teamwork_preview_spec_miner
- Roles: Specification Miner
- Working directory: /Users/iyumriba/Documents/antigravity/Matcha House Delhi/.agents/teamwork/spec_miner_survey
- Original parent: 279b5f99-1cae-4d02-b131-3741de12e9ca
- Milestone: Survey Phase

## 🔒 Key Constraints
- DO NOT MODIFY THE HERO SECTION: Lines 45-52 of index.html (<header class="hero" id="home">) must remain EXACTLY as they are byte-for-byte.
- Read-only specification miner: do NOT implement anything. Probe, extract, verify, and document authoritative spec.
- Write only to own folder (/Users/iyumriba/Documents/antigravity/Matcha House Delhi/.agents/teamwork/spec_miner_survey/).
- Full 5-component handoff report (Observation, Logic Chain, Caveats, Conclusion, Verification Method) + Specification Miner tables (Features Discovered, Edge Cases).

## Loaded Skills
- None specified in dispatch.

## Current Parent
- Conversation ID: 279b5f99-1cae-4d02-b131-3741de12e9ca
- Updated: not yet

## Task Summary
- **What to build**: Specification discovery report (handoff.md) covering hero byte baseline, 32 menu items inventory, and R1-R8 requirements & acceptance criteria.
- **Success criteria**: Exact byte baseline with SHA-256 and byte length; full 32-item menu inventory with ingredients and prices; requirements R1-R8 mapped with all specific parameters (wa.me, Schema.org, oat milk +₹80, maps URL, 8AM-9PM IST hours, masterclass tiers).
- **Interface contracts**: ORIGINAL_REQUEST.md, index.html, script.js
- **Code layout**: Static site with server.py on port 8080.

## Key Decisions Made
- Calculated and verified hero byte baseline: 364 bytes, SHA-256 `fdbd20f70c1fd43b3355bd704d15321568c43ee92782059a21141d265a84932b`.
- Parsed and itemized all 32 menu items across 3 categories (Pure & Refreshing [11], Signature Lattes [11], Clouds, Fusions & Treats [10]) with full ingredient breakdowns and base prices (₹200 - ₹395).
- Mapped all requirements R1-R8 with concrete URL formats, calculations, Schema.org JSON-LD, and IST timezone logic.
- Generated comprehensive `handoff.md` and verified with automated test assertions.

## Artifact Index
- handoff.md — Comprehensive specification discovery and survey report
- progress.md — Task completion status and heartbeat
- DISPATCH.md — Task instructions and dispatch log
