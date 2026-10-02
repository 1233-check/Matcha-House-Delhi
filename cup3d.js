/*
 * cup3d.js — Photorealistic 3D Matcha Cup
 * Built entirely with Three.js procedural geometry — no external .glb needed.
 * Features: PBR glass, liquid, ice, splash particles, cinematic lighting,
 *            drag-to-spin, auto-rotate, scroll-linked parallax, mobile touch.
 */

import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const canvas = document.getElementById('cupCanvas');
if (!canvas) { console.warn('cup3d: #cupCanvas not found'); }

// ─── 1. RENDERER ──────────────────────────────────────────────────────────────
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
  powerPreference: 'high-performance',
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setClearColor(0x000000, 0); // transparent background

// ─── 2. SCENE & CAMERA ────────────────────────────────────────────────────────
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0.8, 6.5);
camera.lookAt(0, 0.8, 0);

// ─── 3. ENVIRONMENT (PMREM for realistic reflections) ─────────────────────────
const pmremGenerator = new THREE.PMREMGenerator(renderer);
const roomEnv = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environment = roomEnv;

// ─── 4. LIGHTS ────────────────────────────────────────────────────────────────
// Cinematic 3-point rig
const keyLight = new THREE.DirectionalLight(0xfff5e0, 4.0);
keyLight.position.set(3, 5, 4);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(2048, 2048);
keyLight.shadow.camera.near = 0.1;
keyLight.shadow.camera.far = 20;
keyLight.shadow.radius = 8;
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0xc8f0d0, 1.8);
fillLight.position.set(-4, 2, 2);
scene.add(fillLight);

const rimLight = new THREE.DirectionalLight(0xffffff, 2.5);
rimLight.position.set(0, 2, -4);
scene.add(rimLight);

// Matcha glow — warm green beneath the cup
const matchaGlow = new THREE.PointLight(0x6fbf3f, 3.0, 6.0);
matchaGlow.position.set(0, -0.5, 1.2);
scene.add(matchaGlow);

// Top ice-fill light
const topLight = new THREE.PointLight(0xddeeff, 1.5, 5);
topLight.position.set(0, 3.5, 0);
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0xfff8f0, 0.6);
scene.add(ambientLight);

// ─── 5. MASTER GROUP ──────────────────────────────────────────────────────────
const cupGroup = new THREE.Group();
scene.add(cupGroup);

// ─── 6. CUP GEOMETRY (LatheGeometry — tapered iced-matcha tumbler) ────────────
function buildCup() {
  // Profile points tracing the outer silhouette (radius, height)
  const outerProfile = [
    new THREE.Vector2(0.00, 0.00),
    new THREE.Vector2(1.08, 0.00),
    new THREE.Vector2(1.12, 0.04),
    new THREE.Vector2(1.12, 0.09),
    new THREE.Vector2(1.06, 0.12),
    new THREE.Vector2(0.94, 0.40),
    new THREE.Vector2(0.90, 0.80),
    new THREE.Vector2(0.88, 1.30),
    new THREE.Vector2(0.90, 1.80),
    new THREE.Vector2(0.95, 2.20),
    new THREE.Vector2(1.02, 2.50),
    new THREE.Vector2(1.10, 2.65),
    new THREE.Vector2(1.14, 2.72),
    new THREE.Vector2(1.14, 2.76),
    new THREE.Vector2(1.10, 2.80),
    new THREE.Vector2(1.06, 2.82),
  ];

  const innerProfile = [
    new THREE.Vector2(0.01, 0.08),
    new THREE.Vector2(1.00, 0.08),
    new THREE.Vector2(0.94, 0.12),
    new THREE.Vector2(0.86, 0.40),
    new THREE.Vector2(0.82, 0.85),
    new THREE.Vector2(0.80, 1.30),
    new THREE.Vector2(0.82, 1.80),
    new THREE.Vector2(0.87, 2.20),
    new THREE.Vector2(0.94, 2.50),
    new THREE.Vector2(1.00, 2.65),
    new THREE.Vector2(1.02, 2.75),
  ];

  const SEGS = 128;

  // Glass material — physically-based transmission
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0xeef8ff),
    metalness: 0.0,
    roughness: 0.06,
    transmission: 0.92,
    thickness: 0.5,
    ior: 1.52,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    transparent: true,
    opacity: 0.85,
    side: THREE.FrontSide,
    depthWrite: false,
    envMapIntensity: 2.0,
  });

  const glassInnerMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0xeef8ff),
    metalness: 0.0,
    roughness: 0.04,
    transmission: 0.88,
    thickness: 0.3,
    ior: 1.52,
    clearcoat: 0.8,
    clearcoatRoughness: 0.03,
    transparent: true,
    opacity: 0.6,
    side: THREE.BackSide,
    depthWrite: false,
    envMapIntensity: 1.5,
  });

  // Outer shell
  const outerGeo = new THREE.LatheGeometry(outerProfile, SEGS);
  const outerMesh = new THREE.Mesh(outerGeo, glassMat);
  outerMesh.castShadow = true;
  cupGroup.add(outerMesh);

  // Inner cavity
  const innerGeo = new THREE.LatheGeometry(innerProfile, SEGS);
  const innerMesh = new THREE.Mesh(innerGeo, glassInnerMat);
  cupGroup.add(innerMesh);

  // Flat glass bottom disc
  const bottomGeo = new THREE.CircleGeometry(1.08, SEGS);
  const bottomMesh = new THREE.Mesh(bottomGeo, glassMat);
  bottomMesh.rotation.x = -Math.PI / 2;
  bottomMesh.position.y = 0.01;
  cupGroup.add(bottomMesh);
}

