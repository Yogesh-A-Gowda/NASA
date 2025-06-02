// src/app/space-weather/page.tsx

import type { Metadata } from 'next';
import { CME, GST, FLR } from '@/types/space-weather';
import moment from 'moment'; // Make sure you have moment installed (npm install moment)

export const metadata: Metadata = {
  title: 'Space Weather - NASA Data Hub',
  description: 'Monitor solar flares, coronal mass ejections (CMEs), and geomagnetic storms from NASA.',
};

// --- Data Fetching Functions ---

const NASA_API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY;

// Helper to format dates for API calls
function getFormattedDate(date: Date): string {
  return moment(date).format('YYYY-MM-DD');
}

// Get the last 30 days for data fetching
const thirtyDaysAgo = getFormattedDate(moment().subtract(30, 'days').toDate());
const today = getFormattedDate(moment().toDate());

async function fetchDonkiData<T>(endpoint: string, eventName: string): Promise<{ data: T[] | null; error?: string }> {
  if (!NASA_API_KEY) {
    return { data: null, error: 'NASA API Key is not configured. Please set NEXT_PUBLIC_NASA_API_KEY in your .env.local file.' };
  }

  const apiUrl = `https://api.nasa.gov/DONKI/${endpoint}?startDate=${thirtyDaysAgo}&endDate=${today}&api_key=${NASA_API_KEY}`;

  try {
    const response = await fetch(apiUrl, { next: { revalidate: 3600 } }); // Revalidate every hour

    if (!response.ok) {
      const errorText = await response.text(); // Get raw text for errors
      throw new Error(`DONKI ${eventName} API Error: ${response.status} ${response.statusText} - ${errorText || 'Unknown error.'}`);
    }

    const data: T[] = await response.json();
    return { data };
  } catch (error: any) {
    console.error(`Failed to fetch ${eventName}:`, error);
    return { error: error.message || `An unexpected error occurred while fetching ${eventName}.`, data: null };
  }
}

async function getCMEs(): Promise<{ cmes: CME[] | null; error?: string }> {
  const { data, error } = await fetchDonkiData<CME>('CME', 'CMEs');
  return { cmes: data, error };
}

async function getGSTs(): Promise<{ gsts: GST[] | null; error?: string }> {
  const { data, error } = await fetchDonkiData<GST>('GST', 'Geomagnetic Storms');
  return { gsts: data, error };
}

async function getFLRs(): Promise<{ flrs: FLR[] | null; error?: string }> {
  const { data, error } = await fetchDonkiData<FLR>('FLR', 'Solar Flares');
  return { flrs: data, error };
}

// --- Page Component ---

