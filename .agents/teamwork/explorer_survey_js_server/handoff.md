# Handoff Report: JS Architecture & Server Survey

## 1. Observation

### 1.1 Server Architecture (`server.py`)
- **File path**: `/Users/iyumriba/Documents/antigravity/Matcha House Delhi/server.py` (lines 1–13):
  ```python
  import http.server
  import functools

  class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
      def end_headers(self):
          self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
          self.send_header('Pragma', 'no-cache')
          self.send_header('Expires', '0')
          super().end_headers()

  if __name__ == '__main__':
      http.server.test(HandlerClass=NoCacheHandler, port=8080)
  ```
- **Binding behavior**:
  - Python version on host: Python 3.9.6 (`/Library/Developer/CommandLineTools/Library/Frameworks/Python3.framework/Versions/3.9/lib/python3.9/http/server.py`).
  - `http.server.test(..., port=8080)` starts a `ThreadingHTTPServer` bound to `""` (dual-stack `::` / `0.0.0.0`) on port 8080.
  - When invoked in host environment: `HTTP/1.0 200 OK`, `Server: SimpleHTTP/0.6 Python/3.9.6`, `Cache-Control: no-store, no-cache, must-revalidate, max-age=0`.
  - In sandboxed shell environment without bypass: environment variables `http_proxy=http://127.0.0.1:52456` intercept localhost traffic, producing `HTTP/1.1 403 Forbidden` / `Port 8080 not allowed for HTTP`. When curl/browsers connect directly on the host or with bypass, port 8080 binds and serves cleanly.
- **MIME types**:
  - Python's `mimetypes.guess_type` resolves:
    - `index.html` -> `text/html`
    - `styles.css` -> `text/css`
    - `script.js` -> `text/javascript`
    - `cup3d.js` -> `text/javascript`
    - `scroll-whisk.js` -> `text/javascript`
    - `assets/spill.png` -> `image/png`
    - `assets/map.png` -> `image/png`
  - Browser ES module import (`<script type="module" src="cup3d.js">`) requires `text/javascript` or `application/javascript`, which `server.py` satisfies.
- **Pure Static Server Constraint**:
  - `SimpleHTTPRequestHandler` provides GET and HEAD file serving only. It does not provide POST endpoints, sessions, or backend database storage. All dynamic features (WhatsApp ordering, state toggling, hours checking, form triggers) must execute entirely in client-side JavaScript.

---

### 1.2 Existing JavaScript Files & DOM Interactions

#### `cup3d.js` (lines 1–171)
- **Import & Setup**:
  - Line 7: `import * as THREE from 'three';` (resolved via CDN importmap in `index.html` lines 12–19 targeting Three.js r164.1).
  - Lines 9–10:
    ```javascript
    const canvas = document.getElementById('cupCanvas');
    const section = document.getElementById('home');
    ```
  - Lines 14–17:
    ```javascript
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    ```
  - Lines 21–22: `const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);`
  - Lines 27–43: Uniforms loading `assets/spill.png` and `assets/spill-depth.png`.
  - Lines 45–99: `THREE.ShaderMaterial` implementing a 2.5D depth-displacement shader across a `PlaneGeometry(2, 2)`.
  - Lines 110–129: Mouse tracking on `section` (`#home`) and device orientation on `window`.
  - Lines 134–146: Animation loop via `requestAnimationFrame` with mouse easing (`currentMouse += (targetMouse - currentMouse) * 0.08`).
  - Lines 149–169: Resize event handler adjusting camera aspect and mesh scale.
- **Hero Constraint Relationship**:
  - `index.html` lines 45–52 contain:
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
  - `styles.css` lines 468–478 styles `#cupCanvas` with `position: absolute; width: 100%; height: 100%; pointer-events: auto; mix-blend-mode: multiply;`.
  - The hero HTML structure is strictly immutable. All 3D rendering must bind to `<canvas id="cupCanvas">`.

