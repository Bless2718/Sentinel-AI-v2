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
): Promise<DatasetUploadResponse> {
  // Render free services may sleep. Try waking the server, but don't
  // prevent a real upload solely because the health probe failed.
  try {
    await ensureBackendReady();
  } catch {
    // The upload request itself is the source of truth.
  }

  const formData = new FormData();
  formData.append("file", file);

  let response: Response;

  try {
    response = await fetch(
      `${API_BASE_URL}/upload/`,
      {
        method: "POST",
        body: formData,
      },
    );
  } catch {
    throw new Error(
      `Upload could not reach ${API_BASE_URL}. Verify NEXT_PUBLIC_API_URL and that the Render backend is running, then try again.`,
    );
  }

  if (!response.ok) {
    let detail = "Dataset upload failed.";

    try {
      const data = await response.json();

      if (data?.detail) {
        detail = data.detail;
      }
    } catch {
      // Keep default error.
    }

    throw new Error(detail);
  }

  return response.json();
}
