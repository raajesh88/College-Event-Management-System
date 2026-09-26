import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * ThreeDBackground
 * An interactive, lightweight 60 FPS 3D Canvas powered by Three.js.
 * Visually features 3D representations of:
 * - College Environment (Campus columns, graduation cap, diplomas, academic nodes)
 * - Hackathons (3D wireframe cyber tech cubes, code matrix nodes, glowing circuits)
 * - Culturals (Dynamic iridescent torus knot, floating musical notes, festive sparkle spheres)
 * - Sports (Rotating geodesic athletic sphere, orbital energy rings, stadium light arcs)
 *
 * Includes mouse-driven camera parallax, floating physics, and vibrant ambient lighting.
 */
const ThreeDBackground = ({ _activeCategory = 'All' }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    const width = currentMount.clientWidth || window.innerWidth;
    const height = currentMount.clientHeight || 650;

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.z = 24;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    // Cyan Light (Hackathon / Tech)
    const cyanLight = new THREE.PointLight(0x06b6d4, 3.5, 45);
    cyanLight.position.set(-14, 8, 12);
    scene.add(cyanLight);

    // Magenta / Rose Light (Culturals)
    const roseLight = new THREE.PointLight(0xf43f5e, 3.5, 45);
    roseLight.position.set(14, -6, 12);
    scene.add(roseLight);

    // Amber / Gold Light (College & Excellence)
    const amberLight = new THREE.PointLight(0xf59e0b, 3, 40);
    amberLight.position.set(0, 10, 8);
    scene.add(amberLight);

    // Emerald Light (Sports & Athletics)
    const emeraldLight = new THREE.PointLight(0x10b981, 3, 40);
    emeraldLight.position.set(12, 10, -5);
    scene.add(emeraldLight);

    // --- Master Group for Parallax ---
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // =========================================================================
    // 1. HACKATHONS: 3D Cyber Wireframe Cube & Tech Matrix Data Nodes
    // =========================================================================
    const hackathonGroup = new THREE.Group();
    hackathonGroup.position.set(-10.5, 2.5, 0);

    // Outer Wireframe Box
    const cubeGeo = new THREE.BoxGeometry(3.6, 3.6, 3.6);
    const cubeEdges = new THREE.EdgesGeometry(cubeGeo);
    const cubeWireMat = new THREE.LineBasicMaterial({
      color: 0x06b6d4,
      linewidth: 2,
      transparent: true,
      opacity: 0.85,
    });
    const hackCube = new THREE.LineSegments(cubeEdges, cubeWireMat);
    hackathonGroup.add(hackCube);

    // Inner Glowing Core (Octahedron)
    const coreGeo = new THREE.OctahedronGeometry(1.5, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x0ea5e9,
      emissiveIntensity: 0.6,
      wireframe: true,
      roughness: 0.2,
      metalness: 0.8,
    });
    const hackCore = new THREE.Mesh(coreGeo, coreMat);
    hackathonGroup.add(hackCore);

    // Floating Cyber Node Satellite
    const satGeo = new THREE.BoxGeometry(0.7, 0.7, 0.7);
    const satMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      roughness: 0.3,
    });
    const hackSatellite = new THREE.Mesh(satGeo, satMat);
    hackSatellite.position.set(3, 2, 1);
    hackathonGroup.add(hackSatellite);

    worldGroup.add(hackathonGroup);

    // =========================================================================
    // 2. CULTURALS: 3D Iridescent Torus & Festive Musical Spheres
    // =========================================================================
    const culturalGroup = new THREE.Group();
    culturalGroup.position.set(10.5, 2.5, 0);

    // Iridescent Torus Knot representing Arts, Dance & Music flow
    const knotGeo = new THREE.TorusKnotGeometry(1.8, 0.45, 128, 24, 2, 3);
    const knotMat = new THREE.MeshStandardMaterial({
      color: 0xec4899,
      emissive: 0xbe185d,
      emissiveIntensity: 0.45,
      roughness: 0.25,
      metalness: 0.7,
      wireframe: true,
    });
    const culturalKnot = new THREE.Mesh(knotGeo, knotMat);
    culturalGroup.add(culturalKnot);

    // Festive Sparkle Halo Rings
    const ringGeo = new THREE.TorusGeometry(3.2, 0.08, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      transparent: true,
      opacity: 0.65,
    });
    const culturalRing = new THREE.Mesh(ringGeo, ringMat);
    culturalRing.rotation.x = Math.PI / 3;
    culturalGroup.add(culturalRing);

    worldGroup.add(culturalGroup);

    // =========================================================================
    // 3. SPORTS: Geodesic Athletic Sphere & High-Energy Speed Rings
    // =========================================================================
    const sportsGroup = new THREE.Group();
    sportsGroup.position.set(7, -4.5, 2);

    // Geodesic 3D Sports Ball (Icosahedron)
    const sportsGeo = new THREE.IcosahedronGeometry(2.1, 1);
    const sportsEdges = new THREE.EdgesGeometry(sportsGeo);
    const sportsWireMat = new THREE.LineBasicMaterial({
      color: 0x10b981,
      linewidth: 2,
    });
    const sportsSphere = new THREE.LineSegments(sportsEdges, sportsWireMat);
    sportsGroup.add(sportsSphere);

    // Inner Athletic Glow Sphere
    const innerSportsGeo = new THREE.SphereGeometry(1.6, 24, 24);
    const innerSportsMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.35,
      wireframe: true,
    });
    const innerSports = new THREE.Mesh(innerSportsGeo, innerSportsMat);
    sportsGroup.add(innerSports);

    // Athletic Speed Orbit Ring
    const orbitGeo = new THREE.RingGeometry(2.8, 3.0, 64);
    const orbitMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
    });
    const sportsOrbit = new THREE.Mesh(orbitGeo, orbitMat);
    sportsOrbit.rotation.x = Math.PI / 2.2;
    sportsGroup.add(sportsOrbit);

    worldGroup.add(sportsGroup);

    // =========================================================================
    // 4. COLLEGE ENVIRONMENT: University Mortarboard Cap & Campus Columns
    // =========================================================================
    const collegeGroup = new THREE.Group();
    collegeGroup.position.set(-7, -4.5, 2);

    // Graduation Mortarboard Top (Diamond)
    const capTopGeo = new THREE.CylinderGeometry(2.4, 2.4, 0.12, 4);
    const capTopMat = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.4,
      roughness: 0.3,
      metalness: 0.6,
    });
    const capTop = new THREE.Mesh(capTopGeo, capTopMat);
    capTop.rotation.y = Math.PI / 4;
    collegeGroup.add(capTop);

    // Cap Skullcap
    const skullGeo = new THREE.CylinderGeometry(1.1, 0.9, 0.8, 20);
    const skullMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a,
      roughness: 0.4,
    });
    const capSkull = new THREE.Mesh(skullGeo, skullMat);
    capSkull.position.y = -0.45;
    collegeGroup.add(capSkull);

    // Golden Tassel Ring
    const tasselRingGeo = new THREE.TorusGeometry(2.8, 0.05, 12, 60);
    const tasselRingMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.6,
    });
    const tasselRing = new THREE.Mesh(tasselRingGeo, tasselRingMat);
    tasselRing.rotation.x = Math.PI / 2;
    collegeGroup.add(tasselRing);

    // Campus Architectural Columns (Dual Pillars)
    const colGeo = new THREE.CylinderGeometry(0.35, 0.35, 2.5, 16);
    const colMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      wireframe: true,
    });
    const leftCol = new THREE.Mesh(colGeo, colMat);
    leftCol.position.set(-2.8, -0.6, -1);
    collegeGroup.add(leftCol);

    const rightCol = new THREE.Mesh(colGeo, colMat);
    rightCol.position.set(2.8, -0.6, -1);
    collegeGroup.add(rightCol);

    worldGroup.add(collegeGroup);

    // =========================================================================
    // 5. CENTER DYNAMIC AMBIENCE: Interactive Particle Constellation Grid
    // =========================================================================
    const particleCount = 220;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const palette = [
      new THREE.Color(0x06b6d4), // Cyan
      new THREE.Color(0xf43f5e), // Rose
      new THREE.Color(0xf59e0b), // Amber
      new THREE.Color(0x10b981), // Emerald
      new THREE.Color(0x8b5cf6), // Violet
    ];

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      particlePositions[idx] = (Math.random() - 0.5) * 44;
      particlePositions[idx + 1] = (Math.random() - 0.5) * 28;
      particlePositions[idx + 2] = (Math.random() - 0.5) * 18;

      const col = palette[Math.floor(Math.random() * palette.length)];
      particleColors[idx] = col.r;
      particleColors[idx + 1] = col.g;
      particleColors[idx + 2] = col.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.22,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    worldGroup.add(particles);

    // --- Interactive Mouse Parallax ---
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const handleMouseMove = (event) => {
      const rect = currentMount.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      mouse.targetX = x * 2.2;
      mouse.targetY = y * 2.2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // --- Resize Handler ---
    const handleResize = () => {
      if (!currentMount) return;
      const newWidth = currentMount.clientWidth;
      const newHeight = currentMount.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // --- Animation Loop ---
    let animationFrameId;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) / 1000;

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      worldGroup.rotation.y = mouse.x * 0.45;
      worldGroup.rotation.x = -mouse.y * 0.35;

      // 1. Hackathon Cube Animation
      hackCube.rotation.x = elapsedTime * 0.4;
      hackCube.rotation.y = elapsedTime * 0.5;
      hackCore.rotation.y = -elapsedTime * 0.7;
      hackCore.rotation.z = elapsedTime * 0.3;
      hackathonGroup.position.y = 2.5 + Math.sin(elapsedTime * 1.5) * 0.35;
      hackSatellite.position.x = Math.cos(elapsedTime * 1.8) * 3;
      hackSatellite.position.z = Math.sin(elapsedTime * 1.8) * 3;

      // 2. Cultural Torus Animation
      culturalKnot.rotation.x = elapsedTime * 0.5;
      culturalKnot.rotation.y = elapsedTime * 0.6;
      culturalRing.rotation.z = elapsedTime * 0.4;
      culturalGroup.position.y = 2.5 + Math.cos(elapsedTime * 1.4) * 0.35;

      // 3. Sports Geodesic Sphere Animation
      sportsSphere.rotation.x = elapsedTime * 0.5;
      sportsSphere.rotation.y = elapsedTime * 0.4;
      innerSports.rotation.z = -elapsedTime * 0.3;
      sportsOrbit.rotation.z = elapsedTime * 0.7;
      sportsGroup.position.y = -4.5 + Math.sin(elapsedTime * 1.6 + 1) * 0.3;

      // 4. College Cap Animation
      capTop.rotation.y = Math.PI / 4 + Math.sin(elapsedTime * 0.8) * 0.2;
      tasselRing.rotation.z = elapsedTime * 0.3;
      collegeGroup.position.y = -4.5 + Math.cos(elapsedTime * 1.3 + 1) * 0.3;

      // 5. Ambient Particles drift
      particles.rotation.y = elapsedTime * 0.03;
      particles.rotation.x = elapsedTime * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }

      // Dispose geometries & materials
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((mat) => mat.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="three-d-canvas-container"
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
};

export default ThreeDBackground;
