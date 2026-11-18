import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth, type AuthMode } from "@/context/AuthContext";

/** Old /login and /signup URLs: open the auth modal over the home page instead of a separate page. */
export function AuthRoute({ mode }: { mode: AuthMode }) {
  const { user, openAuth } = useAuth();
  useEffect(() => {
    if (!user) openAuth({ mode });
  }, [user, openAuth, mode]);
  return <Navigate to="/" replace />;
}
