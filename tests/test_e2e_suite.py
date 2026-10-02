"""
Discoverable test runner wrapper for e2e_test_suite.py
Enables standard 'python3 -m unittest discover tests' execution without flags.
"""

from tests.e2e_test_suite import (
    TestTier1FeatureContentCoverage,
    TestTier2BoundaryLogicVerification,
    TestTier3CSSResponsiveDesign,
    TestTier4IntegrationRuntimeHealth,
)

__all__ = [
    'TestTier1FeatureContentCoverage',
    'TestTier2BoundaryLogicVerification',
    'TestTier3CSSResponsiveDesign',
    'TestTier4IntegrationRuntimeHealth',
]
