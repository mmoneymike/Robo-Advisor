import { motion } from "framer-motion";
import { CardSelect } from "../../components/CardSelect";
import { SECURITY_QUESTIONS } from "../../lib/types";
import type { AccountData } from "../../lib/types";

const variants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

const inputClass =
  "w-full px-4 py-3.5 rounded-xl border border-app-border bg-white text-navy text-lg placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors";

interface Props {
  data: AccountData;
  onChange: <K extends keyof AccountData>(key: K, value: AccountData[K]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function SecurityStep({ data, onChange, onNext, onBack }: Props) {
  const canContinue =
    data.securityQuestion1 !== "" &&
    data.securityAnswer1.trim() !== "" &&
    data.securityQuestion2 !== "" &&
    data.securityAnswer2.trim() !== "";

  return (
    <motion.div
      key="security"
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col items-center px-6 py-10"
    >
      <div className="w-full max-w-3xl space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-navy">Security questions</h2>
          <p className="text-muted mt-1">
            Choose two questions to help verify your identity in the future.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <label className="block text-sm font-medium text-navy">
              Security Question 1
            </label>
            <CardSelect
              value={data.securityQuestion1}
              options={SECURITY_QUESTIONS}
              placeholder="Select a question"
              disabledOptions={
                data.securityQuestion2 ? [data.securityQuestion2] : []
              }
              onChange={(v) => onChange("securityQuestion1", v)}
            />
            {data.securityQuestion1 && (
              <input
                type="text"
                value={data.securityAnswer1}
                onChange={(e) => onChange("securityAnswer1", e.target.value)}
                placeholder="Your answer"
                className={inputClass}
              />
            )}
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-navy">
              Security Question 2
            </label>
            <CardSelect
              value={data.securityQuestion2}
              options={SECURITY_QUESTIONS}
              placeholder="Select a question"
              disabledOptions={
                data.securityQuestion1 ? [data.securityQuestion1] : []
              }
              onChange={(v) => onChange("securityQuestion2", v)}
            />
            {data.securityQuestion2 && (
              <input
                type="text"
                value={data.securityAnswer2}
                onChange={(e) => onChange("securityAnswer2", e.target.value)}
                placeholder="Your answer"
                className={inputClass}
              />
            )}
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
