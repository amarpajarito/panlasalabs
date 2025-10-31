export const parseArrayField = (val: any): string[] => {
  if (Array.isArray(val)) return val.map(String);
  if (typeof val === "string") {
    const raw = val.trim();
    if (/^[\[{]/.test(raw)) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed.map(String);
      } catch (e) {
        // fallthrough
      }
    }
    const byNewline = raw
      .split(/\r?\n|\r/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (byNewline.length > 1) return byNewline;
    const byComma = raw
      .split(/,/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (byComma.length > 1) return byComma;
    return raw ? [raw] : [];
  }
  return [];
};

export const normalizeScalar = (v: any): string => {
  if (v == null) return "";
  let s = String(v).trim();
  if (/^[{[]/.test(s)) {
    try {
      const p = JSON.parse(s);
      if (p && typeof p === "object") {
        if (p.title) return String(p.title).trim();
        if (p.name) return String(p.name).trim();
      }
    } catch (e) {
      // ignore
    }
  }
  return s
    .replace(/^['\"]+|['\"]+$/g, "")
    .replace(/[,]+$/g, "")
    .trim();
};

export const formatMinutes = (v: any): string => {
  if (v == null || v === "") return "";
  if (typeof v === "number") return `${v} mins`;
  const s = String(v).trim();
  return /^\d+$/.test(s) ? `${s} mins` : s;
};

export const normalizeDifficulty = (val: any): "Easy" | "Medium" | "Hard" => {
  if (!val) return "Easy";
  const s = String(val).toLowerCase();
  if (s.includes("easy") || s.includes("beginner")) return "Easy";
  if (s.includes("medium") || s.includes("moderate")) return "Medium";
  if (s.includes("hard") || s.includes("difficult")) return "Hard";
  return "Easy";
};
