# Auto-PPT

A slide deck is a folder of React components. Make PPTs by editing
`.tsx` files; let your coding agent do the writing.

## Usage

```sh
pnpm install
pnpm dev          # view slides at http://localhost:5173
```

Hand the repo to a coding agent and tell it what you want. It will read
`program.md` and use `pnpm ppt` to inspect and modify the deck.

## Anatomy

- `slides/<kebab-title>.tsx` — one file per slide.
- `slides.config.ts` — deck order and visibility (comment a line to hide).
- `src/lib/slide-kit.tsx` — `SlideFrame` plus a small set of layout
  primitives.
- `scripts/ppt.ts` — headless CLI (`pnpm ppt text | list | new`).
- `program.md` — instructions for the coding agent.

Each slide is a fixed 1920×1080 canvas, scaled to fit the viewport.
