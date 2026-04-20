import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SelectableCard } from "../../components/SelectableCard";
import type { AccountData } from "../../lib/types";

const variants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

const EXPERIENCE_LEVELS = [
  {
    value: "new",
    title: "New",
    description: "I've never invested before and I'm just getting started.",
  },
  {
    value: "limited",
    title: "Limited",
    description:
      "I've made a few trades or used a robo-advisor, but I'm still learning.",
  },
  {
    value: "moderate",
    title: "Moderate",
    description:
      "I have a solid understanding of markets, asset classes, and portfolio strategy.",
  },
  {
    value: "advanced",
    title: "Advanced",
    description:
      "I actively manage portfolios and am comfortable with complex instruments.",
  },
];

interface Props {
  data: AccountData;
  onChange: <K extends keyof AccountData>(key: K, value: AccountData[K]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function InvestingExperienceStep({
  data,
  onChange,
  onNext,
  onBack,
}: Props) {
  const [advancing, setAdvancing] = useState(false);

  const handleSelect = (value: string) => {
    onChange("investingExperience", value);
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
      key="investing-experience"
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
            Investing experience
          </h2>
          <p className="text-muted mt-1">
            How would you describe your investment experience?
          </p>
        </div>

        <div className="space-y-4">
          {EXPERIENCE_LEVELS.map((level) => (
            <SelectableCard
              key={level.value}
              selected={data.investingExperience === level.value}
              title={level.title}
              description={level.description}
              onClick={() => handleSelect(level.value)}
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
            disabled={!data.investingExperience}
            className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-colors ${
              data.investingExperience
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
