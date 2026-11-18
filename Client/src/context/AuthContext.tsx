/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import axios from "axios";

// Same keys the original app used, so existing sessions keep working.
const TOKEN_KEY = "token";
const USER_KEY = "username";

export interface AuthUser {
  username: string;
}

export type AuthMode = "login" | "signup";
export type AuthReason = "cart" | "checkout";

export interface AuthModalState {
  open: boolean;
  mode: AuthMode;
  /** Why the modal was opened; shown as a banner. */
  reason?: AuthReason;
  /** Where to go after a successful login/signup. */
  redirectTo?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (username: string, password: string) => Promise<void>;
  signup: (data: { username: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  authModal: AuthModalState;
  openAuth: (options?: Partial<Omit<AuthModalState, "open">>) => void;
  closeAuth: () => void;
  setAuthMode: (mode: AuthMode) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readUser(): AuthUser | null {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const username = localStorage.getItem(USER_KEY);
    return token && username ? { username } : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(readUser);
  const [authModal, setAuthModal] = useState<AuthModalState>({ open: false, mode: "login" });

  /** POST {VITE_BASE_URL}/api/login  { username, password } -> { token } */
  const login = useCallback(async (username: string, password: string) => {
    const { data } = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/login`, {
      username,
      password,
    });
    if (!data?.token) throw new Error("Invalid username or password.");
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, username);
    setUser({ username });
  }, []);

  /** POST {VITE_BASE_REGISTER}/api/register  { username, email, password } -> 200 */
  const signup = useCallback(
    async ({ username, email, password }: { username: string; email: string; password: string }) => {
      await axios.post(`${import.meta.env.VITE_BASE_REGISTER}/api/register`, {
        username,
        email,
        password,
      });
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  const openAuth = useCallback((options: Partial<Omit<AuthModalState, "open">> = {}) => {
    setAuthModal({ open: true, mode: options.mode ?? "login", reason: options.reason, redirectTo: options.redirectTo });
  }, []);
  const closeAuth = useCallback(() => setAuthModal((s) => ({ ...s, open: false })), []);
  const setAuthMode = useCallback((mode: AuthMode) => setAuthModal((s) => ({ ...s, mode })), []);

  const value = useMemo(
    () => ({ user, login, signup, logout, authModal, openAuth, closeAuth, setAuthMode }),
    [user, login, signup, logout, authModal, openAuth, closeAuth, setAuthMode]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}
