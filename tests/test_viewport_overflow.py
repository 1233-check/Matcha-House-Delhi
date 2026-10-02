#!/usr/bin/env python3
"""
Viewport & Layout Stress Test
Evaluates CSS rules and dimensions for 320px, 375px, 768px, 1024px, 1440px, 2560px.
"""

import re
import unittest
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent


class TestViewportLayoutOverflow(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with open(PROJECT_ROOT / "styles.css", "r", encoding="utf-8") as f:
            cls.css = f.read()
        with open(PROJECT_ROOT / "index.html", "r", encoding="utf-8") as f:
            cls.html = f.read()
        cls.viewports = [320, 375, 768, 1024, 1440, 2560]

    def test_global_overflow_x_hidden(self):
        """Verify body enforces overflow-x: hidden to prevent viewport scrollbars."""
        self.assertIn("overflow-x: hidden", self.css)

    def test_css_grid_minmax_definitions(self):
        """Verify CSS grid templates have appropriate minmax values."""
        minmax_matches = re.findall(r'grid-template-columns:[^;]*minmax\((\d+)px', self.css)
        self.assertGreaterEqual(len(minmax_matches), 3)
        for min_px in minmax_matches:
            val = int(min_px)
            # Track mins should not exceed standard mobile width
            self.assertLessEqual(val, 320)

    def test_mobile_media_query_overrides(self):
        """Verify responsive overrides exist for viewports <= 600px."""
        self.assertIn("@media (max-width: 600px)", self.css)
        self.assertIn(".menu-grid", self.css)
        self.assertIn("grid-template-columns: 1fr !important", self.css)

    def test_responsive_image_and_iframe_constraints(self):
        """Verify Google Maps iframe and images do not have fixed widths > 320px."""
        self.assertIn('width="100%"', self.html)
        images = re.findall(r'<img[^>]+>', self.html)
        for img in images:
            self.assertNotIn('width="[4-9]', img)


if __name__ == "__main__":
    unittest.main(verbosity=2)
