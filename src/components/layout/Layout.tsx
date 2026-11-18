import { Suspense, useEffect, type ReactNode } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { PincodeSheet } from "./PincodeSheet";
import { KineticTextLoader } from "@/components/ui/kinetic-text-loader";
import logo from "@/assets/PHARMACY.png";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

export function PageLoader() {
  return (
    <div className="grid min-h-[60vh] place-items-center" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-4">
        <motion.img
          src={logo}
          alt=""
          className="size-14"
          animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <KineticTextLoader
          text="Pharmacy"
          className="scale-50 sm:scale-60"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

export function Layout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only z-200 rounded-lg bg-brand-strong px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <ScrollToTop />
      <SiteHeader />
      <main id="main" className="flex-1 pb-4">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <SiteFooter />
      <PincodeSheet />
    </div>
  );
}

interface Crumb {
  label: string;
  to?: string;
}

interface PageHeaderProps {
  crumbs?: Crumb[];
  title: string;
  description?: string;
  children?: ReactNode;
}

/** Breadcrumb + title block used at the top of inner pages. */
export function PageHeader({ crumbs = [], title, description, children }: PageHeaderProps) {
  return (
    <section className="border-b border-slate-200/80 bg-white">
      <div className="container-page py-5 sm:py-7">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1 text-xs text-slate-500 sm:text-sm">
            <li>
              <Link to="/" className="hover:text-brand-strong">
                Home
              </Link>
            </li>
            {crumbs.map((crumb) => (
              <li key={crumb.label} className="flex items-center gap-1">
                <ChevronRight className="size-3.5" aria-hidden="true" />
                {crumb.to ? (
                  <Link to={crumb.to} className="hover:text-brand-strong">
                    {crumb.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="font-medium text-slate-700">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <h1 className="mt-2 text-2xl font-extrabold text-ink sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-slate-600">{description}</p>}
        {children}
      </div>
    </section>
  );
}
