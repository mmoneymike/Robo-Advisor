import { useState, useEffect, useRef } from "react";
import type { FormData, AccountData, PortfolioDashboardResponse } from "./types";
import { apiUrl } from "./apiUrl";

export function usePortfolioDashboard(
  formData: FormData,
  _accountData: AccountData,
  enabled: boolean,
  /** Risk score 1–10; allocation blends from conservative (1) to growth (10). */
  riskScore: number,
) {
  const [response, setResponse] = useState<PortfolioDashboardResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController>();
  const prevPortfolioTypeRef = useRef<string | null>(null);

  const risk = Math.min(10, Math.max(1, Math.round(riskScore)));

  useEffect(() => {
    if (!enabled || !formData.portfolioType) return;

    const portfolioTypeChanged =
      prevPortfolioTypeRef.current !== null &&
      prevPortfolioTypeRef.current !== formData.portfolioType;
    prevPortfolioTypeRef.current = formData.portfolioType;

    if (portfolioTypeChanged) {
      setResponse(null);
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      portfolio_type: formData.portfolioType,
      risk: String(risk),
    });

    fetch(apiUrl(`/api?${params.toString()}`), {
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) {
          let message = `HTTP ${res.status}`;
          try {
            const body = await res.json();
            message = body.error || message;
          } catch {
            // Response was not JSON — use status code only
          }
          throw new Error(message);
        }
        return res.json() as Promise<PortfolioDashboardResponse>;
      })
      .then((json) => setResponse(json))
      .catch((err) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Unknown error");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [risk, enabled, formData.portfolioType]);

  return { response, loading, error };
}
