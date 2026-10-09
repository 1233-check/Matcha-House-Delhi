/*
 * cup3d.js — 2.5D Depth Parallax WebGL Shader
 * Uses Three.js to displace a photorealistic image based on a depth map,
 * creating a stunning 3D volume effect from a 2D image.
 */

import * as THREE from 'three';

const canvas = document.getElementById('cupCanvas');
const section = document.getElementById('home');

if (canvas && section) {
    const container = canvas.parentElement;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);

    const scene = new THREE.Scene();
    
    // Orthographic camera for 2D plane rendering
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Load textures
    const textureLoader = new THREE.TextureLoader();
    
    // Shader Uniforms
    const uniforms = {
        u_image: { type: 't', value: null },
        u_depth: { type: 't', value: null },
        u_mouse: { type: 'v2', value: new THREE.Vector2(0, 0) },
        u_intensity: { type: 'f', value: 0.15 }, // How strong the 3D effect is
        u_time: { type: 'f', value: 0.0 }
    };

    // Load original photorealistic image
    textureLoader.load('assets/spill.png', (texture) => {
        uniforms.u_image.value = texture;
    });

    // Load the depth map we generated
    textureLoader.load('assets/spill-depth.png', (texture) => {
        uniforms.u_depth.value = texture;
    });

    // Vertex Shader
    const vertexShader = `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

    // Fragment Shader (The Magic happens here)
    const fragmentShader = `
        uniform sampler2D u_image;
        uniform sampler2D u_depth;
        uniform vec2 u_mouse;
        uniform float u_intensity;
        uniform float u_time;
        varying vec2 vUv;

        void main() {
            // Read the depth value (0.0 to 1.0)
            vec4 depthMap = texture2D(u_depth, vUv);
            
            // Calculate how much to push the pixels based on depth and mouse position.
            // White areas (depth=1.0) move more than black areas (depth=0.0).
            // We use (depth - 0.5) to push foreground elements one way and background elements the other.
            float depthValue = depthMap.r;
            vec2 displacement = (vec2(depthValue) - 0.5) * u_mouse * u_intensity;
            
            // Add a very subtle continuous breathing/floating animation
            float floatX = sin(u_time * 1.5 + vUv.y * 3.0) * 0.005 * depthValue;
            float floatY = cos(u_time * 1.2 + vUv.x * 3.0) * 0.005 * depthValue;
            displacement += vec2(floatX, floatY);

            // Fetch the color from the original image at the displaced coordinate
            vec2 newUV = vUv + displacement;
            
            // Clamp to avoid edge tearing
            newUV = clamp(newUV, 0.001, 0.999);
            
            vec4 color = texture2D(u_image, newUV);
            
            // We can also use the depth map to slightly enhance lighting/shadows based on rotation
            float lightGlow = (depthValue * 0.3) * max(0.0, -u_mouse.y + u_mouse.x);
            color.rgb += lightGlow * 0.2; // Subtle 3D lighting shift

            gl_FragColor = color;
        }
    `;

    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        transparent: true
    });

    // Create a plane that covers the entire orthographic view
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Mouse Tracking
    let targetMouse = new THREE.Vector2(0, 0);
    let currentMouse = new THREE.Vector2(0, 0);

    section.addEventListener('mousemove', (e) => {
        const rect = section.getBoundingClientRect();
        // Normalize mouse to -1 to +1
        targetMouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        targetMouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1); // Invert Y for WebGL
    });
    
    section.addEventListener('mouseleave', () => {
        // Return to center when mouse leaves
        targetMouse.x = 0;
        targetMouse.y = 0;
    });

    // Device orientation for mobile
    window.addEventListener('deviceorientation', (e) => {
        if (e.gamma && e.beta) {
            targetMouse.x = Math.max(-1, Math.min(1, e.gamma / 30));
            targetMouse.y = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
        }
    });

    // Animation Loop
    const clock = new THREE.Clock();
    
    function animate() {
        requestAnimationFrame(animate);
        
        // Smoothly interpolate mouse (easing)
        currentMouse.x += (targetMouse.x - currentMouse.x) * 0.08;
        currentMouse.y += (targetMouse.y - currentMouse.y) * 0.08;
        
        uniforms.u_mouse.value = currentMouse;
        uniforms.u_time.value = clock.getElapsedTime();

        renderer.render(scene, camera);
    }
    animate();

    // Handle Resize
    window.addEventListener('resize', () => {
        const container = canvas.parentElement;
        renderer.setSize(container.clientWidth, container.clientHeight);
        
        const screenAspect = container.clientWidth / container.clientHeight;
        
        // Update orthographic camera to match screen aspect
        camera.left = -screenAspect;
        camera.right = screenAspect;
        camera.top = 1;
        camera.bottom = -1;
        camera.updateProjectionMatrix();
        
        // Scale the mesh uniformly to cover the entire screen (object-fit: cover)
        // Image aspect is 1.0 (square).
        const scale = Math.max(screenAspect, 1.0);
        mesh.scale.set(scale, scale, 1.0);
    });
    
    // Trigger initial resize to set aspect correctly
    window.dispatchEvent(new Event('resize'));
}
