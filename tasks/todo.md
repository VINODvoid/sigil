# Implementation Plan: Sigil Principal Dashboard

## Overview

A standalone Next.js 15 (App Router) application at `sigil/apps/dashboard/` delivering a cinematic, luxury-dark UI for the Sigil protocol demo. All data is mocked — no live Solana RPC calls. The app covers five screens: Landing/Hero, Principal Dashboard, Sigil Detail, Registry Explorer, Agent Profile. The visual identity is Zaha Hadid-meets-crypto: obsidian surfaces, gold/amber accents, serif display headings, scroll-triggered reveal animations.

## Assumptions

- No Solana wallet integration required in this phase — wallet address is a hardcoded mock string to simulate "connected" state
- No real transactions; all agent/sigil data is seeded in a local mock data module
- The monorepo does not yet have a root `package.json` or bun workspace config — `apps/dashboard/` is treated as a self-contained app; workspace wiring is deferred
- Framer Motion v11 is used for scroll-triggered animations (`useScroll`, `useTransform`, `motion` components); no GSAP
- shadcn/ui components are installed via the shadcn CLI into the dashboard app only
- `next/font` is used for Playfair Display (serif) and JetBrains Mono (mono); Inter (sans) for body
- No i18n, no auth, no API routes in any phase
- Reputation graph on Agent Profile uses Recharts (shadcn peer dep) with mocked time-series data
- Tailwind version will be whatever `create-next-app` latest scaffolds — if v4 (CSS-based config), tokens go in `globals.css @theme`; if v3, they go in `tailwind.config.ts`

## Architecture Changes

- `sigil/apps/dashboard/` — new Next.js 15 app, created from scratch
- `sigil/apps/dashboard/src/data/mock.ts` — single source of truth for all mock data (agents, sigils, transactions)
- `sigil/apps/dashboard/src/types/index.ts` — shared TypeScript interfaces (Sigil, Agent, Transaction, Principal)
- `sigil/apps/dashboard/src/components/ui/` — shadcn/ui installed component primitives
- `sigil/apps/dashboard/src/components/` — shared design-system components (GlassCard, GoldBadge, SectionReveal, MonoStat, PageShell)
- `sigil/apps/dashboard/src/app/` — App Router pages and layouts
- `sigil/apps/dashboard/tailwind.config.ts` (or `globals.css @theme`) — extended with custom color tokens, font families, animation keyframes
- `sigil/apps/dashboard/src/lib/utils.ts` — `cn()` utility (shadcn standard)

## Implementation Steps

### Phase 1: Project Scaffold — working app with design system tokens

1. **Initialize Next.js 15 app** (`sigil/apps/dashboard/`)
   - Action: Run `bunx create-next-app@latest dashboard --typescript --tailwind --app --src-dir --no-git` inside `sigil/apps/`, then delete all boilerplate content from `page.tsx` and reset `globals.css` to a clean slate
   - Why: Establishes the correct App Router + TypeScript + Tailwind baseline; `--no-git` prevents a nested git repo
   - Depends on: None
   - Risk: Low

2. **Install core dependencies** (`sigil/apps/dashboard/package.json`)
   - Action: `bun add framer-motion recharts`; then `bunx shadcn@latest init` (style: default, base color: neutral, CSS variables: yes); install shadcn components needed: `bunx shadcn@latest add button dialog alert-dialog input select slider checkbox badge progress sheet sonner`
   - Why: Framer Motion for animations, Recharts for reputation graph, shadcn provides pre-built accessible primitives that match the design system
   - Depends on: Step 1
   - Risk: Low

3. **Define TypeScript interfaces** (`sigil/apps/dashboard/src/types/index.ts`)
   - Action: Export interfaces: `Sigil` (id, agentName, agentPubkey, principalPubkey, capabilities, spendLimitPerTx, spendLimitPerDay, spentToday, stakeAmount, reputation, issuedAt, expiresAt, status: 'active'|'revoked'|'expired', attestations), `Agent` (id, name, description, capabilities, pricingModel, pricingAmount, reputation, totalTx, successRate, avgRating, stakeAmount, lastActive, sigilId), `Transaction` (id, agentId, capability, amount, successful, rating, timestamp), `Principal` (walletAddress, totalIssued, activeCount, revokedCount, totalSpend)
   - Why: Types must exist before mock data and components; gives compile-time safety across all screens
   - Depends on: None
   - Risk: Low

