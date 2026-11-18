import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgePercent,
  BellRing,
  ChevronLeft,
  ChevronRight,
  Crown,
  FileText,
  MapPin,
  Package,
  PhoneCall,
  ShieldCheck,
  Smartphone,
  Truck,
  Upload,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import StatsCounter from "@/components/ui/stats-counter";
import { Reveal, SectionHeading } from "@/components/ui/reveal";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { categories } from "@/data/catalog";
import { processSteps, quickLinks, type ProcessStepIcon } from "@/data/site";
import { cn } from "@/lib/utils";
import promoPharma10 from "@/assets/img/promo-pharma10.webp";
import prescriptionImg from "@/assets/img/prescription.webp";
import plusBanner from "@/assets/img/plus-banner.webp";
import plusBannerMobile from "@/assets/img/plus-banner-mobile.webp";
import appMockup from "@/assets/img/app-mockup.webp";
import care1 from "@/assets/img/care-1.webp";
import care2 from "@/assets/img/care-2.webp";

/* ------------------------------------------------------------------ */
/* Trust strip                                                         */
/* ------------------------------------------------------------------ */

const stats = [
  { value: 1, suffix: " Lakh+", label: "Products to choose from", Icon: Package },
  { value: 100, suffix: "%", label: "Genuine products", Icon: ShieldCheck },
  { value: 3, suffix: "-step", label: "Quality check on medicines", Icon: BadgePercent },
  { text: "Doorstep", label: "Home delivery", Icon: Truck },
];

