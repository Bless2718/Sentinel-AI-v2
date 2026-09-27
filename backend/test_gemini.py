from app.ai.gemini_client import GeminiClient


client = GeminiClient()

response = client.generate(
    "Respond with exactly: Sentinel AI connection successful."
)

print(response)