import { motion } from "framer-motion";
import { SliderField } from "../components/SliderField";
import type { FormData } from "../lib/types";

const variants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

interface Props {
  data: FormData;
  onChange: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ManualStep({ data, onChange, onNext, onBack }: Props) {
  const total = data.manual_spym + data.manual_vea + data.manual_agg;
  const totalOk = total > 0;

  return (
    <motion.div
      key="manual"
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col items-center px-6 py-10"
    >
      <div className="w-full max-w-3xl space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-navy">
            Manual Weight Allocation
          </h2>
          <p className="text-muted mt-1">
            Set your target weight for each asset class. Values will be
            normalized and guardrails applied.
          </p>
        </div>

        <div className="space-y-7">
          <SliderField
            label="SPYM — U.S. Equities"
            value={data.manual_spym}
            min={0}
            max={100}
            unitSuffix="%"
            minLabel="0%"
            maxLabel="100%"
            onChange={(v) => onChange("manual_spym", v)}
          />
          <SliderField
            label="VEA — Intl Equities"
            value={data.manual_vea}
            min={0}
            max={100}
            unitSuffix="%"
            minLabel="0%"
            maxLabel="100%"
            onChange={(v) => onChange("manual_vea", v)}
          />
          <SliderField
            label="AGG — Fixed Income"
            value={data.manual_agg}
            min={0}
            max={100}
            unitSuffix="%"
            minLabel="0%"
            maxLabel="100%"
            onChange={(v) => onChange("manual_agg", v)}
          />

          <div
            className={`flex items-center justify-between p-4 rounded-xl border ${
              Math.abs(total - 100) < 0.5
                ? "border-brand/30 bg-brand/5"
                : "border-app-border bg-surface"
            }`}
          >
            <span className="text-sm font-medium text-navy">Total</span>
            <span
              className={`text-lg font-bold tabular-nums ${
                Math.abs(total - 100) < 0.5 ? "text-brand" : "text-muted"
              }`}
            >
              {total}%
            </span>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={onBack}
            className="px-6 py-3 rounded-xl border border-app-border text-muted hover:bg-surface transition-colors cursor-pointer"
          >
            Back
          </button>
          <button
            onClick={onNext}
            disabled={!totalOk}
            className="flex-1 px-6 py-3 rounded-xl bg-brand text-white font-semibold hover:bg-brand-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            View Results
          </button>
        </div>
      </div>
    </motion.div>
  );
}
