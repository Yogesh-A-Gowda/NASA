// src/app/nasa-media/page.tsx

'use client'; // This component uses client-side hooks like useState and useEffect

import type { Metadata } from 'next'; // Metadata is a server-side export, won't work in client components directly
// To set metadata in a client component, you'd typically use a layout or a custom hook
// For now, we'll keep it as a comment since the page itself is a client component.
// export const metadata: Metadata = {
//   title: 'NASA Media Library - NASA Data Hub',
//   description: 'Search for images and videos from NASA.',
// };

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'; // For reading URL query parameters
import Image from 'next/image';
import { NasaMediaSearchResultItem } from '@/types/nasa-media';
import moment from 'moment';

// Re-declare Metadata for client-side knowledge, not for Next.js build
// In a real app, define in layout.tsx or use a metadata API if in app router
const pageMetadata = {
  title: 'NASA Media Library - NASA Data Hub',
  description: 'Search for images and videos from NASA.',
};


export default function NasaMediaPage() {
  const searchParams = useSearchParams();
  const initialSearchQuery = searchParams.get('q') || ''; // Get initial query from URL

  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [results, setResults] = useState<NasaMediaSearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false); // To prevent "no results" on initial load

  // Function to fetch data from the NASA Image and Video Library API
  const fetchNasaMedia = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true); // User has initiated a search

    const apiUrl = `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image,video`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText || 'Unknown error.'}`);
      }

      const data = await response.json();
      if (data.collection && data.collection.items) {
        setResults(data.collection.items);
      } else {
        setResults([]);
      }
    } catch (err: any) {
      console.error('Failed to fetch NASA media:', err);
      setError(err.message || 'An unexpected error occurred while fetching media.');
    } finally {
      setLoading(false);
    }
  };

  // Effect to perform search when searchQuery changes (e.g., initial load or manual search)
  useEffect(() => {
    fetchNasaMedia(searchQuery);
  }, [searchQuery]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // The useEffect will trigger the fetch when searchQuery state updates
    // If you want to push the query to the URL:
    // router.push(`/nasa-media?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 relative z-20">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-center text-purple-300">NASA Media Library</h1>
      <p className="text-lg md:text-xl text-center mb-10 text-gray-300">
        Explore images and videos from NASA's extensive collection.
      </p>

      {/* Search Input */}
      <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto mb-12">
        <div className="flex bg-gray-800/70 rounded-lg shadow-lg border border-purple-700">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchInputChange}
            placeholder="Search for Mars, Apollo, Hubble, nebula..."
            className="flex-grow p-4 bg-transparent text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-l-lg"
          />
          <button
            type="submit"
            className="p-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-r-lg transition duration-200"
          >
            Search
          </button>
        </div>
      </form>

      {/* Display Area */}
      {loading ? (
        <div className="text-center text-gray-400 text-xl py-10">
          <p>Searching media library...</p>
        </div>
      ) : error ? (
        <div className="bg-red-700/80 p-4 rounded-lg text-white text-center max-w-3xl mx-auto shadow-lg border border-white">
          <p className="font-semibold text-lg">Error fetching media:</p>
          <p className="mt-2">{error}</p>
          <p className="mt-4 text-sm">Please try again later. The NASA Image and Video Library API might be temporarily unavailable.</p>
        </div>
      ) : hasSearched && results.length === 0 ? (
        <div className="text-center text-gray-400 text-xl py-10">
          <p>No results found for "{searchQuery}". Try a different keyword!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map((item) => {
            const data = item.data[0]; // Most items have one data entry
            const thumbnail = item.links?.find(link => link.rel === 'preview')?.href; // Find the preview image

            if (!data) return null; // Skip if no data
            
            return (
              <a
                key={data.nasa_id}
                href={`https://images.nasa.gov/details/${data.nasa_id}`} // Link to official details page
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800/70 rounded-lg shadow-lg hover:bg-gray-700/80 transition duration-300 border border-purple-700 flex flex-col overflow-hidden"
              >
                {thumbnail ? (
                  <div className="relative w-full" style={{ paddingBottom: '75%' }}> {/* 4:3 aspect ratio */}
                    <Image
                      src={thumbnail}
                      alt={data.title}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-t-lg"
                    />
                  </div>
                ) : (
                  <div className="w-full bg-gray-600 flex items-center justify-center text-gray-300 text-sm h-36">
                    No Thumbnail
                  </div>
                )}
                <div className="p-4 flex-grow">
                  <h3 className="text-lg font-semibold text-purple-100 mb-2 line-clamp-2">{data.title}</h3>
                  <p className="text-gray-300 text-xs">Type: {data.media_type.toUpperCase()}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    {moment(data.date_created).format('YYYY-MM-DD')}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}