import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import type { Circle, Map as LeafletMap, Marker } from "leaflet";
import type { LatLng } from "@/lib/geo";
import { cn } from "@/lib/utils";

interface LocationMapProps {
  target: LatLng;
  /** false = only district-level coordinates: shade an area instead of a precise pin. */
  precise?: boolean;
  label: string;
  className?: string;
}

const STREET_ZOOM = 16;
const AREA_ZOOM = 11;

/* Our own pin (no Leaflet image assets needed). Classes are plain Tailwind so they are picked up at build time. */
const pinHtml = `
  <div class="location-pin relative -translate-x-1/2 -translate-y-full">
    <span class="absolute bottom-0 left-1/2 block size-10 -translate-x-1/2 translate-y-1/2 animate-ping rounded-full bg-brand/40"></span>
    <svg viewBox="0 0 24 24" width="44" height="44" class="relative drop-shadow-lg" aria-hidden="true">
      <path fill="#0a5a25" stroke="#fff" stroke-width="1.5" d="M12 2a7.5 7.5 0 0 0-7.5 7.5c0 5.4 6.6 11.7 6.9 12a.9.9 0 0 0 1.2 0c.3-.3 6.9-6.6 6.9-12A7.5 7.5 0 0 0 12 2Z"/>
      <circle cx="12" cy="9.5" r="2.8" fill="#fff"/>
    </svg>
  </div>`;

/**
 * Street map (Leaflet + OpenStreetMap tiles) that sweeps in from country level to the target.
 * OSM's public tiles are fine for light use with attribution; for production traffic switch the tile URL to a
 * provider (MapTiler, Mapbox, Google) as described in BACKEND_TODO.md.
 */
export function LocationMap({ target, precise = true, label, className }: LocationMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const layerRef = useRef<Marker | Circle | null>(null);
  const libRef = useRef<typeof import("leaflet") | null>(null);
  const reduceMotion = useReducedMotion();
  const [ready, setReady] = useState(false);

  // Create the map once.
  useEffect(() => {
    let cancelled = false;
    Promise.all([import("leaflet"), import("leaflet/dist/leaflet.css")]).then(([leaflet]) => {
      if (cancelled || !containerRef.current) return;
      const L = leaflet.default ?? leaflet;
      libRef.current = L;
      const map = L.map(containerRef.current, {
        center: [target.lat, target.lng],
        zoom: 5,
        zoomControl: false,
        attributionControl: true,
        scrollWheelZoom: "center",
      });
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>',
      }).addTo(map);
      L.control.zoom({ position: "bottomright" }).addTo(map);
      map.attributionControl.setPrefix(false);
      mapRef.current = map;
      setReady(true);
    });
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fly to the target and pin it whenever it changes.
  useEffect(() => {
    const map = mapRef.current;
    const L = libRef.current;
    if (!ready || !map || !L) return;

    layerRef.current?.remove();
    layerRef.current = null;
    const zoom = precise ? STREET_ZOOM : AREA_ZOOM;

    const placeMarker = () => {
      layerRef.current = precise
        ? L.marker([target.lat, target.lng], {
            icon: L.divIcon({ html: pinHtml, className: "", iconSize: [0, 0] }),
            title: label,
            keyboard: false,
          }).addTo(map)
        : L.circle([target.lat, target.lng], {
            radius: 4000,
            color: "#0a5a25",
            weight: 2,
            fillColor: "#1cb04b",
            fillOpacity: 0.18,
          }).addTo(map);
    };

    if (reduceMotion) {
      map.setView([target.lat, target.lng], zoom, { animate: false });
      placeMarker();
      return undefined;
    }
    map.once("moveend", placeMarker);
    map.flyTo([target.lat, target.lng], zoom, { duration: 2.4, easeLinearity: 0.2 });
    return () => {
      map.off("moveend", placeMarker);
    };
  }, [ready, target.lat, target.lng, precise, label, reduceMotion]);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={`Map showing ${label}`}
      className={cn(
        "size-full bg-slate-100 [&_.leaflet-control-attribution]:text-[10px] [&_.leaflet-control-zoom]:border-0 [&_.leaflet-control-zoom]:shadow-card",
        className
      )}
    />
  );
}
