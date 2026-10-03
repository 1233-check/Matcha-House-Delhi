# Original User Request

## 2026-10-02T17:24:19Z

Elevate the Matcha House Delhi landing page to a production-ready, corporate-level luxury website. This is an existing HTML/CSS/JS project for a premium matcha café in New Delhi. The site already has navigation, hero section, editorial "Our Story" layout, a full 32-item menu, taste profiler quiz, interactive map, weather widget, and footer. The primary deliverable is a photorealistic, real-time 3D matcha cup rendered entirely in Three.js (no external .glb/.obj files — build geometry procedurally). Secondary deliverables include comprehensive UX polish, smooth scroll transitions, mobile-first optimization, and performance tuning so the site feels like a flagship luxury brand experience.

Working directory: /Users/iyumriba/Documents/antigravity/Matcha House Delhi
Integrity mode: development

The project already has Three.js r164 loaded via CDN importmap. The current `cup3d.js` file contains a partial 3D implementation that may be used as a starting point or rewritten. All existing sections (menu, editorial, quiz, map, footer) should be preserved and polished — do not remove content.

## Requirements

### R1. Photorealistic 3D Matcha Cup
Build a real-time 3D matcha cup scene rendered on the `<canvas id="cupCanvas">` element in the hero section. The cup must look like a real iced matcha latte — tapered glass tumbler with visible thickness, matcha liquid fill with animated froth surface, 3-4 irregular ice cubes, and floating splash/droplet particles. Use physically-based rendering (PBR) with glass transmission/refraction, cinematic 3-point lighting, and an environment map for realistic reflections. The cup must auto-rotate smoothly, support drag-to-spin (mouse + touch), and respond to scroll (tilt/fade as user scrolls past the hero). Target 60fps on modern laptops, 30fps+ on mid-range phones.

### R2. Smooth Transitions & Scroll Polish
Every section transition must feel silky smooth. Implement scroll-triggered fade-in animations for section entries (editorial, menu, taste profiler, map, footer). The hero-to-content scroll transition should be seamless — no visual jumps or layout shifts. All hover states, button interactions, and navigation clicks must have polished transitions. The scroll progress bar at the top must accurately track page position.

### R3. Mobile-First Optimization
The entire site must render correctly and look premium on screens from 320px to 4K. The 3D canvas must resize properly on orientation change. The navigation must work on mobile (hamburger menu or equivalent). Touch interactions (drag-to-spin on the 3D model, quiz buttons, map interactions) must work flawlessly. Font sizes, spacing, and layout must adapt gracefully — no horizontal overflow, no text overlapping elements, no buttons too small to tap.

### R4. Performance & Production Quality
Total page load (excluding 3D textures) under 3 seconds on a 4G connection. No console errors or warnings. All links functional (internal anchors, Google Maps link, etc.). Semantic HTML with proper meta tags. The custom cursor should be visible and properly sized on desktop, hidden on touch devices. Weather widget must gracefully handle API failures.

## Acceptance Criteria

### 3D Model Quality
- [ ] A 3D matcha cup is visible and rendering in the hero section on page load
- [ ] The cup has visible glass transparency/refraction — you can see through the glass walls
- [ ] Matcha liquid is visible inside the cup with an animated froth/foam surface
- [ ] Ice cubes are visible inside/above the liquid surface
- [ ] The cup auto-rotates continuously when the user is not interacting
- [ ] Mouse drag rotates the cup smoothly with momentum/easing on release
- [ ] Touch drag on mobile rotates the cup
- [ ] Scrolling past the hero causes the cup to tilt/fade smoothly

### Interactions & Transitions
- [ ] All internal anchor links (`#about`, `#menu`, `#taste-profile`, `#location`, `#visit`) scroll smoothly to their targets
- [ ] Section elements fade/slide in as they enter the viewport during scrolling
- [ ] All buttons have visible hover/active states with smooth transitions
- [ ] The page loads without any visible layout shift or content jumping

### Mobile & Responsive
- [ ] No horizontal scrollbar appears on any screen width from 320px to 2560px
- [ ] All text is legible without zooming on a 375px-wide screen
- [ ] The 3D canvas resizes correctly on window resize and orientation change
- [ ] Touch interactions work for all interactive elements (quiz, map button, menu scroll)

