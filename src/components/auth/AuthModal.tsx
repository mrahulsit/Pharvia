import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
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
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { FieldError, Input, Label } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth, type AuthMode } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { cn, getErrorMessage } from "@/lib/utils";
import logo from "@/assets/PHARMACY.png";
import loginBanner from "@/assets/img/login-banner.webp";
import signupBanner from "@/assets/img/signup-banner.webp";

interface AuthValues {
  username: string;
  email: string;
  password: string;
  confirm: string;
}

const emptyValues: AuthValues = { username: "", email: "", password: "", confirm: "" };

/* ------------------------------------------------------------------ */
/* Validation + password strength                                      */
/* ------------------------------------------------------------------ */

function validate(mode: AuthMode, values: AuthValues): Partial<Record<keyof AuthValues, string>> {
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
      <p className="mt-1.5 flex justify-between gap-2 text-xs">
        <span className="text-slate-500">10+ characters with letters, numbers and symbols is best.</span>
        <span className={cn("shrink-0 font-semibold", level.text)}>{level.label}</span>
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
      <Icon
        className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-slate-400"
        aria-hidden="true"
      />
      <Input className={cn("h-11 bg-canvas pl-11 focus-visible:bg-white", trailing && "pr-12", className)} {...props} />
      {trailing}
    </div>
  );
}

