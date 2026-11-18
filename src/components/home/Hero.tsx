import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronRight, FileText, Pill, Search, ShieldCheck, TicketPercent } from "lucide-react";
import { useLocationPicker } from "@/context/LocationContext";
import { searchPhrases } from "@/data/site";
import heroCare from "@/assets/img/hero-care.webp";

const popular = ["Paracetamol", "Cetirizine", "Metformin", "Omeprazole", "Amlodipine"];

function HeroSearch() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % searchPhrases.length), 2600);
    return () => clearInterval(id);
  }, [reduceMotion]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const q = query.trim();
    navigate(q ? `/medicine?q=${encodeURIComponent(q)}` : "/medicine");
  };

  return (
    <form onSubmit={onSubmit} role="search" className="w-full">
      <div className="flex items-center rounded-2xl border border-slate-200 bg-white p-1.5 shadow-search transition focus-within:border-brand-strong focus-within:ring-4 focus-within:ring-brand/15">
        <Search className="ml-3 size-5 shrink-0 text-slate-400" aria-hidden="true" />
        <div className="relative h-12 flex-1">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search for medicines and healthcare products"
            className="absolute inset-0 w-full bg-transparent px-3 text-base text-slate-900 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          {!query && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 flex items-center overflow-hidden px-3 text-base text-slate-400"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={index}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="truncate"
                >
                  {searchPhrases[index]}
                </motion.span>
              </AnimatePresence>
            </div>
          )}
        </div>
        <button
          type="submit"
          className="flex h-12 shrink-0 items-center gap-2 rounded-xl bg-brand-strong px-4 text-sm font-bold text-white transition hover:bg-brand-strong/90 sm:px-6"
        >
          <Search className="size-4 sm:hidden" aria-hidden="true" />
          <span className="sr-only sm:not-sr-only">Search</span>
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 text-sm [scrollbar-width:none]">
        <span className="shrink-0 text-slate-500">Popular:</span>
        {popular.map((term) => (
          <Link
            key={term}
            to={`/medicine?q=${encodeURIComponent(term)}`}
            className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700 transition hover:border-brand/50 hover:text-brand-strong"
          >
            {term}
          </Link>
        ))}
      </div>
    </form>
  );
}

const orderVia = [
  {
    to: "/upload-prescription",
    title: "Upload prescription",
    text: "We'll confirm by call",
    Icon: FileText,
  },
  {
    to: "/medicine",
    title: "Browse medicines",
    text: "Order without a prescription",
    Icon: Pill,
  },
  {
    to: "/offers",
    title: "Today's offers",
    text: "PHARMA10 · STAYHOME",
    Icon: TicketPercent,
  },
];

export function Hero() {
  const reduceMotion = useReducedMotion();
  const { location } = useLocationPicker();

  return (
    <section className="container-page pt-4 sm:pt-6">
      <div className="relative isolate overflow-hidden rounded-3xl bg-linear-to-br from-brand-50 via-white to-teal-50 ring-1 ring-brand/10">
        {/* soft decorative rings */}
        <div aria-hidden="true" className="absolute -left-24 -top-24 -z-10 size-80 rounded-full border-[40px] border-brand/5" />
        <div aria-hidden="true" className="absolute -bottom-32 right-1/3 -z-10 size-72 rounded-full bg-brand/5 blur-2xl" />

        <div className="grid items-center gap-8 p-5 sm:p-8 lg:grid-cols-[1.35fr_1fr] lg:p-12">
          <motion.div
            className="min-w-0"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <p className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-strong shadow-sm ring-1 ring-brand/15">
              <ShieldCheck className="size-3.5" aria-hidden="true" />
              {location ? `Delivering to ${location.postOffice}` : "Genuine medicines, delivered home"}
            </p>
            <h1 className="mt-4 text-3xl font-extrabold leading-[1.1] text-ink sm:text-4xl lg:text-[2.75rem]">
              What are you looking for?
            </h1>
            <p className="mt-2 max-w-lg text-slate-600 sm:text-lg">
              Search 1 Lakh+ medicines and healthcare products.
            </p>

            <div className="mt-6 max-w-2xl">
              <HeroSearch />
            </div>

            <div className="mt-6 max-w-2xl">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                You can also
              </p>
              <div className="grid grid-cols-3 gap-2">
                {orderVia.map(({ to, title, text, Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    className="group flex flex-col items-start gap-2 rounded-xl border border-slate-200 bg-white/80 p-3 transition hover:border-brand/40 hover:bg-white hover:shadow-card"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand-strong">
                      <Icon className="size-[18px]" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1 leading-tight">
                      <span className="flex items-center gap-1 text-[13px] font-bold text-slate-900 sm:text-sm">
                        {title}
                        <ChevronRight className="hidden size-3.5 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-brand-strong sm:block" aria-hidden="true" />
                      </span>
                      <span className="mt-0.5 hidden text-xs text-slate-500 sm:block">{text}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="relative mx-auto hidden w-full max-w-sm lg:block"
          >
            <div className="overflow-hidden rounded-[2rem] rounded-tl-[6rem] shadow-lift ring-8 ring-white">
              <img
                src={heroCare}
                alt="A parent holding a baby's hand"
                width="1200"
                height="800"
                className="aspect-4/5 w-full object-cover"
              />
            </div>
            <Link
              to="/plus"
              className="absolute -left-10 bottom-8 flex items-center gap-3 rounded-2xl bg-white p-3 pr-4 shadow-lift ring-1 ring-slate-100 transition hover:-translate-y-0.5"
            >
              <span className="grid size-10 place-items-center rounded-xl bg-plus-soft font-display text-sm font-extrabold text-plus">
                10%
              </span>
              <span className="text-sm leading-tight">
                <span className="block font-bold text-slate-900">Extra off with PLUS</span>
                <span className="flex items-center gap-0.5 text-xs font-semibold text-plus">
                  Explore membership <ArrowRight className="size-3" aria-hidden="true" />
                </span>
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
