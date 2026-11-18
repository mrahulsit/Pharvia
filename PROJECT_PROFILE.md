# Pharvia — at every step

**An online pharmacy storefront for India:** search and order medicines, upload a prescription, pin your
delivery pincode on an interactive 3D globe that zooms into a street map, and save with PLUS membership.

> This is the source of truth for describing the project on a resume, LinkedIn, a portfolio or in an
> interview. Keep it up to date as features land, and keep the "Honest scope" section accurate.

---

## The name

**Pharvia = phar(macy) + via** (Latin for "the way"): *the way to your medicines.*

- It sounds like a real medicine brand, not a generic word ("Pharmacy") and not a code tool.
- **via (the way, the path)** pairs with the tagline **"at every step"**: *Pharvia — at every step*.
- The logo is a green **P** whose stem is a medical **plus**, so the mark still reads as P-for-Pharvia and
  as a pharmacy cross.
- **Names considered and rejected** (Nov 2026) because real health businesses already use them: PlusMeds
  (UK online pharmacy), PlusVeda (Indian pharmacy software), Pluscure (Indian pharma company and pharmacy),
  Pill Plus / PillPlus.in, Pillora and Pillvana (medicine apps), Pharmora (Nigerian e-pharmacy), Pranacare,
  Pranika, Punarva, Panakea, Pravita, Paracura, Plusana, Paxora, Pulvia. Also avoided anything like
  "Med + Plus", because **MedPlus** is a major Indian pharmacy chain. "Pluscript" was briefly used but read
  like a code name.
- A web search found "Pharvia" used only by a Mongolian regulatory consultancy and a Thai supplement line;
  there was no Indian pharmacy or e-pharmacy. This is **not** a trademark search. Check the IP India
  register (classes 5, 35 and 44) before using it commercially.

---

## One-liners (pick by length)

- **10 words:** Online pharmacy storefront with prescription upload and geolocated delivery.
- **Resume project title:** *Pharvia — Online Pharmacy Platform (React 19, TypeScript, Node.js, MongoDB)*
- **Elevator pitch:** Pharvia is a full-stack e-pharmacy modelled on Tata 1mg, PharmEasy and Netmeds.
  Customers search medicines, filter and sort listings, upload prescriptions, set a delivery pincode on a
  WebGL globe that flies into a street map, and check out after logging in. It's built with React 19,
  TypeScript and Tailwind v4 on the frontend and Express + MongoDB with JWT auth on the backend.

---

## Tech stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, TypeScript (strict), Vite 5 (SWC), React Router 7 |
| Styling / UI | Tailwind CSS v4 (design tokens via `@theme`), shadcn-style components, Vengeance UI registry components adapted from Next.js to Vite, Radix UI primitives (Dialog, Dropdown Menu, Slider, Tooltip, Slot), lucide icons |
| Motion | Framer Motion (respects `prefers-reduced-motion` everywhere) |
| Maps / geo | **cobe** (WebGL globe), **Leaflet** + OpenStreetMap tiles, OSM **Nominatim** geocoding, India Post pincode API, browser Geolocation API |
| State | React Context (auth, cart, location) with `localStorage` persistence |
| Forms / UX | Client-side validation, password strength meter, toasts (sonner) |
| HTTP | axios |
| Backend | Node.js, Express, MongoDB / Mongoose, bcrypt (bcryptjs), JSON Web Tokens |
| Tooling | ESLint 9 flat config + typescript-eslint, git |
| Hosting (planned) | Vercel (SPA rewrite already configured) + Render/Railway + MongoDB Atlas |

---

## Features (implemented and tested in the browser)

### Storefront
- **Storefront home** modelled on leading Indian e-pharmacies: search-first hero with an animated
  placeholder and "order via" shortcuts, offering tiles with offer ribbons, an auto-playing promo carousel
  (pauses on hover and focus, keyboard and dot controls), a trust bar, a product rail, colour-tinted
  category tiles, a 4-step prescription flow, a PLUS banner and an FAQ.
- **Header**: two-line "Deliver to" location, global search (Ctrl/⌘ K command palette), Upload Rx, account,
  cart badge, and a category bar with an "All categories" mega menu. On mobile there's a drawer menu.
