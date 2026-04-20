import type { CSSProperties } from "react";

interface Props {
  label: string;
  description?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unitSuffix?: string;
  minLabel?: string;
  maxLabel?: string;
  onChange: (value: number) => void;
}

export function SliderField({
  label,
  description,
  value,
  min,
  max,
  step = 1,
  unitSuffix,
  minLabel,
  maxLabel,
  onChange,
}: Props) {
  const pct = ((value - min) / (max - min)) * 100;
  const display = step < 1 ? value.toFixed(1) : String(value);

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3 min-w-0">
        <span className="text-sm font-medium text-navy min-w-0 flex-1 pr-1">
          {label}
        </span>
        <span className="text-lg font-semibold text-brand tabular-nums shrink-0 whitespace-nowrap">
          {display}
          {unitSuffix && (
            <span className="text-sm text-muted ml-0.5">{unitSuffix}</span>
          )}
        </span>
      </div>
      {description && (
        <p className="text-xs text-muted leading-relaxed">{description}</p>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
        style={{ "--fill-pct": `${pct}%` } as CSSProperties}
      />
      {(minLabel || maxLabel) && (
        <div className="flex justify-between text-xs text-muted">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      )}
    </div>
  );
}
