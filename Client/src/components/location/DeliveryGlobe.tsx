import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import type { LatLng } from "@/lib/geo";
import { cn } from "@/lib/utils";

interface DeliveryGlobeProps {
  /** Location to fly to and pin. null = idle spin. */
  target: LatLng | null;
  /** Called once the globe has settled on the target. */
  onArrive?: () => void;
  className?: string;
}

const TAU = Math.PI * 2;
const IDLE_THETA = 0.3;
const IDLE_SCALE = 1;
const ZOOM_SCALE = 1.3;
const FLY_MS = 1600;

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/** cobe angles that bring [lat, lng] to the front-centre of the globe. */
function anglesFor({ lat, lng }: LatLng): [phi: number, theta: number] {
  return [Math.PI - ((lng * Math.PI) / 180 - Math.PI / 2), (lat * Math.PI) / 180];
}

/** Shortest signed distance between two angles. */
function angleDelta(from: number, to: number) {
  return ((((to - from) % TAU) + TAU + Math.PI) % TAU) - Math.PI;
}

/**
 * WebGL globe (cobe) that spins while idle and flies to a target location.
 * The target always ends up at the centre of the canvas, so callers can overlay a pin there.
 */
export function DeliveryGlobe({ target, onArrive, className }: DeliveryGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();
  const [ready, setReady] = useState(false);

  // Mutable animation state shared with the render loop.
  const anim = useRef({
    phi: anglesFor({ lat: 20, lng: 78 })[0] - 0.6,
    theta: IDLE_THETA,
    scale: IDLE_SCALE,
    target: null as LatLng | null,
    arrived: false,
    /** Fly-to start: angles/scale at the moment the target was set, and the time. */
    from: { phi: 0, theta: IDLE_THETA, scale: IDLE_SCALE, at: 0 },
    dragging: false,
    lastX: 0,
    onArrive,
  });
  anim.current.onArrive = onArrive;

  // New target: restart the fly-to.
  useEffect(() => {
    const a = anim.current;
    a.target = target;
    a.arrived = false;
    a.from = { phi: a.phi, theta: a.theta, scale: a.scale, at: performance.now() };
  }, [target?.lat, target?.lng]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    let globe: { update: (state: Record<string, unknown>) => void; destroy: () => void } | null = null;
    let frame = 0;
    let cancelled = false;
    let markerKey = "";

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = () => canvas.offsetWidth || 320;

    import("cobe").then(({ default: createGlobe }) => {
      if (cancelled) return;
      const width = size();
      globe = createGlobe(canvas, {
        devicePixelRatio: dpr,
        width: width * dpr,
        height: width * dpr,
        phi: anim.current.phi,
        theta: anim.current.theta,
        dark: 0,
        diffuse: 1.25,
        mapSamples: 16000,
        mapBrightness: 5,
        mapBaseBrightness: 0.05,
        baseColor: [0.95, 0.99, 0.96],
        markerColor: [0.04, 0.55, 0.22],
        glowColor: [0.82, 0.95, 0.87],
        markers: [],
        scale: IDLE_SCALE,
        opacity: 0.95,
      }) as unknown as typeof globe;
      setReady(true);

      const tick = () => {
        const a = anim.current;
        if (a.target) {
          // Time-based flight so it lands on schedule whatever the frame rate.
          const [tPhi, tTheta] = anglesFor(a.target);
          const t = reduceMotion ? 1 : Math.min(1, (performance.now() - a.from.at) / FLY_MS);
          const e = easeInOutCubic(t);
          a.phi = a.from.phi + angleDelta(a.from.phi, tPhi) * e;
          a.theta = a.from.theta + (tTheta - a.from.theta) * e;
          a.scale = a.from.scale + (ZOOM_SCALE - a.from.scale) * e;
          if (t >= 1 && !a.arrived) {
            a.arrived = true;
            a.onArrive?.();
          }
        } else {
          if (!reduceMotion && !a.dragging) a.phi += 0.0035;
          a.theta += (IDLE_THETA - a.theta) * 0.05;
          a.scale += (IDLE_SCALE - a.scale) * 0.05;
        }

        const nextKey = a.target ? `${a.target.lat},${a.target.lng}` : "";
        const width = size();
        globe?.update({
          phi: a.phi,
          theta: a.theta,
          scale: a.scale,
          width: width * dpr,
          height: width * dpr,
          ...(nextKey !== markerKey
            ? {
                markers: a.target ? [{ location: [a.target.lat, a.target.lng], size: 0.07 }] : [],
              }
            : {}),
        });
        markerKey = nextKey;
        frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      globe?.destroy();
    };
  }, [reduceMotion]);

  // Drag to spin while idle.
  const onPointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (anim.current.target) return;
    anim.current.dragging = true;
    anim.current.lastX = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const a = anim.current;
    if (!a.dragging) return;
    a.phi += (event.clientX - a.lastX) * 0.008;
    a.lastX = event.clientX;
  };
  const stopDrag = () => {
    anim.current.dragging = false;
  };

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stopDrag}
      onPointerCancel={stopDrag}
      className={cn(
        "aspect-square w-full touch-none transition-opacity duration-700",
        target ? "cursor-default" : "cursor-grab active:cursor-grabbing",
        ready ? "opacity-100" : "opacity-0",
        className
      )}
    />
  );
}
