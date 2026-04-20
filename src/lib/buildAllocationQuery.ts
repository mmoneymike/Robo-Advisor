import type { FormData } from "./types";

export function buildAllocationQuery(data: FormData): string {
  const params = new URLSearchParams();
  params.set("mode", data.mode);
  params.set("risk", String(data.risk));
  params.set("horizon", String(data.horizon));
  params.set("liquidity_need", String(data.liquidity_need));
  params.set("drawdown_tolerance", String(data.drawdown_tolerance));
  params.set("tactical_intensity", String(data.tactical_intensity));
  params.set("macro_growth", String(data.macro_growth));
  params.set("macro_rates", String(data.macro_rates));
  params.set("macro_inflation", String(data.macro_inflation));
  params.set("macro_volatility", String(data.macro_volatility));

  if (data.mode === "manual_override") {
    params.set("manual_spym", String(data.manual_spym));
    params.set("manual_vea", String(data.manual_vea));
    params.set("manual_agg", String(data.manual_agg));
  }

  return params.toString();
}
