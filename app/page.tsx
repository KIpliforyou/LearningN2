"use client";

import { useEffect, useMemo, useState } from "react";
import data from "../data/bunpou/n2.json";
import { calculateSM2, SM2Rating } from "../lib/sm2";
import {
  defaultPatternProgress,
  LEGACY_STORAGE_KEY,
  loadProgress,
  mergeImportedProgress,
  saveProgress,
  STORAGE_KEY,
} from "../lib/storage";
import { FullUserProgress, PatternProgress, StudyStatus } from "../types/bunpou";

type Pattern = (typeof data)[number];
type LegacyProgress = Record<string, { reviews?: number; favorite?: boolean; note?: string; due?: number }>;

const activePatterns = data.filter((pattern) => pattern.available);

function speak(text: string) {
  if (typeof speechSynthesis === "undefined") return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ja-JP";
  speechSynthesis.speak(utterance);
}

function migrateLegacyProgress(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const legacyRaw = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!legacyRaw || window.localStorage.getItem(STORAGE_KEY)) return false;
    const legacy = JSON.parse(legacyRaw) as LegacyProgress;
    const migrated = loadProgress();
    for (const [id, value] of Object.entries(legacy)) {
      const reviews = Math.max(0, Math.floor(value.reviews ?? 0));
      migrated.patterns[id] = {
        ...defaultPatternProgress(),
        repetitions: reviews,
        interval: reviews > 0 ? 1 : 0,
        due: value.due ?? 0,
        lastReviewed: reviews > 0 ? value.due ?? Date.now() : null,
        favorite: value.favorite === true,
        note: typeof value.note === "string" ? value.note.slice(0, 2000) : "",
        status: reviews > 0 ? "learning" : "unstudied",
      };
    }
    migrated.stats.totalReviews = Object.values(migrated.patterns).reduce((sum, value) => sum + value.repetitions, 0);
    saveProgress(migrated);
    return true;
  } catch {
    return false;
  }
}

