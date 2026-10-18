import { FullUserProgress, PatternProgress, StudyStatus, UserStats } from '../types/bunpou';

export const STORAGE_KEY = 'learningn2-progress-v1';
export const LEGACY_STORAGE_KEY = 'learningn2-progress';
export const DEFAULT_EASE_FACTOR = 2.5;

export const defaultPatternProgress = (): PatternProgress => ({
  status: 'unstudied',
  favorite: false,
  note: '',
  repetitions: 0,
  interval: 0,
  easeFactor: DEFAULT_EASE_FACTOR,
  due: 0,
  lastReviewed: null,
});

export const defaultStats = (): UserStats => ({
  streak: 0,
  longestStreak: 0,
  lastStudyDate: '',
  totalReviews: 0,
  quizHighScore: 0,
  mockHighScore: 0,
});

export function emptyProgress(): FullUserProgress {
  return {
    version: 1,
    patterns: {},
    stats: defaultStats(),
    exportedAt: new Date().toISOString(),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function normalizePattern(value: unknown): PatternProgress {
  if (!isRecord(value)) return defaultPatternProgress();
  const statuses: StudyStatus[] = ['unstudied', 'learning', 'mastered'];
  const status = statuses.includes(value.status as StudyStatus) ? value.status as StudyStatus : 'unstudied';
  return {
    ...defaultPatternProgress(),
    status,
    favorite: value.favorite === true,
    note: typeof value.note === 'string' ? value.note.slice(0, 2000) : '',
    repetitions: typeof value.repetitions === 'number' ? Math.max(0, Math.floor(value.repetitions)) : 0,
    interval: typeof value.interval === 'number' ? Math.max(0, Math.floor(value.interval)) : 0,
    easeFactor: typeof value.easeFactor === 'number' ? Math.max(1.3, value.easeFactor) : DEFAULT_EASE_FACTOR,
    due: typeof value.due === 'number' ? value.due : 0,
    lastReviewed: typeof value.lastReviewed === 'number' ? value.lastReviewed : null,
  };
}

export function normalizeProgress(value: unknown): FullUserProgress {
  const result = emptyProgress();
  if (!isRecord(value)) return result;
  if (isRecord(value.patterns)) {
    for (const [id, pattern] of Object.entries(value.patterns)) {
      result.patterns[id] = normalizePattern(pattern);
    }
  }
  if (isRecord(value.stats)) {
    const s = value.stats;
    result.stats = {
      streak: typeof s.streak === 'number' ? Math.max(0, Math.floor(s.streak)) : 0,
      longestStreak: typeof s.longestStreak === 'number' ? Math.max(0, Math.floor(s.longestStreak)) : 0,
      lastStudyDate: typeof s.lastStudyDate === 'string' ? s.lastStudyDate : '',
      totalReviews: typeof s.totalReviews === 'number' ? Math.max(0, Math.floor(s.totalReviews)) : 0,
      quizHighScore: typeof s.quizHighScore === 'number' ? Math.max(0, Math.floor(s.quizHighScore)) : 0,
      mockHighScore: typeof s.mockHighScore === 'number' ? Math.max(0, Math.floor(s.mockHighScore)) : 0,
    };
  }
  return result;
}

export function loadProgress(): FullUserProgress {
  if (typeof window === 'undefined') return emptyProgress();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress();
    return normalizeProgress(JSON.parse(raw));
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(progress: FullUserProgress): boolean {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...progress, exportedAt: new Date().toISOString() }));
    return true;
  } catch {
    return false;
  }
}

export function mergeImportedProgress(current: FullUserProgress, incoming: unknown): FullUserProgress {
  const imported = normalizeProgress(incoming);
  const merged = normalizeProgress(current);
  for (const [id, value] of Object.entries(imported.patterns)) {
    const existing = merged.patterns[id];
    if (!existing || (value.lastReviewed ?? 0) > (existing.lastReviewed ?? 0)) {
      merged.patterns[id] = value;
    }
  }
  merged.stats = {
    ...merged.stats,
    totalReviews: Math.max(merged.stats.totalReviews, imported.stats.totalReviews),
    quizHighScore: Math.max(merged.stats.quizHighScore, imported.stats.quizHighScore),
    mockHighScore: Math.max(merged.stats.mockHighScore, imported.stats.mockHighScore),
  };
  return merged;
}
