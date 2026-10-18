import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

type Pattern = {
  id: string;
  patternNumber: number;
  available: boolean;
  title: string;
  statusText?: string;
  meaning: string;
  formula: string;
  explanation: string;
  examples: Array<{ jp: string; id: string; furiganaHtml?: string }>;
  [key: string]: unknown;
};

const projectRoot = resolve(__dirname, "..");
const dataPath = resolve(projectRoot, "data/bunpou/n2.json");
const sourceArgIndex = process.argv.indexOf("--source");
const sourcePath = sourceArgIndex >= 0 ? process.argv[sourceArgIndex + 1] : undefined;

if (sourcePath) {
  console.error("Import blocked: source parser is intentionally conservative. Review and map verified preview cards manually; no uncertain patterns are fabricated.");
  process.exit(1);
}

const data = JSON.parse(readFileSync(dataPath, "utf8")) as Pattern[];
const active = data.filter((pattern) => pattern.available);
const placeholders = data.filter((pattern) => !pattern.available);

if (active.length !== 10 || placeholders.length !== 81) {
  throw new Error(`Import guard failed: expected 10 active and 81 placeholders, got ${active.length} active and ${placeholders.length} placeholders.`);
}

for (const pattern of placeholders) {
  if (pattern.available !== false || pattern.statusText !== "Segera hadir") {
    throw new Error(`Placeholder ${pattern.id} must remain available:false with statusText 'Segera hadir'.`);
  }
}

// This command is a safe validation/import gate. It rewrites only normalized JSON.
writeFileSync(dataPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
console.log("Import guard passed. Existing verified records preserved; no missing patterns invented.");
