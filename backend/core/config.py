from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Database
    database_url: str

    # Server
    host: str = "0.0.0.0"
    port: int = 8000
    environment: str = "development"

    # CORS
    frontend_url: str = "http://localhost:3000"

    # Anthropic
    anthropic_api_key: str = ""

    # Retry config
    max_retries: int = 3
    initial_backoff_ms: int = 1000
    backoff_multiplier: float = 2.0

    # Failure simulation
    default_failure_rate: float = 0.20
    default_latency_ms: int = 100

    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
