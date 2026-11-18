import { Link } from "react-router-dom";
import lockup from "@/assets/brand/pharvia-lockup.webp";
import mark from "@/assets/brand/pharvia-mark.webp";
import { cn } from "@/lib/utils";
import { brand } from "@/data/site";

interface LogoProps {
  className?: string;
  /** Dark backgrounds: the lockup's wordmark is dark green, so fall back to the mark + white text. */
  light?: boolean;
}

export function Logo({ className, light = false }: LogoProps) {
  if (!light) {
    return (
      <Link to="/" className={cn("flex shrink-0 items-center", className)} aria-label={`${brand.name} home`}>
        <img
          src={lockup}
          alt={`${brand.name} — ${brand.tagline}`}
          width="1000"
          height="315"
          className="h-10 w-auto sm:h-11 lg:h-13"
        />
      </Link>
    );
  }

  return (
    <Link to="/" className={cn("flex items-center gap-2.5", className)} aria-label={`${brand.name} home`}>
      <img src={mark} alt="" width="40" height="40" className="size-10 shrink-0 object-contain" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-xl font-extrabold tracking-tight text-white">{brand.name}</span>
        <span className="text-xs font-medium text-white/70">{brand.tagline}</span>
      </span>
    </Link>
  );
}
