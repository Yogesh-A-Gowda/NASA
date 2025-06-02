import type { Metadata } from 'next';
import { Exoplanet } from '@/types/exoplanet';

export const metadata: Metadata = {
  title: 'Exoplanet Explorer - NASA Data Hub',
  description: 'Discover worlds beyond our solar system.',
};

// Function to fetch exoplanet data from NASA Exoplanet Archive
async function getExoplanetsData(): Promise<{ exoplanets: Exoplanet[] | null; error?: string }> {
  // The NASA Exoplanet Archive (NExScI) TAP service uses ADQL (Astronomical Data Query Language)
  // Example query: Select confirmed planets with basic parameters, limit to 100 for now.
  const query = encodeURIComponent(
    "select pl_name,pl_discmethod,pl_orbper,pl_massj,pl_radj,pl_dens,st_dist,st_teff from pscomppars where pl_controv_flag = 0 and pl_kepflag = 0 limit 100"
  );
  const apiUrl = `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=${query}&format=json`;

  try {
    const response = await fetch(apiUrl, { cache: 'force-cache' }); // Cache for faster loading

    if (!response.ok) {
      // Attempt to parse error message from API response if available
      let errorMsg = `API Error: ${response.status} ${response.statusText}`;
      try {
        const errorText = await response.text(); // Some APIs return plain text
        if (errorText.length > 0) {
          errorMsg += ` - ${errorText.substring(0, 100)}...`;
        }
      } catch (err)
      {
        console.log(err);
        // If response isn't JSON or parsing fails — we ignore this unused variable
        errorMsg += ` - (Could not parse error details)`;
      }
      throw new Error(errorMsg);
    }

    // ✅ Replaced `any` with proper type
    const data: Exoplanet[] = await response.json();

    // Filter out any planets without name or invalid entries
    const filteredData = data.filter((planet): planet is Exoplanet => Boolean(planet.pl_name));

    return { exoplanets: filteredData };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to fetch exoplanets:', error);
    return {
      error: errorMessage,
      exoplanets: null,
    };
  }
}

// This is now an async Server Component
export default async function ExoplanetsPage() {
  const { exoplanets, error } = await getExoplanetsData();

  return (
    <div className="min-h-screen p-4 md:p-8 relative z-20">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-center text-blue-300">Exoplanet Explorer</h1>
      <p className="text-lg md:text-xl text-center mb-10 text-gray-300">
        A growing catalog of confirmed planets orbiting distant stars.
      </p>

      {error ? (
        <div className="bg-red-700/80 p-4 rounded-lg text-white text-center max-w-3xl mx-auto shadow-lg border border-white">
          <p className="font-semibold text-lg">Error fetching Exoplanets:</p>
          <p className="mt-2">{error}</p>
          <p className="mt-4 text-sm">
            Please try again later. The exoplanet API might be temporarily unavailable or under heavy load.
          </p>
        </div>
      ) : !exoplanets || exoplanets.length === 0 ? (
        <div className="text-center text-gray-400 text-xl py-10">
          <p>No exoplanets found, or data is still loading...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exoplanets.map((planet) => (
            <div
              key={planet.pl_name ?? `planet-${Math.random().toString(36).substr(2, 9)}`}
              className="bg-gray-800/70 p-6 rounded-lg shadow-lg hover:bg-gray-700/80 transition duration-300 border border-white flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold mb-2 text-blue-200">
                  {planet.pl_name || 'Unnamed Planet'}
                </h2>
                {planet.pl_discmethod && (
                  <p className="text-gray-300 text-sm mb-1">
                    <span className="font-medium">Method:</span> {planet.pl_discmethod}
                  </p>
                )}
                {typeof planet.pl_orbper === 'number' && (
                  <p className="text-gray-300 text-sm mb-1">
                    <span className="font-medium">Orbital Period:</span> {planet.pl_orbper.toFixed(2)} Earth days
                  </p>
                )}
                {typeof planet.pl_massj === 'number' && (
                  <p className="text-gray-300 text-sm mb-1">
                    <span className="font-medium">Mass:</span> {planet.pl_massj.toFixed(2)} Jupiter masses
                  </p>
                )}
                {typeof planet.pl_radj === 'number' && (
                  <p className="text-gray-300 text-sm mb-1">
                    <span className="font-medium">Radius:</span> {planet.pl_radj.toFixed(2)} Jupiter radii
                  </p>
                )}
                {typeof planet.pl_dens === 'number' && (
                  <p className="text-gray-300 text-sm mb-1">
                    <span className="font-medium">Density:</span> {planet.pl_dens.toFixed(2)} g/cm³
                  </p>
                )}
                {typeof planet.st_dist === 'number' && (
                  <p className="text-gray-300 text-sm mb-1">
                    <span className="font-medium">Distance:</span> {planet.st_dist.toFixed(2)} parsecs
                  </p>
                )}
                {typeof planet.st_teff === 'number' && (
                  <p className="text-gray-300 text-sm mb-1">
                    <span className="font-medium">Star Temp:</span> {planet.st_teff.toFixed(0)} K
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}