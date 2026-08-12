#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const ROOT = path.resolve(import.meta.dirname, '..');
const SLIDES_DIR = path.join(ROOT, 'slides');

type Annotated = { content: string; summary: string; rationale: string };
type DeckMeta = { title: string; description: string; cover: string };

function deckConfigPath(ppt: string): string {
  return path.join(SLIDES_DIR, ppt, 'deck.config.ts');
}

// ─── AST helpers (unchanged) ─────────────────────────────────────────
// The CLI reads slides/configs by statically parsing them — it never
// executes them. So `text`, `deck`, and `meta` must be bare top-level
// const exports initialised by literals.

function unwrap(expr: ts.Expression): ts.Expression {
  if (ts.isParenthesizedExpression(expr)) return unwrap(expr.expression);
  if (ts.isSatisfiesExpression(expr)) return unwrap(expr.expression);
  if (ts.isAsExpression(expr)) return unwrap(expr.expression);
  return expr;
}

function readStringLiteral(expr: ts.Expression): string | null {
  const e = unwrap(expr);
  if (ts.isStringLiteralLike(e)) return e.text;
  if (ts.isNoSubstitutionTemplateLiteral(e)) return e.text;
  return null;
}

function propKey(prop: ts.PropertyAssignment): string | null {
  const name = prop.name;
  if (ts.isIdentifier(name)) return name.text;
  if (ts.isStringLiteralLike(name)) return name.text;
  return null;
}

function readAnnotated(obj: ts.ObjectLiteralExpression): Annotated | null {
  const out: Partial<Annotated> = {};
  for (const prop of obj.properties) {
    if (!ts.isPropertyAssignment(prop)) continue;
    const key = propKey(prop);
    if (key !== 'content' && key !== 'summary' && key !== 'rationale') continue;
    const val = readStringLiteral(prop.initializer);
    if (val == null) continue;
    out[key] = val;
  }
  if (out.content != null && out.summary != null && out.rationale != null) {
    return out as Annotated;
  }
  return null;
}

function findExportedConst(
  sf: ts.SourceFile,
  name: string,
): ts.Expression | null {
  for (const stmt of sf.statements) {
    if (!ts.isVariableStatement(stmt)) continue;
    const isExport = stmt.modifiers?.some(
      (m) => m.kind === ts.SyntaxKind.ExportKeyword,
    );
    if (!isExport) continue;
    for (const decl of stmt.declarationList.declarations) {
      if (!ts.isIdentifier(decl.name) || decl.name.text !== name) continue;
      if (!decl.initializer) return null;
      return decl.initializer;
    }
  }
  return null;
}

function parse(filePath: string, kind: ts.ScriptKind): ts.SourceFile {
  const src = fs.readFileSync(filePath, 'utf-8');
  return ts.createSourceFile(filePath, src, ts.ScriptTarget.Latest, true, kind);
}

function extractTextExport(filePath: string): Record<string, Annotated> | null {
  const sf = parse(filePath, ts.ScriptKind.TSX);
  const init = findExportedConst(sf, 'text');
  if (!init) return null;
  const obj = unwrap(init);
  if (!ts.isObjectLiteralExpression(obj)) return null;
  const result: Record<string, Annotated> = {};
  for (const prop of obj.properties) {
    if (!ts.isPropertyAssignment(prop)) continue;
    const key = propKey(prop);
    if (!key) continue;
    const valExpr = unwrap(prop.initializer);
    if (!ts.isObjectLiteralExpression(valExpr)) continue;
    const ann = readAnnotated(valExpr);
    if (ann) result[key] = ann;
  }
  return result;
}

function extractDeck(filePath: string): string[] {
  if (!fs.existsSync(filePath)) return [];
  const sf = parse(filePath, ts.ScriptKind.TS);
  const init = findExportedConst(sf, 'deck');
  if (!init) return [];
  const arr = unwrap(init);
  if (!ts.isArrayLiteralExpression(arr)) return [];
  const out: string[] = [];
  for (const el of arr.elements) {
    const v = readStringLiteral(el);
    if (v) out.push(v);
  }
  return out;
}

function extractMeta(filePath: string): Partial<DeckMeta> {
  if (!fs.existsSync(filePath)) return {};
  const sf = parse(filePath, ts.ScriptKind.TS);
  const init = findExportedConst(sf, 'meta');
  if (!init) return {};
  const obj = unwrap(init);
  if (!ts.isObjectLiteralExpression(obj)) return {};
  const out: Partial<DeckMeta> = {};
  for (const prop of obj.properties) {
    if (!ts.isPropertyAssignment(prop)) continue;
    const key = propKey(prop);
    if (key !== 'title' && key !== 'description' && key !== 'cover') continue;
    const val = readStringLiteral(prop.initializer);
    if (val == null) continue;
    out[key] = val;
  }
  return out;
}

