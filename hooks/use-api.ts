import { useEffect, useState, useCallback } from "react";
import { parseApiResponse } from "@/lib/http";

interface UseApiOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: unknown;
}

export function useApi<T>(url: string, options?: UseApiOptions) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get token from localStorage
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("authToken")
          : null;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...options?.headers,
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        method: options?.method || "GET",
        headers,
        body: options?.body ? JSON.stringify(options.body) : undefined,
      });

      const parsed = await parseApiResponse<T>(
        response,
        `API error: ${response.statusText || response.status}`
      );

      if (!response.ok) {
        throw new Error(parsed.errorMessage || `API error: ${response.statusText}`);
      }

      if (parsed.data === null) {
        throw new Error(parsed.errorMessage || "Invalid API response");
      }

      const result = parsed.data;
      setData(result);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  // Only auto-fetch on GET requests
  useEffect(() => {
    if (options?.method === "GET" || !options?.method) {
      fetchData();
    }
  }, [url, options?.method]);

  return { data, loading, error, refetch: fetchData };
}

export function useApiMutation<T>(url: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (
      body?: unknown,
      options?: { method?: string; headers?: Record<string, string> }
    ) => {
      try {
        setLoading(true);
        setError(null);

        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("authToken")
            : null;

        const headers: Record<string, string> = {
          "Content-Type": "application/json",
          ...options?.headers,
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(url, {
          method: options?.method || "POST",
          headers,
          body: body ? JSON.stringify(body) : undefined,
        });

        const parsed = await parseApiResponse<T>(
          response,
          `API error: ${response.statusText || response.status}`
        );

        if (!response.ok) {
          throw new Error(parsed.errorMessage || `API error: ${response.statusText}`);
        }

        if (parsed.data === null) {
          throw new Error(parsed.errorMessage || "Invalid API response");
        }

        return parsed.data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [url]
  );

  return { mutate, loading, error };
}
