import { Link } from "react-router-dom";
import { ArrowLeft, SearchX } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { usePageTitle } from "@/lib/usePageTitle";

export default function NotFound() {
  usePageTitle("Page not found");
  return (
    <section className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span className="grid size-20 place-items-center rounded-full bg-brand-soft text-brand-strong">
        <SearchX className="size-9" aria-hidden="true" />
      </span>
      <p className="mt-6 font-display text-sm font-bold uppercase tracking-widest text-accent">404</p>
      <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">We couldn&apos;t find that page</h1>
      <p className="mt-2 max-w-md text-slate-600">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className={buttonVariants()}>
          <ArrowLeft /> Back to home
        </Link>
        <Link to="/medicine" className={buttonVariants({ variant: "outline" })}>
          Browse medicines
        </Link>
      </div>
    </section>
  );
}
