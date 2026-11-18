import { useEffect } from "react";

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | Pharmacy` : "Pharmacy — at every step";
  }, [title]);
}
