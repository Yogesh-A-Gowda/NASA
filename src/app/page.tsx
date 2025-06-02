// src/app/page.tsx
// (Keep all your existing imports and code)
import Link from 'next/link';
import { APODData } from '../types/apod'; // Adjust path if needed
import type { Metadata } from 'next';
// No need to import Globe3DCanvas anymore, as SpaceBackground3D is in layout.tsx

export const metadata: Metadata = {
  title: 'Dashboard - NASA Data Hub',
  description: 'Your portal to explore the wonders of the universe.',
};

// (Keep your getAPODData function as it is)
async function getAPODData(): Promise<{ apod: APODData | null; error?: string }> {
  // ... (existing code for fetching APOD) ...
  const NASA_API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY;

  if (!NASA_API_KEY) {
    console.error('Environment variable NEXT_PUBLIC_NASA_API_KEY is not set.');
    return { error: 'NASA API Key is missing. Please add NEXT_PUBLIC_NASA_API_KEY to your .env.local file.', apod: null };
  }

  try {
    const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`, {
      cache: 'force-cache',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorData.msg || 'Unknown error from NASA API.'}`);
    }

    const data: APODData = await response.json();
    return { apod: data };
  } catch (error: any) {
    console.error('Failed to fetch APOD:', error);
    return { error: error.message || 'An unexpected error occurred while fetching Astronomy Picture of the Day.', apod: null };
  }
}

// This is now an async Server Component
export default async function DashboardPage() {
  const { apod, error } = await getAPODData();

  return (
    <>
      <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-center text-blue-300 relative z-20">Welcome to the NASA Data Hub!</h1>
      <p className="text-lg md:text-xl text-center mb-10 text-gray-300 relative z-20">Your portal to explore the wonders of the universe.</p>

      {error ? (
        // Adjusted error div for transparency and white border
        <div className="bg-red-700/80 p-4 rounded-lg text-white text-center max-w-3xl mx-auto shadow-lg border border-white relative z-20">
          <p className="font-semibold text-lg">Error fetching APOD:</p>
          <p className="mt-2">{error}</p>
          <p className="mt-4 text-sm">Please ensure your NASA API key is correctly set in <code className="font-mono bg-red-800 px-1 py-0.5 rounded">.env.local</code> and your internet connection is stable.</p>
        </div>
      ) : apod ? (
        // Adjusted APOD container for transparency and white border
        <div className="p-6 md:p-8 rounded-lg shadow-xl max-w-4xl mx-auto border border-white relative z-20">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-center text-blue-200">{apod.title}</h2>
          <p className="text-gray-200 text-sm mb-4 text-center">{apod.date}</p> {/* Changed to gray-200 for better contrast */}

          {apod.media_type === 'image' ? (
            <img
              src={apod.url}
              alt={apod.title}
              className="w-full h-auto object-cover rounded-lg mb-6 border border-gray-700"
            />
          ) : (
            <div className="relative mb-6" style={{ paddingBottom: '56.25%', height: 0 }}>
              <iframe
                src={apod.url}
                title={apod.title}
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full rounded-lg border border-gray-700"
              ></iframe>
            </div>
          )}

          {/* Adjusted text background for transparency */}
          <p className="text-gray-100 leading-relaxed text-base md:text-lg bg-gray-800/50 p-3 rounded">{apod.explanation}</p>
        </div>
      ) : (
        <div className="text-center text-gray-400 text-xl py-10 relative z-20">
          <p>Loading Astronomy Picture of the Day...</p>
        </div>
      )}

      {/* Quick links section - Adjusted for transparency and white border */}
      <div className="mt-16 text-center relative z-20">
        <h2 className="text-3xl font-bold mb-8 text-blue-300">Explore Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gray-800/70 p-6 rounded-lg shadow-lg hover:bg-gray-700/80 transition duration-300 border border-white">
            <h3 className="text-xl font-semibold mb-2 text-blue-200">Exoplanet Explorer</h3>
            <p className="text-gray-300">Discover worlds beyond our solar system.</p>
            <Link href="/exoplanets" className="text-blue-400 hover:text-blue-300 hover:underline mt-4 inline-block font-medium">
              Go to Exoplanets &rarr;
            </Link>
          </div>
          <div className="bg-gray-800/70 p-6 rounded-lg shadow-lg hover:bg-gray-700/80 transition duration-300 border border-white">
            <h3 className="text-xl font-semibold mb-2 text-blue-200">Mars Rover Gallery</h3>
            <p className="text-gray-300">See the Red Planet through rover eyes.</p>
            <Link href="/mars-rover" className="text-blue-400 hover:text-blue-300 hover:underline mt-4 inline-block font-medium">
              Go to Mars Rover &rarr;
            </Link>
          </div>
          <div className="bg-gray-800/70 p-6 rounded-lg shadow-lg hover:bg-gray-700/80 transition duration-300 border border-white">
            <h3 className="text-xl font-semibold mb-2 text-blue-200">Launch Tracker / ISS</h3>
            <p className="text-gray-300">Track upcoming launches and the International Space Station.</p>
            <Link href="/launch-tracker" className="text-blue-400 hover:text-blue-300 hover:underline mt-4 inline-block font-medium">
              Go to Tracker &rarr;
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}