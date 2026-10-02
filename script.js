document.addEventListener('DOMContentLoaded', () => {
    // --- 3D Parallax/Tilt Effect ---
    const tiltElements = document.querySelectorAll('.tilt-element');
    const perspectiveContainers = document.querySelectorAll('.perspective-container');

    perspectiveContainers.forEach(container => {
        const element = container.querySelector('.tilt-element');
        const orb = container.querySelector('.glass-orb');

        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            // Calculate mouse position relative to center of container (-1 to 1)
            const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
            const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

            // Apply rotation (max 15 degrees)
            const rotateX = -y * 15;
            const rotateY = x * 15;

            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
            
            if(orb) {
                orb.style.transform = `translate(-50%, -50%) translateZ(80px) translateX(${x * 30}px) translateY(${y * 30}px)`;
            }
        });

        container.addEventListener('mouseleave', () => {
            element.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
            if(orb) {
                orb.style.transform = `translate(-50%, -50%) translateZ(50px)`;
            }
        });
    });

    // Scroll Animation is handled by whisk3d.js

    // --- Scroll Animations (Intersection Observer) ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.about-content h2, .about-content p, .ritual-text h2').forEach(el => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.8s ease-out';
        observer.observe(el);
    });
    // --- Live Weather Sync ---
    const weatherWidget = document.getElementById('weatherWidget');
    const weatherText = document.getElementById('weatherText');
    const weatherIcon = document.getElementById('weatherIcon');

    if (weatherWidget) {
        // Fetch weather for New Delhi (Lat: 28.6139, Lon: 77.2090)
        fetch('https://api.open-meteo.com/v1/forecast?latitude=28.6139&longitude=77.2090&current_weather=true')
            .then(res => res.json())
            .then(data => {
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
                    message = `Perfect ${temp}°C weather for a fresh Matcha.`;
                    icon = "🍃";
                }
                
                weatherIcon.textContent = icon;
                weatherText.textContent = message;
            })
            .catch(err => {
                weatherText.textContent = "Your oasis in the heart of Delhi.";
                weatherIcon.textContent = "✨";
            });
    }

    // --- Custom Cursor ---
    const cursorDot = document.getElementById('cursorDot');
    const cursorOutline = document.getElementById('cursorOutline');

    if (cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 150, fill: 'forwards' });
        });

        // Cursor hover effects on interactables
        const interactables = document.querySelectorAll('a, button, .tilt-element, .weather-widget');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.style.width = '60px';
                cursorOutline.style.height = '60px';
                cursorOutline.style.backgroundColor = 'rgba(196, 178, 126, 0.2)'; // Gold transparent
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.style.width = '40px';
                cursorOutline.style.height = '40px';
                cursorOutline.style.backgroundColor = 'transparent';
            });
        });
    }

    // --- Scroll Progress Bar ---
    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            scrollProgress.style.width = `${scrollPercent}%`;
        });
    }
});

// --- Taste Profiler Logic (Global Scope) ---
let quizAnswers = [];

window.nextSlide = function(currentSlideNum, answer) {
    quizAnswers.push(answer);
    
    // Hide current slide
    const currentSlide = document.getElementById(`quizSlide${currentSlideNum}`);
    currentSlide.classList.remove('active');
    currentSlide.classList.add('exit');
    
    // Show next slide
    const nextSlide = document.getElementById(`quizSlide${currentSlideNum + 1}`);
    if (nextSlide) {
        nextSlide.classList.add('active');
        nextSlide.classList.remove('exit');
    }
};

window.finishQuiz = function(answer) {
    quizAnswers.push(answer);
    
    // Hide last slide
    const currentSlide = document.getElementById(`quizSlide3`);
    currentSlide.classList.remove('active');
    currentSlide.classList.add('exit');
    
    // Logic to determine drink
    const mood = quizAnswers[0];
    const temp = quizAnswers[1];
    const base = quizAnswers[2];
    
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
    
    document.getElementById('resultDrinkName').textContent = drinkName;
    document.getElementById('resultDrinkDesc').textContent = desc;
    
    // Show result
    setTimeout(() => {
        document.getElementById('tasteQuiz').style.display = 'none';
        document.getElementById('tasteResult').style.display = 'block';
    }, 500);
};

window.resetQuiz = function() {
    quizAnswers = [];
    document.getElementById('tasteResult').style.display = 'none';
    document.getElementById('tasteQuiz').style.display = 'block';
    
    // Reset slides
    document.querySelectorAll('.quiz-slide').forEach((slide, index) => {
        slide.classList.remove('active', 'exit');
        if (index === 0) slide.classList.add('active');
    });
};
