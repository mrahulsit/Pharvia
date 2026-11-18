/* Vengeance UI: slider (adapted: theme tokens mapped to the brand palette, `tone` for PLUS indigo). */
import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

const tones = {
  brand: { range: "bg-brand-strong", thumb: "border-brand-strong ring-brand/25" },
  plus: { range: "bg-plus", thumb: "border-plus ring-plus/25" },
} as const;

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  tone = "brand",
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root> & { tone?: keyof typeof tones }) {
  const values = React.useMemo(
    () => (Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min, max]),
    [value, defaultValue, min, max]
  );
  const theme = tones[tone];

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none select-none items-center data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="relative grow overflow-hidden rounded-full bg-white ring-1 ring-slate-200 data-[orientation=horizontal]:h-2 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2"
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn("absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full", theme.range)}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          aria-label={props["aria-label"]}
          className={cn(
            "block size-5 shrink-0 cursor-grab rounded-full border-2 bg-white shadow-md transition-[box-shadow] hover:ring-4 focus-visible:outline-none focus-visible:ring-4 active:cursor-grabbing disabled:pointer-events-none disabled:opacity-50",
            theme.thumb
          )}
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
