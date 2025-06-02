// src/components/SpaceBackground3DWrapper.tsx

'use client';

import dynamic from 'next/dynamic';

const SpaceBackground3D = dynamic(() => import('./SpaceBackground3D'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-0 bg-gray-900"></div>
  ),
});

export default function SpaceBackground3DWrapper() {
  return <SpaceBackground3D />;
}