import { useState, type FormEvent, type ReactElement } from "react";
import {
  ArrowUp,
  BadgePercent,
  ChevronDown,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Package,
  ShieldCheck,
  Smartphone,
  Truck,
  Twitter,
} from "lucide-react";
import { toast } from "sonner";
import { Logo } from "./Logo";
import { footerColumns, type FooterColumn } from "@/data/site";
import { LineHoverLink } from "@/components/ui/line-hover-link";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/** Hover tooltip for footer items that don't have a page yet. */
function ComingSoon({ children, label = "Coming soon" }: { children: ReactElement; label?: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

/* ------------------------------------------------------------------ */
/* Trust band                                                          */
/* ------------------------------------------------------------------ */

const promises = [
  { Icon: ShieldCheck, title: "100% genuine", text: "3-step quality check on every medicine" },
  { Icon: Package, title: "1 Lakh+ products", text: "Medicines and healthcare in one place" },
  { Icon: Truck, title: "Home delivery", text: "Delivered right to your doorstep" },
  { Icon: BadgePercent, title: "Great offers", text: "Added discounts and e-wallet cashback" },
];

function TrustBand() {
  return (
    <div className="border-y border-brand/10 bg-brand-50">
      <ul className="container-page grid grid-cols-2 gap-x-4 gap-y-6 py-7 lg:grid-cols-4">
        {promises.map(({ Icon, title, text }) => (
          <li key={title} className="flex items-start gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-brand-strong shadow-card ring-1 ring-brand/10">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-bold text-slate-900">{title}</p>
              <p className="mt-0.5 text-xs text-slate-600 sm:text-sm">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Newsletter                                                          */
/* ------------------------------------------------------------------ */

function Newsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setEmail("");
    toast.success("Thanks for subscribing!");
  };

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card sm:p-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand-strong">
          <Mail className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-lg font-bold text-ink">Sign up to our newsletter</h2>
          <p className="mt-0.5 text-sm text-slate-600">
            Stay up to date with the latest news, announcements, articles and blogs.
          </p>
        </div>
      </div>
      <form onSubmit={onSubmit} noValidate className="w-full lg:max-w-md">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <div className="flex gap-2 rounded-xl border border-slate-200 bg-canvas p-1.5 transition focus-within:border-brand-strong focus-within:bg-white focus-within:ring-4 focus-within:ring-brand/15">
          <input
            id="newsletter-email"
            type="email"
            autoComplete="email"
            placeholder="Your email address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={error ? "newsletter-error" : undefined}
            className="min-w-0 flex-1 bg-transparent px-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          <button
            type="submit"
            className="h-10 shrink-0 rounded-lg bg-brand-strong px-4 text-sm font-bold text-white transition hover:bg-brand-strong/90"
          >
            Subscribe
          </button>
        </div>
        {error && (
          <p id="newsletter-error" role="alert" className="mt-2 text-sm text-red-600">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Link columns (collapsible on mobile)                                */
/* ------------------------------------------------------------------ */

function LinkColumn({ column }: { column: FooterColumn }) {
  const [open, setOpen] = useState(false);
  const listId = `footer-${column.title.toLowerCase().replace(/[^a-z]+/g, "-")}`;

  return (
    <div className="border-b border-slate-200 md:border-0">
      <h3 className="hidden text-sm font-bold text-slate-900 md:mb-4 md:block">{column.title}</h3>
      <h3 className="md:hidden">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between py-3.5 text-sm font-bold text-slate-900"
        >
          {column.title}
          <ChevronDown className={cn("size-4 text-slate-500 transition-transform", open && "rotate-180")} aria-hidden="true" />
        </button>
      </h3>
      <ul id={listId} className={cn("space-y-2.5 pb-4 text-sm md:block md:pb-0", open ? "block" : "hidden")}>
        {column.links.map((link) =>
          typeof link === "string" ? (
            <li key={link}>
              <ComingSoon>
                <span className="cursor-default text-slate-400">
                  {link}
                  <span className="sr-only"> (coming soon)</span>
                </span>
              </ComingSoon>
            </li>
          ) : (
            <li key={link.label}>
              <LineHoverLink to={link.to!} className="text-slate-600 transition-colors hover:text-brand-strong">
                {link.label}
              </LineHoverLink>
            </li>
          )
        )}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

const socials = [
  { label: "Facebook", Icon: Facebook },
  { label: "Instagram", Icon: Instagram },
  { label: "LinkedIn", Icon: Linkedin },
  { label: "X (Twitter)", Icon: Twitter },
];

export function SiteFooter() {
  return (
    <footer className="mt-16 bg-canvas text-slate-600">
      <TrustBand />

      <div className="container-page py-10 sm:py-12">
        <Newsletter />

        <div className="mt-10 grid gap-10 lg:grid-cols-[17rem_1fr] lg:gap-12">
          {/* Brand block */}
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-600">
              Buy medicines online at affordable prices from the comfort of your home and get them delivered
              to your doorstep.
            </p>

            <p className="mb-2.5 mt-6 text-xs font-bold uppercase tracking-wider text-slate-500">Get the app</p>
            <div className="flex flex-wrap gap-2">
              {["App Store", "Google Play"].map((store) => (
                <ComingSoon key={store} label="Our app is on its way">
                <span
                  aria-disabled="true"
                  className="inline-flex cursor-default items-center gap-2 rounded-lg bg-ink px-3 py-2 text-white"
                >
                  <Smartphone className="size-4 shrink-0" aria-hidden="true" />
                  <span className="leading-none">
                    <span className="block text-[10px] text-white/60">Coming soon on</span>
                    <span className="text-xs font-bold">{store}</span>
                  </span>
                </span>
                </ComingSoon>
              ))}
            </div>

            <p className="mb-2.5 mt-6 text-xs font-bold uppercase tracking-wider text-slate-500">Follow us</p>
            <ul className="flex gap-2">
              {socials.map(({ label, Icon }) => (
                <ComingSoon key={label} label={`${label}: coming soon`}>
                  <li className="grid size-9 cursor-default place-items-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-brand/40 hover:text-brand-strong">
                    <Icon className="size-4" aria-hidden="true" />
                    <span className="sr-only">{label} (coming soon)</span>
                  </li>
                </ComingSoon>
              ))}
            </ul>
          </div>

          {/* Link columns */}
          <nav aria-label="Footer" className="grid md:grid-cols-3 md:gap-8 xl:grid-cols-5">
            {footerColumns.map((column) => (
              <LinkColumn key={column.title} column={column} />
            ))}
          </nav>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-200 bg-white">
        <div className="container-page py-6">
          <p className="max-w-4xl text-xs leading-relaxed text-slate-500">
            <strong className="font-semibold text-slate-600">Disclaimer:</strong> The information on this site is
            for general guidance only and is not a substitute for professional medical advice. Always consult
            your doctor before starting, changing or stopping any medicine.
          </p>
          <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <span>
              &copy; {new Date().getFullYear()} Pharvia. All rights reserved. ·{" "}
              <span className="font-medium text-brand-strong">at every step</span>
            </span>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex w-fit items-center gap-1.5 rounded-lg px-2 py-1 font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-brand-strong"
            >
              <ArrowUp className="size-3.5" aria-hidden="true" /> Back to top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
