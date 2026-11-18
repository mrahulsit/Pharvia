import { useEffect, useState } from "react";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label } from "@/components/ui/input";
import { useLocationPicker } from "@/context/LocationContext";
import zipcodeIcon from "@/assets/zipcode.png";

export function PincodeSheet() {
  const { location, isLoading, error, lookupPincode, isSheetOpen, closeSheet } =
    useLocationPicker();
  const [value, setValue] = useState(location?.pincode ?? "");

  useEffect(() => {
    if (isSheetOpen) setValue(location?.pincode ?? "");
  }, [isSheetOpen, location]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const ok = await lookupPincode(value);
    if (ok) {
      closeSheet();
      toast.success("Delivery location updated");
    }
  };

  return (
    <Sheet
      open={isSheetOpen}
      onClose={closeSheet}
      title="Choose your location"
      description="We'll show delivery options for your area."
    >
      <img
        src={zipcodeIcon}
        alt=""
        width="96"
        height="96"
        className="mx-auto mb-6 size-24 opacity-80"
      />
      <form onSubmit={onSubmit} className="space-y-3" noValidate>
        <Label htmlFor="pincode">Pincode</Label>
        <div className="flex gap-2">
          <Input
            id="pincode"
            data-autofocus
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={6}
            placeholder="e.g. 110001"
            value={value}
            invalid={Boolean(error)}
            aria-describedby={error ? "pincode-error" : undefined}
            onChange={(event) => setValue(event.target.value.replace(/\D/g, ""))}
          />
          <Button type="submit" disabled={isLoading} className="min-w-28">
            {isLoading ? <LoaderCircle className="animate-spin" /> : "Apply"}
          </Button>
        </div>
        <FieldError id="pincode-error">{error}</FieldError>
      </form>

      {location && (
        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-brand/30 bg-brand-50 p-4">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-brand-strong" />
          <div className="text-sm">
            <p className="font-semibold text-slate-900">
              Delivering to {location.postOffice}
            </p>
            <p className="text-slate-600">
              {[location.district, location.state, location.pincode].filter(Boolean).join(", ")}
            </p>
          </div>
        </div>
      )}
    </Sheet>
  );
}
