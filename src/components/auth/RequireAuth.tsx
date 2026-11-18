import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface RequireAuthProps {
  children: ReactNode;
  /** Shown on the login page so the visitor knows why they were sent there. */
  reason?: "cart" | "checkout";
}

/**
 * Sends logged-out visitors to /login, then back here after they log in or sign up.
 * Client-side only: the backend must still check the token on every protected request (see BACKEND_TODO.md).
 */
export function RequireAuth({ children, reason }: RequireAuthProps) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}`, reason }}
      />
    );
  }
  return <>{children}</>;
}
