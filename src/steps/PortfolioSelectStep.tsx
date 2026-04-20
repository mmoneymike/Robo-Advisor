import { motion } from "framer-motion";
import { PortfolioHeadingWaves } from "../components/PortfolioHeadingWaves";
import { SelectableCard } from "../components/SelectableCard";
import type { FormData } from "../lib/types";

const variants = {
  initial: { opacity: 0, scale: 0.95, y: 30 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: -20 },
};

const PORTFOLIOS = [
  {
    value: "core",
    title: "Core",
    description:
      "A diversified mix of stocks and bonds, built for long-term growth.",
  },
  {
    value: "socially_responsible",
    title: "Socially Responsible",
    description:
      "Invest in companies aligned with ESG principles while growing your wealth.",
  },
  {
    value: "direct_indexing",
    title: "Direct Indexing",
    description:
      "Own individual stocks that track an index, with tax-loss harvesting benefits.",
  },
];

interface Props {
  data: FormData;
  onChange: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function PortfolioSelectStep({
  data,
  onChange,
  onNext,
  onBack,
}: Props) {
  return (
    <motion.div
      key="portfolio-select"
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex-1 flex flex-col items-center justify-center px-6 py-16"
    >
      <div className="w-full max-w-3xl space-y-10">
        <PortfolioHeadingWaves
          title="Select Your Portfolio"
          subtitle="Choose a portfolio to start with. You can change this anytime."
        />

        <div className="space-y-4">
          {PORTFOLIOS.map((p) => (
            <SelectableCard
              key={p.value}
              selected={data.portfolioType === p.value}
              title={p.title}
              description={p.description}
              onClick={() => onChange("portfolioType", p.value)}
            />
          ))}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onBack}
            className="px-6 py-3 rounded-xl border border-app-border text-muted hover:bg-white/80 hover:border-brand/30 transition-colors cursor-pointer"
          >
            Back
          </button>
          <button
            onClick={onNext}
            disabled={!data.portfolioType}
            className={`flex-1 px-6 py-4 rounded-xl font-semibold text-lg transition-all ${
              data.portfolioType
                ? "bg-brand text-white hover:bg-brand-hover cursor-pointer shadow-md shadow-brand/20"
                : "bg-app-border/60 text-muted cursor-not-allowed"
            }`}
          >
            Create My Portfolio
          </button>
        </div>
      </div>
    </motion.div>
  );
}
