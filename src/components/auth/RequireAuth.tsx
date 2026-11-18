import { useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { LogIn, ShoppingCart } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { useAuth, type AuthReason } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

interface RequireAuthProps {
  children: ReactNode;
  /** Shown in the login modal so the visitor knows why it opened. */
  reason?: AuthReason;
}

/**
 * Shows the login modal to logged-out visitors and renders the page as soon as they log in.
 * Client-side only: the backend must still check the token on every protected request (see BACKEND_TODO.md).
 */
export function RequireAuth({ children, reason = "cart" }: RequireAuthProps) {
  const { user, openAuth } = useAuth();
  const { count } = useCart();

  useEffect(() => {
    if (!user) openAuth({ mode: "login", reason });
  }, [user, openAuth, reason]);

  if (user) return <>{children}</>;

  return (
    <section className="container-page py-12">
      <Empty className="py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ShoppingCart aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>Log in to view your cart</EmptyTitle>
          <EmptyDescription>
            {count > 0
              ? `Your ${count} ${count === 1 ? "item is" : "items are"} saved. Log in or create an account to check out.`
              : "Log in or create an account to see your cart and check out."}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <button type="button" onClick={() => openAuth({ mode: "login", reason })} className={buttonVariants()}>
            <LogIn /> Log in
          </button>
          <button
            type="button"
            onClick={() => openAuth({ mode: "signup", reason })}
            className={buttonVariants({ variant: "outline" })}
          >
            Create an account
          </button>
          <Link to="/medicine" className={buttonVariants({ variant: "ghost" })}>
            Keep shopping
          </Link>
        </EmptyContent>
      </Empty>
    </section>
  );
}