- **Product listing** (Medicine and 8 category pages): form filters (tablets / capsules / inhalers) with
  counts, sorting (relevance, price ↑↓, A–Z) in an accessible dropdown, URL-synced search, empty states.
- **Product cards**: pack-style thumbnails, strength and pack size, price, a computed PLUS member price
  (10%), and an ADD button that turns into a quantity stepper.
- **Cart**: quantities, remove, animated total, bill summary, a PLUS savings nudge, and persistence across
  reloads.

### Delivery location (signature feature)
- **Delivery-location modal with a 3D globe**: entering a 6-digit pincode (auto-checked on the 6th digit)
  looks it up in India Post, geocodes it with a fallback chain (pincode → post office → district → centre
  of India), **rotates a WebGL globe to the spot, then cross-fades into a Leaflet street map that flies
  from country level to street level and drops a pin**. "Use my current location" uses browser
  geolocation and reverse geocoding.
- The location is only saved after the user confirms "Deliver here", and it is saved with its coordinates.

### Accounts and checkout
- **Auth modal** (no separate pages): log in / sign up tabs, brand panel, icon inputs, show/hide password,
  Caps Lock warning, password strength meter, confirm password, inline validation with focus on the first
  error, server error messages surfaced, and **automatic login after signup**.
- **Log in before cart**: logged-out cart clicks open the auth modal and land in the cart afterwards.
  Checkout also requires a delivery pincode.

### Other pages
- **PLUS page**: membership hero with an animated card, benefits, an interactive savings calculator
  (slider), a member-price table, an FAQ and a notify-me form.
- **Offers** with copy-to-clipboard codes, **prescription upload** (drag and drop, previews, type and size
  limits), Healthcare page, and a 404 page.
- **Footer** in the style of 1mg/PharmEasy: trust band, newsletter, app badges, collapsible link columns on
  mobile, a medical disclaimer, and back-to-top.

### Quality
- **Accessibility**:
  - Landmarks, a skip link and one `<h1>` per page.
  - Visible focus rings.
  - WAI-ARIA accordion with arrow, Home and End keys.
  - Keyboard-operable dropdowns, dialogs and tooltips.
  - `aria-live` status messages.
  - Reduced-motion support.
- **Responsive**: tested at 375 px, 768 px and 1366 px with no horizontal scroll.

---

## Engineering highlights (good interview talking points)

1. **Frame-rate-independent globe animation.** The first fly-to eased by a fixed amount per frame, so it
   never "arrived" when frames were throttled. Rewrote it as a time-based easeInOutCubic flight over a
   fixed duration with shortest-path angle interpolation, so it always lands on schedule.
2. **Globe → map hand-off.** Bringing `[lat, lng]` to the front of the globe puts the target at the canvas
   centre, so the map can take over seamlessly. Leaflet `flyTo` handles the zoom-in, and the pin is a
   custom `divIcon`, so no Leaflet image assets are needed.
3. **Lazy loading heavy code.** The WebGL globe (cobe) and Leaflet are loaded with dynamic `import()` only
   when the location modal needs them, and every route is lazy-loaded. The main bundle stays lean.
4. **Fixing a scroll-lock bug.** Radix Select always locks body scroll while open: the scrollbar vanishes,
   the page shifts sideways and the wheel is blocked. Diagnosed it by inspecting body styles and wheel
   events, then rebuilt the sort control on a non-modal Dropdown Menu with the same look.
5. **Geocoding fallback chain.** Nominatim pincode search, then post office, then district, then India's
   centroid. Each result carries a `precise` flag, and the UI shades an approximate area instead of
   showing a misleading pin.
6. **Integrating a third-party component library.** Adapted Vengeance UI (Next.js-oriented) components to
   Vite: removed `"use client"` and Next-only `<style jsx>`, mapped shadcn tokens to brand tokens, and
   replaced missing animation utilities with local keyframes.
7. **Honest UI data.** PLUS member prices are computed from the real 10% benefit, and "coming soon" items
   are labelled with tooltips. There are no fabricated ratings, reviews or discounts.
