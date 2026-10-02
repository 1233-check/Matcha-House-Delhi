/*
 * cup3d.js — Photorealistic Procedural 3D Matcha Cup
 * Rendered using Three.js r164 on <canvas id="cupCanvas">
 * Pure procedural geometry: Tapered glass tumbler, ceremonial matcha liquid,
 * animated frothy foam layer, crystal ice cubes, floating tea droplets.
 */

import * as THREE from 'three';

(function init3DCup() {
    const canvas = document.getElementById('cupCanvas');
    const heroSection = document.getElementById('home');
    if (!canvas || !heroSection) return;

    // --- Scene & Renderer Setup ---
    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    // --- Camera Setup ---
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0.4, 5.2);

    // --- Root Cup Group ---
    const cupGroup = new THREE.Group();
    scene.add(cupGroup);

    // Subtle initial tilt for luxury editorial presentation
    cupGroup.rotation.x = 0.12;
    cupGroup.rotation.z = -0.05;

    // --- Environment / Reflection Map (Procedural Canvas) ---
    function createProceduralEnvMap() {
        const envCanvas = document.createElement('canvas');
        envCanvas.width = 512;
        envCanvas.height = 256;
        const ctx = envCanvas.getContext('2d');
        if (!ctx) return null;

        // Soft studio lighting gradient
        const grad = ctx.createLinearGradient(0, 0, 0, 256);
        grad.addColorStop(0, '#FFFFFF');
        grad.addColorStop(0.3, '#EAF2E3');
        grad.addColorStop(0.7, '#C8D9B8');
        grad.addColorStop(1, '#98B282');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 512, 256);

        // Soft studio softbox highlights
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.fillRect(80, 20, 100, 140);
        ctx.fillRect(320, 30, 80, 120);

        const texture = new THREE.CanvasTexture(envCanvas);
        texture.mapping = THREE.EquirectangularReflectionMapping;
        return texture;
    }

    const envMap = createProceduralEnvMap();
    if (envMap) {
        scene.environment = envMap;
    }

    // --- Lighting Setup (Cinematic 3-Point Lighting) ---
    const ambientLight = new THREE.AmbientLight(0xF9F9F4, 1.4);
    scene.add(ambientLight);

    // Key Light (Warm Sunlight)
    const keyLight = new THREE.DirectionalLight(0xFFFFFF, 2.4);
    keyLight.position.set(4, 6, 4);
    scene.add(keyLight);

    // Fill Light (Soft Cool Matcha Tint)
    const fillLight = new THREE.DirectionalLight(0xD8EAC6, 1.3);
    fillLight.position.set(-4, 3, 2);
    scene.add(fillLight);

    // Rim / Back Light (Gold Accent)
    const rimLight = new THREE.DirectionalLight(0xD4AF37, 2.2);
    rimLight.position.set(0, 5, -4);
    scene.add(rimLight);

    // Bottom Bounce Light
    const bounceLight = new THREE.DirectionalLight(0x799351, 0.8);
    bounceLight.position.set(0, -4, 2);
    scene.add(bounceLight);

    // --- 1. Procedural Tapered Glass Tumbler ---
    // Constructed via LatheGeometry for authentic glass wall thickness & heavy bottom base
    const glassPoints = [];
    // Outer profile: bottom center -> bottom outer edge -> outer wall up to rim
    glassPoints.push(new THREE.Vector2(0, -1.35));
    glassPoints.push(new THREE.Vector2(0.68, -1.35));
    glassPoints.push(new THREE.Vector2(0.72, -1.30));
    glassPoints.push(new THREE.Vector2(0.76, -0.6));
    glassPoints.push(new THREE.Vector2(0.85, 0.4));
    glassPoints.push(new THREE.Vector2(0.96, 1.25)); // Outer rim
    glassPoints.push(new THREE.Vector2(0.92, 1.26)); // Rounded lip
    // Inner profile: lip down to thick bottom floor
    glassPoints.push(new THREE.Vector2(0.88, 1.23));
    glassPoints.push(new THREE.Vector2(0.78, 0.38));
    glassPoints.push(new THREE.Vector2(0.70, -0.58));
    glassPoints.push(new THREE.Vector2(0.64, -1.15)); // Thick heavy base floor
    glassPoints.push(new THREE.Vector2(0, -1.15));

    const glassGeometry = new THREE.LatheGeometry(glassPoints, 54);
    const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xFFFFFF,
        metalness: 0.05,
        roughness: 0.08,
        transmission: 0.92,
        thickness: 0.8,
        ior: 1.52,
        transparent: true,
        opacity: 0.85,
        envMapIntensity: 1.4,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const glassMesh = new THREE.Mesh(glassGeometry, glassMaterial);
    cupGroup.add(glassMesh);

    // --- 2. Ceremonial Matcha Liquid ---
    // Tapered cylinder fitting tightly inside the glass inner cavity
    const liquidGeom = new THREE.CylinderGeometry(0.86, 0.63, 2.22, 48, 1);
    liquidGeom.translate(0, 0.02, 0);

    const liquidMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x4E742D, // Rich deep ceremonial Uji matcha green
        emissive: 0x1B300E,
        emissiveIntensity: 0.25,
        roughness: 0.28,
        metalness: 0.02,
        transmission: 0.25,
        transparent: true,
        opacity: 0.96,
        ior: 1.34
    });

    const liquidMesh = new THREE.Mesh(liquidGeom, liquidMaterial);
    cupGroup.add(liquidMesh);

    // --- 3. Creamy Matcha Froth / Foam Layer ---
    const foamGeom = new THREE.CylinderGeometry(0.87, 0.85, 0.16, 48);
    foamGeom.translate(0, 1.12, 0);

    const foamMaterial = new THREE.MeshStandardMaterial({
        color: 0x82A855, // Light, aerated whisked matcha foam
        roughness: 0.75,
        metalness: 0.0
    });

    const foamMesh = new THREE.Mesh(foamGeom, foamMaterial);
    cupGroup.add(foamMesh);

    // --- 4. Crystal Ice Cubes ---
    const iceGroup = new THREE.Group();
    cupGroup.add(iceGroup);

    const iceMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xEEF8EB,
        roughness: 0.06,
        metalness: 0.02,
        transmission: 0.94,
        thickness: 0.6,
        ior: 1.31,
        transparent: true,
        opacity: 0.82,
        clearcoat: 0.9
    });

    // Create 4 distinct ice cubes floating in the upper liquid and resting in foam
    const iceConfigs = [
        { size: [0.42, 0.40, 0.44], pos: [0.18, 1.16, 0.15], rot: [0.35, 0.45, 0.2] },
        { size: [0.38, 0.42, 0.39], pos: [-0.22, 1.12, -0.16], rot: [-0.25, 0.8, -0.3] },
        { size: [0.36, 0.35, 0.38], pos: [0.24, 1.05, -0.22], rot: [0.5, -0.4, 0.6] },
        { size: [0.32, 0.34, 0.34], pos: [-0.15, 0.82, 0.24], rot: [-0.4, 0.3, 0.1] }
    ];

    iceConfigs.forEach(cfg => {
        const geom = new THREE.BoxGeometry(...cfg.size);
        const cube = new THREE.Mesh(geom, iceMaterial);
        cube.position.set(...cfg.pos);
        cube.rotation.set(...cfg.rot);
        iceGroup.add(cube);
    });

    // --- 5. Floating Matcha Droplet / Sparkle Particles ---
    const particleCount = 28;
    const particleGroup = new THREE.Group();
    cupGroup.add(particleGroup);

    const particleMaterial = new THREE.MeshStandardMaterial({
        color: 0x95BC68,
        emissive: 0x5D8436,
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.1
    });

    const particles = [];
    for (let i = 0; i < particleCount; i++) {
        const radius = 0.02 + Math.random() * 0.035;
        const geom = new THREE.SphereGeometry(radius, 10, 10);
        const drop = new THREE.Mesh(geom, particleMaterial);

        const angle = Math.random() * Math.PI * 2;
        const dist = 1.05 + Math.random() * 0.75;
        const y = -0.8 + Math.random() * 2.3;

        drop.position.set(Math.cos(angle) * dist, y, Math.sin(angle) * dist);
        particleGroup.add(drop);

        particles.push({
            mesh: drop,
            baseY: y,
            angle: angle,
            dist: dist,
            speed: 0.3 + Math.random() * 0.7,
            phase: Math.random() * Math.PI * 2
        });
    }

    // --- Interaction & Animation State ---
    let isDragging = false;
    let prevPointerX = 0;
    let prevPointerY = 0;
    let velX = 0;
    let velY = 0;
    let autoRotateSpeed = 0.007;
    let scrollTilt = 0;

    // Pointer Drag Listeners (Mouse & Touch)
    function onPointerDown(clientX, clientY) {
        isDragging = true;
        prevPointerX = clientX;
        prevPointerY = clientY;
        velX = 0;
        velY = 0;
    }

    function onPointerMove(clientX, clientY) {
        if (!isDragging) return;
        const dx = clientX - prevPointerX;
        const dy = clientY - prevPointerY;
        prevPointerX = clientX;
        prevPointerY = clientY;

        velX = dx * 0.006;
        velY = dy * 0.004;

        cupGroup.rotation.y += velX;
        cupGroup.rotation.x = Math.max(-0.4, Math.min(0.6, cupGroup.rotation.x + velY));
    }

    function onPointerUp() {
        isDragging = false;
    }

    heroSection.addEventListener('mousedown', (e) => onPointerDown(e.clientX, e.clientY));
    window.addEventListener('mousemove', (e) => onPointerMove(e.clientX, e.clientY));
    window.addEventListener('mouseup', onPointerUp);

    heroSection.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (isDragging && e.touches.length === 1) {
            onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: true });

    window.addEventListener('touchend', onPointerUp);

    // --- Scroll Response (Tilt & Depth as User Leaves Hero) ---
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const heroHeight = heroSection.offsetHeight || window.innerHeight;
        const progress = Math.min(Math.max(scrollY / heroHeight, 0), 1.5);

        // Smooth tilt and sink as user scrolls away
        scrollTilt = progress * 0.35;
        cupGroup.position.y = -progress * 0.8;
        cupGroup.position.z = -progress * 1.2;
    }, { passive: true });

    // --- Responsive Resize Handler ---
    function handleResize() {
        const width = heroSection.clientWidth || window.innerWidth;
        const height = heroSection.clientHeight || window.innerHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

        // Adjust camera distance for mobile viewports
        if (width < 600) {
            camera.position.z = 6.4;
            cupGroup.scale.set(0.85, 0.85, 0.85);
        } else if (width < 1024) {
            camera.position.z = 5.6;
            cupGroup.scale.set(0.95, 0.95, 0.95);
        } else {
            camera.position.z = 5.0;
            cupGroup.scale.set(1.0, 1.0, 1.0);
        }
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    // --- Animation Loop ---
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        // Auto-rotation when not interacting
        if (!isDragging) {
            velX *= 0.94; // Inertial decay
            velY *= 0.94;

            cupGroup.rotation.y += autoRotateSpeed + velX;
            cupGroup.rotation.x += velY;

            // Restoring gentle pitch tilt
            const targetX = 0.12 + scrollTilt + Math.sin(elapsedTime * 0.8) * 0.03;
            cupGroup.rotation.x += (targetX - cupGroup.rotation.x) * 0.05;
        }

        // Floating froth breathing animation
        foamMesh.position.y = 1.12 + Math.sin(elapsedTime * 1.8) * 0.008;

        // Subtle ice cube floating oscillation
        iceGroup.children.forEach((cube, idx) => {
            cube.position.y += Math.sin(elapsedTime * 1.5 + idx * 1.2) * 0.0006;
            cube.rotation.y += 0.001 * (idx % 2 === 0 ? 1 : -1);
        });

        // Orbiting matcha droplets animation
        particles.forEach(p => {
            p.angle += 0.005 * p.speed;
            p.mesh.position.x = Math.cos(p.angle) * p.dist;
            p.mesh.position.z = Math.sin(p.angle) * p.dist;
            p.mesh.position.y = p.baseY + Math.sin(elapsedTime * p.speed + p.phase) * 0.12;
        });

        renderer.render(scene, camera);
    }

    animate();
})();
