#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const ROOT = path.resolve(import.meta.dirname, '..');
const SLIDES_DIR = path.join(ROOT, 'slides');
const DECK_FILE = path.join(ROOT, 'slides.config.ts');

type Annotated = { content: string; summary: string; rationale: string };

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

function extractTextExport(filePath: string): Record<string, Annotated> | null {
  const src = fs.readFileSync(filePath, 'utf-8');
  const sf = ts.createSourceFile(
    filePath,
    src,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
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
  const src = fs.readFileSync(filePath, 'utf-8');
  const sf = ts.createSourceFile(
    filePath,
    src,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
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

function listSlugs(): string[] {
  if (!fs.existsSync(SLIDES_DIR)) return [];
  return fs
    .readdirSync(SLIDES_DIR)
    .filter((f) => f.endsWith('.tsx'))
    .map((f) => f.replace(/\.tsx$/, ''))
    .sort();
}

function cmdList(): void {
  const deck = extractDeck(DECK_FILE);
  const all = new Set(listSlugs());
  const inDeck = new Set(deck);
  const hidden = [...all].filter((s) => !inDeck.has(s)).sort();

  console.log('Deck:');
  if (deck.length === 0) console.log('  (empty)');
  for (const [i, slug] of deck.entries()) {
    const missing = all.has(slug) ? '' : '  ⚠ missing file';
    console.log(`  ${String(i + 1).padStart(2)}. ${slug}${missing}`);
  }
  if (hidden.length > 0) {
    console.log('\nHidden slides (file exists, not in deck):');
    for (const slug of hidden) console.log(`  - ${slug}`);
  }
}

function cmdText(): void {
  const deck = extractDeck(DECK_FILE);
  const all = new Set(listSlugs());
  const inDeck = new Set(deck);

  for (const [i, slug] of deck.entries()) {
    const file = path.join(SLIDES_DIR, `${slug}.tsx`);
    console.log(`\n═══ Slide ${i + 1}: ${slug} ═══\n`);
    if (!fs.existsSync(file)) {
      console.log(`  ⚠ missing file: slides/${slug}.tsx`);
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

function cmdNew(slug: string | undefined): void {
  if (!slug) {
    console.error('Usage: pnpm ppt new <kebab-title>');
    process.exit(2);
  }
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    console.error(
      `Invalid slug "${slug}". Use kebab-case (lowercase a-z, 0-9, hyphens).`,
    );
    process.exit(2);
  }
  const file = path.join(SLIDES_DIR, `${slug}.tsx`);
  if (fs.existsSync(file)) {
    console.error(`Already exists: slides/${slug}.tsx`);
    process.exit(1);
  }
  const titleGuess = slug
    .split('-')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');
  const template = `import type { Annotated } from '@/lib/ppt';
import { SlideFrame, Title } from '@/lib/slide-kit';

export const text = {
  title: {
    content: '${titleGuess}',
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
  fs.mkdirSync(SLIDES_DIR, { recursive: true });
  fs.writeFileSync(file, template);
  console.log(`Created slides/${slug}.tsx`);
  console.log(
    `(Not added to deck. Edit slides.config.ts to include "${slug}".)`,
  );
}

function main(): void {
  const [cmd, ...rest] = process.argv.slice(2);
  switch (cmd) {
    case 'text':
      cmdText();
      break;
    case 'list':
      cmdList();
      break;
    case 'new':
      cmdNew(rest[0]);
      break;
    default:
      console.error('Usage: pnpm ppt <text | list | new <slug>>');
      process.exit(2);
  }
}

main();
