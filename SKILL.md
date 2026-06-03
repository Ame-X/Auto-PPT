---
name: auto-ppt
description: Use this skill whenever working in the Auto-PPT repository. Auto-PPT is a Harness that hosts MANY PPTs in one repo — each PPT is a folder `slides/{ppt}/` of React .tsx slide files with its own `deck.config.ts`. This skill explains the slide contract (Annotated `text` export + default component), per-PPT deck management (`slides/{ppt}/deck.config.ts` exporting `deck` + `meta`), slug-based routing (`/`, `/{ppt}`, `/{ppt}/{slide}`), the fixed 1920×1080 canvas layout model, the headless CLI (`pnpm ppt text|list|new|new-deck`), and the soft boundary between slide content (safe to edit) and scaffold (escalate first). Trigger on any user request to create, edit, reorder, hide, rename, or restyle a slide, add or manage a PPT, or extend the layout primitives.
---

# Auto-PPT — instructions for the coding agent

You are working inside Auto-PPT, a Harness that translates "making a
PPT" into editing React code. **One repo hosts many PPTs.** Each PPT is
a folder `slides/{ppt}/` of `.tsx` slide files, ordered and shown/hidden
by that folder's own `slides/{ppt}/deck.config.ts`. Editing a slide is
editing one file. The rendered decks are for the human; you (the AI)
work through the headless CLI and the file tree.

There are two distinct feedback loops, and using the wrong one for the
job is the most common failure mode:

- **Content loop** — `pnpm ppt text [ppt]` is ground truth. For anything
  about wording, ordering, bullets, or rationale, do not look at
  screenshots. Reading the rendered image while editing copy invites
  visual bias ("looks fine") and self-deception.
