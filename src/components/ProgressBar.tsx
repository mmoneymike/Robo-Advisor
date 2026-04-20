import { motion } from "framer-motion";

interface Props {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: Props) {
  const pct = (current / total) * 100;

  return (
    <div className="w-full bg-surface h-1.5">
      <motion.div
        className="h-full bg-brand rounded-r-full"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      />
    </div>
  );
}
