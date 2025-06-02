// src/app/mars-rover/page.tsx
import type { Metadata } from 'next';
import Image from 'next/image'; // For optimized image loading
import { MarsRoverPhoto, MarsRoverApiResponse } from '@/types/marsRover'; // Use @/ for src/ alias

export const metadata: Metadata = {
  title: 'Mars Rover Gallery - NASA Data Hub',
  description: 'Browse images from the Red Planet taken by NASA rovers.',
};

// Function to fetch Mars Rover photos
async function getMarsRoverPhotos(
  roverName: string = 'curiosity', // Default to Curiosity
  sol: number = 1000 // Default to sol 1000
): Promise<{ photos: MarsRoverPhoto[] | null; error?: string }> {
  const NASA_API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY;

  if (!NASA_API_KEY) {
    console.error('Environment variable NEXT_PUBLIC_NASA_API_KEY is not set.');
    return {
      error: 'NASA API Key is missing. Please add NEXT_PUBLIC_NASA_API_KEY to your .env.local file.',
      photos: null,
    };
  }

  const apiUrl = `https://api.nasa.gov/mars-photos/api/v1/rovers/${roverName}/photos?sol=${sol}&api_key=${NASA_API_KEY}`;

  try {
    const response = await fetch(apiUrl, {
      cache: 'force-cache', // Cache the response for revalidation (ISR-like)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `API Error: ${response.status} ${response.statusText} - ${
          errorData.msg || JSON.stringify(errorData.errors) || 'Unknown error.'
        }`
      );
    }

    const data: MarsRoverApiResponse = await response.json();

    if (!data.photos || data.photos.length === 0) {
      return {
        photos: [],
        error: `No photos found for ${roverName} on sol ${sol}. Try a different sol or rover.`,
      };
    }

    return { photos: data.photos };
  } catch (error) {
    let errorMessage = 'An unexpected error occurred while fetching Mars Rover photos.';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    console.error('Failed to fetch Mars Rover photos:', error);
    return { error: errorMessage, photos: null };
  }
}

export default async function MarsRoverGalleryPage() {
  const { photos, error } = await getMarsRoverPhotos('curiosity', 1000); // Fetch Curiosity photos from Sol 1000

  return (
    <>
      <h1 className="text-4xl font-bold mb-6 text-blue-300">Mars Rover Gallery</h1>
      <p className="text-lg text-gray-300 mb-8">
        Browse images from the Red Planet captured by NASAs rovers.
      </p>

      {error ? (
        <div className="bg-red-700 p-4 rounded-lg text-white text-center max-w-3xl mx-auto shadow-lg">
          <p className="font-semibold text-lg">Error loading Mars Rover photos:</p>
          <p className="mt-2">{error}</p>
        </div>
      ) : photos && photos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="rounded-lg shadow-lg overflow-hidden border border-gray-700 hover:scale-105 transition-transform duration-300"
            >
              <div className="relative w-full h-48 sm:h-56">
                <Image
                  src={photo.img_src}
                  alt={`Mars photo from ${photo.rover.name} by ${photo.camera.full_name}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-t-lg"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-blue-200 truncate">
                  {photo.camera.full_name}
                </h3>
                <p className="text-gray-400 text-sm">Rover: {photo.rover.name}</p>
                <p className="text-gray-400 text-sm">
                  Sol: {photo.sol} (Earth Date: {photo.earth_date})
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 text-xl py-10">
          <p>No Mars Rover photos found for the selected criteria. Please check the rover and sol/date.</p>
        </div>
      )}
    </>
  );
}