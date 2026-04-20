import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SelectableCard } from "../components/SelectableCard";
import type { FormData } from "../lib/types";

const variants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

const GOALS = [
  {
    value: "max_growth",
    title: "Grow my savings as much as possible",
    description:
      "I\u2019m comfortable with higher risk for potentially higher returns.",
  },
  {
    value: "balanced",
    title: "Something in between",
    description: "I want growth but with a reasonable level of risk.",
  },
  {
    value: "safe_growth",
    title: "Grow my savings without too much risk of losing money",
    description:
      "Preserving what I have is more important than chasing big gains.",
  },
];

interface Props {
  data: FormData;
  onChange: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function InvestmentGoalStep({ data, onChange, onNext, onBack }: Props) {
  const [advancing, setAdvancing] = useState(false);

  const handleSelect = (value: string) => {
    onChange("investmentGoal", value);
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
      key="investment-goal"
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
            What do you want from your investments?
          </h2>
          <p className="text-muted mt-1">
            This helps us match your portfolio to your goals.
          </p>
        </div>

        <div className="space-y-4">
          {GOALS.map((g) => (
            <SelectableCard
              key={g.value}
              selected={data.investmentGoal === g.value}
              title={g.title}
              description={g.description}
              onClick={() => handleSelect(g.value)}
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
            disabled={!data.investmentGoal}
            className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-colors ${
              data.investmentGoal
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
