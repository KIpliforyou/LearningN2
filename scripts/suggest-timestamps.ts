import fs from "node:fs";
import path from "node:path";

type TranscriptSegment = {
  start: number;
  end?: number;
  text: string;
};

type Pattern = {
  id: string;
  patternNumber: number;
  title: string;
  jp: string;
  kana: string;
  kunci_pencarian?: string;
  sumber: {
    video_id: string;
    mulai: number | null;
    selesai: number | null;
  };
};

type Match = {
  segment: TranscriptSegment;
  confidence: "high" | "medium";
  matchedTerms: string[];
};

function parseTime(value: string): number {
  const normalized = value.replace(",", ".");
  const parts = normalized.split(":").map(Number);
  if (parts.some((part) => !Number.isFinite(part))) return NaN;
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0];
}

function parseTimestampedText(text: string): TranscriptSegment[] {
  const segments: TranscriptSegment[] = [];
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^\s*\[?(\d{1,2}:\d{2}(?::\d{2})?)\]?\s+(.+)$/);
    if (match) {
      const start = parseTime(match[1]);
      if (Number.isFinite(start)) segments.push({ start, text: match[2].trim() });
    }
  }
  return segments;
}

function parseSrt(text: string): TranscriptSegment[] {
  const segments: TranscriptSegment[] = [];
  const blocks = text.split(/\r?\n\s*\r?\n/);
  for (const block of blocks) {
    const lines = block.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const timeIdx = lines.findIndex((l) => l.includes(" --> "));
    if (timeIdx < 0) continue;
    const [startStr, endStr] = lines[timeIdx].split(" --> ");
    const start = parseTime(startStr);
    const end = parseTime(endStr);
    const transcript = lines.slice(timeIdx + 1).join(" ");
    if (Number.isFinite(start) && transcript) segments.push({ start, end, text: transcript });
  }
  return segments;
}

function loadTranscript(filePath: string): TranscriptSegment[] {
  const absolute = path.resolve(filePath);
  const raw = fs.readFileSync(absolute, "utf-8");
  const ext = path.extname(absolute).toLowerCase();
  const segments = ext === ".srt" ? parseSrt(raw) : (() => {
    const json = JSON.parse(raw);
    if (Array.isArray(json)) return json as TranscriptSegment[];
    if (json.segments) return json.segments as TranscriptSegment[];
    if (typeof json.timestamped_text === "string") return parseTimestampedText(json.timestamped_text);
    if (typeof json.text === "string" && (json.start !== undefined || json.offset !== undefined)) {
      const start = Number(json.start ?? json.offset);
      const end = json.end !== undefined ? Number(json.end) : undefined;
      return [{ start, end: Number.isFinite(end) ? end : undefined, text: json.text }];
    }
    return [];
  })();
  if (segments.length === 0) throw new Error("Transcript kosong atau format tidak didukung.");
  return segments.sort((a, b) => a.start - b.start);
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[\s・、。，．,./\\\\()[\]{}「」『』〜～]/g, "");
}

function findMatch(pattern: Pattern, transcript: TranscriptSegment[]): Match | null {
  const candidates = [pattern.title, pattern.jp, pattern.kana]
    .filter((v): v is string => Boolean(v && v.trim()))
    .map((v) => ({ v, norm: normalize(v) }))
    .filter((c) => c.norm.length >= 2);
  const searchable = pattern.kunci_pencarian?.split(/[|,;]/).map((s) => s.trim()).filter(Boolean) ?? [];
  for (const seg of transcript) {
    const txt = normalize(seg.text);
    const matched = candidates.filter((c) => txt.includes(c.norm)).map((c) => c.v);
    if (matched.length) {
      return { segment: seg, confidence: matched.length >= 2 ? "high" : "medium", matchedTerms: matched };
    }
    const fallback = searchable.find((t) => t.length >= 3 && txt.includes(normalize(t)));
    if (fallback) return { segment: seg, confidence: "medium", matchedTerms: [fallback] };
  }
  return null;
}

function main() {
  const transcriptPath = process.argv[2];
  const outputPath = process.argv[3] ?? "data/bunpou/n2-timestamp-suggestions.json";
  if (!transcriptPath) {
    console.error("Usage: tsx scripts/suggest-timestamps.ts <transcript.json|.srt> [output.json]");
    process.exit(1);
  }
  const transcript = loadTranscript(transcriptPath);
  const dataPath = path.resolve("data/bunpou/n2.json");
  const patterns = JSON.parse(fs.readFileSync(dataPath, "utf-8")) as Pattern[];
  const suggestions = patterns.map((p, idx) => {
    const match = findMatch(p, transcript);
    const nextStart = idx + 1 < patterns.length ? findMatch(patterns[idx + 1], transcript)?.segment.start : null;
    return {
      id: p.id,
      patternNumber: p.patternNumber,
      title: p.title,
      current: p.sumber,
      suggested_mulai: match?.segment.start ?? null,
      suggested_selesai: match?.segment.end ?? nextStart ?? null,
      confidence: match?.confidence ?? "none",
      matchedTerms: match?.matchedTerms ?? [],
      sourceText: match?.segment.text ?? null,
    };
  });
  const out = path.resolve(outputPath);
  fs.writeFileSync(out, JSON.stringify(suggestions, null, 2) + "\n", "utf-8");
  const matchedCount = suggestions.filter((s) => s.suggested_mulai !== null).length;
  console.log(`Saved ${matchedCount}/${suggestions.length} timestamp suggestions to ${out}`);
}

main();