#### `script.js` (lines 1–284)
- **DOM Queries & Listeners**:
  - Lines 3–33: 3D parallax/tilt on `.perspective-container`, `.tilt-element`, `.glass-orb` with mouse tracking (`mousemove`, `mouseleave`).
  - Lines 36–116: Whisk ritual mini-game:
    - Queries `.ritual-bowl-container`, `.progress-ring__circle`, `#secretReveal`.
    - Updates SVG circle `strokeDashoffset`.
    - Accumulates mouse drag distance or touch moves to reach 100% progress, turning circle green (`#4A5D23`) and activating `#secretReveal`.
    - Interval timer (lines 58–63) decays progress every 100ms when idle.
  - Lines 119–133: Scroll animations via `IntersectionObserver` observing `.about-content h2, .about-content p, .ritual-text h2` (fades from opacity 0 / translateY 20px).
  - Lines 135–166: Live weather widget:
    - Calls `https://api.open-meteo.com/v1/forecast?latitude=28.6139&longitude=77.2090&current_weather=true`.
    - Modifies `#weatherIcon` and `#weatherText`.
  - Lines 169–200: Custom cursor:
    - Manipulates `#cursorDot` and `#cursorOutline`.
    - Mousemove listener tracks pointer; mouseenter/mouseleave expands outline on interactables (`a, button, .tilt-element, .weather-widget`).
    - **Defect observed**: Does not detect touch devices. CSS line 31 has `cursor: none;`, creating severe UX degradation on mobile devices.
  - Lines 203–211: Scroll progress bar updating `#scrollProgress.style.width`.
  - Lines 215–283: Global functions `window.nextSlide`, `window.finishQuiz`, `window.resetQuiz` for taste profiler (`#tasteQuiz`, `#quizSlide1..3`, `#tasteResult`, `#resultDrinkName`, `#resultDrinkDesc`).

#### `scroll-whisk.js` (lines 1–96)
- **Sketchfab Integration**:
  - Line 2: `const iframe = document.getElementById('sketchfab-iframe');`
  - Lines 17–42: `const client = new Sketchfab('1.12.1', iframe); client.init('a1b560fb8dfb4195a1891dda5119c658', ...)`
  - Line 33: `error: function onError() { console.error('Sketchfab API error'); }`
  - Lines 54–94: Scroll listener modifying `#secret-ritual` height to `200vh`, `.ritual-container` to sticky `10vh`, rotating Sketchfab camera, and setting `isUnlocked = true`.
- **Defects & Conflicts**:
  - `console.error('Sketchfab API error')` triggers when Sketchfab is unreachable or offline, directly violating acceptance criterion "Zero JavaScript errors in the browser console".
  - If external script `https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js` fails to load, `new Sketchfab(...)` throws unhandled `ReferenceError`.
  - Directly conflicts with `script.js` lines 36–116 over control of `.progress-ring__circle` and `#secretReveal`.

---

## 2. Logic Chain

1. **Server Architecture**:
   - `server.py` provides standard Python `SimpleHTTPRequestHandler` serving with no-cache headers.
   - Because no backend APIs exist, all 8 project requirements (R1–R8) must run client-side.
   - Port 8080 is the designated port; static files are resolved relative to the repository root.

2. **Hero Immutability vs Canvas Scripting**:
   - The user specification dictates that lines 45–52 of `index.html` and hero CSS must remain byte-for-byte identical.
   - The canvas element `<canvas id="cupCanvas"></canvas>` is located in line 46.
   - `cup3d.js` attaches to this canvas ID. Therefore, any Three.js rendering enhancements (procedural 3D tumbler, liquid, ice, auto-rotation, scroll response) can be completely upgraded inside `cup3d.js` without violating the hero HTML/CSS constraint.

3. **Menu Item Preservation & State Management (R1)**:
   - Inspection of `index.html` lines 133–369 verified exactly 32 menu items across 3 categories:
     - 11 items in "Pure & Refreshing" (₹250–₹380)
     - 11 items in "Signature Lattes" (₹310–₹395)
     - 10 items in "Clouds, Fusions & Treats" (₹200–₹395)
   - Dynamic tab filtering requires showing/hiding items based on active category without modifying original menu data.
   - Oat milk toggle requires an active state boolean (`isOatMilkActive`), dynamically computing:
     $$\text{Display Price} = \text{Base Price} + (\text{isOatMilkActive} \ ? \ 80 : 0)$$
   - WhatsApp links on each item must dynamically read the current item name, calculated price, and milk selection to construct the pre-filled URL.

4. **Conversion Funnels (R2, R3, R5, R6)**:
   - Every user CTA funnels to WhatsApp `wa.me/919999999999`.
   - Client-side URL generators must use `encodeURIComponent` to guarantee valid query parameters.
   - Loyalty club (R5) requires form validation (preventing blank submissions) before triggering `window.open(waUrl, '_blank')`.
   - Event booking (R3) must dynamically inject selected tier (Basic ₹1,500 vs Premium ₹2,500) into the prefilled WhatsApp text.

5. **Store Hours Calculation (R6)**:
   - Operating hours are 8:00 AM – 9:00 PM (08:00 to 21:00) IST daily.
   - User browsers may be in any timezone. Evaluating `new Date().getHours()` would incorrectly evaluate user local time instead of Delhi time.
   - `Intl.DateTimeFormat` with `timeZone: 'Asia/Kolkata'` provides timezone-accurate Delhi time regardless of user device timezone.

