# Auto-PPT

One repo, many slide decks. Each PPT is a folder of React components.
Make PPTs by editing `.tsx` files; let your coding agent do the writing.

## Usage

```sh
pnpm install
pnpm dev          # landing page (all decks) at http://localhost:5173
                  # one deck   at http://localhost:5173/{ppt}
                  # one slide  at http://localhost:5173/{ppt}/{slug}
```

Hand the repo to a coding agent and tell it what you want.

## For AI agents working in this repo

**Read [`SKILL.md`](./SKILL.md) before doing anything.** It explains the
slide contract, the editing loop, the `Annotated` rationale schema, the
per-PPT deck config, the routes, the headless CLI, and what's safe vs.
risky to modify. Any AI tool (Claude Code, Cursor, Codex, etc.) cloning
or forking this repo should treat `SKILL.md` as the source of truth.

There are two feedback loops: `pnpm ppt text [ppt]` for content edits,
and the single-slide route `/{ppt}/{slug}` (viewed via whatever browser
tool your agent has — Playwright MCP, built-in screenshot, etc.) for
layout edits. The Harness intentionally does not ship a screenshot
tool; use what your agent already provides.

If your change touches how the Harness itself works — new slide-kit
primitive, modified slide contract, new/removed CLI command, changed
deck-config format, changed routing, changed canvas size, etc. —
**re-read `SKILL.md` and update it in the same change**, so the next
agent inherits the new convention instead of the old one.

## Anatomy

- `slides/{ppt}/<kebab-title>.tsx` — one file per slide; the folder is
  the PPT and maps to the `/{ppt}` route.
- `slides/{ppt}/deck.config.ts` — that PPT's `deck` (order + visibility;
  comment a line to hide) plus `meta` (title / description / cover for
  the landing card).
- `src/lib/router.ts` — the slug-based route parser (`/`, `/{ppt}`,
  `/{ppt}/{slug}`).
- `src/lib/slide-kit.tsx` — `SlideFrame` plus a small set of layout
  primitives.
- `src/lib/ppt.ts` — the `Annotated` and `DeckMeta` types.
- `scripts/ppt.ts` — headless CLI (`pnpm ppt text | list | new | new-deck`).
- `vercel.json` — SPA fallback so deep links resolve on static hosts.
- `SKILL.md` — instructions for the coding agent.

The landing page at `/` lists every PPT with a visible deck. Each slide
is a fixed 1920×1080 canvas, scaled to fit the viewport.
