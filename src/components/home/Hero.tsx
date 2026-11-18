import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, FileText, Search, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { LiquidButton } from "@/components/ui/liquid-button";
import { useLocationPicker } from "@/context/LocationContext";
import { searchPhrases } from "@/data/site";
import { cn } from "@/lib/utils";
import heroBg from "@/assets/img/hero-bg.webp";
import heroCare from "@/assets/img/hero-care.webp";

const popular = ["Paracetamol", "Cetirizine", "Metformin", "Omeprazole"];

function AnimatedSearch() {
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
    <form onSubmit={onSubmit} role="search" className="relative w-full max-w-xl">
      <div className="relative flex items-center rounded-2xl border border-slate-200 bg-white p-1.5 shadow-lift focus-within:border-brand-strong focus-within:ring-4 focus-within:ring-brand/15">
        <Search className="ml-3 size-5 shrink-0 text-slate-400" aria-hidden="true" />
        <div className="relative h-11 flex-1">
          <input
            id="hero-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search for medicines and healthcare products"
            className="peer absolute inset-0 w-full bg-transparent px-3 text-base text-slate-900 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
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
        <Button type="submit" className="h-11 rounded-xl px-4 sm:px-6">
          <span className="hidden sm:inline">Search</span>
          <Search className="sm:hidden" aria-hidden="true" />
          <span className="sr-only sm:hidden">Search</span>
        </Button>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
        <span className="text-slate-500">Popular:</span>
        {popular.map((term) => (
          <Link
            key={term}
            to={`/medicine?q=${encodeURIComponent(term)}`}
            className="rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-slate-600 transition hover:border-brand/40 hover:text-brand-strong"
          >
            {term}
          </Link>
        ))}
      </div>
    </form>
  );
}

interface FloatingCardProps {
  className?: string;
  delay?: number;
  children?: ReactNode;
}

function FloatingCard({ className, delay = 0, children }: FloatingCardProps) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
      className={cn("absolute", className)}
    >
      <div className="animate-float rounded-2xl border border-white/60 bg-white/90 p-3 shadow-lift backdrop-blur-md">
        {children}
      </div>
    </motion.div>
  );
}

export function Hero() {
  const reduceMotion = useReducedMotion();
  const { location } = useLocationPicker();
  const navigate = useNavigate();

  return (
    <section className="relative isolate overflow-hidden bg-surface">
      <img
        src={heroBg}
        alt=""
        className="absolute inset-0 -z-20 size-full object-cover opacity-60"
        aria-hidden="true"
      />
      {!reduceMotion && (
        <>
          <motion.div
            aria-hidden="true"
            className="absolute -left-32 top-10 -z-10 size-96 rounded-full bg-brand/20 blur-3xl"
            animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden="true"
            className="absolute -right-24 bottom-0 -z-10 size-[28rem] rounded-full bg-accent/20 blur-3xl"
            animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}

      <div className="container-page grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:py-24">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Badge tone="white" className="mb-5">
            <Sparkles /> Pharmacy at every step
          </Badge>
          <h1 className="text-4xl font-extrabold leading-[1.1] sm:text-5xl lg:text-6xl">
            What are you{" "}
            <span className="bg-linear-to-r from-brand-strong via-accent-soft to-brand bg-clip-text text-transparent">
              looking for?
            </span>
          </h1>
          <p className="mt-5 max-w-lg text-lg text-slate-600">
            Genuine medicines and healthcare products, delivered to your doorstep.
          </p>
          <div className="mt-8">
            <AnimatedSearch />
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <LiquidButton variant="brand" className="min-h-12 px-7 text-base" onClick={() => navigate("/upload-prescription")}>
              <span className="inline-flex items-center gap-2">
                <FileText className="size-4" /> Upload prescription
              </span>
            </LiquidButton>
            <Link to="/medicine" className={buttonVariants({ variant: "outline", size: "lg" })}>
              Browse medicines <ArrowRight />
            </Link>
          </div>
        </motion.div>

        <div className="relative mx-auto hidden w-full max-w-lg md:block">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="overflow-hidden rounded-[2rem] border-8 border-white shadow-lift"
          >
            <img
              src={heroCare}
              alt="A parent holding a baby's hand"
              width="1200"
              height="800"
              className="aspect-4/5 w-full object-cover"
            />
          </motion.div>
          <FloatingCard className="-left-10 top-10" delay={0.4}>
            <div className="flex items-center gap-3 pr-2">
              <span className="grid size-10 place-items-center rounded-xl bg-brand-soft text-brand-strong">
                <ShieldCheck className="size-5" />
              </span>
              <div className="text-sm">
                <p className="font-bold">100% genuine</p>
                <p className="text-slate-500">Quality-checked medicines</p>
              </div>
            </div>
          </FloatingCard>
          <FloatingCard className="-right-8 bottom-16" delay={0.6}>
            <div className="flex items-center gap-3 pr-2">
              <span className="grid size-10 place-items-center rounded-xl bg-teal-50 text-accent">
                <Truck className="size-5" />
              </span>
              <div className="text-sm">
                <p className="font-bold">Home delivery</p>
                <p className="max-w-40 truncate text-slate-500">
                  {location ? `To ${location.postOffice}` : "Right to your doorstep"}
                </p>
              </div>
            </div>
          </FloatingCard>
        </div>
      </div>
    </section>
  );
}
