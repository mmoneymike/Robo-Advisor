import { PORTFOLIO_ASSETS, type PortfolioAsset } from "./types";

/**
 * When one asset's weight changes, scale the other assets proportionally so
 * all weights sum to 100.
 */
export function rebalancePortfolioWeights(
  weights: Record<PortfolioAsset, number>,
  changedKey: PortfolioAsset,
  newPct: number,
): Record<PortfolioAsset, number> {
  const clamped = Math.min(100, Math.max(0, newPct));
  const others = PORTFOLIO_ASSETS.filter((a) => a !== changedKey);
  const sumOthersOld = others.reduce((s, a) => s + (weights[a] ?? 0), 0);
  const targetOthers = 100 - clamped;

  const next: Record<PortfolioAsset, number> = { ...weights };
  next[changedKey] = clamped;

  if (others.length === 0) return roundWeightsTo100(next, 1);

  if (sumOthersOld <= 1e-9) {
    const even = targetOthers / others.length;
    for (const a of others) next[a] = even;
  } else {
    for (const a of others) {
      next[a] = ((weights[a] ?? 0) / sumOthersOld) * targetOthers;
    }
  }

  return roundWeightsTo100(next, 1);
}

/**
 * Round each weight to `decimals` places and force the ordered list to sum to 100
 * by assigning the remainder to the last asset in {@link PORTFOLIO_ASSETS}.
 */
export function roundWeightsTo100(
  weights: Record<PortfolioAsset, number>,
  decimals: number,
): Record<PortfolioAsset, number> {
  const factor = 10 ** decimals;
  const out: Record<PortfolioAsset, number> = {} as Record<
    PortfolioAsset,
    number
  >;
  const keys = [...PORTFOLIO_ASSETS];
  let sum = 0;

  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    const v = Math.round((weights[k] ?? 0) * factor) / factor;
    out[k] = v;
    sum += v;
  }

  const last = keys[keys.length - 1];
  const lastVal = Math.round((100 - sum) * factor) / factor;
  out[last] = Math.min(100, Math.max(0, lastVal));

  return out;
}
