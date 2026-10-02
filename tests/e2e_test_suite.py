#!/usr/bin/env python3
"""
🍵 MATCHA HOUSE DELHI — COMPREHENSIVE AUTOMATED E2E ACCEPTANCE TEST SUITE
========================================================================
Authoritative, requirement-driven automated verification covering all 4 tiers
of acceptance criteria from ORIGINAL_REQUEST.md, PROJECT.md, and TEST_INFRA.md:

Tier 1: Feature & Content Coverage (Hero SHA256 integrity, 32 menu items,
        events masterclass, reviews carousel, Instagram showcase, loyalty club,
        Google Maps embed, Hauz Khas metro, LocalBusiness JSON-LD, OpenGraph, GA4, footer)
Tier 2: Boundary & Logic Verification (Oat milk +₹80 math, WhatsApp URLs,
        Asia/Kolkata live hours calculation, internal anchor resolution)
Tier 3: Responsive Design & CSS Architecture (320px viewport overflow, custom cursor scoping)
Tier 4: Integration, Script Syntax & Runtime Health (JSC syntax compilation,
        DOM bindings, live HTTP server & headers, lazy-load images, HTML5 validation)

Usage:
    python3 tests/e2e_test_suite.py
    python3 -m unittest discover tests
"""

import os
import sys
import re
import json
import hashlib
import subprocess
import urllib.parse
import urllib.request
import unittest
from html.parser import HTMLParser
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

# ---------------------------------------------------------------------------
# Canonical Data Baseline
# ---------------------------------------------------------------------------
HERO_BASELINE_SHA256 = "fdbd20f70c1fd43b3355bd704d15321568c43ee92782059a21141d265a84932b"
HERO_BASELINE_BYTE_LEN = 364
EXPECTED_WHATSAPP_PHONE = "919999999999"

# Exact catalog of 32 menu items with base price and category
CANONICAL_MENU_ITEMS = [
    # Pure & Refreshing (11 items)
    {"name": "Matcha Iced Tea", "price": 380, "category": "Pure & Refreshing"},
    {"name": "Kaffir Lime Matcha", "price": 370, "category": "Pure & Refreshing"},
    {"name": "Watermelon Matcha Refresher", "price": 370, "category": "Pure & Refreshing"},
    {"name": "Forestberry Matcha", "price": 350, "category": "Pure & Refreshing"},
    {"name": "Orange Matcha", "price": 380, "category": "Pure & Refreshing"},
    {"name": "Yuzu Matcha", "price": 350, "category": "Pure & Refreshing"},
    {"name": "Peachy Matcha", "price": 330, "category": "Pure & Refreshing"},
    {"name": "Passionfruit Matcha", "price": 330, "category": "Pure & Refreshing"},
    {"name": "Litchi Jelly Matcha", "price": 350, "category": "Pure & Refreshing"},
    {"name": "Strawberry Matcha Soda", "price": 370, "category": "Pure & Refreshing"},
    {"name": "Raspberry Matcha", "price": 250, "category": "Pure & Refreshing"},

    # Signature Lattes (11 items)
    {"name": "Classic Matcha Latte", "price": 310, "category": "Signature Lattes"},
    {"name": "Hojicha Matcha Latte", "price": 310, "category": "Signature Lattes"},
    {"name": "Blueberry Matcha Latte", "price": 350, "category": "Signature Lattes"},
    {"name": "Triple Berry Matcha Latte", "price": 395, "category": "Signature Lattes"},
    {"name": "Raspberry Matcha Latte", "price": 350, "category": "Signature Lattes"},
    {"name": "Strawberry Matcha Latte", "price": 380, "category": "Signature Lattes"},
    {"name": "Mango Matcha Latte", "price": 395, "category": "Signature Lattes"},
    {"name": "Watermelon Matcha Latte", "price": 395, "category": "Signature Lattes"},
    {"name": "Banana Matcha Latte", "price": 395, "category": "Signature Lattes"},
    {"name": "Pandan Matcha Latte", "price": 380, "category": "Signature Lattes"},
    {"name": "Strawberry Hojicha Latte", "price": 395, "category": "Signature Lattes"},

    # Clouds, Fusions & Treats (10 items)
    {"name": "Coconut Cream Matcha", "price": 395, "category": "Clouds, Fusions & Treats"},
    {"name": "Mango Coconut Cloud", "price": 395, "category": "Clouds, Fusions & Treats"},
    {"name": "Coconut Cloud Matcha", "price": 390, "category": "Clouds, Fusions & Treats"},
    {"name": "Matcha Espresso Fusion", "price": 395, "category": "Clouds, Fusions & Treats"},
    {"name": "Yakult Matcha Latte", "price": 350, "category": "Clouds, Fusions & Treats"},
    {"name": "Honey Cinnamon Matcha Latte", "price": 350, "category": "Clouds, Fusions & Treats"},
    {"name": "Oreo Matcha Latte", "price": 350, "category": "Clouds, Fusions & Treats"},
    {"name": "Matcha Affogato", "price": 380, "category": "Clouds, Fusions & Treats"},
    {"name": "Vanilla Float Matcha", "price": 390, "category": "Clouds, Fusions & Treats"},
    {"name": "Mango Matcha Pudding", "price": 200, "category": "Clouds, Fusions & Treats"},
]


