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

- Dashboard with active count, mastered progress, review queue, search, and filters.
- Detail pola: rumus, penjelasan, contoh dengan arti, audio Jepang, catatan, favorit, dan review SM-2.
- Toggle furigana tersimpan lokal; mode off menyembunyikan `<rt>`, lalu tap/keyboard pada kanji menampilkan bacaan sementara.
- Flashcard, quiz kilat, dan status belajar (`unstudied`, `learning`, `mastered`). Quiz memaksa furigana tampil setelah jawaban dibuka.
- LocalStorage persistence with try/catch, normalized schema, and legacy-key migration.
- Import/export progress JSON with validation and merge behavior.
- PWA manifest, icons, and service worker for app shell; personal data stays in localStorage.

## Data workflow

Import script refuses to fabricate content. Add only verified cards, keep uncertain records `available:false`, then run `npm run validate-data`.
