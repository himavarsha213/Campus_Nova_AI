import logging
from typing import List, Dict, Any, Optional
from app.services.embedding_service import embedding_service
from app.database.vector_store import vector_store

logger = logging.getLogger(__name__)

def search_relevant_chunks(
    query: str, 
    department_id: Optional[str] = None, 
    top_k: int = 5, 
    min_score: float = 0.7
) -> List[Dict[str, Any]]:
    """
    Retrieves the most semantically relevant chunks from Pinecone.
    Filters out chunks with similarity score below the min_score threshold.
    """
    logger.info(f"Retrieving chunks for query='{query}', department_id={department_id}, top_k={top_k}, min_score={min_score}")
    try:
        # 1. Convert query text into embedding vector
        query_vector = embedding_service.get_embedding(query)
        if not query_vector:
            logger.warning("Query vector generation returned empty vector.")
            return []

        # 2. Query Pinecone vector database
        results = vector_store.query_similarity(
            query_vector=query_vector,
            top_k=top_k,
            department_id=department_id
        )

        # 3. Filter by similarity score threshold
        filtered_results = []
        for match in results:
            score = match.get("score", 0.0)
            if score >= min_score:
                filtered_results.append(match)
            else:
                logger.debug(f"Chunk filtered out due to score {score} < {min_score}")

        logger.info(f"Found {len(filtered_results)} matching chunks matching confidence threshold.")
        return filtered_results

    except Exception as e:
        logger.error(f"Error searching relevant chunks: {str(e)}", exc_info=True)
        return []
