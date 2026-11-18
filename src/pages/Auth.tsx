import { useState, type ChangeEvent, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  BadgePercent,
  Eye,
  EyeOff,
  FileText,
  Lock,
  Mail,
  ShieldCheck,
  ShoppingCart,
  Truck,
  TriangleAlert,
  User,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { FieldError, Input, Label } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { cn, getErrorMessage } from "@/lib/utils";
import { usePageTitle } from "@/lib/usePageTitle";
import logo from "@/assets/PHARMACY.png";
import loginBanner from "@/assets/img/login-banner.webp";
import signupBanner from "@/assets/img/signup-banner.webp";

type Mode = "login" | "signup";

interface AuthValues {
  username: string;
  email: string;
  password: string;
  confirm: string;
}

interface AuthRouteState {
  from?: string;
  reason?: "cart" | "checkout";
  username?: string;
}

/* ------------------------------------------------------------------ */
/* Validation + password strength                                      */
/* ------------------------------------------------------------------ */

function validate(mode: Mode, values: AuthValues): Partial<Record<keyof AuthValues, string>> {
  const errors: Partial<Record<keyof AuthValues, string>> = {};
  const username = values.username.trim();
  if (!username) errors.username = "Username is required.";
  else if (mode === "signup" && username.length < 3) errors.username = "Use at least 3 characters.";
  else if (mode === "signup" && !/^[a-zA-Z0-9._-]+$/.test(username))
    errors.username = "Use letters, numbers, dots, dashes or underscores only.";

  if (mode === "signup") {
    if (!values.email.trim()) errors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = "Enter a valid email address.";
    if (values.password.length < 6) errors.password = "Use at least 6 characters.";
    if (!values.confirm) errors.confirm = "Please confirm your password.";
    else if (values.confirm !== values.password) errors.confirm = "Passwords don't match.";
  } else if (!values.password) {
    errors.password = "Password is required.";
  }
  return errors;
}

const strengthLevels = [
  { label: "Too short", bar: "bg-red-500", text: "text-red-600" },
  { label: "Weak", bar: "bg-orange-500", text: "text-orange-600" },
  { label: "Fair", bar: "bg-amber-500", text: "text-amber-700" },
  { label: "Good", bar: "bg-lime-600", text: "text-lime-700" },
  { label: "Strong", bar: "bg-brand-strong", text: "text-brand-strong" },
];

function passwordScore(password: string) {
  if (password.length < 6) return 0;
  let score = 1;
  if (password.length >= 10) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;
  else if (/\d|[^A-Za-z0-9]/.test(password)) score += 0.5;
  return Math.min(4, Math.floor(score));
}

function StrengthMeter({ password }: { password: string }) {
  const score = passwordScore(password);
  const level = strengthLevels[score];
  return (
    <div className="mt-2" aria-live="polite">
      <div className="flex gap-1" aria-hidden="true">
        {[1, 2, 3, 4].map((step) => (
          <span
            key={step}
            className={cn("h-1.5 flex-1 rounded-full transition-colors", score >= step ? level.bar : "bg-slate-200")}
          />
        ))}
      </div>
      <p className="mt-1.5 flex justify-between text-xs">
        <span className="text-slate-500">Use 10+ characters with a mix of letters, numbers and symbols.</span>
        <span className={cn("shrink-0 pl-2 font-semibold", level.text)}>{level.label}</span>
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Form pieces                                                         */
/* ------------------------------------------------------------------ */

function Field({
  id,
  label,
  error,
  aside,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="font-semibold text-slate-800">
          {label}
        </Label>
        {aside}
      </div>
      {children}
      <FieldError id={`${id}-error`}>{error}</FieldError>
    </div>
  );
}

function IconInput({
  icon: Icon,
  trailing,
  className,
  ...props
}: React.ComponentProps<typeof Input> & { icon: LucideIcon; trailing?: ReactNode }) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-slate-400" aria-hidden="true" />
      <Input className={cn("h-12 bg-canvas pl-11 focus-visible:bg-white", trailing && "pr-12", className)} {...props} />
      {trailing}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Brand panel                                                         */
/* ------------------------------------------------------------------ */

const perks = [
  { Icon: ShieldCheck, text: "100% genuine, quality-checked medicines" },
  { Icon: Truck, text: "Home delivery right to your doorstep" },
  { Icon: BadgePercent, text: "Offers like PHARMA10 and PLUS member prices" },
  { Icon: FileText, text: "Order with just a photo of your prescription" },
];

function BrandPanel({ mode }: { mode: Mode }) {
  const isSignup = mode === "signup";
  return (
    <motion.aside
      initial={false}
      animate={{ backgroundColor: isSignup ? "#37877a" : "#338751" }}
      transition={{ duration: 0.4 }}
      className="relative hidden flex-col overflow-hidden text-white lg:flex"
    >
      <Link to="/" className="relative z-10 flex items-center gap-2.5 p-8 pb-0">
        <img src={logo} alt="" className="size-9 rounded-lg bg-white p-0.5" />
        <span className="leading-none">
          <span className="block font-display text-lg font-extrabold">Pharmacy</span>
          <span className="text-xs text-white/70">at every step</span>
        </span>
      </Link>

      <div className="relative -my-6 flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={mode}
            src={isSignup ? signupBanner : loginBanner}
            alt=""
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.35 }}
            className="mx-auto aspect-square w-full max-w-md object-cover"
          />
        </AnimatePresence>
      </div>

      <div className="relative z-10 p-8 pt-0">
        <h2 className="text-2xl font-extrabold leading-tight text-white">
          {isSignup ? "Join Pharmacy in under a minute" : "Your health, delivered"}
        </h2>
        <ul className="mt-5 space-y-3">
          {perks.map(({ Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-sm text-white/90">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white/15">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              {text}
            </li>
          ))}
        </ul>
      </div>
    </motion.aside>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Auth({ mode }: { mode: Mode }) {
  const isSignup = mode === "signup";
  usePageTitle(isSignup ? "Sign up" : "Log in");
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const routeState = (routerLocation.state ?? {}) as AuthRouteState;
  const { login, signup } = useAuth();
  const { count } = useCart();

  const [values, setValues] = useState<AuthValues>({
    username: routeState.username ?? "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof AuthValues, string>>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Keep where the visitor was headed when switching between the two tabs.
  const carryState = { from: routeState.from, reason: routeState.reason };
  const destination = routeState.from ?? "/";

  const update = (field: keyof AuthValues) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues((v) => ({ ...v, [field]: event.target.value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const trackCapsLock = (event: KeyboardEvent<HTMLInputElement>) =>
    setCapsLock(event.getModifierState?.("CapsLock") ?? false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(mode, values);
    setErrors(nextErrors);
    const firstInvalid = Object.keys(nextErrors)[0];
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus();
      return;
    }

    const username = values.username.trim();
    setSubmitting(true);
    try {
      if (isSignup) {
        await signup({ username, email: values.email.trim(), password: values.password });
        try {
          // Sign the new user straight in, like most stores do.
          await login(username, values.password);
          toast.success(`Welcome to Pharmacy, ${username}!`);
          navigate(destination, { replace: true });
        } catch {
          toast.success("Account created. Please log in.");
          navigate("/login", { replace: true, state: { ...carryState, username } });
        }
      } else {
        await login(username, values.password);
        toast.success(`Welcome back, ${username}!`);
        navigate(destination, { replace: true });
      }
    } catch (error) {
      toast.error(getErrorMessage(error, isSignup ? "Signup failed. Please try again." : "Invalid username or password."));
    } finally {
      setSubmitting(false);
    }
  };

  const describedBy = (field: keyof AuthValues) => (errors[field] ? `${field}-error` : undefined);

  const passwordToggle = (
    <button
      type="button"
      onClick={() => setShowPassword((v) => !v)}
      aria-label={showPassword ? "Hide password" : "Show password"}
      aria-pressed={showPassword}
      className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800"
    >
      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
    </button>
  );

  return (
    <section className="bg-canvas py-6 sm:py-12">
      <div className="container-page">
        <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl bg-white shadow-lift ring-1 ring-slate-200/70 lg:grid-cols-[1fr_1.05fr]">
          <BrandPanel mode={mode} />

          <div className="flex flex-col p-6 sm:p-10">
            <Link
              to="/"
              className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900"
            >
              <ArrowLeft className="size-4" aria-hidden="true" /> Continue shopping
            </Link>

            {routeState.reason && (
              <div className="mt-5 flex items-center gap-3 rounded-2xl border border-brand/20 bg-brand-50 p-3.5 text-sm">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-brand-strong shadow-card">
                  <ShoppingCart className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-bold text-slate-900">
                    {isSignup ? "Sign up" : "Log in"} to view your cart
                  </p>
                  <p className="text-slate-600">
                    {count > 0
                      ? `Your ${count} ${count === 1 ? "item is" : "items are"} saved and waiting.`
                      : "We'll take you straight there after."}
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6 grid grid-cols-2 rounded-xl bg-slate-100 p-1" role="tablist" aria-label="Account">
              {[
                { to: "/login", label: "Log in", active: !isSignup },
                { to: "/signup", label: "Sign up", active: isSignup },
              ].map((tab) => (
                <Link
                  key={tab.to}
                  to={tab.to}
                  state={carryState}
                  role="tab"
                  aria-selected={tab.active}
                  replace
                  className={cn(
                    "relative rounded-lg py-2.5 text-center text-sm font-semibold transition-colors",
                    tab.active ? "text-slate-900" : "text-slate-500 hover:text-slate-800"
                  )}
                >
                  {tab.active && (
                    <motion.span
                      layoutId="auth-tab"
                      className="absolute inset-0 rounded-lg bg-white shadow-sm"
                      transition={{ type: "spring", stiffness: 400, damping: 34 }}
                    />
                  )}
                  <span className="relative">{tab.label}</span>
                </Link>
              ))}
            </div>

            <h1 className="mt-7 text-2xl font-extrabold text-ink sm:text-3xl">
              {isSignup ? "Create your account" : "Welcome back"}
            </h1>
            <p className="mt-1 text-slate-600">
              {isSignup
                ? "Order medicines, upload prescriptions and track deliveries."
                : "Log in to check out and see your orders."}
            </p>

            <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
              <Field id="username" label="Username" error={errors.username}>
                <IconInput
                  icon={User}
                  id="username"
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  placeholder={isSignup ? "Choose a username" : "Your username"}
                  value={values.username}
                  onChange={update("username")}
                  invalid={Boolean(errors.username)}
                  aria-describedby={describedBy("username")}
                />
              </Field>

              <AnimatePresence initial={false}>
                {isSignup && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <Field id="email" label="Email" error={errors.email}>
                      <IconInput
                        icon={Mail}
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={values.email}
                        onChange={update("email")}
                        invalid={Boolean(errors.email)}
                        aria-describedby={describedBy("email")}
                      />
                    </Field>
                  </motion.div>
                )}
              </AnimatePresence>

              <Field
                id="password"
                label="Password"
                error={errors.password}
                aside={
                  !isSignup && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          aria-disabled="true"
                          onClick={(event) => event.preventDefault()}
                          className="cursor-default text-sm font-semibold text-slate-400"
                        >
                          Forgot password?
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Password reset is coming soon</TooltipContent>
                    </Tooltip>
                  )
                }
              >
                <IconInput
                  icon={Lock}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={isSignup ? "new-password" : "current-password"}
                  placeholder={isSignup ? "At least 6 characters" : "Your password"}
                  value={values.password}
                  onChange={update("password")}
                  onKeyUp={trackCapsLock}
                  onKeyDown={trackCapsLock}
                  onBlur={() => setCapsLock(false)}
                  invalid={Boolean(errors.password)}
                  aria-describedby={describedBy("password")}
                  trailing={passwordToggle}
                />
                {isSignup && values.password && <StrengthMeter password={values.password} />}
              </Field>

              <AnimatePresence initial={false}>
                {isSignup && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <Field id="confirm" label="Confirm password" error={errors.confirm}>
                      <IconInput
                        icon={Lock}
                        id="confirm"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Type it again"
                        value={values.confirm}
                        onChange={update("confirm")}
                        invalid={Boolean(errors.confirm)}
                        aria-describedby={describedBy("confirm")}
                      />
                    </Field>
                  </motion.div>
                )}
              </AnimatePresence>

              {capsLock && (
                <p className="flex items-center gap-1.5 text-sm font-medium text-amber-700" role="status">
                  <TriangleAlert className="size-4" aria-hidden="true" /> Caps Lock is on
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-strong text-base font-bold text-white shadow-sm transition hover:bg-brand-strong/90 hover:shadow-lift disabled:opacity-70"
              >
                {submitting && <Spinner aria-hidden="true" />}
                {submitting ? (isSignup ? "Creating account…" : "Logging in…") : isSignup ? "Create account" : "Log in"}
              </button>
            </form>

            {isSignup && (
              <p className="mt-4 text-center text-xs leading-relaxed text-slate-500">
                By creating an account you agree to our Terms &amp; Conditions and Privacy Policy.
              </p>
            )}

            <p className="mt-6 border-t border-slate-100 pt-6 text-center text-sm text-slate-600">
              {isSignup ? "Already have an account? " : "New to Pharmacy? "}
              <Link
                to={isSignup ? "/login" : "/signup"}
                state={carryState}
                replace
                className="font-bold text-brand-strong hover:underline"
              >
                {isSignup ? "Log in" : "Create an account"}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