// ─── Filesystem discovery (per-PPT) ──────────────────────────────────

// Every subfolder of slides/ is a PPT.
function listPpts(): string[] {
  if (!fs.existsSync(SLIDES_DIR)) return [];
  return fs
    .readdirSync(SLIDES_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();
}

function listSlugs(ppt: string): string[] {
  const dir = path.join(SLIDES_DIR, ppt);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.tsx'))
    .map((f) => f.replace(/\.tsx$/, ''))
    .sort();
}

// Resolve the optional <ppt> arg to the list of PPTs to act on.
function resolvePpts(ppt: string | undefined): string[] {
  const all = listPpts();
  if (!ppt) return all;
  if (!all.includes(ppt)) {
    console.error(
      `No such PPT: slides/${ppt}/  (have: ${all.join(', ') || 'none'})`,
    );
    process.exit(1);
  }
  return [ppt];
}

// ─── Templates ───────────────────────────────────────────────────────

function titleCase(slug: string): string {
  return slug
    .split('-')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');
}

function slideTemplate(slug: string, titleContent?: string): string {
  return `import type { Annotated } from '@/lib/ppt';
import { SlideFrame, Title } from '@/lib/slide-kit';

export const text = {
  title: {
    content: ${JSON.stringify(titleContent ?? titleCase(slug))},
    summary: 'TODO: 一句话说明这页是干嘛的',
    rationale: 'TODO: 记录用户为什么要这页、你为什么这么写',
  },
} satisfies Record<string, Annotated>;

export default function Slide() {
  return (
    <SlideFrame className="flex flex-col items-center justify-center p-32">
      <Title>{text.title.content}</Title>
    </SlideFrame>
  );
}
`;
}

function deckConfigTemplate(title: string): string {
  return `// Deck order and visibility. Comment a line to hide that slide
// (the .tsx file stays in the folder as a backup/reference).
import type { DeckMeta } from '@/lib/ppt';

export const meta = {
  title: ${JSON.stringify(title)},
  description: 'TODO: 一句话说明这份 PPT 是干嘛的',
  // Optional. '' renders the first slide as the landing thumbnail (no
  // tools needed). Got a screenshot tool? Capture /assets/<name>.png and
  // point cover at it. No tool? Leave it.
  cover: '',
} satisfies DeckMeta;

export const deck: string[] = [
  'cover',
];
`;
}

// ─── Commands ────────────────────────────────────────────────────────

function printDeckList(ppt: string): void {
  const deck = extractDeck(deckConfigPath(ppt));
  const meta = extractMeta(deckConfigPath(ppt));
  const all = new Set(listSlugs(ppt));
  const inDeck = new Set(deck);

  console.log(`\n# ${ppt}${meta.title ? `  (${meta.title})` : ''}`);
  if (deck.length === 0) console.log('  (empty deck)');
  for (const [i, slug] of deck.entries()) {
    const missing = all.has(slug) ? '' : '  ⚠ missing file';
    console.log(`  ${String(i + 1).padStart(2)}. ${slug}${missing}`);
  }
  const hidden = [...all].filter((s) => !inDeck.has(s)).sort();
  if (hidden.length > 0) {
    console.log('  Hidden (file exists, not in deck):');
    for (const slug of hidden) console.log(`    - ${slug}`);
  }
}

function cmdList(ppt: string | undefined): void {
  const ppts = resolvePpts(ppt);
  if (ppts.length === 0) {
    console.log('No PPTs found under slides/.');
    return;
  }
  for (const p of ppts) printDeckList(p);
}

function printDeckText(ppt: string): void {
  const deckPath = deckConfigPath(ppt);
  const deck = extractDeck(deckPath);
  const meta = extractMeta(deckPath);
  const all = new Set(listSlugs(ppt));
  const inDeck = new Set(deck);

  console.log(`\n████ ${ppt}${meta.title ? ` — ${meta.title}` : ''} ████`);
  if (deck.length === 0) console.log('\n  (empty deck)');
  for (const [i, slug] of deck.entries()) {
    const file = path.join(SLIDES_DIR, ppt, `${slug}.tsx`);
    console.log(`\n═══ Slide ${i + 1}: ${slug} ═══\n`);
    if (!fs.existsSync(file)) {
      console.log(`  ⚠ missing file: slides/${ppt}/${slug}.tsx`);
      continue;
    }
    const text = extractTextExport(file);
    if (text == null) {
      console.log('  ⚠ no `export const text = {...}` found');
      continue;
    }
    const keys = Object.keys(text);
    if (keys.length === 0) {
      console.log('  (no annotated text)');
      continue;
    }
    for (const key of keys) {
      const ann = text[key];
      console.log(`[${key}]`);
      console.log(`  content:   ${ann.content}`);
      console.log(`  summary:   ${ann.summary}`);
      console.log(`  rationale: ${ann.rationale}`);
      console.log();
    }
  }

  const hidden = [...all].filter((s) => !inDeck.has(s)).sort();
  if (hidden.length > 0) {
    console.log('\n─── Hidden slides ───');
    for (const slug of hidden) console.log(`- ${slug}`);
  }
}

function cmdText(ppt: string | undefined): void {
  const ppts = resolvePpts(ppt);
  if (ppts.length === 0) {
    console.log('No PPTs found under slides/.');
    return;
  }
  for (const p of ppts) printDeckText(p);
}

const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function cmdNew(ppt: string | undefined, slug: string | undefined): void {
  if (!ppt || !slug) {
    console.error('Usage: pnpm ppt new <ppt> <kebab-title>');
    process.exit(2);
  }
  for (const [label, v] of [
    ['ppt', ppt],
    ['slug', slug],
  ] as const) {
    if (!KEBAB.test(v)) {
      console.error(
        `Invalid ${label} "${v}". Use kebab-case (lowercase a-z, 0-9, hyphens).`,
      );
      process.exit(2);
    }
  }
  if (!fs.existsSync(deckConfigPath(ppt))) {
    console.error(`No deck "${ppt}" (slides/${ppt}/deck.config.ts not found).`);
    console.error(`Create it first:  pnpm ppt new-deck ${ppt}`);
    process.exit(1);
  }
  const file = path.join(SLIDES_DIR, ppt, `${slug}.tsx`);
  if (fs.existsSync(file)) {
    console.error(`Already exists: slides/${ppt}/${slug}.tsx`);
    process.exit(1);
  }
  fs.writeFileSync(file, slideTemplate(slug));
  console.log(`Created slides/${ppt}/${slug}.tsx`);
  console.log(
    `(Not added to the deck on purpose — add "${slug}" to the deck array in slides/${ppt}/deck.config.ts.)`,
  );
}

function cmdNewDeck(ppt: string | undefined, title: string | undefined): void {
  if (!ppt) {
    console.error('Usage: pnpm ppt new-deck <ppt> [Title]');
    process.exit(2);
  }
  if (!KEBAB.test(ppt)) {
    console.error(
      `Invalid ppt "${ppt}". Use kebab-case (lowercase a-z, 0-9, hyphens).`,
    );
    process.exit(2);
  }
  if (fs.existsSync(deckConfigPath(ppt))) {
    console.error(`Already exists: slides/${ppt}/deck.config.ts`);
    process.exit(1);
  }
  const deckTitle = title && title.trim() ? title.trim() : titleCase(ppt);
  const dir = path.join(SLIDES_DIR, ppt);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(deckConfigPath(ppt), deckConfigTemplate(deckTitle));
  const coverFile = path.join(dir, 'cover.tsx');
  if (!fs.existsSync(coverFile)) {
    fs.writeFileSync(coverFile, slideTemplate('cover', deckTitle));
  }
  console.log(`Created slides/${ppt}/deck.config.ts and slides/${ppt}/cover.tsx`);
  console.log(`View it at /${ppt}`);
  console.log(
    `(Landing thumbnail renders the first slide by default. Optional: if you have a screenshot tool, capture /assets/${ppt}-cover.png and set meta.cover; otherwise leave it.)`,
  );
}

function main(): void {
  const [cmd, ...rest] = process.argv.slice(2);
  switch (cmd) {
    case 'text':
      cmdText(rest[0]);
      break;
    case 'list':
      cmdList(rest[0]);
      break;
    case 'new':
      cmdNew(rest[0], rest[1]);
      break;
    case 'new-deck':
      cmdNewDeck(rest[0], rest.slice(1).join(' '));
      break;
    default:
      console.error(
        'Usage: pnpm ppt <text [ppt] | list [ppt] | new <ppt> <slug> | new-deck <ppt> [Title]>',
      );
      process.exit(2);
  }
}

main();
