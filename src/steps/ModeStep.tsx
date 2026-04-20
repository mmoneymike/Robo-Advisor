import { motion } from "framer-motion";
import { SelectableCard } from "../components/SelectableCard";
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

export function ModeStep({ data, onChange, onNext, onBack }: Props) {
  return (
    <motion.div
      key="mode"
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col items-center px-6 py-10"
    >
      <div className="w-full max-w-3xl space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-navy">Construction Mode</h2>
          <p className="text-muted mt-1">
            Choose how you&rsquo;d like to build your portfolio.
          </p>
        </div>

        <div className="space-y-4">
          <SelectableCard
            selected={data.mode === "inferred_profile"}
            title="Inferred Profile"
            description="We'll use your profile and tactical settings to determine the optimal asset allocation."
            onClick={() => onChange("mode", "inferred_profile")}
          />
          <SelectableCard
            selected={data.mode === "manual_override"}
            title="Manual Override"
            description="Set your own target weights for each asset class. We'll apply guardrails and infer your profile."
            onClick={() => onChange("mode", "manual_override")}
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
