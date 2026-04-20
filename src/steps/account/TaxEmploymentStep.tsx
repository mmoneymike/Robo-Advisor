import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SelectablePill } from "../../components/SelectablePill";
import type { AccountData } from "../../lib/types";

const variants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

const FILING_STATUSES = [
  { value: "single", label: "Single" },
  { value: "married_joint", label: "Married Filing Jointly" },
  { value: "married_separate", label: "Married Filing Separately" },
  { value: "head_of_household", label: "Head of Household" },
];

const EMPLOYMENT_STATUSES = [
  { value: "employed", label: "Employed" },
  { value: "self_employed", label: "Self-Employed" },
  { value: "student", label: "Student" },
  { value: "retired", label: "Retired" },
  { value: "unemployed", label: "Unemployed" },
];

interface Props {
  data: AccountData;
  onChange: <K extends keyof AccountData>(key: K, value: AccountData[K]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function TaxEmploymentStep({ data, onChange, onNext, onBack }: Props) {
  const [shouldAdvance, setShouldAdvance] = useState(false);

  const handleFiling = (value: string) => {
    onChange("filingStatus", value);
    if (data.employmentStatus) setShouldAdvance(true);
  };

  const handleEmployment = (value: string) => {
    onChange("employmentStatus", value);
    if (data.filingStatus) setShouldAdvance(true);
  };

  useEffect(() => {
    if (!shouldAdvance) return;
    const timer = setTimeout(() => {
      onNext();
      setShouldAdvance(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [shouldAdvance, onNext]);

  const canContinue = data.filingStatus !== "" && data.employmentStatus !== "";

  return (
    <motion.div
      key="tax-employment"
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col items-center px-6 py-10"
    >
      <div className="w-full max-w-3xl space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-navy">Tax &amp; employment</h2>
          <p className="text-muted mt-1">
            Help us understand your tax and employment situation.
          </p>
        </div>

        <div className="space-y-7">
          <div>
            <label className="block text-sm font-medium text-navy mb-3">
              Filing Status
            </label>
            <div className="flex flex-wrap gap-2.5">
              {FILING_STATUSES.map((s) => (
                <SelectablePill
                  key={s.value}
                  selected={data.filingStatus === s.value}
                  label={s.label}
                  onClick={() => handleFiling(s.value)}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-3">
              Employment Status
            </label>
            <div className="flex flex-wrap gap-2.5">
              {EMPLOYMENT_STATUSES.map((s) => (
                <SelectablePill
                  key={s.value}
                  selected={data.employmentStatus === s.value}
                  label={s.label}
                  onClick={() => handleEmployment(s.value)}
                />
              ))}
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
