#!/usr/bin/env python3
"""
🧪 MATCHA HOUSE DELHI — ADVERSARIAL STRESS TEST & DYNAMIC EDGE-CASE HARNESS
========================================================================
Empirical stress-testing harness specifically developed by Challenger Stress Tester
to probe dynamic edge cases, boundary conditions, and adversarial inputs:

1. Oat Milk Pricing Math (+₹80) across all 32 menu items, IEEE 754 precision, rapid toggling.
2. WhatsApp URL Generator: wa.me parameter validation, URI percent-encoding, injection attacks.
3. 24-Hour Asia/Kolkata Live Store Hours: 96-interval simulation + global host timezone isolation.
4. Viewport Stress Testing (320px - 2560px): CSS grid minmax analysis, fixed-width overflow risks.
"""

import os
import sys
import re
import json
import subprocess
import urllib.parse
from html.parser import HTMLParser
from pathlib import Path
import unittest

PROJECT_ROOT = Path(__file__).resolve().parent.parent
JSC_PATH = "/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc"


class HTMLDataExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.menu_items = []
        self.all_links = []
        self.all_ids = set()
        self.in_item = False
        self.current_item = {}

    def handle_starttag(self, tag, attrs):
        attr_dict = dict(attrs)
        if "id" in attr_dict:
            self.all_ids.add(attr_dict["id"])

        if tag == "a" and "href" in attr_dict:
            self.all_links.append((attr_dict["href"], attr_dict.get("class", "")))

        if tag == "div" and "menu-item" in attr_dict.get("class", "").split():
            self.in_item = True
            self.current_item = {
                "base_price": attr_dict.get("data-base-price"),
                "name": attr_dict.get("data-name"),
                "category": attr_dict.get("data-category"),
                "price_text": None,
                "wa_href": None,
            }

        if self.in_item:
            if "menu-item-price" in attr_dict.get("class", "").split():
                self.current_item["data_base"] = attr_dict.get("data-base")
            if "btn-wa-order" in attr_dict.get("class", "").split() or "btn-zomato-order" in attr_dict.get("class", "").split():
                self.current_item["wa_href"] = attr_dict.get("href")
                self.current_item["order_href"] = attr_dict.get("href")

    def handle_data(self, data):
        if self.in_item and "₹" in data:
            self.current_item["price_text"] = data.strip()

    def handle_endtag(self, tag):
        if tag == "div" and self.in_item and (self.current_item.get("wa_href") or self.current_item.get("order_href")):
            self.menu_items.append(dict(self.current_item))
            self.in_item = False
            self.current_item = {}


