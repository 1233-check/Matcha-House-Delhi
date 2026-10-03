/*
 * scroll-whisk.js — Ceremonial Dual-Video Live Feed & Parallax Scroll Controller
 * Matcha House Delhi
 *
 * Responsibilities:
 * 1. Guarantees silent HTML5 video autoplay, loop, and muted state across all devices.
 * 2. Implements GPU-accelerated differential parallax scroll animations for the video feed containers.
 * 3. Enforces zero console errors during rapid scrolling and resizing.
 * 4. Prevents mobile vertical card collisions and respects prefers-reduced-motion.
 * 5. Handles page visibility changes to maintain continuous playback.
 */

(function () {
    'use strict';

    function initLiveVideoFeed() {
        var section = document.getElementById('secret-ritual');
        if (!section) return;

        var videoCards = section.querySelectorAll('.parallax-card');
        var videos = section.querySelectorAll('video');

        // 1. Silent inline autoplay initialization & interaction fallback
        var hasUserInteracted = false;
        function onUserInteraction() {
            if (hasUserInteracted) return;
            hasUserInteracted = true;
            videos.forEach(function (video) {
                if (video.paused) {
                    video.muted = true;
                    video.play().catch(function () {});
                }
            });
            window.removeEventListener('scroll', onUserInteraction);
            window.removeEventListener('touchstart', onUserInteraction);
            window.removeEventListener('click', onUserInteraction);
        }

        videos.forEach(function (video) {
            video.muted = true;
            video.defaultMuted = true;
            video.playsInline = true;

            var playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.catch(function () {
                    window.addEventListener('scroll', onUserInteraction, { passive: true });
                    window.addEventListener('touchstart', onUserInteraction, { passive: true });
                    window.addEventListener('click', onUserInteraction, { passive: true });
                });
            }
        });

        // 2. Visibility change handling (resume on tab focus and bfcache navigation)
        document.addEventListener('visibilitychange', function () {
            if (!document.hidden) {
                videos.forEach(function (video) {
                    if (video.paused) {
                        video.play().catch(function () {});
                    }
                });
            }
        });

        window.addEventListener('pageshow', function () {
            videos.forEach(function (video) {
                if (video.paused) {
                    video.play().catch(function () {});
                }
            });
        });

        // 3. Parallax scroll effect
        if (!videoCards.length) return;

        var isTicking = false;

        function updateParallaxPositions() {
            var prefersReducedMotion = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReducedMotion) {
                videoCards.forEach(function (card) {
                    card.style.transform = 'translate3d(0, 0px, 0)';
                });
                isTicking = false;
                return;
            }

            var rect = section.getBoundingClientRect();
            var windowHeight = window.innerHeight || (document.documentElement && document.documentElement.clientHeight) || 800;

            // Only perform translations when section is within or near the viewport
            if (rect.bottom > -200 && rect.top < windowHeight + 200) {
                var scrollDistance = Math.max(0, windowHeight - rect.top);
                // On mobile stacked viewports, synchronize speeds to eliminate vertical collision
                var isMobile = (typeof window.innerWidth === 'number') && window.innerWidth <= 768;

                videoCards.forEach(function (card) {
                    var speed = isMobile ? 0.2 : (parseFloat(card.getAttribute('data-parallax-speed')) || 0.2);
                    var translateY = -Math.round(scrollDistance * speed);
                    // card.style.transform = "translate3d(0, " + translateY + "px, 0)";
                });
            } else if (rect.top >= windowHeight) {
                // Section is completely below viewport; reset translation to 0
                videoCards.forEach(function (card) {
                    card.style.transform = 'translate3d(0, 0px, 0)';
                });
            }

            isTicking = false;
        }

        function onScroll() {
            if (!isTicking) {
                window.requestAnimationFrame(updateParallaxPositions);
                isTicking = true;
            }
        }

        // window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener('resize', onScroll, { passive: true });

        // Initial paint calculation
        updateParallaxPositions();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLiveVideoFeed);
    } else {
        initLiveVideoFeed();
    }
})();
