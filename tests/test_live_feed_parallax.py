#!/usr/bin/env python3
"""
🍵 MATCHA HOUSE DELHI — DUAL-VIDEO LIVE FEED & PARALLAX VERIFICATION SUITE
========================================================================
Comprehensive automated test suite verifying the replacement of the Secret
Whisk Ritual with the dual-video parallax live stream, covering:
1. Hero section byte-for-byte integrity (SHA256 & length check).
2. Elimination of Sketchfab embeds, ritual text, and secret reveal DOM elements.
3. Elimination of dead JavaScript and dead CSS.
4. Dual HTML5 <video> elements with autoplay, loop, muted, playsinline, and valid asset paths.
5. Parallax differential speed architecture and JavaScriptCore runtime simulation.
6. Responsive CSS architecture and HTML5 nesting validity.
7. Mobile anti-collision synchronization, boundary resets, and prefers-reduced-motion.
8. 3Motional elegance showcase styling: dark textured background, 3D isometric cards, and geometric framing.
"""

import os
import sys
import re
import hashlib
import subprocess
from html.parser import HTMLParser
from pathlib import Path
import unittest

PROJECT_ROOT = Path(__file__).resolve().parent.parent
HERO_BASELINE_SHA256 = "fdbd20f70c1fd43b3355bd704d15321568c43ee92782059a21141d265a84932b"
HERO_BASELINE_BYTE_LEN = 364
JSC_PATH = "/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc"


class SectionParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_secret_section = False
        self.secret_section_tags = []
        self.videos = []
        self.sources = []
        self.current_video = None
        self.all_ids = set()
        self.all_classes = set()

    def handle_starttag(self, tag, attrs):
        attr_dict = dict(attrs)
        if "id" in attr_dict:
            self.all_ids.add(attr_dict["id"])
            if attr_dict["id"] == "secret-ritual":
                self.in_secret_section = True

        if "class" in attr_dict:
            for c in attr_dict["class"].split():
                self.all_classes.add(c)

        if self.in_secret_section:
            self.secret_section_tags.append((tag, attr_dict))
            if tag == "video":
                self.current_video = attr_dict
                self.videos.append(attr_dict)
            elif tag == "source" and self.current_video is not None:
                self.sources.append(attr_dict)

    def handle_endtag(self, tag):
        if tag == "section" and self.in_secret_section:
            self.in_secret_section = False
        if tag == "video":
            self.current_video = None


