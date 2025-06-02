// src/components/FallbackEarthGlobe.tsx
'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, useTexture } from '@react-three/drei';
import * as THREE from 'three';

export default function FallbackEarthGlobe() {
  return (
    <Canvas camera={{ position: [0, 0, 2], fov: 45 }}>
      <ambientLight intensity={0.5} />
      <Stars radius={100} depth={50} count={5000} factor={4} fade />
      <Earth />
      <OrbitControls enableZoom={true} autoRotate={false} />
    </Canvas>
  );
}

function Earth() {
  const texture = useTexture('/textures/earth.jpg');

  const ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (ref.current) {
   {/* ts-expect-error - rotation property exists but might be flagged due to typing */}
      ref.current.rotation.y += 0.002; // Slow rotation
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial map={texture} />
      <pointLight position={[5, 3, 5]} intensity={1.2} />
    </mesh>
  );
}