// src/components/SpaceBackground3D.tsx
'use client';

import React from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random';
import * as THREE from 'three';

function Stars() {
  const ref = React.useRef<THREE.Points>(null);

  const positions = React.useMemo(() => {
    const tempPositions = random.inSphere(new Float32Array(5000 * 3), { radius: 1.2 }) as Float32Array;

    for (let i = 0; i < tempPositions.length; i++) {
      if (isNaN(tempPositions[i])) {
        tempPositions[i] = (Math.random() - 0.5) * 2.4;
      }
    }

    return tempPositions;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled>
        <PointMaterial transparent color="#ffffff" size={0.005} sizeAttenuation depthWrite={false} />
      </Points>
    </group>
  );
}

export default function SpaceBackground3D() {
  return (
    <Canvas camera={{ position: [0, 0, 1] }} style={{ background: 'black', width: '100vw', height: '100vh' }}>
      <React.Suspense fallback={null}>
        <Stars />
      </React.Suspense>
      <ambientLight intensity={0.1} />
    </Canvas>
  );
}