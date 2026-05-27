import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from 'react';
import { deck } from '../slides.config';
import type { Annotated } from './lib/ppt';

type SlideModule = {
  default: ComponentType;
  text: Record<string, Annotated>;
};

const modules = import.meta.glob<SlideModule>('/slides/*.tsx', { eager: true });

const bySlug = new Map<string, SlideModule>();
for (const [filePath, mod] of Object.entries(modules)) {
  const slug = filePath.replace(/^\/slides\//, '').replace(/\.tsx$/, '');
  bySlug.set(slug, mod);
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

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 py-12 px-12">
      <div className="max-w-6xl mx-auto flex flex-col gap-12">
        {deck.map((slug) => {
          const mod = bySlug.get(slug);
          if (!mod) {
            return (
              <div
                key={slug}
                className="text-red-300 font-mono p-8 border border-red-400 rounded bg-red-950/30"
              >
                Missing slide file: <code>slides/{slug}.tsx</code>
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
    </div>
  );
}
