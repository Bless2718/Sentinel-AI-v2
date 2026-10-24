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
  onProcessing?: () => void,
): Promise<DatasetUploadResponse> {
  let datasetId: string | null = null;
  for (let attempt = 1; attempt <= 3; attempt++) {
    const formData = new FormData();
    formData.append("file", file);
    let response: Response;
    try {
      response = await fetch(`${API_BASE_URL}/upload/`, {
        method: "POST",
        body: formData,
      });
    } catch {
      if (attempt === 3) throw new Error("Could not send the file. Please try again.");
      onRetry?.(attempt);
      await sleep(attempt * 5000);
      continue;
    }
    if ([502, 503, 504].includes(response.status) && attempt < 3) {
      onRetry?.(attempt);
      await sleep(attempt * 5000);
      continue;
    }
    if (!response.ok) {
      let detail = `Upload failed (HTTP ${response.status}).`;
      try {
        const data = await response.json();
        if (typeof data.detail === "string") detail = data.detail;
      } catch {}
      throw new Error(detail);
    }
    const result = await response.json();
    datasetId = result.dataset_id;
    break;
  }
  if (!datasetId) throw new Error("Upload could not be accepted.");
  onProcessing?.();
  // Poll after the POST is acknowledged. Do not resubmit a successfully accepted file.
  let consecutiveFailures = 0;
  for (let poll = 0; poll < 120; poll++) {
    await sleep(consecutiveFailures ? Math.min(30000, 3000 * 2 ** Math.min(consecutiveFailures, 4)) : 5000);
    let statusResponse: Response;
    try {
      statusResponse = await fetch(
        `${API_BASE_URL}/upload/${datasetId}/status`,
        { cache: "no-store" },
      );
    } catch {
      consecutiveFailures++;
      if (consecutiveFailures >= 8) throw new Error("Processing was interrupted because the server became unavailable. Please try a smaller dataset.");
      continue;
    }
    if (!statusResponse.ok) {
      consecutiveFailures++;
      if (consecutiveFailures >= 8) throw new Error("Processing was interrupted because the server became unavailable. Please try a smaller dataset.");
      continue;
    }
    consecutiveFailures = 0;
    const result = await statusResponse.json();
    if (result.status === "completed") return result as DatasetUploadResponse;
    if (result.status === "failed") {
      throw new Error(result.detail || "Dataset processing failed.");
    }
  }
  throw new Error("Processing did not finish in time. The server may have restarted or run out of memory. Please check the backend logs.");
}
