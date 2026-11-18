/* Vengeance UI: line-hover-link (adapted: renders a React Router <Link>; only the "slide" and "fade"
   variants are kept and their CSS lives in index.css instead of an injected <style> per link). */
import * as React from "react";
import { Link, type LinkProps } from "react-router-dom";
import { cn } from "@/lib/utils";

export type LineHoverVariant = "slide" | "fade";

export interface LineHoverLinkProps extends LinkProps {
  variant?: LineHoverVariant;
}

export const LineHoverLink = React.forwardRef<HTMLAnchorElement, LineHoverLinkProps>(
  ({ variant = "slide", className, ...props }, ref) => (
    <Link ref={ref} className={cn("link-hover", `link-hover--${variant}`, className)} {...props} />
  )
);

LineHoverLink.displayName = "LineHoverLink";

export default LineHoverLink;
