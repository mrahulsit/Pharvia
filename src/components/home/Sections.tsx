import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgePercent,
  BellRing,
  Check,
  ChevronLeft,
  ChevronRight,
  Crown,
  MapPin,
  Package,
  PhoneCall,
  ShieldCheck,
  Smartphone,
  Truck,
  Upload,
  type LucideIcon,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Reveal, SectionHeading } from "@/components/ui/reveal";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { ProductRail } from "@/components/product/ProductCard";
import { categories, products } from "@/data/catalog";
import { plusBenefits, processSteps, quickLinks, type ProcessStepIcon } from "@/data/site";
import { cn } from "@/lib/utils";
import promoPharma10 from "@/assets/img/promo-pharma10.webp";
import prescriptionImg from "@/assets/img/prescription.webp";
import appMockup from "@/assets/img/app-mockup.webp";
import care1 from "@/assets/img/care-1.webp";

const viewAllClass =
  "inline-flex items-center gap-1 text-sm font-semibold text-brand-strong hover:underline underline-offset-4";

/* ------------------------------------------------------------------ */
/* Offerings: the 7 quick-link tiles                                   */
/* ------------------------------------------------------------------ */

/** Ribbons only restate offers that exist elsewhere in the app. */
const ribbons: Record<string, { text: string; className: string }> = {
  Medicines: { text: "10% off", className: "bg-offer text-white" },
  "Gift Subscribe": { text: "PLUS", className: "bg-plus text-white" },
  "Health Blogs": { text: "Soon", className: "bg-slate-700 text-white" },
};

