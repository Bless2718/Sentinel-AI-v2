export interface AIChatRequest {
  message: string;
}

export interface AIChatResponse {
  answer: string;
  confidence: number;
  sources: string[];
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

export async function askSentinelAI(
  datasetId: string,
  message: string,
): Promise<AIChatResponse> {
  const response = await fetch(
    `${API_BASE_URL}/ai/chat/${datasetId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        message,
      }),
    },
  );

  if (!response.ok) {
    let detail = "Unable to contact Sentinel AI.";

    try {
      const data = await response.json();

      if (data?.detail) {
        detail = data.detail;
      }
    } catch {
      // Keep default error message.
    }

    throw new Error(detail);
  }

  return response.json();
}