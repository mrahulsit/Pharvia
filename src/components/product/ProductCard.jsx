/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { Minus, Pill, Plus, ShieldCheck, Tablets, Wind } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { cn, formatPrice } from "@/lib/utils";

const formIcons = { tablet: Tablets, capsule: Pill, inhaler: Wind };

export function ProductIcon({ form, className }) {
  const Icon = formIcons[form] ?? Pill;
  return (
    <span
      className={cn(
        "grid place-items-center rounded-2xl bg-linear-to-br from-brand-soft to-teal-50 text-brand-strong",
        className
      )}
    >
      <Icon className="size-1/2" strokeWidth={1.5} aria-hidden="true" />
    </span>
  );
}

export function QuantityStepper({ quantity, onChange, label, size = "default" }) {
  const small = size === "sm";
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-xl border border-brand/30 bg-brand-50",
        small ? "h-9" : "h-10"
      )}
    >
      <button
        type="button"
        onClick={() => onChange(quantity - 1)}
        className={cn("grid place-items-center text-brand-strong hover:bg-brand-soft rounded-l-xl", small ? "size-9" : "size-10")}
        aria-label={`Decrease quantity of ${label}`}
      >
        <Minus className="size-4" />
      </button>
      <span className="min-w-8 text-center text-sm font-semibold tabular-nums" aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => onChange(quantity + 1)}
        className={cn("grid place-items-center text-brand-strong hover:bg-brand-soft rounded-r-xl", small ? "size-9" : "size-10")}
        aria-label={`Increase quantity of ${label}`}
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}

export function ProductCard({ product }) {
  const { addItem, getQuantity, updateQuantity } = useCart();
  const quantity = getQuantity(product.id);

  const onAdd = () => {
    addItem(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <motion.article
      layout
      className="group flex flex-col rounded-2xl border bg-white p-4 transition-shadow duration-300 hover:border-brand/30 hover:shadow-lift"
    >
      <ProductIcon form={product.form} className="aspect-16/10 w-full transition-transform duration-300 group-hover:scale-[1.02]" />
      <div className="mt-4 flex flex-1 flex-col">
        <p className="flex items-center gap-1 text-xs font-medium text-accent">
          <ShieldCheck className="size-3.5" aria-hidden="true" /> 100% genuine
        </p>
        <h3 className="mt-1 text-base font-bold">{product.name}</h3>
        <p className="text-sm text-slate-500">{product.description}</p>
        <div className="mt-4 flex items-end justify-between gap-2 pt-1">
          <div>
            <p className="text-lg font-bold text-slate-900">{formatPrice(product.price)}</p>
            <p className="text-xs text-slate-500">{product.unit}</p>
          </div>
          {quantity > 0 ? (
            <QuantityStepper
              size="sm"
              quantity={quantity}
              label={product.name}
              onChange={(next) => updateQuantity(product.id, next)}
            />
          ) : (
            <Button size="sm" onClick={onAdd} aria-label={`Add ${product.name} to cart`}>
              <Plus /> Add
            </Button>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export function ProductGrid({ products }) {
  return (
    <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
