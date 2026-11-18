import { useState, type FormEvent } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgePercent,
  Bell,
  Check,
  Crown,
  Gift,
  ShoppingCart,
  Sparkles,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Reveal, SectionHeading } from "@/components/ui/reveal";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { Slider } from "@/components/ui/slider";
import { BorderBeam } from "@/components/ui/border-beam";
import { AnimatedNumber } from "@/components/ui/count-up";
import { ProductIcon } from "@/components/product/ProductCard";
import { useCart } from "@/context/CartContext";
import { PLUS_DISCOUNT, plusPrice, products } from "@/data/catalog";
import { plusBenefits } from "@/data/site";
import { formatPrice } from "@/lib/utils";
import { usePageTitle } from "@/lib/usePageTitle";
import logo from "@/assets/PHARMACY.png";

const benefitIcons: LucideIcon[] = [BadgePercent, Truck, Gift, Sparkles];

const formatRupees = (value: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

/* ------------------------------------------------------------------ */
/* Notify-me form (sign-up isn't live yet)                             */
/* ------------------------------------------------------------------ */

function NotifyForm({ id, dark = false }: { id: string; dark?: boolean }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    // TODO: backend — store the email for the PLUS launch list.
    setError("");
    setEmail("");
    toast.success("You're on the list! We'll email you when PLUS opens.");
  };

  return (
    <form onSubmit={onSubmit} noValidate className="w-full max-w-md">
      <label htmlFor={id} className="sr-only">
        Email address
      </label>
      <div
        className={
          dark
            ? "flex gap-2 rounded-2xl bg-white/10 p-1.5 ring-1 ring-white/20 focus-within:ring-white/50"
            : "flex gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 focus-within:border-plus focus-within:ring-4 focus-within:ring-plus/15"
        }
      >
        <input
          id={id}
          type="email"
          autoComplete="email"
          placeholder="Your email address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`min-w-0 flex-1 bg-transparent px-3 text-sm focus:outline-none ${
            dark ? "text-white placeholder:text-white/60" : "text-slate-900 placeholder:text-slate-400"
          }`}
        />
        <button
          type="submit"
          className={`inline-flex h-11 shrink-0 items-center gap-2 rounded-xl px-4 text-sm font-bold transition ${
            dark ? "bg-amber-300 text-indigo-950 hover:bg-amber-200" : "bg-plus text-white hover:bg-plus/90"
          }`}
        >
          <Bell className="size-4" aria-hidden="true" /> Notify me
        </button>
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className={`mt-2 text-sm ${dark ? "text-red-200" : "text-red-600"}`}>
          {error}
        </p>
      )}
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

function MembershipCard() {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, rotate: -8, y: 24 }}
      animate={{ opacity: 1, rotate: -6, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
      whileHover={reduceMotion ? undefined : { rotate: -2, scale: 1.02 }}
      className="relative mx-auto aspect-[1.586] w-full max-w-sm overflow-hidden rounded-3xl bg-linear-to-br from-amber-200 via-amber-300 to-amber-500 p-6 text-indigo-950 shadow-2xl ring-1 ring-white/40"
      aria-hidden="true"
    >
      <div className="absolute -right-12 -top-12 size-48 rounded-full bg-white/25" />
      <div className="absolute -bottom-16 -left-10 size-44 rounded-full bg-amber-600/20" />
      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <img src={logo} alt="" className="size-8 rounded-lg bg-white p-0.5" />
            <span className="font-display text-lg font-extrabold">Pharmacy</span>
          </div>
          <Crown className="size-8" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-950/70">Member</p>
          <p className="font-display text-4xl font-extrabold tracking-tight">PLUS</p>
          <p className="mt-1 text-sm font-semibold">10% off · Free delivery · Unlimited offers</p>
        </div>
      </div>
      <BorderBeam size={140} duration={8} borderWidth={2} colorFrom="#ffffff" colorTo="#4338ca" />
    </motion.div>
  );
}

function PlusHero() {
  return (
    <section className="container-page pt-4 sm:pt-6">
      <div className="relative isolate overflow-hidden rounded-3xl bg-linear-to-br from-indigo-950 via-plus to-violet-600 text-white">
        <Crown aria-hidden="true" className="absolute -left-10 -top-12 -z-10 size-64 -rotate-12 text-white/[0.05]" />
        <div aria-hidden="true" className="absolute -bottom-24 right-0 -z-10 size-96 rounded-full bg-violet-400/30 blur-3xl" />

        <div className="grid grid-cols-1 items-center gap-10 p-6 sm:p-10 lg:grid-cols-[1.2fr_1fr] lg:p-14">
          <div className="min-w-0">
            <Breadcrumb className="mb-5">
              <BreadcrumbList className="text-white/60">
                <BreadcrumbItem>
                  <BreadcrumbLink asChild className="hover:text-white">
                    <Link to="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-white">PLUS</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-300 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-indigo-950">
              <Crown className="size-3.5" aria-hidden="true" /> PLUS membership
            </span>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-white sm:text-5xl">
              Unlock benefits as a PLUS member
            </h1>
            <p className="mt-3 max-w-lg text-lg text-white/80">
              Get your medicines at a 10% discount with free delivery, unlimited offers and more.
            </p>
            <ul className="mt-6 grid max-w-lg gap-2 sm:grid-cols-2">
              {plusBenefits.map((benefit) => (
                <li key={benefit.title} className="flex items-center gap-2 text-sm font-medium text-white/90">
                  <span className="grid size-5 place-items-center rounded-full bg-amber-300 text-indigo-950">
                    <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
                  </span>
                  {benefit.title}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <p className="mb-2 text-sm font-semibold text-white/80">Sign-up opens soon. Get notified first:</p>
              <NotifyForm id="plus-notify-hero" dark />
            </div>
          </div>
          <div className="px-4 pb-4 sm:px-10 lg:px-0">
            <MembershipCard />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Benefits                                                            */
/* ------------------------------------------------------------------ */

function Benefits() {
  return (
    <section className="container-page mt-14">
      <SectionHeading title="What you get with PLUS" description="Benefits that apply on every order." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {plusBenefits.map((benefit, i) => {
          const Icon = benefitIcons[i];
          return (
            <Reveal
              key={benefit.title}
              delay={i * 0.06}
              className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:border-plus/30 hover:shadow-lift"
            >
              <span className="grid size-12 place-items-center rounded-2xl bg-plus-soft text-plus transition group-hover:bg-plus group-hover:text-white">
                <Icon className="size-6" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-lg font-bold">{benefit.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{benefit.detail}</p>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Savings calculator                                                  */
/* ------------------------------------------------------------------ */

const MIN_SPEND = 500;
const MAX_SPEND = 10000;

function SavingsCalculator() {
  const [spend, setSpend] = useState(2000);
  const { subtotal, count } = useCart();
  const monthly = spend * PLUS_DISCOUNT;
  const yearly = monthly * 12;

  return (
    <section className="container-page mt-14">
      <Reveal className="grid overflow-hidden rounded-3xl border border-plus/15 bg-plus-soft lg:grid-cols-[1.2fr_1fr]">
        <div className="p-6 sm:p-10">
          <h2 className="text-2xl font-bold sm:text-3xl">How much could you save?</h2>
          <p className="mt-1 text-slate-600">Move the slider to your usual monthly spend on medicines.</p>

          <div className="mt-8">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-semibold text-slate-700">Monthly medicine spend</span>
              <output aria-live="polite" className="font-display text-2xl font-extrabold text-ink tabular-nums">
                {formatRupees(spend)}
              </output>
            </div>
            <Slider
              id="monthly-spend"
              aria-label="Monthly medicine spend"
              tone="plus"
              min={MIN_SPEND}
              max={MAX_SPEND}
              step={100}
              value={[spend]}
              onValueChange={([next]) => setSpend(next)}
              className="mt-5"
            />
            <div className="mt-2 flex justify-between text-xs text-slate-500">
              <span>{formatRupees(MIN_SPEND)}</span>
              <span>{formatRupees(MAX_SPEND)}</span>
            </div>
          </div>

          {count > 0 && (
            <Link
              to="/cart"
              className="mt-6 flex items-center gap-3 rounded-xl bg-white p-3 text-sm text-slate-700 shadow-card transition hover:ring-1 hover:ring-plus/30"
            >
              <ShoppingCart className="size-5 shrink-0 text-plus" aria-hidden="true" />
              <span className="flex-1">
                Your current cart would save{" "}
                <strong className="text-plus">{formatPrice(subtotal - plusPrice(subtotal))}</strong>
              </span>
              <ArrowRight className="size-4 text-slate-400" aria-hidden="true" />
            </Link>
          )}
        </div>

        <div className="flex flex-col justify-center gap-4 bg-linear-to-br from-indigo-950 to-plus p-6 text-white sm:p-10">
          <div>
            <p className="text-sm font-semibold text-white/70">You save every month</p>
            <p className="font-display text-4xl font-extrabold text-amber-300 tabular-nums">
              <AnimatedNumber value={monthly} format={formatRupees} />
            </p>
          </div>
          <div className="border-t border-white/15 pt-4">
            <p className="text-sm font-semibold text-white/70">That&apos;s every year</p>
            <p className="font-display text-5xl font-extrabold text-white tabular-nums">
              <AnimatedNumber value={yearly} format={formatRupees} />
            </p>
          </div>
          <p className="text-xs text-white/60">Based on 10% off medicines. Delivery savings not included.</p>
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Member prices                                                       */
/* ------------------------------------------------------------------ */

function MemberPrices() {
  const examples = products.slice(0, 6);
  return (
    <section className="container-page mt-14">
      <SectionHeading
        title="Member prices on everyday medicines"
        action={
          <Link
            to="/medicine"
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-strong underline-offset-4 hover:underline"
          >
            Browse all <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        }
      />
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card">
        <div className="hidden grid-cols-[1fr_8rem_8rem_7rem] gap-4 border-b bg-canvas px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 sm:grid">
          <span>Medicine</span>
          <span className="text-right">Regular</span>
          <span className="text-right">With PLUS</span>
          <span className="text-right">You save</span>
        </div>
        <ul className="divide-y">
          {examples.map((product) => (
            <li
              key={product.id}
              className="grid grid-cols-[auto_1fr_auto] items-center gap-x-3 gap-y-1 px-4 py-3 sm:grid-cols-[1fr_8rem_8rem_7rem] sm:gap-4 sm:px-5"
            >
              <div className="col-span-2 flex items-center gap-3 sm:col-span-1">
                <ProductIcon form={product.form} className="size-11 shrink-0 [&>svg]:size-1/2" />
                <div className="min-w-0">
                  <p className="font-bold text-slate-900">{product.name}</p>
                  <p className="text-xs text-slate-500">
                    {product.description} · {product.unit}
                  </p>
                </div>
              </div>
              <span className="row-span-2 text-right text-sm text-slate-400 line-through tabular-nums sm:row-span-1 sm:text-slate-600 sm:no-underline">
                {formatPrice(product.price)}
              </span>
              <span className="col-start-2 text-sm font-extrabold text-plus tabular-nums sm:col-start-auto sm:text-right">
                {formatPrice(plusPrice(product.price))}
              </span>
              <span className="hidden text-right sm:block">
                <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 tabular-nums">
                  {formatPrice(product.price - plusPrice(product.price))}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ + final CTA                                                     */
/* ------------------------------------------------------------------ */

/** New copy for owner review. */
const plusFaqs = [
  {
    question: "When can I join PLUS?",
    answer:
      "PLUS sign-up is opening soon. Leave your email on this page and we'll let you know as soon as you can join.",
  },
  {
    question: "Which products get the 10% discount?",
    answer: "The PLUS discount applies to medicines. Member prices are shown on every medicine in the store.",
  },
  {
    question: "Can I use PLUS with offer codes like PHARMA10?",
    answer: "Details on combining PLUS with offer codes will be shared when membership opens. T&C apply.",
  },
];

function PlusFaq() {
  return (
    <section className="container-page mt-14">
      <div className="grid gap-6 lg:grid-cols-[1fr_2fr] lg:gap-12">
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">PLUS questions</h2>
          <p className="mt-2 text-slate-600">Everything you need to know about the membership.</p>
        </div>
        <FaqAccordion items={plusFaqs} tone="plus" />
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="container-page mt-14">
      <Reveal className="flex flex-col items-center rounded-3xl border border-plus/15 bg-white px-6 py-12 text-center shadow-card">
        <span className="grid size-14 place-items-center rounded-2xl bg-amber-300 text-indigo-950">
          <Crown className="size-7" aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-2xl font-extrabold sm:text-3xl">Be the first to join PLUS</h2>
        <p className="mt-2 max-w-md text-slate-600">
          Membership sign-up is opening soon. Leave your email and start saving on every order from day one.
        </p>
        <div className="mt-6 flex w-full justify-center">
          <NotifyForm id="plus-notify-footer" />
        </div>
      </Reveal>
    </section>
  );
}

export default function Plus() {
  usePageTitle("PLUS membership");
  return (
    <>
      <PlusHero />
      <Benefits />
      <SavingsCalculator />
      <MemberPrices />
      <PlusFaq />
      <FinalCta />
    </>
  );
}
