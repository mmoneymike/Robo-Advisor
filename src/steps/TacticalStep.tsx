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

export function TacticalStep({ data, onChange, onNext, onBack }: Props) {
  return (
    <motion.div
      key="tactical"
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
            Tactical &amp; Macro Views
          </h2>
          <p className="text-muted mt-1">
            Fine-tune your allocation with tactical intensity and macro outlook.
          </p>
        </div>

        <div className="space-y-7">
          <SliderField
            label="Tactical Intensity"
            value={data.tactical_intensity}
            min={0}
            max={10}
            unitSuffix="/ 10"
            minLabel="None"
            maxLabel="Maximum"
            onChange={(v) => onChange("tactical_intensity", v)}
          />

          <div className="border-t border-app-border pt-6">
            <p className="text-xs uppercase tracking-wider text-muted mb-5 font-medium">
              Macro Outlook
            </p>
            <div className="space-y-6">
              <SliderField
                label="Growth"
                value={data.macro_growth}
                min={-2}
                max={2}
                step={0.5}
                minLabel="Bearish"
                maxLabel="Bullish"
                onChange={(v) => onChange("macro_growth", v)}
              />
              <SliderField
                label="Rates"
                value={data.macro_rates}
                min={-2}
                max={2}
                step={0.5}
                minLabel="Falling"
                maxLabel="Rising"
                onChange={(v) => onChange("macro_rates", v)}
              />
              <SliderField
                label="Inflation"
                value={data.macro_inflation}
                min={-2}
                max={2}
                step={0.5}
                minLabel="Deflationary"
                maxLabel="Inflationary"
                onChange={(v) => onChange("macro_inflation", v)}
              />
              <SliderField
                label="Volatility"
                value={data.macro_volatility}
                min={-2}
                max={2}
                step={0.5}
                minLabel="Low Vol"
                maxLabel="High Vol"
                onChange={(v) => onChange("macro_volatility", v)}
              />
            </div>
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
            className="flex-1 px-6 py-3 rounded-xl bg-brand text-white font-semibold hover:bg-brand-hover transition-colors cursor-pointer"
          >
            View Results
          </button>
        </div>
      </div>
    </motion.div>
  );
}