4. **Create mock data module** (`sigil/apps/dashboard/src/data/mock.ts`)
   - Action: Export `MOCK_PRINCIPAL`, `MOCK_SIGILS` (10 entries), `MOCK_AGENTS` (15 entries), `MOCK_TRANSACTIONS` (30 entries), `MOCK_REPUTATION_SERIES` (30-day time series per agent). Include a range of capability types: `image-generation`, `code-review`, `translation`, `data-analysis`, `ocr`, `audio-transcription`. Include varied statuses, pricing models, and reputation scores (2.1 to 4.9) to make the UI interesting.
   - Why: Single module means all screens share consistent data; easy to swap for real RPC calls later without touching UI components
   - Depends on: Step 3
   - Risk: Low

5. **Extend design tokens** (`sigil/apps/dashboard/tailwind.config.ts` or `sigil/apps/dashboard/src/app/globals.css`)
   - Action: Add custom color tokens — `obsidian: #0A0A0B`, `surface: #111113`, `surface-raised: #18181B`, `gold: #C9A84C`, `gold-muted: rgba(201,168,76,0.15)`, `border-subtle: rgba(255,255,255,0.08)`. Add font families: `display: ['Playfair Display', 'serif']`, `mono: ['JetBrains Mono', 'monospace']`, `sans: ['Inter', 'sans-serif']`. Add keyframe animations: `shimmer` (background-position slide), `fadeUp` (opacity+translateY), `revealClip` (clip-path height reveal).
   - Why: All visual identity descends from these tokens; components reference tokens not raw hex so global palette changes are a one-line edit
   - Depends on: Step 1
   - Risk: Low

6. **Set up global fonts and root layout** (`sigil/apps/dashboard/src/app/globals.css`, `sigil/apps/dashboard/src/app/layout.tsx`)
   - Action: Load `Playfair_Display`, `JetBrains_Mono`, `Inter` via `next/font/google` in `layout.tsx`; expose them as CSS variables (`--font-display`, `--font-mono`, `--font-sans`); set `background-color: #0A0A0B` and `color: #F5F5F5` on `html`; apply `antialiased` to `body`; set `<html lang="en">` and appropriate `<meta>` viewport
   - Why: Fonts loaded once at root prevent FOUT; CSS variable approach lets Tailwind config reference them cleanly
   - Depends on: Steps 1, 5
   - Risk: Low

7. **Build shared design-system components** (`sigil/apps/dashboard/src/components/`)
   - Action: Create five primitives, all `"use client"` where they use hooks:
     - `GlassCard.tsx` — `div` with `backdrop-blur-md bg-white/5 border border-white/8 rounded-xl p-6`; accepts `glow?: boolean` prop that adds `ring-1 ring-amber-400/20`; accepts `className` for extension
     - `GoldBadge.tsx` — `span` with `bg-amber-400/10 text-amber-400 border border-amber-400/30 font-mono text-xs px-2 py-0.5 rounded-full`
     - `SectionReveal.tsx` — wraps children in `motion.div` with `useInView` (margin `-100px`); animates `opacity` 0→1 and `y` 32→0 over 0.6s; accepts `delay?: number` prop for stagger control
     - `MonoStat.tsx` — labeled metric: label in `text-white/50 text-xs font-sans`, value in `text-white font-mono text-2xl`, optional delta in gold or red
     - `PageShell.tsx` — contains the `motion.header` navbar (scroll-aware transparency via `useScroll`) with logo, nav links, mock wallet chip; wraps `{children}` in `<main>`
   - Why: These atoms give every screen visual consistency without style repetition; encapsulating motion logic here keeps page files clean
   - Depends on: Steps 5, 6
   - Risk: Low

---

### Phase 2: Core Screens — Landing, Principal Dashboard, Sigil Detail

