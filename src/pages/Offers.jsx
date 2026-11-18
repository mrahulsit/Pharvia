/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { ArrowRight, Copy, Crown, TicketPercent } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { offers } from "@/data/site";
import { usePageTitle } from "@/lib/usePageTitle";
import promoPharma10 from "@/assets/img/promo-pharma10.webp";

async function copyCode(code) {
  try {
    await navigator.clipboard.writeText(code);
    toast.success(`Code ${code} copied`);
  } catch {
    toast.info(`Your code is ${code}`);
  }
}

export function OfferCard({ offer }) {
  return (
    <Reveal className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-3xl border bg-white p-6 sm:flex-row sm:items-center">
      <div className="absolute -left-3 top-1/2 hidden size-6 -translate-y-1/2 rounded-full border bg-white sm:block" aria-hidden="true" />
      <div className="flex items-start gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-soft text-brand-strong">
          <TicketPercent className="size-6" aria-hidden="true" />
        </span>
        <div>
          <h3 className="text-lg font-bold">{offer.title}</h3>
          <p className="text-sm text-slate-600">{offer.detail}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:flex-col sm:items-end">
        <span className="rounded-xl border-2 border-dashed border-brand/50 bg-brand-50 px-3 py-1.5 font-mono text-sm font-bold tracking-wider text-brand-strong">
          {offer.code}
        </span>
        <Button variant="ghost" size="sm" onClick={() => copyCode(offer.code)}>
          <Copy /> Copy code
        </Button>
      </div>
    </Reveal>
  );
}

export default function Offers() {
  usePageTitle("Offers");
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Offers" }]}
        title="Offers just for you"
        description="Apply these codes at checkout. T&C apply."
      />
      <section className="container-page mt-10 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <Reveal className="overflow-hidden rounded-3xl shadow-soft">
          <img
            src={promoPharma10}
            alt="Buy health care products: flat 10% off on any medicine plus guaranteed benefits up to ₹1000 on any order. Code PHARMA10."
            width="800"
            height="400"
            className="w-full"
          />
        </Reveal>
        <div className="grid content-start gap-4">
          {offers.map((offer) => (
            <OfferCard key={offer.code} offer={offer} />
          ))}
          <Reveal>
            <Link
              to="/plus"
              className="group flex items-center gap-4 rounded-3xl bg-linear-to-br from-blue-600 to-purple-500 p-6 text-white"
            >
              <Crown className="size-10 shrink-0 text-yellow-300" aria-hidden="true" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white">PLUS members save more</h3>
                <p className="text-sm text-white/80">10% off medicines with free delivery on every order.</p>
              </div>
              <ArrowRight className="size-5 transition group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
