import { motion } from "framer-motion";
import { AllocationChart } from "../components/AllocationChart";
import { useAllocation } from "../lib/useAllocation";
import {
  ASSETS,
  ASSET_LABELS,
  legacyAllocationChartColors,
} from "../lib/types";
import type { FormData } from "../lib/types";

const variants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

interface Props {
  data: FormData;
  onBack: () => void;
  onRestart: () => void;
}

export function ResultsStep({ data, onBack, onRestart }: Props) {
  const { response, loading, error } = useAllocation(data, true);
  const chartColors = legacyAllocationChartColors(data.portfolioType);

  return (
    <motion.div
      key="results"
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col items-center px-6 py-10"
    >
      <div className="w-full max-w-3xl space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-navy">Your Portfolio</h2>
          <p className="text-muted mt-1">
            Here&rsquo;s your personalized asset allocation.
          </p>
        </div>

        {loading && !response && (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm">
            {error}
          </div>
        )}

        {response && (
          <>
            <AllocationChart
              weights={response.final_weights}
              colors={chartColors}
            />

            {/* Weight breakdown */}
            <div className="space-y-3">
              {ASSETS.map((asset, i) => (
                <div
                  key={asset}
                  className="flex items-center justify-between p-4 rounded-xl bg-surface"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: chartColors[i] }}
                    />
                    <span className="text-sm font-medium text-navy">
                      {ASSET_LABELS[asset]}
                    </span>
                  </div>
                  <span className="text-lg font-bold text-navy tabular-nums">
                    {response.final_weights[asset]?.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>

            {/* Inferred profile summary */}
            <div className="p-5 rounded-xl border border-app-border space-y-3">
              <h3 className="text-sm font-semibold text-navy uppercase tracking-wider">
                Inferred Profile
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted">Risk</span>
                  <p className="font-semibold text-navy">
                    {response.inferred_profile.risk.toFixed(1)} / 10
                  </p>
                </div>
                <div>
                  <span className="text-muted">Horizon</span>
                  <p className="font-semibold text-navy">
                    {response.inferred_profile.horizon.toFixed(0)} years
                  </p>
                </div>
                <div>
                  <span className="text-muted">Liquidity Need</span>
                  <p className="font-semibold text-navy">
                    {response.inferred_profile.liquidity_need.toFixed(1)} / 10
                  </p>
                </div>
                <div>
                  <span className="text-muted">Fit Score</span>
                  <p className="font-semibold text-navy">
                    {response.inferred_profile.fit_score.toFixed(0)} / 100
                  </p>
                </div>
              </div>
              <div className="pt-1">
                <span className="inline-block px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-semibold uppercase tracking-wider">
                  {response.inferred_profile.nearest_bucket}
                </span>
              </div>
            </div>

            {/* Explanations */}
            {response.explanations.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-navy uppercase tracking-wider">
                  Notes
                </h3>
                <ul className="space-y-1.5">
                  {response.explanations.map((msg, i) => (
                    <li key={i} className="text-sm text-muted leading-relaxed">
                      {msg}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        <div className="flex gap-3 pt-4">
          <button
            onClick={onBack}
            className="px-6 py-3 rounded-xl border border-app-border text-muted hover:bg-surface transition-colors cursor-pointer"
          >
            Back
          </button>
          <button
            onClick={onRestart}
            className="flex-1 px-6 py-3 rounded-xl bg-brand text-white font-semibold hover:bg-brand-hover transition-colors cursor-pointer"
          >
            Start Over
          </button>
        </div>
      </div>
    </motion.div>
  );
}