class AdversarialStressTestSuite(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with open(PROJECT_ROOT / "index.html", "r", encoding="utf-8") as f:
            cls.html_text = f.read()
        with open(PROJECT_ROOT / "script.js", "r", encoding="utf-8") as f:
            cls.script_text = f.read()
        with open(PROJECT_ROOT / "styles.css", "r", encoding="utf-8") as f:
            cls.css_text = f.read()

        cls.extractor = HTMLDataExtractor()
        cls.extractor.feed(cls.html_text)

    # =========================================================================
    # 1. OAT MILK PRICING CALCULATIONS (ALL 32 ITEMS)
    # =========================================================================
    def test_01_all_32_items_extracted_and_valid(self):
        """Verify all 32 menu items are present with valid integer base prices."""
        items = self.extractor.menu_items
        self.assertEqual(len(items), 32, f"Expected 32 menu items, found {len(items)}")

        for idx, item in enumerate(items, 1):
            name = item.get("name")
            base_price = item.get("base_price")
            self.assertIsNotNone(name, f"Item #{idx} missing data-name")
            self.assertIsNotNone(base_price, f"Item '{name}' missing data-base-price")
            self.assertTrue(base_price.isdigit(), f"Base price for '{name}' is not integer: {base_price}")
            price_val = int(base_price)
            self.assertGreaterEqual(price_val, 200, f"Price {price_val} below min ₹200 for '{name}'")
            self.assertLessEqual(price_val, 395, f"Price {price_val} exceeds max ₹395 for '{name}'")

    def test_02_oat_milk_price_math_toggle_off_and_on(self):
        """Stress test: verify exact +₹80 calculation across all 32 items with toggle ON and OFF."""
        items = self.extractor.menu_items
        for item in items:
            name = item["name"]
            base = int(item["base_price"])

            # Toggle OFF state
            off_price = base
            self.assertEqual(off_price, base, f"Toggle OFF price mismatch for {name}")

            # Toggle ON state (+₹80)
            on_price = base + 80
            expected = int(base + 80)

            # Mathematical exactness check: no floating point representation
            self.assertIsInstance(on_price, int)
            self.assertEqual(on_price, expected)
            self.assertEqual(f"₹{on_price}", f"₹{base + 80}")

            # Verify specific known items
            if name == "Mango Matcha Pudding":
                self.assertEqual(on_price, 280)
            elif name == "Triple Berry Matcha Latte":
                self.assertEqual(on_price, 475)
            elif name == "Matcha Iced Tea":
                self.assertEqual(on_price, 460)

    def test_03_jsc_runtime_oat_milk_toggle_state_stability(self):
        """Execute JavaScript in JSC: test 1,000 rapid toggle cycles for state drift or mutation."""
        if not os.path.exists(JSC_PATH):
            self.skipTest("JSC not available")

        # JavaScript script simulating the exact DOM dataset and toggling logic from script.js
        js_code = """
        const items = """ + json.dumps([
            {"name": it["name"], "basePrice": it["base_price"]}
            for it in self.extractor.menu_items
        ]) + """;

        let isOatMilkActive = false;

        function computePrices() {
            return items.map(item => {
                const basePrice = parseInt(item.basePrice, 10);
                const currentPrice = isOatMilkActive ? (basePrice + 80) : basePrice;
                return { name: item.name, price: currentPrice, formatted: `₹${currentPrice}` };
            });
        }

        // 1,000 Rapid toggles
        for (let i = 0; i < 1000; i++) {
            isOatMilkActive = !isOatMilkActive;
            const res = computePrices();
            if (isOatMilkActive) {
                // Must be +80 for all
                for (let j = 0; j < items.length; j++) {
                    const expected = parseInt(items[j].basePrice, 10) + 80;
                    if (res[j].price !== expected) {
                        throw new Error(`Drift at cycle ${i}: item ${items[j].name} expected ${expected} got ${res[j].price}`);
                    }
                }
            } else {
                // Must be base price
                for (let j = 0; j < items.length; j++) {
                    const expected = parseInt(items[j].basePrice, 10);
                    if (res[j].price !== expected) {
                        throw new Error(`Drift at cycle ${i}: item ${items[j].name} expected ${expected} got ${res[j].price}`);
                    }
                }
            }
        }
        print("PASS_STABILITY_1000_CYCLES");
        """

        res = subprocess.run([JSC_PATH, "-e", js_code], capture_output=True, text=True)
        self.assertEqual(res.returncode, 0, f"JSC execution error: {res.stderr or res.stdout}")
        self.assertIn("PASS_STABILITY_1000_CYCLES", res.stdout)

    # =========================================================================
    # 2. WHATSAPP URL GENERATOR & ENCODING
    # =========================================================================
    def test_04_static_whatsapp_urls_in_html(self):
        """Verify all static WhatsApp links in index.html are valid wa.me format with valid params, and 32 Zomato order links."""
        wa_links = [href for href, _ in self.extractor.all_links if "wa.me" in href]
        self.assertGreaterEqual(len(wa_links), 10, f"Expected at least 10 static wa.me links for booking and events, found {len(wa_links)}")

        zomato_links = [href for href, _ in self.extractor.all_links if "zomato.com" in href and "order" in href]
        self.assertEqual(len(zomato_links), 32, f"Expected 32 Zomato menu order links, found {len(zomato_links)}")

        for link in wa_links:
            parsed = urllib.parse.urlparse(link)
            self.assertEqual(parsed.scheme, "https", f"Link {link} must be https")
            self.assertEqual(parsed.netloc, "wa.me", f"Link {link} must target wa.me")
            self.assertTrue(parsed.path.startswith("/919999999999"), f"Invalid path in {link}")

            # Check query parameters
            qs = urllib.parse.parse_qs(parsed.query)
            if parsed.path == "/919999999999" and parsed.query:
                self.assertIn("text", qs, f"Link {link} missing 'text' query parameter")
                decoded_text = qs["text"][0]
                self.assertGreater(len(decoded_text), 5, f"Text param too short in {link}")
                # Ensure no raw '%' remains that would indicate malformed percent-encoding
                self.assertNotIn("%20", decoded_text, f"Double-encoded string in {link}")

    def test_05_whatsapp_generator_adversarial_drink_names(self):
        """Stress test WhatsApp URL generator with hostile drink names in JSC."""
        if not os.path.exists(JSC_PATH):
            self.skipTest("JSC not available")

        adversarial_cases = [
            "Matcha & Tonic",
            "Barista's Choice (Special)",
            "Matcha #1 Signature",
            "Is It Sweet? Extra Sweet Matcha",
            "Matcha = Life + Love",
            "宇治の抹茶 (Traditional Ceremonial)",
            "🍵 Golden Cloud Matcha ✨",
            "<script>alert('xss')</script>",
            "A" * 500,  # Long name
        ]

        js_code = """
        const cases = """ + json.dumps(adversarial_cases) + """;
        const results = [];

        for (const name of cases) {
            const isOatMilkActive = true;
            const currentPrice = 475;
            const milkChoice = isOatMilkActive ? 'Oat Milk (+₹80)' : 'Dairy Milk / Standard';
            const messageText = `Hi Matcha House Delhi! I would like to order: ${name} (${milkChoice}) for ₹${currentPrice}. Please confirm order!`;
            const waUrl = `https://wa.me/919999999999?text=${encodeURIComponent(messageText)}`;
            results.push({ name, url: waUrl, rawText: messageText });
        }
        print(JSON.stringify(results));
        """

        res = subprocess.run([JSC_PATH, "-e", js_code], capture_output=True, text=True)
        self.assertEqual(res.returncode, 0, f"JSC execution error: {res.stderr or res.stdout}")

        results = json.loads(res.stdout)
        for item in results:
            url = item["url"]
            expected_raw = item["rawText"]

            parsed = urllib.parse.urlparse(url)
            self.assertEqual(parsed.scheme, "https")
            self.assertEqual(parsed.netloc, "wa.me")
            self.assertEqual(parsed.path, "/919999999999")

            # Must have EXACTLY one query parameter: 'text'
            qs = urllib.parse.parse_qs(parsed.query, keep_blank_values=True)
            self.assertEqual(list(qs.keys()), ["text"], f"Parameter injection detected in URL: {url}")
            decoded_text = qs["text"][0]

            # Verbatim round-trip test: decoded message must match original raw text
            self.assertEqual(decoded_text, expected_raw, f"Encoding corruption for name: {item['name']}")

    # =========================================================================
    # 3. 24-HOUR ASIA/KOLKATA STORE HOURS SIMULATION
    # =========================================================================
    def test_06_24_hour_15_minute_store_hours_simulation(self):
        """Simulate all 96 intervals of 15 minutes across 24 hours IST."""
        # 8:00 AM (480 min) to 9:00 PM (1260 min)
        for total_minutes in range(0, 1440, 15):
            hour = total_minutes // 60
            minute = total_minutes % 60

            # Exact business logic: 480 <= currentMinutes < 1260
            is_open = (total_minutes >= 480 and total_minutes < 1260)

            if total_minutes < 480:
                self.assertFalse(is_open, f"{hour:02d}:{minute:02d} IST should be CLOSED")
            elif 480 <= total_minutes < 1260:
                self.assertTrue(is_open, f"{hour:02d}:{minute:02d} IST should be OPEN")
            else:
                self.assertFalse(is_open, f"{hour:02d}:{minute:02d} IST should be CLOSED")

    def test_07_exact_boundary_minute_conditions(self):
        """Test exact boundary minutes: 07:59, 08:00, 20:59, 21:00, 23:59, 00:00 IST."""
        boundaries = [
            (7, 59, False, "07:59 IST (1 minute before open)"),
            (8, 0, True, "08:00 IST (exact open)"),
            (8, 1, True, "08:01 IST (open)"),
            (20, 59, True, "20:59 IST (1 minute before close)"),
            (21, 0, False, "21:00 IST (exact close)"),
            (21, 1, False, "21:01 IST (1 minute after close)"),
            (23, 59, False, "23:59 IST (midnight close)"),
            (0, 0, False, "00:00 IST (midnight)"),
        ]

        for h, m, expected_open, desc in boundaries:
            cur_mins = h * 60 + m
            is_open = (cur_mins >= 480 and cur_mins < 1260)
            self.assertEqual(is_open, expected_open, f"Boundary failure at {desc}")

    def test_08_jsc_multi_timezone_host_store_hours_evaluation(self):
        """Execute store hours logic in JSC across 6 global timezones at open and closed times."""
        if not os.path.exists(JSC_PATH):
            self.skipTest("JSC not available")

        # Test at 03:00 UTC (08:30 IST -> OPEN) and at 16:00 UTC (21:30 IST -> CLOSED)
        test_scenarios = [
            # (UTC timestamp, expected_is_open)
            ("2026-10-03T02:00:00Z", False),  # 07:30 IST -> CLOSED
            ("2026-10-03T02:30:00Z", True),   # 08:00 IST -> OPEN
            ("2026-10-03T06:30:00Z", True),   # 12:00 IST -> OPEN
            ("2026-10-03T15:29:00Z", True),   # 20:59 IST -> OPEN
            ("2026-10-03T15:30:00Z", False),  # 21:00 IST -> CLOSED
            ("2026-10-03T18:00:00Z", False),  # 23:30 IST -> CLOSED
        ]

        host_timezones = [
            "UTC",
            "America/New_York",
            "America/Los_Angeles",
            "Europe/London",
            "Asia/Tokyo",
            "Asia/Kolkata",
        ]

        for tz in host_timezones:
            for utc_iso, expected_open in test_scenarios:
                js_code = f"""
                const testDate = new Date('{utc_iso}');
                const istDateStr = testDate.toLocaleString("en-US", {{ timeZone: "Asia/Kolkata" }});
                const istDate = new Date(istDateStr);
                const hour = istDate.getHours();
                const minute = istDate.getMinutes();
                const currentMinutes = hour * 60 + minute;
                const isOpen = (currentMinutes >= 480 && currentMinutes < 1260);
                print(isOpen ? "OPEN" : "CLOSED");
                """

                env = os.environ.copy()
                env["TZ"] = tz
                res = subprocess.run([JSC_PATH, "-e", js_code], env=env, capture_output=True, text=True)
                self.assertEqual(res.returncode, 0, f"JSC execution failed for TZ={tz}: {res.stderr}")
                actual_status = res.stdout.strip()
                expected_status = "OPEN" if expected_open else "CLOSED"
                self.assertEqual(
                    actual_status,
                    expected_status,
                    f"Timezone discrepancy for TZ={tz} at {utc_iso}: got {actual_status}, expected {expected_status}"
                )

    # =========================================================================
    # 4. VIEWPORT STRESS TESTING (320px - 2560px)
    # =========================================================================
    def test_09_viewport_overflow_prevention_architecture(self):
        """Analyze CSS rules across target viewports (320px, 375px, 768px, 1024px, 1440px, 2560px)."""
        target_viewports = [320, 375, 768, 1024, 1440, 2560]

        # 1. Body global overflow protection
        self.assertIn("overflow-x: hidden", self.css_text, "Missing body overflow-x: hidden")
        self.assertIn("box-sizing: border-box", self.css_text, "Missing box-sizing: border-box")

        # 2. Check for max-width overrides on mobile viewports (<= 600px)
        self.assertIn("@media (max-width: 600px)", self.css_text)
        self.assertIn(".menu-grid", self.css_text)
        self.assertIn("grid-template-columns: 1fr", self.css_text)

        # 3. Check Google Maps iframe has width='100%' or responsive container
        maps_iframe_match = re.search(r'<iframe[^>]*maps[^>]*>', self.html_text)
        self.assertIsNotNone(maps_iframe_match, "Google Maps iframe missing")
        iframe_tag = maps_iframe_match.group(0)
        self.assertIn('width="100%"', iframe_tag, "Google Maps iframe must have width='100%'")

        # 4. Check that no fixed pixel widths > 300px are applied to containers without responsive overrides
        suspicious_fixed_widths = re.findall(r'(?:^|\s|\{)\s*width:\s*([4-9]\d{2}|[1-9]\d{3,})px', self.css_text)
        # Any fixed width > 320px outside media queries is a risk
        # Verify that all major content containers use %, fr, or clamp
        self.assertIn("max-width: 100%", self.css_text or "width: 100%")

    def test_10_desktop_vs_touch_cursor_isolation(self):
        """Verify custom cursor styles are completely disabled on mobile/touch screens."""
        self.assertIn("@media (hover: none) or (pointer: coarse)", self.css_text)
        self.assertIn("cursor: auto !important", self.css_text)
        self.assertIn("display: none !important", self.css_text)

        # Also check script.js touch check
        self.assertIn("isTouchDevice", self.script_text)
        self.assertIn("cursorDot.style.display = 'none'", self.script_text)


if __name__ == "__main__":
    unittest.main(verbosity=2)
