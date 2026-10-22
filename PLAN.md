# Forge — Plan

**What it is:** A text workbench for developers and writers — transform, analyze, search/replace, and encode/convert text, fast and fully offline. No account, no server; everything runs in the browser.

**Visual identity:** Futuristic / techno (distinct from Pulse's warm immersive and Loom's cool editorial). Near-black terminal canvas, neon cyan + magenta, monospace detailing (IBM Plex Mono) with a bold grotesk display (Space Grotesk), HUD corner brackets, angled clip-path panels, an animated grid/scanline field that reacts to the cursor. Custom difference-blend cursor. No emojis — inline SVG icons + a bespoke angular "forge" logo.

**Tech:** Static multi-page site. Shared `forge.css` + `forge.js`. State (snippets, history, prefs) in localStorage (`forge_mp`), shared across pages.

## Pages (each its own unique functionality)
1. **index.html — Forge (home)**: hero, quick paste→action launcher, feature tiles to each tool, live char/word readout.
2. **transform.html — Transform**: big input, grid of ~24 one-click operations (case conversions, whitespace, line ops, sort/dedup/reverse/shuffle/number, slugify, strip HTML, remove punctuation), live output, copy/download, chain history.
3. **analyze.html — Analyze**: live metrics (chars, words, sentences, paragraphs, lines, token estimate, reading time, unique words, avg word length, longest word, Flesch readability) + word-frequency and character-frequency tables.
4. **replace.html — Find & Replace**: plain or regex, case-insensitive, whole-word, live highlighted matches, match count, capture-group replacement, replace-all.
5. **encode.html — Encode / Convert**: Base64, URL, HTML-entity, JSON pretty/minify, ROT13, binary, hex, reverse — each with encode/decode and copy.
6. **settings.html — Settings**: theme, accent, saved snippets manager, transform history, shortcuts, full feature list, about/privacy.

## 50+ features (target)
Transform (24): UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, kebab-case, CONSTANT_CASE, slugify, trim lines, collapse spaces, remove blank lines, sort A–Z, sort Z–A, sort by length, reverse line order, shuffle lines, deduplicate lines, number lines, reverse characters, remove punctuation, strip HTML tags, capitalize words, swap case.
Analyze (12): chars, words, sentences, paragraphs, lines, token estimate, reading time, unique words, average word length, longest word, Flesch reading ease, word-frequency + char-frequency tables.
Find & Replace (6): plain find, regex find, case-insensitive, whole-word, highlighted live matches, capture-group replace.
Encode/Convert (8): Base64 enc/dec, URL enc/dec, HTML entity enc/dec, JSON pretty, JSON minify, ROT13, text↔binary, text↔hex.
Platform (10+): multi-page nav, light & dark themes, accent themes, custom cursor, techno grid motion, copy to clipboard, download as .txt, import a file, saved snippets, transform history, keyboard shortcuts, autosave, offline, responsive.
