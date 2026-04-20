import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import { AllocationChart } from "../components/AllocationChart";
import { SelectablePill } from "../components/SelectablePill";
import { SliderField } from "../components/SliderField";
import { rebalancePortfolioWeights } from "../lib/rebalancePortfolioWeights";
import { usePortfolioDashboard } from "../lib/usePortfolioDashboard";
import { riskProfileLabel } from "../lib/determineRiskLevel";
import {
  PORTFOLIO_ASSETS,
  PORTFOLIO_ASSET_LABELS,
  portfolioDashboardChartColors,
} from "../lib/types";
import type { FormData, AccountData, PortfolioAsset } from "../lib/types";

const variants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

const portfolioPanelVariants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -12, scale: 0.99 },
};

const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  individual: "Individual",
  joint: "Joint",
  trust: "Trust",
};

const PORTFOLIO_TYPES = [
  { value: "core", label: "Core" },
  { value: "socially_responsible", label: "Socially Responsible" },
  { value: "direct_indexing", label: "Direct Indexing" },
] as const;

interface Props {
  formData: FormData;
  accountData: AccountData;
  onChange: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
}

export function PortfolioDashboardStep({
  formData,
  accountData,
  onChange,
}: Props) {
  const [dashboardRisk, setDashboardRisk] = useState(formData.risk);

  const { response, loading, error } = usePortfolioDashboard(
    formData,
    accountData,
    true,
    dashboardRisk,
  );

  const [editedWeights, setEditedWeights] = useState<Record<
    PortfolioAsset,
    number
  > | null>(null);

  const [portfolioHighlight, setPortfolioHighlight] = useState(false);
  const skipPortfolioHighlightRef = useRef(true);

  useEffect(() => {
    if (skipPortfolioHighlightRef.current) {
      skipPortfolioHighlightRef.current = false;
      return;
    }
    setPortfolioHighlight(true);
    const t = window.setTimeout(() => setPortfolioHighlight(false), 750);
    return () => window.clearTimeout(t);
  }, [formData.portfolioType]);

  useEffect(() => {
    if (!response) {
      setEditedWeights(null);
      return;
    }
    setEditedWeights({ ...response.weights });
  }, [response]);

  const displayWeights = editedWeights ?? response?.weights;

  const handleAssetChange = useCallback((asset: PortfolioAsset, value: number) => {
    setEditedWeights((prev) => {
      const base = prev ?? (response?.weights as Record<PortfolioAsset, number>);
      if (!base) return prev;
      return rebalancePortfolioWeights(base, asset, value);
    });
  }, [response?.weights]);

  const handleResetAllocation = useCallback(() => {
    if (response) setEditedWeights({ ...response.weights });
  }, [response]);

  const accountTypeLabel =
    ACCOUNT_TYPE_LABELS[accountData.accountType] ?? accountData.accountType;

  const chartColors = portfolioDashboardChartColors(formData.portfolioType);

  return (
    <motion.div
      key="portfolio-dashboard"
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col items-center px-6 py-10"
    >
      <div className="w-full max-w-3xl space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-navy">Portfolio Dashboard</h2>
          <p className="text-lg font-semibold text-navy mt-2">
            Your personalized portfolio is ready!
          </p>
          <p className="text-muted mt-1 text-sm leading-relaxed">
            Based on your information, we&rsquo;ve selected a mix of investments
            to help maximize after-tax returns for your estimated tax and risk
            levels.
          </p>
        </div>

        <motion.div
          className="space-y-2 rounded-2xl border border-transparent p-4 -mx-1"
          animate={
            portfolioHighlight
              ? {
                  boxShadow: [
                    "0 0 0 0px rgba(73, 106, 148, 0)",
                    "0 0 0 3px rgba(73, 106, 148, 0.45), 0 12px 40px -8px rgba(73, 106, 148, 0.22)",
                    "0 0 0 2px rgba(73, 106, 148, 0.22)",
                  ],
                  backgroundColor: [
                    "rgba(255, 255, 255, 0)",
                    "rgba(73, 106, 148, 0.1)",
                    "rgba(73, 106, 148, 0.06)",
                  ],
                }
              : {
                  boxShadow: "0 0 0 0px rgba(73, 106, 148, 0)",
                  backgroundColor: "rgba(255, 255, 255, 0)",
                }
          }
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-sm font-medium text-navy">Portfolio</p>
          <p className="text-xs text-muted">
            Switch between Core, Socially Responsible, and Direct Indexing anytime.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {PORTFOLIO_TYPES.map((p) => (
              <SelectablePill
                key={p.value}
                selected={formData.portfolioType === p.value}
                label={p.label}
                disabled={loading}
                onClick={() => onChange("portfolioType", p.value)}
              />
            ))}
          </div>
        </motion.div>

        {/* Loading (initial load or after switching portfolio type) */}
        {loading && !response && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-brand/20 bg-brand/5 py-16"
          >
            <div className="h-9 w-9 border-2 border-brand border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium text-navy">Loading portfolio…</p>
          </motion.div>
        )}

        {/* Error */}
        {error && (
          <div className="p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {response && displayWeights && (
            <motion.div
              key={formData.portfolioType}
              variants={portfolioPanelVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8"
            >
            {/* Summary cards */}
            <div className="grid grid-cols-2 gap-4">
              {/* Portfolio card */}
              <div className="p-4 rounded-xl bg-surface border border-app-border space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Portfolio
                </p>
                <p className="text-lg font-bold text-navy leading-tight">
                  {response.portfolio_label}
                </p>
                <p className="text-sm text-muted">
                  {accountTypeLabel} Account
                </p>
              </div>

              {/* Risk score card */}
              <div className="p-4 rounded-xl bg-surface border border-app-border space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Risk Level
                </p>
                <p className="text-3xl font-bold text-navy tabular-nums">
                  {dashboardRisk}
                  <span className="text-base font-normal text-muted">
                    {" "}
                    / 10
                  </span>
                </p>
                <p className="text-sm text-muted">
                  {riskProfileLabel(dashboardRisk)}
                </p>
              </div>
            </div>

            <SliderField
              label="Risk profile"
              description="Each step blends from conservative toward growth targets."
              value={dashboardRisk}
              min={1}
              max={10}
              step={1}
              minLabel="1"
              maxLabel="10"
              onChange={setDashboardRisk}
            />

            {/* Allocation chart */}
            <div className="relative flex justify-center py-4">
              {loading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-surface/80">
                  <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              <AllocationChart
                weights={displayWeights}
                assets={PORTFOLIO_ASSETS}
                labels={PORTFOLIO_ASSET_LABELS}
                colors={chartColors}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleResetAllocation}
                className="text-sm font-medium text-brand hover:underline cursor-pointer"
              >
                Reset allocation to recommended
              </button>
            </div>

            {/* Asset-class breakdown + sliders */}
            <div className="space-y-4">
              {PORTFOLIO_ASSETS.map((asset, i) => (
                <div
                  key={asset}
                  className="p-4 rounded-xl bg-surface border border-app-border space-y-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: chartColors[i] }}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-navy">
                        {PORTFOLIO_ASSET_LABELS[asset]}
                      </p>
                      <p className="text-xs text-muted truncate">
                        {response.tickers[asset]}
                      </p>
                    </div>
                  </div>
                  <SliderField
                    label="Weight"
                    value={displayWeights[asset] ?? 0}
                    min={0}
                    max={100}
                    step={0.1}
                    unitSuffix="%"
                    onChange={(v) => handleAssetChange(asset, v)}
                  />
                </div>
              ))}
            </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pt-10 w-full">
          <a
            href="https://www.clientam.com/Universal/servlet/formWelcome?partnerID=GAARDCAP&invitation_id=181780750&token=89625&invitedBy=cnppcWRiMTQy"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center rounded-xl bg-brand px-8 py-5 text-center text-lg font-bold text-white shadow-md shadow-brand/25 transition-colors hover:bg-brand-hover"
          >
            Open My Account
          </a>
        </div>
      </div>
    </motion.div>
  );
}
