// src/components/ToggleEarthView.tsx
'use client';

import React, { useState } from 'react';
import FallbackEarthGlobe from './FallbackEarthGlobe';
import Image from 'next/image';

interface ToggleEarthViewProps {
  imageUrl: string;
  caption: string;
  date: string;
}

export default function ToggleEarthView({ imageUrl, caption, date }: ToggleEarthViewProps) {
  const [show3D, setShow3D] = useState(false);

  return (
    <div className="relative w-full">
      {/* Toggle Button */}
      <button
        onClick={() => setShow3D((prev) => !prev)}
        className="absolute top-4 right-4 z-20 px-4 py-2 bg-gray-800/90 text-white rounded-lg hover:bg-gray-700 transition"
      >
        {show3D ? 'Show NASA Image' : 'Show 3D Globe'}
      </button>

      {/* Full-size Container for both views */}
      <div className="relative w-full" style={{ height: '80vh' }}>
        {show3D ? (
          // ✅ 3D Globe View - Make sure it fills container
          <div className="absolute inset-0 bg-black/10">
            <FallbackEarthGlobe />
          </div>
        ) : (
          // NASA Image View
          <Image
            src={imageUrl}
            alt={caption || 'Earth view from space'}
            fill
            unoptimized
            className="object-contain"
            sizes="100vw"
          />
        )}
      </div>

      {/* Caption / Metadata */}
      <div className="p-6 mt-4 bg-gray-800/50 rounded-b-lg">
        <h2 className="text-2xl font-semibold mb-2">{caption || 'Earth View'}</h2>
        <p className="text-gray-200 leading-relaxed">
          Taken on: {new Date(date).toLocaleString()}
        </p>
      </div>
    </div>
  );
}