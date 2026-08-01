import logging
from typing import List, Dict, Any, Optional
from app.core.config import settings

logger = logging.getLogger(__name__)

class PineconeVectorStore:
    def __init__(self):
        self.api_key = settings.PINECONE_API_KEY
        self.index_name = settings.PINECONE_INDEX_NAME
        self._index = None

    def _get_index(self):
        if not self._index:
            try:
                from pinecone import Pinecone
                pc = Pinecone(api_key=self.api_key)
                self._index = pc.Index(self.index_name)
            except Exception as e:
                logger.warning(f"Pinecone vector store not connected (using mock fallback): {str(e)}")
                return None
        return self._index

    def upsert_vectors(self, vectors: List[Dict[str, Any]]) -> bool:
        """
        Upserts vector items into Pinecone.
        Format: [{'id': 'vector_id', 'values': [0.1, ...], 'metadata': {...}}]
        """
        index = self._get_index()
        if not index:
            logger.info(f"[Mock Vector Store] Upserted {len(vectors)} vectors locally.")
            return True
        try:
            index.upsert(vectors=vectors)
            return True
        except Exception as e:
            logger.error(f"Pinecone upsert error: {str(e)}")
            return False

    def query_similarity(
        self, 
        query_vector: List[float], 
        top_k: int = 5, 
        department_id: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Queries Pinecone for Top-K similar vectors with optional metadata filter.
        """
        index = self._get_index()
        if not index:
            logger.info("[Mock Vector Store] Returning mock top-k similarity search result.")
            return [
                {
                    "id": "chunk-mock-1",
                    "score": 0.94,
                    "metadata": {
                        "chunk_text": "Students must maintain a minimum attendance of 75% across all academic subjects to qualify for semester examinations.",
                        "document_name": "Academic_Policy_2026.pdf",
                        "page_number": 12,
                        "department": "Computer Science"
                    }
                }
            ]

        metadata_filter = {}
        if department_id:
            metadata_filter = {
                "$or": [
                    {"department_id": {"$eq": department_id}},
                    {"department_id": {"$exists": False}}
                ]
            }

        try:
            response = index.query(
                vector=query_vector,
                top_k=top_k,
                include_metadata=True,
                filter=metadata_filter if metadata_filter else None
            )
            results = []
            for match in response.matches:
                results.append({
                    "id": match.id,
                    "score": match.score,
                    "metadata": match.metadata
                })
            return results
        except Exception as e:
            logger.error(f"Pinecone query error: {str(e)}")
            return []

    def delete_vectors_by_document(self, document_id: str) -> bool:
        """
        Deletes vector embeddings matching a document ID.
        """
        index = self._get_index()
        if not index:
            return True
        try:
            index.delete(filter={"document_id": document_id})
            return True
        except Exception as e:
            logger.error(f"Pinecone vector deletion error: {str(e)}")
            return False

vector_store = PineconeVectorStore()
