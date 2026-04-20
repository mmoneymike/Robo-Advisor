export interface FormData {
  risk: number;
  horizon: number;
  liquidity_need: number;
  drawdown_tolerance: number;
  mode: "inferred_profile" | "manual_override";
  tactical_intensity: number;
  macro_growth: number;
  macro_rates: number;
  macro_inflation: number;
  macro_volatility: number;
  manual_spym: number;
  manual_vea: number;
  manual_agg: number;
  lossReaction: string;
  investmentGoal: string;
  portfolioType: string;
}

export interface AllocationResponse {
  model_version: string;
  assumption_set: string;
  calc_timestamp: string;
  mode_requested: string;
  inputs: {
    profile: Record<string, number>;
    tactical_intensity: number;
    macro_scores: Record<string, number>;
  };
  strategic_weights: Record<string, number>;
  tactical_overlays: Record<string, number>;
  final_weights: Record<string, number>;
  inferred_profile: {
    risk: number;
    horizon: number;
    liquidity_need: number;
    drawdown_tolerance: number;
    fit_score: number;
    nearest_bucket: string;
  };
  constraint_events: ConstraintEvent[];
  diagnostics: Record<string, unknown>;
  explanations: string[];
}

export interface ConstraintEvent {
  type: string;
  asset?: string;
  label?: string;
  requested?: number;
  applied?: number;
  min?: number;
  max?: number;
  cap?: number;
  before?: number;
  after?: number;
}

export const DEFAULTS: FormData = {
  risk: 5,
  horizon: 10,
  liquidity_need: 5,
  drawdown_tolerance: 5,
  mode: "inferred_profile",
  tactical_intensity: 5,
  macro_growth: 0,
  macro_rates: 0,
  macro_inflation: 0,
  macro_volatility: 0,
  manual_spym: 50,
  manual_vea: 15,
  manual_agg: 35,
  lossReaction: "",
  investmentGoal: "",
  portfolioType: "",
};

export const ASSET_LABELS: Record<string, string> = {
  spym: "SPYM — U.S. Equities",
  vea: "VEA — Intl Equities",
  agg: "AGG — Fixed Income",
};

export const ASSETS = ["spym", "vea", "agg"] as const;

/** Legacy 3-asset chart (spym, vea, agg) — hue family per portfolio for quick recognition */
export const LEGACY_CHART_COLORS_BY_PORTFOLIO = {
  core: ["#2563eb", "#38bdf8", "#1e40af"],
  socially_responsible: ["#15803d", "#22c55e", "#166534"],
  direct_indexing: ["#7c3aed", "#a78bfa", "#6d28d9"],
} as const;

/** Default legacy palette (Core blues) */
export const CHART_COLORS: readonly string[] =
  LEGACY_CHART_COLORS_BY_PORTFOLIO.core;

export function legacyAllocationChartColors(portfolioType: string): string[] {
  const row =
    LEGACY_CHART_COLORS_BY_PORTFOLIO[
      portfolioType as keyof typeof LEGACY_CHART_COLORS_BY_PORTFOLIO
    ];
  return row ? [...row] : [...LEGACY_CHART_COLORS_BY_PORTFOLIO.core];
}

// ---------------------------------------------------------------------------
// Portfolio Dashboard — 5-asset configuration
// ---------------------------------------------------------------------------

export const PORTFOLIO_ASSETS = [
  "us_eq",
  "intl_eq",
  "fixed",
  "alts",
  "cash",
] as const;

export type PortfolioAsset = (typeof PORTFOLIO_ASSETS)[number];

export const PORTFOLIO_ASSET_LABELS: Record<PortfolioAsset, string> = {
  us_eq: "US Equities",
  intl_eq: "International Equities",
  fixed: "Fixed Income",
  alts: "Alternative Assets",
  cash: "Cash",
};

/**
 * 5-asset dashboard colors by portfolio (order: PORTFOLIO_ASSETS).
 * Core: blues · Socially Responsible: greens · Direct Indexing: purples
 */
export const PORTFOLIO_CHART_COLORS_BY_TYPE = {
  core: [
    "#2563eb", // US Equities
    "#38bdf8", // Intl Equities
    "#1e3a8a", // Fixed Income
    "#6366f1", // Alt Assets
    "#7dd3fc", // Cash
  ],
  socially_responsible: [
    "#15803d",
    "#22c55e",
    "#14532d",
    "#4ade80",
    "#bbf7d0",
  ],
  direct_indexing: [
    "#7c3aed",
    "#a78bfa",
    "#5b21b6",
    "#c084fc",
    "#e9d5ff",
  ],
} as const;

/** Default 5-asset palette (Core) */
export const PORTFOLIO_CHART_COLORS: readonly string[] =
  PORTFOLIO_CHART_COLORS_BY_TYPE.core;

export function portfolioDashboardChartColors(portfolioType: string): string[] {
  const row =
    PORTFOLIO_CHART_COLORS_BY_TYPE[
      portfolioType as keyof typeof PORTFOLIO_CHART_COLORS_BY_TYPE
    ];
  return row ? [...row] : [...PORTFOLIO_CHART_COLORS_BY_TYPE.core];
}

export interface PortfolioDashboardResponse {
  portfolio_key: string;
  portfolio_label: string;
  risk_score: number;
  risk_profile: string;
  weights: Record<PortfolioAsset, number>;
  tickers: Record<PortfolioAsset, string>;
  asset_labels: Record<PortfolioAsset, string>;
  calc_timestamp: string;
}

export interface AccountData {
  firstName: string;
  lastName: string;
  email: string;
  useDifferentName: boolean;
  preferredName: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  zip: string;
  dob: string;
  ssn: string;
  securityQuestion1: string;
  securityAnswer1: string;
  securityQuestion2: string;
  securityAnswer2: string;
  accountType: string;
  filingStatus: string;
  employmentStatus: string;
  annualIncome: string;
  liquidNetWorth: string;
  investingExperience: string;
  uncommonSituations: string[];
}

export const ACCOUNT_DEFAULTS: AccountData = {
  firstName: "",
  lastName: "",
  email: "",
  useDifferentName: false,
  preferredName: "",
  phone: "",
  streetAddress: "",
  city: "",
  state: "",
  zip: "",
  dob: "",
  ssn: "",
  securityQuestion1: "",
  securityAnswer1: "",
  securityQuestion2: "",
  securityAnswer2: "",
  accountType: "",
  filingStatus: "",
  employmentStatus: "",
  annualIncome: "",
  liquidNetWorth: "",
  investingExperience: "",
  uncommonSituations: [],
};

export const SECURITY_QUESTIONS = [
  "What was the name of your first pet?",
  "What city were you born in?",
  "What is your mother's maiden name?",
  "What was the name of your first school?",
  "What was the make of your first car?",
  "What street did you grow up on?",
  "What is your favorite movie?",
  "What was your childhood nickname?",
];

export const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","DC","FL",
  "GA","HI","ID","IL","IN","IA","KS","KY","LA","ME",
  "MD","MA","MI","MN","MS","MO","MT","NE","NV","NH",
  "NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI",
  "SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
];
