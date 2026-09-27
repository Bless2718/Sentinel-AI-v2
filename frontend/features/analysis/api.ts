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

export async function uploadDataset(
  file: File,
): Promise<DatasetUploadResponse> {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(
    `${API_BASE_URL}/upload/`,
    {
      method: "POST",
      body: formData,
    },
  );

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