/** Height-animated block for the signup-only fields. */
function Reveal({ show, children }: { show: boolean; children: ReactNode }) {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/* Brand panel                                                         */
/* ------------------------------------------------------------------ */

const perks = [
  { Icon: ShieldCheck, text: "100% genuine, quality-checked medicines" },
  { Icon: Truck, text: "Home delivery to your doorstep" },
  { Icon: BadgePercent, text: "PHARMA10 offers and PLUS member prices" },
  { Icon: FileText, text: "Order with a photo of your prescription" },
];

function BrandPanel({ mode }: { mode: AuthMode }) {
  const isSignup = mode === "signup";
  return (
    <motion.aside
      initial={false}
      animate={{ backgroundColor: isSignup ? "#37877a" : "#338751" }}
      transition={{ duration: 0.4 }}
      className="relative hidden flex-col overflow-hidden text-white md:flex"
    >
      <div className="relative z-10 flex items-center gap-2.5 p-7 pb-0">
        <img src={logo} alt="" className="size-9 rounded-lg bg-white p-0.5" />
        <span className="leading-none">
          <span className="block font-display text-lg font-extrabold">Pharvia</span>
          <span className="text-xs text-white/70">at every step</span>
        </span>
      </div>

      <div className="relative -my-4 flex flex-1 items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={mode}
            src={isSignup ? signupBanner : loginBanner}
            alt=""
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.35 }}
            className="aspect-square w-full max-w-[19rem] object-cover"
          />
        </AnimatePresence>
      </div>

      <div className="relative z-10 p-7 pt-0">
        <p className="font-display text-xl font-extrabold leading-tight">
          {isSignup ? "Join Pharvia in under a minute" : "Your health, delivered"}
        </p>
        <ul className="mt-4 space-y-2.5">
          {perks.map(({ Icon, text }) => (
            <li key={text} className="flex items-center gap-2.5 text-sm text-white/90">
              <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-white/15">
                <Icon className="size-3.5" aria-hidden="true" />
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
/* Modal                                                               */
/* ------------------------------------------------------------------ */

export function AuthModal() {
  const navigate = useNavigate();
  const { login, signup, authModal, closeAuth, setAuthMode } = useAuth();
  const { count } = useCart();
  const { open, mode, reason, redirectTo } = authModal;
  const isSignup = mode === "signup";

  const [values, setValues] = useState<AuthValues>(emptyValues);
  const [errors, setErrors] = useState<Partial<Record<keyof AuthValues, string>>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const usernameRef = useRef<HTMLInputElement>(null);

  // Fresh form each time the modal opens.
  useEffect(() => {
    if (!open) return;
    setValues(emptyValues);
    setErrors({});
    setShowPassword(false);
    setCapsLock(false);
  }, [open]);

  const switchMode = (next: AuthMode) => {
    setAuthMode(next);
    setErrors({});
  };

  const update = (field: keyof AuthValues) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues((v) => ({ ...v, [field]: event.target.value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const trackCapsLock = (event: KeyboardEvent<HTMLInputElement>) =>
    setCapsLock(event.getModifierState?.("CapsLock") ?? false);

  const finish = (message: string) => {
    toast.success(message);
    closeAuth();
    if (redirectTo) navigate(redirectTo);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(mode, values);
    setErrors(nextErrors);
    const firstInvalid = Object.keys(nextErrors)[0];
    if (firstInvalid) {
      document.getElementById(`auth-${firstInvalid}`)?.focus();
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
          finish(`Welcome to Pharvia, ${username}!`);
        } catch {
          toast.success("Account created. Please log in.");
          setAuthMode("login");
          setValues({ ...emptyValues, username });
        }
      } else {
        await login(username, values.password);
        finish(`Welcome back, ${username}!`);
      }
    } catch (error) {
      toast.error(getErrorMessage(error, isSignup ? "Signup failed. Please try again." : "Invalid username or password."));
    } finally {
      setSubmitting(false);
    }
  };

  const describedBy = (field: keyof AuthValues) => (errors[field] ? `auth-${field}-error` : undefined);

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
    <Dialog open={open} onOpenChange={(next) => !next && !submitting && closeAuth()}>
      <DialogContent
        className="overflow-hidden p-0 sm:max-w-4xl"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          usernameRef.current?.focus();
        }}
      >
        <div className="grid md:grid-cols-[0.95fr_1.05fr]">
          <BrandPanel mode={mode} />

          <div className="flex flex-col p-6 sm:p-8">
            {/* Compact brand row on phones, where the panel is hidden */}
            <div className="mb-4 flex items-center gap-2 md:hidden">
              <img src={logo} alt="" className="size-8" />
              <span className="font-display font-extrabold text-brand-strong">Pharvia</span>
            </div>

            {reason && (
              <div className="mb-5 flex items-center gap-3 rounded-2xl border border-brand/20 bg-brand-50 p-3 pr-10 text-sm md:pr-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-brand-strong shadow-card">
                  <ShoppingCart className="size-[18px]" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-bold text-slate-900">
                    {isSignup ? "Sign up" : "Log in"} to {reason === "checkout" ? "check out" : "view your cart"}
                  </p>
                  <p className="text-slate-600">
                    {count > 0
                      ? `Your ${count} ${count === 1 ? "item is" : "items are"} saved and waiting.`
                      : "We'll take you straight there after."}
                  </p>
                </div>
              </div>
            )}

            <div className="mr-10 grid grid-cols-2 rounded-xl bg-slate-100 p-1" role="tablist" aria-label="Account">
              {(["login", "signup"] as const).map((tab) => {
                const active = mode === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => switchMode(tab)}
                    className={cn(
                      "relative rounded-lg py-2 text-center text-sm font-semibold transition-colors",
                      active ? "text-slate-900" : "text-slate-500 hover:text-slate-800"
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="auth-modal-tab"
                        className="absolute inset-0 rounded-lg bg-white shadow-sm"
                        transition={{ type: "spring", stiffness: 400, damping: 34 }}
                      />
                    )}
                    <span className="relative">{tab === "login" ? "Log in" : "Sign up"}</span>
                  </button>
                );
              })}
            </div>

            <DialogTitle className="mt-6">{isSignup ? "Create your account" : "Welcome back"}</DialogTitle>
            <DialogDescription className="mt-1">
              {isSignup
                ? "Order medicines, upload prescriptions and track deliveries."
                : "Log in to check out and see your orders."}
            </DialogDescription>

            <form onSubmit={onSubmit} noValidate className="mt-5 space-y-3.5">
              <Field id="auth-username" label="Username" error={errors.username}>
                <IconInput
                  ref={usernameRef}
                  icon={User}
                  id="auth-username"
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

              <Reveal show={isSignup}>
                <Field id="auth-email" label="Email" error={errors.email}>
                  <IconInput
                    icon={Mail}
                    id="auth-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={values.email}
                    onChange={update("email")}
                    invalid={Boolean(errors.email)}
                    aria-describedby={describedBy("email")}
                  />
                </Field>
              </Reveal>

              <Field
                id="auth-password"
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
                  id="auth-password"
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

              <Reveal show={isSignup}>
                <Field id="auth-confirm" label="Confirm password" error={errors.confirm}>
                  <IconInput
                    icon={Lock}
                    id="auth-confirm"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Type it again"
                    value={values.confirm}
                    onChange={update("confirm")}
                    invalid={Boolean(errors.confirm)}
                    aria-describedby={describedBy("confirm")}
                  />
                </Field>
              </Reveal>

              {capsLock && (
                <p className="flex items-center gap-1.5 text-sm font-medium text-amber-700" role="status">
                  <TriangleAlert className="size-4" aria-hidden="true" /> Caps Lock is on
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="!mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-strong text-base font-bold text-white shadow-sm transition hover:bg-brand-strong/90 hover:shadow-lift disabled:opacity-70"
              >
                {submitting && <Spinner aria-hidden="true" />}
                {submitting ? (isSignup ? "Creating account…" : "Logging in…") : isSignup ? "Create account" : "Log in"}
              </button>
            </form>

            {isSignup && (
              <p className="mt-3 text-center text-xs leading-relaxed text-slate-500">
                By creating an account you agree to our Terms &amp; Conditions and Privacy Policy.
              </p>
            )}

            <p className="mt-5 border-t border-slate-100 pt-5 text-center text-sm text-slate-600">
              {isSignup ? "Already have an account? " : "New to Pharvia? "}
              <button
                type="button"
                onClick={() => switchMode(isSignup ? "login" : "signup")}
                className="font-bold text-brand-strong hover:underline"
              >
                {isSignup ? "Log in" : "Create an account"}
              </button>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