8. **Landing / Hero screen** (`sigil/apps/dashboard/src/app/page.tsx` + `sigil/apps/dashboard/src/app/_components/HeroView.tsx`)
   - Action:
     - Keep `page.tsx` as a server component that imports `HeroView` (client)
     - `HeroView`: full-viewport section with absolute-positioned SVG polygon mesh background (8-10 triangles, `opacity-10`, gold stroke); Framer Motion stagger entrance on headline words using `motion.span` with `variants`; sub-headline fades in 0.4s after headline completes; two CTA buttons with `whileHover` scale; animated down-chevron at bottom that fades out using `useScroll`+`useTransform` opacity
     - Below hero: `SectionReveal` wrapping a three-column feature card row (GlassCard) — Identity, Discovery, Reputation — each with a simple SVG icon and two-line description
     - Below features: full-bleed asymmetric stats band — obsidian background, three gold monospace numbers ("847 Agents", "12,450 Transactions", "$2.3M Volume") arranged with intentional left-offset grid
     - Bottom CTA section: serif headline "Ready to trust your agents?" + single gold button
   - Why: First impression establishes premium brand; cinematic entrance sets tone; multiple sections demonstrate scroll-reveal system
   - Depends on: Steps 5, 6, 7
   - Risk: Medium — animation composition complexity; keep motion variants simple, avoid physics springs on text

9. **Principal Dashboard screen** (`sigil/apps/dashboard/src/app/dashboard/page.tsx` + `sigil/apps/dashboard/src/app/dashboard/_components/DashboardView.tsx`)
   - Action:
     - `page.tsx` server component imports `DashboardView` client component
     - `DashboardView`: renders inside `PageShell`
     - Top bar: "Principal Dashboard" serif heading, mock wallet address in `GoldBadge`, "Issue New Sigil" button (gold filled)
     - Summary row: three `MonoStat` in a `GlassCard` strip — Total Issued, Active, Revoked — values from `MOCK_PRINCIPAL`
     - Sigil list: map `MOCK_SIGILS` to `GlassCard` rows; each row shows: agent name (sans medium), capability `GoldBadge` pills (max 3, "+N more" if overflow), spend bar (`<div>` with gold fill width % = spentToday/spendLimitPerDay, animated to target width on mount), reputation score (mono, color-coded: green >4, amber 2.5-4, red <2.5), status pill (active=green, revoked=red, expired=gray), "View" link and "Revoke" button
     - "Issue New Sigil" shadcn `Dialog`: fields for agent address, capabilities multi-select (checkboxes), spendLimitPerTx (Input), spendLimitPerDay (Input), stakeAmount (Input), expiry date (Input type=date); Submit calls a no-op handler + fires `sonner` toast "Sigil issued successfully"
     - Wrap sigil list in `SectionReveal` with stagger delay per index (0.05s * index)
   - Why: Core demo screen; the spend bars and revoke flow are the primary hackathon talking points
   - Depends on: Steps 4, 7
   - Risk: Low

10. **Sigil Detail screen** (`sigil/apps/dashboard/src/app/dashboard/sigils/[id]/page.tsx` + `.../_components/SigilDetailView.tsx`)
    - Action:
      - `page.tsx`: find sigil by `params.id` from `MOCK_SIGILS`; pass as prop to `SigilDetailView`
      - `SigilDetailView`: two-column layout (lg:grid-cols-5, left col-span-3, right col-span-2)
      - Left: breadcrumb nav, agent name in serif large, principal address in mono small; spend section with large labeled bar (Framer Motion `animate={{ width: percentage }}` on mount, 0.8s ease-out); capabilities section — grid of `GlassCard` tiles, each showing category + allowed domains in mono; attestations section — vertical timeline with type, issuer address, date
      - Right (sticky): `GlassCard` with `MonoStat` entries for issued_at, expires_at, stake (in SOL), PDA address (truncated mono with copy icon); red "Revoke Sigil" button at bottom
      - Revoke button opens shadcn `AlertDialog` ("This action cannot be undone. The agent will immediately lose authorization."); confirm triggers sonner toast "Sigil revoked"
    - Why: Demonstrates the full credential data model; animated spend bar is a memorable visual for demo video
    - Depends on: Steps 4, 7, 9
    - Risk: Low

---

### Phase 3: Registry Screens — Explorer and Agent Profile

