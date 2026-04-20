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

export function ProfileStep({ data, onChange, onNext, onBack }: Props) {
  return (
    <motion.div
      key="profile"
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
            Your Investor Profile
          </h2>
          <p className="text-muted mt-1">
            Tell us about your risk preferences and investment horizon.
          </p>
        </div>

        <div className="space-y-7">
          <SliderField
            label="Risk Tolerance"
            description="How much volatility are you comfortable with? Higher means bigger potential gains — and losses."
            value={data.risk}
            min={1}
            max={10}
            unitSuffix="/ 10"
            minLabel="Conservative"
            maxLabel="Aggressive"
            onChange={(v) => onChange("risk", v)}
          />
          <SliderField
            label="Time Horizon"
            description="How many years until you need this money? Longer horizons can weather more ups and downs."
            value={data.horizon}
            min={1}
            max={30}
            unitSuffix=" years"
            minLabel="1 yr"
            maxLabel="30 yrs"
            onChange={(v) => onChange("horizon", v)}
          />
          <SliderField
            label="Drawdown Tolerance"
            description="How much could your portfolio drop before you'd want to make changes?"
            value={data.drawdown_tolerance}
            min={1}
            max={10}
            unitSuffix="/ 10"
            minLabel="Low"
            maxLabel="High"
            onChange={(v) => onChange("drawdown_tolerance", v)}
          />
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
            Continue
          </button>
        </div>
      </div>
    </motion.div>
  );
}
