import { motion } from "framer-motion";
import type { AccountData } from "../../lib/types";
import { US_STATES } from "../../lib/types";

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

export function AddressStep({ data, onChange, onNext, onBack }: Props) {
  const canContinue =
    data.streetAddress.trim() !== "" &&
    data.city.trim() !== "" &&
    data.state !== "" &&
    data.zip.replace(/\D/g, "").length === 5;

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 5);
    onChange("zip", digits);
  };

  return (
    <motion.div
      key="address"
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col items-center px-6 py-10"
    >
      <div className="w-full max-w-3xl space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-navy">Your address</h2>
          <p className="text-muted mt-1">
            Required for regulatory compliance and account setup.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-navy mb-1.5">
              Street Address
            </label>
            <input
              type="text"
              value={data.streetAddress}
              onChange={(e) => onChange("streetAddress", e.target.value)}
              placeholder="123 Main St, Apt 4B"
              className={inputClass}
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-1.5">
              City
            </label>
            <input
              type="text"
              value={data.city}
              onChange={(e) => onChange("city", e.target.value)}
              placeholder="New York"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">
                State
              </label>
              <div className="relative">
                <select
                  value={data.state}
                  onChange={(e) => onChange("state", e.target.value)}
                  className={`${inputClass} appearance-none pr-10 cursor-pointer ${
                    data.state === "" ? "text-muted/50" : ""
                  }`}
                >
                  <option value="">Select</option>
                  {US_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <svg
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">
                Zip Code
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={data.zip}
                onChange={handleZipChange}
                placeholder="10001"
                className={inputClass}
              />
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
