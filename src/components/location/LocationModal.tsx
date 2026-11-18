import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, LocateFixed, MapPin, Navigation } from "lucide-react";
import { toast } from "sonner";
import { DeliveryGlobe } from "./DeliveryGlobe";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { useLocationPicker, type PinnedLocation } from "@/context/LocationContext";
import { cn } from "@/lib/utils";

/** Pin that drops onto the centre of the globe once it has settled on the location. */
function DroppedPin() {
  const reduceMotion = useReducedMotion();
  return (
    <div className="pointer-events-none absolute inset-0 grid place-items-center" aria-hidden="true">
      <div className="relative">
        {!reduceMotion && (
          <span className="absolute left-1/2 top-0 size-16 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-brand/30" />
        )}
        <span className="absolute left-1/2 top-0 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-strong ring-4 ring-white" />
        <motion.span
          initial={reduceMotion ? false : { y: -60, opacity: 0, scale: 0.6 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 420, damping: 18 }}
          className="absolute bottom-0 left-1/2 block -translate-x-1/2"
        >
          <MapPin className="size-10 fill-brand-strong text-white drop-shadow-lg" strokeWidth={1.5} />
        </motion.span>
      </div>
    </div>
  );
}

function StatusPill({ children, busy = false }: { children: React.ReactNode; busy?: boolean }) {
  return (
    <motion.p
      key={String(children)}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto flex w-fit max-w-full items-center gap-2 rounded-full bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-card ring-1 ring-slate-200/70 backdrop-blur"
      role="status"
      aria-live="polite"
    >
      {busy ? <Spinner className="size-3.5 text-brand-strong" aria-hidden="true" /> : <MapPin className="size-3.5 text-brand-strong" aria-hidden="true" />}
      <span className="truncate">{children}</span>
    </motion.p>
  );
}

