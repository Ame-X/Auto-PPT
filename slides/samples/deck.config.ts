// Deck order and visibility for the original sample slides.
// Comment a line to hide that slide (the .tsx file stays as a backup).
import type { DeckMeta } from '@/lib/ppt';

export const meta = {
  title: 'Samples',
  description: 'The original starter slides — layout and primitive references.',
  cover: '', // no asset — falls back to the first slide
} satisfies DeckMeta;

export const deck: string[] = [
  'welcome-to-auto-ppt',
  'how-this-works',
  'a-two-column-example',
];
