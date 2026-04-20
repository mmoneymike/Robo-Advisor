import { motion } from "framer-motion";

interface Props {
  selected: boolean;
  title: string;
  description: string;
  onClick: () => void;
  dark?: boolean;
}

export function SelectableCard({
  selected,
  title,
  description,
  onClick,
  dark = false,
}: Props) {
  const cardClass = dark
    ? selected
      ? "border-white bg-white/10 shadow-lg shadow-white/5"
      : "border-white/20 bg-white/5 hover:border-white/40"
    : selected
      ? "border-brand bg-brand/5 shadow-md shadow-brand/10"
      : "border-app-border bg-white hover:border-brand/40";

  const dotBorder = dark
    ? selected ? "border-white" : "border-white/40"
    : selected ? "border-brand" : "border-app-border";

  const dotFill = dark ? "bg-white" : "bg-brand";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={`
        w-full p-6 rounded-xl border-2 text-left transition-colors cursor-pointer
        ${cardClass}
      `}
    >
      <div className="flex items-center gap-3 mb-2">
        <div
          className={`
            w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0
            ${dotBorder}
          `}
        >
          {selected && (
            <div className={`w-2.5 h-2.5 rounded-full ${dotFill}`} />
          )}
        </div>
        <h3
          className={`text-lg font-semibold ${dark ? "text-white" : "text-navy"}`}
        >
          {title}
        </h3>
      </div>
      <p
        className={`text-sm ml-8 ${dark ? "text-white/60" : "text-muted"}`}
      >
        {description}
      </p>
    </motion.button>
  );
}
