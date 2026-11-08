/**
 * High-performance Fuzzy Search and Levenshtein Distance Utility
 * For fast, typo-tolerant search across attractions, cities, and categories.
 */

/**
 * Calculates Levenshtein distance between two strings
 */
export function levenshteinDistance(a: string, b: string): number {
  const an = a.length;
  const bn = b.length;
  if (an === 0) return bn;
  if (bn === 0) return an;

  const matrix = Array.from({ length: bn + 1 }, (_, i) => [i]);
  for (let j = 0; j <= an; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= bn; i++) {
    for (let j = 1; j <= an; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[bn][an];
}

/**
 * Checks if a word fuzzy matches a target word allowing up to 1-2 typos
 */
export function fuzzyWordMatch(queryWord: string, targetWord: string): boolean {
  const q = queryWord.toLowerCase().trim();
  const t = targetWord.toLowerCase().trim();

  if (!q || !t) return false;
  if (t.includes(q)) return true;
  if (q.includes(t)) return true;

  // Exact prefix match
  if (t.startsWith(q)) return true;

  // Typo tolerance based on length
  const maxDistance = q.length <= 3 ? 0 : q.length <= 6 ? 1 : 2;
  if (Math.abs(q.length - t.length) > maxDistance) return false;

  return levenshteinDistance(q, t) <= maxDistance;
}

/**
 * Normalizes string for clean comparison (removes accents and punctuation)
 */
export function normalizeText(text: string): string {
  return (text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export interface MatchScoreResult {
  score: number;
  matched: boolean;
}

/**
 * Scores how well a multi-word search query matches a target string
 * Higher score = more relevant match (100+ for exact, 50-90 for partial/fuzzy)
 */
export function calculateMatchScore(query: string, target: string, secondaryTarget?: string): MatchScoreResult {
  const normQuery = normalizeText(query);
  const normTarget = normalizeText(target);
  const normSecondary = secondaryTarget ? normalizeText(secondaryTarget) : "";

  if (!normQuery) return { score: 0, matched: false };

  // 1. Exact match on target
  if (normTarget === normQuery) {
    return { score: 100, matched: true };
  }

  // 2. Starts with query
  if (normTarget.startsWith(normQuery)) {
    return { score: 90, matched: true };
  }

  // 3. Target contains entire query
  if (normTarget.includes(normQuery)) {
    return { score: 80, matched: true };
  }

  // 4. Secondary target (e.g. city/location) exact or contains
  if (normSecondary && normSecondary.includes(normQuery)) {
    return { score: 75, matched: true };
  }

  // 5. Word-by-word token matching
  const queryTokens = normQuery.split(" ").filter(t => t.length > 0);
  const targetTokens = `${normTarget} ${normSecondary}`.split(" ").filter(t => t.length > 0);

  let matchedTokensCount = 0;
  let totalScore = 0;

  for (const qToken of queryTokens) {
    let bestTokenScore = 0;

    for (const tToken of targetTokens) {
      if (tToken === qToken) {
        bestTokenScore = Math.max(bestTokenScore, 10);
      } else if (tToken.startsWith(qToken)) {
        bestTokenScore = Math.max(bestTokenScore, 8);
      } else if (tToken.includes(qToken)) {
        bestTokenScore = Math.max(bestTokenScore, 6);
      } else if (fuzzyWordMatch(qToken, tToken)) {
        bestTokenScore = Math.max(bestTokenScore, 4);
      }
    }

    if (bestTokenScore > 0) {
      matchedTokensCount++;
      totalScore += bestTokenScore;
    }
  }

  // Require matching all query tokens or at least 70% of them
  const matchRatio = matchedTokensCount / queryTokens.length;
  if (matchRatio >= 0.7 && matchedTokensCount > 0) {
    return {
      score: totalScore + (matchRatio * 40),
      matched: true
    };
  }

  return { score: 0, matched: false };
}
