import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SelectableCard } from "../components/SelectableCard";
import type { FormData } from "../lib/types";

const variants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

const REACTIONS = [
  {
    value: "sell_all",
    title: "I\u2019d sell everything",
    description: "Cut my losses and move to safety.",
  },
  {
    value: "sell_some",
    title: "I\u2019d sell some",
    description: "Reduce my exposure but stay partially invested.",
  },
  {
    value: "sell_nothing",
    title: "I\u2019d sell nothing",
    description: "Stay the course and wait for recovery.",
  },
  {
    value: "buy_more",
    title: "I\u2019d buy more",
    description: "Take advantage of lower prices.",
  },
];

interface Props {
  data: FormData;
  onChange: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function LossReactionStep({ data, onChange, onNext, onBack }: Props) {
  const [advancing, setAdvancing] = useState(false);

  const handleSelect = (value: string) => {
    onChange("lossReaction", value);
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
      key="loss-reaction"
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
            Imagine you started with a $10k investment.
          </h2>
          <p className="text-muted mt-1">
            Then, in one month, your investment lost $1,000 in value. What would
            you do next?
          </p>
        </div>

        <div className="space-y-4">
          {REACTIONS.map((r) => (
            <SelectableCard
              key={r.value}
              selected={data.lossReaction === r.value}
              title={r.title}
              description={r.description}
              onClick={() => handleSelect(r.value)}
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
            disabled={!data.lossReaction}
            className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-colors ${
              data.lossReaction
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
