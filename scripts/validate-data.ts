import data from "../data/bunpou/n2.json";

function validate(): void {
  if (!Array.isArray(data)) {
    throw new Error("data/bunpou/n2.json must be an array");
  }

  if (data.length !== 91) {
    throw new Error(`Expected exactly 91 records, but found ${data.length}`);
  }

  const ids = new Set<string>();
  let activeCount = 0;
  let placeholderCount = 0;
  let reviewCount = 0;

  for (let i = 0; i < data.length; i++) {
    const item = data[i] as any;
    const expectedNum = i + 1;
    const expectedId = `n2-${expectedNum.toString().padStart(3, "0")}`;

    if (item.id !== expectedId) {
      throw new Error(`Item at index ${i} has id '${item.id}', expected '${expectedId}'`);
    }

    if (ids.has(item.id)) {
      throw new Error(`Duplicate ID detected: ${item.id}`);
    }
    ids.add(item.id);

    if (item.patternNumber !== expectedNum) {
      throw new Error(`Item ${item.id} has patternNumber ${item.patternNumber}, expected ${expectedNum}`);
    }

    if (item.available === true) {
      activeCount++;
      for (const field of ["category", "formality", "kunci_pencarian"]) {
        if (typeof item[field] !== "string" || item[field].trim() === "") {
          throw new Error(`Active item ${item.id} has empty ${field}`);
        }
      }
      if (!Array.isArray(item.mirip) || !Array.isArray(item.soal_latihan) || item.soal_latihan.length < 3) {
        throw new Error(`Active item ${item.id} needs mirip[] and at least 3 soal_latihan`);
      }
      if (typeof item.terverifikasi !== "boolean") {
        throw new Error(`Active item ${item.id} needs boolean terverifikasi`);
      }
      if (!item.sumber || item.sumber.video_id !== "VcaLbwTMS9M") {
        throw new Error(`Active item ${item.id} has invalid sumber.video_id`);
      }
      if (item.sumber.mulai !== null && (!Number.isFinite(item.sumber.mulai) || item.sumber.mulai < 0)) {
        throw new Error(`Active item ${item.id} has invalid sumber.mulai`);
      }
      if (item.sumber.selesai !== null && (!Number.isFinite(item.sumber.selesai) || item.sumber.selesai < 0 || (item.sumber.mulai !== null && item.sumber.selesai <= item.sumber.mulai))) {
        throw new Error(`Active item ${item.id} has invalid sumber.selesai`);
      }
      for (const similarId of item.mirip) {
        if (!ids.has(similarId) && !data.some((candidate: any) => candidate.id === similarId)) {
          throw new Error(`Active item ${item.id} references unknown mirip id ${similarId}`);
        }
      }
      if (!item.title || item.title.trim() === "") {
        throw new Error(`Active item ${item.id} has empty title`);
      }
      if (!item.kana || item.kana.trim() === "") {
        throw new Error(`Active item ${item.id} has empty kana`);
      }
      if (!item.meaning || item.meaning.trim() === "") {
        throw new Error(`Active item ${item.id} has empty meaning`);
      }
      if (/^(meaning|arti|terjemahan|todo|tbd|placeholder)$/i.test(item.meaning.trim())) {
        throw new Error(`Active item ${item.id} has placeholder meaning`);
      }
      if (!item.formula || item.formula.trim() === "") {
        throw new Error(`Active item ${item.id} has empty formula`);
      }
      if (!item.explanation || item.explanation.trim() === "") {
        throw new Error(`Active item ${item.id} has empty explanation`);
      }
      if (!Array.isArray(item.examples) || item.examples.length === 0) {
        throw new Error(`Active item ${item.id} must have at least one example sentence`);
      }
      if (item.reviewNeeded === true) {
        reviewCount++;
      }
      for (const ex of item.examples) {
        if (!ex.jp || !ex.id || !Array.isArray(ex.rubySegments) || !ex.translation || ex.translation.trim() === "") {
          throw new Error(`Active item ${item.id} has invalid example: missing jp, id, rubySegments, or translation`);
        }
        const reconstructed = ex.rubySegments.map((segment: unknown) => {
          if (!Array.isArray(segment) || typeof segment[0] !== "string" || (segment[1] !== null && typeof segment[1] !== "string")) {
            throw new Error(`Active item ${item.id} example has invalid ruby segment`);
          }
          if (segment[1] !== null && !/[一-龯㐀-鿿]/.test(segment[0])) {
            throw new Error(`Active item ${item.id} example attaches ruby to non-kanji text`);
          }
          return segment[0];
        }).join("");
        if (reconstructed !== ex.jp) {
          throw new Error(`Active item ${item.id} example ruby segments change sentence text`);
        }
      }
    } else if (item.available === false) {
      placeholderCount++;
      if (!item.statusText || !item.statusText.includes("Segera hadir")) {
        throw new Error(`Placeholder item ${item.id} must have statusText 'Segera hadir'`);
      }
      if (!item.meaning || !item.meaning.includes("Segera hadir")) {
        throw new Error(`Placeholder item ${item.id} must state 'Segera hadir' in meaning`);
      }
    } else {
      throw new Error(`Item ${item.id} must have boolean available field`);
    }
  }

  if (activeCount !== 91) {
    throw new Error(`Expected exactly 91 active patterns, but found ${activeCount}`);
  }

  if (placeholderCount !== 0) {
    throw new Error(`Expected zero placeholder patterns, but found ${placeholderCount}`);
  }

  console.log(`[PASS] Data integrity verified: 91 total patterns (91 active, 0 placeholders, ${reviewCount} marked for review).`);
}

validate();
