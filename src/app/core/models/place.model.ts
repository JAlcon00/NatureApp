export interface Place {
  id: number;
  name: string;
  description?: string;
  category: string;
  latitude: number;
  longitude: number;
  elevationMeters: number;
  accessible: boolean;
  entryFee: number;
  openingHours: string;
  createdAt?: string;
}

export interface PlaceDetail extends Place {
  trails: Trail[];
  photos: Photo[];
  reviews: Review[];
  amenities: Amenity[];
}

export interface Trail {
  id: number;
  placeId: number;
  name: string;
  distanceKm: number;
  estimatedTimeMinutes: number;
  difficulty: string;
  isLoop: boolean;
  path?: string;
}

export interface Photo {
  id: number;
  placeId: number;
  url: string;
  description: string;
}

export interface Amenity {
  id: number;
  name: string;
}

export interface Review {
  id: number;
  placeId: number;
  author: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface AISummary {
  summary: string;
  generatedAt: string;
  model: string;
}