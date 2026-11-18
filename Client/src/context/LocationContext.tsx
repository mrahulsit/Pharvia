/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import axios from "axios";
import { readStorage, writeStorage } from "@/lib/utils";
import { detectPincode, geocodePincode } from "@/lib/geo";

const STORAGE_KEY = "pharmacy:location";

export interface PinnedLocation {
  pincode: string;
  postOffice: string;
  district: string;
  state: string;
  /** Coordinates for the globe. Missing on locations saved by older versions of the site. */
  lat?: number;
  lng?: number;
  /** false when the coordinates are only district-level (or the centre of India). */
  precise?: boolean;
}

interface LocationContextValue {
  /** The confirmed delivery location. */
  location: PinnedLocation | null;
  isLoading: boolean;
  error: string;
  setError: (message: string) => void;
  /** Looks up a pincode and its coordinates without saving it. */
  findPincode: (input: string) => Promise<PinnedLocation | null>;
  /** Uses the browser's location to find the visitor's pincode (not saved). */
  findCurrentLocation: () => Promise<PinnedLocation | null>;
  /** Saves a looked-up location as the delivery location. */
  saveLocation: (next: PinnedLocation) => void;
  isPickerOpen: boolean;
  openPicker: () => void;
  closePicker: () => void;
}

const LocationContext = createContext<LocationContextValue | null>(null);

interface PostOffice {
  Name: string;
  District: string;
  State: string;
}

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<PinnedLocation | null>(() =>
    readStorage<PinnedLocation | null>(STORAGE_KEY, null)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const resolvePincode = useCallback(async (pincode: string): Promise<PinnedLocation | null> => {
    try {
      const { data } = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`, { timeout: 10000 });
      const result = Array.isArray(data) ? data[0] : null;
      const office: PostOffice | undefined = result?.Status === "Success" ? result.PostOffice?.[0] : undefined;
      if (!office) {
        setError("We couldn't find that pincode. Please check it and try again.");
        return null;
      }
      const place = {
        pincode,
        postOffice: office.Name.trim(),
        district: office.District.trim(),
        state: office.State.trim(),
      };
      const geo = await geocodePincode(place);
      return { ...place, lat: geo.lat, lng: geo.lng, precise: geo.precise };
    } catch {
      setError("Couldn't reach the pincode service. Please try again.");
      return null;
    }
  }, []);

  const findPincode = useCallback(
    async (input: string) => {
      const pincode = String(input).trim();
      if (!/^[1-9]\d{5}$/.test(pincode)) {
        setError("Please enter a valid 6-digit pincode.");
        return null;
      }
      setIsLoading(true);
      setError("");
      try {
        return await resolvePincode(pincode);
      } finally {
        setIsLoading(false);
      }
    },
    [resolvePincode]
  );

  const findCurrentLocation = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const here = await detectPincode();
      const found = await resolvePincode(here.pincode);
      // Prefer the exact GPS position over the pincode's centroid.
      return found ? { ...found, lat: here.lat, lng: here.lng, precise: true } : null;
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't get your location.");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [resolvePincode]);

  const saveLocation = useCallback((next: PinnedLocation) => {
    setLocation(next);
    writeStorage(STORAGE_KEY, next);
  }, []);

  const openPicker = useCallback(() => {
    setError("");
    setIsPickerOpen(true);
  }, []);
  const closePicker = useCallback(() => setIsPickerOpen(false), []);

  const value = useMemo(
    () => ({
      location,
      isLoading,
      error,
      setError,
      findPincode,
      findCurrentLocation,
      saveLocation,
      isPickerOpen,
      openPicker,
      closePicker,
    }),
    [location, isLoading, error, findPincode, findCurrentLocation, saveLocation, isPickerOpen, openPicker, closePicker]
  );

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useLocationPicker() {
  const context = useContext(LocationContext);
  if (!context) throw new Error("useLocationPicker must be used inside <LocationProvider>");
  return context;
}
