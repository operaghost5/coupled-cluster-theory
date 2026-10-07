# Building the notes

The pages and PDFs in `../docs` are generated from the `*.src.html` files in
this directory. Each source is an HTML page whose mathematics is written in
TeX; `build.js` renders the TeX with KaTeX ahead of time and embeds the
stylesheet and fonts, so the finished page needs no JavaScript and no network
access, and `pdf.js` prints it with Chromium.

## Requirements

- Node.js 18 or newer
- `curl` (for `fetch-assets.sh`)
- Playwright with its Chromium build, for the PDF step only:
  `npm install` in this directory, then `npx playwright install chromium`

## Build

```sh
cd src
sh fetch-assets.sh        # once: downloads KaTeX and the text fonts into vendor/
node build.js exponentials-for-coupled-cluster
node build.js coupled-cluster-refresher
node build.js cc-energy-coefficients
node build.js coupled-cluster-gradients
node build.js thouless-multicomponent-ccsd
node pdf.js   exponentials-for-coupled-cluster
node pdf.js   coupled-cluster-refresher
node pdf.js   cc-energy-coefficients
node pdf.js   coupled-cluster-gradients
node pdf.js   thouless-multicomponent-ccsd
```

or, equivalently, `npm run all`. `build.js` writes `../docs/<name>.html` and
`build/<name>.artifact.html`; `pdf.js` writes `../docs/<name>.pdf`. Both take
`--out <dir>` to write somewhere else. `vendor/` and `build/` are not
committed.

## Files

| File | Purpose |
| --- | --- |
| `exponentials-for-coupled-cluster.src.html` | Source of the notes on the properties of operator exponentials that CC theory uses |
| `coupled-cluster-refresher.src.html` | Source of the refresher on CC theory and the CCSD equations |
| `cc-energy-coefficients.src.html` | Source of the notes on where the coefficients in the CC energy formula come from |
| `coupled-cluster-gradients.src.html` | Source of the notes on analytic CC gradients |
| `thouless-multicomponent-ccsd.src.html` | Source of the notes on Thouless' theorem and multicomponent (NEO) CCSD |
| `build.js` | TeX rendering, font embedding, page assembly |
| `pdf.js` | PDF printing through Playwright |
| `fetch-assets.sh` | Downloads KaTeX 0.16.11 and the Google Fonts subsets |

## Editing a source

A source file has three parts, in order:

1. `<title>` and a `<style>` block. The style block defines the colour and
   font tokens on `:root` for light and dark themes, holds the two placeholder
   comments `/*GFONTS_CSS*/` and `/*KATEX_CSS*/` that `build.js` replaces with
   the embedded fonts and the KaTeX stylesheet, and ends with the print rules.
2. The marker line `<!-- BODY -->`. Everything before it goes into the
   document head of the standalone page, everything after it into the body.
3. The content.

Mathematics uses two delimiters: `$$ ... $$` for a displayed equation and
`\( ... \)` for inline mathematics. Equations are numbered by hand with
`\tag{n}` inside a displayed block, and are numbered consecutively through
each set of notes. Do not use a bare dollar sign or `\(` anywhere else in the
file, and write `\lt` or `\gt` rather than `<` or `>` inside TeX.

These macros are defined in `build.js` and may be used in the sources:

| Macro | Expands to |
| --- | --- |
| `\ket{x}` | `|x\rangle` |
| `\bra{x}` | `\langle x|` |
| `\braket{x}{y}` | `\langle x|y\rangle` |
| `\Hb` | `\bar{H}` |
| `\dd` | upright d for derivatives |
| `\pd{a}{b}` | `\frac{\partial a}{\partial b}` |
| `\tr` | sans-serif T for a transpose |
| `\bm{x}` | `\mathbf{x}` |

Recurring page elements are plain HTML with these classes:

- `div.panel` with a `p.label` for a boxed key result; add `eqs` for a
  panel that holds a long multi-line equation.
- `div.panel.remark` for a remark set off by rules rather than a box.
- `div.panel.notation` with a `dl` for the notation table.
- `ol.three` for the summary at the top, `ol.steps` for a numbered recipe,
  `ul.points` for a list of points, `div.tablewrap > table` for tables,
  `ol.refs` for the reading list.

## Publishing as a claude.ai artifact

claude.ai wraps a published page in its own document skeleton, so publish
`build/<name>.artifact.html`, which omits the `<!doctype>`, `<html>`,
`<head>` and `<body>` tags, rather than the standalone page in `../docs`.
