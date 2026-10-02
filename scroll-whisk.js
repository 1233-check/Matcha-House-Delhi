document.addEventListener('DOMContentLoaded', () => {
    const iframe = document.getElementById('sketchfab-iframe');
    if (!iframe) return;

    // We want the section to be tall so the user can scroll to "whisk"
    const section = document.getElementById('secret-ritual');
    if (section) {
        section.style.height = '200vh'; 
    }

    const container = document.querySelector('.ritual-container');
    if (container) {
        container.style.position = 'sticky';
        container.style.top = '10vh';
    }

    const client = new Sketchfab('1.12.1', iframe);
    let api;
    let isReady = false;

    // Load the model
    client.init('a1b560fb8dfb4195a1891dda5119c658', {
        success: function onSuccess(apiInstance) {
            api = apiInstance;
            api.start();
            api.addEventListener('viewerready', function() {
                isReady = true;
                // Initial camera setup
                api.setCameraLookAt([0, -5, 5], [0, 0, 0], 2);
            });
        },
        error: function onError() {
            console.error('Sketchfab API error');
        },
        autostart: 1,
        ui_infos: 0,
        ui_watermark: 0,
        ui_controls: 0,
        ui_stop: 0,
        transparent: 1,
        camera: 0
    });

    const progressCircle = document.querySelector('.progress-ring__circle');
    const secretReveal = document.getElementById('secretReveal');
    let circumference = 2 * Math.PI * 90;
    if (progressCircle) {
        progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        progressCircle.style.strokeDashoffset = circumference;
    }

    let isUnlocked = false;

    window.addEventListener('scroll', () => {
        if (!section || !isReady) return;

        const rect = section.getBoundingClientRect();
        const start = window.innerHeight; // When section top enters bottom of screen
        const end = -section.offsetHeight / 2; // When section is halfway scrolled out
        
        let progress = 0;
        if (rect.top < start && rect.top > end) {
            progress = (start - rect.top) / (start - end);
        } else if (rect.top <= end) {
            progress = 1;
        }

        // 1. Update UI Progress Ring
        if (progressCircle && !isUnlocked) {
            const offset = circumference - progress * circumference;
            progressCircle.style.strokeDashoffset = offset;
        }

        // 2. Rotate Camera around the bowl (whisking motion)
        if (api && !isUnlocked) {
            // Orbit camera based on scroll progress
            const angle = progress * Math.PI * 10; // 5 full rotations
            const radius = 6;
            const height = 4;
            
            const camX = Math.cos(angle) * radius;
            const camY = Math.sin(angle) * radius;
            
            api.setCameraLookAt([camX, camY, height], [0, 0, 0], 1);
        }

        // 3. Unlock the secret
        if (progress >= 0.95 && !isUnlocked) {
            isUnlocked = true;
            if (secretReveal) {
                secretReveal.classList.add('active');
            }
        }
    });
});