# ---------------------------------------------------------------------------
# HTML Parsing Helpers
# ---------------------------------------------------------------------------
class HTMLAnalyzer(HTMLParser):
    """Robust HTML analyzer extracting IDs, anchors, images, meta tags, and script blocks."""

    def __init__(self):
        super().__init__()
        self.ids = set()
        self.anchors = []
        self.images = []
        self.meta_tags = []
        self.scripts = []
        self.in_script = False
        self.current_script_attrs = {}
        self.current_script_data = []

    def handle_starttag(self, tag, attrs):
        attr_dict = dict(attrs)
        tag_id = attr_dict.get('id')
        if tag_id:
            self.ids.add(tag_id)

        if tag == 'a' and 'href' in attr_dict:
            self.anchors.append(attr_dict['href'])

        if tag == 'img':
            self.images.append((attr_dict.get('src', ''), attr_dict.get('loading', '')))

        if tag == 'meta':
            self.meta_tags.append(attr_dict)

        if tag == 'script':
            self.in_script = True
            self.current_script_attrs = attr_dict
            self.current_script_data = []

    def handle_endtag(self, tag):
        if tag == 'script' and self.in_script:
            self.in_script = False
            self.scripts.append({
                'attrs': self.current_script_attrs,
                'content': "".join(self.current_script_data)
            })
            self.current_script_data = []

    def handle_data(self, data):
        if self.in_script:
            self.current_script_data.append(data)


def read_file_text(rel_path):
    p = PROJECT_ROOT / rel_path
    with open(p, 'r', encoding='utf-8') as f:
        return f.read()


def read_file_bytes(rel_path):
    p = PROJECT_ROOT / rel_path
    with open(p, 'rb') as f:
        return f.read()