### Performance & Quality
- [ ] Zero JavaScript errors in the browser console on page load and during interaction
- [ ] The 3D scene renders at 30fps+ (measured via requestAnimationFrame timing)
- [ ] All <a href> links point to valid targets (no dead links)
- [ ] The page passes basic HTML validation (no unclosed tags, no duplicate IDs)

## Verification Resources

The project can be served locally with `python3 server.py` on port 8080. Three.js is loaded via CDN importmap (no build step needed). Test by opening http://localhost:8080 in a browser.

## 2026-10-02T22:33:45Z

Rebuild the Matcha House Delhi website to production-quality, corporate-level standard that drives real revenue for a small premium matcha café in Delhi, India. This is an existing HTML/CSS/JS project.

Use all agents. Assign roles that agents are best at for maximum optimization and utilization of resources.

Working directory: /Users/iyumriba/Documents/antigravity/Matcha House Delhi
Integrity mode: development

The project uses Three.js r164 via CDN importmap, pure static HTML/CSS/JS served by a Python HTTP server (server.py on port 8080). No build step.

## CRITICAL CONSTRAINT

> **DO NOT MODIFY THE HERO SECTION.** Lines 45-52 of index.html (the `<header class="hero" id="home">` block containing the cupCanvas, hero-content div, h1, p, and btn-secondary link) must remain EXACTLY as they are. Do not change any CSS that affects the hero section's appearance. The hero section is final and approved.

Everything else on the page can be rebuilt, enhanced, or replaced.

## Context

This website will be pitched to the café owner tomorrow. The goal is a website that brings REAL MONEY and REAL PEOPLE to the café. Every feature must have a clear revenue or customer-acquisition purpose.

The café has 32 real menu items across 3 categories (Pure & Refreshing, Signature Lattes, Clouds/Fusions/Treats) with prices ranging from ₹200-₹395. They offer dairy and oat milk (₹80 extra). Sweeteners: sugar syrup, honey, stevia. Google Maps link: https://maps.app.goo.gl/P87DF1ftjVhMzjde6

## Requirements

### R1. Revenue-Driving Menu Section
Rebuild the menu with category tabs/filters, hover cards showing ingredient tags, "🔥 Popular" and "✨ New" badges on select items, and a WhatsApp ordering button per item that opens a pre-filled WhatsApp message (use wa.me link format). Add an oat milk toggle that shows +₹80 pricing in real-time. All 32 existing menu items with correct prices must be preserved.

