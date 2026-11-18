/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import axios from "axios";
import { readStorage, writeStorage } from "@/lib/utils";

const STORAGE_KEY = "pharmacy:location";

export interface PinnedLocation {
  pincode: string;
  postOffice: string;
  district: string;
  state: string;
}

interface LocationContextValue {
  location: PinnedLocation | null;
  isLoading: boolean;
  error: string;
  lookupPincode: (input: string) => Promise<boolean>;
  isSheetOpen: boolean;
  openSheet: () => void;
  closeSheet: () => void;
}

const LocationContext = createContext<LocationContextValue | null>(null);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<PinnedLocation | null>(() =>
    readStorage<PinnedLocation | null>(STORAGE_KEY, null)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  /** Looks up an Indian pincode. Resolves to true on success. */
  const lookupPincode = useCallback(async (input: string) => {
    const pincode = String(input).trim();
    if (!/^[1-9]\d{5}$/.test(pincode)) {
      setError("Please enter a valid 6-digit pincode.");
      return false;
    }
    setIsLoading(true);
    setError("");
    try {
      const { data } = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
      const result = Array.isArray(data) ? data[0] : null;
      const office = result?.Status === "Success" ? result.PostOffice?.[0] : null;
      if (!office) {
        setError("We couldn't find that pincode. Please check it and try again.");
        return false;
      }
      const next: PinnedLocation = {
        pincode,
        postOffice: office.Name,
        district: office.District,
        state: office.State,
      };
      setLocation(next);
      writeStorage(STORAGE_KEY, next);
      return true;
    } catch {
      setError("Couldn't reach the pincode service. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const openSheet = useCallback(() => {
    setError("");
    setIsSheetOpen(true);
  }, []);
  const closeSheet = useCallback(() => setIsSheetOpen(false), []);

  const value = useMemo(
    () => ({ location, isLoading, error, lookupPincode, isSheetOpen, openSheet, closeSheet }),
    [location, isLoading, error, lookupPincode, isSheetOpen, openSheet, closeSheet]
  );

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useLocationPicker() {
  const context = useContext(LocationContext);
  if (!context) throw new Error("useLocationPicker must be used inside <LocationProvider>");
  return context;
}
