/* eslint-disable react/prop-types */
import { motion, useReducedMotion } from "framer-motion";

/** Fades content up when it scrolls into view. Static when reduced motion is on. */
export function Reveal({ children, delay = 0, className, as = "div" }) {
  const reduceMotion = useReducedMotion();
  const Component = motion[as];
  if (reduceMotion) {
    const Static = as;
    return <Static className={className}>{children}</Static>;
  }
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </Component>
  );
}

export function SectionHeading({ eyebrow, title, description, action, className }) {
  return (
    <div className={`mb-8 flex flex-wrap items-end justify-between gap-4 ${className ?? ""}`}>
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-accent">
            {eyebrow}
          </p>
        )}
        <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
        {description && <p className="mt-2 text-slate-600">{description}</p>}
      </div>
      {action}
    </div>
  );
}
