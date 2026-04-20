import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SelectableCard } from "../../components/SelectableCard";
import type { AccountData } from "../../lib/types";

const variants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

const ACCOUNT_TYPES = [
  {
    value: "individual",
    title: "Individual Account",
    description: "A standard brokerage account for a single owner.",
  },
  {
    value: "joint",
    title: "Joint Account",
    description: "A shared account with two or more owners.",
  },
  {
    value: "trust",
    title: "Trust Account",
    description: "An account held in the name of a trust entity.",
  },
];

interface Props {
  data: AccountData;
  onChange: <K extends keyof AccountData>(key: K, value: AccountData[K]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function AccountTypeStep({ data, onChange, onNext, onBack }: Props) {
  const [advancing, setAdvancing] = useState(false);

  const handleSelect = (value: string) => {
    onChange("accountType", value);
    setAdvancing(true);
  };

  useEffect(() => {
    if (!advancing) return;
    const timer = setTimeout(() => {
      onNext();
      setAdvancing(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [advancing, onNext]);

  return (
    <motion.div
      key="account-type"
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col items-center px-6 py-10"
    >
      <div className="w-full max-w-3xl space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-navy">Account type</h2>
          <p className="text-muted mt-1">
            What type of account would you like to open?
          </p>
        </div>

        <div className="space-y-4">
          {ACCOUNT_TYPES.map((t) => (
            <SelectableCard
              key={t.value}
              selected={data.accountType === t.value}
              title={t.title}
              description={t.description}
              onClick={() => handleSelect(t.value)}
            />
          ))}
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
            disabled={!data.accountType}
            className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-colors ${
              data.accountType
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
