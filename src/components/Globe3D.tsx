// src/components/Globe3D.tsx
'use client'; // This marks the component as a Client Component

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import { Mesh } from 'three'; // Import Mesh type for useRef

interface Globe3DProps {
  size?: number;
  position?: [number, number, number];
  color?: string;
  rotationSpeed?: number;
}

function RotatingGlobe({ size = 1, position = [0, 0, 0], color = '#4A90E2', rotationSpeed = 0.005 }: Globe3DProps) {
  const meshRef = useRef<Mesh>(null); // Use Mesh type for the ref

  // useFrame allows you to execute code on every rendered frame
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed;
    }
  });

  return (
    <Sphere args={[size, 32, 32]} ref={meshRef} position={position}>
      <meshStandardMaterial color={color} />
    </Sphere>
  );
}

const Globe3DCanvas = ({ size, position, color, rotationSpeed }: Globe3DProps) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 3], fov: 75 }} // Camera position and field of view
      className="absolute top-0 left-0 w-full h-full z-0" // Position it behind content
    >
      <ambientLight intensity={0.5} /> {/* General light */}
      <pointLight position={[10, 10, 10]} /> {/* Light source */}
      <RotatingGlobe size={size} position={position} color={color} rotationSpeed={rotationSpeed} />
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={true} /> {/* For basic interaction */}
    </Canvas>
  );
};

export default Globe3DCanvas;