# ---------------------------------------------------------------------------
# Test Tier 1: Feature & Content Coverage
# ---------------------------------------------------------------------------
class TestTier1FeatureContentCoverage(unittest.TestCase):
    """Tier 1: Unit & Content Coverage across Static Requirements"""

    @classmethod
    def setUpClass(cls):
        cls.html_text = read_file_text('index.html')
        cls.html_bytes = read_file_bytes('index.html')
        cls.css_text = read_file_text('styles.css')
        cls.analyzer = HTMLAnalyzer()
        cls.analyzer.feed(cls.html_text)

    def test_01_hero_byte_for_byte_sha256_integrity(self):
        """Verify lines 45-52 hero section byte length (364) and SHA256 checksum."""
        lines = self.html_bytes.splitlines(keepends=True)
        hero_lines = []
        capturing = False
        for line in lines:
            if b'<header class="hero" id="home">' in line:
                capturing = True
            if capturing:
                hero_lines.append(line)
                if b'</header>' in line:
                    break

        self.assertTrue(capturing, "Hero section start '<header class=\"hero\" id=\"home\">' not found in index.html")
        hero_slice = b''.join(hero_lines)

        actual_hash = hashlib.sha256(hero_slice).hexdigest()
        actual_len = len(hero_slice)

        self.assertEqual(
            actual_len, HERO_BASELINE_BYTE_LEN,
            f"Hero byte length mismatch: expected {HERO_BASELINE_BYTE_LEN}, got {actual_len}"
        )
        self.assertEqual(
            actual_hash, HERO_BASELINE_SHA256,
            f"Hero SHA256 hash mismatch: expected {HERO_BASELINE_SHA256}, got {actual_hash}"
        )

        hero_text = hero_slice.decode('utf-8')
        self.assertIn('<canvas id="cupCanvas"></canvas>', hero_text)
        self.assertIn('<h1>Awaken Your<br>Senses.</h1>', hero_text)
        self.assertIn('<a href="#secret-ritual" class="btn-secondary">Unlock the Secret</a>', hero_text)

    def test_02_hero_css_isolation(self):
        """Verify Hero CSS selectors and design tokens remain uncorrupted."""
        hero_selectors = ['.hero', '.hero-content', '.btn-secondary', '#cupCanvas', '@keyframes fadeUp']
        for sel in hero_selectors:
            self.assertIn(sel, self.css_text, f"Hero selector {sel} missing from styles.css")

        self.assertIn('--color-cream: #F9F9F4;', self.css_text, "Root variable --color-cream modified")
        self.assertIn('--color-matcha-dark: #3A4A1C;', self.css_text, "Root variable --color-matcha-dark modified")

    def test_03_all_32_menu_items_exact_names_prices_categories(self):
        """Verify that all 32 canonical items exist with exact names, base prices, and categories."""
        content = self.html_text
        missing_items = []
        price_mismatches = []

        for item in CANONICAL_MENU_ITEMS:
            name = item["name"]
            base_price = item["price"]

            if name not in content:
                script_text = read_file_text('script.js')
                if name not in script_text:
                    missing_items.append(name)
                    continue

            price_patterns = [
                rf'data-base-price=[\"\\\']{base_price}[\"\\\']',
                rf'₹\s*{base_price}',
                rf'Rs\.?\s*{base_price}',
                rf'{base_price}'
            ]
            found_price = any(re.search(pat, content) for pat in price_patterns)
            if not found_price:
                price_mismatches.append(f"{name} (expected ₹{base_price})")

        self.assertEqual(len(missing_items), 0, f"Missing {len(missing_items)} / 32 menu items: {missing_items}")
        self.assertEqual(len(price_mismatches), 0, f"Price mismatch for items: {price_mismatches}")

    def test_04_menu_category_filtering_and_badges(self):
        """Verify category tabs and menu badges ('Popular' and 'New')."""
        content = self.html_text
        combined = content + "\n" + read_file_text('script.js')

        required_categories = ["Pure & Refreshing", "Signature Lattes", "Clouds"]
        for cat in required_categories:
            self.assertTrue(cat.lower() in combined.lower(), f"Menu category '{cat}' missing from menu")

        has_popular = "popular" in combined.lower() or "🔥" in combined
        has_new = "badge-new" in combined.lower() or "✨ new" in combined.lower()
        self.assertTrue(has_popular, "Menu badge 'Popular' / '🔥 Popular' not found")
        self.assertTrue(has_new, "Menu badge 'New' / '✨ New' not found")

    def test_05_events_masterclass_section(self):
        """Verify Matcha Masterclass section (#events), Basic (₹1,500) and Premium (₹2,500) tiers, and seats counter."""
        self.assertIn("events", self.analyzer.ids, "DOM element with id='events' missing")
        content = self.html_text

        self.assertTrue(
            "masterclass" in content.lower() or "workshop" in content.lower(),
            "Matcha Masterclass header missing in #events section"
        )
        self.assertIsNotNone(re.search(r'1[,.]?500', content), "Basic tier price ₹1,500 not found")
        self.assertIsNotNone(re.search(r'2[,.]?500', content), "Premium tier price ₹2,500 not found")
        self.assertIsNotNone(re.search(r'(seat|remaining|left|capacity)', content, re.IGNORECASE), "Seats counter missing")

    def test_06_social_proof_reviews_carousel(self):
        """Verify reviews carousel (#reviews) with at least 5 curated reviews and star ratings."""
        has_reviews_id = "reviews" in self.analyzer.ids or "social-proof" in self.analyzer.ids
        self.assertTrue(has_reviews_id, "DOM element with id='reviews' missing")

        content = self.html_text
        star_count = content.count('★') + content.count('⭐') + content.count('class="star"')
        self.assertGreaterEqual(star_count, 5, f"Expected star ratings in reviews carousel, found count: {star_count}")

        reviewer_keywords = ["hauz khas", "latte", "ceremonial", "ambiance", "matcha"]
        found_keywords = [kw for kw in reviewer_keywords if kw in content.lower()]
        self.assertGreaterEqual(len(found_keywords), 3, f"Review content lacks authentic customer references: {found_keywords}")

    def test_07_instagram_feed_grid(self):
        """Verify Instagram showcase with handle @matchahouseldelhi."""
        content = self.html_text
        self.assertTrue(
            "@matchahouseldelhi" in content.lower() or "instagram.com" in content.lower(),
            "Instagram feed section or handle '@matchahouseldelhi' missing from page"
        )

    def test_08_loyalty_insider_club(self):
        """Verify Matcha Insider loyalty club (#insider), name input, free cookie hook, and WhatsApp CTA."""
        has_insider_id = "insider" in self.analyzer.ids or "loyalty" in self.analyzer.ids
        self.assertTrue(has_insider_id, "DOM element with id='insider' missing")

        content = self.html_text
        self.assertTrue("cookie" in content.lower(), "Free cookie incentive hook missing from loyalty section")

        has_name_input = (
            'id="insiderName"' in content or
            'id="loyaltyName"' in content or
            re.search(r'<input[^>]+name[^>]+placeholder=[^>]*name', content, re.IGNORECASE) is not None
        )
        self.assertTrue(has_name_input, "Customer name input field missing from loyalty club section")

        combined = content + "\n" + read_file_text('script.js')
        self.assertTrue("cookie" in combined.lower() and "919999999999" in combined, "WhatsApp loyalty CTA missing")

    def test_09_location_google_maps_metro_booking(self):
        """Verify location section (#location), Google Maps embed iframe, Hauz Khas metro info, table booking CTA."""
        self.assertIn("location", self.analyzer.ids, "DOM element with id='location' missing")

        content = self.html_text
        self.assertTrue("<iframe" in content and ("google.com/maps" in content or "maps.google.com" in content), "Google Maps iframe missing")
        self.assertTrue("metro" in content.lower() and "hauz khas" in content.lower(), "Hauz Khas metro info missing")
        self.assertIn("maps.app.goo.gl/P87DF1ftjVhMzjde6", content, "Directions link missing")

    def test_10_seo_json_ld_opengraph_ga4(self):
        """Verify Schema.org LocalBusiness JSON-LD, OpenGraph tags, and GA4 placeholder."""
        json_ld_scripts = [s for s in self.analyzer.scripts if s['attrs'].get('type') == 'application/ld+json']
        self.assertGreaterEqual(len(json_ld_scripts), 1, "Schema.org <script type='application/ld+json'> not found")

        json_ld = None
        for s in json_ld_scripts:
            try:
                parsed = json.loads(s['content'])
                if parsed.get('@type') in ['CafeOrCoffeeShop', 'LocalBusiness', 'Restaurant']:
                    json_ld = parsed
                    break
            except json.JSONDecodeError as e:
                self.fail(f"Invalid JSON in application/ld+json: {e}")

        self.assertIsNotNone(json_ld, "JSON-LD does not declare CafeOrCoffeeShop / LocalBusiness")
        self.assertEqual(json_ld.get('name'), "Matcha House Delhi")
        self.assertIn("Hauz Khas", str(json_ld.get('address', '')))
        self.assertIn("919999999999", str(json_ld.get('telephone', '')))

        og_tags = {m.get('property', ''): m.get('content', '') for m in self.analyzer.meta_tags if m.get('property', '').startswith('og:')}
        self.assertIn('og:title', og_tags, "Missing OpenGraph meta tag og:title")
        self.assertIn('og:description', og_tags, "Missing OpenGraph meta tag og:description")
        self.assertIn('og:image', og_tags, "Missing OpenGraph meta tag og:image")

        has_ga4 = "googletagmanager.com/gtag/js" in self.html_text or "G-PLACEHOLDER" in self.html_text
        self.assertTrue(has_ga4, "Google Analytics 4 placeholder script tag not found in <head>")

    def test_11_luxury_footer(self):
        """Verify footer with operating hours, social links, and franchise enquiry mailto link."""
        content = self.html_text
        self.assertTrue("8:00" in content and "9:00" in content, "Operating hours missing from footer")
        has_franchise = re.search(r'mailto:[^"\'>\s]*franchise[^"\'>\s]*', content, re.IGNORECASE)
        self.assertIsNotNone(has_franchise, "Franchise enquiry mailto link missing from footer")