buildCup();

// ─── 7. MATCHA LIQUID ─────────────────────────────────────────────────────────
function buildLiquid() {
  const liquidGroup = new THREE.Group();

  // Liquid fill body (cylinder inside the cup)
  const liquidGeo = new THREE.CylinderGeometry(0.88, 0.80, 2.15, 128, 1, true);
  const liquidMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0x3a6e18),
    metalness: 0.0,
    roughness: 0.1,
    transparent: true,
    opacity: 0.82,
    side: THREE.BackSide,
    depthWrite: false,
  });
  const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
  liquidMesh.position.y = 0.08 + 2.15 / 2;
  liquidGroup.add(liquidMesh);

  // Froth surface — animated shader
  const frothVert = `
    varying vec2 vUv;
    uniform float u_time;
    void main() {
      vUv = uv;
      vec3 pos = position;
      pos.y += sin(pos.x * 8.0 + u_time * 2.0) * 0.008;
      pos.y += cos(pos.z * 6.0 + u_time * 1.5) * 0.006;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;
  const frothFrag = `
    varying vec2 vUv;
    uniform float u_time;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    void main() {
      vec2 uv = vUv * 6.0;
      float n1 = noise(uv + u_time * 0.18);
      float n2 = noise(uv * 2.0 - u_time * 0.12);
      float foam = smoothstep(0.38, 0.72, n1 * 0.6 + n2 * 0.4);

      vec3 deepGreen  = vec3(0.22, 0.43, 0.09);
      vec3 midGreen   = vec3(0.42, 0.70, 0.15);
      vec3 frothWhite = vec3(0.92, 0.98, 0.88);

      vec3 col = mix(deepGreen, midGreen, n1);
      col = mix(col, frothWhite, foam * 0.55);

      // radial vignette to keep edges clean
      float dist = length(vUv - 0.5) * 2.0;
      col = mix(col, deepGreen, smoothstep(0.7, 1.0, dist));

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  const frothUniforms = { u_time: { value: 0.0 } };
  const frothMat = new THREE.ShaderMaterial({
    uniforms: frothUniforms,
    vertexShader: frothVert,
    fragmentShader: frothFrag,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

  const frothGeo = new THREE.CircleGeometry(0.86, 128);
  const frothMesh = new THREE.Mesh(frothGeo, frothMat);
  frothMesh.rotation.x = -Math.PI / 2;
  frothMesh.position.y = 2.25;
  frothMesh.userData.frothUniforms = frothUniforms;
  liquidGroup.add(frothMesh);

  cupGroup.add(liquidGroup);
  return { frothMesh, frothUniforms };
}

const { frothMesh, frothUniforms } = buildLiquid();

// ─── 8. ICE CUBES ─────────────────────────────────────────────────────────────
function buildIceCubes() {
  const iceMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0xddeeff),
    metalness: 0.0,
    roughness: 0.08,
    transmission: 0.55,
    thickness: 0.3,
    ior: 1.31,
    transparent: true,
    opacity: 0.88,
    clearcoat: 0.6,
    clearcoatRoughness: 0.1,
    envMapIntensity: 1.2,
    depthWrite: false,
  });

  const icePlacements = [
    { x:  0.30, y: 1.90, z:  0.10, ry: 0.4, s: 0.38 },
    { x: -0.28, y: 2.00, z: -0.15, ry: 1.1, s: 0.34 },
    { x:  0.05, y: 2.10, z:  0.30, ry: 2.2, s: 0.30 },
    { x: -0.10, y: 1.80, z:  0.00, ry: 0.8, s: 0.36 },
  ];

  icePlacements.forEach(({ x, y, z, ry, s }) => {
    const geo = new THREE.BoxGeometry(s, s, s, 3, 3, 3);
    // Jitter vertices for irregular, chipped-ice look
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      pos.setXYZ(
        i,
        pos.getX(i) + (Math.random() - 0.5) * 0.04,
        pos.getY(i) + (Math.random() - 0.5) * 0.04,
        pos.getZ(i) + (Math.random() - 0.5) * 0.04,
      );
    }
    geo.computeVertexNormals();

    const ice = new THREE.Mesh(geo, iceMat);
    ice.position.set(x, y, z);
    ice.rotation.y = ry;
    ice.castShadow = true;
    cupGroup.add(ice);
  });
}

