import { PatternProgress } from '../types/bunpou';

export type SM2Rating = 0 | 1 | 2 | 3;
// 0: Ulangi (Again) - Lupa sama sekali
// 1: Sulit (Hard) - Ingat sedikit dengan kesulitan besar
// 2: Bagus (Good) - Ingat dengan benar setelah sedikit berpikir
// 3: Mudah (Easy) - Ingat seketika tanpa ragu

export function calculateSM2(
  current: PatternProgress,
  rating: SM2Rating
): {
  repetitions: number;
  interval: number;
  easeFactor: number;
  due: number;
  lastReviewed: number;
} {
  let { repetitions, interval, easeFactor } = current;
  if (!easeFactor || easeFactor < 1.3) easeFactor = 2.5;
  if (interval === undefined || interval < 0) interval = 0;
  if (repetitions === undefined || repetitions < 0) repetitions = 0;

  const now = Date.now();

  if (rating < 2) {
    // Rating 0 or 1 (Failure/Hard reset)
    repetitions = 0;
    interval = 1;
    easeFactor = Math.max(1.3, easeFactor - (rating === 0 ? 0.2 : 0.15));
  } else {
    // Rating 2 or 3 (Success)
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;

    // Adjust ease factor
    if (rating === 3) {
      easeFactor = easeFactor + 0.15;
    } else {
      easeFactor = Math.max(1.3, easeFactor - 0.05);
    }
  }

  // Cap interval at 365 days
  interval = Math.min(365, Math.max(1, interval));

  const due = now + interval * 24 * 60 * 60 * 1000;

  return {
    repetitions,
    interval,
    easeFactor: Number(easeFactor.toFixed(2)),
    due,
    lastReviewed: now,
  };
}
