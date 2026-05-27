---
name: auto-ppt
description: Use this skill whenever working in the Auto-PPT repository. Auto-PPT is a Harness where a PPT is a folder of React .tsx slide files. This skill explains the slide contract (Annotated `text` export + default component), deck management (`slides.config.ts`), the fixed 1920×1080 canvas layout model, the headless CLI (`pnpm ppt text|list|new`), and the soft boundary between slide content (safe to edit) and scaffold (escalate first). Trigger on any user request to create, edit, reorder, hide, rename, or restyle a slide, or to extend the layout primitives.
---

# Auto-PPT — instructions for the coding agent

You are working inside Auto-PPT, a Harness that translates "making a
PPT" into editing React code. A slide deck is a folder of `.tsx` files
under `slides/`, ordered and shown/hidden by `slides.config.ts`.
Editing a slide is editing one file. The rendered deck is for the
human; you (the AI) work through the headless CLI and the file tree.

You will not reliably see the rendered output. Do not try to eyeball
screenshots or parse the browser. Use `pnpm ppt text` — that is your
ground truth.

## The loop

For each user request:

1. **Read.** `pnpm ppt text` — per slide it prints every annotated
   string with `content`, `summary`, `rationale`. Hidden slides (file
   exists, not in deck) are listed at the bottom.
2. **Plan.** Identify the minimum set of files to touch. Are you
   adding, editing, reordering, hiding, renaming, restyling?
3. **Edit.** Use Write/Edit on `slides/*.tsx` and `slides.config.ts`.
   For new slides, `pnpm ppt new <kebab-title>` scaffolds the file but
   does **not** add it to the deck — that is a separate explicit edit.
4. **Verify.** `pnpm ppt text` again. Confirm the diff matches the
   request.
5. **Report.** One sentence summary of what changed. Stop.

## Slide file contract

- **Path**: `slides/<kebab-case-title>.tsx`. Semantic, no page numbers.
  Order lives in `slides.config.ts`, never in filenames.
- **Top of file**: `export const text` is a `Record<string, Annotated>`
  object literal. Every renderable string must live here, not inlined
  in JSX. The CLI extracts this via AST — it must be a static object
  literal, not a function call or imported value, or the `text`
  command will skip it.
- **Default export**: a React component returning
  `<SlideFrame>…</SlideFrame>` that consumes `text.<key>.content`.

The `Annotated` triple is the spine of every slide file:

```ts
type Annotated<T = string> = {
  content: T;        // what the audience sees on the slide
  summary: string;   // one short line: what this element is for
  rationale: string; // why the user wanted this, why you wrote it this way
};
```

## Deck config

`slides.config.ts` exports `deck: string[]`. Each entry is a slide slug
(filename without `.tsx`).

- Commenting out a line **hides** that slide. The file stays in
  `slides/` as a backup/reference.
- Hidden slides still appear in `pnpm ppt text` under
  `─── Hidden slides ───`.
- **Never delete a slide file to hide it.** Users keep backup pages
  around; deletion is irreversible, comment-toggling is not.

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
  `SlideFrame`, `Title`, `Body`, `Bullet`, `TwoColumn`. They exist so
  you don't repeat boilerplate, not as a closed set.
- When the primitives are not enough, drop into raw tailwind directly.
  See `slides/a-two-column-example.tsx` for the mixed style — that's
  normal, not a smell.
- Viewport scaling is handled by `App.tsx`'s `ScaledStage`. You do not
  need to think about responsive design inside slides — your canvas is
  always 1920×1080.

## Commands

| Command | What it does |
|---|---|
| `pnpm ppt text` | Dump every slide in deck order with `content` / `summary` / `rationale`. **Main read-state command.** |
| `pnpm ppt list` | Show deck order + hidden slides (slugs only, no bodies). |
| `pnpm ppt new <kebab-title>` | Scaffold a new slide file from template. Does **not** add to deck. |
| `pnpm dev` | Start Vite dev server (for the human to view). |
| `pnpm build` | Production build. |

## Scaffold vs. slide content

Soft convention, not a permission lock. The following are
scaffold-level and rarely need modification when writing slides:

- `scripts/ppt.ts` (the CLI)
- `src/lib/ppt.ts` (the `Annotated` type)
- `src/lib/slide-kit.tsx` (layout primitives)
- `src/App.tsx`, `src/main.tsx`, `src/index.css`
- `vite.config.ts`, `tsconfig*.json`, `package.json`
- `SKILL.md`, `README.md`

If a user request would require modifying any of these, **stop and
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
canvas size, introducing a new scaffold convention — **re-read this
file and update it in the same change**. The next agent's entire
understanding of the project comes from this file; if you let it
drift, every future agent inherits the staleness.

If you only edit slide content or composition, this file does not
need to change.