buildIceCubes();

// ─── 9. STRAW ─────────────────────────────────────────────────────────────────
function buildStraw() {
  const strawMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0x7bc95c),
    metalness: 0.0,
    roughness: 0.4,
    transparent: true,
    opacity: 0.90,
  });

  const strawGeo = new THREE.CylinderGeometry(0.04, 0.04, 3.4, 24);
  const straw = new THREE.Mesh(strawGeo, strawMat);
  straw.position.set(0.35, 1.5, 0.1);
  straw.rotation.z = Math.PI * 0.04;
  straw.castShadow = true;
  cupGroup.add(straw);
}

buildStraw();

// ─── 10. SPLASH PARTICLES ─────────────────────────────────────────────────────
function buildSplash() {
  const count = 280;
  const positions = new Float32Array(count * 3);
  const sizes     = new Float32Array(count);
  const speeds    = new Float32Array(count);
  const offsets   = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const angle  = Math.random() * Math.PI * 2;
    const radius = 1.1 + Math.random() * 1.8;
    const height = 1.5 + Math.random() * 2.0;
    positions[i * 3 + 0] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = height;
    positions[i * 3 + 2] = Math.sin(angle) * radius;
    sizes[i]   = 0.04 + Math.random() * 0.12;
    speeds[i]  = 0.4  + Math.random() * 0.6;
    offsets[i] = Math.random() * Math.PI * 2;
  }

  const splashGeo = new THREE.BufferGeometry();
  splashGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  splashGeo.setAttribute('aSize',    new THREE.BufferAttribute(sizes, 1));

  const splashMat = new THREE.PointsMaterial({
    color: new THREE.Color(0x4a8c1a),
    size: 0.09,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.75,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const splash = new THREE.Points(splashGeo, splashMat);
  splash.userData = { positions: positions.slice(), speeds, offsets };
  cupGroup.add(splash);
  return splash;
}

const splashParticles = buildSplash();

// ─── 11. DROP SHADOW DISC (GROUND PLANE) ──────────────────────────────────────
function buildShadowDisc() {
  const shadowGeo = new THREE.CircleGeometry(1.8, 64);
  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x2a3d0a,
    transparent: true,
    opacity: 0.18,
    depthWrite: false,
  });
  const shadowDisc = new THREE.Mesh(shadowGeo, shadowMat);
  shadowDisc.rotation.x = -Math.PI / 2;
  shadowDisc.position.y = -0.02;
  cupGroup.add(shadowDisc);
}

buildShadowDisc();

// ─── 12. CONTROLS — DRAG, AUTO-ROTATE, TOUCH ──────────────────────────────────
let isDragging  = false;
let prevMouseX  = 0;
let prevMouseY  = 0;
let velX        = 0;
let autoRotSpeed = 0.006;
let targetRotY  = 0;
let currentRotY = 0;
let targetRotX  = 0.12;
let currentRotX = 0.12;
let hoverTiltX  = 0;
let hoverTiltY  = 0;

