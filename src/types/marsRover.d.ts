// src/types/marsRover.d.ts

export interface MarsRoverPhoto {
  id: number;
  sol: number;
  camera: {
    id: number;
    name: string; // e.g., "FHAZ"
    rover_id: number;
    full_name: string; // e.g., "Front Hazard Avoidance Camera"
  };
  img_src: string; // The URL of the image
  earth_date: string; // e.g., "2015-05-30"
  rover: {
    id: number;
    name: string; // e.g., "Curiosity"
    landing_date: string;
    launch_date: string;
    status: string; // e.g., "active", "complete"
    max_sol: number;
    max_date: string;
    total_photos: number;
    cameras: Array<{
      name: string;
      full_name: string;
    }>;
  };
}

export interface MarsRoverApiResponse {
  photos: MarsRoverPhoto[];
}