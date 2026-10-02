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
