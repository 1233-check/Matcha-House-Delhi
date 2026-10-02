/*
 * scroll-whisk.js — Zero-error native ceremonial whisk ritual
 * Coordinates scroll-driven progress with SVG ring and VIP voucher reveal.
 */

document.addEventListener('DOMContentLoaded', () => {
    const section = document.getElementById('secret-ritual');
    if (!section) return;

    const progressCircle = document.querySelector('.progress-ring__circle');
    const secretReveal = document.getElementById('secretReveal');
    const whiskGraphic = document.querySelector('.chasen-whisk-graphic') || document.querySelector('.ritual-bowl-graphic');

    const circumference = 2 * Math.PI * 90;
    if (progressCircle) {
        progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        progressCircle.style.strokeDashoffset = circumference;
    }

    let isUnlocked = false;

    window.addEventListener('scroll', () => {
        if (!section || isUnlocked) return;

        const rect = section.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const start = windowHeight * 0.85;
        const end = -section.offsetHeight * 0.2;

        let progress = 0;
        if (rect.top < start && rect.top > end) {
            progress = Math.min(Math.max((start - rect.top) / (start - end), 0), 1);
        } else if (rect.top <= end) {
            progress = 1;
        }

        if (progressCircle && !isUnlocked) {
            const offset = circumference - progress * circumference;
            progressCircle.style.strokeDashoffset = offset;
        }

        if (whiskGraphic) {
            whiskGraphic.style.transform = `rotate(${progress * 540}deg) scale(${1 + progress * 0.08})`;
        }

        if (progress >= 0.92 && !isUnlocked) {
            isUnlocked = true;
            if (progressCircle) progressCircle.style.stroke = '#4A5D23';
            if (secretReveal) {
                secretReveal.classList.add('active');
            }
        }
    }, { passive: true });
});