export function LocationModal() {
  const { location, isLoading, error, setError, findPincode, findCurrentLocation, saveLocation, isPickerOpen, closePicker } =
    useLocationPicker();
  const [value, setValue] = useState("");
  const [preview, setPreview] = useState<PinnedLocation | null>(null);
  const [arrived, setArrived] = useState(false);
  const [locating, setLocating] = useState<"pincode" | "gps" | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastLookup = useRef("");

  // Start from the saved location each time the modal opens.
  useEffect(() => {
    if (!isPickerOpen) return;
    setValue(location?.pincode ?? "");
    setPreview(location?.lat !== undefined ? location : null);
    setArrived(false);
    lastLookup.current = location?.pincode ?? "";
  }, [isPickerOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const lookup = async (pincode: string) => {
    lastLookup.current = pincode;
    setLocating("pincode");
    setArrived(false);
    const found = await findPincode(pincode);
    setLocating(null);
    if (found) setPreview(found);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void lookup(value);
  };

  const onChange = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 6);
    setValue(digits);
    if (error) setError("");
    // Look up automatically once all six digits are in.
    if (digits.length === 6 && digits !== lastLookup.current) void lookup(digits);
  };

  const useMyLocation = async () => {
    setLocating("gps");
    setArrived(false);
    const found = await findCurrentLocation();
    setLocating(null);
    if (found) {
      setPreview(found);
      setValue(found.pincode);
      lastLookup.current = found.pincode;
    }
  };

  const confirm = () => {
    if (!preview) return;
    saveLocation(preview);
    toast.success(`Delivering to ${preview.postOffice}, ${preview.pincode}`);
    closePicker();
  };

  const target = preview?.lat !== undefined && preview.lng !== undefined ? { lat: preview.lat, lng: preview.lng } : null;
  const isSaved = Boolean(preview && location && preview.pincode === location.pincode);

  let status: React.ReactNode = "Drag to spin, or enter your pincode";
  if (locating === "gps") status = "Finding where you are…";
  else if (locating === "pincode") status = `Locating ${lastLookup.current}…`;
  else if (preview && !arrived) status = `Flying to ${preview.postOffice}…`;
  else if (preview)
    status =
      preview.postOffice.toLowerCase() === preview.district.toLowerCase()
        ? `${preview.postOffice}, ${preview.state}`
        : `${preview.postOffice}, ${preview.district}`;

  return (
    <Dialog open={isPickerOpen} onOpenChange={(open) => !open && closePicker()}>
      <DialogContent
        className="overflow-hidden p-0 sm:max-w-3xl"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          inputRef.current?.focus();
        }}
      >
        <div className="grid md:grid-cols-[1fr_1.1fr]">
          {/* Globe */}
          <div className="relative flex flex-col justify-between gap-4 overflow-hidden bg-linear-to-br from-brand-50 via-white to-teal-50 px-6 pb-5 pt-6 md:pb-6">
            <div aria-hidden="true" className="absolute -bottom-20 -left-16 size-64 rounded-full bg-brand/10 blur-3xl" />
            <div className="relative mx-auto w-full max-w-[13rem] sm:max-w-[16rem] md:max-w-[19rem]">
              <div className="overflow-hidden rounded-full">
                <DeliveryGlobe target={target} onArrive={() => setArrived(true)} />
              </div>
              {preview && arrived && <DroppedPin />}
            </div>
            <div className="relative">
              <StatusPill busy={Boolean(locating) || Boolean(preview && !arrived)}>{status}</StatusPill>
            </div>
          </div>

          {/* Form */}
          <div className="flex flex-col p-6 sm:p-8">
            <DialogTitle className="pr-10">Where should we deliver?</DialogTitle>
            <DialogDescription className="mt-1.5">
              Enter your pincode and we&apos;ll pin your delivery area.
            </DialogDescription>

            <form onSubmit={onSubmit} noValidate className="mt-6">
              <label htmlFor="pincode" className="text-sm font-semibold text-slate-800">
                Pincode
              </label>
              <div className="mt-1.5 flex gap-2">
                <div className="relative flex-1">
                  <MapPin className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                  <input
                    ref={inputRef}
                    id="pincode"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    maxLength={6}
                    placeholder="110001"
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    aria-invalid={Boolean(error) || undefined}
                    aria-describedby={error ? "pincode-error" : "pincode-hint"}
                    className={cn(
                      "h-12 w-full rounded-xl border bg-canvas pl-11 pr-3 font-display text-lg font-bold tracking-[0.25em] text-slate-900 transition placeholder:font-sans placeholder:text-base placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-4",
                      error
                        ? "border-red-400 focus:border-red-500 focus:ring-red-500/15"
                        : "border-slate-200 focus:border-brand-strong focus:ring-brand/15"
                    )}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="h-12 min-w-24 shrink-0 rounded-xl bg-brand-strong px-4 text-sm font-bold text-white transition hover:bg-brand-strong/90 disabled:opacity-60"
                >
                  {locating === "pincode" ? <Spinner className="mx-auto" aria-label="Checking pincode" /> : "Check"}
                </button>
              </div>
              {error ? (
                <p id="pincode-error" role="alert" className="mt-2 text-sm text-red-600">
                  {error}
                </p>
              ) : (
                <p id="pincode-hint" className="mt-2 text-xs text-slate-500">
                  6-digit Indian pincode. We&apos;ll check it as soon as you finish typing.
                </p>
              )}
            </form>

            <div className="my-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <span className="h-px flex-1 bg-slate-200" /> or <span className="h-px flex-1 bg-slate-200" />
            </div>

            <button
              type="button"
              onClick={useMyLocation}
              disabled={isLoading}
              className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800 transition hover:border-brand/40 hover:text-brand-strong disabled:opacity-60"
            >
              {locating === "gps" ? <Spinner aria-hidden="true" /> : <LocateFixed className="size-4" aria-hidden="true" />}
              Use my current location
            </button>

            <AnimatePresence mode="wait">
              {preview && (
                <motion.div
                  key={preview.pincode}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="mt-5 flex items-start gap-3 rounded-2xl border border-brand/25 bg-brand-50 p-4"
                >
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-brand-strong" aria-hidden="true" />
                  <div className="min-w-0 text-sm">
                    <p className="font-bold text-slate-900">Delivering to {preview.postOffice}</p>
                    <p className="text-slate-600">
                      {[preview.district, preview.state, preview.pincode].filter(Boolean).join(", ")}
                    </p>
                    {preview.precise === false && (
                      <p className="mt-1 text-xs text-slate-500">Pin shows the approximate area.</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-auto pt-6">
              <button
                type="button"
                onClick={confirm}
                disabled={!preview || isLoading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-strong text-sm font-bold text-white shadow-sm transition hover:bg-brand-strong/90 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none"
              >
                <Navigation className="size-4" aria-hidden="true" />
                {isSaved ? "Keep this location" : "Deliver here"}
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
