import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

export function formatPrice(value: number) {
  return inr.format(value);
}

/** Read JSON from localStorage without throwing on bad or missing data. */
export function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage(key: string, value: unknown) {
  try {
    if (value === null || value === undefined) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or blocked: ignore */
  }
}

interface AxiosLikeError {
  response?: { data?: { message?: unknown } };
  isAxiosError?: boolean;
  message?: string;
}

/** Pull a readable message out of an axios error. */
export function getErrorMessage(error: unknown, fallback: string) {
  const err = error as AxiosLikeError | null | undefined;
  const message = err?.response?.data?.message;
  if (typeof message === "string" && message.trim()) return message;
  if (err?.response) return fallback;
  if (err?.isAxiosError) {
    return "Can't reach the server right now. Please check your connection and try again.";
  }
  return err?.message || fallback;
}
