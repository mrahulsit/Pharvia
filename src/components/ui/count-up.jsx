/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

/** Counts up to `value` the first time it scrolls into view. */
export function CountUp({ value, prefix = "", suffix = "", decimals = 0, duration = 1.4, format }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(reduceMotion ? value : 0);

  useEffect(() => {
    if (!inView || reduceMotion) {
      if (reduceMotion) setDisplay(value);
      return undefined;
    }
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(latest),
    });
    return () => controls.stop();
  }, [inView, reduceMotion, value, duration]);

  const text = format ? format(display) : display.toFixed(decimals);
  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {text}
      {suffix}
    </span>
  );
}

/** Animates between values whenever `value` changes (e.g. cart totals). */
export function AnimatedNumber({ value, format = (v) => v.toFixed(0) }) {
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const previous = useRef(value);

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(value);
      previous.current = value;
      return undefined;
    }
    const controls = animate(previous.current, value, {
      duration: 0.5,
      ease: "easeOut",
      onUpdate: (latest) => setDisplay(latest),
    });
    previous.current = value;
    return () => controls.stop();
  }, [value, reduceMotion]);

  return <span className="tabular-nums">{format(display)}</span>;
}
