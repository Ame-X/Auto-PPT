// The whole router. Three path shapes plus a legacy query-param shim —
// no router library, no provider, no client-side navigation. Links are
// plain <a href>, so each view is a fresh page load (the single-slide
// route is hit fresh by a headless screenshot tool). Keeping this a
// pure function means nothing wraps the `data-shot-ready` capture node.
//
//   /                      -> landing  (list every hosted PPT)
//   /{ppt}                 -> deck     (that PPT's full scrollable deck)
//   /{ppt}/{slug}          -> slide    (one slide, native 1920×1080)
//   /?slide={slug}         -> legacy   (old single-slide URL; resolved
//                                       against the default/sole PPT)
//   anything else          -> notFound

export type Route =
  | { kind: 'landing' }
  | { kind: 'deck'; ppt: string }
  | { kind: 'slide'; ppt: string; slug: string }
  | { kind: 'slide-legacy'; slug: string }
  | { kind: 'notFound' };

export function parseRoute(
  pathname: string = window.location.pathname,
  search: string = window.location.search,
): Route {
  const legacy = new URLSearchParams(search).get('slide');
  const segs = pathname.split('/').filter(Boolean).map(decodeURIComponent);
  if (segs.length === 0) {
    return legacy ? { kind: 'slide-legacy', slug: legacy } : { kind: 'landing' };
  }
  if (segs.length === 1) return { kind: 'deck', ppt: segs[0] };
  if (segs.length === 2) return { kind: 'slide', ppt: segs[0], slug: segs[1] };
  return { kind: 'notFound' };
}
