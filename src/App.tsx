import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from 'react';
import type { Annotated, DeckMeta } from './lib/ppt';
import { parseRoute } from './lib/router';

type SlideModule = {
  default: ComponentType;
  text: Record<string, Annotated>;
};

type DeckConfigModule = {
  deck: string[];
  meta: DeckMeta;
};

// Discover every PPT by globbing two levels deep: each slides/{ppt}/
// folder is one PPT, with its own deck.config.ts. Both globs are eager
// so the synchronous render (and the headless-capture contract) needs
// no Suspense boundary. `deck.config.ts` is `.ts`, so the `*.tsx` glob
// never picks it up.
const slideModules = import.meta.glob<SlideModule>('/slides/*/*.tsx', {
  eager: true,
});
const configModules = import.meta.glob<DeckConfigModule>(
  '/slides/*/deck.config.ts',
  { eager: true },
);

type PptEntry = {
  meta: DeckMeta;
  deck: string[];
  bySlug: Map<string, SlideModule>;
};

// Keyed by (ppt, slug): two decks may each legitimately have a `cover`.
const byPpt = new Map<string, PptEntry>();

for (const [filePath, mod] of Object.entries(configModules)) {
  const ppt = filePath
    .replace(/^\/slides\//, '')
    .replace(/\/deck\.config\.ts$/, '');
  byPpt.set(ppt, { meta: mod.meta, deck: mod.deck, bySlug: new Map() });
}

for (const [filePath, mod] of Object.entries(slideModules)) {
  const rel = filePath.replace(/^\/slides\//, '').replace(/\.tsx$/, '');
  const slash = rel.indexOf('/');
  if (slash < 0) continue;
  const ppt = rel.slice(0, slash);
  const slug = rel.slice(slash + 1);
  let entry = byPpt.get(ppt);
  if (!entry) {
    // A folder with slides but no deck.config.ts: still routable.
    entry = { meta: { title: ppt, description: '', cover: '' }, deck: [], bySlug: new Map() };
    byPpt.set(ppt, entry);
  }
  entry.bySlug.set(slug, mod);
}

// Used to resolve the legacy `?slide=` shim when more than one PPT exists.
const DEFAULT_PPT = 'openalice';

// Authoring is localhost (or loopback). A published /{ppt} stays chrome-less
// so a shared deck URL does not leak the owner's landing, or unpublished
// .tsx files.
function isAuthoringOrigin(): boolean {
  const { hostname } = window.location;
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '[::1]'
  );
}

function ScaledStage({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / 1920);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full aspect-video relative overflow-hidden bg-white shadow-2xl rounded-lg"
    >
      <div
        className="absolute top-0 left-0"
        style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
      >
        {children}
      </div>
    </div>
  );
}

// Full-window contain-fit for the single-slide route. Same idea as
// ScaledStage (ResizeObserver + transform), but `min(vw/1920, vh/1080)`
// so a short laptop window letterboxes instead of cropping. Seed scale
// from the window — starting at 0 would give capture tools a 0×0 box.
function fitWindowScale(width: number, height: number): number {
  if (width <= 0 || height <= 0) return 1;
  return Math.min(width / 1920, height / 1080);
}

