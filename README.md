# LearningN2

Indonesian-language JLPT N2 bunpou study app. Mobile/PWA-first, local-only progress, no login or server sync.

## Source and data honesty

Source active lesson cards: `C:/Users/USER/Desktop/jlpt-n2-bunpou-preview.html`.

Preview contains 10 active cards. App stores these 10 as `available:true`. Dataset also contains 81 explicit records (`n2-011` through `n2-091`) as `available:false`, labeled **Segera hadir**. They are excluded from cards, flashcards, quiz, and mock exam. No missing video patterns are invented.

Source video: https://youtu.be/VcaLbwTMS9M

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
- Flashcards with simple SM-2 ratings and due queue.
- Quiz, mock exam, favorites, status filters, streak, review history.
- PWA manifest, generated icons, service worker shell caching.
- Local admin/import route at `/admin` for verified content updates; placeholders stay unavailable until verified.

## Data workflow

Import script refuses to fabricate content. Add only verified cards, keep uncertain records `available:false`, then run `npm run validate-data`.
