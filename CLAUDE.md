# The Logo Professionals — CLAUDE.md

## Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript strict
- **Styling:** Tailwind CSS v4 + scoped `.css` files per component
- **Fonts:** Playfair Display (headings) + Inter (body) via `next/font/google`
- **Contact form:** EmailJS (`@emailjs/browser`) + Google reCAPTCHA v2 (`react-google-recaptcha`)
- **Payments:** Stripe (`stripe` server-side) — Checkout Sessions (hosted by Stripe)
- **Package manager:** npm

## Folder Structure

```
src/
  app/                              ← Next.js App Router routes (thin shells only)
    layout.tsx                      ← Root layout: fonts, NavBar, Footer
    page.tsx                        ← / → renders <HomePage />
    globals.css                     ← Design tokens + global resets
    our-clients/page.tsx            ← /our-clients → renders <OurClientsPage />
    about-us/
      page.tsx                      ← /about-us → renders <AboutPage />
      niko-dola/page.tsx            ← /about-us/niko-dola → renders <TeamMemberPage slug="niko-dola" />
      alekxa-dola/page.tsx          ← /about-us/alekxa-dola → renders <TeamMemberPage slug="alekxa-dola" />
      igor-dola/page.tsx            ← /about-us/igor-dola → renders <TeamMemberPage slug="igor-dola" />
    contact-us/page.tsx             ← /contact-us → renders <ContactPage />
    logo-design/
      page.tsx                      ← /logo-design → renders <LogoDesignPage /> (info + process)
      order/
        page.tsx                    ← /logo-design/order → renders <LogoOrderPage /> (brief + payment)
        success/page.tsx            ← /logo-design/order/success → renders <OrderSuccessPage />
        cancel/page.tsx             ← /logo-design/order/cancel → renders <OrderCancelPage />
    api/
      checkout/route.ts             ← POST /api/checkout → creates Stripe Checkout session

  components/
    ui/                             ← Small reusable atoms
      Button.tsx + Button.css
      Input.tsx + Input.css
    sections/                       ← Larger multi-element sections
      NavBar.tsx + NavBar.css
      Footer.tsx + Footer.css
      Hero.tsx + Hero.css           ← Full 100vh video hero (video at /public/hero-video.mp4)
      Testimonials.tsx + Testimonials.css
      PortfolioGrid.tsx + PortfolioGrid.css
      Stats.tsx + Stats.css
      ClientLogos.tsx + ClientLogos.css
      FAQ.tsx + FAQ.css

  featured/                         ← Full page-level components (one per route)
    HomePage.tsx + HomePage.css
    OurClientsPage.tsx + OurClientsPage.css
    AboutPage.tsx + AboutPage.css
    ContactPage.tsx + ContactPage.css
    TeamMemberPage.tsx + TeamMemberPage.css ← Shared parallax page for all 3 team members
    LogoDesignPage.tsx + LogoDesignPage.css ← Info/process page; links to /logo-design/order
    LogoOrderPage.tsx + LogoOrderPage.css   ← Full order form + Stripe redirect
    OrderSuccessPage.tsx + OrderSuccessPage.css
    OrderCancelPage.tsx             ← Uses OrderSuccessPage.css

  lib/
    data.ts                         ← All site content (portfolio, testimonials, team, FAQ, process)
    emailjs.ts                      ← EmailJS send helper

  testing/                          ← Scratch files / experiments
  userContext/                      ← React context providers (if needed)
```

## Design Tokens (globals.css)

| Token | Value |
|-------|-------|
| `--bg` | `#0a0a0a` |
| `--surface` | `#141414` |
| `--card` | `#1c1c1c` |
| `--border` | `#2a2a2a` |
| `--gold` | `#c9a84c` |
| `--gold-light` | `#e4c46e` |
| `--gold-dim` | `#8a6e2a` |
| `--text` | `#f5f5f5` |
| `--text-secondary` | `#a0a0a0` |
| `--text-muted` | `#606060` |

## Environment Variables

Store in `.env.local` (never commit):

```
# EmailJS — https://www.emailjs.com/
NEXT_PUBLIC_EMAILJS_SERVICE_ID=
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=

# Google reCAPTCHA v2 — https://www.google.com/recaptcha
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=

# Stripe — https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY=sk_test_...          ← server-only, never expose
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...   ← safe for client (not currently used)
```

## Commands

```bash
npm run dev      # localhost:3000
npm run build    # production build
npm run lint     # ESLint
```

## Hero Video

Place the hero video at `/public/hero-video.mp4`.
Optionally add `/public/hero-poster.jpg` as the poster image.

## Stripe Payment Flow

1. User visits `/logo-design` → reads info, clicks "Order Here"
2. `/logo-design/order` → fills design brief + selects tier → submits form
3. Client POSTs to `/api/checkout` with brief data + selected tier
4. API creates Stripe Checkout session with price_data (no pre-created price IDs needed)
5. Client redirected to Stripe-hosted checkout page
6. After payment: `/logo-design/order/success?session_id=...`
7. If cancelled: `/logo-design/order/cancel`

### Payment Tiers (defined in `/api/checkout/route.ts`)
| Tier ID | Label | Amount |
|---------|-------|--------|
| `deposit` | 33% Deposit | $60 |
| `full` | Full Payment | $180 |
| `remaining` | Remaining Balance | $120 |

Brief data is stored in Stripe session metadata (accessible in Stripe Dashboard + webhooks).

## Key Rules

- Route files (`app/**/page.tsx`) are thin shells — import and render from `featured/`
- All site content lives in `src/lib/data.ts`
- Each component has its own `.css` file for scoped styles; Tailwind for layout/spacing
- Client components (forms, interactive) use `"use client"` directive
- No inline styles except for dynamic values (parallax scroll offsets)
- TeamMemberPage is a single shared component that accepts a `slug` prop
