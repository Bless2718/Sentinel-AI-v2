from pydantic_settings import BaseSettings, SettingsConfigDict


class AISettings(BaseSettings):
    GEMINI_API_KEY: str

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


settings = AISettings()