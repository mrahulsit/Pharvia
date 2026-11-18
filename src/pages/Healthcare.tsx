import { Link } from "react-router-dom";
import { ArrowRight, BadgePercent, FileText, Package, RefreshCcw, Stethoscope } from "lucide-react";
import { PageHeader } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Reveal, SectionHeading } from "@/components/ui/reveal";
import { CategoryGrid, WhyUs } from "@/components/home/Sections";
import { OfferCard } from "@/pages/Offers";
import { offers } from "@/data/site";
import { usePageTitle } from "@/lib/usePageTitle";

const badges = [
  { Icon: BadgePercent, label: "Flat 15% off" },
  { Icon: Package, label: "1 Lakh+ products" },
  { Icon: RefreshCcw, label: "Easy return" },
];

const paths = [
  {
    to: "/upload-prescription",
    Icon: FileText,
    title: "Order via prescription",
    text: "Upload a photo and we'll confirm your medicines by call.",
  },
  {
    to: "/medicine",
    Icon: Stethoscope,
    title: "Don't have a prescription?",
    text: "Browse and order healthcare products directly.",
  },
];

export default function Healthcare() {
  usePageTitle("Healthcare");
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Healthcare" }]}
        title="Order medicine online"
        description="Everything for your health, from everyday essentials to prescription medicines."
      >
        <div className="mt-5 flex flex-wrap gap-2">
          {badges.map(({ Icon, label }) => (
            <Badge key={label} tone="white">
              <Icon /> {label}
            </Badge>
          ))}
        </div>
      </PageHeader>

      <section className="container-page mt-10 grid gap-4 md:grid-cols-2">
        {paths.map(({ to, Icon, title, text }, i) => (
          <Reveal key={to} delay={i * 0.08}>
            <Link
              to={to}
              className="group flex h-full items-center gap-5 rounded-3xl border bg-white p-6 transition hover:border-brand/40 hover:shadow-lift"
            >
              <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-brand-soft text-brand-strong">
                <Icon className="size-7" aria-hidden="true" />
              </span>
              <span className="flex-1">
                <span className="block text-lg font-bold">{title}</span>
                <span className="block text-sm text-slate-600">{text}</span>
              </span>
              <ArrowRight className="size-5 text-slate-400 transition group-hover:translate-x-1 group-hover:text-brand-strong" />
            </Link>
          </Reveal>
        ))}
      </section>

      <section className="container-page mt-20">
        <SectionHeading eyebrow="Offers" title="Offers just for you" />
        <div className="grid gap-4 md:grid-cols-2">
          {offers.map((offer) => (
            <OfferCard key={offer.code} offer={offer} />
          ))}
        </div>
      </section>

      <CategoryGrid />
      <WhyUs />
    </>
  );
}
