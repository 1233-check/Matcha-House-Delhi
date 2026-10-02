import * as THREE from 'three';

const canvas = document.getElementById('whiskCanvas');
if (canvas) {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(200, 200);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 4.5);

    // Bamboo material
    const bambooMaterial = new THREE.MeshStandardMaterial({
        color: 0xc1a87c,
        roughness: 0.7,
        metalness: 0.1
    });

    const whiskGroup = new THREE.Group();

    // 1. The Handle (base)
    const handleGeo = new THREE.CylinderGeometry(0.3, 0.35, 1.2, 16);
    const handleMesh = new THREE.Mesh(handleGeo, bambooMaterial);
    handleMesh.position.y = -0.6;
    whiskGroup.add(handleMesh);

    // 2. The Prongs (bristles)
    // We'll create a ring of curved splines representing the bamboo prongs
    const numProngs = 48;
    for (let i = 0; i < numProngs; i++) {
        const angle = (i / numProngs) * Math.PI * 2;
        
        // Define points for a bezier curve
        // Base of the prong (top of handle)
        const baseX = Math.cos(angle) * 0.28;
        const baseZ = Math.sin(angle) * 0.28;
        const p0 = new THREE.Vector3(baseX, 0, baseZ);
        
        // Middle bulge
        const midRadius = 0.5;
        const p1 = new THREE.Vector3(Math.cos(angle) * midRadius, 0.6, Math.sin(angle) * midRadius);
        
        // Top inward curve
        const topRadius = 0.1;
        const p2 = new THREE.Vector3(Math.cos(angle) * topRadius, 1.2, Math.sin(angle) * topRadius);
        
        // Inner tuck
        const p3 = new THREE.Vector3(Math.cos(angle) * 0.2, 0.9, Math.sin(angle) * 0.2);

        const curve = new THREE.CubicBezierCurve3(p0, p1, p2, p3);
        const tubeGeo = new THREE.TubeGeometry(curve, 10, 0.015, 4, false);
        const prongMesh = new THREE.Mesh(tubeGeo, bambooMaterial);
        whiskGroup.add(prongMesh);
    }

    // 3. The inner core (knot)
    const knotGeo = new THREE.SphereGeometry(0.15, 16, 16);
    const knotMesh = new THREE.Mesh(knotGeo, bambooMaterial);
    knotMesh.position.y = 0.8;
    knotMesh.scale.y = 1.5;
    whiskGroup.add(knotMesh);

    // Adjust position so it spins nicely
    whiskGroup.position.y = -0.3;
    scene.add(whiskGroup);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0xfff0dd, 0.8);
    fillLight.position.set(-5, 0, 5);
    scene.add(fillLight);

    // Animation
    const clock = new THREE.Clock();
    let isHovered = false;
    
    // Interaction
    canvas.addEventListener('mouseenter', () => isHovered = true);
    canvas.addEventListener('mouseleave', () => isHovered = false);

    function animate() {
        requestAnimationFrame(animate);
        
        const delta = clock.getDelta();
        
        // Base rotation
        let rotationSpeed = 1.0;
        
        // Spin faster on hover
        if (isHovered) {
            rotationSpeed = 3.5;
            whiskGroup.rotation.x = THREE.MathUtils.lerp(whiskGroup.rotation.x, 0.3, 0.1);
        } else {
            whiskGroup.rotation.x = THREE.MathUtils.lerp(whiskGroup.rotation.x, 0.1, 0.1);
        }
        
        whiskGroup.rotation.y += rotationSpeed * delta;

        // Gentle floating
        whiskGroup.position.y = -0.3 + Math.sin(clock.elapsedTime * 2) * 0.05;

        renderer.render(scene, camera);
    }
    
    animate();
}
