/* Vengeance UI: copy-button (adapted: light brand styling, optional label, toast + clipboard error handling). */
import * as React from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  code: string;
  className?: string;
  /** Visible text next to the icon. Icon-only when omitted. */
  label?: string;
}

export function CopyButton({ code, className, label }: CopyButtonProps) {
  const [hasCopied, setHasCopied] = React.useState(false);

  React.useEffect(() => {
    if (!hasCopied) return undefined;
    const timeout = setTimeout(() => setHasCopied(false), 2000);
    return () => clearTimeout(timeout);
  }, [hasCopied]);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setHasCopied(true);
      toast.success(`Code ${code} copied`);
    } catch {
      toast.error("Couldn't copy. Please select the code and copy it manually.");
    }
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={hasCopied ? `${code} copied` : `Copy code ${code}`}
      className={cn(
        "relative inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border px-3 text-sm font-semibold transition-colors",
        hasCopied
          ? "border-brand/40 bg-brand-soft text-brand-strong"
          : "border-slate-200 bg-white text-slate-700 hover:border-brand/40 hover:text-brand-strong",
        !label && "w-9 px-0",
        className
      )}
    >
      {hasCopied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
      {label && <span>{hasCopied ? "Copied" : label}</span>}
    </button>
  );
}
