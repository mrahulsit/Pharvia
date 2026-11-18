import { useEffect } from "react";
import { Hero } from "@/components/home/Hero";
import {
  CategoryGrid,
  FaqSection,
  MustHaveRail,
  PlusBanner,
  ProcessSection,
  PromoSection,
  QuickLinks,
  TrustStrip,
  WhyUs,
} from "@/components/home/Sections";

export default function Home() {
  useEffect(() => {
    document.title = "Pharmacy — at every step";
  }, []);

  return (
    <>
      <Hero />
      <QuickLinks />
      <PromoSection />
      <TrustStrip />
      <MustHaveRail />
      <CategoryGrid />
      <ProcessSection />
      <PlusBanner />
      <WhyUs />
      <FaqSection />
    </>
  );
}
