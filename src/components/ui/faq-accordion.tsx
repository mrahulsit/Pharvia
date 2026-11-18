import { useId, useMemo, useRef, useState, type HTMLAttributes, type KeyboardEvent } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FaqItem {
  question: string;
  answer: string;
  /** Optional topic; when any item has one, filter chips appear above the list. */
  topic?: string;
}

export interface FaqAccordionProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  items?: FaqItem[];
  /** Kept for backwards compatibility; headings live in the surrounding section. */
  title?: string;
  /** Index of the item open on first render. Pass null to start collapsed. */
  defaultOpen?: number | null;
  /** Colour theme: brand green (default) or PLUS indigo. */
  tone?: "brand" | "plus";
}

const tones = {
  brand: {
    open: "border-brand/40 bg-brand-50/60 shadow-card",
    icon: "bg-brand-strong text-white",
    chip: "border-brand-strong bg-brand-strong text-white",
    number: "text-brand-strong",
  },
  plus: {
    open: "border-plus/30 bg-plus-soft/60 shadow-card",
    icon: "bg-plus text-white",
    chip: "border-plus bg-plus text-white",
    number: "text-plus",
  },
} as const;

export function FaqAccordion({
  items = [],
  defaultOpen = 0,
  tone = "brand",
  className,
  title: _title,
  ...props
}: FaqAccordionProps) {
  const baseId = useId();
  const theme = tones[tone];
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const topics = useMemo(
    () => [...new Set(items.map((item) => item.topic).filter((t): t is string => Boolean(t)))],
    [items]
  );
  const [topic, setTopic] = useState<string | null>(null);
  const visible = topic ? items.filter((item) => item.topic === topic) : items;

  const [openQuestion, setOpenQuestion] = useState<string | null>(
    defaultOpen === null ? null : (items[defaultOpen]?.question ?? null)
  );

  const toggle = (question: string) => setOpenQuestion((current) => (current === question ? null : question));

  /* Arrow keys / Home / End move between questions (WAI-ARIA accordion pattern). */
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = visible.length - 1;
    const target = {
      ArrowDown: index === last ? 0 : index + 1,
      ArrowUp: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    }[event.key];
    if (target === undefined) return;
    event.preventDefault();
    buttonsRef.current[target]?.focus();
  };

  return (
    <div className={cn("w-full", className)} {...props}>
      {topics.length > 1 && (
        <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Filter questions by topic">
          {[null, ...topics].map((t) => {
            const active = topic === t;
            return (
              <button
                key={t ?? "all"}
                type="button"
                aria-pressed={active}
                onClick={() => setTopic(t)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm font-medium transition",
                  active ? theme.chip : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                )}
              >
                {t ?? "All"}
              </button>
            );
          })}
        </div>
      )}

      <ul className="flex flex-col gap-3">
        {visible.map((item, index) => {
          const open = openQuestion === item.question;
          const buttonId = `${baseId}-q${index}`;
          const panelId = `${baseId}-a${index}`;
          return (
            <li
              key={item.question}
              className={cn(
                "rounded-2xl border bg-white transition-colors duration-200",
                open ? theme.open : "border-slate-200/80 hover:border-slate-300"
              )}
            >
              <h3>
                <button
                  ref={(el) => {
                    buttonsRef.current[index] = el;
                  }}
                  id={buttonId}
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => toggle(item.question)}
                  onKeyDown={(event) => onKeyDown(event, index)}
                  className="flex w-full items-center gap-4 rounded-2xl px-4 py-4 text-left sm:px-5"
                >
                  <span
                    className={cn(
                      "hidden w-7 shrink-0 font-display text-sm font-extrabold tabular-nums sm:block",
                      open ? theme.number : "text-slate-300"
                    )}
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 text-[15px] font-semibold text-slate-900 sm:text-base">{item.question}</span>
                  <span
                    className={cn(
                      "grid size-8 shrink-0 place-items-center rounded-full transition-all duration-300",
                      open ? cn(theme.icon, "rotate-45") : "bg-slate-100 text-slate-600"
                    )}
                    aria-hidden="true"
                  >
                    <Plus className="size-4" strokeWidth={2.5} />
                  </span>
                </button>
              </h3>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className={cn(
                  "grid transition-[grid-template-rows] duration-300 ease-out",
                  open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                )}
              >
                <div className="overflow-hidden" inert={!open}>
                  <p className="px-4 pb-5 text-[15px] leading-relaxed text-slate-600 sm:pl-16 sm:pr-16">
                    {item.answer}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default FaqAccordion;
