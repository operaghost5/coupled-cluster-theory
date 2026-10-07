#!/usr/bin/env node
// Render one set of notes from its TeX-annotated source.
//
//   node build.js <name> [--out <dir>]
//
// Reads <name>.src.html, renders every $$...$$ and \(...\) block with KaTeX,
// inlines the KaTeX stylesheet and the text fonts as data URIs, and writes
//
//   <out>/<name>.html            standalone page (default <out> is ../docs)
//   build/<name>.artifact.html   the same page without the document skeleton,
//                                which is what claude.ai expects when the page
//                                is published as an artifact
//
// Run fetch-assets.sh once before the first build.
'use strict';
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const name = args.find((a) => !a.startsWith('--'));
if (!name) {
  console.error('usage: node build.js <name> [--out <dir>]');
  process.exit(2);
}
const outFlag = args.indexOf('--out');
const outDir = outFlag >= 0 ? path.resolve(args[outFlag + 1]) : path.resolve(__dirname, '..', 'docs');

const vendor = path.join(__dirname, 'vendor');
if (!fs.existsSync(path.join(vendor, 'katex', 'katex.min.js'))) {
  console.error('vendor assets missing: run fetch-assets.sh first');
  process.exit(1);
}
const katex = require(path.join(vendor, 'katex', 'katex.min.js'));

// Macros available in the sources. Keep this list in step with README.md.
const macros = {
  '\\ket': '|#1\\rangle',
  '\\bra': '\\langle #1|',
  '\\braket': '\\langle #1|#2\\rangle',
  '\\Hb': '\\bar{H}',
  '\\dd': '\\mathrm{d}',
  '\\pd': '\\frac{\\partial #1}{\\partial #2}',
  '\\tr': '\\mathsf{T}',
  '\\bm': '\\mathbf{#1}',
};

const srcPath = path.join(__dirname, name + '.src.html');
let src = fs.readFileSync(srcPath, 'utf8');

let count = 0;
function render(tex, display) {
  count += 1;
  return katex.renderToString(tex, {
    displayMode: display, macros, throwOnError: true, strict: false, trust: false,
  });
}
src = src.replace(/\$\$([\s\S]+?)\$\$/g, (m, tex) => render(tex, true));
src = src.replace(/\\\(([\s\S]+?)\\\)/g, (m, tex) => render(tex, false));
if (/\$\$|\\\(/.test(src)) throw new Error('unrendered TeX delimiters remain');

// KaTeX stylesheet with its woff2 fonts embedded; the woff and ttf fallbacks are dropped.
let kcss = fs.readFileSync(path.join(vendor, 'katex', 'katex.min.css'), 'utf8');
kcss = kcss.replace(
  /src:url\(fonts\/(KaTeX_[\w-]+)\.woff2\) format\("woff2"\),url\(fonts\/[\w-]+\.woff\) format\("woff"\),url\(fonts\/[\w-]+\.ttf\) format\("truetype"\)/g,
  (m, face) => {
    const b64 = fs.readFileSync(path.join(vendor, 'katex', 'fonts', face + '.woff2')).toString('base64');
    return `src:url(data:font/woff2;base64,${b64}) format("woff2")`;
  },
);
if (/url\(fonts\//.test(kcss)) throw new Error('KaTeX font URLs left unreplaced');

// Text fonts: the latin and greek subsets from the Google Fonts stylesheet, embedded.
const gcss = fs.readFileSync(path.join(vendor, 'gfonts', 'fonts.css'), 'utf8');
let gf = '';
let faces = 0;
const re = /\/\* (latin|greek) \*\/\s*@font-face\s*\{([^}]*)\}/g;
let m;
while ((m = re.exec(gcss))) {
  const body = m[2];
  const url = /url\((https:[^)]+)\)/.exec(body)[1];
  const file = path.join(vendor, 'gfonts', path.basename(url));
  if (!fs.existsSync(file)) throw new Error('missing font file ' + file + ': run fetch-assets.sh');
  const b64 = fs.readFileSync(file).toString('base64');
  const decl = body
    .replace(/src:[^;]+;/, `src:url(data:font/woff2;base64,${b64}) format("woff2");`)
    .replace(/font-display:[^;]+;/, '')
    .replace(/\s+/g, ' ')
    .trim();
  gf += `@font-face{${decl}}\n`;
  faces += 1;
}
if (faces === 0) throw new Error('no font faces parsed from vendor/gfonts/fonts.css');

src = src.replace('/*KATEX_CSS*/', () => kcss).replace('/*GFONTS_CSS*/', () => gf);

const parts = src.split('<!-- BODY -->');
if (parts.length !== 2) throw new Error('<!-- BODY --> marker missing or repeated in ' + srcPath);
const [head, body] = parts;

const buildDir = path.join(__dirname, 'build');
fs.mkdirSync(buildDir, { recursive: true });
fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(path.join(buildDir, name + '.artifact.html'), head + body);

const standalone = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
${head}
</head><body>
${body}
</body></html>
`;
const outPath = path.join(outDir, name + '.html');
fs.writeFileSync(outPath, standalone);

console.log(`${name}: ${count} formulas, ${faces} text font faces -> ${path.relative(process.cwd(), outPath)} (${(standalone.length / 1024).toFixed(0)} KB)`);
