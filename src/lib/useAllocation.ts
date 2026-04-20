import { useState, useEffect, useRef } from "react";
import type { FormData, AllocationResponse } from "./types";
import { buildAllocationQuery } from "./buildAllocationQuery";
import { apiUrl } from "./apiUrl";

export function useAllocation(data: FormData, enabled: boolean) {
  const [response, setResponse] = useState<AllocationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const abortRef = useRef<AbortController>();

  const query = buildAllocationQuery(data);

  useEffect(() => {
    if (!enabled) return;

    clearTimeout(timerRef.current);
    abortRef.current?.abort();

    timerRef.current = setTimeout(async () => {
      setLoading(true);
      setError(null);
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch(apiUrl(`/api?${query}`), {
          signal: controller.signal,
        });
        if (!res.ok) {
          const body = await res.json();
          throw new Error(body.error || "Request failed");
        }
        const json: AllocationResponse = await res.json();
        setResponse(json);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }, 150);

    return () => {
      clearTimeout(timerRef.current);
      abortRef.current?.abort();
    };
  }, [query, enabled]);

  return { response, loading, error };
}