export function QuickLinks() {
  return (
    <section className="container-page mt-10 sm:mt-12">
      <SectionHeading title="Discover our offerings" />
      <div className="rail -mx-4 auto-cols-[26%] gap-3 px-4 pt-2 sm:mx-0 sm:auto-cols-[18%] sm:px-0 lg:grid-flow-row lg:grid-cols-7 lg:gap-4 lg:overflow-visible">
        {quickLinks.map((item) => {
          const ribbon = ribbons[item.title];
          const content = (
            <>
              <span className="relative block aspect-square rounded-2xl border border-slate-200/80 bg-white p-1.5 shadow-card transition duration-300 group-hover:-translate-y-1 group-hover:border-brand/30 group-hover:shadow-lift">
                <span className="block size-full overflow-hidden rounded-xl bg-slate-100">
                  <img
                    src={item.image}
                    alt=""
                    loading="lazy"
                    className="size-full object-cover transition duration-500 group-hover:scale-110"
                  />
                </span>
                {ribbon && (
                  <span
                    className={cn(
                      "absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide shadow-sm",
                      ribbon.className
                    )}
                  >
                    {ribbon.text}
                  </span>
                )}
              </span>
              <span className="mt-2 block text-center text-xs font-semibold leading-tight text-slate-800 group-hover:text-brand-strong sm:text-sm">
                {item.title}
              </span>
            </>
          );
          return item.to ? (
            <Link key={item.title} to={item.to} className="group block">
              {content}
            </Link>
          ) : (
            <div key={item.title} className="group block cursor-default opacity-75" aria-disabled="true">
              {content}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Promo carousel + side cards                                         */
/* ------------------------------------------------------------------ */

const slides = [
  {
    id: "pharma10",
    to: "/offers",
    label: "Flat 10% off on any medicine with code PHARMA10",
    render: () => <img src={promoPharma10} alt="" className="size-full object-cover" width="800" height="400" />,
  },
  {
    id: "stayhome",
    to: "/offers",
    label: "Flat 20% off plus 20% cashback on your first order with code STAYHOME",
    render: () => (
      <div className="relative flex size-full flex-col justify-center overflow-hidden bg-linear-to-br from-brand-strong via-accent to-accent-soft p-6 text-white sm:p-10">
        <div className="absolute -right-10 -top-10 size-56 rounded-full bg-white/10" aria-hidden="true" />
        <div className="absolute -bottom-16 right-20 size-40 rounded-full bg-brand/30" aria-hidden="true" />
        <p className="text-xs font-semibold uppercase tracking-widest text-white/75 sm:text-sm">First order offer</p>
        <p className="mt-2 font-display text-2xl font-extrabold leading-tight sm:text-4xl">
          Flat 20% off
          <br />+ 20% cashback
        </p>
        <p className="mt-3 inline-flex w-fit items-center gap-2 rounded-lg border border-dashed border-white/60 px-3 py-1.5 font-mono text-sm font-bold tracking-wider">
          STAYHOME
        </p>
      </div>
    ),
  },
  {
    id: "care",
    to: "/category/elderly-care",
    label: "Care for every age: shop elderly care",
    render: () => (
      <div className="relative size-full">
        <img src={care1} alt="" className="size-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-linear-to-r from-slate-950/75 via-slate-950/30 to-transparent" />
        <div className="absolute inset-y-0 left-0 flex flex-col justify-center p-6 text-white sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/75 sm:text-sm">Care for every age</p>
          <p className="mt-2 max-w-xs font-display text-2xl font-extrabold leading-tight sm:text-4xl">
            Elderly care essentials
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold">
            Shop now <ArrowRight className="size-4" />
          </span>
        </div>
      </div>
    ),
  },
];

function PromoCarousel() {
  const reduceMotion = useReducedMotion();
  const [[index, direction], setState] = useState([0, 1]);
  const [paused, setPaused] = useState(false);

  const go = useCallback((delta: number) => {
    setState(([i]) => [(i + delta + slides.length) % slides.length, delta]);
  }, []);

  useEffect(() => {
    if (paused || reduceMotion) return undefined;
    const id = setInterval(() => go(1), 5000);
    return () => clearInterval(id);
  }, [paused, reduceMotion, go]);

  const slide = slides[index];

  return (
    <div
      className="group/carousel relative h-full overflow-hidden rounded-2xl bg-slate-100"
      role="region"
      aria-roledescription="carousel"
      aria-label="Offers"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="relative aspect-2/1 w-full lg:aspect-auto lg:h-full lg:min-h-80">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={slide.id}
            custom={direction}
            className="absolute inset-0"
            initial={reduceMotion ? { opacity: 0 } : { x: `${direction * 100}%` }}
            animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { x: `${direction * -100}%` }}
            transition={{ type: "tween", duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
          >
            <Link
              to={slide.to}
              className="block size-full"
              aria-label={`${slide.label} (slide ${index + 1} of ${slides.length})`}
            >
              {slide.render()}
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-slate-950/25 px-2 py-1.5 backdrop-blur">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setState([i, i > index ? 1 : -1])}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
            className={cn(
              "h-1.5 rounded-full transition-all",
              i === index ? "w-5 bg-white" : "w-1.5 bg-white/60 hover:bg-white/90"
            )}
          />
        ))}
      </div>
      {[
        { delta: -1, label: "Previous slide", Icon: ChevronLeft, pos: "left-3" },
        { delta: 1, label: "Next slide", Icon: ChevronRight, pos: "right-3" },
      ].map(({ delta, label, Icon, pos }) => (
        <button
          key={label}
          type="button"
          onClick={() => go(delta)}
          aria-label={label}
          className={cn(
            "absolute top-1/2 hidden size-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-slate-800 shadow opacity-0 transition hover:bg-white focus-visible:opacity-100 group-hover/carousel:opacity-100 sm:grid",
            pos
          )}
        >
          <Icon className="size-5" />
        </button>
      ))}
    </div>
  );
}

export function PromoSection() {
  return (
    <section className="container-page mt-10 grid gap-3 sm:gap-4 lg:grid-cols-[2fr_1fr]">
      <Reveal className="lg:h-full">
        <PromoCarousel />
      </Reveal>
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-1">
        <Reveal delay={0.08}>
          <Link
            to="/upload-prescription"
            className="group relative flex h-full min-h-36 items-center gap-3 overflow-hidden rounded-2xl bg-brand-soft p-5 transition hover:shadow-lift"
          >
            <div className="relative z-10 flex-1">
              <p className="text-xs font-bold uppercase tracking-wider text-accent">Order with prescription</p>
              <h3 className="mt-1 text-lg font-bold leading-snug">Upload Rx, get it delivered</h3>
              <span className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-brand-strong px-3 py-1.5 text-xs font-bold text-white">
                <Upload className="size-3.5" aria-hidden="true" /> Upload now
              </span>
            </div>
            <img
              src={prescriptionImg}
              alt=""
              loading="lazy"
              className="h-28 w-auto shrink-0 transition duration-300 group-hover:-rotate-3 group-hover:scale-105"
            />
          </Link>
        </Reveal>
        <Reveal delay={0.16}>
          <Link
            to="/offers"
            className="group relative flex h-full min-h-36 flex-col justify-center overflow-hidden rounded-2xl bg-offer-soft p-5 transition hover:shadow-lift"
          >
            <BadgePercent className="absolute -right-5 -top-5 size-32 rotate-12 text-offer/10" aria-hidden="true" />
            <p className="text-xs font-bold uppercase tracking-wider text-offer">Use code PHARMA10</p>
            <h3 className="mt-1 text-lg font-bold leading-snug">Flat 10% off on any medicine</h3>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-offer">
              All offers <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Trust bar                                                           */
/* ------------------------------------------------------------------ */

const trust = [
  { Icon: ShieldCheck, title: "100% genuine", text: "3-step quality check" },
  { Icon: Package, title: "1 Lakh+ products", text: "Medicines & healthcare" },
  { Icon: Truck, title: "Home delivery", text: "Right to your doorstep" },
  { Icon: BadgePercent, title: "Great offers", text: "Discounts & cashback" },
];

export function TrustStrip() {
  return (
    <section aria-label="Why customers trust us" className="container-page mt-10">
      <div className="grid grid-cols-2 gap-y-5 rounded-2xl border border-slate-200/80 bg-white px-4 py-5 shadow-card sm:px-6 lg:grid-cols-4 lg:divide-x lg:divide-slate-200">
        {trust.map(({ Icon, title, text }) => (
          <div key={title} className="flex items-center gap-3 lg:justify-center lg:px-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-soft text-brand-strong">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-bold text-slate-900">{title}</p>
              <p className="text-xs text-slate-500">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Product rail                                                        */
/* ------------------------------------------------------------------ */

export function MustHaveRail() {
  return (
    <section className="mt-14 bg-canvas py-10 sm:py-12">
      <div className="container-page">
        <SectionHeading
          title="Must-have medicines"
          description="Everyday essentials worth keeping at home."
          action={
            <Link to="/medicine" className={viewAllClass}>
              View all <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          }
        />
        <ProductRail products={products} />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* How ordering with a prescription works                              */
/* ------------------------------------------------------------------ */

const stepIcons: Record<ProcessStepIcon, LucideIcon> = { upload: Upload, map: MapPin, phone: PhoneCall, truck: Truck };

export function ProcessSteps({ compact = false }) {
  return (
    <ol className={cn("relative grid gap-3", compact ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-4 lg:gap-6")}>
      {!compact && (
        <span
          aria-hidden="true"
          className="absolute left-[12.5%] right-[12.5%] top-6 hidden border-t-2 border-dashed border-brand/25 lg:block"
        />
      )}
      {processSteps.map((step, i) => {
        const Icon = stepIcons[step.icon];
        return (
          <Reveal
            as="li"
            key={step.title}
            delay={i * 0.08}
            className={cn(
              "relative flex items-center gap-3",
              !compact && "lg:flex-col lg:text-center",
              compact && "rounded-xl border bg-white p-4"
            )}
          >
            <span className="relative grid size-12 shrink-0 place-items-center rounded-full bg-white text-brand-strong shadow-card ring-1 ring-brand/20">
              <Icon className="size-5" aria-hidden="true" />
              <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-brand-strong text-[10px] font-bold text-white">
                {i + 1}
              </span>
            </span>
            <p className="text-sm font-semibold text-slate-800 lg:max-w-44">{step.title}</p>
          </Reveal>
        );
      })}
    </ol>
  );
}

export function ProcessSection() {
  return (
    <section className="container-page mt-14">
      <Reveal className="overflow-hidden rounded-3xl border border-brand/15 bg-linear-to-br from-brand-50 to-white">
        <div className="grid items-center gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="text-sm font-bold text-accent">Order with prescription</p>
            <h2 className="mt-1 text-2xl font-bold sm:text-3xl">Just upload a photo. We&apos;ll do the rest.</h2>
            <div className="mt-8">
              <ProcessSteps />
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 border-t border-brand/10 pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <img src={prescriptionImg} alt="" loading="lazy" className="hidden h-36 w-auto lg:block" />
            <Link to="/upload-prescription" className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}>
              <Upload /> Upload prescription
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Categories                                                          */
/* ------------------------------------------------------------------ */

interface CategoryGridProps {
  exclude?: string;
  title?: string;
}

export function CategoryGrid({ exclude, title = "Shop by category" }: CategoryGridProps) {
  const list = categories.filter((c) => c.slug !== exclude);
  return (
    <section className="container-page mt-14">
      <SectionHeading title={title} />
      <div className={cn("grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4", list.length === 8 ? "xl:grid-cols-8" : "xl:grid-cols-7")}>
        {list.map((category, i) => (
          <Reveal key={category.slug} delay={(i % 4) * 0.05}>
            <Link
              to={`/category/${category.slug}`}
              className={cn(
                "group flex h-full flex-col items-center rounded-2xl p-3 pb-4 text-center transition duration-300 hover:-translate-y-1 hover:shadow-lift",
                category.tint
              )}
            >
              <span className="block aspect-square w-full overflow-hidden rounded-xl bg-white shadow-sm">
                <img
                  src={category.image}
                  alt=""
                  loading="lazy"
                  className="size-full object-cover transition duration-500 group-hover:scale-110"
                />
              </span>
              <span className={cn("mt-3 text-sm font-bold leading-tight", category.accent)}>{category.title}</span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* PLUS strip                                                          */
/* ------------------------------------------------------------------ */

export function PlusBanner() {
  return (
    <section className="container-page mt-14">
      <Reveal>
        <Link
          to="/plus"
          className="group relative block overflow-hidden rounded-3xl bg-linear-to-r from-indigo-950 via-plus to-violet-600 p-6 text-white transition hover:shadow-lift sm:p-10"
        >
          <Crown className="absolute -right-8 -top-10 size-56 rotate-12 text-white/[0.06]" aria-hidden="true" />
          <div className="relative grid items-center gap-6 lg:grid-cols-[1fr_auto]">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-300 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-indigo-950">
                <Crown className="size-3.5" aria-hidden="true" /> PLUS membership
              </span>
              <h2 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl">
                Save 10% on every medicine order
              </h2>
              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/85">
                {plusBenefits.slice(0, 3).map((benefit) => (
                  <li key={benefit.title} className="flex items-center gap-1.5">
                    <Check className="size-4 text-amber-300" aria-hidden="true" /> {benefit.title}
                  </li>
                ))}
              </ul>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-plus shadow-lg transition group-hover:gap-3">
              Explore PLUS <ArrowRight className="size-4" aria-hidden="true" />
            </span>
          </div>
        </Link>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Why choose us                                                       */
/* ------------------------------------------------------------------ */

const reasons = [
  { Icon: ShieldCheck, title: "3-step quality check", text: "Every medicine is checked before it ships." },
  { Icon: Package, title: "1 Lakh+ products", text: "Medicines and healthcare products in one place." },
  { Icon: BellRing, title: "Refill reminders", text: "Scheduled reminders so you never miss a refill." },
  { Icon: BadgePercent, title: "Great offers", text: "Added discounts and e-wallet cashback." },
];

export function WhyUs() {
  return (
    <section className="container-page mt-14">
      <div className="rounded-3xl bg-ink px-6 py-10 text-white sm:px-10 sm:py-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:items-center">
          <div>
            <p className="text-sm font-bold text-brand">Why Pharmacy</p>
            <h2 className="mt-1 text-2xl font-bold text-white sm:text-3xl">A one-stop shop for your healthcare needs</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Buy medicines online at affordable prices from the comfort of your home and get them delivered
              to your doorstep.
            </p>
          </div>
          <div className="grid gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2">
            {reasons.map(({ Icon, title, text }) => (
              <div key={title} className="flex gap-4 bg-ink p-5">
                <Icon className="mt-0.5 size-6 shrink-0 text-brand" aria-hidden="true" />
                <div>
                  <h3 className="font-bold text-white">{title}</h3>
                  <p className="mt-1 text-sm text-white/65">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* App teaser                                                          */
/* ------------------------------------------------------------------ */

export function AppSection() {
  return (
    <section className="container-page mt-14">
      <Reveal className="relative overflow-hidden rounded-3xl bg-brand-soft px-6 pt-8 sm:px-12 lg:pt-0">
        <div className="relative grid items-center gap-8 lg:grid-cols-2">
          <div className="lg:py-12">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-strong">
              <Smartphone className="size-3.5" aria-hidden="true" /> Coming soon
            </span>
            <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl">Pharmacy in your pocket</h2>
            <p className="mt-2 max-w-md text-slate-600">
              Order medicines, upload prescriptions and track deliveries from your phone. Our mobile app is on
              its way.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {["App Store", "Google Play"].map((store) => (
                <span
                  key={store}
                  aria-disabled="true"
                  className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white/90"
                >
                  <Smartphone className="size-4" aria-hidden="true" /> {store}
                </span>
              ))}
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <img
              src={appMockup}
              alt="The Pharmacy app on a phone"
              loading="lazy"
              width="480"
              height="916"
              className="-mb-28 w-48 drop-shadow-2xl sm:w-56 lg:-mb-16 lg:mt-8"
            />
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ                                                                 */
/* ------------------------------------------------------------------ */

/** New copy for owner review — answers describe only existing app behaviour. */
const faqItems = [
  {
    question: "How do I order medicines?",
    answer:
      "Search for a medicine, add it to your cart, then check out. You can also upload a photo of your prescription and we'll confirm your medicines by call before delivering.",
  },
  {
    question: "Is there a discount for first orders?",
    answer:
      "Yes. Use code PHARMA10 for flat 10% off on any medicine, or STAYHOME for 20% off plus 20% cashback on your first order. Offers are listed on the Offers page.",
  },
  {
    question: "How does delivery work?",
    answer:
      "Set your pincode to check delivery to your area. Once an order is placed, we confirm your medicines by call and deliver them to your doorstep.",
  },
  {
    question: "What is PLUS?",
    answer:
      "PLUS is our membership programme with 10% off medicines, free delivery, unlimited offers and member-only deals as they launch.",
  },
  {
    question: "Do I need an account to order?",
    answer:
      "You can browse without an account, but logging in lets you keep a cart and check out faster. Create an account with your email and a password.",
  },
];

export function FaqSection() {
  return (
    <section className="container-page mt-14" aria-label="Frequently asked questions">
      <div className="grid gap-6 lg:grid-cols-[1fr_2fr] lg:gap-12">
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">Frequently asked questions</h2>
          <p className="mt-2 text-slate-600">Quick answers about ordering, offers and delivery.</p>
        </div>
        <FaqAccordion
          items={faqItems}
          title=""
          className="max-w-none font-sans text-slate-900 [&_button]:min-h-[56px] [&_span]:text-[15px]"
        />
      </div>
    </section>
  );
}