11. **Registry Explorer screen** (`sigil/apps/dashboard/src/app/registry/page.tsx` + `sigil/apps/dashboard/src/app/registry/_components/RegistryView.tsx`)
    - Action:
      - Left sidebar (260px on lg+, hidden below — toggled via shadcn `Sheet` on mobile): filter section with capability checkboxes, pricing model checkboxes, min reputation `Slider` (0–5), min stake `Slider` (0–20 SOL), keyword `Input`; "Reset Filters" link
      - Main content: sort bar (`Select` with options Reputation / Stake / Price / Last Active, result count in mono); agent card grid (sm:1-col, md:2-col, xl:3-col); each agent card is `GlassCard` with `whileHover` glow: name, one-line description, capability `GoldBadge` pills, reputation as star display (filled/empty gold stars), stake amount (mono), pricing pill, "View Profile" link
      - Filter and sort state: `useState` in `RegistryView`; filtering and sorting is pure client-side over `MOCK_AGENTS`
      - Staggered entrance: cards animate in with 0.04s stagger delay per index on initial render via `AnimatePresence` + `motion.div` wrapper
      - Empty state: centered `GlassCard` with message "No agents match your filters" if filtered array is empty
    - Why: Discovery screen; real-time client-side filtering is a strong UX demo for "how agents find each other"
    - Depends on: Steps 4, 7
    - Risk: Low

12. **Agent Profile screen** (`sigil/apps/dashboard/src/app/registry/agents/[id]/page.tsx` + `.../_components/AgentProfileView.tsx`)
    - Action:
      - `page.tsx`: find agent by `params.id`; find associated transactions from `MOCK_TRANSACTIONS`; find matching reputation series from `MOCK_REPUTATION_SERIES`; pass as props
      - `AgentProfileView`:
        - Hero band: agent name (serif 48px), short description, status + capability badges row
        - Two-column body:
          - Left (`col-span-3`): `ReputationChart` — `dynamic(() => import('./ReputationChart'), { ssr: false })` to avoid SSR issues; Recharts `AreaChart` (30-day data), area fill as amber gradient, custom tooltip in `GlassCard` style, `SectionReveal` wrapper
          - Right (`col-span-2`): live stats `GlassCard` — total transactions, success rate (%), total volume (USDC), avg rating (star display), last active (relative time in mono)
        - Transaction history: client-side paginated table (10 per page, page `useState`), columns: date (mono), capability (`GoldBadge`), amount (mono gold), success (green check or red x), rating (mini stars or "–"); prev/next pagination controls
        - Pricing section: styled block showing model type and per-call/subscription amount
        - Back link to registry
    - Why: Reputation graph is the strongest visual for the demo video; transaction history demonstrates the accountability model
    - Depends on: Steps 4, 7, 11
    - Risk: Medium — Recharts SSR issue must be guarded with `dynamic` + `{ ssr: false }`; confirm this before running

---

### Phase 4: Polish and Cinematic Completeness

13. **Parallax scroll on Landing hero** (`sigil/apps/dashboard/src/app/_components/HeroView.tsx`)
    - Action: Add `useScroll` targeting the hero section ref; `useTransform` to map scroll 0→500px to `y` 0→-150px on the SVG background (0.3x parallax) and 0→-80px on the headline block (0.15x). Wrap both in `style={{ y }}` on their `motion.div`. Add `useReducedMotion()` guard — if true, skip all parallax transforms.
    - Why: Cinematic scroll requirement; parallax depth is the single biggest visual upgrade between "nice page" and "premium product"
    - Depends on: Step 8
    - Risk: Medium — mobile parallax can feel wrong; cap `useTransform` input range to viewport height, and test at 375px

14. **Scroll-aware navbar** (`sigil/apps/dashboard/src/components/PageShell.tsx`)
    - Action: `useScroll` on `{ offset: ['start start', 'end start'] }`; `useMotionValueEvent` to watch `scrollY` and toggle `isScrolled` boolean at 60px; apply `motion.header` with `animate={{ backgroundColor: isScrolled ? 'rgba(10,10,11,0.9)' : 'transparent', backdropFilter: isScrolled ? 'blur(12px)' : 'blur(0px)' }}`; nav links highlight active route via `usePathname`
    - Why: Transparent-on-hero nav is expected in any premium product; it avoids a hard black bar obscuring the hero art
    - Depends on: Step 7
    - Risk: Low

15. **Loading skeleton simulation** (`sigil/apps/dashboard/src/components/Skeleton.tsx`)
    - Action: Build `PulseSkeleton` — a `div` with `shimmer` animation (moving gradient from `surface` to `surface-raised`); build `DashboardSkeleton` (3 stat cards + 5 row stubs) and `RegistrySkeleton` (9 card stubs); in `DashboardView` and `RegistryView`, add a `useState<boolean>` `loading` initialized to `true`, cleared via `useEffect` with 400ms `setTimeout`; render skeleton while loading, then animate-in real content
    - Why: Simulated loading makes the demo feel real; surface area for showing off the shimmer animation
    - Depends on: Steps 9, 11
    - Risk: Low

