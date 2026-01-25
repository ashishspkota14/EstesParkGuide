// Map related types

export interface MapMarker {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  type: 'trail' | 'location' | 'parking' | 'viewpoint';
}

export interface TrailMapData {
  id: string;
  name: string;
  slug: string;
  difficulty: 'easy' | 'moderate' | 'hard';
  distance_miles: number;
  elevation_gain_ft: number;
  trailhead_lat: number;
  trailhead_lon: number;
  image_main: string;
  short_description: string;
}

export type MapStyleType = 'outdoors' | 'satellite' | 'streets';

export interface MapRegion {
  latitude: number;
  longitude: number;
  zoom: number;
}

// Estes Park default region
export const ESTES_PARK_CENTER: MapRegion = {
  latitude: 40.3772,
  longitude: -105.5217,
  zoom: 11,
};