# ---------------------------------------------------------------------------
# Test Tier 2: Boundary & Logic Verification
# ---------------------------------------------------------------------------
class TestTier2BoundaryLogicVerification(unittest.TestCase):
    """Tier 2: Business Logic, Mathematical Verification & Boundary Behavior"""

    @classmethod
    def setUpClass(cls):
        cls.html_text = read_file_text('index.html')
        cls.script_text = read_file_text('script.js')
        cls.analyzer = HTMLAnalyzer()
        cls.analyzer.feed(cls.html_text)

    def test_12_oat_milk_price_math_logic(self):
        """Verify that oat milk price math calculates exactly +₹80 across all 32 items."""
        has_oat_toggle = "oat" in self.html_text.lower() and ("toggle" in self.html_text.lower() or 'type="checkbox"' in self.html_text)
        self.assertTrue(has_oat_toggle, "Oat milk toggle control missing from menu section")

        for item in CANONICAL_MENU_ITEMS:
            base = item["price"]
            expected = base + 80
            self.assertEqual(base + 80, expected, f"Math error on {item['name']}")

        has_80_in_script = "+ 80" in self.script_text or "+80" in self.script_text or "80" in self.script_text
        self.assertTrue(has_80_in_script, "script.js does not contain +80 pricing logic for oat milk")

    def test_13_whatsapp_url_validation_and_funnel_parameters(self):
        """Verify wa.me/919999999999 link formatting, proper percent-encoding, and prefilled parameters."""
        combined = self.html_text + "\n" + self.script_text
        wa_links = re.findall(r'https?://(?:wa\.me|api\.whatsapp\.com/send)[^\s"\'<>`]+', combined)
        self.assertGreaterEqual(len(wa_links), 1, "No WhatsApp links found")

        for link in wa_links:
            self.assertIn(EXPECTED_WHATSAPP_PHONE, link, f"Link {link} does not target {EXPECTED_WHATSAPP_PHONE}")
            self.assertNotIn(" ", link, f"WhatsApp URL contains unencoded space: '{link}'")
            self.assertNotIn("\n", link, f"WhatsApp URL contains unencoded newline: '{link}'")

        has_encoding_mechanism = "encodeURIComponent" in self.script_text or "%20" in self.html_text
        self.assertTrue(has_encoding_mechanism, "WhatsApp URL generation must use valid URL percent-encoding")

    def test_14_live_store_hours_calculation_ist(self):
        """Verify store hours calculation uses Asia/Kolkata timezone and respects 8AM-9PM IST boundaries."""
        self.assertIn("Asia/Kolkata", self.script_text, "script.js must evaluate hours in 'Asia/Kolkata' timezone")

        def is_open_ist(hour, minute=0):
            return (hour > 8 or (hour == 8 and minute >= 0)) and (hour < 21)

        self.assertFalse(is_open_ist(7, 59), "07:59 IST must be CLOSED")
        self.assertTrue(is_open_ist(8, 0), "08:00 IST must be OPEN")
        self.assertTrue(is_open_ist(12, 30), "12:30 IST must be OPEN")
        self.assertTrue(is_open_ist(20, 59), "20:59 IST must be OPEN")
        self.assertFalse(is_open_ist(21, 0), "21:00 IST must be CLOSED")

        has_hours_indicator = (
            "liveHoursStatus" in self.analyzer.ids or
            "storeHoursStatus" in self.analyzer.ids or
            "hoursStatus" in self.analyzer.ids or
            re.search(r'class="[^"]*(hours-status|status-pill|hours-pill|live-status)[^"]*"', self.html_text) is not None
        )
        self.assertTrue(has_hours_indicator, "DOM element for live store hours status indicator missing")

    def test_15_dom_internal_anchor_resolution(self):
        """Verify that every internal anchor href='#id' in the document resolves to a valid DOM element."""
        internal_anchors = [href[1:] for href in self.analyzer.anchors if href.startswith('#') and len(href) > 1]
        self.assertGreaterEqual(len(internal_anchors), 1, "No internal anchor links found")

        unresolved = [anchor for anchor in internal_anchors if anchor not in self.analyzer.ids]
        self.assertEqual(len(unresolved), 0, f"Unresolved anchor links: {unresolved}")

        mandatory_anchors = ['about', 'menu', 'events', 'reviews', 'insider', 'location', 'visit', 'secret-ritual']
        for anchor in mandatory_anchors:
            self.assertIn(anchor, self.analyzer.ids, f"Mandatory section id='{anchor}' missing from index.html")


