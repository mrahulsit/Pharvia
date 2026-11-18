/* eslint-disable react/prop-types */
import { ChevronDown, MapPin } from "lucide-react";
import { useLocationPicker } from "@/context/LocationContext";
import { cn } from "@/lib/utils";

export function DeliveryChip({ className }) {
  const { location, openSheet } = useLocationPicker();
  return (
    <button
      type="button"
      onClick={openSheet}
      className={cn(
        "group flex min-w-0 items-center gap-2.5 rounded-xl px-2 py-1.5 text-left transition hover:bg-slate-100",
        className
      )}
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-soft text-brand-strong">
        <MapPin className="size-4" />
      </span>
      <span className="flex min-w-0 flex-col leading-tight">
        <span className="text-xs text-slate-500">Fast delivery to</span>
        <span className="flex items-center gap-1 text-sm font-semibold text-slate-900">
          <span className="truncate">
            {location ? `${location.postOffice} ${location.pincode}` : "Select pincode"}
          </span>
          <ChevronDown className="size-4 shrink-0 text-slate-400 transition group-hover:text-slate-700" />
        </span>
      </span>
    </button>
  );
}