canvas.addEventListener('mousedown', (e) => {
  isDragging = true;
  prevMouseX = e.clientX;
  prevMouseY = e.clientY;
  velX = 0;
  canvas.style.cursor = 'grabbing';
});

window.addEventListener('mousemove', (e) => {
  if (isDragging) {
    const dx = e.clientX - prevMouseX;
    const dy = e.clientY - prevMouseY;
    targetRotY += dx * 0.012;
    targetRotX += dy * 0.005;
    targetRotX = Math.max(-0.4, Math.min(0.55, targetRotX));
    velX = dx;
    prevMouseX = e.clientX;
    prevMouseY = e.clientY;
  } else {
    // Subtle parallax tilt on hover
    const rect = canvas.getBoundingClientRect();
    hoverTiltY = ((e.clientX - rect.left) / rect.width  - 0.5) * 0.18;
    hoverTiltX = ((e.clientY - rect.top)  / rect.height - 0.5) * 0.12;
  }
});

window.addEventListener('mouseup', () => {
  isDragging = false;
  canvas.style.cursor = 'grab';
  targetRotY += velX * 0.04; // momentum
});

// Touch support
canvas.addEventListener('touchstart', (e) => {
  isDragging = true;
  prevMouseX = e.touches[0].clientX;
  prevMouseY = e.touches[0].clientY;
  velX = 0;
}, { passive: true });

canvas.addEventListener('touchmove', (e) => {
  if (!isDragging) return;
  const dx = e.touches[0].clientX - prevMouseX;
  const dy = e.touches[0].clientY - prevMouseY;
  targetRotY += dx * 0.012;
  targetRotX += dy * 0.005;
  targetRotX = Math.max(-0.4, Math.min(0.55, targetRotX));
  velX = dx;
  prevMouseX = e.touches[0].clientX;
  prevMouseY = e.touches[0].clientY;
  e.preventDefault();
}, { passive: false });

canvas.addEventListener('touchend', () => {
  isDragging = false;
  targetRotY += velX * 0.04;
});

// ─── 13. SCROLL-LINKED ANIMATION ──────────────────────────────────────────────
let scrollProgress = 0;

window.addEventListener('scroll', () => {
  const hero = document.getElementById('home');
  if (!hero) return;
  const heroH = hero.offsetHeight;
  scrollProgress = Math.min(1.0, window.scrollY / heroH);
}, { passive: true });

// ─── 14. ANIMATION LOOP ───────────────────────────────────────────────────────
const clock = new THREE.Clock();
let frame = 0;

function animate() {
  requestAnimationFrame(animate);
  frame++;
  const t = clock.getElapsedTime();

  // Auto-rotate when not dragging
  if (!isDragging) {
    targetRotY += autoRotSpeed;
    // Smoothly restore X tilt
    targetRotX += (0.12 - targetRotX) * 0.02;
  }

  // Eased interpolation
  currentRotY += (targetRotY - currentRotY) * 0.06;
  currentRotX += (targetRotX - currentRotX) * 0.06;

  cupGroup.rotation.y = currentRotY + hoverTiltY;
  cupGroup.rotation.x = currentRotX + hoverTiltX;

  // Scroll-linked: tilt forward and move camera back
  const scrollY = scrollProgress;
  cupGroup.rotation.x += scrollY * 0.5;
  cupGroup.position.y  = -scrollY * 0.8;
  canvas.style.opacity = String(1.0 - scrollY * 0.85);

  // Froth animation
  frothUniforms.u_time.value = t;

  // Gentle liquid sway
  frothMesh.position.y = 2.25 + Math.sin(t * 1.2) * 0.012;

  // Matcha glow pulse
  matchaGlow.intensity = 2.8 + Math.sin(t * 2.0) * 0.5;

  // Splash particle float (every 2 frames for perf)
  if (frame % 2 === 0) {
    const { positions, speeds, offsets } = splashParticles.userData;
    const posAttr = splashParticles.geometry.attributes.position;
    for (let i = 0; i < speeds.length; i++) {
      const orig_y = positions[i * 3 + 1];
      posAttr.setY(i, orig_y + Math.sin(t * speeds[i] + offsets[i]) * 0.06);
    }
    posAttr.needsUpdate = true;
  }

  renderer.render(scene, camera);
}

animate();

// ─── 15. RESIZE ───────────────────────────────────────────────────────────────
function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onResize);
