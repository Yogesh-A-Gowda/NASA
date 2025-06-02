// src/types/nasa-media.d.ts

// Interface for a single piece of media data (image or video)
export interface NasaMediaItemData {
  center: string;
  title: string;
  nasa_id: string;
  date_created: string; // ISO 8601 date string
  description: string;
  keywords?: string[];
  media_type: 'image' | 'video' | 'audio';
  // ... other fields that might be present like description_508, secondary_creator
}

// Interface for the links associated with a media item (e.g., thumbnail, video, audio)
export interface NasaMediaItemLink {
  href: string; // URL to the media asset
  rel: string; // e.g., "preview", "caption", "orig"
  render?: 'image' | 'video' | 'audio'; // Specifies the type of asset
  prompt?: string; // e.g., "NASA_LOGO"
}

// Interface for a single search result item
export interface NasaMediaSearchResultItem {
  data: NasaMediaItemData[]; // Array because an item can have multiple data entries (usually one)
  links: NasaMediaItemLink[]; // Array of links to different renditions/assets
  href: string; // URL to the asset collection for this item (e.g., "https://images-api.nasa.gov/asset/...")
}

// Interface for the collection object in the API response
export interface NasaMediaCollection {
  version: string;
  href: string; // URL to the current collection
  items: NasaMediaSearchResultItem[]; // Array of search result items
  metadata?: {
    total_hits: number;
  };
  links?: Array<{ // Pagination links
    prompt: string; // "next", "prev"
    rel: string; // "next", "prev"
    href: string; // URL for the next/prev page
  }>;
}

// Overall API response structure
export interface NasaMediaApiResponse {
  collection: NasaMediaCollection;
}