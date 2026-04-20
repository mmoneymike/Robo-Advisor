import { motion } from "framer-motion";
import type { AccountData } from "../../lib/types";

const variants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

const inputClass =
  "w-full px-4 py-3.5 rounded-xl border border-app-border bg-white text-navy text-lg placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors";

function formatPhone(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 10);
  if (d.length === 0) return "";
  if (d.length <= 3) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

interface Props {
  data: AccountData;
  onChange: <K extends keyof AccountData>(key: K, value: AccountData[K]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function PhoneStep({ data, onChange, onNext, onBack }: Props) {
  const digits = data.phone.replace(/\D/g, "");
  const canContinue = digits.length === 10;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange("phone", formatPhone(e.target.value));
  };

  return (
    <motion.div
      key="phone"
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col items-center px-6 py-10"
    >
      <div className="w-full max-w-3xl space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-navy">Your phone number</h2>
          <p className="text-muted mt-1">
            We&rsquo;ll use this for account security and notifications.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-navy mb-1.5">
            U.S. Phone Number
          </label>
          <input
            type="tel"
            value={data.phone}
            onChange={handleChange}
            placeholder="(555) 123-4567"
            className={inputClass}
            autoFocus
          />
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
