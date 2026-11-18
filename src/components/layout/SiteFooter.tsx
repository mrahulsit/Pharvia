import { useState } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { footerColumns } from "@/data/site";

const socials = [
  { label: "Facebook", Icon: Facebook },
  { label: "Instagram", Icon: Instagram },
  { label: "LinkedIn", Icon: Linkedin },
  { label: "X (Twitter)", Icon: Twitter },
];

function Newsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setEmail("");
    toast.success("Thanks for subscribing!");
  };

  return (
    <form onSubmit={onSubmit} noValidate className="w-full max-w-md">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <div className="flex gap-2 rounded-2xl bg-white/10 p-1.5 ring-1 ring-white/15 focus-within:ring-white/40">
        <input
          id="newsletter-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? "newsletter-error" : undefined}
          className="min-w-0 flex-1 bg-transparent px-3 text-sm text-white placeholder:text-white/50 focus:outline-none"
        />
        <Button type="submit" variant="brand" size="sm" className="rounded-xl">
          Subscribe
        </Button>
      </div>
      {error && (
        <p id="newsletter-error" role="alert" className="mt-2 text-sm text-red-200">
          {error}
        </p>
      )}
    </form>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-slate-950 text-slate-300">
      <div className="bg-linear-to-r from-brand-strong to-accent">
        <div className="container-page flex flex-col items-start justify-between gap-6 py-10 md:flex-row md:items-center">
          <div>
            <h2 className="text-xl font-bold text-white sm:text-2xl">Sign up to our newsletter</h2>
            <p className="mt-1 text-sm text-white/80">
              Stay up to date with the latest news, announcements, articles and blogs.
            </p>
          </div>
          <Newsletter />
        </div>
      </div>

      <div className="container-page grid gap-12 py-14 lg:grid-cols-[1.2fr_2fr]">
        <div className="max-w-sm">
          <div className="inline-flex rounded-2xl bg-white px-3 py-2">
            <Logo />
          </div>
          <p className="mt-5 text-sm leading-relaxed text-slate-400">
            Stay updated with our daily newsletter and become an active user with a chance to win
            exciting prizes every week.
          </p>
          <div className="mt-6 flex gap-2">
            {socials.map(({ label, Icon }) => (
              <span
                key={label}
                title={label}
                className="grid size-10 place-items-center rounded-xl bg-white/5 text-slate-300 ring-1 ring-white/10"
              >
                <Icon className="size-4" aria-hidden="true" />
                <span className="sr-only">{label}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="mb-4 text-sm font-semibold text-white">{column.title}</h3>
              <ul className="space-y-2.5 text-sm">
                {column.links.map((link) =>
                  typeof link === "string" ? (
                    <li key={link} className="text-slate-400">
                      {link}
                    </li>
                  ) : (
                    <li key={link.label}>
                      <Link to={link.to!} className="text-slate-300 transition hover:text-brand">
                        {link.label}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-6 text-xs text-slate-500 sm:flex-row">
          <span>&copy; {new Date().getFullYear()} Pharmacy. All rights reserved.</span>
          <span>Pharmacy — at every step</span>
        </div>
      </div>
    </footer>
  );
}
