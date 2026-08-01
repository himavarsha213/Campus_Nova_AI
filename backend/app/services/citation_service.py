import logging
from typing import List, Dict, Any, Optional
from app.database.supabase_client import supabase_admin

logger = logging.getLogger(__name__)

# Simple in-memory cache to reduce database calls for department names
_department_cache: Dict[str, str] = {}

def get_department_name(department_id: Optional[str]) -> str:
    """
    Resolves a department UUID to its corresponding human-readable name.
    If department_id is None, returns "Global".
    """
    if not department_id:
        return "Global"
    
    if department_id in _department_cache:
        return _department_cache[department_id]
        
    try:
        response = supabase_admin.table("departments").select("department_name").eq("id", department_id).execute()
        if response.data and len(response.data) > 0:
            dept_name = response.data[0]["department_name"]
            _department_cache[department_id] = dept_name
            return dept_name
        else:
            logger.warning(f"Department ID {department_id} not found in database.")
    except Exception as e:
        logger.error(f"Error fetching department name for {department_id}: {str(e)}")
        
    return "Unknown"

def format_citations(chunks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Formats Pinecone matches/chunks into a structured list of source citations.
    """
    citations = []
    for chunk in chunks:
        metadata = chunk.get("metadata", {})
        score = chunk.get("score", 0.0)
        
        # Convert cosine similarity score (typically 0.0 to 1.0) to a percentage
        confidence = round(score * 100, 1)
        
        dept_id = metadata.get("department_id")
        dept_name = get_department_name(dept_id)
        
        citations.append({
            "document_name": metadata.get("file_name") or metadata.get("document_name") or "Unknown Document",
            "page_number": int(metadata.get("page_number") or 1),
            "department": dept_name,
            "confidence_score": confidence,
            "snippet": metadata.get("chunk_text") or metadata.get("text") or ""
        })
    return citations