8. **Auth UX + security awareness.** A client-side route guard returns users to where they were. The
   project documents that the server must enforce auth on every protected endpoint. I audited the existing
   backend and found it couldn't start, logged plain-text passwords and had a broken mailer; the fixes are
   in `BACKEND_TODO.md`.

---

## Honest scope (read before an interview)

| Area | Status |
|---|---|
| Frontend storefront, all pages above | **Done**, tested in the browser |
| Signup / login API (`/api/register`, `/api/login`, bcrypt + JWT) | Route code **exists**. The server still needs its entry file and `package.json` (see `BACKEND_TODO.md` P0) |
| Product catalog | **Static data** in the frontend (10 medicines, 8 categories). API planned |
| Cart | **Client-side** (`localStorage`). Per-user cart API planned |
| Checkout / payments | **UI only** ("Proceeding to payment…"). Orders API + Razorpay planned |
| Prescription upload | **UI only** (validation and previews). Upload endpoint planned |
| Pincode + geocoding | **Live**, but calls public APIs from the browser. A cached backend proxy is planned |
| Offer codes, PLUS, newsletter | **UI only**. Endpoints planned |

When the backend items ship, update this table and the resume bullets, for example adding "built REST
APIs for orders and prescriptions with Razorpay webhooks".

---

## Resume bullets

Pick 3–4. They're written to be true for the current state. The ones marked *(after backend)* only become
true once you build those endpoints.

- Built **Pharvia**, an e-pharmacy storefront in **React 19 + TypeScript + Tailwind CSS v4**, modelled on
  Tata 1mg / PharmEasy: medicine search, filters and sorting, cart, prescription upload and PLUS membership
  pricing across **10+ responsive routes**.
- Designed a **delivery-location flow** that geocodes Indian pincodes (India Post + OpenStreetMap) and
  animates a **WebGL globe (cobe) into a Leaflet street map** to pin the address. Made the animation
  frame-rate independent and lazy-loaded the 3D and map code.
- Rebuilt authentication as an **accessible modal** with inline validation, a password-strength meter and
  auto-login after signup, and added a **log-in-before-cart** flow that returns users to their cart.
  Backend: **Express + MongoDB** with **bcrypt** hashing and **JWT**.
- Integrated and adapted **Radix UI / Vengeance UI** components (dialog, dropdown, slider, tooltip,
  breadcrumb, empty states). Fixed a Radix Select scroll-lock bug and met keyboard and reduced-motion
  accessibility requirements.
- Audited the Node.js backend and wrote a **prioritised API roadmap** (auth hardening, rate limiting, CORS,
  orders, prescriptions, payments, pincode caching) with exact request/response contracts.
- *(after backend)* Implemented REST APIs for products, carts, orders and prescription uploads (Multer +
  private object storage) with JWT-protected routes and server-side price validation.

**Skills / ATS keywords:** React, TypeScript, JavaScript, Vite, Tailwind CSS, Framer Motion, Radix UI,
shadcn/ui, WebGL, Leaflet, OpenStreetMap, REST APIs, axios, Node.js, Express, MongoDB, Mongoose, JWT,
bcrypt, accessibility (WCAG, ARIA), responsive design, ESLint, Git.

---

## Project facts (Nov 2026)

- Frontend: **59** TypeScript/TSX source files, about **8,400** lines. **24** reusable UI components.
  **10** pages, all lazy-loaded except Home, plus legacy-URL redirects.
- Content: 10 medicines, 8 categories, 7 home tiles, 2 offer codes (PHARMA10, STAYHOME).
- Repo layout: `Client/` (frontend, own git repo, work on branch `ui-rebuild`), `Server/` (Express API),
  `BACKEND_TODO.md` (backend roadmap, in the project root next to `Client/`).

## Links (fill in)

- Live demo: _not deployed yet_
- Source code: _add the GitHub URL_
- Screenshots / demo video: _record the globe → map pincode flow; it's the most memorable 15 seconds_

## Assets that still say "Pharmacy"

These images have the old name baked in and need redesigning with the Pharvia wordmark:
`src/assets/img/login-banner.webp` (counter sign), `app-mockup.webp` (splash screen) and
`promo-pharma10.webp` (small footer text). All on-screen text already says Pharvia.