function progressFor(progress: FullUserProgress, id: string): PatternProgress {
  return progress.patterns[id] ?? defaultPatternProgress();
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "favorites" | StudyStatus>("all");
  const [progress, setProgress] = useState<FullUserProgress>(() => loadProgress());
  const [selected, setSelected] = useState<Pattern | null>(null);
  const [quizPattern, setQuizPattern] = useState<Pattern | null>(null);
  const [quizAnswer, setQuizAnswer] = useState(false);
  const [importMessage, setImportMessage] = useState("");

  useEffect(() => {
    if (migrateLegacyProgress()) setProgress(loadProgress());
  }, []);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return activePatterns.filter((pattern) => {
      const itemProgress = progressFor(progress, pattern.id);
      const matchesFilter =
        filter === "all" || (filter === "favorites" ? itemProgress.favorite : itemProgress.status === filter);
      const searchable = `${pattern.title} ${pattern.meaning} ${pattern.jp} ${pattern.kana}`.toLowerCase();
      return matchesFilter && searchable.includes(normalizedQuery);
    });
  }, [filter, progress, query]);

  const completed = activePatterns.filter((pattern) => progressFor(progress, pattern.id).status === "mastered").length;
  const dueCount = activePatterns.filter((pattern) => {
    const due = progressFor(progress, pattern.id).due;
    return due > 0 && due <= Date.now();
  }).length;

  function commit(next: FullUserProgress) {
    setProgress(next);
    saveProgress(next);
  }

  function updatePattern(id: string, update: Partial<PatternProgress>) {
    const current = progressFor(progress, id);
    commit({ ...progress, patterns: { ...progress.patterns, [id]: { ...current, ...update } } });
  }

  function review(id: string, rating: SM2Rating) {
    const current = progressFor(progress, id);
    const scheduled = calculateSM2(current, rating);
    const status: StudyStatus = rating < 2 ? "learning" : rating === 3 ? "mastered" : "learning";
    commit({
      ...progress,
      patterns: { ...progress.patterns, [id]: { ...current, ...scheduled, status } },
      stats: { ...progress.stats, totalReviews: progress.stats.totalReviews + 1 },
    });
  }

  function exportProgress() {
    const blob = new Blob([JSON.stringify(progress, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "learningn2-progress.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function importProgress(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        commit(mergeImportedProgress(progress, JSON.parse(String(reader.result))));
        setImportMessage("Progress berhasil digabungkan.");
      } catch {
        setImportMessage("File progress tidak valid.");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  }

  return (
    <main className="shell">
      <header className="top">
        <div>
          <div className="logo">LearningN2</div>
          <div className="muted">JLPT N2 Bunpou</div>
        </div>
        <nav className="nav" aria-label="Navigasi utama">
          <button className="btn" onClick={() => setFilter("all")}>Semua</button>
          <button className="btn" onClick={() => setFilter("favorites")}>Favorit</button>
          <button className="btn" onClick={() => { setQuizPattern(filtered[0] ?? activePatterns[0]); setQuizAnswer(false); }}>Quiz</button>
          <button className="btn" onClick={exportProgress}>Export</button>
          <label className="btn">Import<input type="file" accept="application/json" hidden onChange={importProgress} /></label>
        </nav>
      </header>

      <section className="hero">
        <h1>Belajar N2, satu pola sekali duduk.</h1>
        <p>91 pola aktif dari transcript video. Progress tersimpan lokal di perangkat ini.</p>
        <div className="actions">
          <span className="tag">{completed}/{activePatterns.length} mastered</span>
          <span className="tag">{dueCount} perlu review</span>
          {importMessage && <span role="status">{importMessage}</span>}
        </div>
      </section>

      <section className="grid stats" aria-label="Ringkasan progress">
        <div className="card"><div className="muted">Pola aktif</div><div className="stat">{activePatterns.length}</div></div>
        <div className="card"><div className="muted">Progress mastered</div><div className="stat">{Math.round((completed / activePatterns.length) * 100)}%</div></div>
        <div className="card"><div className="muted">Total review</div><div className="stat">{progress.stats.totalReviews}</div></div>
      </section>

      <section className="section">
        <h2>Daftar pola</h2>
        <input className="search" aria-label="Cari pola" placeholder="Cari pola, arti, atau Jepang..." value={query} onChange={(event) => setQuery(event.target.value)} />
        <div className="actions filters">
          {(["all", "favorites", "unstudied", "learning", "mastered"] as const).map((value) => (
            <button key={value} className={`btn ${filter === value ? "primary" : ""}`} onClick={() => setFilter(value)}>
              {value === "all" ? "Semua" : value === "favorites" ? "Favorit" : value}
            </button>
          ))}
        </div>
        <div className="grid">
          {filtered.map((pattern) => {
            const itemProgress = progressFor(progress, pattern.id);
            return (
              <article className="card" key={pattern.id}>
                <span className="tag">{itemProgress.status}</span>
                <h3>{pattern.title}</h3>
                <div className="jp">{pattern.jp}</div>
                <p>{pattern.meaning}</p>
                <div className="actions">
                  <button className="btn primary" onClick={() => setSelected(pattern)}>Belajar</button>
                  <button className="btn" onClick={() => updatePattern(pattern.id, { favorite: !itemProgress.favorite })}>{itemProgress.favorite ? "★ Favorit" : "☆ Simpan"}</button>
                </div>
              </article>
            );
          })}
        </div>
        {filtered.length === 0 && <div className="card"><p>Tidak ada pola sesuai filter.</p></div>}
      </section>

      {selected && (
        <div className="modal-backdrop" role="presentation" onClick={() => setSelected(null)}>
          <section className="modal card" role="dialog" aria-modal="true" aria-labelledby="pattern-title" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header"><h2 id="pattern-title">{selected.displayTitle}</h2><button className="btn" onClick={() => setSelected(null)}>Tutup</button></div>
            <div className="jp">{selected.jp} ・ {selected.kana}</div>
            <p><b>Rumus:</b> {selected.formula}</p>
            <p><b>Penjelasan:</b> {selected.explanation}</p>
            {selected.examples.map((example) => (
              <div className="example" key={example.id}>
                <div dangerouslySetInnerHTML={{ __html: example.furiganaHtml }} />
                <button className="btn" onClick={() => speak(example.jp)}>Audio Jepang</button>
              </div>
            ))}
            <textarea className="search" aria-label="Catatan pribadi" placeholder="Catatan pribadi..." value={progressFor(progress, selected.id).note} onChange={(event) => updatePattern(selected.id, { note: event.target.value })} />
            <div className="actions review-actions">
              <span className="muted">Bagaimana ingatanmu?</span>
              <button className="btn" onClick={() => review(selected.id, 0)}>Ulangi</button>
              <button className="btn" onClick={() => review(selected.id, 2)}>Bagus</button>
              <button className="btn primary" onClick={() => review(selected.id, 3)}>Mudah</button>
            </div>
          </section>
        </div>
      )}

      {quizPattern && (
        <div className="modal-backdrop" role="presentation" onClick={() => setQuizPattern(null)}>
          <section className="modal card" role="dialog" aria-modal="true" aria-labelledby="quiz-title" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header"><h2 id="quiz-title">Quiz kilat</h2><button className="btn" onClick={() => setQuizPattern(null)}>Tutup</button></div>
            <p>Apa arti pola berikut?</p><div className="jp">{quizPattern.jp}</div>
            {quizAnswer ? <p className="answer">{quizPattern.meaning}</p> : <button className="btn primary" onClick={() => setQuizAnswer(true)}>Tampilkan jawaban</button>}
            {quizAnswer && <button className="btn" onClick={() => { review(quizPattern.id, 2); setQuizAnswer(false); setQuizPattern(null); }}>Tandai direview</button>}
          </section>
        </div>
      )}
    </main>
  );
}
