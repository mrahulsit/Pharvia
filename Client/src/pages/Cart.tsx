import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Crown, MapPin, ShoppingBag, Trash2 } from "lucide-react";
import { plusPrice } from "@/data/catalog";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { PageHeader } from "@/components/layout/Layout";
import { ProductIcon, QuantityStepper } from "@/components/product/ProductCard";
import { Button, buttonVariants } from "@/components/ui/button";
import { LiquidButton } from "@/components/ui/liquid-button";
import { AnimatedNumber } from "@/components/ui/count-up";
import { useCart } from "@/context/CartContext";
import { useLocationPicker } from "@/context/LocationContext";
import { formatPrice } from "@/lib/utils";
import { usePageTitle } from "@/lib/usePageTitle";

export default function Cart() {
  usePageTitle("Cart");
  const { items, count, subtotal, updateQuantity, removeItem } = useCart();
  const { location, openPicker } = useLocationPicker();
  const [checkingOut, setCheckingOut] = useState(false);

  // Payment isn't implemented yet; this keeps the original "Proceeding to payment…" step.
  const handleCheckout = () => {
    // A delivery pincode is required before checkout.
    if (!location) {
      toast.info("Add your delivery pincode to continue");
      openPicker();
      return;
    }
    setCheckingOut(true);
  };

  return (
    <>
      <PageHeader crumbs={[{ label: "Cart" }]} title="Your cart" />

      <section className="container-page mt-10">
        {items.length === 0 ? (
          <Empty className="py-16 md:py-20">
            <EmptyHeader>
              <EmptyMedia variant="icon" className="size-20 rounded-full [&_svg:not([class*='size-'])]:size-9">
                <ShoppingBag aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle className="text-2xl">Your cart is empty</EmptyTitle>
              <EmptyDescription>Add medicines and healthcare products to get started.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Link to="/medicine" className={buttonVariants({ size: "lg" })}>
                Browse medicines
              </Link>
              <Link to="/upload-prescription" className={buttonVariants({ size: "lg", variant: "outline" })}>
                Upload prescription
              </Link>
            </EmptyContent>
          </Empty>
        ) : (
          <div className="grid items-start gap-8 lg:grid-cols-[1fr_22rem]">
            <ul className="divide-y rounded-3xl border bg-white">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.li
                    key={item.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -24 }}
                    className="flex flex-wrap items-center gap-4 p-4 sm:flex-nowrap sm:p-5"
                  >
                    <ProductIcon form={item.form} className="size-16 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold">{item.name}</h3>
                      <p className="text-sm text-slate-500">
                        {item.description} · {formatPrice(item.price)} {item.unit}
                      </p>
                    </div>
                    <QuantityStepper
                      size="sm"
                      quantity={item.quantity}
                      label={item.name}
                      onChange={(next: number) => updateQuantity(item.id, next)}
                    />
                    <p className="w-24 text-right font-bold tabular-nums">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove ${item.name} from cart`}
                      className="text-slate-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 />
                    </Button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            <aside className="rounded-3xl border bg-white p-6 shadow-soft lg:sticky lg:top-28">
              <h2 className="text-lg font-bold">Order summary</h2>
              <button
                type="button"
                onClick={openPicker}
                className="mt-4 flex w-full items-center gap-2 rounded-xl bg-surface px-3 py-2.5 text-left text-sm hover:bg-brand-50"
              >
                <MapPin className="size-4 shrink-0 text-brand-strong" />
                <span className="truncate">
                  {location ? `Deliver to ${location.postOffice} ${location.pincode}` : "Add delivery pincode"}
                </span>
              </button>
              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-600">Items ({count})</dt>
                  <dd className="font-medium tabular-nums">{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-600">Delivery</dt>
                  <dd className="font-medium text-brand-strong">Free</dd>
                </div>
                <div className="flex justify-between border-t pt-3 text-base">
                  <dt className="font-bold">Total</dt>
                  <dd className="font-bold">
                    <AnimatedNumber value={subtotal} format={formatPrice} />
                  </dd>
                </div>
              </dl>

              <Link
                to="/plus"
                className="mt-5 flex items-center gap-2 rounded-xl bg-plus-soft px-3 py-2.5 text-sm text-slate-700 transition hover:ring-1 hover:ring-plus/30"
              >
                <Crown className="size-4 shrink-0 text-plus" aria-hidden="true" />
                <span>
                  Save <strong className="text-plus">{formatPrice(subtotal - plusPrice(subtotal))}</strong> on this
                  order with PLUS
                </span>
              </Link>

              <AnimatePresence mode="wait" initial={false}>
                {checkingOut ? (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 flex items-center gap-3 rounded-xl bg-brand-50 p-4 text-sm font-medium text-brand-strong"
                    role="status"
                  >
                    <Spinner className="size-5" aria-hidden="true" />
                    Proceeding to payment…
                  </motion.div>
                ) : (
                  <motion.div key="cta" exit={{ opacity: 0 }}>
                    <LiquidButton variant="brand" size="lg" className="mt-6 w-full" onClick={handleCheckout}>
                      Proceed to checkout
                    </LiquidButton>
                  </motion.div>
                )}
              </AnimatePresence>
              <p className="mt-4 flex items-center gap-1.5 text-xs text-slate-500">
                <CheckCircle2 className="size-3.5 text-brand-strong" /> 100% genuine products
              </p>
            </aside>
          </div>
        )}
      </section>
    </>
  );
}
