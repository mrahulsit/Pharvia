import { useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDownAZ,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  ChevronDown,
  Crown,
  FileText,
  PackageSearch,
  SlidersHorizontal,
  Sparkles,
  X,
  type LucideIcon,
} from "lucide-react";
import { ProductGrid } from "./ProductCard";
import { buttonVariants } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formLabels, type Product } from "@/data/catalog";
import { cn } from "@/lib/utils";

type SortKey = "relevance" | "price-asc" | "price-desc" | "name";

const sortOptions: { value: SortKey; label: string; Icon: LucideIcon }[] = [
  { value: "relevance", label: "Relevance", Icon: Sparkles },
  { value: "price-asc", label: "Price: low to high", Icon: ArrowUpNarrowWide },
  { value: "price-desc", label: "Price: high to low", Icon: ArrowDownWideNarrow },
  { value: "name", label: "Name: A to Z", Icon: ArrowDownAZ },
];

const sorters: Record<SortKey, ((a: Product, b: Product) => number) | null> = {
  relevance: null,
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  name: (a, b) => a.name.localeCompare(b.name),
};

interface ProductListingProps {
  products: Product[];
  heading: string;
  /** Shown instead of the grid when nothing matches. */
  empty?: ReactNode;
  onClearQuery?: () => void;
}

export function ProductListing({ products, heading, empty, onClearQuery }: ProductListingProps) {
  const [forms, setForms] = useState<string[]>([]);
  const [sort, setSort] = useState<SortKey>("relevance");

  const availableForms = useMemo(
    () => [...new Set(products.map((p) => p.form))].sort(),
    [products]
  );

  const visible = useMemo(() => {
    const filtered = forms.length ? products.filter((p) => forms.includes(p.form)) : products;
    const sorter = sorters[sort];
    return sorter ? [...filtered].sort(sorter) : filtered;
  }, [products, forms, sort]);

  const activeSort = sortOptions.find((option) => option.value === sort) ?? sortOptions[0];
  const ActiveSortIcon = activeSort.Icon;

  const toggleForm = (form: string) =>
    setForms((current) => (current.includes(form) ? current.filter((f) => f !== form) : [...current, form]));

  const filterChips = (
    <div className="flex flex-wrap gap-2">
      {availableForms.map((form) => {
        const active = forms.includes(form);
        return (
          <button
            key={form}
            type="button"
            aria-pressed={active}
            onClick={() => toggleForm(form)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm font-medium transition",
              active
                ? "border-brand-strong bg-brand-strong text-white"
                : "border-slate-200 bg-white text-slate-700 hover:border-brand/50"
            )}
          >
            {formLabels[form] ?? form}
            <span className={cn("ml-1.5 text-xs", active ? "text-white/75" : "text-slate-400")}>
              {products.filter((p) => p.form === form).length}
            </span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[15rem_1fr] lg:gap-8">
      {/* Sidebar (desktop) */}
      <aside className="sticky top-36 hidden space-y-4 lg:block" aria-label="Filters">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-bold">
              <SlidersHorizontal className="size-4" aria-hidden="true" /> Filters
            </h2>
            {forms.length > 0 && (
              <button type="button" onClick={() => setForms([])} className="text-xs font-semibold text-brand-strong hover:underline">
                Clear
              </button>
            )}
          </div>
          {availableForms.length > 0 ? (
          <fieldset className="mt-4">
            <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Product form</legend>
            <div className="space-y-1">
              {availableForms.map((form) => (
                <label
                  key={form}
                  className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1.5 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <input
                    type="checkbox"
                    checked={forms.includes(form)}
                    onChange={() => toggleForm(form)}
                    className="size-4 accent-brand-strong"
                  />
                  <span className="flex-1">{formLabels[form] ?? form}</span>
                  <span className="text-xs text-slate-400">{products.filter((p) => p.form === form).length}</span>
                </label>
              ))}
            </div>
          </fieldset>
          ) : (
            <p className="mt-3 text-sm text-slate-500">No filters for these results.</p>
          )}
        </div>

        <Link
          to="/plus"
          className="block rounded-2xl bg-plus-soft p-4 transition hover:ring-1 hover:ring-plus/30"
        >
          <Crown className="size-5 text-plus" aria-hidden="true" />
          <p className="mt-2 text-sm font-bold text-slate-900">Save 10% with PLUS</p>
          <p className="mt-0.5 text-xs text-slate-600">Member prices are shown on every product.</p>
        </Link>

        <Link
          to="/upload-prescription"
          className="block rounded-2xl border border-dashed border-brand/40 bg-brand-50 p-4 transition hover:border-brand-strong"
        >
          <FileText className="size-5 text-brand-strong" aria-hidden="true" />
          <p className="mt-2 text-sm font-bold text-slate-900">Can&apos;t find it?</p>
          <p className="mt-0.5 text-xs text-slate-600">Upload your prescription and we&apos;ll arrange it.</p>
        </Link>
      </aside>

      <div className="min-w-0">
        {/* Toolbar */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold sm:text-xl">{heading}</h2>
            <p className="text-sm text-slate-500" aria-live="polite">
              Showing {visible.length} of {products.length} {products.length === 1 ? "product" : "products"}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span id="sort-label" className="hidden sm:inline">
              Sort by
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-labelledby="sort-label sort-value"
                className="group flex h-10 w-[12.5rem] items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 shadow-card transition hover:border-slate-300 focus-visible:border-brand-strong focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/15 data-[state=open]:border-brand-strong data-[state=open]:ring-4 data-[state=open]:ring-brand/15"
              >
                <span id="sort-value" className="flex min-w-0 items-center gap-2">
                  <ActiveSortIcon className="size-4 shrink-0 text-slate-400" aria-hidden="true" />
                  <span className="truncate">{activeSort.label}</span>
                </span>
                <ChevronDown
                  className="size-4 shrink-0 text-slate-400 transition-transform duration-200 group-data-[state=open]:rotate-180 group-data-[state=open]:text-brand-strong"
                  aria-hidden="true"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Sort products</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={sort} onValueChange={(value) => setSort(value as SortKey)}>
                  {sortOptions.map(({ value, label, Icon }) => (
                    <DropdownMenuRadioItem key={value} value={value}>
                      <Icon aria-hidden="true" />
                      {label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {availableForms.length > 1 && <div className="mb-5 lg:hidden">{filterChips}</div>}

        {forms.length > 0 && (
          <div className="mb-4 hidden flex-wrap items-center gap-2 lg:flex">
            {forms.map((form) => (
              <button
                key={form}
                type="button"
                onClick={() => toggleForm(form)}
                className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand-strong"
              >
                {formLabels[form] ?? form} <X className="size-3" aria-label="Remove filter" />
              </button>
            ))}
          </div>
        )}

        {visible.length ? (
          <ProductGrid products={visible} className="xl:grid-cols-4" />
        ) : (
          empty ?? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <PackageSearch aria-hidden="true" />
                </EmptyMedia>
                <EmptyTitle>No matching products</EmptyTitle>
                <EmptyDescription>
                  Try another name, or upload your prescription and we&apos;ll find your medicines for you.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                {(forms.length > 0 || onClearQuery) && (
                  <button
                    type="button"
                    onClick={() => {
                      setForms([]);
                      onClearQuery?.();
                    }}
                    className={buttonVariants({ variant: "outline" })}
                  >
                    Clear search & filters
                  </button>
                )}
                <Link to="/upload-prescription" className={buttonVariants()}>
                  <FileText /> Upload prescription
                </Link>
              </EmptyContent>
            </Empty>
          )
        )}
      </div>
    </div>
  );
}
