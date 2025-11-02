const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "is",
  "are",
  "was",
  "were",
  "in",
  "on",
  "at",
  "to",
  "for",
  "of",
  "with",
  "by",
]);

function stem(word: string): string {
  const w = word.toLowerCase();
  if (w.endsWith("s") && !w.endsWith("ss")) return w.slice(0, -1);
  if (w.endsWith("es")) return w.slice(0, -2);
  if (w.endsWith("ed")) return w.slice(0, -2);
  if (w.endsWith("ing")) return w.slice(0, -3);
  return w;
}

function tokenize(text: string, isQuery = false): string[] {
  const tokens = text
    .toLowerCase()
    .split(/\W+/)
    .map(stem)
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t));

  if (isQuery) return tokens;

  const out: string[] = [];
  for (const t of tokens) {
    out.push(t);
    for (let i = 3; i <= Math.min(5, t.length); i++) {
      out.push(t.slice(0, i));
    }
  }
  return [...new Set(out)];
}

type TF = Record<string, number>;

function tf(tokens: string[]): TF {
  const map: TF = {};
  for (const t of tokens) map[t] = (map[t] ?? 0) + 1;
  const total = tokens.length || 1;
  for (const k in map) map[k] /= total;
  return map;
}

function idf(docs: string[][]): Record<string, number> {
  const N = docs.length || 1;
  const df: Record<string, number> = {};
  for (const tokens of docs) {
    new Set(tokens).forEach((t) => (df[t] = (df[t] ?? 0) + 1));
  }
  const out: Record<string, number> = {};
  for (const [t, count] of Object.entries(df)) {
    out[t] = Math.log(N / (count + 1));
  }
  return out;
}

function dot(a: TF, b: TF): number {
  let sum = 0;
  for (const k in a) if (b[k]) sum += a[k] * b[k];
  return sum;
}

function mag(v: TF): number {
  return Math.sqrt(Object.values(v).reduce((s, n) => s + n * n, 0)) || 1;
}

export type SearchResult = {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  author: {
    name: string | null;
    image: string | null;
  } | null;
  community: {
    name: string | null;
  } | null;
  tags: Array<{ name: string }>;
};

export function searchQuestions(
  query: string,
  questions: SearchResult[],
): SearchResult[] {
  if (!query.trim()) return [];

  const docs = questions.map((q) => ({
    id: q.id,
    title: q.title,
    description: q.description || "",
    tags: q.tags.map((t) => t.name).join(" "),
    fullText: () =>
      `${q.title} ${q.description || ""} ${q.tags.map((t) => t.name).join(" ")}`,
  }));

  const docTokens = docs.map((d) => tokenize(d.fullText()));
  const queryTokens = tokenize(query, true);

  const idfMap = idf(docTokens);
  const qTF = tf(queryTokens);
  const qVec: TF = {};
  queryTokens.forEach((t) => {
    if (idfMap[t]) qVec[t] = qTF[t] * idfMap[t];
  });

  const results = docs.map((d, i) => {
    const dTF = tf(docTokens[i]);
    const dVec: TF = {};
    docTokens[i].forEach((t) => {
      if (idfMap[t]) dVec[t] = dTF[t] * idfMap[t];
    });

    let score = qVec && dVec ? dot(qVec, dVec) / (mag(qVec) * mag(dVec)) : 0;

    const titleTokens = tokenize(d.title);
    if (queryTokens.some((qt) => titleTokens.includes(qt))) {
      score += 0.3;
    }

    return { question: questions[i], score };
  });

  return results
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 15)
    .map((r) => r.question);
}
