/* eslint-disable react/prop-types */
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { cn, getErrorMessage } from "@/lib/utils";
import { usePageTitle } from "@/lib/usePageTitle";
import loginBanner from "@/assets/img/login-banner.webp";
import signupBanner from "@/assets/img/signup-banner.webp";

function validate(mode, values) {
  const errors = {};
  if (!values.username.trim()) errors.username = "Username is required.";
  if (mode === "signup") {
    if (!values.email.trim()) errors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = "Enter a valid email address.";
    if (values.password.length < 6) errors.password = "Use at least 6 characters.";
  } else if (!values.password) {
    errors.password = "Password is required.";
  }
  return errors;
}

function Field({ id, label, error, children }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      <FieldError id={`${id}-error`}>{error}</FieldError>
    </div>
  );
}

export default function Auth({ mode }) {
  const isSignup = mode === "signup";
  usePageTitle(isSignup ? "Sign up" : "Log in");
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const { login, signup } = useAuth();

  const [values, setValues] = useState({
    username: routerLocation.state?.username ?? "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (event) => {
    setValues((v) => ({ ...v, [field]: event.target.value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate(mode, values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    try {
      if (isSignup) {
        await signup({
          username: values.username.trim(),
          email: values.email.trim(),
          password: values.password,
        });
        toast.success("Account created. Please log in.");
        navigate("/login", { state: { username: values.username.trim() } });
      } else {
        await login(values.username.trim(), values.password);
        toast.success(`Welcome back, ${values.username.trim()}!`);
        navigate(routerLocation.state?.from ?? "/", { replace: true });
      }
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          isSignup ? "Signup failed. Please try again." : "Invalid username or password."
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  const describedBy = (field) => (errors[field] ? `${field}-error` : undefined);

  return (
    <section className="container-page py-10 sm:py-16">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[2rem] border bg-white shadow-lift lg:grid-cols-2">
        <div className="relative hidden bg-[#348a55] lg:block">
          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={mode}
              src={isSignup ? signupBanner : loginBanner}
              alt=""
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="size-full object-cover"
            />
          </AnimatePresence>
        </div>

        <div className="p-6 sm:p-10">
          <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1" role="tablist" aria-label="Account">
            {[
              { to: "/login", label: "Log in", active: !isSignup },
              { to: "/signup", label: "Sign up", active: isSignup },
            ].map((tab) => (
              <Link
                key={tab.to}
                to={tab.to}
                role="tab"
                aria-selected={tab.active}
                replace
                className={cn(
                  "relative rounded-lg py-2 text-center text-sm font-semibold transition-colors",
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

          <h1 className="mt-8 text-2xl font-extrabold sm:text-3xl">
            {isSignup ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-1 text-slate-600">
            {isSignup
              ? "Sign up to order medicines and track your deliveries."
              : "Log in to continue to your account."}
          </p>

          <form onSubmit={onSubmit} noValidate className="mt-8 space-y-5">
            <Field id="username" label="Username" error={errors.username}>
              <Input
                id="username"
                autoComplete="username"
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
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={values.email}
                      onChange={update("email")}
                      invalid={Boolean(errors.email)}
                      aria-describedby={describedBy("email")}
                    />
                  </Field>
                </motion.div>
              )}
            </AnimatePresence>

            <Field id="password" label="Password" error={errors.password}>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={isSignup ? "new-password" : "current-password"}
                  value={values.password}
                  onChange={update("password")}
                  invalid={Boolean(errors.password)}
                  aria-describedby={describedBy("password")}
                  className="pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="absolute right-1.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </Field>

            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting && <LoaderCircle className="animate-spin" />}
              {isSignup ? "Create account" : "Log in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            {isSignup ? "Already have an account? " : "New to Pharmacy? "}
            <Link
              to={isSignup ? "/login" : "/signup"}
              replace
              className="font-semibold text-brand-strong hover:underline"
            >
              {isSignup ? "Log in" : "Create an account"}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
