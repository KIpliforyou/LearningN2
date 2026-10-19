import fs from "node:fs";
import path from "node:path";

type TranscriptSegment = {
  start: number;
  text: string;
};

type Pattern = {
  id: number;
  title: string;
  jp: string;
  kana: string;
  sumber: {
    video_id: string;
    mulai: number | null;
    selesai: number | null;
  };
};

function main() {
  const transcriptPath = process.argv[2];
  if (!transcriptPath) {
    console.error("Usage: tsx scripts/suggest-timestamps.ts <transcript-json>");
    process.exit(1);
  }

  const rawTranscript = JSON.parse(fs.readFileSync(path.resolve(transcriptPath), "utf-8")) as TranscriptSegment[];
  const dataPath = path.resolve("data/bunpou/n2.json");
  const patterns = JSON.parse(fs.readFileSync(dataPath, "utf-8")) as Pattern[];

  const suggestions = patterns.map((pattern) => {
    const matched = rawTranscript.find((segment) =>
      segment.text.includes(pattern.jp) || segment.text.includes(pattern.title)
    );
    return {
      id: pattern.id,
      title: pattern.title,
      current: pattern.sumber,
      suggested_mulai: matched ? Math.floor(matched.start) : null,
      confidence: matched ? "medium" : "none",
    };
  });

  const outputPath = path.resolve("data/bunpou/n2-timestamp-suggestions.json");
  fs.writeFileSync(outputPath, JSON.stringify(suggestions, null, 2), "utf-8");
  console.log(`Saved timestamp suggestions to ${outputPath}`);
}

main();
