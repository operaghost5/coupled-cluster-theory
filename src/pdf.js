#!/usr/bin/env node
// Print one set of notes to PDF with Chromium through Playwright.
//
//   node pdf.js <name> [--out <dir>]
//
// Reads <out>/html/<name>.html (written by build.js; default <out> is ../docs)
// and writes <out>/pdf/<name>.pdf, Letter size, light theme, with the page's
// <title> and page numbers in the footer. The margins default to 20mm; a
// source may override them with <meta name="pdf-margin" content="12mm 14mm">
// using the CSS shorthand order (one to four values).
'use strict';
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const name = args.find((a) => !a.startsWith('--'));
if (!name) {
  console.error('usage: node pdf.js <name> [--out <dir>]');
  process.exit(2);
}
const outFlag = args.indexOf('--out');
const docsDir = outFlag >= 0 ? path.resolve(args[outFlag + 1]) : path.resolve(__dirname, '..', 'docs');

function loadPlaywright() {
  for (const spec of ['playwright', '/opt/node-tools/node_modules/playwright']) {
    try { return require(spec); } catch (e) { /* try the next location */ }
  }
  console.error('playwright not found: run `npm install` in src/ and then `npx playwright install chromium`');
  process.exit(1);
}
const { chromium } = loadPlaywright();

(async () => {
  const htmlPath = path.join(docsDir, 'html', name + '.html');
  if (!fs.existsSync(htmlPath)) throw new Error(htmlPath + ' not found: run build.js first');
  const html = fs.readFileSync(htmlPath, 'utf8');
  const title = (/<title>([^<]*)<\/title>/.exec(html) || [, name])[1];
  const marginMeta = /<meta\s+name="pdf-margin"\s+content="([^"]+)"/.exec(html);
  const m = marginMeta ? marginMeta[1].trim().split(/\s+/) : ['20mm'];
  if (m.length < 1 || m.length > 4) throw new Error('pdf-margin needs one to four values');
  const margin = { top: m[0], right: m[1] || m[0], bottom: m[2] || m[0], left: m[3] || m[1] || m[0] };

  const browser = await chromium.launch();
  const page = await browser.newPage();
  const issues = [];
  page.on('pageerror', (e) => issues.push(String(e)));
  page.on('requestfailed', (r) => issues.push('request failed: ' + r.url()));
  await page.goto('file://' + htmlPath, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.emulateMedia({ media: 'print', colorScheme: 'light' });

  const pdfDir = path.join(docsDir, 'pdf');
  fs.mkdirSync(pdfDir, { recursive: true });
  const pdfPath = path.join(pdfDir, name + '.pdf');
  await page.pdf({
    path: pdfPath,
    format: 'Letter',
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate:
      '<div style="font-size:8.5px;color:#666;width:100%;text-align:center;font-family:Helvetica,Arial,sans-serif;">' +
      title + ' &middot; page <span class="pageNumber"></span> of <span class="totalPages"></span></div>',
    margin,
  });
  await browser.close();

  if (issues.length) {
    console.log('page issues:');
    issues.forEach((e) => console.log('  ' + e));
  }
  console.log(`${name}: -> ${path.relative(process.cwd(), pdfPath)}`);
})().catch((e) => { console.error(e); process.exit(1); });
