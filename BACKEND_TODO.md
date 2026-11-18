# Backend guide: Pharmacy — at every step

What the `Server/` code needs so it works with the rebuilt frontend in `Client/`.
Work through it top to bottom. **P0** gets the server running, **P1** makes login safe,
**P2** builds the features the UI already has screens for, and **P3** gets it production-ready.

All request and response shapes below are what the frontend **already sends or expects**, unless a step
says the frontend must change too. Each step ends with a "Frontend change" note where one is needed.

---

## Current state (what I found)

> Corrected after comparing with GitHub (`mrahulsit/Pharmacy-App`). The GitHub copy of `Server/` is the
> working one. The local copy was an unfinished refactor of it.

| File | Status |
|---|---|
| `Server/server.js` (GitHub) | **Working entry point**: Express app, CORS (`BASE_URL`), Mongo connection, `User` schema, `/api/register` and `/api/login` inline, JSON-error handler, listens on `PORT`. Deployed with `vercel.json`. Uses the deprecated `useNewUrlParser`/`useUnifiedTopology` options. |
| `Server/package.json` (GitHub) | Has express, mongoose, bcryptjs, jsonwebtoken, cors, dotenv, body-parser. **No `start`/`dev` script**, and `main` points to a non-existent `index.js`. |
| `LoginRoute/`, `RegisterRoute/`, `Schema/`, `Mail/` (local) | The same routes split into modules (`express.Router`). **Not wired into `server.js` yet.** `Schema/models.js` connects to Mongo itself. `Mail/Mail.js` is **broken**: `require("createTransport")` should be `require("nodemailer")`. |
| Both versions | **Log the plain-text password** on register (`console.log(..., password, ...)`). The token expires in 1 hour with no refresh. No input validation or rate limiting. |
| 🔴 `Server/.env`, `Client/.env` | **Committed to the public GitHub repo since 2024**, including `MONGO_URI` and `JWT_SECRET`. See **P0 #0**. |
| `Server/node_modules/` | 1,753 dependency files committed. Remove them from git; `npm install` recreates them. |

Frontend env: `VITE_BASE_URL` (login) and `VITE_BASE_REGISTER` (register).

---

## P0: Make the server start

### 0. 🔴 Rotate the leaked secrets (do this first)

`Server/.env` has been public on GitHub since July 2024. Removing the file from the repo does **not** un-leak
it; the values are still in the git history and may have been scraped.

1. **MongoDB Atlas.** Change the database user's password (or create a new user and delete the old one), then
   update `MONGO_URI` in your local `.env` and in Vercel → Project → Settings → Environment Variables. Also
   check Atlas → Network Access, and don't leave `0.0.0.0/0` open unless you need it.
2. **JWT secret.** Generate a new one with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   and set it in the same two places. Every existing login token stops working, which is what you want.
3. **Keep `.env` out of git.** The new root `.gitignore` already does this. Commit `Server/.env.example` with
   the variable **names** only.

### Reconcile the two server versions

