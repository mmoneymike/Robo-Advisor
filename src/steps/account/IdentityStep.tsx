import { useState } from "react";
import { motion } from "framer-motion";
import type { AccountData } from "../../lib/types";

const variants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

const inputClass =
  "w-full px-4 py-3.5 rounded-xl border border-app-border bg-white text-navy text-lg placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors";

function formatDob(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 8);
  if (d.length === 0) return "";
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

function formatSsn(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 9);
  if (d.length === 0) return "";
  if (d.length <= 3) return d;
  if (d.length <= 5) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5)}`;
}

interface Props {
  data: AccountData;
  onChange: <K extends keyof AccountData>(key: K, value: AccountData[K]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function IdentityStep({ data, onChange, onNext, onBack }: Props) {
  const [showSsn, setShowSsn] = useState(false);

  const dobDigits = data.dob.replace(/\D/g, "");
  const ssnDigits = data.ssn.replace(/\D/g, "");
  const canContinue = dobDigits.length === 8 && ssnDigits.length === 9;

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange("dob", formatDob(e.target.value));
  };

  const handleSsnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange("ssn", formatSsn(e.target.value));
  };

  return (
    <motion.div
      key="identity"
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
            Identity verification
          </h2>
          <p className="text-muted mt-1">
            This information is required by law to open a brokerage account.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-navy mb-1.5">
              Date of Birth
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={data.dob}
              onChange={handleDobChange}
              placeholder="MM/DD/YYYY"
              className={inputClass}
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-1.5">
              Social Security Number
            </label>
            <div className="relative">
              <input
                type={showSsn ? "text" : "password"}
                value={data.ssn}
                onChange={handleSsnChange}
                placeholder="XXX-XX-XXXX"
                className={`${inputClass} pr-16`}
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setShowSsn(!showSsn)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-brand hover:text-brand-hover transition-colors cursor-pointer px-2 py-1"
              >
                {showSsn ? "Hide" : "Show"}
              </button>
            </div>
            <p className="text-xs text-muted mt-1.5">
              Your SSN is encrypted and never stored in plain text.
            </p>
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
