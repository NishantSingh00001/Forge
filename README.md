# Forge

**A terminal-grade text workbench that runs entirely in your browser.**

Transform, analyze, search/replace and encode/convert text — 50+ tools, fully offline. No account, no server, nothing uploaded. Your text and snippets live only in your browser.

A true multi-page site with a shared design system and state that persists across pages.

---

## Pages

| Page | File | What it does |
|------|------|--------------|
| **Forge** | `index.html` | Overview, live char/word/line/token readout, navigation to every tool. |
| **Transform** | `transform.html` | 24 one-click operations (case, lines, whitespace, slugify, strip HTML…), input→output panes, chain, copy, download, import. |
| **Analyze** | `analyze.html` | Live metrics (counts, token estimate, reading time, unique words, readability) + word/character frequency. |
| **Find & Replace** | `replace.html` | Plain or regex search, case-insensitive, whole-word, highlighted live matches, capture-group replace. |
| **Encode / Convert** | `encode.html` | Base64, URL, HTML entities, JSON pretty/minify, ROT13, binary, hex — encode & decode. |
| **Settings** | `settings.html` | Theme, accent, saved snippets, transform history, shortcuts, full feature list. |

## Highlights (50+ tools)

Transform — UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, kebab-case, CONSTANT_CASE, capitalize words, swap case, sort A–Z / Z–A / by length, reverse lines, shuffle, deduplicate, number lines, remove blank lines, trim lines, collapse spaces, reverse characters, remove punctuation, strip HTML, slugify.

Analyze — chars, words, sentences, paragraphs, lines, token estimate, reading time, unique words, average word length, longest word, Flesch readability, word-frequency and character-frequency.

Find & Replace — plain + regex, case-insensitive, whole-word, highlighted matches, match count, capture-group replacement.

Encode / Convert — Base64, URL, HTML entities, JSON pretty/minify, ROT13, text↔binary, text↔hex (encode & decode).

Platform — multi-page nav, light & dark themes, accent themes, custom cursor, reactive grid motion, copy, download as .txt, file import, saved snippets, transform history, keyboard shortcuts, autosave across pages, fully offline, responsive.

## Deploy (free)

Static site, no build step.

1. Create a GitHub repo and upload the whole folder (all `.html`, `forge.css`, `forge.js`).
2. Connect to **Netlify** or **Vercel** (no build command; publish directory is the repo root).
3. Open the URL — `index.html` is the entry point.

Local preview:

```bash
cd forge
python3 -m http.server 8000
# open http://localhost:8000
```

## Privacy

Everything runs locally in your browser. Your text, snippets and history live only in `localStorage` and are never uploaded.

## Tech

Vanilla HTML/CSS/JS. Fonts: Space Grotesk, IBM Plex Mono. No framework, no tracker, no backend.
