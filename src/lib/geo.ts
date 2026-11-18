/**
 * Coordinates for the delivery globe.
 *
 * India Post's pincode API has no coordinates, so we ask OpenStreetMap Nominatim. Nominatim's public server is
 * rate limited (about 1 request/second) and asks heavy users to run their own or proxy through a backend:
 * see BACKEND_TODO.md ("Pincode + geocoding endpoint"). This is fine for occasional, user-triggered lookups.
 */

export interface LatLng {
  lat: number;
  lng: number;
}

export interface GeoResult extends LatLng {
  /** false when we fell back to the district/state or the centre of India. */
  precise: boolean;
}

/** Rough geographic centre of India, used when nothing better is found. */
export const INDIA_CENTER: LatLng = { lat: 22.35, lng: 78.67 };

const NOMINATIM = "https://nominatim.openstreetmap.org";

async function nominatim<T>(path: string, signal?: AbortSignal): Promise<T | null> {
  try {
    const response = await fetch(`${NOMINATIM}${path}`, {
      headers: { "Accept-Language": "en" },
      signal: signal ?? AbortSignal.timeout(7000),
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

type SearchHit = { lat: string; lon: string };

async function search(params: Record<string, string>): Promise<LatLng | null> {
  const query = new URLSearchParams({ format: "jsonv2", limit: "1", countrycodes: "in", ...params });
  const hits = await nominatim<SearchHit[]>(`/search?${query}`);
  const hit = hits?.[0];
  if (!hit) return null;
  const lat = Number(hit.lat);
  const lng = Number(hit.lon);
  return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null;
}

/** Best-effort coordinates for an Indian pincode. Never throws. */
export async function geocodePincode(place: {
  pincode: string;
  postOffice?: string;
  district?: string;
  state?: string;
}): Promise<GeoResult> {
  const byPin = await search({ postalcode: place.pincode });
  if (byPin) return { ...byPin, precise: true };

  if (place.postOffice && place.district) {
    const byOffice = await search({ q: `${place.postOffice}, ${place.district}, ${place.state ?? ""}, India` });
    if (byOffice) return { ...byOffice, precise: true };
  }
  if (place.district) {
    const byDistrict = await search({ q: `${place.district}, ${place.state ?? ""}, India` });
    if (byDistrict) return { ...byDistrict, precise: false };
  }
  return { ...INDIA_CENTER, precise: false };
}

/** Pincode for the visitor's current position (browser geolocation + reverse geocoding). */
export async function detectPincode(): Promise<{ pincode: string } & LatLng> {
  if (!("geolocation" in navigator)) throw new Error("Location isn't available in this browser.");

  const position = await new Promise<GeolocationPosition>((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 5 * 60 * 1000,
    })
  ).catch((error: GeolocationPositionError) => {
    throw new Error(
      error.code === error.PERMISSION_DENIED
        ? "Location permission was denied. Enter your pincode instead."
        : "We couldn't get your location. Enter your pincode instead."
    );
  });

  const { latitude: lat, longitude: lng } = position.coords;
  const reverse = await nominatim<{ address?: { postcode?: string; country_code?: string } }>(
    `/reverse?format=jsonv2&zoom=18&addressdetails=1&lat=${lat}&lon=${lng}`
  );
  const pincode = reverse?.address?.postcode?.replace(/\s/g, "");
  if (reverse?.address?.country_code && reverse.address.country_code !== "in") {
    throw new Error("We only deliver within India right now.");
  }
  if (!pincode || !/^[1-9]\d{5}$/.test(pincode)) {
    throw new Error("We couldn't find a pincode for your location. Enter it instead.");
  }
  return { pincode, lat, lng };
}
