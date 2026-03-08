export interface ParsedResponse<T> {
  data: T | null;
  errorMessage: string | null;
}

function truncate(value: string, maxLength = 140): string {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength)}...`;
}

function pickErrorMessage(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const possibleError = (payload as { error?: unknown; message?: unknown }).error;
  if (typeof possibleError === "string" && possibleError.trim().length > 0) {
    return possibleError;
  }

  const possibleMessage = (payload as { error?: unknown; message?: unknown }).message;
  if (typeof possibleMessage === "string" && possibleMessage.trim().length > 0) {
    return possibleMessage;
  }

  return null;
}

export async function parseApiResponse<T>(
  response: Response,
  fallbackError = "Request failed"
): Promise<ParsedResponse<T>> {
  const contentType = response.headers.get("content-type") ?? "";
  const rawText = await response.text();

  if (!rawText) {
    return {
      data: null,
      errorMessage: response.ok ? null : fallbackError,
    };
  }

  const looksLikeJson = contentType.includes("application/json");

  if (!looksLikeJson) {
    const htmlLike = /^\s*</.test(rawText);
    return {
      data: null,
      errorMessage: response.ok
        ? "Expected JSON response but received non-JSON content"
        : htmlLike
          ? `${fallbackError}: server returned HTML instead of JSON`
          : `${fallbackError}: ${truncate(rawText.trim())}`,
    };
  }

  try {
    const payload = JSON.parse(rawText) as T;
    return {
      data: payload,
      errorMessage: response.ok ? null : pickErrorMessage(payload) ?? fallbackError,
    };
  } catch {
    return {
      data: null,
      errorMessage: `${fallbackError}: invalid JSON response`,
    };
  }
}
