import { useEffect } from "react";
import { brand } from "@/data/site";

export const homeTitle = `${brand.name} — ${brand.tagline}`;

export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${brand.name}` : homeTitle;
  }, [title]);
}
