import logging
import hashlib
import math
from typing import List
import httpx
from app.core.config import settings

logger = logging.getLogger(__name__)

HF_EMBEDDING_URL = f"https://api-inference.huggingface.co/pipeline/feature-extraction/{settings.EMBEDDING_MODEL}"

class EmbeddingService:
    def __init__(self):
        self.model_name = settings.EMBEDDING_MODEL
        self.dimension = settings.EMBEDDING_DIMENSION

    def get_embeddings(self, texts: List[str]) -> List[List[float]]:
        """
        Generates vector embeddings for a list of text chunks via Cloud API.
        """
        if not texts:
            return []
        
        try:
            headers = {}
            response = httpx.post(
                HF_EMBEDDING_URL,
                headers=headers,
                json={"inputs": texts, "options": {"wait_for_model": True}},
                timeout=25.0
            )
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    # Check if response is 3D tensor (token-level) or 2D vector list
                    if isinstance(data[0], list):
                        if len(data[0]) > 0 and isinstance(data[0][0], list):
                            # Mean pooling across tokens
                            pooled = []
                            for item in data:
                                token_count = len(item)
                                dim = len(item[0])
                                mean_vec = [sum(item[t][d] for t in range(token_count)) / token_count for d in range(dim)]
                                pooled.append(mean_vec)
                            return pooled
                        return data
        except Exception as e:
            logger.warning(f"Cloud embedding API call failed: {e}. Utilizing fallback encoder.")

        return [self._fallback_embedding(text) for text in texts]

    def _fallback_embedding(self, text: str) -> List[float]:
        """
        Deterministic lightweight feature vector generator (384-dim normalized).
        """
        dim = self.dimension
        vec = [0.0] * dim
        words = text.lower().split()
        for word in words:
            h = int(hashlib.md5(word.encode()).hexdigest(), 16)
            idx = h % dim
            val = ((h >> 8) % 1000) / 1000.0 - 0.5
            vec[idx] += val
        norm = math.sqrt(sum(x * x for x in vec)) or 1.0
        return [x / norm for x in vec]

    def get_embedding(self, text: str) -> List[float]:
        """
        Generates a vector embedding for a single text.
        """
        embeddings = self.get_embeddings([text])
        return embeddings[0] if embeddings else []

embedding_service = EmbeddingService()
