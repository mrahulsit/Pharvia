/* eslint-disable react/prop-types */
import { cn } from "@/lib/utils";

const tones = {
  brand: "bg-brand-soft text-brand-strong",
  accent: "bg-teal-50 text-accent",
  neutral: "bg-slate-100 text-slate-700",
  white: "bg-white/90 text-brand-strong shadow-sm backdrop-blur",
};

export function Badge({ tone = "brand", className, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold [&_svg]:size-3.5",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
