import { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  BadgePercent,
  ChevronDown,
  Crown,
  FileText,
  LayoutGrid,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  ShoppingCart,
  Truck,
  User,
} from "lucide-react";
import { Logo } from "./Logo";
import { DeliveryChip } from "./DeliveryChip";
import { Sheet } from "@/components/ui/sheet";
import { Button, buttonVariants } from "@/components/ui/button";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { SearchModal, type SearchResult } from "@/components/ui/search-modal";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { categories, searchProducts } from "@/data/catalog";
import { navLinks, searchPhrases } from "@/data/site";
import { cn, formatPrice } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Search trigger: looks like an input, opens the ⌘K search modal      */
/* ------------------------------------------------------------------ */

function SearchTrigger({ onOpen, className }: { onOpen: () => void; className?: string }) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % searchPhrases.length), 2800);
    return () => clearInterval(id);
  }, [reduceMotion]);

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Search medicines and healthcare products"
      className={cn(
        "group flex h-11 w-full min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-canvas px-3.5 text-left text-sm text-slate-500 transition hover:border-brand/40 hover:bg-white",
        className
      )}
    >
      <Search className="size-[18px] shrink-0 text-slate-400 group-hover:text-brand-strong" aria-hidden="true" />
      <span className="relative h-5 flex-1 overflow-hidden" aria-hidden="true">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={index}
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -14, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute inset-0 truncate"
          >
            {searchPhrases[index]}
          </motion.span>
        </AnimatePresence>
      </span>
      <KbdGroup className="hidden shrink-0 lg:inline-flex">
        <Kbd>Ctrl</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* "All categories" mega menu                                          */
/* ------------------------------------------------------------------ */

function CategoriesMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node | null)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex h-11 shrink-0 items-center gap-2 whitespace-nowrap border-b-2 pr-4 text-sm font-semibold transition-colors",
          open ? "border-brand-strong text-brand-strong" : "border-transparent text-slate-800 hover:text-brand-strong"
        )}
      >
        <LayoutGrid className="size-4" aria-hidden="true" />
        All categories
        <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} aria-hidden="true" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.16 }}
            className="absolute left-0 top-full z-50 w-[min(46rem,92vw)] pt-1"
          >
            <div className="grid grid-cols-4 gap-1 rounded-2xl border bg-white p-2 shadow-lift">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  to={`/category/${category.slug}`}
                  className="group flex items-center gap-3 rounded-xl p-2 transition hover:bg-slate-50"
                >
                  <span className={cn("size-12 shrink-0 overflow-hidden rounded-xl", category.tint)}>
                    <img
                      src={category.image}
                      alt=""
                      loading="lazy"
                      className="size-full object-cover transition duration-300 group-hover:scale-110"
                    />
                  </span>
                  <span className="text-sm font-semibold leading-tight text-slate-800 group-hover:text-brand-strong">
                    {category.title}
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Cart + account                                                      */
/* ------------------------------------------------------------------ */

