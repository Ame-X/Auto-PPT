export type Annotated<T = string> = {
  content: T;
  summary: string;
  rationale: string;
};

// Per-PPT metadata, read by the landing page and the CLI. Lives as a
// top-level `meta` object literal in each slides/{ppt}/deck.config.ts
// (the CLI parses it statically via the AST — keep it a literal).
export type DeckMeta = {
  title: string; // shown on the landing card and the deck header
  description: string; // one line on the landing card
  // Optional landing-card thumbnail. Omit it (or "") and the card renders
  // the deck's first slide live — no tooling required, so that is the
  // default. A "/assets/…" path renders as an <img> (capture one with a
  // screenshot tool if you have it); a slide slug renders that slide.
  cover?: string;
};
