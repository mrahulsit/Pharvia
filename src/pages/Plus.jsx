import { BadgePercent, Crown, Gift, Sparkles, Truck } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { plusBenefits } from "@/data/site";
import { usePageTitle } from "@/lib/usePageTitle";
import plusBanner from "@/assets/img/plus-banner.webp";
import plusBannerMobile from "@/assets/img/plus-banner-mobile.webp";

const icons = [BadgePercent, Truck, Gift, Sparkles];

export default function Plus() {
  usePageTitle("PLUS membership");
  return (
    <>
      <PageHeader
        crumbs={[{ label: "PLUS" }]}
        title="Unlock benefits as a PLUS member"
        description="Enjoy unlimited offers on every order."
      />

      <section className="container-page mt-10">
        <Reveal className="overflow-hidden rounded-3xl shadow-soft">
          <picture>
            <source media="(min-width: 768px)" srcSet={plusBanner} />
            <img
              src={plusBannerMobile}
              alt="Unlock benefits as a PLUS member. Get your medicines at 10% discount with free delivery, great offers and more."
              className="w-full"
            />
          </picture>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {plusBenefits.map((benefit, i) => {
            const Icon = icons[i];
            return (
              <Reveal key={benefit.title} delay={i * 0.06} className="rounded-3xl border bg-white p-6">
                <span className="grid size-12 place-items-center rounded-2xl bg-linear-to-br from-blue-600 to-purple-500 text-white">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <h2 className="mt-4 text-lg font-bold">{benefit.title}</h2>
                <p className="mt-1 text-sm text-slate-600">{benefit.detail}</p>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-10 flex flex-col items-center rounded-3xl bg-slate-950 px-6 py-12 text-center text-white">
          <Crown className="size-10 text-yellow-300" aria-hidden="true" />
          <h2 className="mt-4 text-2xl font-extrabold text-white sm:text-3xl">Become a PLUS member</h2>
          <p className="mt-2 max-w-md text-white/70">
            PLUS membership sign-up is opening soon. Check back to start saving on every order.
          </p>
          <Button
            variant="white"
            size="lg"
            className="mt-6"
            onClick={() => toast.info("PLUS membership sign-up opens soon.")}
          >
            Notify me
          </Button>
        </Reveal>
      </section>
    </>
  );
}