6. **Error Elimination & Robustness (R7, R8)**:
   - Eliminating the external Sketchfab dependency prevents `ReferenceError` and `console.error`.
   - Wrapping fetch in robust status checks prevents unhandled promise rejections.
   - Detecting touch capabilities disables the custom cursor on mobile to avoid breaking mobile touch interactions.

---

## 3. Caveats

1. **Local CLI Sandbox Proxy**:
   - In this development container, `run_command` without bypass runs behind an HTTP proxy that restricts port 8080 connections. Verification of port 8080 serving should be performed with unsandboxed execution or directly by the orchestrator/user in the browser.
2. **Third-Party CDN Dependencies**:
   - `index.html` relies on CDN importmaps for Three.js (`https://cdn.jsdelivr.net/npm/three@0.164.1/...`) and Google Fonts. In offline environments, fallback mechanisms or cached assets must be respected.
3. **Hero Anchor Reference**:
   - The hero button `<a href="#secret-ritual" class="btn-secondary">Unlock the Secret</a>` is immutable. An element with `id="secret-ritual"` must be retained in the DOM to avoid broken internal navigation.
4. **Google Maps Embed**:
   - The short link `https://maps.app.goo.gl/P87DF1ftjVhMzjde6` cannot be loaded in an `<iframe>` directly due to Google's X-Frame-Options policy. The iframe must use an embed-formatted URL (`https://maps.google.com/maps?q=Hauz+Khas,+New+Delhi&output=embed`), while the short link is preserved for the "Get Directions" link.

---

## 4. Conclusion & Dynamic Architecture Blueprint

To fulfill all requirements R1–R8 without touching the hero section HTML/CSS, the JavaScript architecture should be structured into clear, robust modules within `script.js` (or cleanly imported helper modules) and `cup3d.js`:

### Dynamic Architecture Specification

#### Module A: Menu Filtering & Real-time Oat Milk Toggle (R1)
- **DOM Structure**:
  - Category tabs: `<button class="menu-tab" data-category="all|pure|latte|cloud">`
  - Oat milk toggle: `<input type="checkbox" id="oatMilkToggle">` with label "Add Oat Milk (+₹80)"
  - 32 menu cards: `<article class="menu-card" data-category="..." data-base-price="310" data-name="Classic Matcha Latte">`
  - Elements per card: name, description, tags, price display (`<span class="price-val">₹310</span>`), WhatsApp button.
- **Logic**:
  ```javascript
  let isOatMilk = false;

  function updateMenuPrices() {
      document.querySelectorAll('.menu-card').forEach(card => {
          const basePrice = parseInt(card.dataset.basePrice, 10);
          const currentPrice = isOatMilk ? (basePrice + 80) : basePrice;
          const priceEl = card.querySelector('.price-val');
          if (priceEl) priceEl.textContent = `₹${currentPrice}`;
          
          const waBtn = card.querySelector('.wa-order-btn');
          if (waBtn) {
              const name = card.dataset.name;
              const milk = isOatMilk ? 'Oat Milk (+₹80)' : 'Dairy Milk';
              const text = `Hi Matcha House Delhi! I would like to order: *${name}* (₹${currentPrice}, ${milk}). Please confirm availability!`;
              waBtn.href = `https://wa.me/919999999999?text=${encodeURIComponent(text)}`;
          }
      });
  }

  function initMenuFilters() {
      const tabs = document.querySelectorAll('.menu-tab');
      const cards = document.querySelectorAll('.menu-card');
      tabs.forEach(tab => {
          tab.addEventListener('click', () => {
              tabs.forEach(t => t.classList.remove('active'));
              tab.classList.add('active');
              const cat = tab.dataset.category;
              cards.forEach(card => {
                  const match = (cat === 'all' || card.dataset.category === cat);
                  card.classList.toggle('hidden', !match);
              });
          });
      });
  }
  ```

#### Module B: Live IST Operating Hours Indicator (R6)
- **Logic**:
  ```javascript
  function updateStoreStatus() {
      const now = new Date();
      const istString = now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata', hour12: false });
      const istDate = new Date(istString);
      const hours = istDate.getHours();
      const minutes = istDate.getMinutes();
      const totalMinutes = hours * 60 + minutes;

      // 8:00 AM (480 min) to 9:00 PM (1260 min)
      const isOpen = (totalMinutes >= 480 && totalMinutes < 1260);
      const statusBadge = document.getElementById('storeStatusBadge');
      if (statusBadge) {
          statusBadge.className = `store-status-badge ${isOpen ? 'open' : 'closed'}`;
          statusBadge.innerHTML = isOpen 
              ? `<span class="status-dot green"></span> Open Now • Closes at 9:00 PM`
              : `<span class="status-dot amber"></span> Closed • Opens at 8:00 AM`;
      }
  }
  ```

#### Module C: WhatsApp CTAs & Funnels (R2, R3, R5, R6)
- **Table Booking (R6)**:
  `https://wa.me/919999999999?text=Hi%20Matcha%20House%20Delhi!%20I%20would%20like%20to%20reserve%20a%20table%20at%20your%20Hauz%20Khas%20caf%C3%A9.`
