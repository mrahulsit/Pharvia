import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FileText, PackageSearch, Percent, Search, ShieldCheck, Truck, X } from "lucide-react";
import { PageHeader } from "@/components/layout/Layout";
import { DeliveryChip } from "@/components/layout/DeliveryChip";
import { ProductGrid } from "@/components/product/ProductCard";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { searchProducts } from "@/data/catalog";
import { usePageTitle } from "@/lib/usePageTitle";

const badges = [
  { Icon: ShieldCheck, label: "100% genuine products" },
  { Icon: Percent, label: "Discounted products" },
  { Icon: Truck, label: "Home delivery" },
];

export default function Medicine() {
  usePageTitle("Order medicines online");
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";
  const results = useMemo(() => searchProducts(query), [query]);

  const setQuery = (value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set("q", value);
    else next.delete("q");
    setParams(next, { replace: true });
  };

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Medicine" }]}
        title="Order medicines online"
        description="Search for medicines or healthcare products."
      >
        <div className="mt-5 flex flex-wrap gap-2">
          {badges.map(({ Icon, label }) => (
            <Badge key={label} tone="white">
              <Icon /> {label}
            </Badge>
          ))}
        </div>

        <div className="mt-6 flex max-w-3xl flex-col gap-2 rounded-2xl border bg-white p-2 shadow-soft sm:flex-row sm:items-center">
          <DeliveryChip className="sm:w-56 sm:shrink-0" />
          <span className="hidden h-8 w-px bg-slate-200 sm:block" aria-hidden="true" />
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
            <label htmlFor="medicine-search" className="sr-only">
              Search medicines
            </label>
            <input
              id="medicine-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search for medicines / healthcare products"
              className="h-11 w-full rounded-xl bg-transparent pl-11 pr-10 text-sm focus:bg-slate-50 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>
      </PageHeader>

      <section className="container-page mt-10">
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-xl font-bold">
            {query ? `Results for “${query}”` : "Medicines you must have"}
          </h2>
          <p className="text-sm text-slate-500" aria-live="polite">
            {results.length} {results.length === 1 ? "product" : "products"}
          </p>
        </div>

        {results.length ? (
          <ProductGrid products={results} />
        ) : (
          <div className="flex flex-col items-center rounded-3xl border border-dashed bg-surface px-6 py-16 text-center">
            <PackageSearch className="size-12 text-slate-300" aria-hidden="true" />
            <h3 className="mt-4 text-lg font-bold">No products match “{query}”</h3>
            <p className="mt-1 max-w-md text-sm text-slate-600">
              Try another name, or upload your prescription and we&apos;ll find your medicines for you.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={() => setQuery("")} className={buttonVariants({ variant: "outline" })}>
                Clear search
              </button>
              <Link to="/upload-prescription" className={buttonVariants()}>
                <FileText /> Upload prescription
              </Link>
            </div>
          </div>
        )}
      </section>

      <section className="container-page mt-16">
        <Reveal className="flex flex-col items-start justify-between gap-4 rounded-3xl bg-brand-50 p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <h2 className="text-xl font-bold">Have a prescription?</h2>
            <p className="mt-1 text-slate-600">Upload it and we&apos;ll confirm your medicines by call.</p>
          </div>
          <Link to="/upload-prescription" className={buttonVariants()}>
            <FileText /> Upload prescription
          </Link>
        </Reveal>
      </section>
    </>
  );
}
