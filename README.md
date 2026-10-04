# STAMP OS — AI Catalog Engine (Demo)

**Live demo:** https://stampos-demo.vercel.app

STAMP OS is an internal tool concept for SUGAR Cosmetics: upload reference
photos for a product SKU, "train" a model on them, and generate a full set
of catalog-ready images (studio, texture, flatlay, closeup, hand, model, and
environment shots) without a physical photoshoot. This repo is a front-end
demo of that product — the full UI and user flow, built to show what the
real tool would feel like to use.

> **Note:** This is a frontend demo with a simulated AI backend. Uploads,
> "training," and generation are real UI flows with real file handling and
> realistic timing/progress/retry behavior, but the actual image generation
> is not live — results are a pre-rendered image set served per SKU/shade
> rather than produced by a live model.

## What the demo shows

- **Multi-SKU result system** — results for two product lines (foundation
  and lipstick), each with multiple shades and ~7 shot types per shade,
  dynamically read from disk and grouped/scored per shot type
  (`src/lib/results.ts`).
- **Simulated AI training flow** — onboarding and generate screens walk
  through an upload → training → generation sequence with realistic staged
  progress, not an instant stub.
- **Real file upload** — actual drag/drop and file-picker upload handling
  (`UploadTrainingPanel`, `useSimulatedUpload`), not a mocked input.
- **Retry layer** — simulated failure/retry handling so the flow behaves
  like a real pipeline that can fail a step and recover, rather than a
  happy-path-only demo.
- Full supporting app shell: dashboard, brand, review, products, batches,
  analytics, team, settings, billing, and API docs screens.

## Tech stack

- [Next.js](https://nextjs.org) (App Router, Turbopack)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- Deployed on [Vercel](https://vercel.com)

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run start   # run the production build locally
npm run lint
```
