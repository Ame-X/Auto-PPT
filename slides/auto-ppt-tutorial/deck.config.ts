// Deck order and visibility for the Auto-PPT tutorial deck.
// Comment a line to hide that slide (the .tsx file stays as a backup).
import type { DeckMeta } from '@/lib/ppt';

export const meta = {
  title: 'Auto-PPT',
  description: 'A tutorial deck about Auto-PPT, made with Auto-PPT.',
  cover: '', // no asset — falls back to the first slide (cover)
} satisfies DeckMeta;

export const deck: string[] = [
  'cover',
  'the-question',
  'the-shape',
  'one-slide-one-file',
  'the-annotated-triple',
  'two-loops',
  'editing-rhythm',
  'hand-it-off',
  'the-bet',
];