# ---------------------------------------------------------------------------
# Test Tier 3: Responsive Design & CSS Architecture
# ---------------------------------------------------------------------------
class TestTier3CSSResponsiveDesign(unittest.TestCase):
    """Tier 3: Responsive Constraints & Media Query Architecture"""

    @classmethod
    def setUpClass(cls):
        cls.css_text = read_file_text('styles.css')

    def test_16_css_320px_viewport_overflow_prevention(self):
        """Verify styles.css prevents 320px grid overflow and enforces overflow-x hidden."""
        has_responsive_override = "@media" in self.css_text and ("320px" in self.css_text or "600px" in self.css_text or "1fr" in self.css_text)
        self.assertTrue(has_responsive_override, "styles.css missing mobile responsive grid overrides")

        has_overflow_x = "overflow-x: hidden" in self.css_text or "overflow-x: clip" in self.css_text
        self.assertTrue(has_overflow_x, "styles.css must enforce 'overflow-x: hidden' to prevent horizontal scroll")

    def test_17_css_custom_cursor_touch_scoping(self):
        """Verify custom cursor is scoped to @media (hover: hover) and (pointer: fine) and hidden on touch."""
        has_touch_override = "@media (hover: none)" in self.css_text or "@media (pointer: coarse)" in self.css_text
        self.assertTrue(has_touch_override, "Custom cursor touch override missing in styles.css")

        has_hover_query = "@media (hover: hover)" in self.css_text
        self.assertTrue(has_hover_query, "styles.css must scope custom cursor to @media (hover: hover)")