Pick one structure. **Recommended:** keep the modular files and make `server.js` mount them:
`app.use("/api/login", require("./LoginRoute/login"))` and the same for register. Then delete the inline
copies from `server.js`, and move the Mongo connection out of `Schema/models.js` into `db.js` (#2 below).
The steps below assume that structure; `server.js` plays the role of `index.js`.

### 1. Fix `Server/package.json`

```json
{
  "name": "pharmacy-server",
  "private": true,
  "type": "commonjs",
  "main": "server.js",
  "scripts": {
    "dev": "node --watch server.js",
    "start": "node server.js"
  }
}
```

Install the dependencies:

```powershell
cd Server; npm install express mongoose bcryptjs jsonwebtoken dotenv cors helmet express-rate-limit zod nodemailer multer
```

### 2. Move the DB connection out of the model

Create `Server/db.js`:

```js
const mongoose = require("mongoose");

async function connectDb() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");
}

module.exports = { connectDb };
```

In `Schema/models.js`, delete the `mongoose.connect(...)` block and the `dotenv` line, and add timestamps:

```js
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true, select: false }, // never returned by default
  },
  { timestamps: true }
);
```

> Because of `select: false`, the login route must ask for the hash explicitly:
> `User.findOne({ username }).select("+password")`.

### 3. Update `Server/server.js` (entry point)

```js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { connectDb } = require("./db");

const app = express();

app.use(helmet());
app.use(express.json({ limit: "100kb" }));
app.use(
  cors({
    origin: (process.env.CORS_ORIGINS || "http://localhost:5173,http://localhost:5174").split(","),
    credentials: true,
  })
);

// Slow down password guessing on the auth routes.
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false });

app.use("/api/login", authLimiter, require("./LoginRoute/login"));
app.use("/api/register", authLimiter, require("./RegisterRoute/register"));
app.get("/api/health", (req, res) => res.json({ ok: true }));

// Last: one error handler so every failure is JSON with a `message` (the frontend shows `message`).
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.expose ? err.message : "Server error" });
});

connectDb()
  .then(() => app.listen(process.env.PORT || 5000, () => console.log(`API on :${process.env.PORT || 5000}`)))
  .catch((err) => {
    console.error("Could not connect to MongoDB", err);
    process.exit(1);
  });
```

The current `server.js` only allows one origin (`BASE_URL`). Add `CORS_ORIGINS=http://localhost:5173,http://localhost:5174` to `Server/.env`, and put your production
domain there later.

**Check:** `npm run dev`, open `http://localhost:5000/api/health` → `{"ok":true}`, then sign up and log in from the site.

### 4. Fix `Mail/Mail.js`

```js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

async function sendMail({ to, subject, html }) {
  return transporter.sendMail({ from: process.env.MAIL_FROM, to, subject, html });
}

module.exports = { sendMail };
```

Add `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM` to `.env`. You need this for password reset (P2 #8).

---

## P1: Make login and signup safe

### 5. Register route

- **Delete the password from the log line.** Log at most the username.
- **Validate the body** with zod and return `400 { message }`. The frontend already validates the same rules, so the two should match:
  - `username`: 3–30 chars, `^[a-zA-Z0-9._-]+$`
  - `email`: valid email; store it lowercased
  - `password`: at least 6 chars. Raise this to 8 when you can; tell me and I'll update the frontend rule and the strength meter.
- **Handle the race on unique fields.** Two signups at the same moment can both pass `findOne`. Catch Mongo's duplicate-key error `err.code === 11000` and return `400 { message: "Username already exists" }` (or the email message). The frontend shows `message` as-is.
- Use `bcrypt.hash(password, 12)`.
- **Response.** The frontend only needs a 2xx status. It then **immediately calls `/api/login`** with the same credentials to sign the user in. You can keep `200 { message }`. Optionally return a token directly (see #6) and I'll skip the second call.

### 6. Login route

- Same zod validation, with `400 { message: "Username and password are required" }`.
- Use `findOne({ username }).select("+password")` (because of `select: false` above).
- Keep the **same message** for unknown user and wrong password (`Invalid credentials`). That's correct as is.
- **Response contract the frontend relies on:** `200 { token }`. Recommended extension:

  ```json
  { "token": "<jwt>", "user": { "id": "…", "username": "…", "email": "…" } }
  ```

  The frontend ignores extra fields today, so this is safe to add first.
- **Token lifetime.** 1 hour logs people out mid-session. Either use `expiresIn: "7d"`, or better, a 15-minute access token plus a refresh token in an `httpOnly` cookie (`POST /api/auth/refresh`).
  - **Frontend change:** if you move to cookies, tell me. axios needs `withCredentials: true` and the app stops using `localStorage.token`.

### 7. Auth middleware + "who am I"

Create `Server/middleware/auth.js`:

```js
const jwt = require("jsonwebtoken");

module.exports = function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Please log in" });
  try {
    req.userId = jwt.verify(token, process.env.JWT_SECRET).userId;
    next();
  } catch {
    res.status(401).json({ message: "Your session has expired. Please log in again." });
  }
};
```

Add `GET /api/me` (protected) → `{ id, username, email, createdAt }`.

- **Frontend change (I'll do it when the endpoint exists):** send `Authorization: Bearer <token>` on every request, call `/api/me` on load to confirm the session, and log out automatically on any `401`.
- **Important:** the site's "log in before cart" rule is **client-side only** right now. Every cart, order and prescription endpoint below **must** use `requireAuth`. Don't trust the UI to enforce it.

---

## P2: Features the UI already has (placeholders waiting for you)

### 8. Forgot / reset password

The login modal shows a disabled **"Forgot password?"** with a "coming soon" tooltip.

| Method | Path | Body | Response |
|---|---|---|---|
| POST | `/api/auth/forgot-password` | `{ email }` | Always `200 { message: "If that email exists, we've sent a reset link." }`, so attackers can't find out which emails are registered |
| POST | `/api/auth/reset-password` | `{ token, password }` | `200 { message }` / `400 { message }` |

- Generate a random token (`crypto.randomBytes(32)`), store **its SHA-256 hash** plus an expiry (30 min) on the user, and email the link `${FRONTEND_URL}/reset-password?token=…` using `Mail.js`.
- On reset: hash the incoming token, find a user with a matching, unexpired hash, set the new password, and clear the token.
- **Frontend change:** I'll enable the link and add the "reset password" screen.

### 9. Products / catalog

Today the 10 medicines and 8 categories are hard-coded in `Client/src/data/catalog.ts`.

Product model, matching the frontend `Product` type:

```js
{ slug: String /* used as id */, name, description /* "500mg tablets" */, price: Number /* rupees */,
  unit: String /* "per 10 units" */, form: "tablet" | "capsule" | "inhaler" | …, category: String /* category slug */,
  requiresPrescription: Boolean, stock: Number, active: Boolean }
```

| Method | Path | Notes |
|---|---|---|
| GET | `/api/products?q=&category=&form=&sort=&page=&limit=` | `sort`: `relevance` · `price-asc` · `price-desc` · `name` (the same keys as the Sort by dropdown). Return `{ items, total, page }`. Add a text index on `name` + `description` for `q`. |
| GET | `/api/products/:slug` | Single product |
| GET | `/api/categories` | `[{ slug, title, description }]`. Images can stay in the frontend for now. |

- Seed the DB from `catalog.ts` so nothing on the site changes.
- **Frontend change:** I'll switch the Medicine/Category pages and search to these endpoints.

### 10. Cart (per user)

The cart currently lives only in the browser (`localStorage["pharmacy:cart"]`), so it's lost across devices.
Item shape: `{ id, name, description, price, unit, form, quantity }`.

| Method | Path | Body | Response |
|---|---|---|---|
| GET | `/api/cart` | – | `{ items: [{ productId, quantity }], … }` populated with product fields |
| PUT | `/api/cart` | `{ items: [{ productId, quantity }] }` | the saved cart |
| POST | `/api/cart/merge` | `{ items: [{ productId, quantity }] }` | merged cart. Call it right after login to merge the guest cart into the account (sum quantities, cap at, say, 10) |

- All three use `requireAuth`. **Ignore any price the client sends**; always read the price from the product.

### 11. Pincode + geocoding endpoint (recommended)

The pincode modal currently calls **two public services straight from the browser**:

1. `https://api.postalpincode.in/pincode/{pin}` (India Post): post office, district, state. It's sometimes slow (I saw 5s+).
2. `https://nominatim.openstreetmap.org/search?postalcode={pin}&countrycodes=in` (OpenStreetMap): latitude/longitude for the globe and map. Nominatim's policy allows **~1 request/second** and asks apps to identify themselves; browsers can't set a proper `User-Agent`.

Move both behind your server and cache them, since pincodes basically never change:

`GET /api/pincode/:pin` →

```json
{ "pincode": "110001", "postOffice": "Baroda House", "district": "Central Delhi", "state": "Delhi",
  "lat": 28.6293, "lng": 77.2190, "precise": true, "serviceable": true, "etaDays": 2 }
```

- Validate `^[1-9]\d{5}$` → `400 { message: "Please enter a valid 6-digit pincode." }`. Unknown pin → `404 { message: "We couldn't find that pincode. Please check it and try again." }`. The modal shows `message`.
- Cache in a `pincodes` collection (or Redis) for 30+ days. Call Nominatim with a real `User-Agent` such as `"PharmacyApp/1.0 (contact@yourdomain)"` and at most one request per second.
- **`serviceable` / `etaDays`.** Right now the UI says "Delivering to …" for every valid pincode. Add a list of pincodes you actually deliver to and return `serviceable: false` for others. I'll show "We don't deliver here yet" in that case.
- Reverse lookup for "Use my current location": `GET /api/pincode/reverse?lat=&lng=` → `{ pincode }` (Nominatim `/reverse`).
- **Frontend change:** I'll point `lookup`/`geocode` in `src/lib/geo.ts` and `LocationContext` at these endpoints.
- **Map tiles.** The street map loads OpenStreetMap's public tiles (`tile.openstreetmap.org`). They're fine for development and light traffic, but OSM's tile policy forbids heavy use. Before launch, get a key from a tile provider (MapTiler, Stadia, Mapbox or Google) and give me the tile URL. It's a one-line change in `LocationMap.tsx`.
- **Save the address on the user.** Store `addresses: [{ label, line1, line2, pincode, postOffice, district, state, lat, lng, isDefault }]` with `GET/POST/PATCH/DELETE /api/addresses`, so checkout can use it.

### 12. Orders / checkout

Checkout currently stops at "Proceeding to payment…" (`Client/src/pages/Cart.tsx`). The UI requires login
**and** a pincode before checkout.

`POST /api/orders` (requireAuth):

```json
{ "items": [{ "productId": "paracetamol", "quantity": 2 }], "addressId": "…", "couponCode": "PHARMA10", "prescriptionId": null }
```

On the server:
1. Load the products and **recompute every price** (never trust the client).
2. Check stock. If any item `requiresPrescription`, require a `prescriptionId` that belongs to this user.
3. Apply the coupon (#14) and the PLUS discount (#15). Delivery is shown as **Free** in the UI today.
4. Save `Order { user, items[{productId, name, price, quantity}], subtotal, discount, deliveryFee, total, address, status: "pending", createdAt }`.
5. Return `{ orderId, total, status }` (or a payment session, below).

Also: `GET /api/orders` (my orders) and `GET /api/orders/:id`.

**Payments.** Use Razorpay (the usual choice in India) or Stripe. Create the payment order on the server,
verify the webhook signature, and only mark the order `paid` from the webhook. **Never handle card details
yourself.** Tell me which provider you pick and I'll add the checkout widget.

### 13. Prescription upload

The `/upload-prescription` page has a `TODO(backend)`. It accepts **up to 5 files**, each **JPG, PNG, WebP or
PDF, at most 5 MB**.

`POST /api/prescriptions` (requireAuth, `multipart/form-data`, field name `files`), using `multer`:

- Enforce the same limits on the server: `limits: { fileSize: 5 * 1024 * 1024, files: 5 }`.
- Check the **file content** (magic bytes), not just the extension or MIME type the browser sends. The `file-type` package works.
- Store files in private object storage (S3 / Cloudinary / Firebase Storage), **never** in a public folder. Prescriptions are health data. Serve them only through short-lived signed URLs to the owner and your pharmacists.
- Save `Prescription { user, files[{ key, mime, size }], status: "received" | "verified" | "rejected", notes, createdAt }` and return `{ prescriptionId, status }`.
- The UI promises "We'll call you to confirm your medicines", so you'll need the user's **phone number**. Add `phone` to the user (or to this request) and an internal list of prescriptions to review.

### 14. Offer codes

The site advertises **PHARMA10** (flat 10% off any medicine, "guaranteed benefits up to ₹1000") and
**STAYHOME** (20% off + 20% cashback on the first order).

`POST /api/coupons/validate` `{ code, items }` → `{ valid, discount, message }`.
Model: `Coupon { code, type: "percent" | "flat", value, maxDiscount, minOrder, firstOrderOnly, startsAt, endsAt, usageLimit, perUserLimit }`.
Apply it again inside `POST /api/orders`; don't trust the validate call alone.

### 15. PLUS membership

The PLUS page and every product card show a **10% member price** (`plusPrice()` in `catalog.ts`), and the
page collects emails for a "notify me" list.

- Now: `POST /api/plus/waitlist` `{ email }` → `200 { message }`. Store it, de-duplicated.
- Later: add `plus: { active, startsAt, endsAt }` to the user, and apply 10% off medicines in `POST /api/orders` when it's active.

### 16. Newsletter

The footer form currently only shows a toast. Add `POST /api/newsletter` `{ email }` → `200 { message }`
(de-duplicated, with an unsubscribe token). Apply the same rate limit as the auth routes.

---

## P3: Production checklist

- **One API base URL.** Merge `VITE_BASE_URL` and `VITE_BASE_REGISTER` into `VITE_API_URL`. Tell me and I'll update the frontend.
- **HTTPS only** in production. Set `JWT_SECRET` to a long random value (`openssl rand -hex 32`), and rotate it if it has ever been shared.
- **Logging.** Never log passwords, tokens or prescription contents. Use a logger (pino) instead of `console.log`.
- **Indexes.** `users.username` and `users.email` (unique), `products` text index, `orders.user + createdAt`, `pincodes.pincode` (unique).
- **Validation everywhere** (zod) and the same error shape everywhere: `{ message }` (plus optional `errors: { field: message }`; I can show these inline under each field).
- **Health data.** Prescriptions and order history are sensitive. Restrict who can read them, keep an audit trail, and follow India's DPDP Act 2023 (consent, deletion on request).
- **Pharmacy rules.** Selling prescription (Schedule H/H1/X) medicines online needs a verified prescription and a licensed pharmacist in the loop. Check the current Drugs & Cosmetics rules and e-pharmacy regulations before launch. This is a legal question, not just a coding one.
- **Deploy.** The frontend is set up for Vercel (`vercel.json`). The API can go on Render, Railway or Fly.io, with MongoDB on Atlas. Add the deployed frontend URL to `CORS_ORIGINS`.

---

## Suggested order

1. P0 #1–4: server starts, signup + login work from the site.
2. P1 #5–7: safe auth, `requireAuth`, `/api/me`.
3. P2 #11: pincode endpoint (removes the slow, rate-limited browser calls).
4. P2 #9 → #10 → #12: products → cart → orders (payments last).
5. P2 #13: prescriptions (needs storage + phone number).
6. P2 #8, #14–16: password reset, coupons, PLUS, newsletter.
7. P3 before launch.

When an endpoint is ready, tell me its path and response, and I'll wire up the frontend side marked
"Frontend change" above.
