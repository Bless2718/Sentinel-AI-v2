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

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

async function pingBackend(): Promise<boolean> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(`${API_BASE_URL}/`, {
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
    "Sentinel backend is still waking up. Please wait a few seconds and try again.",
  );
}

export async function uploadDataset(
  file: File,
): Promise<DatasetUploadResponse> {
  // Render free services can sleep after inactivity. Wake the backend
  // before sending the file so the first upload does not fail.
  await ensureBackendReady();

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
      "Unable to reach the Sentinel backend. It may still be starting up. Please try again in a few seconds.",
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
