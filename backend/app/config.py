"""
app/config.py
-------------
Centralised settings loaded from the `.env` file via pydantic-settings.
All external credentials live here – nothing is hard-coded anywhere else.
"""

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # ── Ummah API ──────────────────────────────────────────────────────────────
    UMMAH_API_KEY: str
    UMMAH_BASE_URL: str = "https://ummahapi.com/api"

    @field_validator("UMMAH_BASE_URL", mode="before")
    @classmethod
    def validate_ummah_base_url(cls, value: object) -> str:
        if not isinstance(value, str):
            raise ValueError("UMMAH_BASE_URL must be a string URL.")
        sanitized = value.strip()
        if sanitized.endswith("/"):
            sanitized = sanitized[:-1]
        if "api.ummah.com/v1" in sanitized:
            raise ValueError(
                "UMMAH_BASE_URL must be https://ummahapi.com/api, not https://api.ummah.com/v1."
            )
        return sanitized

    # ── AI / Gemini (via Apizio OpenAI-compatible gateway) ────────────────────

    GEMINI_API_KEY: str | None = None
    GOOGLE_API_KEY: str | None = None
    OPENAI_API_KEY: str | None = None
    GEMINI_MODEL: str = "gemini-2.0-flash"

    @field_validator("GEMINI_API_KEY", mode="before")
    @classmethod
    def validate_gemini_api_key(cls, value: object) -> str | None:
        if value is None:
            return None
        if isinstance(value, str):
            sanitized = value.strip()
            if not sanitized:
                return None
            placeholders = {
                "your_gemini_api_key_here",
                "your_api_key_here",
                "changeme",
                "placeholder",
            }
            if sanitized.lower() in placeholders:
                return None
            if sanitized.startswith(("http://", "https://")):
                raise ValueError("GEMINI_API_KEY must be a raw API key, not a URL.")
            return sanitized
        return str(value)

    @field_validator("GOOGLE_API_KEY", "OPENAI_API_KEY", mode="before")
    @classmethod
    def validate_alternative_api_keys(cls, value: object) -> str | None:
        if value is None:
            return None
        if isinstance(value, str):
            sanitized = value.strip()
            if not sanitized:
                return None
            if sanitized.startswith(("http://", "https://")):
                raise ValueError("API key must be a raw API key, not a URL.")
            return sanitized
        return str(value)

    @property
    def effective_gemini_api_key(self) -> str | None:
        return self.GEMINI_API_KEY or self.GOOGLE_API_KEY or self.OPENAI_API_KEY

    # ── CORS ───────────────────────────────────────────────────────────────────
    # Comma-separated list of allowed origins, e.g.
    ALLOWED_ORIGINS: str = "http://localhost:3000/"

    # ── HTTP client timeouts (seconds) ─────────────────────────────────────────
    HTTP_CONNECT_TIMEOUT: float = 10.0
    HTTP_READ_TIMEOUT: float = 30.0

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",         # silently ignore unrecognised env vars
    )

    @property
    def allowed_origins_list(self) -> list[str]:
        """Return ALLOWED_ORIGINS as a Python list (split on commas)."""
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",") if o.strip()]


# Module-level singleton – import this everywhere else
settings = Settings()  # type: ignore[call-arg]