- **Loyalty Club Form (R5)**:
  ```javascript
  function initLoyaltyForm() {
      const form = document.getElementById('loyaltyForm');
      const nameInput = document.getElementById('loyaltyName');
      if (!form || !nameInput) return;

      form.addEventListener('submit', (e) => {
          e.preventDefault();
          const name = nameInput.value.trim();
          if (!name) return;
          const text = `Hi Matcha House Delhi! My name is *${name}*. I want to join the Matcha Insider Club and claim my complimentary free matcha cookie! 🍪🍵`;
          window.open(`https://wa.me/919999999999?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
      });
  }
  ```
- **Events Masterclass Booking (R3)**:
  - Supports Basic (₹1,500) and Premium (₹2,500) buttons generating respective prefilled booking URLs.
  - Interactive urgency seats counter: displays remaining seats (e.g. "Only 4 seats remaining of 12").

#### Module D: Social Proof / Reviews Carousel (R4)
- **Logic**:
  - Multi-slide carousel container containing 5–6 curated authentic reviews with star ratings (mentioning signature drinks: Dirty Yuzu Matcha, Strawberry Matcha Latte, Masterclass, etc.).
  - Next / Previous controls, indicator dots, auto-play (interval 5000ms), paused on hover/touch.
  - Swipe support using `touchstart`, `touchmove`, `touchend`.

#### Module E: Touch-Aware Custom Bamboo Cursor (R8)
- **Logic**:
  ```javascript
  function initCursor() {
      const isTouch = window.matchMedia('(pointer: coarse)').matches || ('ontouchstart' in window);
      const cursorDot = document.getElementById('cursorDot');
      const cursorOutline = document.getElementById('cursorOutline');
      if (isTouch) {
          if (cursorDot) cursorDot.style.display = 'none';
          if (cursorOutline) cursorOutline.style.display = 'none';
          document.body.style.cursor = 'auto';
          return;
      }
      // Desktop cursor tracking implementation
  }
  ```

#### Module F: Console Error Mitigation & Deprecation of Sketchfab
- **Action**:
  - Remove `scroll-whisk.js` and the external `sketchfab-viewer` script.
  - Retain `<section id="secret-ritual">` so hero link `#secret-ritual` navigates cleanly.
  - Replace Sketchfab iframe with a clean, CSS/JS ceremonial whisking interaction that operates with zero network dependencies and zero console errors.

---

## 5. Verification Method

To independently verify the survey observations and architecture:

1. **Verify Server Port 8080 & MIME Types**:
   Run in terminal:
   ```bash
   python3 -c "import http.server, mimetypes; print('Handler:', http.server.SimpleHTTPRequestHandler); print('JS mime:', mimetypes.guess_type('script.js'))"
   ```
   Confirm output indicates `'text/javascript'`.

2. **Verify Server Execution**:
   Start server in project directory:
   ```bash
   python3 server.py
   ```
   Open `http://localhost:8080` in a browser and check Network tab:
   - Status 200 on `index.html`, `styles.css`, `script.js`, `cup3d.js`.
   - Headers include `Cache-Control: no-store, no-cache, must-revalidate, max-age=0`.

3. **Verify Hero Section Integrity**:
   Inspect lines 45–52 of `index.html`:
   ```bash
   sed -n '45,52p' index.html
   ```
   Confirm exact `<header class="hero" id="home">` block is intact.

4. **Verify Menu Item Count**:
   Count all 32 menu items in `index.html`:
   ```bash
   grep -c 'class="menu-item"' index.html
   ```
   Confirm count equals 32.

5. **Invalidation Conditions**:
   - The analysis would be invalidated if server port was changed from 8080 or required custom server-side routing (e.g. Node/Express, Django, Flask).
   - Invalidation would occur if the hero section HTML lines 45–52 were modified or deleted.