export default async function SpaceWeatherPage() {
  const { cmes, error: cmeError } = await getCMEs();
  const { gsts, error: gstError } = await getGSTs();
  const { flrs, error: flrError } = await getFLRs();

  return (
    <div className="min-h-screen p-4 md:p-8 relative z-20">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-center text-orange-300">Space Weather Dashboard</h1>
      <p className="text-lg md:text-xl text-center mb-10 text-gray-300">
        Monitor solar flares, coronal mass ejections (CMEs), and geomagnetic storms from the last 30 days.
      </p>

      {/* Solar Flares Section */}
      <div className="bg-gray-800/70 p-6 md:p-8 rounded-lg shadow-xl max-w-4xl mx-auto border border-orange-700 mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-orange-200">Solar Flares (FLRs)</h2>
        {flrError ? (
          <div className="bg-red-700/80 p-4 rounded-lg text-white text-center">
            <p className="font-semibold">Error fetching Solar Flares:</p>
            <p className="mt-2">{flrError}</p>
            <p className="mt-2 text-sm text-gray-200">
              Check your API key and network connection. NASA's API might also have rate limits.
            </p>
          </div>
        ) : !flrs || flrs.length === 0 ? (
          <div className="text-center text-gray-400 text-lg py-10">
            <p>No significant Solar Flares reported in the last 30 days.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {flrs.map((flr) => (
              <div key={flr.flrID} className="bg-gray-700/60 p-4 rounded-lg shadow-md border border-gray-600">
                <h3 className="text-xl font-semibold text-orange-100 mb-1">Flare Class: {flr.classType}</h3>
                <p className="text-gray-200 text-sm">
                  <span className="font-medium">Source:</span> {flr.sourceLocation} {flr.activeRegionNum ? `(AR${flr.activeRegionNum})` : ''}
                </p>
                <p className="text-gray-200 text-sm">
                  <span className="font-medium">Start:</span> {moment(flr.beginTime).format('YYYY-MM-DD HH:mm [UTC]')}
                </p>
                <p className="text-gray-200 text-sm">
                  <span className="font-medium">Peak:</span> {moment(flr.peakTime).format('YYYY-MM-DD HH:mm [UTC]')}
                </p>
                <p className="text-gray-200 text-sm">
                  <span className="font-medium">End:</span> {moment(flr.endTime).format('YYYY-MM-DD HH:mm [UTC]')}
                </p>
                {flr.instruments && flr.instruments.length > 0 && (
                  <p className="text-gray-300 text-sm mt-1">
                    <span className="font-medium">Instruments:</span> {flr.instruments.map(inst => inst.displayName).join(', ')}
                  </p>
                )}
                {flr.note && (
                  <p className="text-gray-300 text-sm mt-2">
                    <span className="font-medium">Note:</span> {flr.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Coronal Mass Ejections Section */}
      <div className="bg-gray-800/70 p-6 md:p-8 rounded-lg shadow-xl max-w-4xl mx-auto border border-yellow-700 mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-yellow-200">Coronal Mass Ejections (CMEs)</h2>
        {cmeError ? (
          <div className="bg-red-700/80 p-4 rounded-lg text-white text-center">
            <p className="font-semibold">Error fetching CMEs:</p>
            <p className="mt-2">{cmeError}</p>
            <p className="mt-2 text-sm text-gray-200">
              Check your API key and network connection. NASA's API might also have rate limits.
            </p>
          </div>
        ) : !cmes || cmes.length === 0 ? (
          <div className="text-center text-gray-400 text-lg py-10">
            <p>No Coronal Mass Ejections reported in the last 30 days.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {cmes.map((cme) => (
              <div key={cme.cmeID} className="bg-gray-700/60 p-4 rounded-lg shadow-md border border-gray-600">
                <h3 className="text-xl font-semibold text-yellow-100 mb-1">CME Event (ID: {cme.cmeID})</h3>
                <p className="text-gray-200 text-sm">
                  <span className="font-medium">Start Time:</span> {moment(cme.startTime).format('YYYY-MM-DD HH:mm [UTC]')}
                </p>
                {cme.sourceLocation && (
                  <p className="text-gray-200 text-sm">
                    <span className="font-medium">Source:</span> {cme.sourceLocation} {cme.activeRegionNum ? `(AR${cme.activeRegionNum})` : ''}
                  </p>
                )}
                {cme.cmeAnalyses && cme.cmeAnalyses.length > 0 && (
                  <>
                    <p className="text-gray-300 text-sm mt-2 font-semibold">Latest Analysis:</p>
                    {cme.cmeAnalyses.filter(a => a.isMostAccurate).map((analysis, idx) => (
                      <div key={idx} className="text-gray-300 text-xs pl-2">
                        {analysis.time21_5 && <p>Estimated Arrival: {moment(analysis.time21_5).format('YYYY-MM-DD HH:mm [UTC]')}</p>}
                        {analysis.speed && <p>Speed: {analysis.speed} km/s</p>}
                        {analysis.halfAngle && <p>Half Angle: {analysis.halfAngle}°</p>}
                        {analysis.kp_index && <p>Estimated Kp Index: {analysis.kp_index}</p>}
                      </div>
                    ))}
                  </>
                )}
                 {cme.note && (
                  <p className="text-gray-300 text-sm mt-2">
                    <span className="font-medium">Note:</span> {cme.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Geomagnetic Storms Section */}
      <div className="bg-gray-800/70 p-6 md:p-8 rounded-lg shadow-xl max-w-4xl mx-auto border border-indigo-700">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-indigo-200">Geomagnetic Storms (GSTs)</h2>
        {gstError ? (
          <div className="bg-red-700/80 p-4 rounded-lg text-white text-center">
            <p className="font-semibold">Error fetching Geomagnetic Storms:</p>
            <p className="mt-2">{gstError}</p>
            <p className="mt-2 text-sm text-gray-200">
              Check your API key and network connection. NASA's API might also have rate limits.
            </p>
          </div>
        ) : !gsts || gsts.length === 0 ? (
          <div className="text-center text-gray-400 text-lg py-10">
            <p>No Geomagnetic Storms reported in the last 30 days.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {gsts.map((gst) => (
              <div key={gst.gstID} className="bg-gray-700/60 p-4 rounded-lg shadow-md border border-gray-600">
                <h3 className="text-xl font-semibold text-indigo-100 mb-1">Geomagnetic Storm (ID: {gst.gstID})</h3>
                <p className="text-gray-200 text-sm">
                  <span className="font-medium">Start Time:</span> {moment(gst.startTime).format('YYYY-MM-DD HH:mm [UTC]')}
                </p>
                {gst.allKpIndex && gst.allKpIndex.length > 0 && (
                  <>
                    <p className="text-gray-300 text-sm mt-2 font-semibold">Kp-Index Readings:</p>
                    <ul className="list-disc list-inside text-gray-300 text-xs pl-2">
                      {gst.allKpIndex.map((kp, idx) => (
                        <li key={idx}>Kp-Index: {kp.kpIndex}</li>
                      ))}
                    </ul>
                  </>
                )}
                {gst.source && (
                  <p className="text-gray-300 text-sm mt-2">
                    <span className="font-medium">Source:</span> {gst.source}
                  </p>
                )}
                 {gst.link && (
                  <p className="text-blue-400 text-sm mt-2">
                    <a href={gst.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      More Info →
                    </a>
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}