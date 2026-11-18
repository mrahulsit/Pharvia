import { useEffect } from "react";

export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | Pharmacy` : "Pharmacy — at every step";
  }, [title]);
}
