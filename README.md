# LearningN2

Indonesian-language JLPT N2 bunpou study app. Mobile/PWA-first, local-only progress, no login or server sync.

## Source and data honesty

Source data: transcript video https://youtu.be/VcaLbwTMS9M, with local HTML preview as initial reference.
Dataset contains 91 active records (`n2-001` through `n2-091`). Seven records retain `reviewNeeded:true` because transcript spelling or wording needs manual audio confirmation. They remain usable but are review-risk data. No login, backend, or cross-device sync exists.

Source video: https://youtu.be/VcaLbwTMS9M
Transcript cache: `C:/Users/USER/AppData/Local/hermes/cache/web/youtu.be-afc390e55f.md`

## Local run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Checks

```bash
npm run validate-data
npm run lint
npm run build
```

## Features

- Dashboard with active count, progress, streak, search, filters, and focus mode.
- Bunpou detail: formula, core explanation, usage, comparison, examples, furigana toggle, audio, timestamp link, notes.
- LocalStorage persistence with try/catch and normalized schema.
- Import/export progress with validation and merge behavior.
- Detail pola dengan contoh furigana, audio browser, catatan, favorit, dan review SM-2.
- Quiz kilat, pencarian, filter status, due review, serta progress mastered.
- Import/export progress JSON dengan normalisasi dan migrasi key lama.
- PWA manifest, icons, dan service worker untuk app shell; data pribadi tetap di localStorage.

## Data workflow

Import script refuses to fabricate content. Add only verified cards, keep uncertain records `available:false`, then run `npm run validate-data`.
