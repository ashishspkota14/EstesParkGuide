// Trail type definition
export interface Trail {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  long_description: string;
  difficulty: 'easy' | 'moderate' | 'hard';
  distance_miles: number;
  elevation_gain_ft: number;
  estimated_time_hours: number;
  route_type: string;
  trailhead_name: string;
  trailhead_lat: number;
  trailhead_lon: number;
  park_area: string;
  best_months: string[];
  season: string;
  tags: string[];
  dog_friendly: boolean;
  kid_friendly: boolean;
  accessible: boolean;
  permits_required: boolean;
  image_main: string;
  image_2: string;
  image_3: string;
  static_map_url?: string;
  parking_info: string;
  warnings: string;
  amenities: string[];
  popularity_rank: number;
  avg_rating: number;
  total_reviews: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// Simplified Trail type for cards/lists (optional fields)
export interface TrailSummary {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  difficulty: 'easy' | 'moderate' | 'hard';
  distance_miles: number;
  elevation_gain_ft: number;
  estimated_time_hours: number;
  image_main: string;
  avg_rating: number;
  total_reviews: number;
  kid_friendly: boolean;
  dog_friendly: boolean;
}