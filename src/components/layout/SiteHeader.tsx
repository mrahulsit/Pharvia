import { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  BadgePercent,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  ShoppingCart,
  Upload,
  User,
} from "lucide-react";
import { Logo } from "./Logo";
import { DeliveryChip } from "./DeliveryChip";
import { Sheet } from "@/components/ui/sheet";
import { Button, buttonVariants } from "@/components/ui/button";
import { SearchModal, type SearchResult } from "@/components/ui/search-modal";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { categories, searchProducts } from "@/data/catalog";
import { navLinks } from "@/data/site";
import { cn, formatPrice } from "@/lib/utils";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
    isActive ? "text-brand-strong" : "text-slate-600 hover:text-slate-900"
  );

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
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          open || pathname.startsWith("/category")
            ? "text-brand-strong"
            : "text-slate-600 hover:text-slate-900"
        )}
      >
        Categories
        <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            className="absolute left-1/2 top-full z-50 w-[min(44rem,90vw)] -translate-x-1/2 pt-3"
          >
            <div className="grid grid-cols-4 gap-2 rounded-2xl border bg-white p-3 shadow-lift">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  to={`/category/${category.slug}`}
                  className="group flex flex-col gap-2 rounded-xl p-2 transition hover:bg-brand-50"
                >
                  <span className="aspect-4/3 overflow-hidden rounded-lg bg-slate-100">
                    <img
                      src={category.image}
                      alt=""
                      loading="lazy"
                      className="size-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  </span>
                  <span className="text-sm font-semibold text-slate-800 group-hover:text-brand-strong">
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

function CartButton() {
  const { count } = useCart();
  return (
    <Link
      to="/cart"
      className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "relative")}
      aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`}
    >
      <ShoppingCart className="size-5!" />
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            className="absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-brand px-1 text-[11px] font-bold leading-5 text-slate-950"
          >
            {count > 99 ? "99+" : count}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}

function AccountButton() {
  const { user, logout } = useAuth();
  if (!user) {
    return (
      <Link to="/login" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "hidden sm:inline-flex")}>
        <User />
        Log in
      </Link>
    );
  }
  return (
    <div className="hidden items-center gap-1 sm:flex">
      <span className="max-w-32 truncate text-sm font-medium text-slate-700">
        Hi, {user.username}
      </span>
      <Button variant="ghost" size="icon-sm" onClick={logout} aria-label="Log out" title="Log out">
        <LogOut />
      </Button>
    </div>
  );
}

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

function MobileMenu({ open, onClose }: MobileMenuProps) {
  const { user, logout } = useAuth();
  return (
    <Sheet open={open} onClose={onClose} side="left" title="Menu">
      <nav className="flex flex-col gap-1" aria-label="Mobile">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                "rounded-xl px-4 py-3 text-base font-medium",
                isActive ? "bg-brand-soft text-brand-strong" : "text-slate-700 hover:bg-slate-50"
              )
            }
          >
            {link.label}
          </NavLink>
        ))}
        <NavLink
          to="/upload-prescription"
          onClick={onClose}
          className="flex items-center gap-2 rounded-xl px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-50"
        >
          <Upload className="size-4" /> Upload prescription
        </NavLink>
      </nav>

      <p className="mb-3 mt-8 px-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
        Shop by category
      </p>
      <div className="grid grid-cols-2 gap-2">
        {categories.map((category) => (
          <Link
            key={category.slug}
            to={`/category/${category.slug}`}
            onClick={onClose}
            className="flex items-center gap-2 rounded-xl border p-2 text-sm font-medium text-slate-700 hover:border-brand/40 hover:bg-brand-50"
          >
            <img src={category.image} alt="" className="size-9 rounded-lg object-cover" loading="lazy" />
            <span className="leading-tight">{category.title}</span>
          </Link>
        ))}
      </div>

      <div className="mt-8 border-t pt-6">
        {user ? (
          <div className="flex items-center justify-between">
            <span className="font-medium">Hi, {user.username}</span>
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
          <Link to="/login" onClick={onClose} className={cn(buttonVariants(), "w-full")}>
            <User /> Log in or sign up
          </Link>
        )}
      </div>
    </Sheet>
  );
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
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

  const goSearch = (value: string) => {
    const q = value.trim();
    setSearchOpen(false);
    navigate(q ? `/medicine?q=${encodeURIComponent(q)}` : "/medicine");
  };

  return (
    <>
      <div className="bg-brand-strong text-white">
        <div className="container-page flex h-9 items-center justify-center gap-2 text-xs sm:text-sm">
          <BadgePercent className="size-4 shrink-0 text-brand" />
          <span className="truncate">
            Flat 10% off on any medicine with code <strong>PHARMA10</strong>
          </span>
          <Link to="/offers" className="shrink-0 font-semibold underline-offset-4 hover:underline">
            View offers
          </Link>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 border-b bg-white/85 backdrop-blur-md transition-shadow",
          scrolled ? "border-slate-200 shadow-soft" : "border-transparent"
        )}
      >
        <div className="container-page flex h-16 items-center gap-3 lg:h-18">
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

          <span className="mx-2 hidden h-8 w-px bg-slate-200 md:block" aria-hidden="true" />
          <DeliveryChip className="hidden max-w-60 md:flex" />

          <nav className="ml-auto hidden items-center lg:flex" aria-label="Main">
            <NavLink to="/medicine" className={navLinkClass}>
              Medicine
            </NavLink>
            <CategoriesMenu />
            {navLinks.slice(1).map((link) => (
              <NavLink key={link.to} to={link.to} className={navLinkClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1 lg:ml-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={openSearch}
              aria-label="Search medicines"
            >
              <Search className="size-5!" />
            </Button>
            <AccountButton />
            <CartButton />
          </div>
        </div>

        <div className="border-t bg-white/70 md:hidden">
          <div className="container-page py-1">
            <DeliveryChip className="w-full" />
          </div>
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
          { label: "Upload prescription", shortcut: "U", onClick: () => goSearch("upload") },
          { label: "Browse all medicines", shortcut: "M", onClick: () => goSearch("") },
          { label: "View offers", shortcut: "O", onClick: () => { setSearchOpen(false); navigate("/offers"); } },
        ]}
        files={[]}
        onQueryChange={setSearchQuery}
        onSelectResult={(result) => {
          if (result.href) {
            setSearchOpen(false);
            navigate(result.href);
          }
        }}
        className="font-sans text-slate-900 dark:text-white [&_kbd]:font-sans"
      />

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