export function TrustStrip() {
  return (
    <section aria-label="Why customers trust us" className="container-page -mt-8 relative z-10">
      <Reveal className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border bg-slate-200 shadow-soft lg:grid-cols-4">
        {stats.map(({ value, suffix, text, label, Icon }) => (
          <div key={label} className="flex items-center gap-4 bg-white p-5 sm:p-6">
            <span className="hidden size-12 shrink-0 place-items-center rounded-2xl bg-brand-soft text-brand-strong sm:grid">
              <Icon className="size-6" aria-hidden="true" />
            </span>
            <div>
              <p className="font-display text-2xl font-extrabold text-slate-900 sm:text-3xl">
                {text ?? <StatsCounter value={value} suffix={suffix} />}
              </p>
              <p className="text-sm text-slate-500">{label}</p>
            </div>
          </div>
        ))}
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Quick links                                                         */
/* ------------------------------------------------------------------ */

export function QuickLinks() {
  return (
    <section className="container-page mt-20">
      <SectionHeading eyebrow="Explore" title="Everything for your health" />
      <div className="grid grid-cols-4 gap-2.5 sm:gap-4 lg:grid-cols-7">
        {quickLinks.map((item, i) => {
          const content = (
            <>
              <span className="relative block aspect-square overflow-hidden rounded-2xl bg-slate-100">
                <img
                  src={item.image}
                  alt=""
                  loading="lazy"
                  className="size-full object-cover transition duration-500 group-hover:scale-110"
                />
                {!item.to && (
                  <Badge tone="white" className="absolute left-2 top-2 px-2 py-0.5 text-[10px]">
                    Soon
                  </Badge>
                )}
              </span>
              <span className="mt-2 block text-center text-xs font-semibold text-slate-700 group-hover:text-brand-strong sm:text-sm">
                {item.title}
              </span>
            </>
          );
          return (
            <Reveal key={item.title} delay={i * 0.04}>
              {item.to ? (
                <Link to={item.to} className="group block">
                  {content}
                </Link>
              ) : (
                <div className="group block cursor-default opacity-80" aria-disabled="true">
                  {content}
                </div>
              )}
            </Reveal>
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
    render: () => (
      <img src={promoPharma10} alt="" className="size-full object-cover" width="800" height="400" />
    ),
  },
  {
    id: "stayhome",
    to: "/offers",
    label: "Flat 20% off plus 20% cashback on your first order with code STAYHOME",
    render: () => (
      <div className="relative flex size-full flex-col justify-center overflow-hidden bg-linear-to-br from-brand-strong via-accent to-accent-soft p-6 text-white sm:p-10">
        <div className="absolute -right-10 -top-10 size-56 rounded-full bg-white/10" aria-hidden="true" />
        <div className="absolute -bottom-16 right-20 size-40 rounded-full bg-brand/30" aria-hidden="true" />
        <p className="text-xs font-semibold uppercase tracking-widest text-white/70 sm:text-sm">
          First order offer
        </p>
        <p className="mt-2 font-display text-2xl font-extrabold leading-tight sm:text-4xl">
          Flat 20% off
          <br />+ 20% cashback
        </p>
        <p className="mt-3 inline-flex w-fit items-center gap-2 rounded-xl border border-dashed border-white/60 px-3 py-1.5 font-mono text-sm font-bold tracking-wider">
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
          <p className="text-xs font-semibold uppercase tracking-widest text-white/70 sm:text-sm">
            Care for every age
          </p>
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
      className="relative overflow-hidden rounded-3xl bg-slate-100 shadow-soft"
      role="region"
      aria-roledescription="carousel"
      aria-label="Offers"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="relative aspect-2/1">
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

      <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-2">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setState([i, i > index ? 1 : -1])}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
            className={cn(
              "h-2 rounded-full transition-all",
              i === index ? "w-6 bg-white" : "w-2 bg-white/60 hover:bg-white/90"
            )}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 hidden size-9 -translate-y-1/2 place-items-center rounded-full bg-white/80 text-slate-800 shadow backdrop-blur transition hover:bg-white sm:grid"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 hidden size-9 -translate-y-1/2 place-items-center rounded-full bg-white/80 text-slate-800 shadow backdrop-blur transition hover:bg-white sm:grid"
      >
        <ChevronRight className="size-5" />
      </button>
    </div>
  );
}

export function PromoSection() {
  return (
    <section className="container-page mt-20 grid gap-4 lg:grid-cols-5">
      <Reveal className="lg:col-span-3">
        <PromoCarousel />
      </Reveal>
      <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-1">
        <Reveal delay={0.1}>
          <Link
            to="/upload-prescription"
            className="group relative flex h-full min-h-44 items-center gap-4 overflow-hidden rounded-3xl border bg-brand-50 p-6 transition hover:border-brand/40 hover:shadow-lift"
          >
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                Order with prescription
              </p>
              <h3 className="mt-1 text-xl font-bold">Upload prescription, get your order delivered</h3>
              <span className={cn(buttonVariants({ size: "sm" }), "mt-4")}>
                <Upload /> Upload
              </span>
            </div>
            <img
              src={prescriptionImg}
              alt=""
              loading="lazy"
              className="h-32 w-auto shrink-0 transition duration-300 group-hover:-rotate-3 group-hover:scale-105"
            />
          </Link>
        </Reveal>
        <Reveal delay={0.2}>
          <Link
            to="/plus"
            className="group relative flex h-full min-h-44 flex-col justify-between overflow-hidden rounded-3xl bg-linear-to-br from-blue-600 to-purple-500 p-6 text-white transition hover:shadow-lift"
          >
            <Crown className="absolute -right-4 -top-4 size-32 rotate-12 text-white/10" aria-hidden="true" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-yellow-300">PLUS membership</p>
              <h3 className="mt-1 text-xl font-bold text-white">10% off medicines with free delivery</h3>
            </div>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold">
              Explore PLUS <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </span>
          </Link>
        </Reveal>
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
    <ol className={cn("grid gap-4", compact ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-4")}>
      {processSteps.map((step, i) => {
        const Icon = stepIcons[step.icon];
        return (
          <Reveal as="li" key={step.title} delay={i * 0.08} className="relative">
            <div className="h-full rounded-2xl border bg-white p-5 transition hover:border-brand/30 hover:shadow-soft">
              <div className="flex items-center justify-between">
                <span className="grid size-11 place-items-center rounded-xl bg-brand-soft text-brand-strong">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="font-display text-3xl font-extrabold text-slate-200">0{i + 1}</span>
              </div>
              <p className="mt-4 font-semibold text-slate-800">{step.title}</p>
            </div>
          </Reveal>
        );
      })}
    </ol>
  );
}

export function ProcessSection() {
  return (
    <section className="container-page mt-24">
      <SectionHeading
        eyebrow="Order with prescription"
        title="How the process works"
        action={
          <Link to="/upload-prescription" className={buttonVariants({ variant: "outline" })}>
            <FileText /> Upload prescription
          </Link>
        }
      />
      <ProcessSteps />
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

export function CategoryGrid({ exclude, title = "Shop by categories" }: CategoryGridProps) {
  const list = categories.filter((c) => c.slug !== exclude);
  return (
    <section className="container-page mt-24">
      <SectionHeading eyebrow="Categories" title={title} />
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {list.map((category, i) => (
          <Reveal key={category.slug} delay={(i % 4) * 0.06}>
            <Link
              to={`/category/${category.slug}`}
              className="group relative block aspect-square overflow-hidden rounded-3xl bg-slate-100"
            >
              <img
                src={category.image}
                alt=""
                loading="lazy"
                className="size-full object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4">
                <span className="font-display text-base font-bold leading-tight text-white sm:text-lg">
                  {category.title}
                </span>
                <span className="grid size-8 shrink-0 translate-y-2 place-items-center rounded-full bg-white text-brand-strong opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                  <ArrowRight className="size-4" />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Why choose us (bento)                                               */
/* ------------------------------------------------------------------ */

const reasons = [
  { Icon: Package, title: "1 Lakh+ products", text: "Medicines and healthcare products in one place." },
  { Icon: Truck, title: "Delivered to your door", text: "Shop from home in a few clicks." },
  { Icon: BellRing, title: "Refill reminders", text: "Scheduled reminders so you never miss a refill." },
  { Icon: BadgePercent, title: "Great offers", text: "Added discounts and e-wallet cashback." },
];

export function WhyUs() {
  return (
    <section className="container-page mt-24">
      <SectionHeading eyebrow="Why Pharmacy" title="A one-stop shop for your healthcare needs" />
      <div className="grid gap-4 lg:grid-cols-3 lg:grid-rows-2">
        <Reveal className="relative overflow-hidden rounded-3xl bg-brand-strong text-white lg:col-span-2 lg:row-span-2">
          <img
            src={care2}
            alt=""
            loading="lazy"
            className="absolute inset-0 size-full object-cover opacity-25 mix-blend-luminosity"
          />
          <div className="relative flex h-full min-h-72 flex-col justify-end bg-linear-to-t from-brand-strong via-brand-strong/80 to-transparent p-8 sm:p-10">
            <ShieldCheck className="mb-4 size-10 text-brand" aria-hidden="true" />
            <h3 className="text-2xl font-bold text-white sm:text-3xl">Get 3-step quality-checked medicines</h3>
            <p className="mt-3 max-w-xl text-white/80">
              Buy medicines online at affordable prices from the comfort of your home and get them
              delivered to your doorstep. Search for what you need, add to cart and check out. It&apos;s
              that simple.
            </p>
          </div>
        </Reveal>
        {reasons.slice(0, 2).map(({ Icon, title, text }, i) => (
          <Reveal key={title} delay={0.1 + i * 0.08} className="rounded-3xl border bg-surface p-6">
            <Icon className="size-8 text-accent" aria-hidden="true" />
            <h3 className="mt-4 text-lg font-bold">{title}</h3>
            <p className="mt-1 text-sm text-slate-600">{text}</p>
          </Reveal>
        ))}
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {reasons.slice(2).map(({ Icon, title, text }, i) => (
          <Reveal key={title} delay={i * 0.08} className="flex items-start gap-4 rounded-3xl border bg-surface p-6">
            <Icon className="size-8 shrink-0 text-accent" aria-hidden="true" />
            <div>
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="mt-1 text-sm text-slate-600">{text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* PLUS banner                                                         */
/* ------------------------------------------------------------------ */

export function PlusBanner() {
  return (
    <section className="container-page mt-24">
      <Reveal>
        <Link
          to="/plus"
          className="group relative block overflow-hidden rounded-3xl shadow-soft transition hover:shadow-lift"
          aria-label="Unlock benefits as a PLUS member. Get your medicines at 10% discount with free delivery. Explore now."
        >
          <picture>
            <source media="(min-width: 768px)" srcSet={plusBanner} />
            <img
              src={plusBannerMobile}
              alt=""
              loading="lazy"
              className="w-full transition duration-500 group-hover:scale-[1.01]"
            />
          </picture>
          <span className="absolute bottom-4 left-4 inline-flex items-center gap-1 rounded-xl bg-white px-4 py-2 text-sm font-bold text-blue-700 shadow-lg md:bottom-[12%] md:left-[43%] lg:px-5 lg:py-2.5">
            Explore now <ChevronRight className="size-4 transition group-hover:translate-x-0.5" />
          </span>
        </Link>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* App teaser                                                          */
/* ------------------------------------------------------------------ */

export function AppSection() {
  return (
    <section className="container-page mt-24">
      <Reveal className="relative overflow-hidden rounded-3xl bg-linear-to-br from-accent to-brand-strong px-6 pt-10 text-white sm:px-12 lg:pt-0">
        <div className="pointer-events-none absolute -left-20 -top-20 size-72 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
        <div className="relative grid items-center gap-10 lg:grid-cols-2">
          <div className="lg:py-16">
            <Badge tone="white">
              <Smartphone /> Coming soon
            </Badge>
            <h2 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">Pharmacy in your pocket</h2>
            <p className="mt-3 max-w-md text-white/80">
              Order medicines, upload prescriptions and track deliveries from your phone. Our mobile
              app is on its way.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {["App Store", "Google Play"].map((store) => (
                <span
                  key={store}
                  aria-disabled="true"
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-950/80 px-4 py-2.5 text-sm font-semibold text-white/90 ring-1 ring-white/10"
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
              className="-mb-24 w-56 drop-shadow-2xl sm:w-64 lg:-mb-10 lg:mt-10"
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
    <section className="container-page mt-24" aria-label="Frequently asked questions">
      <SectionHeading
        eyebrow="FAQ"
        title="Questions, answered"
        description="Quick answers about ordering, offers and delivery."
      />
      <FaqAccordion
        items={faqItems}
        title=""
        className="max-w-3xl font-sans text-slate-900 [&_button]:min-h-[56px] [&_span]:text-[15px]"
      />
    </section>
  );
}
