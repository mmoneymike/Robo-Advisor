import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  value: string;
  options: string[];
  placeholder: string;
  disabledOptions?: string[];
  onChange: (value: string) => void;
}

export function CardSelect({
  value,
  options,
  placeholder,
  disabledOptions = [],
  onChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`
          w-full px-4 py-3.5 rounded-xl border text-left text-lg transition-colors
          flex items-center justify-between cursor-pointer
          ${open ? "border-brand ring-2 ring-brand/30" : "border-app-border hover:border-brand/40"}
          ${value ? "text-navy" : "text-muted/50"}
          bg-white
        `}
      >
        <span className="truncate pr-2">{value || placeholder}</span>
        <svg
          className={`w-5 h-5 text-muted shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
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
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute z-10 mt-2 w-full bg-white border border-app-border rounded-xl shadow-lg shadow-navy/5 overflow-hidden"
          >
            <div className="max-h-64 overflow-y-auto p-2 space-y-1">
              {options.map((option) => {
                const disabled = disabledOptions.includes(option);
                const selected = value === option;
                return (
                  <button
                    key={option}
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                      onChange(option);
                      setOpen(false);
                    }}
                    className={`
                      w-full px-4 py-3 rounded-lg text-left text-sm transition-colors
                      ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
                      ${selected ? "bg-brand/10 text-brand font-medium" : "text-navy hover:bg-surface"}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`
                          w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0
                          ${selected ? "border-brand" : "border-app-border"}
                        `}
                      >
                        {selected && (
                          <div className="w-2 h-2 rounded-full bg-brand" />
                        )}
                      </div>
                      <span>{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
