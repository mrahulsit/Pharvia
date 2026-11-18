import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link, useParams } from "react-router-dom";
import { FileText, PackageOpen, ShieldCheck, Truck } from "lucide-react";
import { ProductListing } from "@/components/product/ProductListing";
import { buttonVariants } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { CategoryGrid } from "@/components/home/Sections";
import { getCategory, products } from "@/data/catalog";
import { cn } from "@/lib/utils";
import { usePageTitle } from "@/lib/usePageTitle";
import NotFound from "@/pages/NotFound";

export default function Category() {
  const { slug } = useParams();
  const category = getCategory(slug ?? "");
  usePageTitle(category?.title ?? "Not found");

  if (!category) return <NotFound />;

  const items = products.filter((p) => p.category === category.slug);

  return (
    <>
      <section className="container-page pt-4 sm:pt-6">
        <div className={cn("relative overflow-hidden rounded-3xl", category.tint)}>
          <div className="grid items-center gap-6 p-6 sm:grid-cols-[1fr_auto] sm:p-10">
            <div>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/">Home</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{category.title}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <h1 className={cn("mt-3 text-3xl font-extrabold sm:text-4xl", category.accent)}>{category.title}</h1>
              <p className="mt-2 max-w-xl text-slate-700">{category.description}</p>
              <ul className="mt-5 flex flex-wrap gap-2 text-sm">
                {[
                  { Icon: ShieldCheck, label: "100% genuine" },
                  { Icon: Truck, label: "Home delivery" },
                ].map(({ Icon, label }) => (
                  <li key={label} className="flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 font-medium text-slate-700">
                    <Icon className="size-4 text-brand-strong" aria-hidden="true" /> {label}
                  </li>
                ))}
              </ul>
            </div>
            <img
              src={category.image}
              alt=""
              className="hidden size-44 rotate-3 rounded-3xl object-cover shadow-lift ring-8 ring-white sm:block lg:size-52"
            />
          </div>
        </div>
      </section>

      <section className="container-page mt-8">
        {items.length ? (
          <ProductListing products={items} heading={`All ${category.title}`} />
        ) : (
          <Empty className="bg-canvas">
            <EmptyHeader>
              <EmptyMedia variant="icon" className={category.tint}>
                <PackageOpen className={category.accent} aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>{category.title} products are coming soon</EmptyTitle>
              <EmptyDescription>
                In the meantime, browse our must-have medicines or upload a prescription and we&apos;ll arrange
                what you need.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Link to="/category/musthave" className={buttonVariants({ variant: "outline" })}>
                Shop must haves
              </Link>
              <Link to="/upload-prescription" className={buttonVariants()}>
                <FileText /> Upload prescription
              </Link>
            </EmptyContent>
          </Empty>
        )}
      </section>

      <CategoryGrid exclude={category.slug} title="Explore other categories" />
    </>
  );
}
