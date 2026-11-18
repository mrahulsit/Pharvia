import { Link } from "react-router-dom";
import logo from "@/assets/PHARMACY.png";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  light?: boolean;
}

export function Logo({ className, light = false }: LogoProps) {
  return (
    <Link to="/" className={cn("flex items-center gap-2.5", className)} aria-label="Pharmacy home">
      <img src={logo} alt="" width="40" height="40" className="size-10 shrink-0" />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-xl font-extrabold tracking-tight",
            light ? "text-white" : "text-brand-strong"
          )}
        >
          Pharmacy
        </span>
        <span className={cn("text-xs font-medium", light ? "text-white/70" : "text-slate-500")}>
          at every step
        </span>
      </span>
    </Link>
  );
}