class TestLiveFeedParallax(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with open(PROJECT_ROOT / "index.html", "r", encoding="utf-8") as f:
            cls.html_text = f.read()
        with open(PROJECT_ROOT / "script.js", "r", encoding="utf-8") as f:
            cls.script_text = f.read()
        with open(PROJECT_ROOT / "scroll-whisk.js", "r", encoding="utf-8") as f:
            cls.scroll_whisk_text = f.read()
        with open(PROJECT_ROOT / "styles.css", "r", encoding="utf-8") as f:
            cls.css_text = f.read()

        cls.parser = SectionParser()
        cls.parser.feed(cls.html_text)

    # -----------------------------------------------------------------------
    # 1. HERO INTEGRITY
    # -----------------------------------------------------------------------
    def test_01_hero_byte_for_byte_integrity(self):
        """CRITICAL CONSTRAINT: Verify hero section is 100% byte-for-byte identical to baseline."""
        lines = []
        capturing = False
        with open(PROJECT_ROOT / "index.html", "rb") as f:
            for line in f.readlines():
                if b'<header class="hero" id="home">' in line:
                    capturing = True
                if capturing:
                    lines.append(line)
                    if b'</header>' in line:
                        break

        self.assertTrue(capturing, "Hero section header start not found")
        hero_bytes = b''.join(lines)
        actual_hash = hashlib.sha256(hero_bytes).hexdigest()
        actual_len = len(hero_bytes)

        self.assertEqual(actual_len, HERO_BASELINE_BYTE_LEN, f"Hero byte length mismatch: {actual_len} != {HERO_BASELINE_BYTE_LEN}")
        self.assertEqual(actual_hash, HERO_BASELINE_SHA256, f"Hero SHA256 hash mismatch: {actual_hash} != {HERO_BASELINE_SHA256}")

    # -----------------------------------------------------------------------
    # 2. COMPLETE REMOVAL OF WHISK RITUAL DOM & EMBEDS
    # -----------------------------------------------------------------------
    def test_02_whisk_ritual_dom_and_embeds_completely_removed(self):
        """R1: Verify Sketchfab iframe, ritual text, and secret reveal DOM elements are removed."""
        # No Sketchfab
        self.assertNotIn("sketchfab", self.html_text.lower(), "Sketchfab reference found in index.html")
        self.assertNotIn("sketchfab", self.scroll_whisk_text.lower(), "Sketchfab reference found in scroll-whisk.js")

        # No secret code reveal DOM elements
        forbidden_ids = ["secretReveal", "passcode"]
        for fid in forbidden_ids:
            self.assertNotIn(fid, self.parser.all_ids, f"Forbidden legacy ritual id='{fid}' found in DOM")

        forbidden_classes = [
            "interactive-whisk-area",
            "ritual-bowl-container",
            "ritual-bowl-graphic",
            "whisk-progress",
            "progress-ring",
            "secret-reveal",
            "ritual-section",
        ]
        for fcls in forbidden_classes:
            self.assertNotIn(fcls, self.parser.all_classes, f"Forbidden legacy ritual class='{fcls}' found in DOM")

        self.assertNotIn("MATCHA-VIP-DELHI", self.html_text, "Legacy secret promo code 'MATCHA-VIP-DELHI' still present")
        self.assertNotIn("The Secret Whisk Ritual", self.html_text, "Legacy heading 'The Secret Whisk Ritual' still present")

    # -----------------------------------------------------------------------
    # 3. DEAD CODE ELIMINATION
    # -----------------------------------------------------------------------
    def test_03_zero_dead_javascript_in_script_and_scroll_whisk(self):
        """R1: Verify no dead whisk ritual logic remains in script.js or scroll-whisk.js."""
        dead_indicators = ["progress-ring", "secretReveal", "chasen-whisk-graphic", "ritual-bowl-container"]
        for ind in dead_indicators:
            self.assertNotIn(ind, self.script_text, f"Dead ritual indicator '{ind}' found in script.js")
            self.assertNotIn(ind, self.scroll_whisk_text, f"Dead ritual indicator '{ind}' found in scroll-whisk.js")

    def test_04_zero_dead_css_in_styles(self):
        """R1: Verify no dead whisk ritual CSS selectors or keyframes remain in styles.css."""
        dead_selectors = [
            ".interactive-whisk-area",
            ".ritual-bowl-container",
            ".ritual-bowl-graphic",
            ".whisk-progress",
            ".progress-ring__circle",
            ".secret-reveal",
            ".passcode",
            ".ritual-section",
            "@keyframes pulse",
        ]
        for sel in dead_selectors:
            self.assertNotIn(sel, self.css_text, f"Dead CSS selector '{sel}' found in styles.css")

    # -----------------------------------------------------------------------
    # 4. DUAL-VIDEO LIVE FEED IMPLEMENTATION
    # -----------------------------------------------------------------------
    def test_05_dual_video_elements_and_attributes(self):
        """R2: Verify exactly two HTML5 video elements exist with autoplay, loop, and muted."""
        self.assertEqual(len(self.parser.videos), 2, f"Expected exactly 2 <video> elements, found {len(self.parser.videos)}")

        for idx, video_attrs in enumerate(self.parser.videos, 1):
            # Check autoplay, loop, muted, playsinline
            self.assertIn("autoplay", video_attrs, f"Video #{idx} missing 'autoplay' attribute")
            self.assertIn("loop", video_attrs, f"Video #{idx} missing 'loop' attribute")
            self.assertIn("muted", video_attrs, f"Video #{idx} missing 'muted' attribute")
            self.assertIn("playsinline", video_attrs, f"Video #{idx} missing 'playsinline' attribute")

    def test_06_video_assets_validity_and_presence(self):
        """R2: Verify both required video assets are referenced and exist on disk."""
        expected_assets = [
            "assets/igexport-DcqnJUgM27f.mp4",
            "assets/igexport-DTxVGL-D-BI.mp4",
        ]

        # Check source tags or video src
        found_sources = [s.get("src") for s in self.parser.sources if s.get("src")]
        for asset in expected_assets:
            self.assertIn(asset, found_sources, f"Expected video asset '{asset}' not referenced in <source src=...>")
            asset_path = PROJECT_ROOT / asset
            self.assertTrue(asset_path.exists(), f"Video asset '{asset}' does not exist on disk")
            self.assertGreater(asset_path.stat().st_size, 1000, f"Video asset '{asset}' is suspiciously small or empty")

    # -----------------------------------------------------------------------
    # 5. PARALLAX SCROLL EFFECT
    # -----------------------------------------------------------------------
    def test_07_parallax_architecture_and_differential_speeds(self):
        """R3: Verify video containers have parallax configuration with differential speeds."""
        parallax_cards = [
            attrs for tag, attrs in self.parser.secret_section_tags
            if tag == "div" and "parallax-card" in attrs.get("class", "").split()
        ]
        self.assertGreaterEqual(len(parallax_cards), 2, "Expected at least 2 parallax cards in section")

        speeds = []
        for card in parallax_cards:
            speed_val = card.get("data-parallax-speed")
            self.assertIsNotNone(speed_val, "Parallax card missing 'data-parallax-speed' attribute")
            speeds.append(float(speed_val))

        # Differential speed verification
        self.assertEqual(len(set(speeds)), len(speeds), f"Parallax cards should have distinct differential speeds: {speeds}")
        for s in speeds:
            self.assertGreater(s, 0, f"Parallax speed must be positive: {s}")

    def test_08_jsc_syntax_and_runtime_simulation(self):
        """R3: Verify zero syntax errors and simulate parallax scroll execution in JavaScriptCore."""
        if not os.path.exists(JSC_PATH):
            self.skipTest("JavaScriptCore binary (jsc) not available")

        # 1. Syntax check
        res = subprocess.run([JSC_PATH, "-e", f'checkSyntax("{PROJECT_ROOT / "scroll-whisk.js"}");'], capture_output=True, text=True)
        self.assertEqual(res.returncode, 0, f"Syntax error in scroll-whisk.js: {res.stderr}")

        # 2. Runtime scroll simulation in JSC (desktop baseline)
        test_js = """
        var elements = {};
        var listeners = {};

        var mockCard1 = {
            getAttribute: function(attr) { return "0.18"; },
            style: { transform: "" }
        };
        var mockCard2 = {
            getAttribute: function(attr) { return "0.32"; },
            style: { transform: "" }
        };

        var mockVideo1 = { muted: false, defaultMuted: false, playsInline: false, play: function() { return Promise.resolve(); } };
        var mockVideo2 = { muted: false, defaultMuted: false, playsInline: false, play: function() { return Promise.resolve(); } };

        var mockSection = {
            id: 'secret-ritual',
            querySelectorAll: function(sel) {
                if (sel === '.parallax-card') return [mockCard1, mockCard2];
                if (sel === 'video') return [mockVideo1, mockVideo2];
                return [];
            },
            getBoundingClientRect: function() {
                return { top: 400, bottom: 1200 };
            }
        };

        var document = {
            readyState: 'complete',
            documentElement: { clientHeight: 800 },
            getElementById: function(id) {
                if (id === 'secret-ritual') return mockSection;
                return null;
            },
            addEventListener: function(event, fn) {
                listeners[event] = fn;
            }
        };

        var window = {
            innerHeight: 800,
            addEventListener: function(event, fn) {
                listeners[event] = fn;
            },
            removeEventListener: function() {},
            requestAnimationFrame: function(fn) { fn(); }
        };
        """
        full_code = test_js + "\n" + (PROJECT_ROOT / "scroll-whisk.js").read_text(encoding='utf-8') + """
        if (listeners['scroll']) {
            listeners['scroll']();
        }

        print("CARD1_TRANSFORM:" + mockCard1.style.transform);
        print("CARD2_TRANSFORM:" + mockCard2.style.transform);
        print("VIDEO1_MUTED:" + mockVideo1.muted);
        print("VIDEO2_MUTED:" + mockVideo2.muted);
        """

        res = subprocess.run([JSC_PATH, "-e", full_code], capture_output=True, text=True)
        self.assertEqual(res.returncode, 0, f"JSC execution error: {res.stderr}")

        output = res.stdout
        self.assertIn("CARD1_TRANSFORM:translate3d(0, -72px, 0)", output)
        self.assertIn("CARD2_TRANSFORM:translate3d(0, -128px, 0)", output)
        self.assertIn("VIDEO1_MUTED:true", output)
        self.assertIn("VIDEO2_MUTED:true", output)

    # -----------------------------------------------------------------------
    # 6. RESPONSIVE DESIGN & CSS QUALITY
    # -----------------------------------------------------------------------
    def test_09_responsive_css_and_no_overflow(self):
        """R2/R3: Verify responsive layout styling, max-widths, and mobile overrides."""
        self.assertIn(".live-feed-section", self.css_text)
        self.assertIn(".live-feed-stage", self.css_text)
        self.assertIn(".feed-card", self.css_text)

        # Check for flex or grid layout
        self.assertTrue(
            "display: flex" in self.css_text or "display: grid" in self.css_text,
            "Live feed stage must use flex or grid layout"
        )

        # Check responsive overrides
        self.assertIn("@media (max-width: 768px)", self.css_text)
        self.assertIn("flex-direction: column", self.css_text)

    # -----------------------------------------------------------------------
    # 7. ADVERSARIAL QA: MOBILE ANTI-COLLISION & BOUNDARY INTEGRITY
    # -----------------------------------------------------------------------
    def test_10_mobile_parallax_synchronization_and_anti_collision(self):
        """QA: Verify on mobile viewports (<=768px), cards translate with synchronized speeds preventing overlap."""
        if not os.path.exists(JSC_PATH):
            self.skipTest("JavaScriptCore binary (jsc) not available")

        test_js = """
        var listeners = {};
        var mockCard1 = { getAttribute: function(attr) { return "0.18"; }, style: { transform: "" } };
        var mockCard2 = { getAttribute: function(attr) { return "0.32"; }, style: { transform: "" } };
        var mockVideo = { muted: false, defaultMuted: false, playsInline: false, play: function() { return Promise.resolve(); } };

        var mockSection = {
            id: 'secret-ritual',
            querySelectorAll: function(sel) {
                if (sel === '.parallax-card') return [mockCard1, mockCard2];
                if (sel === 'video') return [mockVideo];
                return [];
            },
            getBoundingClientRect: function() {
                // scrollDistance = 800 - 400 = 400px
                return { top: 400, bottom: 1200 };
            }
        };

        var document = {
            readyState: 'complete',
            documentElement: { clientHeight: 800, clientWidth: 375 },
            getElementById: function(id) { return mockSection; },
            addEventListener: function(event, fn) { listeners[event] = fn; }
        };

        var window = {
            innerHeight: 800,
            innerWidth: 375, // Mobile viewport width <= 768
            addEventListener: function(event, fn) { listeners[event] = fn; },
            removeEventListener: function() {},
            requestAnimationFrame: function(fn) { fn(); }
        };
        """
        full_code = test_js + "\n" + (PROJECT_ROOT / "scroll-whisk.js").read_text(encoding='utf-8') + """
        if (listeners['scroll']) {
            listeners['scroll']();
        }

        print("MOBILE_CARD1:" + mockCard1.style.transform);
        print("MOBILE_CARD2:" + mockCard2.style.transform);
        """

        res = subprocess.run([JSC_PATH, "-e", full_code], capture_output=True, text=True)
        self.assertEqual(res.returncode, 0, f"JSC execution error: {res.stderr}")
        output = res.stdout

        # On mobile, both cards must receive identical vertical translateY to avoid collision
        self.assertIn("MOBILE_CARD1:translate3d(0, -80px, 0)", output)
        self.assertIn("MOBILE_CARD2:translate3d(0, -80px, 0)", output)

    def test_11_boundary_reset_and_prefers_reduced_motion(self):
        """QA: Verify boundary reset when scrolling above section and respect for prefers-reduced-motion."""
        if not os.path.exists(JSC_PATH):
            self.skipTest("JavaScriptCore binary (jsc) not available")

        # 1. Test out-of-bounds reset (section below viewport, rect.top >= windowHeight)
        test_js_boundary = """
        var listeners = {};
        var mockCard1 = { getAttribute: function(attr) { return "0.18"; }, style: { transform: "translate3d(0, -200px, 0)" } };
        var mockSection = {
            id: 'secret-ritual',
            querySelectorAll: function(sel) { if (sel === '.parallax-card') return [mockCard1]; return []; },
            getBoundingClientRect: function() { return { top: 900, bottom: 1700 }; }
        };
        var document = {
            readyState: 'complete',
            getElementById: function(id) { if (id === 'secret-ritual') return mockSection; return null; },
            addEventListener: function() {}
        };
        var window = {
            innerHeight: 800,
            innerWidth: 1200,
            addEventListener: function(event, fn) { listeners[event] = fn; },
            removeEventListener: function() {},
            requestAnimationFrame: function(fn) { fn(); }
        };
        """
        code_boundary = test_js_boundary + "\n" + (PROJECT_ROOT / "scroll-whisk.js").read_text(encoding='utf-8') + """
        if (listeners['scroll']) { listeners['scroll'](); }
        print("RESET_TRANSFORM:" + mockCard1.style.transform);
        """
        res = subprocess.run([JSC_PATH, "-e", code_boundary], capture_output=True, text=True)
        self.assertEqual(res.returncode, 0, f"Boundary test error: {res.stderr}")
        self.assertIn("RESET_TRANSFORM:translate3d(0, 0px, 0)", res.stdout)

        # 2. Test prefers-reduced-motion: reduce
        test_js_motion = """
        var listeners = {};
        var mockCard1 = { getAttribute: function(attr) { return "0.18"; }, style: { transform: "" } };
        var mockSection = {
            id: 'secret-ritual',
            querySelectorAll: function(sel) { if (sel === '.parallax-card') return [mockCard1]; return []; },
            getBoundingClientRect: function() { return { top: 400, bottom: 1200 }; }
        };
        var document = {
            readyState: 'complete',
            getElementById: function(id) { if (id === 'secret-ritual') return mockSection; return null; },
            addEventListener: function() {}
        };
        var window = {
            innerHeight: 800,
            innerWidth: 1200,
            matchMedia: function(q) { return { matches: true }; },
            addEventListener: function(event, fn) { listeners[event] = fn; },
            removeEventListener: function() {},
            requestAnimationFrame: function(fn) { fn(); }
        };
        """
        code_motion = test_js_motion + "\n" + (PROJECT_ROOT / "scroll-whisk.js").read_text(encoding='utf-8') + """
        if (listeners['scroll']) { listeners['scroll'](); }
        print("REDUCED_MOTION_TRANSFORM:" + mockCard1.style.transform);
        """
        res = subprocess.run([JSC_PATH, "-e", code_motion], capture_output=True, text=True)
        self.assertEqual(res.returncode, 0, f"Reduced motion error: {res.stderr}")
        self.assertIn("REDUCED_MOTION_TRANSFORM:translate3d(0, 0px, 0)", res.stdout)

    # -----------------------------------------------------------------------
    # 8. 3MOTIONAL ELEGANCE SHOWCASE DESIGN VERIFICATION
    # -----------------------------------------------------------------------
    def test_12_cinematic_3d_isometric_and_starry_styling(self):
        """Verify the 3Motional elegance showcase styles: dark starry backdrop, 3D isometric cards, and geometric framing."""
        # 1. Dark starry backdrop
        self.assertIn(".live-feed-backdrop", self.css_text)
        self.assertIn("radial-gradient", self.css_text)

        # 2. 3D isometric rotation classes & perspective
        self.assertIn(".iso-card-left", self.css_text)
        self.assertIn(".iso-card-right", self.css_text)
        self.assertIn("rotateY", self.css_text)
        self.assertIn("perspective: 1600px", self.css_text)

        # 3. Geometric frame cutouts
        self.assertIn(".geom-corner", self.css_text)
        self.assertIn(".geom-arch", self.css_text)
        self.assertIn(".geom-ring", self.css_text)

        # 4. Luxury typography overlays
        self.assertIn(".live-bg-typography", self.css_text)
        self.assertIn(".title-highlight", self.css_text)
        self.assertIn(".title-kanji", self.css_text)

        # 5. DOM references in index.html
        self.assertIn('class="live-bg-typography"', self.html_text)
        self.assertIn('class="geom-arch"', self.html_text)
        self.assertIn('iso-card-left', self.html_text)
        self.assertIn('iso-card-right', self.html_text)

        # 6. Page visibility listener in scroll-whisk.js
        self.assertIn("visibilitychange", self.scroll_whisk_text)

    # -----------------------------------------------------------------------
    # 9. ADVANCED DEFECT REGRESSION TESTS
    # -----------------------------------------------------------------------
    def test_13_parallax_card_no_transition_transform_lag(self):
        """QA: Verify parallax outer container has no CSS transition on transform to prevent 600ms scroll jank."""
        # Find .parallax-card and .feed-card CSS blocks
        parallax_match = re.search(r'\.parallax-card\s*\{([^}]+)\}', self.css_text)
        self.assertIsNotNone(parallax_match, ".parallax-card rule not found in styles.css")
        parallax_body = parallax_match.group(1)
        self.assertNotIn("transition:", parallax_body, ".parallax-card must not have CSS transition (causes scroll lag)")

        feed_card_match = re.search(r'(?<!-)\.feed-card\s*\{([^}]+)\}', self.css_text)
        self.assertIsNotNone(feed_card_match, ".feed-card rule not found in styles.css")
        feed_card_body = feed_card_match.group(1)
        self.assertNotIn("transition: transform", feed_card_body, ".feed-card must not have transition on transform")

        # 3D card must have transition on transform for smooth hover easing
        feed_card_3d_match = re.search(r'\.feed-card-3d\s*\{([^}]+)\}', self.css_text)
        self.assertIsNotNone(feed_card_3d_match, ".feed-card-3d rule not found in styles.css")
        feed_card_3d_body = feed_card_3d_match.group(1)
        self.assertIn("transition:", feed_card_3d_body)
        self.assertIn("transform", feed_card_3d_body)

    def test_14_bfcache_pageshow_and_safari_inline_playback(self):
        """QA: Verify bfcache pageshow lifecycle listener and webkit-playsinline attribute."""
        self.assertIn("pageshow", self.scroll_whisk_text, "scroll-whisk.js must listen for pageshow event for bfcache restoration")
        for video_attrs in self.parser.videos:
            self.assertIn("webkit-playsinline", video_attrs, "Video missing 'webkit-playsinline' for iOS Safari compatibility")

    def test_15_css_reduced_motion_media_query(self):
        """QA: Verify CSS includes prefers-reduced-motion media query disabling floating animations."""
        self.assertIn("@media (prefers-reduced-motion: reduce)", self.css_text)

    def test_16_typography_header_z_index_layering(self):
        """QA: Verify .live-feed-header establishes foreground z-index layering above parallax cards."""
        header_match = re.search(r'\.live-feed-header\s*\{([^}]+)\}', self.css_text)
        self.assertIsNotNone(header_match, ".live-feed-header rule not found in styles.css")
        header_body = header_match.group(1)
        self.assertIn("z-index:", header_body, ".live-feed-header should explicitly set z-index for foreground layering")


if __name__ == "__main__":
    unittest.main(verbosity=2)

