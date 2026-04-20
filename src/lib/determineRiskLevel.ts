import type { FormData } from "./types";
import type { AccountData } from "./types";

/**
 * Derives "growth" or "conservative" from the user's questionnaire answers.
 *
 * Scoring rubric:
 *   investmentGoal : max_growth +2 | balanced 0 | safe_growth -2
 *   lossReaction   : buy_more +2 | sell_nothing +1 | sell_some -1 | sell_all -2
 *   risk slider    : >=7 +2 | 5-6 +1 | 3-4 -1 | <=2 -2
 *   experience     : advanced/moderate +1 | limited 0 | new -1
 *
 * Positive total → growth, zero or negative → conservative.
 */
export function determineRiskLevel(
  formData: FormData,
  accountData: AccountData,
): "growth" | "conservative" {
  let score = 0;

  // Investment goal
  if (formData.investmentGoal === "max_growth") score += 2;
  else if (formData.investmentGoal === "safe_growth") score -= 2;

  // Loss reaction
  if (formData.lossReaction === "buy_more") score += 2;
  else if (formData.lossReaction === "sell_nothing") score += 1;
  else if (formData.lossReaction === "sell_some") score -= 1;
  else if (formData.lossReaction === "sell_all") score -= 2;

  // Risk slider (1–10)
  if (formData.risk >= 7) score += 2;
  else if (formData.risk >= 5) score += 1;
  else if (formData.risk >= 3) score -= 1;
  else score -= 2;

  // Investing experience
  if (
    accountData.investingExperience === "advanced" ||
    accountData.investingExperience === "moderate"
  ) {
    score += 1;
  } else if (accountData.investingExperience === "new") {
    score -= 1;
  }

  return score > 0 ? "growth" : "conservative";
}

/** Display label for risk scores 1–10 (five tiers, two points each). */
export function riskProfileLabel(risk: number): string {
  const r = Math.min(10, Math.max(1, Math.round(risk)));
  if (r <= 2) return "Very Conservative";
  if (r <= 4) return "Conservative";
  if (r <= 6) return "Moderate";
  if (r <= 8) return "Growth";
  return "High Growth";
}
