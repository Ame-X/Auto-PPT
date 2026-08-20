# Auto-PPT

One repo, many slide decks. Each PPT is a folder of React components.
Make PPTs by editing `.tsx` files; let your coding agent do the writing.

## Usage

```sh
pnpm install
pnpm dev          # landing page (all decks) at http://localhost:5273
                  # one deck   at http://localhost:5273/{ppt}
                  # one slide  at http://localhost:5273/{ppt}/{slug}
                  # (port 5273 walks up to 5274, … if busy — see the
                  #  URL pnpm dev prints)
```

No `pnpm`? `bun install`, `bun run dev`, and `bun run ppt …` work the
same. The committed lockfile is still `pnpm-lock.yaml`.

Prefer `http://localhost:5273` over `http://127.0.0.1:5273` — Vite may
bind only IPv6 `::1`, so curls to `127.0.0.1` can fail.

Hand the repo to a coding agent and tell it what you want.

## For AI agents working in this repo

**Read [`SKILL.md`](./SKILL.md) before doing anything.** It explains the
slide contract, the editing loop, the `Annotated` rationale schema, the
per-PPT deck config, the routes, the headless CLI, and what's safe vs.
risky to modify. Any AI tool (Claude Code, Cursor, Codex, etc.) cloning
or forking this repo should treat `SKILL.md` as the source of truth.

There are two feedback loops: `pnpm ppt text [ppt]` (or
`bun run ppt text [ppt]`) for content edits, and the single-slide route
`/{ppt}/{slug}` (viewed via whatever browser tool your agent has —
Playwright MCP, built-in screenshot, etc.) for layout edits. The
Harness intentionally does not ship a screenshot tool; use what your
agent already provides.

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
  `/{ppt}?print`, `/{ppt}/{slug}`).
- `src/lib/slide-kit.tsx` — `SlideFrame` plus a small set of layout
  primitives.
- `src/lib/ppt.ts` — the `Annotated` and `DeckMeta` types.
- `scripts/ppt.ts` — headless CLI (`pnpm ppt text | list | new | new-deck`;
  `bun run ppt …` is equivalent).
- `vercel.json` — SPA fallback so deep links resolve on static hosts.
- `SKILL.md` — instructions for the coding agent.

The landing page at `/` lists every PPT with a visible deck. Use **New
deck** there to copy the `pnpm` / `bun` scaffold commands — a new folder
won't appear until its `deck` array has a visible slug. Each slide
is a fixed 1920×1080 canvas, scaled to fit the viewport.

Open any deck and hit **Export PDF** (or just Cmd/Ctrl+P) to save it. The
deck is real DOM, so the export is the browser's own print — one slide per
page, with selectable, searchable vector text. No tooling required.