16. **Micro-interaction and page transition polish** (all screen components)
    - Action:
      - Add `whileHover={{ scale: 1.015, borderColor: 'rgba(201,168,76,0.35)' }}` and `transition={{ duration: 0.2 }}` to all `GlassCard` interactive instances
      - Add `whileTap={{ scale: 0.97 }}` to all primary and ghost buttons
      - In `sigil/apps/dashboard/src/app/layout.tsx`: wrap page content area in `AnimatePresence mode="wait"` with a `motion.div` keyed by pathname (`usePathname`) that fades in (opacity 0→1, y 8→0, duration 0.3s)
      - Add `cursor-pointer` and `select-none` to all interactive cards
    - Why: Luxury aesthetic requires every interaction to feel deliberate; these final touches are what separates a demo from a prototype
    - Depends on: Steps 8–12
    - Risk: Low

## Testing Strategy

- Unit: No automated tests in this plan (mock-only UI, hackathon timeline constraint) — all correctness verified by manual review
- Integration: Manually navigate all five screens in both desktop (1440px) and mobile (375px) viewports; verify:
  - Filter state in Registry reduces card count in real time
  - Dynamic routes (`/dashboard/sigils/[id]` and `/registry/agents/[id]`) load correct mock data
  - Revoke confirmation dialog blocks action until confirmed
  - Issue Sigil modal fields are all present and submit shows toast
- E2E demo flows to verify before submitting:
  1. Landing scroll → Dashboard → Issue Sigil → View Sigil Detail → Revoke
  2. Landing scroll → Registry → Filter by capability → Sort by reputation → Open Agent Profile → Read reputation graph
- Visual check: Screenshot each screen at 1440px and 375px, verify no horizontal overflow and no layout breaks

## Risks & Mitigations

- **Framer Motion + Next.js 15 Server Components**: Motion components require `"use client"`. Mitigation: all page files are server components that import client `*View` components as leaves; motion logic never lives in a server file.
- **Recharts SSR error**: Recharts uses browser APIs. Mitigation: `ReputationChart` component is always loaded via `dynamic(() => import(...), { ssr: false })`.
- **Tailwind v4 breaking config syntax**: create-next-app latest may scaffold Tailwind v4 which uses `@theme` in CSS instead of `tailwind.config.ts`. Mitigation: check scaffolded version immediately in Step 1 and use the correct config approach; document in a comment.
- **Framer Motion `AnimatePresence` + App Router**: Next.js 15 App Router does not expose a layout-level `usePathname` in server components. Mitigation: page transition wrapper is a separate `"use client"` component inside `layout.tsx`.
- **Animation jank on mobile from parallax + backdrop-blur**: Two GPU-heavy effects combined. Mitigation: `useReducedMotion` disables parallax; `backdrop-blur` is applied only on `GlassCard` (not full-page overlays).

## Success Criteria

- [ ] `bun dev` starts the app at `localhost:3000` with zero TypeScript errors and zero console errors
- [ ] Landing hero entrance animation plays (word stagger, fade-in sub-headline) on first load
- [ ] Hero parallax scroll effect is visible at 1440px viewport
- [ ] Scroll cue chevron fades out on first scroll
- [ ] `SectionReveal` fires on each below-fold section as it enters viewport
- [ ] Principal Dashboard lists all 10 mock sigils with animated spend bars and capability badges
- [ ] "Issue New Sigil" modal opens with all form fields and submit shows sonner toast
- [ ] Sigil Detail page loads via `/dashboard/sigils/[id]` with correct data and animated spend bar
- [ ] Revoke button opens `AlertDialog` and confirm fires toast
- [ ] Registry Explorer filters reduce visible agent card count in real time (no page reload)
- [ ] Agent Profile loads Recharts `AreaChart` without SSR error
- [ ] Loading skeleton shimmer shows for ~400ms before content appears on Dashboard and Registry
- [ ] Scroll-aware navbar transitions transparent → blurred-dark on scroll
- [ ] All five screens render without horizontal overflow at 375px
- [ ] `whileHover` scale effect visible on `GlassCard` instances
- [ ] Page transitions (fade) fire between route changes

---

## Review Section

_To be filled after implementation._