function FitStage({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(() =>
    fitWindowScale(
      typeof window === 'undefined' ? 1920 : window.innerWidth,
      typeof window === 'undefined' ? 1080 : window.innerHeight,
    ),
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () =>
      setScale(fitWindowScale(el.clientWidth, el.clientHeight));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden flex items-center justify-center bg-slate-900"
    >
      <div
        className="relative overflow-hidden"
        style={{ width: 1920 * scale, height: 1080 * scale }}
      >
        <div
          className="absolute top-0 left-0"
          style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

// One slide. The inner node is the headless-capture contract: native
// 1920×1080, `data-shot-ready="true"`, those exact classes. Do not change
// that node's size or strip the attribute. FitStage scales it to the
// window (letterbox OK) so a laptop sees the full slide. No Export PDF
// chrome — this route stays clean.
function SingleSlide({ ppt, slug }: { ppt: string; slug: string }) {
  const mod = byPpt.get(ppt)?.bySlug.get(slug);
  if (!mod) {
    return (
      <FitStage>
        <div
          data-shot-error="missing"
          className="w-[1920px] h-[1080px] flex flex-col items-center justify-center gap-8 bg-red-950 text-red-200"
        >
          <div className="font-mono text-4xl">
            Missing slide: slides/{ppt}/{slug}.tsx
          </div>
          <a href="/" className="text-sky-400 hover:underline text-2xl">
            ← All decks
          </a>
        </div>
      </FitStage>
    );
  }
  const SlideComponent = mod.default;
  return (
    <FitStage>
      <div
        data-shot-ready="true"
        className="w-[1920px] h-[1080px] overflow-hidden bg-white"
      >
        <SlideComponent />
      </div>
    </FitStage>
  );
}

// A scaled preview of one slide, used for landing thumbnails. Falls back
// to a slug cover, then to the first slide in the deck.
function CoverThumb({ ppt }: { ppt: string }) {
  const entry = byPpt.get(ppt);
  if (!entry) return null;
  const { meta, deck, bySlug } = entry;

  if (meta.cover && /^\/|\.(png|jpe?g|svg|webp|gif|avif)$/i.test(meta.cover)) {
    return (
      <img
        src={meta.cover}
        alt=""
        className="w-full aspect-video object-cover bg-slate-100 rounded-lg"
      />
    );
  }

  const slug = meta.cover && bySlug.has(meta.cover) ? meta.cover : deck[0];
  const mod = slug ? bySlug.get(slug) : undefined;
  if (!mod) {
    return <div className="w-full aspect-video bg-slate-700 rounded-lg" />;
  }
  const SlideComponent = mod.default;
  return (
    <ScaledStage>
      <SlideComponent />
    </ScaledStage>
  );
}

function toDeckKebab(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function CommandRow({
  label,
  cmd,
  copied,
  onCopy,
}: {
  label: string;
  cmd: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <code className="flex-1 truncate rounded-lg bg-slate-900 px-3 py-2 font-mono text-sm text-slate-200 ring-1 ring-white/5">
        {cmd}
      </code>
      <button
        type="button"
        onClick={onCopy}
        className="shrink-0 rounded-lg bg-slate-700 px-3 py-2 text-xs font-medium text-slate-100 hover:bg-slate-600"
        aria-label={`Copy ${label} command`}
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}

// Honest start path: this SPA cannot write files. The panel copies the
// scaffold commands and states the landing visibility rule.
function NewDeckPanel({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('');
  const [copied, setCopied] = useState<'pnpm' | 'bun' | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const slug = toDeckKebab(name);
  const token = slug || '<name>';
  const pnpmCmd = `pnpm ppt new-deck ${token}`;
  const bunCmd = `bun run ppt new-deck ${token}`;

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  async function copy(cmd: string, which: 'pnpm' | 'bun') {
    try {
      await navigator.clipboard.writeText(cmd);
      setCopied(which);
      window.setTimeout(() => {
        setCopied((cur) => (cur === which ? null : cur));
      }, 1600);
    } catch {
      setCopied(null);
    }
  }

  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center bg-black/60 p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-deck-title"
        className="w-full max-w-lg rounded-xl bg-slate-800 p-6 shadow-2xl ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 id="new-deck-title" className="text-xl font-semibold">
            New deck
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-slate-400 hover:text-slate-100"
          >
            Close
          </button>
        </div>
        <p className="mb-4 text-sm text-slate-400 leading-relaxed">
          This app cannot write files. From the repo root, run one of the
          commands below. A new deck will not appear on / until{' '}
          <code className="font-mono text-slate-300">
            {'slides/{ppt}/deck.config.ts'}
          </code>{' '}
          <code className="font-mono text-slate-300">deck</code> array has a
          visible slug.
        </p>
        <label className="mb-3 block text-sm text-slate-400">
          Name
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="my-deck"
            spellCheck={false}
            className="mt-1 w-full rounded-lg bg-slate-900 px-3 py-2 font-mono text-sm text-slate-100 outline-none ring-1 ring-white/10 placeholder:text-slate-600 focus:ring-white/25"
          />
        </label>
        <CommandRow
          label="pnpm"
          cmd={pnpmCmd}
          copied={copied === 'pnpm'}
          onCopy={() => copy(pnpmCmd, 'pnpm')}
        />
        <CommandRow
          label="bun"
          cmd={bunCmd}
          copied={copied === 'bun'}
          onCopy={() => copy(bunCmd, 'bun')}
        />
      </div>
    </div>
  );
}

// The "/" view: a card per hosted PPT. Decks with an empty `deck` array
// (everything commented out) are skipped — a card linking to an empty
// deck reads as broken. "New deck" is a CLI helper, not a file writer.
function Landing() {
  const [newDeckOpen, setNewDeckOpen] = useState(false);
  const ppts = [...byPpt.entries()]
    .filter(([, entry]) => entry.deck.length > 0)
    .sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-16 px-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Decks</h1>
        <p className="text-slate-400 mb-10">
          {ppts.length} {ppts.length === 1 ? 'deck' : 'decks'} hosted here.
        </p>
        {ppts.length === 0 && (
          <p className="mb-8 text-sm leading-relaxed text-slate-500 font-mono">
            No decks with visible slides. Add one with{' '}
            <code>pnpm ppt new-deck &lt;name&gt;</code> or{' '}
            <code>bun run ppt new-deck &lt;name&gt;</code>. A new deck will
            not appear on / until{' '}
            <code>{'slides/{ppt}/deck.config.ts'}</code> <code>deck</code>{' '}
            array has a visible slug.
          </p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {ppts.map(([ppt, entry]) => (
            <a
              key={ppt}
              href={`/${ppt}`}
              className="group flex flex-col gap-4 rounded-xl bg-slate-800 p-5 ring-1 ring-white/5 transition hover:ring-white/20 hover:bg-slate-800/80"
            >
              <CoverThumb ppt={ppt} />
              <div>
                <div className="text-xl font-semibold group-hover:text-white">
                  {entry.meta.title || ppt}
                </div>
                {entry.meta.description && (
                  <div className="mt-1 text-sm text-slate-400 leading-snug">
                    {entry.meta.description}
                  </div>
                )}
                <div className="mt-2 font-mono text-xs text-slate-500">
                  /{ppt} · {entry.deck.length}{' '}
                  {entry.deck.length === 1 ? 'slide' : 'slides'}
                </div>
              </div>
            </a>
          ))}
          <button
            type="button"
            onClick={() => setNewDeckOpen(true)}
            className="group flex min-h-[14rem] flex-col items-center justify-center gap-2 rounded-xl bg-slate-800/40 p-5 text-slate-400 ring-1 ring-dashed ring-white/15 transition hover:bg-slate-800/80 hover:text-slate-200 hover:ring-white/30"
          >
            <span className="text-3xl font-light leading-none">+</span>
            <span className="text-xl font-semibold">New deck</span>
            <span className="text-sm text-slate-500">
              Copy the scaffold command
            </span>
          </button>
        </div>
        {newDeckOpen && (
          <NewDeckPanel onClose={() => setNewDeckOpen(false)} />
        )}
      </div>
    </div>
  );
}

// The "/{ppt}" view: that PPT's full deck, each slide scaled to fit.
function Deck({ ppt }: { ppt: string }) {
  const entry = byPpt.get(ppt);
  if (!entry) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col items-center justify-center gap-4 p-12">
        <div className="font-mono text-2xl">Unknown PPT: {ppt}</div>
        <a href="/" className="text-sky-400 hover:underline">
          ← All decks
        </a>
      </div>
    );
  }

  // Shared /{ppt} stays chrome-less. On localhost: back-link + hidden
  // slugs (ppt new files not in deck). print:hidden keeps both out of PDF.
  const unpublished = [...entry.bySlug.keys()]
    .filter((slug) => !entry.deck.includes(slug))
    .sort();

  return (
    <div className="min-h-screen bg-slate-900 py-12 px-12">
      {isAuthoringOrigin() && (
        <a
          href="/"
          className="fixed top-6 left-6 z-10 text-sm text-slate-400 transition hover:text-slate-100 print:hidden"
        >
          ← All decks
        </a>
      )}
      {/* Export affordance. A deck is a webpage, so "save as PDF" is just
          the browser's print dialog — no tooling, vector text, selectable.
          print:hidden keeps the button itself out of the exported PDF. */}
      <a
        href={`/${ppt}?print`}
        className="fixed bottom-6 right-6 z-10 rounded-full bg-white/90 px-5 py-2.5 text-sm font-medium text-slate-900 shadow-lg ring-1 ring-black/5 backdrop-blur transition hover:bg-white print:hidden"
      >
        Export PDF
      </a>
      <div className="max-w-6xl mx-auto flex flex-col gap-12">
        {entry.deck.map((slug) => {
          const mod = entry.bySlug.get(slug);
          if (!mod) {
            return (
              <div
                key={slug}
                className="text-red-300 font-mono p-8 border border-red-400 rounded bg-red-950/30"
              >
                Missing slide file: <code>slides/{ppt}/{slug}.tsx</code>
              </div>
            );
          }
          const SlideComponent = mod.default;
          return (
            <ScaledStage key={slug}>
              <SlideComponent />
            </ScaledStage>
          );
        })}
        {isAuthoringOrigin() && unpublished.length > 0 && (
          <aside className="print:hidden rounded-lg border border-white/10 bg-slate-800/70 p-6 text-slate-300">
            <div className="mb-3 text-sm font-medium text-slate-100">
              Hidden slides (file exists, not in deck)
            </div>
            <ul className="flex flex-col gap-4 font-mono text-sm">
              {unpublished.map((slug) => (
                <li key={slug}>
                  <div>
                    slides/{ppt}/{slug}.tsx
                  </div>
                  <div className="mt-1 text-slate-400">
                    Add the slug to the <code>deck</code> array in{' '}
                    <code>deck.config.ts</code>.
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </div>
    </div>
  );
}

// The "/{ppt}?print" view: the export-to-PDF surface. The deck is real DOM,
// so "save as PDF" is just the browser's print dialog — vector text, no tool.
//
// It renders the deck twice on purpose:
//   • a scaled on-screen preview (print:hidden) so the page looks like a
//     normal deck while the dialog is open or if the user cancels — NOT raw
//     1920px slides spilling off the viewport;
//   • a raw native-size stack (hidden print:block) that only the printer
//     sees, where the index.css print rules map one slide to one 1920×1080
//     page.
//
// On mount, once fonts + images have settled, we open the dialog exactly
// once. The guard is split on purpose: the ref survives React StrictMode's
// dev-only mount→unmount→remount (a per-effect `let` would reset and fire
// twice), and the cleanup flag cancels the throwaway pass's pending promise.
function PrintDeck({ ppt }: { ppt: string }) {
  const entry = byPpt.get(ppt);
  const printedRef = useRef(false);

  useEffect(() => {
    if (!entry) return;
    let cancelled = false;
    const fire = () => {
      if (cancelled || printedRef.current) return;
      printedRef.current = true;
      window.print();
    };
    // Don't capture mid-load: the serif display face and any <img> assets
    // must be ready or the PDF shows fallback fonts / blank images.
    const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
    const images = Array.from(document.images).map((img) =>
      img.complete
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            img.addEventListener('load', () => resolve(), { once: true });
            img.addEventListener('error', () => resolve(), { once: true });
          }),
    );
    Promise.all([fonts, ...images]).then(() => {
      if (cancelled) return;
      // Two rAFs: let the freshly-loaded fonts/images paint before the
      // synchronous print snapshot freezes the page.
      requestAnimationFrame(() => requestAnimationFrame(fire));
    });
    return () => {
      cancelled = true;
    };
  }, [entry]);

  if (!entry) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col items-center justify-center gap-4 p-12">
        <div className="font-mono text-2xl">Unknown PPT: {ppt}</div>
        <a href="/" className="text-sky-400 hover:underline">
          ← All decks
        </a>
      </div>
    );
  }

  const slides = entry.deck.map((slug) => ({
    slug,
    mod: entry.bySlug.get(slug),
  }));

  return (
    <>
      {/* On-screen preview — scaled to fit, looks like a normal deck.
          print:hidden keeps this whole branch out of the PDF. */}
      <div className="print:hidden min-h-screen bg-slate-900 py-12 px-12">
        <p className="max-w-6xl mx-auto text-sm text-slate-400">
          Your browser's print dialog should open automatically — choose{' '}
          <span className="font-medium text-slate-200">Save as PDF</span>.
          Didn't open? Use the button, bottom-right.
        </p>
        <div className="max-w-6xl mx-auto mt-6 flex flex-col gap-12">
          {slides.map(({ slug, mod }) => {
            if (!mod) {
              return (
                <div
                  key={slug}
                  className="text-red-300 font-mono p-8 border border-red-400 rounded bg-red-950/30"
                >
                  Missing slide file: <code>slides/{ppt}/{slug}.tsx</code>
                </div>
              );
            }
            const SlideComponent = mod.default;
            return (
              <ScaledStage key={slug}>
                <SlideComponent />
              </ScaledStage>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="fixed bottom-6 right-6 z-10 rounded-full bg-white/90 px-5 py-2.5 text-sm font-medium text-slate-900 shadow-lg ring-1 ring-black/5 backdrop-blur transition hover:bg-white"
        >
          Save as PDF
        </button>
      </div>

      {/* Print-only — raw native 1920×1080 slides, one per page. `hidden`
          keeps them off-screen (so Ctrl-F / screen readers see only the
          preview); print:block reveals them for the PDF. */}
      <div className="hidden print:block" aria-hidden="true">
        {slides.map(({ slug, mod }) => {
          if (!mod) {
            return (
              <div
                key={slug}
                className="print-slide w-[1920px] h-[1080px] flex items-center justify-center bg-red-950 text-red-200 font-mono text-4xl"
              >
                Missing slide: slides/{ppt}/{slug}.tsx
              </div>
            );
          }
          const SlideComponent = mod.default;
          return (
            <div
              key={slug}
              className="print-slide w-[1920px] h-[1080px] overflow-hidden bg-white"
            >
              <SlideComponent />
            </div>
          );
        })}
      </div>
    </>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col items-center justify-center gap-4 p-12">
      <div className="font-mono text-2xl">Not found</div>
      <a href="/" className="text-sky-400 hover:underline">
        ← All decks
      </a>
    </div>
  );
}

export default function App() {
  const route = parseRoute();

  switch (route.kind) {
    case 'landing':
      return <Landing />;
    case 'deck':
      return <Deck ppt={route.ppt} />;
    case 'print':
      return <PrintDeck ppt={route.ppt} />;
    case 'slide':
      return <SingleSlide ppt={route.ppt} slug={route.slug} />;
    case 'slide-legacy': {
      // Old "/?slide=<slug>" links: resolve against the sole PPT if there
      // is exactly one, otherwise the default. Kept one release while the
      // screenshot tool is repointed to /{ppt}/{slug}.
      const ppts = [...byPpt.keys()];
      const ppt = ppts.length === 1 ? ppts[0] : DEFAULT_PPT;
      return <SingleSlide ppt={ppt} slug={route.slug} />;
    }
    case 'notFound':
      return <NotFound />;
  }
}
