import { ChevronDown, MapPin } from "lucide-react";
import { useLocationPicker } from "@/context/LocationContext";
import { cn } from "@/lib/utils";

interface DeliveryChipProps {
  className?: string;
  /** Single-line variant for the mobile strip under the header. */
  compact?: boolean;
}

export function DeliveryChip({ className, compact = false }: DeliveryChipProps) {
  const { location, openSheet } = useLocationPicker();
  const place = location ? `${location.postOffice}, ${location.pincode}` : "Select pincode";

  if (compact) {
    return (
      <button
        type="button"
        onClick={openSheet}
        className={cn("flex min-w-0 items-center gap-1.5 text-left text-sm", className)}
      >
        <MapPin className="size-4 shrink-0 text-brand-strong" aria-hidden="true" />
        <span className="shrink-0 text-slate-500">Deliver to</span>
        <span className="truncate font-semibold text-slate-900">{place}</span>
        <ChevronDown className="size-4 shrink-0 text-slate-400" aria-hidden="true" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={openSheet}
      className={cn(
        "group flex min-w-0 items-center gap-2 rounded-xl px-2 py-1.5 text-left transition hover:bg-slate-100",
        className
      )}
    >
      <MapPin className="size-5 shrink-0 text-brand-strong" aria-hidden="true" />
      <span className="flex min-w-0 flex-col leading-tight">
        <span className="text-xs text-slate-500">Deliver to</span>
        <span className="flex items-center gap-0.5 text-sm font-bold text-slate-900">
          <span className="truncate">{place}</span>
          <ChevronDown className="size-4 shrink-0 text-slate-400 transition group-hover:text-slate-700" aria-hidden="true" />
        </span>
      </span>
    </button>
  );
}
