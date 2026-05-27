# program.md — instructions for the coding agent

You are working inside Auto-PPT, a Harness for making slides by editing
React components. A PPT here is **a sequence of `.tsx` files under
`slides/`**, ordered by `slides.config.ts`. Your job is to translate the
user's natural-language requests about slides into edits in this repo.

## The loop

For each user request:

1. **Read the current state.** Run `pnpm ppt text` to dump the deck as
   structured plain text (per-slide `content` + `summary` + `rationale`).
   This is your source of truth — do not parse the rendered browser
   output, do not eyeball screenshots.
2. **Plan the edit.** Decide whether you're:
   - adding a new slide → `pnpm ppt new <kebab-title>`, then edit the
     file and add the slug to `slides.config.ts`;
   - modifying an existing slide → edit `slides/<slug>.tsx` directly;
   - reordering or hiding → edit `slides.config.ts`.
3. **Make the edit.** Use Edit/Write on the relevant files.
4. **Verify.** Run `pnpm ppt text` again. Confirm the change matches what
   the user asked for.
5. **Report.** Tell the user what changed in one sentence, then stop.

## File conventions

- **One slide per file**, at `slides/<kebab-case-title>.tsx`. No page
  numbers in filenames (`02-intro.tsx` is wrong; `intro.tsx` or
  `why-this-matters.tsx` is right). Order lives in `slides.config.ts`,
  not in filenames.
- **Top of each slide file** exports `text` as a
  `Record<string, Annotated>` object literal. Every renderable string in
  the JSX must live here, not inlined in the component.
  - `content`: the actual text the audience sees on the slide.
  - `summary`: one short line explaining what this element is for.
  - `rationale`: why the user wanted this, and why you wrote it this
    way. **Update it when you change `content`.** Do not invent post-hoc
    rationales — if you don't know the user's reason, write
    `TODO: ask user` and ask in your reply.
- **Default export**: a React component returning
  `<SlideFrame>…</SlideFrame>` that consumes `text.<key>.content`.
- **Deck order and visibility** live in `slides.config.ts`. Hiding a
  page = commenting out its line. **Do not delete slide files** to hide
  them; commenting is reversible, deletion is not, and the user may
  want hidden pages around as backups.

## Layout

- Canvas is fixed at **1920×1080 pixels**. Think in absolute pixels when
  picking type sizes and spacing — `text-[96px]`, `p-32`, etc. work as
  expected.
- Prefer composing `SlideFrame` + the primitives in
  `src/lib/slide-kit.tsx` (`Title`, `Body`, `Bullet`, `TwoColumn`).
- When the primitives are not enough, drop into raw tailwind. That's
  expected and normal — see `slides/a-two-column-example.tsx` for the
  mixed style.

## Commands

- `pnpm ppt text` — dump every slide in deck order with annotations.
- `pnpm ppt list` — show deck order plus any hidden (un-decked) slides.
- `pnpm ppt new <kebab-title>` — scaffold a new slide file from a
  template. Does **not** add it to the deck — adding is an explicit
  separate edit to `slides.config.ts`.
- `pnpm dev` — start the Vite dev server for the user to view results.
- `pnpm build` — production build.

## Things you should not touch

Soft convention, not a technical lock. The following are scaffold-level
and rarely need modification when authoring slides:

- `scripts/ppt.ts` (CLI)
- `src/lib/ppt.ts` (`Annotated` type)
- `src/lib/slide-kit.tsx` (primitives — extending is OK if a primitive
  is genuinely missing, but check with the user first)
- `src/App.tsx`, `src/main.tsx`, `src/index.css`
- `vite.config.ts`, `tsconfig*.json`, `package.json`

If you find yourself wanting to change any of these, **stop and tell the
user.** The Harness maintainer wants to know when users hit friction
that requires touching the scaffold — that's the signal for the scaffold
to absorb the pattern.