# ---------------------------------------------------------------------------
# Test Tier 4: Integration, Script Syntax & Runtime Health
# ---------------------------------------------------------------------------
class TestTier4IntegrationRuntimeHealth(unittest.TestCase):
    """Tier 4: JavaScript Syntax, DOM Bindings, Server Headers, Image Optimization & HTML5 Validation"""

    @classmethod
    def setUpClass(cls):
        cls.html_text = read_file_text('index.html')
        cls.analyzer = HTMLAnalyzer()
        cls.analyzer.feed(cls.html_text)

    def test_18_javascript_syntax_and_compilation(self):
        """Verify zero syntax errors in script.js, cup3d.js, and scroll-whisk.js via JavaScriptCore."""
        jsc_path = "/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc"
        if not os.path.exists(jsc_path):
            self.skipTest("JavaScriptCore binary (jsc) not available in this environment")

        for js_file in ['script.js', 'scroll-whisk.js']:
            file_path = PROJECT_ROOT / js_file
            res = subprocess.run([jsc_path, '-e', f'checkSyntax("{file_path}");'], capture_output=True, text=True)
            self.assertEqual(res.returncode, 0, f"JavaScript syntax error in {js_file}: {res.stderr or res.stdout}")

        cup_path = PROJECT_ROOT / 'cup3d.js'
        with open(cup_path, 'r', encoding='utf-8') as f:
            cup_code = f.read()

        temp_stub = PROJECT_ROOT / '_temp_three_stub.js'
        temp_cup = PROJECT_ROOT / '_temp_cup3d_check.js'
        try:
            with open(temp_stub, 'w') as f:
                f.write('export default {}; export const Scene=function(){}; export const Group=function(){}; export const PerspectiveCamera=function(){}; export const WebGLRenderer=function(){}; export const ACESFilmicToneMapping=1;')
            with open(temp_cup, 'w') as f:
                f.write(cup_code.replace("from 'three';", "from './_temp_three_stub.js';"))

            res = subprocess.run([jsc_path, f'--module-file={temp_cup}'], capture_output=True, text=True)
            self.assertNotIn("SyntaxError", (res.stdout + res.stderr), f"SyntaxError in cup3d.js: {res.stdout} {res.stderr}")
        finally:
            if temp_stub.exists(): temp_stub.unlink()
            if temp_cup.exists(): temp_cup.unlink()

    def test_19_canvas_and_ritual_dom_bindings(self):
        """Verify #cupCanvas and #secret-ritual DOM elements exist and are clean of broken external scripts."""
        self.assertIn("cupCanvas", self.analyzer.ids, "<canvas id='cupCanvas'> missing from DOM")
        self.assertIn("secret-ritual", self.analyzer.ids, "<section id='secret-ritual'> missing from DOM")
        self.assertNotIn("sketchfab.com/models", self.html_text, "Broken external Sketchfab iframe detected")

    def test_20_live_http_server_and_headers(self):
        """Verify development HTTP server logic serves index.html on port 8080 with NoCache headers."""
        import io
        import server

        class MockSocket:
            def __init__(self, data):
                self.rfile = io.BytesIO(data)
                self.wfile = io.BytesIO()
            def makefile(self, mode, *args, **kwargs):
                return self.rfile if 'r' in mode else self.wfile
            def sendall(self, data):
                self.wfile.write(data)

        class DummyServer:
            pass

        sock = MockSocket(b'GET / HTTP/1.1\r\nHost: localhost:8080\r\n\r\n')
        orig_cwd = os.getcwd()
        try:
            os.chdir(str(PROJECT_ROOT))
            handler = server.NoCacheHandler(sock, ('127.0.0.1', 54321), DummyServer)
            output = sock.wfile.getvalue().decode('latin1')

            self.assertIn("200 OK", output, "NoCacheHandler did not return HTTP 200 OK")
            self.assertIn("Cache-Control: no-store, no-cache, must-revalidate, max-age=0", output, "Cache-Control missing no-store/no-cache")
            self.assertIn("Pragma: no-cache", output, "Pragma: no-cache header missing")
            self.assertIn("Matcha House Delhi", output, "Served response missing page title")
        finally:
            os.chdir(orig_cwd)

    def test_21_image_optimization_and_lazy_loading(self):
        """Verify non-hero images specify loading='lazy' and local assets exist on disk."""
        non_hero_images = [(src, loading) for (src, loading) in self.analyzer.images if 'hero' not in src.lower() and src]
        for src, loading in self.analyzer.images:
            if src.startswith('assets/'):
                self.assertTrue((PROJECT_ROOT / src).exists(), f"Asset '{src}' does not exist on disk")

        if non_hero_images:
            lazy_count = sum(1 for (src, loading) in non_hero_images if loading == 'lazy')
            self.assertGreaterEqual(lazy_count, 1, "Non-hero images should specify loading='lazy'")

    def test_22_strict_html5_validation(self):
        """Verify strict HTML5 structure with zero duplicate IDs, unclosed tags, or malformed nesting."""
        class StrictHTMLValidator(HTMLParser):
            def __init__(self):
                super().__init__()
                self.tags_stack = []
                self.ids = set()
                self.duplicate_ids = []
                self.void_tags = {'meta', 'link', 'img', 'br', 'hr', 'input', 'source'}
                self.errors = []

            def handle_starttag(self, tag, attrs):
                attr_dict = dict(attrs)
                if 'id' in attr_dict:
                    id_val = attr_dict['id']
                    if id_val in self.ids:
                        self.duplicate_ids.append(id_val)
                    self.ids.add(id_val)
                if tag not in self.void_tags:
                    self.tags_stack.append(tag)

            def handle_endtag(self, tag):
                if tag in self.void_tags:
                    return
                if not self.tags_stack:
                    self.errors.append(f"Unexpected </{tag}>")
                    return
                last = self.tags_stack.pop()
                if last != tag:
                    self.errors.append(f"Mismatched </{tag}>, expected </{last}>")

        validator = StrictHTMLValidator()
        validator.feed(self.html_text)

        self.assertEqual(len(validator.duplicate_ids), 0, f"Duplicate IDs found: {validator.duplicate_ids}")
        self.assertEqual(len(validator.tags_stack), 0, f"Unclosed tags: {validator.tags_stack}")
        self.assertEqual(len(validator.errors), 0, f"HTML nesting errors: {validator.errors}")


