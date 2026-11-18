import { Link, useParams } from "react-router-dom";
import { FileText, PackageOpen } from "lucide-react";
import { ProductGrid } from "@/components/product/ProductCard";
import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { CategoryGrid } from "@/components/home/Sections";
import { getCategory, products } from "@/data/catalog";
import { usePageTitle } from "@/lib/usePageTitle";
import NotFound from "@/pages/NotFound";
import { ChevronRight } from "lucide-react";

export default function Category() {
  const { slug } = useParams();
  const category = getCategory(slug ?? "");
  usePageTitle(category?.title ?? "Not found");

  if (!category) return <NotFound />;

  const items = products.filter((p) => p.category === category.slug);

  return (
    <>
      <section className="relative isolate overflow-hidden bg-slate-950">
        <img
          src={category.image}
          alt=""
          className="absolute inset-0 -z-10 size-full object-cover opacity-50"
        />
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-slate-950 via-slate-950/70 to-transparent" />
        <div className="container-page py-14 sm:py-20">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-1 text-sm text-white/60">
              <li>
                <Link to="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li className="flex items-center gap-1">
                <ChevronRight className="size-3.5" aria-hidden="true" />
                <span aria-current="page" className="font-medium text-white">
                  {category.title}
                </span>
              </li>
            </ol>
          </nav>
          <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-5xl">{category.title}</h1>
          <p className="mt-3 max-w-xl text-white/80">{category.description}</p>
        </div>
      </section>

      <section className="container-page mt-10">
        {items.length ? (
          <>
            <p className="mb-5 text-sm text-slate-500">
              {items.length} {items.length === 1 ? "product" : "products"}
            </p>
            <ProductGrid products={items} />
          </>
        ) : (
          <Reveal className="flex flex-col items-center rounded-3xl border border-dashed bg-surface px-6 py-16 text-center">
            <PackageOpen className="size-12 text-slate-300" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-bold">{category.title} products are coming soon</h2>
            <p className="mt-1 max-w-md text-sm text-slate-600">
              In the meantime, browse our must-have medicines or upload a prescription and we&apos;ll
              arrange what you need.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/category/musthave" className={buttonVariants({ variant: "outline" })}>
                Shop must haves
              </Link>
              <Link to="/upload-prescription" className={buttonVariants()}>
                <FileText /> Upload prescription
              </Link>
            </div>
          </Reveal>
        )}
      </section>

      <CategoryGrid exclude={category.slug} title="Explore other categories" />
    </>
  );
}
