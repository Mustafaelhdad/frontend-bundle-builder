# Bundle Builder

A React prototype of a multi-step bundle builder: a two-column desktop experience with a
left-hand accordion builder and a right-hand live review panel that stays in sync as the
shopper configures their security system.

> Design reference (Figma):
> https://www.figma.com/design/3Z0rdwxCKa2RwRbb6h0f15/Untitled?node-id=0-1

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Zustand (state)
- Vitest + React Testing Library

## Getting started

Requires a recent Node (Node 20.19+ or 22+, to match Vite 8 / React 19).

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Quality checks

```bash
npm run lint
npm run format:check
npm run test:run
```

## How it works

- **Data-driven.** The entire builder — steps, products, variants, pre-populated review
  items, pricing, copy, and review-panel config — is rendered from a single structured
  source (`src/data/products.json`, typed by `src/types/bundle-builder.ts`). There is no
  per-product hardcoded markup, so adding or reordering a product is a data change.
- **Single source of truth for state.** A Zustand store
  (`src/store/useBundleBuilderStore.ts`) holds the active step, per-variant quantities,
  per-product quantities, and included-item quantities. Both the product cards and the
  review panel read and mutate the same store, which is what keeps the two quantity
  steppers synchronized.
- **Variant quantities are independent.** Each variant keeps its own quantity. The card's
  stepper only edits the currently selected variant; switching variants never erases
  another variant's quantity, and each selected variant renders as its own line in the
  review panel.
- **Persistence.** "Save my system for later" writes a versioned, sanitized snapshot to
  `localStorage`; on load the app restores it (validating against the current catalog and
  falling back to the initial state if the stored data is invalid).

## Decisions & tradeoffs

These are deliberate choices, not gaps:

- **Review pricing mirrors the Figma's mock exactly.** The Figma's review numbers for the
  pre-populated cameras are not a clean `card unit price × quantity` (e.g. Wyze Cam Pan v3
  shows $34.98 on the card but $47.98 for qty 2 in the review). I chose to reproduce the
  mock's review line items exactly so the **initial totals match the design to the cent**
  ($238.81 / $187.89 / $50.92). The consequence is that increasing a pre-populated
  camera's quantity scales from the review's unit price, which can differ from the card's
  unit price. In a production build I'd normalize to one unit-price source per product (see
  Notes and possible improvements below).
- **System-font fallback instead of Gilroy.** The design uses Gilroy throughout, which is
  not freely redistributable. Rather than ship an unlicensed font, I used a system
  font stack tuned to the design's sizes, weights, and tracking. Swapping in licensed
  Gilroy files would be a drop-in change.
- **Responsive strategy.** Three layouts: side-by-side builder/review on desktop, a wide
  stacked review at very large widths, and a single vertical column with a horizontal card
  carousel on mobile — matching the three Figma frames.
- **Prototype placeholders.** "Learn More" links point to `#` and "Checkout" shows a
  placeholder message, since this is a front-end prototype with no backend.

## Notes and possible improvements

Due to time constraints and my work schedule, I prioritized delivering a completed,
working task over making every detail perfect. The current implementation is not fully
pixel-perfect, but I believe a solid working result is more valuable than a perfect version
that never gets submitted.

With more time, I would focus on the following:

- **Normalize unit pricing.** Derive every review line total from one canonical unit price
  per product (the card price) instead of from the design's mock line items, so the card
  and review math always agree when quantities change.
- **Visible save confirmation.** Saving currently announces success only via an `aria-live`
  region; I'd add a visible toast and a "restored your saved system" banner on load.
- **Refine the visual details** with a more thorough review pass to get closer to
  pixel-perfect.
- **Improve accessibility** — better semantic structure, keyboard navigation, focus states,
  and screen-reader support.
- **Recheck the responsive layout** across more sizes. As I read the design, the left
  frames are mobile, the middle frames are medium/large/xl screens, and the right frames
  are 2xl screens. In my opinion the right frames might actually suit the middle
  breakpoints better, and the middle frames might fit 2xl better — but I followed the
  provided design as given.
- **Add subtle CSS animations** to improve the experience without pulling in a heavy
  animation library.
- **Refactor and organize the styling**, especially the breakpoint-specific classes, to
  make them easier to maintain.
- **Wider automated coverage** — add regression tests specifically for variant-quantity
  retention and the save/restore round-trip.
- **Test on more screen sizes and browsers.** I mainly tested on Chrome; I'd verify on
  Safari and Firefox as well.

## Project structure

```
src/
  app/                      App shell
  data/                     products.json + typed loader (single data source)
  types/                    Domain types for the builder
  store/                    Zustand store (quantities, steps, persistence)
  components/ui/            Reusable primitives (Button, PriceDisplay, QuantityStepper, Icon)
  features/bundle-builder/  BundleBuilder + accordion, product cards, review panel
docs/figma-audit.md         Notes from inspecting the Figma source
```
