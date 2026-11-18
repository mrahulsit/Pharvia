import { Crown, Minus, Pill, Plus, Tablets, Wind, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { formLabels, plusPrice, type Product } from "@/data/catalog";
import { cn, formatPrice } from "@/lib/utils";

const formIcons: Record<string, LucideIcon> = { tablet: Tablets, capsule: Pill, inhaler: Wind };

/* Each dosage form gets its own soft colour so a grid of products doesn't look like clones. */
const formTints: Record<string, string> = {
  tablet: "from-emerald-50 to-teal-50 text-emerald-700",
  capsule: "from-sky-50 to-indigo-50 text-sky-700",
  inhaler: "from-amber-50 to-orange-50 text-amber-700",
};

interface ProductIconProps {
  form?: string;
  className?: string;
}

/** Pack-style thumbnail: we have no product photos, so draw a clean tinted "pack". */
export function ProductIcon({ form, className }: ProductIconProps) {
  const Icon = formIcons[form ?? ""] ?? Pill;
  return (
    <span
      className={cn(
        "relative grid place-items-center overflow-hidden rounded-xl bg-linear-to-br",
        formTints[form ?? ""] ?? formTints.tablet,
        className
      )}
    >
      <span className="absolute -right-4 -top-4 size-1/2 rounded-full bg-white/50" aria-hidden="true" />
      <Icon className="relative size-2/5" strokeWidth={1.4} aria-hidden="true" />
    </span>
  );
}

interface QuantityStepperProps {
  quantity: number;
  onChange: (next: number) => void;
  label: string;
  size?: "sm" | "default";
  className?: string;
}

export function QuantityStepper({ quantity, onChange, label, size = "default", className }: QuantityStepperProps) {
  const small = size === "sm";
  return (
    <div
      className={cn(
        "inline-flex items-center justify-between rounded-lg bg-brand-strong text-white",
        small ? "h-9" : "h-10",
        className
      )}
    >
      <button
        type="button"
        onClick={() => onChange(quantity - 1)}
        className={cn("grid place-items-center rounded-l-lg hover:bg-white/15", small ? "size-9" : "size-10")}
        aria-label={`Decrease quantity of ${label}`}
      >
        <Minus className="size-4" />
      </button>
      <span className="min-w-6 text-center text-sm font-bold tabular-nums" aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => onChange(quantity + 1)}
        className={cn("grid place-items-center rounded-r-lg hover:bg-white/15", small ? "size-9" : "size-10")}
        aria-label={`Increase quantity of ${label}`}
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { addItem, getQuantity, updateQuantity } = useCart();
  const quantity = getQuantity(product.id);

  const onAdd = () => {
    addItem(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <article
      className={cn(
        "group flex flex-col rounded-2xl border border-slate-200/80 bg-white p-3 shadow-card transition duration-200 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-lift",
        className
      )}
    >
      <div className="relative">
        <ProductIcon form={product.form} className="aspect-4/3 w-full [&>svg]:size-1/3" />
        <span className="absolute left-2 top-2 rounded-md bg-white/90 px-1.5 py-0.5 text-[11px] font-semibold text-slate-700 shadow-sm">
          {formLabels[product.form] ?? product.form}
        </span>
      </div>

      <div className="mt-3 flex flex-1 flex-col px-0.5">
        <h3 className="line-clamp-1 text-[15px] font-bold text-slate-900">{product.name}</h3>
        <p className="text-[13px] text-slate-500">
          {product.description} · {product.unit}
        </p>

        <div className="mt-auto pt-3">
          <p className="text-lg font-extrabold leading-none text-slate-900 tabular-nums">
            {formatPrice(product.price)}
          </p>
          <p className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-plus">
            <Crown className="size-3.5" aria-hidden="true" />
            {formatPrice(plusPrice(product.price))} with PLUS
          </p>
        </div>

        <div className="mt-3">
          {quantity > 0 ? (
            <QuantityStepper
              size="sm"
              className="w-full"
              quantity={quantity}
              label={product.name}
              onChange={(next) => updateQuantity(product.id, next)}
            />
          ) : (
            <button
              type="button"
              onClick={onAdd}
              aria-label={`Add ${product.name} to cart`}
              className="h-9 w-full rounded-lg border border-brand-strong/30 bg-brand-50 text-sm font-bold tracking-wide text-brand-strong transition hover:border-brand-strong hover:bg-brand-strong hover:text-white"
            >
              ADD
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

interface ProductGridProps {
  products: Product[];
  className?: string;
}

export function ProductGrid({ products, className }: ProductGridProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4", className)}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

/** Horizontally scrolling product row (1mg / PharmEasy style) for the home page. */
export function ProductRail({ products }: { products: Product[] }) {
  return (
    <div className="rail -mx-4 auto-cols-[46%] gap-3 px-4 pb-2 sm:mx-0 sm:auto-cols-[30%] sm:px-0 md:auto-cols-[23%] lg:auto-cols-[calc((100%-4*1rem)/5)] lg:gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
