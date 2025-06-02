export interface Launch {
  id: string;
  name?: string;
  image?: string;
  net?: string;
  webcast_live?: boolean;
  status?: {
    name?: string;
  };
  mission?: {
    description?: string;
  };
  launch_service_provider?: {
    name?: string;
  };
  rocket?: {
    configuration?: {
      full_name?: string;
    };
  };
  pad?: {
    name?: string;
    location?: {
      name?: string;
    };
  };
}

export interface LaunchApiResponse {
  results: Launch[];
}

export interface IssPosition {
  latitude: string;
  longitude: string;
}

export interface IssData {
  message: string;
  timestamp: number;
  iss_position: IssPosition;
}