### R2. WhatsApp-First Customer Funnel
Every call-to-action should funnel through WhatsApp (India's dominant messaging platform). This includes: "Order on WhatsApp" buttons on menu items, "Book a Table" button in the location section, "Join Matcha Insider" loyalty club sign-up that collects name via a simple form and opens a WhatsApp message to join, and event booking buttons. Use wa.me/919999999999 as the placeholder phone number.

### R3. Events & Workshops Section (NEW)
Add a "Matcha Masterclass" section with tiered pricing (Basic ₹1,500 / Premium ₹2,500), a visual date display, limited-seats counter for urgency, and a WhatsApp booking button. This is a high-margin revenue stream (₹22,500/event).

### R4. Social Proof Section (NEW)
Add a reviews/testimonials carousel with 5-6 realistic curated reviews (make them feel authentic — mention specific drinks, the ambiance, staff). Include star ratings. Add an Instagram feed placeholder section. This builds trust and justifies premium ₹350-400 pricing.

### R5. Loyalty Program Section (NEW)
"Matcha Insider" WhatsApp club — a sign-up form (name field + WhatsApp button) with the hook: "Join for a free matcha cookie on your next visit." This builds the first-party customer database for remarketing at zero cost.

### R6. Enhanced Location Section
Replace the static map image with an embedded Google Maps iframe (use the provided Google Maps link). Add live "Open Now" / "Closed" indicator based on operating hours (8AM-9PM daily, IST). Add nearest metro station info. Add a "Book a Table" WhatsApp button.

### R7. Local SEO & Technical Quality
Add Schema.org LocalBusiness JSON-LD structured data in the head. Add proper OpenGraph meta tags for social sharing. Add Google Analytics 4 placeholder (gtag.js with a placeholder measurement ID). Ensure all images lazy-load. Zero console errors. All internal/external links valid. Page must pass basic HTML validation.

### R8. Production-Level Polish
The entire page must feel like it was built by a top agency. Smooth scroll-triggered animations for section entries. Consistent typography hierarchy. Professional spacing and whitespace. Mobile-first responsive design (320px to 4K). Touch-optimized interactions. The custom bamboo cursor (64px, drop-shadow) stays on desktop, hidden on touch devices. Footer with social links, operating hours, and a "Franchise Enquiries" mailto link.

## Acceptance Criteria

### Hero Section Integrity
- [ ] The hero section (lines 45-52 of the original index.html) is byte-for-byte identical to the original
- [ ] No CSS changes affect the hero section's visual appearance

### Menu Completeness
- [ ] All 32 menu items are present with correct names and prices
- [ ] Category filtering works (Pure & Refreshing | Signature Lattes | Clouds & Treats)
- [ ] WhatsApp order buttons generate correct pre-filled messages including the drink name
- [ ] Oat milk toggle adds ₹80 to displayed prices

### Revenue Features
- [ ] Events section displays with pricing, date, seats counter, and WhatsApp booking
- [ ] Loyalty sign-up form collects name and generates WhatsApp join link
- [ ] Social proof section shows reviews with star ratings
- [ ] Location section has embedded Google Maps iframe and "Book a Table" button

### Technical Quality
- [ ] Zero JavaScript console errors on page load and during interaction
- [ ] Schema.org JSON-LD validates as LocalBusiness type
- [ ] No horizontal scrollbar on any viewport from 320px to 2560px
- [ ] All anchor links resolve to valid targets
- [ ] Page loads without visible layout shift
- [ ] All text legible without zooming on 375px screen

### Production Polish
- [ ] Scroll-triggered entrance animations on all sections
- [ ] Consistent hover states on all interactive elements
- [ ] Footer has social links, hours, and franchise enquiry link
- [ ] Custom cursor visible on desktop, hidden on mobile/touch

## Verification Resources


## 2026-10-03T14:32:47Z

This is a single self-contained fix; keep it small and focused. 
Replace the "Secret Whisk Ritual" section with a creative live video feed that features a parallax scroll effect, utilizing two distinct video assets.

Working directory: /Users/iyumriba/Documents/antigravity/Matcha House Delhi

## Requirements

### R1. Remove the Whisk Ritual
Remove the Sketchfab 3D embed, the ritual text, and the secret code reveal logic from `index.html` and `scroll-whisk.js`. Ensure no dead JavaScript or CSS remains from this section.

### R2. Implement a Creative Dual-Video Live Feed
Replace the section with a creative layout using two HTML5 `<video>` elements (`assets/igexport-DcqnJUgM27f.mp4` and `assets/igexport-DTxVGL-D-BI.mp4`). Both must be set to autoplay, loop, and muted. The layout should look high-end and corporate (e.g., side-by-side, overlapping, or picture-in-picture).

### R3. Parallax Scroll Effect
Implement a parallax scroll animation so that as the user scrolls down, the video feed container(s) slide up at a different speed relative to the rest of the page, smoothly moving out of view.

## Acceptance Criteria

### Implementation Quality
- [ ] The Sketchfab iframe and associated ritual DOM elements are completely removed.
- [ ] Both video elements play automatically on load without sound.
- [ ] The video layout is visually sophisticated and doesn't break responsive design on mobile.
- [ ] The video containers exhibit a visible parallax translation relative to the document scroll position.
- [ ] No JavaScript console errors occur during scrolling.

## 2026-10-03T14:52:38Z

URGENT DESIGN DIRECTION UPDATE FROM USER:

The user has provided a reference design (3Motional Elegance Portrait After Effects Template style). They want the dual-video live feed section redesigned with the following aesthetic:

1. **Dark, textured cinematic background** — starry/grainy dark backdrop behind the video section (NOT the current cream/green)
2. **Floating 3D isometric video cards** — the two video feeds should appear to float in 3D space at slight angles/rotations, like product showcase mockups
3. **Geometric framing** — use geometric cutout shapes (circles, arches, clean lines) as decorative frames or overlays around the videos
4. **Typography overlays** — elegant, large serif or display typography layered over/around the videos (the current "Artistry in Real Time" heading should be more dramatic)
5. **Side-by-side with depth** — videos presented like the portrait template showcase style, with slight 3D perspective transforms creating depth
6. **Premium visual effects** — subtle glitch text animations, floating elements, glass/frosted overlays

This is the user's creative vision. The implementation should maintain corporate-level professionalism while being visually dramatic and "cool". Think luxury fashion brand video showcase, not a simple grid.

Apply these design changes to the live-feed-section CSS and HTML as needed. Keep the parallax scroll behavior and video autoplay functionality intact.
