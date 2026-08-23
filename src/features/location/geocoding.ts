import type { Coordinates } from "@/features/prayer-times";

/**
 * Open-Meteo's geocoding API: free, keyless, and it answers in Arabic too
 * ("الشام" -> Damascus). Used instead of a paid Maps/Places key.
 */
const SEARCH_URL = "https://geocoding-api.open-meteo.com/v1/search";

export type PlaceResult = {
  id: string;
  /** City name in the requested language. */
  name: string;
  /** "Damascus Governorate, Syria" — everything under the name. */
  detail: string;
  coordinates: Coordinates;
};

/** Only the fields we read from the response. */
type GeocodingResponse = {
  results?: {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    admin1?: string;
    country?: string;
  }[];
};

export async function searchPlaces(
  query: string,
  language: string,
  signal?: AbortSignal,
): Promise<PlaceResult[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const url = `${SEARCH_URL}?name=${encodeURIComponent(trimmed)}&count=10&language=${language}&format=json`;
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Search failed with status ${response.status}`);
  }

  const json: GeocodingResponse = await response.json();
  return (json.results ?? []).map((result) => ({
    id: String(result.id),
    name: result.name,
    detail: [result.admin1, result.country].filter(Boolean).join(", "),
    coordinates: { latitude: result.latitude, longitude: result.longitude },
  }));
}

/** The label we store for a picked search result. */
export function labelFor(result: PlaceResult): string {
  return result.detail ? `${result.name}, ${result.detail.split(", ").pop()}` : result.name;
}
