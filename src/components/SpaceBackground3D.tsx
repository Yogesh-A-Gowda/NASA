// src/components/SpaceBackground3D.tsx
'use client'; // This component must be a Client Component

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random';
import * as THREE from 'three'; // Import Three.js for BufferAttribute

function Stars(props: any) {
  const ref = useRef<THREE.Points>(null); // Type the ref for Points
  // Generate random positions for 5000 stars
  // Use useMemo to ensure positions are only calculated once
  const positions = useMemo(() => {
    const tempPositions = random.inSphere(new Float32Array(5000 * 3), { radius: 1.2 });
    // Add a quick check for NaN values, though maath/random is usually reliable
    for (let i = 0; i < tempPositions.length; i++) {
      if (isNaN(tempPositions[i])) {
        console.error('NaN detected in star positions at index:', i);
        // Fallback to a valid number if NaN is somehow generated (highly unlikely with maath)
        tempPositions[i] = (Math.random() - 0.5) * 2.4; // Random value within the sphere diameter
      }
    }
    return tempPositions;
  }, []); // Empty dependency array ensures this runs only once

  useFrame((state, delta) => {
    // Rotate the stars slowly
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled {...props}>
        <PointMaterial transparent color="#ffffff" size={0.005} sizeAttenuation depthWrite={false} />
      </Points>
    </group>
  );
}

export default function SpaceBackground3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 1] }}
      // Ensure the background is black and covers the full viewport
      style={{ background: 'black', width: '100vw', height: '100vh' }}
    >
      <React.Suspense fallback={null}>
        <Stars />
      </React.Suspense>
      {/* Optional: Add a subtle ambient light if desired */}
      <ambientLight intensity={0.1} />
    </Canvas>
  );
}