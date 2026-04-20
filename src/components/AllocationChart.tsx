import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { ASSETS, ASSET_LABELS, CHART_COLORS } from "../lib/types";

ChartJS.register(ArcElement, Tooltip);

interface Props {
  weights: Record<string, number>;
  /** Override the ordered list of asset keys to render. Defaults to the legacy 3-asset list. */
  assets?: readonly string[];
  /** Override label map (asset key → display name). */
  labels?: Record<string, string>;
  /** Override color array (must match length of `assets`). */
  colors?: string[];
}

export function AllocationChart({
  weights,
  assets = ASSETS,
  labels = ASSET_LABELS,
  colors = CHART_COLORS,
}: Props) {
  const data = {
    labels: assets.map((a) => labels[a] ?? a),
    datasets: [
      {
        data: assets.map((a) => weights[a] ?? 0),
        backgroundColor: colors,
        borderColor: "#ffffff",
        borderWidth: 2,
        hoverOffset: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: "68%",
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: { label: string; parsed: number }) =>
            `${ctx.label}: ${ctx.parsed.toFixed(1)}%`,
        },
      },
    },
  } as const;

  return (
    <div className="w-full max-w-[280px] mx-auto">
      <Doughnut data={data} options={options} />
    </div>
  );
}
