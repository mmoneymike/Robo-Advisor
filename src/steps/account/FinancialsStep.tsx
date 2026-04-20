import { motion } from "framer-motion";
import type { AccountData } from "../../lib/types";

const variants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

function formatCurrency(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  const num = parseInt(digits, 10);
  if (isNaN(num)) return "";
  return "$" + num.toLocaleString("en-US");
}

interface Props {
  data: AccountData;
  onChange: <K extends keyof AccountData>(key: K, value: AccountData[K]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function FinancialsStep({ data, onChange, onNext, onBack }: Props) {
  const incomeDigits = data.annualIncome.replace(/\D/g, "");
  const worthDigits = data.liquidNetWorth.replace(/\D/g, "");
  const canContinue = incomeDigits.length > 0 && worthDigits.length > 0;

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange("annualIncome", formatCurrency(e.target.value));
  };

  const handleWorthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange("liquidNetWorth", formatCurrency(e.target.value));
  };

  return (
    <motion.div
      key="financials"
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col items-center px-6 py-10"
    >
      <div className="w-full max-w-3xl space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-navy">Your financials</h2>
          <p className="text-muted mt-1">
            This helps us recommend an appropriate investment strategy.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-navy mb-1.5">
              Annual Household Income
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={data.annualIncome}
              onChange={handleIncomeChange}
              placeholder="$75,000"
              className="w-full px-4 py-3.5 rounded-xl border border-app-border bg-white text-navy text-lg placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-1.5">
              Liquid Net Worth
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={data.liquidNetWorth}
              onChange={handleWorthChange}
              placeholder="$50,000"
              className="w-full px-4 py-3.5 rounded-xl border border-app-border bg-white text-navy text-lg placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
            />
            <p className="text-xs text-muted mt-1.5">
              Cash, savings, and investments you can access quickly.
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
