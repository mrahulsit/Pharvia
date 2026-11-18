import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Percent, Search, ShieldCheck, Truck, X } from "lucide-react";
import { PageHeader } from "@/components/layout/Layout";
import { ProductListing } from "@/components/product/ProductListing";
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
      <PageHeader crumbs={[{ label: "Medicine" }]} title="Order medicines online">
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-xl">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <label htmlFor="medicine-search" className="sr-only">
              Search medicines
            </label>
            <input
              id="medicine-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search for medicines / healthcare products"
              className="h-12 w-full rounded-xl border border-slate-200 bg-canvas pl-11 pr-10 text-sm transition focus:border-brand-strong focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand/15 [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
            {badges.map(({ Icon, label }) => (
              <li key={label} className="flex items-center gap-1.5">
                <Icon className="size-4 text-brand-strong" aria-hidden="true" /> {label}
              </li>
            ))}
          </ul>
        </div>
      </PageHeader>

      <section className="bg-canvas py-8">
        <div className="container-page">
          <ProductListing
            key={query}
            products={results}
            heading={query ? `Results for “${query}”` : "Medicines you must have"}
            onClearQuery={query ? () => setQuery("") : undefined}
          />
        </div>
      </section>
    </>
  );
}
