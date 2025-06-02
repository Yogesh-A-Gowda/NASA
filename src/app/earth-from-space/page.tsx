// src/app/earth-from-space/page.tsx
import { fetchEpicImage } from '@/types/fetchEpicImage';// Make sure this path is correct
import ToggleEarthView from '@/components/ToggleEarthView'; // ✅ Import new toggle component
import FallbackEarthGlobe from '@/components/FallbackEarthGlobe';
export default async function EarthFromSpacePage() {
  const epicImage = await fetchEpicImage();

  if (!epicImage) {
    return (
      <div className="min-h-screen p-6 text-white flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-6 text-blue-300">Earth From Space</h1>
          <p className="text-lg text-gray-400 mb-6">Failed to load image from NASA API</p>
          <div className="mt-6">
            <FallbackEarthGlobe />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 text-white">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-300">Earth From Space</h1>

      <ToggleEarthView
        imageUrl={epicImage.url}
        caption={epicImage.caption || 'Earth View'}
        date={epicImage.date}
      />
    </div>
  );
}