- **Layout loop** — `pnpm ppt text` tells you nothing about whether
  text overflows the canvas, whether two columns collide, or whether a
  font size reads at the back of the room. For layout, font size, and
  spacing decisions, you need to *see* the slide. See
  [Looking at slides](#looking-at-slides) below.

Pick the loop that matches the job. Don't cross the streams.

## Routes

Routing is slug-based and hand-rolled (`src/lib/router.ts`, no router
library). Three shapes plus a legacy shim:

| URL | What renders |
|---|---|
| `/` | Landing page — a card per hosted PPT (skips empty decks). |
| `/{ppt}` | That PPT's full deck, each slide scaled to fit. |
| `/{ppt}/{slide}` | One slide, native 1920×1080, no chrome. **Headless-capture route.** |
| `/?slide=<slug>` | Legacy shim — resolves against the sole PPT, else `openalice`. Will be removed once external screenshot tools are repointed to `/{ppt}/{slide}`. |

## The loop

For each user request:

1. **Read.** `pnpm ppt text [ppt]` — per slide it prints every annotated
   string with `content`, `summary`, `rationale`. With no `ppt` arg it
   dumps every PPT, grouped. Hidden slides (file exists, not in that
   PPT's deck) are listed at the bottom of each PPT's section.
2. **Plan.** Identify the PPT and the minimum set of files to touch. Are
   you adding, editing, reordering, hiding, renaming, restyling, or
   adding a whole new PPT?
3. **Edit.** Use Write/Edit on `slides/{ppt}/*.tsx` and
   `slides/{ppt}/deck.config.ts`. For a new slide,
   `pnpm ppt new <ppt> <kebab-title>` scaffolds the file but does **not**
   add it to the deck — that is a separate explicit edit. For a whole
   new PPT, `pnpm ppt new-deck <ppt> [Title]`.
4. **Verify.** `pnpm ppt text [ppt]` again for content changes. For
   layout changes, also open the slide in a browser (see
   [Looking at slides](#looking-at-slides)).
5. **Report.** One sentence summary of what changed. Stop.

## Looking at slides

The dev server exposes a clean single-slide route designed for
headless capture and visual inspection:

```
http://localhost:5173/{ppt}/{slug}
```

This renders one slide at native 1920×1080 with no chrome, no
scaling, on a white background. The element has `data-shot-ready="true"`
once mounted, which a browser-driving tool can wait on. A missing ppt or
slug renders a `data-shot-error="missing"` box instead.

If you have a browser tool available — Playwright MCP, a built-in
browser/screenshot capability, a `chrome-devtools` MCP, whatever your
host provides — point it at that URL to inspect a slide. The Harness
deliberately does not bundle a screenshot tool: it stays
tool-agnostic, and your agent already has one.

When to actually look:

- You changed font sizes, padding, columns, or any visual primitive.
- You added a slide and need to confirm content fits the canvas.
- The user reports a visual problem ("title is cut off", "too dense").

When **not** to look:

- You only changed `content` strings. The text loop is sufficient and
  the screenshot will tempt you to silently re-edit copy based on what
  looks pretty.
- You are reordering or hiding slides. `pnpm ppt list` is enough.

## Slide file contract

- **Path**: `slides/{ppt}/<kebab-case-title>.tsx`. Semantic, no page
  numbers. The PPT is the folder; order lives in that folder's
  `deck.config.ts`, never in filenames.
- **Top of file**: `export const text` is a `Record<string, Annotated>`
  object literal. Every renderable string must live here, not inlined
  in JSX. The CLI extracts this via AST — it must be a static object
  literal, not a function call or imported value, or the `text`
  command will skip it.
- **Default export**: a React component returning
  `<SlideFrame>…</SlideFrame>` that consumes `text.<key>.content`.
- **Imports use the `@` alias** (`@/lib/ppt`, `@/lib/slide-kit`), which
  resolves to `src/` at any folder depth — so a slide file works the
  same wherever it lives.

The `Annotated` triple is the spine of every slide file:

```ts
type Annotated<T = string> = {
  content: T;        // what the audience sees on the slide
  summary: string;   // one short line: what this element is for
  rationale: string; // why the user wanted this, why you wrote it this way
};
```

## Deck config (per PPT)

Each PPT folder has its own `slides/{ppt}/deck.config.ts`. It exports
**two separate top-level consts**:

```ts
import type { DeckMeta } from '@/lib/ppt';

export const meta = {
  title: 'OpenAlice',                       // landing card + deck header
  description: 'One line for the landing card.',
  cover: '',                                // optional thumbnail — see below
} satisfies DeckMeta;

export const deck: string[] = [
  'openalice-cover',                        // each entry is a slide slug
  // commenting a line hides that slide (the .tsx file stays as backup)
];
```

- `meta.cover` is **optional** and degrades gracefully. Omit it (or use
  `''`) and the landing card renders the deck's first slide live — this
  needs no tooling, so it is the default and works for any agent. If you
  happen to have a screenshot tool, you *can* capture a `/assets/<name>.png`
  thumbnail and point `cover` at it (renders as an `<img>`, lighter to
  load); a slide slug renders that specific slide. No screenshot tool?
  Skip it — the live first-slide render is the intended baseline, not a
  degraded fallback. (Don't generate cover images just to fill the field.)
- Commenting out a `deck` line **hides** that slide. The file stays in
  the folder as a backup/reference. Hidden slides still appear in
  `pnpm ppt text` under `─── Hidden slides ───` for that PPT.
- A PPT with an empty (all-commented) `deck` is **omitted from the
  landing page**.
- **Never delete a slide file to hide it.** Users keep backup pages
  around; deletion is irreversible, comment-toggling is not.

> **AST constraint — do not break this.** The CLI parses configs
> statically (it never executes them). `deck` MUST be a bare top-level
> `const` initialised by an **array literal**, and `meta` a bare
> top-level `const` initialised by an **object literal**. If you nest
> them (`export const config = { deck, meta }`) or compute them, the CLI
> silently reads an **empty** deck/meta with no error — the deck renders
> blank. `satisfies DeckMeta` / `as const` are fine (the parser unwraps
> them).

## The `rationale` field — keep it honest

`rationale` is the field that decays first. The natural pressure when
editing is to write something that sounds reasonable, regardless of
whether you actually know why the user wanted it that way. Resist this.

Rules:

- When you change `content`, update `rationale` to reflect why the new
  text is what it is. If you don't know the user's reason, write
  `TODO: ask user — <specific question>` and ask them in your reply.
  An honest TODO is much better than an invented justification.
- Do not write rationales for content you didn't author and whose
  origin you don't know.
- "Looks good", "matches the style", "fits the layout" are not
  rationales. A rationale ties content to a stated user intent or to
  a deliberate design choice with a stated reason.

This field exists so that "why is this slide so short?" three weeks
from now has a real answer. Corrupting it defeats the entire Harness.

## Layout and the canvas

- Canvas is **fixed at 1920×1080 px**. Think in absolute pixels for
  type size and spacing — `text-[96px]`, `p-32`, etc. work as expected.
- Prefer composing the primitives in `src/lib/slide-kit.tsx`:
  `SlideFrame`, `Title`, `Body`, `Bullet`, `TwoColumn`, `Asset`. They
  exist so you don't repeat boilerplate, not as a closed set.
- When the primitives are not enough, drop into raw tailwind directly.
  See `slides/samples/a-two-column-example.tsx` for the mixed style —
  that's normal, not a smell.
- Viewport scaling is handled by `App.tsx`'s `ScaledStage`. You do not
  need to think about responsive design inside slides — your canvas is
  always 1920×1080.

### Images via `Asset` (placeholder pattern)

When a slide needs an image you don't have yet, use `Asset`. It is
deliberately designed so that *missing image* is a visible, routable
state, not an invisible TODO.

```tsx
<Asset
  src="/assets/file-tree.svg"
  width={900}
  height={650}
  description="A file tree on the left showing slides/{ppt}/*.tsx and deck.config.ts; arrows from the config to a stack of rendered slide thumbnails on the right."
/>
```

Behavior:

- **`src` resolves to a real file** → renders as `<img>` at the given
  dimensions.
- **`src` empty, or the file 404s** → renders a dashed grey box at the
  given dimensions, showing the size, the description, and the target
  path. This is the placeholder state.

The placeholder is the workflow signal. Write a *thorough*
`description` — it functions as the spec for whoever (human or
image-gen agent) lands the actual file at `src`. Once the file exists
at that path, the placeholder disappears with no slide-file edit
required.

Conventions:

- Images live under `public/assets/`. Reference them as `/assets/foo.svg`.
- For "program-drawn" diagrams (file trees, arrow diagrams, simple
  flow charts), prefer inline `<svg>` in the slide JSX — no asset
  needed, no placeholder needed.
- For photos, screenshots, logos, or anything raster, use `Asset`.

## Commands

| Command | What it does |
|---|---|
| `pnpm ppt text [ppt]` | Dump slides with `content` / `summary` / `rationale`. No arg = every PPT grouped; with a `ppt` = just that one. **Main read-state command.** |
| `pnpm ppt list [ppt]` | Show deck order + hidden slides (slugs only). No arg = every PPT; with a `ppt` = just that one. |
| `pnpm ppt new <ppt> <kebab-title>` | Scaffold a new slide file in `slides/{ppt}/`. The PPT must already exist (have a `deck.config.ts`). Does **not** add to the deck. |
| `pnpm ppt new-deck <ppt> [Title]` | Scaffold a whole new PPT: a folder with `deck.config.ts` + a starter `cover.tsx`. Renders immediately at `/{ppt}`. |
| `pnpm dev` | Start Vite dev server. Landing at `/`; a deck at `/{ppt}`; a single slide at `/{ppt}/{slug}` for headless capture. |
| `pnpm build` | Production build (`tsc -b && vite build`). |
| `pnpm preview` | Serve the production build locally (verifies SPA fallback for deep links). |

## Hosting

Routing reads `window.location.pathname` in a single SPA bundle, so deep
links need history-API fallback. Dev and `pnpm preview` get this for
free (Vite's default `appType: 'spa'`). For static deploys, `vercel.json`
rewrites every non-`/assets/` path to `/index.html`; the `(?!assets/)`
exclusion is load-bearing (don't shadow the hashed bundle or images). A
non-Vercel host needs the equivalent (Netlify: `_redirects` with
`/assets/*` passthrough before `/* /index.html 200`).

## Scaffold vs. slide content

Soft convention, not a permission lock. The following are
scaffold-level and rarely need modification when writing slides:

- `scripts/ppt.ts` (the CLI)
- `src/lib/ppt.ts` (the `Annotated` + `DeckMeta` types)
- `src/lib/router.ts` (the route parser)
- `src/lib/slide-kit.tsx` (layout primitives)
- `src/App.tsx`, `src/main.tsx`, `src/index.css`
- `vite.config.ts`, `vercel.json`, `tsconfig*.json`, `package.json`
- `SKILL.md`, `README.md`

(A PPT's `slides/{ppt}/deck.config.ts` is **content**, not scaffold —
editing the `deck` array or `meta` to reorder/hide/retitle is part of
the normal loop.)

If a user request would require modifying any scaffold file, **stop and
tell the user** before doing it. Two reasons:

1. There may be an in-scaffold way to satisfy the request that the
   user didn't realize.
2. Even when a scaffold change is correct, the maintainer wants to
   know when users hit friction that requires it — that's the signal
   for the scaffold to absorb the pattern. Surface it, then proceed
   if the user confirms.

You technically can edit anything. The convention is for surfacing
friction, not enforcing locks.

## When to ask, when to act

- **Just act**: clear, unambiguous requests on slide content or layout
  ("change the title to X", "add a bullet about Y", "swap slides 2 and
  3", "hide the appendix").
- **Ask first**:
  - Anything that requires touching scaffold files (see above).
  - Requests where rationale would have to be invented (you'd have to
    rewrite an existing element without knowing why it's there).
  - Major structural changes (rewriting the whole deck, changing the
    visual style across all slides).
  - Genuinely ambiguous wording where two reasonable readings produce
    different decks.

When asking, give the user concrete choices, not open-ended questions.

## Updating this skill

If you make a non-trivial change to how this Harness works — adding a
slide-kit primitive, changing the slide-file contract, adding or
removing a CLI command, changing the deck-config format, altering the
canvas size, changing the routing / single-slide route, introducing a
new scaffold convention — **re-read this file and update it in the same
change**. The next agent's entire understanding of the project comes
from this file; if you let it drift, every future agent inherits the
staleness.

If you only edit slide content or composition, this file does not
need to change.
