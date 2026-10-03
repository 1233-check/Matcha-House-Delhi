# BRIEFING — Implementer Round 1
Timestamp: 2026-10-03T14:35:00Z

## Mission
Implement replacement of "Secret Whisk Ritual" with a creative dual-video live feed featuring parallax scroll effect and clean up all dead code/DOM elements, preserving hero section integrity.

## Identity & Role
- Archetype: implementer@swe_light, qa@swe_light
- Working Directory: /Users/iyumriba/Documents/antigravity/Matcha House Delhi/.agents/teamwork/teamwork_preview_implementer_r1
- Target Workspace: /Users/iyumriba/Documents/antigravity/Matcha House Delhi
- Parent Agent: swe_1 (18c4f081-15d2-4aa0-b62c-da45c0b24d1a)

## Core Requirements & Scope
1. **R1. Remove the Whisk Ritual**:
   - Remove Sketchfab 3D embed, ritual text, secret code reveal logic ("MATCHA-VIP-DELHI", progress ring, chasen emoji/graphic, bowl graphic).
   - Clean up dead JavaScript in `script.js` and `scroll-whisk.js`.
   - Clean up dead CSS in `styles.css`.
2. **R2. Creative Dual-Video Live Feed**:
   - Two HTML5 `<video>` elements using `assets/igexport-DcqnJUgM27f.mp4` and `assets/igexport-DTxVGL-D-BI.mp4`.
   - Autoplay, loop, muted, playsinline.
   - High-end corporate/luxury tea bar aesthetic with glassmorphism, camera indicators, telemetry stats.
3. **R3. Parallax Scroll Effect**:
   - Differential vertical scroll animation (`translate3d(0, -Ypx, 0)`) so video feed containers slide up at different speeds relative to page scroll, smoothly moving out of view.
4. **Critical Constraints**:
   - Hero section (lines 52-59, baseline SHA256 `fdbd20f70c1fd43b3355bd704d15321568c43ee92782059a21141d265a84932b`, len 364) must remain byte-for-byte identical.
   - Section must retain `id="secret-ritual"` as anchor target for Hero button `<a href="#secret-ritual" class="btn-secondary">Unlock the Secret</a>`.
   - No dead JS/CSS.
   - 0 console errors during scrolling.
   - Fully responsive down to 320px viewport without overflow.
