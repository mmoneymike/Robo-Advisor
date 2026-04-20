import { motion, AnimatePresence } from "framer-motion";
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

export function EmailNameStep({ data, onChange, onNext, onBack }: Props) {
  const canContinue =
    data.firstName.trim() !== "" &&
    data.lastName.trim() !== "" &&
    data.email.trim() !== "";

  return (
    <motion.div
      key="email-name"
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
            Let&rsquo;s start with your name
          </h2>
          <p className="text-muted mt-1">
            We need your legal name for account registration.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-navy mb-1.5">
              Legal First Name
            </label>
            <input
              type="text"
              value={data.firstName}
              onChange={(e) => onChange("firstName", e.target.value)}
              placeholder="First name"
              className={inputClass}
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-1.5">
              Legal Last Name
            </label>
            <input
              type="text"
              value={data.lastName}
              onChange={(e) => onChange("lastName", e.target.value)}
              placeholder="Last name"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => onChange("email", e.target.value)}
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>

          <button
            type="button"
            onClick={() => onChange("useDifferentName", !data.useDifferentName)}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div
              className={`
                w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors
                ${data.useDifferentName ? "border-brand bg-brand" : "border-app-border group-hover:border-brand/40"}
              `}
            >
              {data.useDifferentName && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <span className="text-sm text-muted">
              I go by a different name
            </span>
          </button>

          <AnimatePresence>
            {data.useDifferentName && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-1">
                  <label className="block text-sm font-medium text-navy mb-1.5">
                    Preferred Name
                  </label>
                  <input
                    type="text"
                    value={data.preferredName}
                    onChange={(e) => onChange("preferredName", e.target.value)}
                    placeholder="What should we call you?"
                    className={inputClass}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
