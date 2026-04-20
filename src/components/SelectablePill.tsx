import { motion } from "framer-motion";

interface Props {
  selected: boolean;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export function SelectablePill({
  selected,
  label,
  onClick,
  disabled = false,
}: Props) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.04 }}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      className={`
        px-5 py-2.5 rounded-full border-2 text-sm font-medium transition-all
        ${
          disabled
            ? "opacity-50 cursor-not-allowed border-app-border bg-white text-muted"
            : "cursor-pointer " +
              (selected
                ? "border-brand bg-brand/10 text-brand shadow-sm shadow-brand/10"
                : "border-app-border bg-white text-navy hover:border-brand/40")
        }
      `}
    >
      {label}
    </motion.button>
  );
}
