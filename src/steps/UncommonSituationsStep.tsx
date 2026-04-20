import { motion } from "framer-motion";
import type { AccountData } from "../lib/types";

const variants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

const SITUATIONS = [
  {
    value: "broker_dealer",
    label: "I am employed or associated with a broker dealer",
  },
  {
    value: "finra",
    label: "I am employed by FINRA",
  },
  {
    value: "shareholder",
    label:
      "I am a 10% shareholder, director, or policymaker of a publicly traded company",
  },
  {
    value: "backup_withholding",
    label:
      "I have been notified by the IRS that I am currently subject to backup withholding",
  },
  {
    value: "none",
    label: "None of these apply to me",
  },
];

interface Props {
  data: AccountData;
  onChange: <K extends keyof AccountData>(key: K, value: AccountData[K]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function UncommonSituationsStep({
  data,
  onChange,
  onNext,
  onBack,
}: Props) {
  const selected = data.uncommonSituations;

  const handleToggle = (value: string) => {
    if (value === "none") {
      onChange("uncommonSituations", ["none"]);
      return;
    }
    const without = selected.filter((v) => v !== "none" && v !== value);
    if (selected.includes(value)) {
      onChange("uncommonSituations", without);
    } else {
      onChange("uncommonSituations", [...without, value]);
    }
  };

  const canContinue = selected.length > 0;

  return (
    <motion.div
      key="uncommon-situations"
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
            Do any of these uncommon situations apply to you?
          </h2>
          <p className="text-muted mt-1">Select all that apply.</p>
        </div>

        <div className="space-y-3">
          {SITUATIONS.map((item) => {
            const isSelected = selected.includes(item.value);
            const isNone = item.value === "none";
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => handleToggle(item.value)}
                className={`
                  w-full p-4 rounded-xl border-2 text-left transition-all cursor-pointer
                  flex items-center gap-3
                  ${isNone ? "mt-2" : ""}
                  ${
                    isSelected
                      ? "border-brand bg-brand/5 shadow-md shadow-brand/10"
                      : "border-app-border bg-white hover:border-brand/40"
                  }
                `}
              >
                <div
                  className={`
                    w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors
                    ${isSelected ? "border-brand bg-brand" : "border-app-border"}
                  `}
                >
                  {isSelected && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-sm font-medium text-navy">
                  {item.label}
                </span>
              </button>
            );
          })}
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
            disabled={!canContinue}
            className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-colors ${
              canContinue
                ? "bg-brand text-white hover:bg-brand-hover cursor-pointer"
                : "bg-brand/40 text-white/70 cursor-not-allowed"
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </motion.div>
  );
}
