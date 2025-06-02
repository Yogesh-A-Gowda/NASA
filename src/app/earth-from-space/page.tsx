// src/app/launch-tracker/page.tsx

import type { Metadata } from 'next';
import { Launch, IssData } from '@/types/launch';
import moment from 'moment';

// --- Types ---

interface LaunchApiResponse {
  results: Launch[];
}

// --- Data Fetching Functions ---

async function getUpcomingLaunches(): Promise<{ launches: Launch[] | null; error?: string }> {
  const apiUrl = 'https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=10&mode=list';

  try {
    const response = await fetch(apiUrl, { next: { revalidate: 3600 } });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Launch API Error: ${response.status} ${response.statusText} - ${errorData.detail || 'Unknown error.'}`);
    }

    const data: LaunchApiResponse = await response.json();
    return { launches: data.results };
  } catch (error: any) {
    console.error('Failed to fetch upcoming launches:', error);
    return { error: error.message || 'An unexpected error occurred while fetching launch data.', launches: null };
  }
}

async function getIssLocation(): Promise<{ issData: IssData | null; error?: string }> {
  const apiUrl = 'http://api.open-notify.org/iss-now.json';

  try {
    const response = await fetch(apiUrl, { next: { revalidate: 10 } });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ISS API Error: ${response.status} ${response.statusText} - ${errorText || 'Unknown error.'}`);
    }

    const data: IssApiResponse = await response.json();
    if (data.message !== 'success') {
      throw new Error(`ISS API reported non-success message: ${data.message}`);
    }

    const issData: IssData = {
      message: data.message,
      timestamp: data.timestamp,
      iss_position: data.iss_position,
    };

    return { issData };
  } catch (error: any) {
    console.error('Failed to fetch ISS location:', error);
    return { error: error.message || 'An unexpected error occurred while fetching ISS location.', issData: null };
  }
}

// --- Page Component ---

export default async function LaunchTrackerPage() {
  const { launches, error: launchesError } = await getUpcomingLaunches();
  const { issData, error: issError } = await getIssLocation();

  return (
    <div>
      <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-center text-blue-300">Space Trackers</h1>
      <p className="text-lg md:text-xl text-center mb-10 text-gray-300">
        Monitor upcoming rocket launches and the current position of the International Space Station.
      </p>

      {/* ISS Location Section */}
      <div className="bg-gray-800/70 p-6 md:p-8 rounded-lg shadow-xl max-w-2xl mx-auto border border-white mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center text-blue-200">International Space Station (ISS)</h2>
        {issError ? (
          <div className="bg-red-700/80 p-4 rounded-lg text-white text-center">
            <p className="font-semibold">Error fetching ISS location:</p>
            <p className="mt-2">{issError}</p>
          </div>
        ) : issData ? (
          <div className="text-center text-gray-200">
            <p className="text-xl mb-2">The ISS is currently located at:</p>
            <p className="text-lg font-mono">
              Latitude: <span className="text-green-300">{issData.iss_position.latitude}</span>, Longitude: <span className="text-green-300">{issData.iss_position.longitude}</span>
            </p>
            <p className="text-sm mt-2 text-gray-400">
              (As of: {new Date(issData.timestamp * 1000).toISOString().replace('T', ' ').substring(0, 19)} UTC)
            </p>
            <p className="text-sm mt-4">
              <a
                href={`https://www.google.com/maps/place/${issData.iss_position.latitude},${issData.iss_position.longitude}/@${issData.iss_position.latitude},${issData.iss_position.longitude},4z`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 hover:underline"
              >
                View on Google Maps →
              </a>
            </p>
          </div>
        ) : (
          <div className="text-center text-gray-400 text-lg">
            <p>Loading ISS location...</p>
          </div>
        )}
      </div>

      {/* Upcoming Launches Section */}
      <div className="bg-gray-800/70 p-6 md:p-8 rounded-lg shadow-xl max-w-4xl mx-auto border border-white">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-blue-200">Upcoming Rocket Launches</h2>
        {launchesError ? (
          <div className="bg-red-700/80 p-4 rounded-lg text-white text-center">
            <p className="font-semibold">Error fetching launches:</p>
            <p className="mt-2">{launchesError}</p>
          </div>
        ) : !launches || launches.length === 0 ? (
          <div className="text-center text-gray-400 text-lg py-10">
            <p>No upcoming launches found at this time.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {launches.map((launch) => (
              <div
                key={launch.id ?? `launch-${Math.random().toString(36).substr(2, 9)}`}
                className="bg-gray-700/60 p-4 rounded-lg flex flex-col md:flex-row items-start md:items-center shadow-md border border-gray-600"
              >
                {launch.image && (
                  <img
                    src={launch.image}
                    alt={launch.name || "Rocket Launch"}
                    className="w-full md:w-32 h-auto md:h-24 object-cover rounded-md mr-0 md:mr-4 mb-4 md:mb-0 border border-gray-500"
                  />
                )}
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-blue-100 mb-1">
                    {launch.name || "Unnamed Launch"}
                  </h3>
                  {launch.launch_service_provider?.name && (
                    <p className="text-gray-200 text-sm">
                      <span className="font-medium">Provider:</span>{" "}
                      {launch.launch_service_provider.name}
                    </p>
                  )}
                  {launch.rocket?.configuration?.full_name && (
                    <p className="text-gray-200 text-sm">
                      <span className="font-medium">Rocket:</span>{" "}
                      {launch.rocket.configuration.full_name}
                    </p>
                  )}
                  {launch.pad?.name && (
                    <p className="text-gray-200 text-sm">
                      <span className="font-medium">Launch Pad:</span>{" "}
                      {launch.pad.name}{launch.pad.location?.name ? `, ${launch.pad.location.name}` : ''}
                    </p>
                  )}
                  {launch.status?.name && (
                    <p className="text-gray-200 text-sm">
                      <span className="font-medium">Status:</span>{" "}
                      {launch.status.name}
                    </p>
                  )}
                  {launch.net && (
                    <p className="text-gray-200 text-sm">
                      <span className="font-medium">NET:</span>{" "}
                      {new Date(launch.net).toISOString().replace("T", " ").substring(0, 16)}
                    </p>
                  )}
                  {launch.mission && launch.mission.description && (
                    <p className="text-gray-300 text-sm mt-2">
                      {launch.mission.description.length > 150
                        ? launch.mission.description.substring(0, 150) + "..."
                        : launch.mission.description}
                    </p>
                  )}
                  {launch.webcast_live && (
                    <p className="text-blue-400 text-sm mt-2">
                      <a
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                          launch.name + " live launch"
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        Watch Live{" "}
                        <span className="text-red-500 font-bold">●</span>
                      </a>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}