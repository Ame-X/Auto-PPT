// Deck order and visibility for the OpenAlice deck.
// Comment a line to hide that slide (the .tsx file stays as a backup).
import type { DeckMeta } from '@/lib/ppt';

export const meta = {
  title: 'OpenAlice',
  description: 'A full-stack AI trading agent — your one-person Wall Street.',
  cover: '', // falls back to the first slide (openalice-cover)
} satisfies DeckMeta;

export const deck: string[] = [
  'openalice-cover',
  'openalice-pain-assets',
  'openalice-pain-lifecycle',
  'openalice-introducing',
  'openalice-full-spectrum',
  'openalice-full-lifecycle',
  'openalice-trading-as-git',
  'openalice-workspaces',
  'openalice-why-now',
  'openalice-vision',
];
