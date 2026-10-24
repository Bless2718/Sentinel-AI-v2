export interface DatasetUploadResponse {
  dataset_id: string;
  filename: string;
  rows: number;
  columns: number;
  mapping: Record<string, string>;
  validation: unknown;
  quality: unknown;
  readiness: unknown;
}

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL?.trim() ||
  (process.env.NODE_ENV === "production"
    ? "https://sentinel-ai-backend-51dj.onrender.com"
    : "http://127.0.0.1:8000")
).replace(/\/$/, "");

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

async function pingBackend(): Promise<boolean> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(`${API_BASE_URL}/health/`, {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
    });

    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

export async function ensureBackendReady(
  maxAttempts = 8,
): Promise<void> {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const ready = await pingBackend();

    if (ready) {
      return;
    }

    if (attempt < maxAttempts) {
      await sleep(6000);
    }
  }

  throw new Error(
    `Cannot connect to Sentinel backend at ${API_BASE_URL}. Check the Render backend status and NEXT_PUBLIC_API_URL configuration, then retry.`,
  );
}

export async function uploadDataset(
  file: File,
  onRetry?: (attempt: number) => void,
): Promise<DatasetUploadResponse> {
  // Retry transient connection failures common during Render cold starts.
  // FormData is recreated each time so the same file can be resent.
  const attempts = 4;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_BASE_URL}/upload/`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        // Application errors must be shown rather than endlessly retried.
        // A gateway error may be transient during service startup.
        if ([502, 503, 504].includes(response.status) && attempt < attempts) {
          onRetry?.(attempt);
          await sleep(attempt * 5000);
          continue;
        }

        let detail = `Upload failed (HTTP ${response.status}).`;
        try {
          const data = await response.json();
          if (typeof data?.detail === "string") detail = data.detail;
        } catch {
          // Preserve the HTTP status when the body isn't JSON.
        }
        throw new Error(detail);
      }

      return (await response.json()) as DatasetUploadResponse;
    } catch (error) {
      if (error instanceof Error && !(
        error instanceof TypeError ||
        error.name === "AbortError"
      )) {
        throw error;
      }
      if (attempt === attempts) {
        throw new Error(
          "Unable to complete the upload right now. Please try again shortly.",
        );
      }
      onRetry?.(attempt);
      await sleep(attempt * 5000);
    }
  }

  throw new Error("Unable to complete the upload right now.");
}
