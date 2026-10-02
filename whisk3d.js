import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const container = document.getElementById('scroll-anim-container');
if (container) {
    const scene = new THREE.Scene();
    
    // Camera
    const camera = new THREE.PerspectiveCamera(30, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 10, 10);
    camera.lookAt(0, 0, 0);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.VSMShadowMap;
    container.appendChild(renderer.domElement);
    
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

    const ambientLight = new THREE.AmbientLight(0xfffcf0, 0.6);
    scene.add(ambientLight);
    
    const spotLight = new THREE.SpotLight(0xffeedd, 5.0);
    spotLight.position.set(5, 15, 5);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.5;
    spotLight.decay = 1.5;
    spotLight.distance = 40;
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 2048;
    spotLight.shadow.mapSize.height = 2048;
    spotLight.shadow.bias = -0.0001;
    spotLight.shadow.radius = 4;
    scene.add(spotLight);

    const fillLight = new THREE.DirectionalLight(0xe6f2ff, 1.0);
    fillLight.position.set(-5, 5, -5);
    scene.add(fillLight);

    function createNoiseTexture(size, r, g, b, varR, varG, varB, scale) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        const imgData = ctx.createImageData(size, size);
        for (let i = 0; i < imgData.data.length; i += 4) {
            const noise = Math.random();
            imgData.data[i] = r + (noise * varR);
            imgData.data[i+1] = g + (noise * varG);
            imgData.data[i+2] = b + (noise * varB);
            imgData.data[i+3] = 255;
        }
        ctx.putImageData(imgData, 0, 0);
        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(scale, scale);
        return tex;
    }
    
    function createBambooTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        const imgData = ctx.createImageData(512, 512);
        for (let y = 0; y < 512; y++) {
            for (let x = 0; x < 512; x++) {
                const i = (y * 512 + x) * 4;
                const grain = Math.sin(x * 0.1) * Math.sin(x * 0.05 + y*0.01) * 15;
                const baseR = 210 + grain + (Math.random()*10);
                const baseG = 180 + grain + (Math.random()*10);
                const baseB = 130 + grain + (Math.random()*10);
                imgData.data[i] = baseR;
                imgData.data[i+1] = baseG;
                imgData.data[i+2] = baseB;
                imgData.data[i+3] = 255;
            }
        }
        ctx.putImageData(imgData, 0, 0);
        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        return tex;
    }

    const swirlCurve = new THREE.Curve();
    swirlCurve.getPoint = function (t, optionalTarget = new THREE.Vector3()) {
        const turns = 2.5;
        const angle = t * Math.PI * 2 * turns;
        const radius = t * 1.8;
        const y = Math.sin(t * Math.PI) * 0.15; 
        return optionalTarget.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
    };

    const swirlGeo = new THREE.TubeGeometry(swirlCurve, 128, 0.4, 32, false);
    swirlGeo.scale(1, 0.5, 1);
    
    const swirlMat = new THREE.MeshPhysicalMaterial({
        color: 0x5a8a2a,
        roughness: 0.1,
        metalness: 0.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        transmission: 0.2,
        thickness: 0.5
    });
    const swirl = new THREE.Mesh(swirlGeo, swirlMat);
    swirl.position.y = 0.2;
    swirl.castShadow = true;
    swirl.receiveShadow = true;
    scene.add(swirl);

    const powderGeo = new THREE.SphereGeometry(1.4, 128, 128);
    powderGeo.scale(1, 0.35, 1);
    
    const posAttribute = powderGeo.attributes.position;
    for (let i = 0; i < posAttribute.count; i++) {
        const x = posAttribute.getX(i);
        const y = posAttribute.getY(i);
        const z = posAttribute.getZ(i);
        const bump = Math.sin(x*4)*Math.cos(z*4) * 0.08 + Math.sin(x*10)*0.02;
        posAttribute.setXYZ(i, x, y + bump, z);
    }
    powderGeo.computeVertexNormals();
    
    const powderTex = createNoiseTexture(512, 90, 130, 40, 20, 30, 10, 8);
    
    const powderMat = new THREE.MeshStandardMaterial({ 
        color: 0x668833, 
        roughness: 1.0,
        metalness: 0.0,
        map: powderTex,
        bumpMap: powderTex,
        bumpScale: 0.05
    });
    const powder = new THREE.Mesh(powderGeo, powderMat);
    powder.position.y = 0.1;
    powder.castShadow = true;
    powder.receiveShadow = true;
    scene.add(powder);

    const whisk = new THREE.Group();
    const woodTex = createBambooTexture();
    const woodMat = new THREE.MeshPhysicalMaterial({ 
        color: 0xead5a6,
        roughness: 0.4,
        clearcoat: 0.3,
        map: woodTex
    });

    const handleGeo = new THREE.CylinderGeometry(0.32, 0.4, 2.0, 32);
    const handle = new THREE.Mesh(handleGeo, woodMat);
    handle.position.y = 2.0;
    handle.castShadow = true;
    whisk.add(handle);
    
    const knotGeo = new THREE.TorusGeometry(0.38, 0.04, 16, 32);
    const knotMat = new THREE.MeshStandardMaterial({ color: 0x151515, roughness: 0.9 });
    const knot = new THREE.Mesh(knotGeo, knotMat);
    knot.position.y = 1.0;
    knot.rotation.x = Math.PI / 2;
    whisk.add(knot);

    const tineCount = 60;
    for (let i = 0; i < tineCount; i++) {
        const angle = (i / tineCount) * Math.PI * 2;
        const curve = new THREE.CubicBezierCurve3(
            new THREE.Vector3(0, 1.0, 0),
            new THREE.Vector3(0, 0.2, 0),
            new THREE.Vector3(1.2, -0.4, 0),
            new THREE.Vector3(0.3, -0.8, 0)
        );
        const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.035, 8, false);
        const tine = new THREE.Mesh(tubeGeo, woodMat);
        tine.rotation.y = angle;
        tine.rotation.z = (Math.random() - 0.5) * 0.03;
        tine.scale.set(1, 1, 0.4);
        tine.position.x = Math.sin(angle) * 0.32;
        tine.position.z = Math.cos(angle) * 0.32;
        tine.castShadow = true;
        whisk.add(tine);
    }
    
    const innerTineCount = 30;
    for (let i = 0; i < innerTineCount; i++) {
        const angle = (i / innerTineCount) * Math.PI * 2;
        const curve = new THREE.CubicBezierCurve3(
            new THREE.Vector3(0, 1.0, 0),
            new THREE.Vector3(0, 0.4, 0),
            new THREE.Vector3(0.5, 0.0, 0.5),
            new THREE.Vector3(0, -0.6, 0)
        );
        const tubeGeo = new THREE.TubeGeometry(curve, 12, 0.025, 6, false);
        const tine = new THREE.Mesh(tubeGeo, woodMat);
        tine.rotation.y = angle;
        tine.position.x = Math.sin(angle) * 0.15;
        tine.position.z = Math.cos(angle) * 0.15;
        tine.castShadow = true;
        whisk.add(tine);
    }
    
    whisk.rotation.z = 0.2;
    whisk.rotation.x = 0.1;
    scene.add(whisk);

    const floorGeo = new THREE.PlaneGeometry(50, 50);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.15 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);

    swirl.scale.set(0.001, 0.001, 0.001);
    powder.scale.set(1, 1, 1);
    whisk.position.y = 0.8;

    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;
        if (swirl.scale.x > 0) {
            swirl.rotation.y += 0.001;
            swirl.scale.y = 0.5 + Math.sin(time * 2) * 0.02;
        }
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    const scrollSection = document.getElementById('scroll-animation');
    window.addEventListener('scroll', () => {
        const rect = scrollSection.getBoundingClientRect();
        const scrollDistance = rect.height - window.innerHeight;
        let progress = -rect.top / scrollDistance;
        progress = Math.max(0, Math.min(1, progress));

        camera.position.x = Math.sin(progress * Math.PI * 0.25) * 3;
        camera.position.z = 10 - Math.sin(progress * Math.PI) * 2;
        camera.lookAt(0, 0, 0);

        let animProgress = 0;
        if (progress > 0.2 && progress <= 0.8) {
            const t = (progress - 0.2) / 0.6;
            animProgress = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        } else if (progress > 0.8) {
            animProgress = 1;
        }

        whisk.position.y = 0.8 + (3 * animProgress); 
        whisk.rotation.y = animProgress * Math.PI * 2;

        const pScale = Math.max(0.001, 1 - animProgress);
        powder.scale.set(pScale, pScale, pScale);
        
        const sScale = animProgress < 1 ? animProgress * (1 + Math.sin(animProgress * Math.PI)*0.1) : 1;
        swirl.scale.set(sScale, sScale, sScale);
    });
    
    window.dispatchEvent(new Event('scroll'));
}