function CartButton() {
  const { count } = useCart();
  const { user, openAuth } = useAuth();
  return (
    <Link
      to="/cart"
      onClick={(event) => {
        // Logged-out visitors log in first; they land in the cart afterwards.
        if (user) return;
        event.preventDefault();
        openAuth({ mode: "login", reason: "cart", redirectTo: "/cart" });
      }}
      className="relative flex h-10 items-center gap-2 rounded-xl px-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
      aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`}
    >
      <span className="relative">
        <ShoppingCart className="size-5" aria-hidden="true" />
        <AnimatePresence>
          {count > 0 && (
            <motion.span
              key={count}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              className="absolute -right-2.5 -top-2 grid min-w-[18px] place-items-center rounded-full bg-offer px-1 text-[10px] font-bold leading-[18px] text-white ring-2 ring-white"
            >
              {count > 99 ? "99+" : count}
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      <span className="hidden lg:inline">Cart</span>
    </Link>
  );
}

function AccountButton() {
  const { user, logout, openAuth } = useAuth();
  if (!user) {
    return (
      <button
        type="button"
        onClick={() => openAuth({ mode: "login" })}
        className="flex h-10 items-center gap-2 rounded-xl px-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
      >
        <User className="size-5" aria-hidden="true" />
        <span className="hidden sm:inline">Log in</span>
      </button>
    );
  }
  return (
    <div className="flex items-center">
      <span className="hidden max-w-32 items-center gap-2 truncate px-2 text-sm font-semibold text-slate-800 sm:flex">
        <span className="grid size-7 place-items-center rounded-full bg-brand-soft text-xs font-bold uppercase text-brand-strong">
          {user.username.slice(0, 1)}
        </span>
        <span className="truncate">Hi, {user.username}</span>
      </span>
      <Button variant="ghost" size="icon-sm" onClick={logout} aria-label="Log out" title="Log out">
        <LogOut />
      </Button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile drawer                                                       */
/* ------------------------------------------------------------------ */

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user, logout, openAuth } = useAuth();
  return (
    <Sheet open={open} onClose={onClose} side="left" title="Menu">
      <div className="mb-6 rounded-2xl bg-brand-50 p-4">
        {user ? (
          <div className="flex items-center justify-between gap-3">
            <span className="font-semibold">Hi, {user.username}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                logout();
                onClose();
              }}
            >
              <LogOut /> Log out
            </Button>
          </div>
        ) : (
          <>
            <p className="font-semibold">Welcome to Pharmacy</p>
            <p className="mt-0.5 text-sm text-slate-600">Log in to keep your cart and check out faster.</p>
            <button
              type="button"
              onClick={() => {
                onClose();
                openAuth({ mode: "login" });
              }}
              className={cn(buttonVariants({ size: "sm" }), "mt-3 w-full")}
            >
              <User /> Log in or sign up
            </button>
          </>
        )}
      </div>

      <nav className="flex flex-col gap-0.5" aria-label="Mobile">
        {[...navLinks, { to: "/upload-prescription", label: "Upload prescription" }].map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                "rounded-xl px-3 py-2.5 text-[15px] font-medium",
                isActive ? "bg-brand-soft text-brand-strong" : "text-slate-700 hover:bg-slate-50"
              )
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <p className="mb-2 mt-6 px-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
        Shop by category
      </p>
      <div className="grid grid-cols-2 gap-2">
        {categories.map((category) => (
          <Link
            key={category.slug}
            to={`/category/${category.slug}`}
            onClick={onClose}
            className={cn(
              "flex items-center gap-2 rounded-xl p-2 text-sm font-medium text-slate-800 transition hover:ring-1 hover:ring-brand/30",
              category.tint
            )}
          >
            <img src={category.image} alt="" className="size-9 rounded-lg object-cover" loading="lazy" />
            <span className="leading-tight">{category.title}</span>
          </Link>
        ))}
      </div>
    </Sheet>
  );
}

/* ------------------------------------------------------------------ */
/* Header                                                              */
/* ------------------------------------------------------------------ */

const barLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "flex h-11 shrink-0 items-center border-b-2 px-3 text-sm font-medium transition-colors",
    isActive ? "border-brand-strong text-brand-strong" : "border-transparent text-slate-600 hover:text-slate-900"
  );

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setSearchOpen(false), [pathname]);

  const searchResults = useMemo<SearchResult[]>(() => {
    const matches = searchProducts(searchQuery).slice(0, 6);
    return matches.map((product) => ({
      name: product.name,
      meta: `${product.description} · ${formatPrice(product.price)}`,
      href: `/medicine?q=${encodeURIComponent(product.name)}`,
    }));
  }, [searchQuery]);

  const openSearch = () => {
    setSearchQuery("");
    setSearchOpen(true);
  };

  const go = (to: string) => {
    setSearchOpen(false);
    navigate(to);
  };

  return (
    <>
      {/* Utility strip */}
      <div className="bg-ink text-white/90">
        <div className="container-page flex h-8 items-center justify-center gap-6 text-xs sm:justify-between">
          <div className="hidden items-center gap-5 sm:flex">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-brand" aria-hidden="true" /> 100% genuine medicines
            </span>
            <span className="hidden items-center gap-1.5 md:flex">
              <Truck className="size-3.5 text-brand" aria-hidden="true" /> Free home delivery
            </span>
          </div>
          <Link to="/offers" className="flex min-w-0 items-center gap-1.5 hover:text-white">
            <BadgePercent className="size-3.5 shrink-0 text-brand" aria-hidden="true" />
            <span className="truncate">
              Flat 10% off on any medicine · code <strong className="font-bold text-white">PHARMA10</strong>
            </span>
          </Link>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 border-b border-slate-200 bg-white transition-shadow",
          scrolled && "shadow-soft"
        )}
      >
        {/* Main row */}
        <div className="container-page flex h-16 items-center gap-2 sm:gap-4 lg:h-[72px]">
          <Button
            variant="ghost"
            size="icon"
            className="-ml-2 lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-5!" />
          </Button>

          <Logo />

          <span className="hidden h-9 w-px bg-slate-200 md:block" aria-hidden="true" />
          <DeliveryChip className="hidden w-52 md:flex" />

          <SearchTrigger onOpen={openSearch} className="hidden max-w-2xl flex-1 md:flex" />

          <div className="ml-auto flex items-center gap-0.5 md:ml-0">
            <Link
              to="/upload-prescription"
              className="hidden h-10 items-center gap-2 rounded-xl px-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 xl:flex"
            >
              <FileText className="size-5 text-brand-strong" aria-hidden="true" /> Upload Rx
            </Link>
            <AccountButton />
            <CartButton />
          </div>
        </div>

        {/* Mobile: search + delivery */}
        <div className="container-page space-y-2 pb-3 md:hidden">
          <SearchTrigger onOpen={openSearch} />
          <DeliveryChip compact className="w-full" />
        </div>

        {/* Category bar */}
        <div className="hidden border-t border-slate-100 lg:block">
          <nav className="container-page flex items-center" aria-label="Main">
            <CategoriesMenu />
            <span className="mr-1 h-5 w-px bg-slate-200" aria-hidden="true" />
            <div className="flex min-w-0 items-center overflow-x-auto [scrollbar-width:none]">
              <NavLink to="/medicine" className={barLinkClass}>
                Medicine
              </NavLink>
              <NavLink to="/healthcare" className={barLinkClass}>
                Healthcare
              </NavLink>
              {categories.slice(1, 6).map((category) => (
                <NavLink key={category.slug} to={`/category/${category.slug}`} className={barLinkClass}>
                  {category.title}
                </NavLink>
              ))}
            </div>
            <div className="ml-auto flex shrink-0 items-center">
              <NavLink to="/offers" className={barLinkClass}>
                <BadgePercent className="mr-1.5 size-4 text-offer" aria-hidden="true" /> Offers
              </NavLink>
              <NavLink to="/plus" className={barLinkClass}>
                <Crown className="mr-1.5 size-4 text-plus" aria-hidden="true" /> PLUS
              </NavLink>
            </div>
          </nav>
        </div>
      </header>

      <SearchModal
        open={searchOpen}
        onOpenChange={setSearchOpen}
        modal
        hotkey="k"
        placeholder="Search medicines, healthcare products…"
        tags={[]}
        results={searchResults}
        quickActions={[
          { label: "Upload prescription", shortcut: "U", onClick: () => go("/upload-prescription") },
          { label: "Browse all medicines", shortcut: "M", onClick: () => go("/medicine") },
          { label: "View offers", shortcut: "O", onClick: () => go("/offers") },
        ]}
        files={[]}
        onQueryChange={setSearchQuery}
        onSelectResult={(result) => {
          if (result.href) go(result.href);
        }}
        className="font-sans text-slate-900 dark:text-white [&_kbd]:font-sans"
      />

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
