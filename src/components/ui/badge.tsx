import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const tones = {
  brand: "bg-brand-soft text-brand-strong",
  accent: "bg-teal-50 text-accent",
  neutral: "bg-slate-100 text-slate-700",
  white: "bg-white/90 text-brand-strong shadow-sm backdrop-blur",
} as const;

export type BadgeTone = keyof typeof tones;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

export function Badge({ tone = "brand", className, ...props }: BadgeProps) {
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
