"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

// Simple particle system forming a rotating sphere.
// Colors use design tokens defined in globals.css.
function Particles() {
  const pointsRef = useRef<THREE.Points>(null);
  // Generate fixed positions on a sphere.
  const positions = useMemo(() => {
    const count = 1500; // approx. 1.5k particles for desktop.
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // uniform spherical coordinates
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = 2 * Math.PI * Math.random();
      const radius = 2 + Math.random() * 0.5; // radius ~2.0–2.5
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      arr[i * 3] = x;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = z;
    }
    return arr;
  }, []);

  // Color each particle based on index to cycle gold/blue/white.
  const colors = useMemo(() => {
    const arr = new Float32Array(positions.length);
    for (let i = 0; i < positions.length / 3; i++) {
      // cycle through three token colors.
      const t = i % 3;
      let hex = "#ffffff";
      if (t === 0) hex = getComputedStyle(document.documentElement).getPropertyValue("--gold");
      else if (t === 1) hex = getComputedStyle(document.documentElement).getPropertyValue("--blue");
      else hex = "#ffffff";
      const c = new THREE.Color(hex.trim());
      arr[i * 3] = c.r;
      arr[i * 3 + 1] = c.g;
      arr[i * 3 + 2] = c.b;
    }
    return arr;
  }, [positions]);

  useFrame((state, delta) => {
    // gentle rotation on X and Y.
    if (pointsRef.current) {
      pointsRef.current.rotation.x += delta * 0.05;
      pointsRef.current.rotation.y += delta * 0.03;
    }
  });

  return (
    <points ref={pointsRef} geometry={new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(positions, 3)).setAttribute("color", new THREE.BufferAttribute(colors, 3))}>
      <pointsMaterial size={0.02} vertexColors sizeAttenuation={false} transparent opacity={0.9} />
    </points>
  );
}

export default function HeroParticles() {
  return (
    <div className="hero-particles" style={{ width: "100%", height: "300px" }} aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }} gl={{ antialias: true }}>
        <ambientLight intensity={0.5} />
        <Particles />
      </Canvas>
    </div>
  );
}
