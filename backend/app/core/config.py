import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "CampusNova AI"
    API_V1_STR: str = "/api/v1"
    DEBUG: bool = True

    # LLM Provider Configuration ("openai" | "grok" | "llama")
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "llama")

    # LLM API Keys & URLs
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "dummy-openai-key")
    XAI_API_KEY: str = os.getenv("XAI_API_KEY", "dummy-xai-key")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "dummy-groq-key")
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")

    # RAG & Embedding Settings
    EMBEDDING_MODEL: str = os.getenv("EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
    EMBEDDING_DIMENSION: int = int(os.getenv("EMBEDDING_DIMENSION", "384"))
    CHUNK_SIZE: int = int(os.getenv("CHUNK_SIZE", "700"))
    CHUNK_OVERLAP: int = int(os.getenv("CHUNK_OVERLAP", "150"))

    # Supabase Configuration
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "https://xyz.supabase.co")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "dummy-anon-key")
    SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "dummy-service-role-key")

    # Pinecone Configuration
    PINECONE_API_KEY: str = os.getenv("PINECONE_API_KEY", "dummy-pinecone-key")
    PINECONE_INDEX_NAME: str = os.getenv("PINECONE_INDEX_NAME", "campusnova-index")
    PINECONE_ENVIRONMENT: str = os.getenv("PINECONE_ENVIRONMENT", "us-east-1")

    # JWT & Auth
    JWT_SECRET: str = os.getenv("JWT_SECRET", "super-secret-key-campusnova-ai-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 Hours

    # CORS Allowed Origins
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://campusnova.ai",
        "https://campus-nova-mbrgy019o-himavarsha.vercel.app",
        "*"
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
