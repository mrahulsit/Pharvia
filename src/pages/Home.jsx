import { useEffect } from "react";
import { Hero } from "@/components/home/Hero";
import {
  AppSection,
  CategoryGrid,
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
      <TrustStrip />
      <QuickLinks />
      <PromoSection />
      <ProcessSection />
      <CategoryGrid />
      <WhyUs />
      <PlusBanner />
      <AppSection />
    </>
  );
}
