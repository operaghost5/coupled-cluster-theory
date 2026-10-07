#!/bin/sh
# Download the third-party assets that build.js embeds into the pages:
#   - KaTeX (MIT licence): the renderer, its stylesheet, and its woff2 fonts
#   - Google Fonts (SIL Open Font Licence): Source Serif 4 and Archivo
# Everything lands in src/vendor/, which is not committed. Re-run at any time.
set -eu
cd "$(dirname "$0")"

KATEX_VERSION=0.16.11
KATEX="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/$KATEX_VERSION"
mkdir -p vendor/katex/fonts vendor/gfonts

echo "KaTeX $KATEX_VERSION"
curl -sSfL -o vendor/katex/katex.min.js  "$KATEX/katex.min.js"
curl -sSfL -o vendor/katex/katex.min.css "$KATEX/katex.min.css"
for face in AMS-Regular Caligraphic-Bold Caligraphic-Regular Fraktur-Bold Fraktur-Regular \
            Main-Bold Main-BoldItalic Main-Italic Main-Regular Math-BoldItalic Math-Italic \
            SansSerif-Bold SansSerif-Italic SansSerif-Regular Script-Regular \
            Size1-Regular Size2-Regular Size3-Regular Size4-Regular Typewriter-Regular; do
  curl -sSfL -o "vendor/katex/fonts/KaTeX_$face.woff2" "$KATEX/fonts/KaTeX_$face.woff2"
done

# The Google Fonts CSS API serves woff2 files split by unicode range only to a
# modern browser user agent; build.js keeps the latin and greek subsets.
echo "Google Fonts: Source Serif 4, Archivo"
UA="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
curl -sSfL -A "$UA" -o vendor/gfonts/fonts.css \
  "https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400..700;1,8..60,400..700&family=Archivo:wght@500..700&display=swap"
grep -o 'https://fonts.gstatic.com/[^)]*' vendor/gfonts/fonts.css | sort -u | while read -r url; do
  curl -sSfL -o "vendor/gfonts/$(basename "$url")" "$url"
done

echo "assets fetched into $(pwd)/vendor"
