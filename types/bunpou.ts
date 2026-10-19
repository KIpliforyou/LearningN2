export interface ExampleSentence {
  jp: string;
  rubySegments: [string, string | null][];
  translation: string;
  id: string;
}

export interface VideoTimestamp {
  time: string;
  seconds: number;
  youtubeUrl: string;
}

export interface VideoSource {
  video_id: string;
  mulai: number | null;
  selesai: number | null;
}

export interface PracticeQuestion {
  id: string;
  tipe: string;
  pertanyaan: string;
  jawaban: string;
}

export interface PatternComparison {
  similarPattern: string;
  difference: string;
}

export interface BunpouPattern {
  id: string;
  patternNumber: number;
  title: string;
  displayTitle: string;
  jp: string;
  kana: string;
  romaji: string;
  level: 'N2';
  available: boolean;
  statusText: string;
  meaning: string;
  formula: string;
  explanation: string;
  comparison?: PatternComparison | null;
  videoTimestamp?: VideoTimestamp | null;
  tags: string[];
  keywords: string;
  examples: ExampleSentence[];
  category: string;
  formality: string;
  catatan: string;
  mirip: string[];
  kunci_pencarian: string;
  soal_latihan: PracticeQuestion[];
  terverifikasi: boolean;
  sumber: VideoSource;
}

export type StudyStatus = 'unstudied' | 'learning' | 'mastered';

export interface PatternProgress {
  status: StudyStatus;
  favorite: boolean;
  note: string;
  repetitions: number;
  interval: number; // in days
  easeFactor: number; // SM-2 EF, default 2.5
  due: number; // timestamp ms
  lastReviewed: number | null;
}

export interface UserStats {
  streak: number;
  longestStreak: number;
  lastStudyDate: string; // YYYY-MM-DD
  totalReviews: number;
  quizHighScore: number;
  mockHighScore: number;
}

export interface FullUserProgress {
  version: number;
  patterns: Record<string, PatternProgress>;
  stats: UserStats;
  exportedAt: string;
}
