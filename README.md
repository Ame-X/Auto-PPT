# Auto-PPT

A slide deck is a folder of React components. Make PPTs by editing
`.tsx` files; let your coding agent do the writing.

## Usage

```sh
pnpm install
pnpm dev          # view slides at http://localhost:5173
```

Hand the repo to a coding agent and tell it what you want.

## For AI agents working in this repo

**Read [`SKILL.md`](./SKILL.md) before doing anything.** It explains the
slide contract, the editing loop, the `Annotated` rationale schema,
the headless CLI, and what's safe vs. risky to modify. Any AI tool
(Claude Code, Cursor, Codex, etc.) cloning or forking this repo
should treat `SKILL.md` as the source of truth.

If your change touches how the Harness itself works — new slide-kit
primitive, modified slide contract, new/removed CLI command, changed
canvas size, etc. — **re-read `SKILL.md` and update it in the same
change**, so the next agent inherits the new convention instead of
the old one.

## Anatomy

- `slides/<kebab-title>.tsx` — one file per slide.
- `slides.config.ts` — deck order and visibility (comment a line to hide).
- `src/lib/slide-kit.tsx` — `SlideFrame` plus a small set of layout
  primitives.
- `scripts/ppt.ts` — headless CLI (`pnpm ppt text | list | new`).
- `SKILL.md` — instructions for the coding agent.

Each slide is a fixed 1920×1080 canvas, scaled to fit the viewport.