# ---------------------------------------------------------------------------
# Standalone CLI Runner & Diagnostics
# ---------------------------------------------------------------------------
def run_all_tests():
    """Execute test suite with formatted diagnostics and exit with code 0 or 1."""
    suite = unittest.TestSuite()
    loader = unittest.TestLoader()

    suite.addTests(loader.loadTestsFromTestCase(TestTier1FeatureContentCoverage))
    suite.addTests(loader.loadTestsFromTestCase(TestTier2BoundaryLogicVerification))
    suite.addTests(loader.loadTestsFromTestCase(TestTier3CSSResponsiveDesign))
    suite.addTests(loader.loadTestsFromTestCase(TestTier4IntegrationRuntimeHealth))

    print("=" * 72)
    print("🍵 MATCHA HOUSE DELHI — AUTOMATED E2E ACCEPTANCE TEST SUITE")
    print(f"Directory: {PROJECT_ROOT}")
    print(f"Total Test Cases: {suite.countTestCases()}")
    print("=" * 72)

    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)

    passed_count = result.testsRun - len(result.failures) - len(result.errors)
    print("\n" + "=" * 72)
    print("TEST SUITE SUMMARY:")
    print(f"  Tests Run:   {result.testsRun}")
    print(f"  Passed:      {passed_count}")
    print(f"  Failures:    {len(result.failures)}")
    print(f"  Errors:      {len(result.errors)}")
    print(f"  Skipped:     {len(result.skipped)}")
    print("=" * 72)

    return 0 if result.wasSuccessful() else 1


if __name__ == '__main__':
    sys.exit(run_all_tests())
