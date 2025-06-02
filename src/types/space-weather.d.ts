// src/types/space-weather.d.ts

// Common interface for linked events (e.g., a CME might be linked to a flare)
export interface LinkedEvent {
  activityID: string;
}

// --- Coronal Mass Ejection (CME) ---
export interface CME {
  cmeID: string;
  startTime: string; // ISO 8601 date-time string
  catalog: string;
  instruments?: Array<{
    displayName: string;
  }>;
  sourceLocation?: string;
  activeRegionNum?: number;
  // cmeAnalyses can be very detailed, simplifying for display
  cmeAnalyses?: Array<{
    time21_5?: string; // Estimated arrival time
    kp_index?: string; // Estimated Kp index
    halfAngle?: number;
    speed?: number; // km/s
    isMostAccurate?: boolean;
    // ... many more fields possible, simplifying
  }>;
  linkedEvents?: LinkedEvent[];
  note?: string;
}

// --- Geomagnetic Storm (GST) ---
export interface GST {
  gstID: string;
  startTime: string; // ISO 8601 date-time string
  allKpIndex?: Array<{ // Kp-index readings over time
    kpIndex: number;
    // observedTime: string; // Often too granular, simplifying
  }>;
  linkedEvents?: LinkedEvent[];
  source?: string;
  link?: string;
}

// --- Solar Flare (FLR) ---
export interface FLR {
  flrID: string;
  beginTime: string; // ISO 8601 date-time string
  peakTime: string;  // ISO 8601 date-time string
  endTime: string;   // ISO 8601 date-time string
  classType: string; // X-class, M-class, C-class, etc.
  sourceLocation: string; // NOAA active region or disk location
  activeRegionNum?: number;
  instruments?: Array<{
    displayName: string;
  }>;
  linkedEvents?: LinkedEvent[];
  note?: string;
  link?: string;
}