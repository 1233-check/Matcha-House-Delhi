/*
 * script.js — Matcha House Delhi
 * Core UI Logic: Menu Tabs, Oat Milk Pricing Engine, WhatsApp URL Generation,
 * Live IST Hours Status, Reviews Carousel, Loyalty Club, 3D Tilt, Taste Profiler.
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. 3D Parallax/Tilt Effect ---
    const perspectiveContainers = document.querySelectorAll('.perspective-container');
    perspectiveContainers.forEach(container => {
        const element = container.querySelector('.tilt-element');
        const orb = container.querySelector('.glass-orb');
        if (!element) return;

        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
            const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

            const rotateX = -y * 12;
            const rotateY = x * 12;

            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
            if (orb) {
                orb.style.transform = `translate(-50%, -50%) translateZ(80px) translateX(${x * 30}px) translateY(${y * 30}px)`;
            }
        });

        container.addEventListener('mouseleave', () => {
            element.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
            if (orb) {
                orb.style.transform = `translate(-50%, -50%) translateZ(50px)`;
            }
        });
    });


    // --- 3. Scroll Animations (Intersection Observer) ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.08 });

    document.querySelectorAll('.editorial-content, .workshop-card, .review-card, .loyalty-card, .location-info-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        observer.observe(el);
    });

    // --- 4. Live Delhi Weather Sync ---
    const weatherWidget = document.getElementById('weatherWidget');
    const weatherText = document.getElementById('weatherText');
    const weatherIcon = document.getElementById('weatherIcon');

    if (weatherWidget && weatherText && weatherIcon) {
        fetch('https://api.open-meteo.com/v1/forecast?latitude=28.6139&longitude=77.2090&current_weather=true')
            .then(res => {
                if (!res.ok) throw new Error('Network error');
                return res.json();
            })
            .then(data => {
                if (!data || !data.current_weather) throw new Error('Invalid weather data');
                const temp = Math.round(data.current_weather.temperature);
                let message = "";
                let icon = "";
                
                if (temp > 30) {
                    message = `It's ${temp}°C in Delhi. Cool down with an Iced Yuzu Matcha.`;
                    icon = "☀️";
                } else if (temp < 20) {
                    message = `It's ${temp}°C in Delhi. Warm up with our Ceremonial Blend.`;
                    icon = "❄️";
                } else {
                    message = `Perfect ${temp}°C weather in Delhi for a fresh Matcha.`;
                    icon = "🍃";
                }
                
                weatherIcon.textContent = icon;
                weatherText.textContent = message;
            })
            .catch(() => {
                weatherText.textContent = "Your mindful oasis in Hauz Khas, Delhi.";
                weatherIcon.textContent = "✨";
            });
    }

    // --- 5. Desktop-Only Custom Bamboo Cursor (R8) ---
    const cursorDot = document.getElementById('cursorDot');
    const cursorOutline = document.getElementById('cursorOutline');
    const isTouchDevice = window.matchMedia('(hover: none) or (pointer: coarse)').matches || ('ontouchstart' in window);

    if (cursorDot && cursorOutline) {
        if (isTouchDevice) {
            cursorDot.style.display = 'none';
            cursorOutline.style.display = 'none';
            document.body.style.cursor = 'auto';
        } else {
            window.addEventListener('mousemove', (e) => {
                const posX = e.clientX;
                const posY = e.clientY;

                cursorDot.style.left = `${posX}px`;
                cursorDot.style.top = `${posY}px`;

                cursorOutline.animate({
                    left: `${posX}px`,
                    top: `${posY}px`
                }, { duration: 160, fill: 'forwards' });
            });

            // Scale cursor on interactive elements
            const interactables = document.querySelectorAll('a, button, input, .tilt-element, .weather-widget, .insta-tile');
            interactables.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    cursorOutline.style.width = '55px';
                    cursorOutline.style.height = '55px';
                    cursorOutline.style.backgroundColor = 'rgba(212, 175, 55, 0.2)';
                    cursorOutline.style.borderColor = 'var(--color-gold)';
                });
                el.addEventListener('mouseleave', () => {
                    cursorOutline.style.width = '40px';
                    cursorOutline.style.height = '40px';
                    cursorOutline.style.backgroundColor = 'transparent';
                    cursorOutline.style.borderColor = 'var(--color-gold)';
                });
            });
        }
    }

    // --- 6. Scroll Progress Bar ---
    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
        let isScrolling = false;
        window.addEventListener('scroll', () => {
            if (!isScrolling) {
                window.requestAnimationFrame(() => {
                    const scrollTop = window.scrollY;
                    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                    if (docHeight > 0) {
                        const scrollPercent = (scrollTop / docHeight) * 100;
                        scrollProgress.style.width = `${Math.min(100, Math.max(0, scrollPercent))}%`;
                    }
                    isScrolling = false;
                });
                isScrolling = true;
            }
        }, { passive: true });
    }

    // --- 7. Menu Filtering (R1) ---
    const tabButtons = document.querySelectorAll('.menu-tab-btn');
    const menuCategories = document.querySelectorAll('.menu-category');
    const menuItems = document.querySelectorAll('.menu-item');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const categoryFilter = btn.dataset.category; // "all", "pure", "latte", "cloud"

            if (categoryFilter === 'all') {
                menuCategories.forEach(cat => cat.classList.remove('hidden'));
                menuItems.forEach(item => item.classList.remove('hidden'));
            } else {
                menuCategories.forEach(cat => {
                    if (cat.dataset.category === categoryFilter) {
                        cat.classList.remove('hidden');
                    } else {
                        cat.classList.add('hidden');
                    }
                });
                menuItems.forEach(item => {
                    if (item.dataset.category === categoryFilter) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                });
            }
        });
    });

    // --- 8. Dynamic Milk Preference Engine (Dairy, Oat +₹80, Lactose-Free +₹60) ---
    const milkOptionBtns = document.querySelectorAll('.milk-option-btn');
    const oatMilkToggle = document.getElementById('oatMilkToggle');
    let selectedMilk = 'dairy';

    const MILK_SURCHARGES = {
        'dairy': 0,
        'oat': 80,
        'lactose-free': 60
    };

    function updateMenuPrices() {
        // Price math: basePrice + 80 for oat milk, + 60 for lactose-free milk, + 0 for dairy
        const surcharge = MILK_SURCHARGES[selectedMilk] !== undefined ? MILK_SURCHARGES[selectedMilk] : 0;

        menuItems.forEach(item => {
            const basePrice = parseInt(item.dataset.basePrice, 10);
            const currentPrice = basePrice + surcharge;

            // Update displayed price in DOM smoothly without mutating direct Zomato store links
            const priceEl = item.querySelector('.menu-item-price, .item-price');
            if (priceEl) {
                priceEl.textContent = `₹${currentPrice}`;
            }

            // If an item has a WhatsApp order button, update it; direct Zomato order buttons are untouched
            const waBtn = item.querySelector('.btn-wa-order');
            if (waBtn) {
                const milkChoice = selectedMilk === 'oat' ? 'Oat Milk (+₹80)' : (selectedMilk === 'lactose-free' ? 'Lactose-Free Milk (+₹60)' : 'Dairy Milk / Standard');
                const messageText = `Hi Matcha House Delhi! I would like to order: ${item.dataset.name} (${milkChoice}) for ₹${currentPrice}. Please confirm order!`;
                waBtn.href = `https://wa.me/919999999999?text=${encodeURIComponent(messageText)}`;
            }
        });

        // Sync legacy oat toggle checkbox if present for backwards compatibility
        if (oatMilkToggle) {
            oatMilkToggle.checked = (selectedMilk === 'oat');
        }
    }

    if (milkOptionBtns.length > 0) {
        milkOptionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                milkOptionBtns.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-checked', 'false');
                });
                btn.classList.add('active');
                btn.setAttribute('aria-checked', 'true');
                selectedMilk = btn.dataset.milk || 'dairy';
                updateMenuPrices();
            });
        });
    }

    if (oatMilkToggle) {
        oatMilkToggle.addEventListener('change', (e) => {
            selectedMilk = e.target.checked ? 'oat' : 'dairy';
            milkOptionBtns.forEach(b => {
                const isActive = (b.dataset.milk === selectedMilk);
                b.classList.toggle('active', isActive);
                b.setAttribute('aria-checked', isActive ? 'true' : 'false');
            });
            updateMenuPrices();
        });
    }

    // --- 9. Live IST Operating Hours Indicator (R6) ---
    function updateOperatingHours() {
        const liveStatusPill = document.getElementById('liveHoursStatus');
        const liveStatusText = document.getElementById('liveHoursText');
        if (!liveStatusPill || !liveStatusText) return;

        try {
            // Evaluates current time in Indian Standard Time (IST / Asia/Kolkata)
            const istDateStr = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
            const istDate = new Date(istDateStr);
            const hour = istDate.getHours();
            const minute = istDate.getMinutes();
            const currentMinutes = hour * 60 + minute;

            // Operating Hours: 8:00 AM (480 min) to 9:00 PM (1260 min) IST daily
            const isOpen = (currentMinutes >= 480 && currentMinutes < 1260);

            if (isOpen) {
                liveStatusPill.className = 'live-status-pill open';
                liveStatusText.textContent = '🟢 Open Now · Closes at 9:00 PM IST';
            } else {
                liveStatusPill.className = 'live-status-pill closed';
                liveStatusText.textContent = '🔴 Closed Now · Opens at 8:00 AM IST';
            }
        } catch {
            // Fallback for environment without Intl support
            liveStatusPill.className = 'live-status-pill open';
            liveStatusText.textContent = 'Open Daily: 8:00 AM – 9:00 PM IST';
        }
    }

    updateOperatingHours();
    setInterval(updateOperatingHours, 60000); // Check every minute

    // --- 10. Reviews Carousel (R4) ---
    const carouselTrack = document.getElementById('carouselTrack');
    const reviewCards = document.querySelectorAll('.review-card');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const dotsContainer = document.getElementById('carouselDots');

    if (carouselTrack && reviewCards.length > 0) {
        let currentSlide = 0;
        const totalSlides = reviewCards.length;
        let autoPlayTimer = null;

        // Create dot indicators
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('div');
                dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            }
        }

        function updateCarousel() {
            carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
            const dots = dotsContainer ? dotsContainer.querySelectorAll('.carousel-dot') : [];
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === currentSlide);
            });
        }

        function goToSlide(index) {
            currentSlide = (index + totalSlides) % totalSlides;
            updateCarousel();
        }

        function nextSlideItem() {
            goToSlide(currentSlide + 1);
        }

        function prevSlideItem() {
            goToSlide(currentSlide - 1);
        }

        if (nextBtn) nextBtn.addEventListener('click', () => { nextSlideItem(); resetTimer(); });
        if (prevBtn) prevBtn.addEventListener('click', () => { prevSlideItem(); resetTimer(); });

        // Touch Swipe Support
        let touchStartX = 0;
        let touchEndX = 0;

        carouselTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });

        carouselTrack.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 40) {
                if (diff > 0) {
                    nextSlideItem();
                } else {
                    prevSlideItem();
                }
                resetTimer();
            }
        }, { passive: true });

        // Auto-Play
        function startTimer() {
            autoPlayTimer = setInterval(nextSlideItem, 5000);
        }

        function resetTimer() {
            clearInterval(autoPlayTimer);
            startTimer();
        }

        const carouselWrapper = document.getElementById('reviewsCarousel');
        if (carouselWrapper) {
            carouselWrapper.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
            carouselWrapper.addEventListener('mouseleave', startTimer);
        }

        startTimer();
    }

    // --- 11. Loyalty Program WhatsApp Club Form (R5) ---
    const loyaltyForm = document.getElementById('loyaltyForm');
    const insiderNameInput = document.getElementById('insiderName');
    const loyaltySuccess = document.getElementById('loyaltySuccess');
    const passCardHolderName = document.getElementById('passCardHolderName');
    const loyaltySlotsGrid = document.getElementById('loyaltySlotsGrid');

    if (insiderNameInput && passCardHolderName) {
        insiderNameInput.addEventListener('input', (e) => {
            const val = e.target.value.trim();
            passCardHolderName.textContent = val ? val.toUpperCase() : 'YOUR NAME HERE';
        });
    }

    if (loyaltySlotsGrid) {
        loyaltySlotsGrid.addEventListener('click', (e) => {
            const slot = e.target.closest('.punch-slot');
            if (!slot) return;
            slot.classList.toggle('punched');
        });
    }

    if (loyaltyForm && insiderNameInput) {
        loyaltyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const customerName = insiderNameInput.value.trim();
            if (!customerName) return;

            const prefillText = `Hi Matcha House Delhi, my name is ${customerName}. I would like to join the Matcha Insider Club and claim my free matcha cookie! 🍪🍵`;
            const waUrl = `https://wa.me/919999999999?text=${encodeURIComponent(prefillText)}`;

            if (loyaltySuccess) {
                loyaltySuccess.style.display = 'block';
            }

            // Open WhatsApp in new tab
            window.open(waUrl, '_blank', 'noopener,noreferrer');
        });
    }
});

// --- 12. Taste Profiler Logic (Global Scope) ---
let quizAnswers = [];

window.nextSlide = function(currentSlideNum, answer) {
    quizAnswers.push(answer);
    
    const currentSlide = document.getElementById(`quizSlide${currentSlideNum}`);
    if (currentSlide) {
        currentSlide.classList.remove('active');
        currentSlide.classList.add('exit');
    }
    
    const nextSlide = document.getElementById(`quizSlide${currentSlideNum + 1}`);
    if (nextSlide) {
        nextSlide.classList.add('active');
        nextSlide.classList.remove('exit');
    }
};

window.finishQuiz = function(answer) {
    quizAnswers.push(answer);
    
    const currentSlide = document.getElementById('quizSlide3');
    if (currentSlide) {
        currentSlide.classList.remove('active');
        currentSlide.classList.add('exit');
    }
    
    const mood = quizAnswers[0] || 'Sweet';
    const temp = quizAnswers[1] || 'Iced';
    const base = quizAnswers[2] || 'Oat Milk';
    
    let drinkName = "Signature Matcha";
    let desc = `A custom ${temp.toLowerCase()} blend crafted just for you.`;
    
    if (mood === 'Sweet' && temp === 'Iced' && base === 'Oat Milk') {
        drinkName = "The Dirty Yuzu Matcha";
        desc = "An iced, sweet blend with oat milk and a hint of citrus.";
    } else if (mood === 'Earthy' && temp === 'Hot' && base === 'Pure Water') {
        drinkName = "The Emperor's Reserve";
        desc = "Pure ceremonial grade hot matcha, whisked to perfection.";
    } else if (mood === 'Sweet' && temp === 'Hot' && base === 'Oat Milk') {
        drinkName = "Vanilla Bean Matcha Latte";
        desc = "Warm, comforting oat milk matcha with fresh vanilla bean.";
    } else {
        drinkName = `The ${mood} ${base} Matcha`;
        desc = `A ${temp.toLowerCase()} preparation highlighting our premium leaves.`;
    }
    
    const nameEl = document.getElementById('resultDrinkName');
    const descEl = document.getElementById('resultDrinkDesc');
    if (nameEl) nameEl.textContent = drinkName;
    if (descEl) descEl.textContent = desc;
    
    setTimeout(() => {
        const quizEl = document.getElementById('tasteQuiz');
        const resEl = document.getElementById('tasteResult');
        if (quizEl) quizEl.style.display = 'none';
        if (resEl) resEl.style.display = 'block';
    }, 400);
};

window.resetQuiz = function() {
    quizAnswers = [];
    const quizEl = document.getElementById('tasteQuiz');
    const resEl = document.getElementById('tasteResult');
    if (resEl) resEl.style.display = 'none';
    if (quizEl) quizEl.style.display = 'block';
    
    document.querySelectorAll('.quiz-slide').forEach((slide, index) => {
        slide.classList.remove('active', 'exit');
        if (index === 0) slide.classList.add('active');
    });
};

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
    const mobileToggle = document.getElementById('mobileToggle');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navbar.classList.toggle('mobile-open');
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navbar.classList.remove('mobile-open');
            });
        });
    }
});
