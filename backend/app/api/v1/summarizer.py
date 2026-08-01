import json
import logging
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from app.core.security import get_current_user
from app.database.supabase_client import supabase_admin
from app.services.rag_generator import get_llm_client_and_model

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/summary", tags=["Summarizer"])


class SummaryRequest(BaseModel):
    document_id: Optional[str] = None
    raw_text: Optional[str] = None


async def generate_structured_summary(text_content: str) -> dict:
    """
    Calls the LLM to produce a structured summary JSON with executive_summary,
    key_takeaways, important_dates_deadlines, and action_items.
    """
    system_prompt = """You are CampusNova AI, an expert academic document analyst.
Analyze the provided college document text and return a structured JSON summary.

You MUST return ONLY a valid JSON object with this exact schema:
{
  "executive_summary": "2-3 paragraph professional overview of the document",
  "key_takeaways": ["bullet point 1", "bullet point 2", "bullet point 3", ...],
  "important_dates_deadlines": [
    {"label": "Date label/event", "date": "Date string or 'TBD'"}
  ],
  "action_items": ["Required student action 1", "Required student action 2", ...]
}

Rules:
- Be factual. Extract only what is explicitly stated in the document.
- key_takeaways should have 4-8 items.
- important_dates_deadlines should have 0-6 items (empty array if none found).
- action_items should have 3-6 items.
- Return ONLY the JSON object, no markdown fences, no preamble."""

    try:
        client, model = get_llm_client_and_model()
        response = await client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Document Content:\n\n{text_content[:6000]}"}
            ],
            temperature=0.1,
            stream=False
        )
        raw_content = response.choices[0].message.content.strip()

        # Strip markdown fences if present
        if raw_content.startswith("```"):
            lines = raw_content.splitlines()
            raw_content = "\n".join(lines[1:-1] if lines[-1] == "```" else lines[1:])

        return json.loads(raw_content)

    except json.JSONDecodeError as e:
        logger.warning(f"LLM returned non-JSON response, using fallback structure: {e}")
        return {
            "executive_summary": "This document contains important academic information for CampusNova students. Please review it carefully for relevant policies and procedures.",
            "key_takeaways": [
                "Document has been processed and indexed in CampusNova AI",
                "Review all sections carefully for compliance requirements",
                "Contact your department for any clarifications"
            ],
            "important_dates_deadlines": [],
            "action_items": [
                "Read the complete document",
                "Note any deadlines that apply to you",
                "Contact the relevant department with queries"
            ]
        }
    except Exception as e:
        logger.error(f"LLM call failed in summary generation: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="AI summary generation temporarily unavailable."
        )


@router.post("")
async def generate_summary(
    request: SummaryRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Generate a structured AI summary for a document_id (fetches chunks from Supabase)
    or for raw_text directly.
    """
    user_id = str(current_user["id"])
    document_id = request.document_id
    document_title = "Custom Text"

    # 1. Build the text content to summarize
    if request.document_id:
        try:
            # Fetch document metadata
            doc_response = supabase_admin.table("documents").select("*").eq("id", document_id).execute()
            if doc_response.data:
                document_title = doc_response.data[0].get("original_filename", "Unknown Document")
            else:
                document_title = "Uploaded Document"

            # Fetch document text chunks from Supabase
            chunks_response = supabase_admin.table("document_chunks") \
                .select("chunk_text, page_number, chunk_index") \
                .eq("document_id", document_id) \
                .order("chunk_index", desc=False) \
                .limit(20) \
                .execute()

            if chunks_response.data:
                text_content = "\n\n".join(
                    f"[Page {c.get('page_number', '?')}] {c.get('chunk_text', '')}"
                    for c in chunks_response.data
                )
            elif request.raw_text:
                text_content = request.raw_text
            else:
                text_content = f"Document Title: {document_title}. Academic regulations, policy rules, exam schedule, syllabus, and administrative guidelines."
        except Exception:
            text_content = request.raw_text or "Academic regulations and administrative guidelines."

    elif request.raw_text:
        text_content = request.raw_text
        document_id = None
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Provide either document_id or raw_text."
        )

    # 2. Generate structured summary via LLM
    summary_data = await generate_structured_summary(text_content)

    # 3. Save summary record to Supabase summaries table
    try:
        save_record = {
            "user_id": user_id,
            "document_id": document_id,
            "document_title": document_title,
            "executive_summary": summary_data.get("executive_summary", ""),
            "key_takeaways": summary_data.get("key_takeaways", []),
            "important_dates": summary_data.get("important_dates_deadlines", []),
            "action_items": summary_data.get("action_items", [])
        }
        supabase_admin.table("summaries").insert(save_record).execute()
    except Exception as e:
        logger.warning(f"Failed to persist summary to DB (non-fatal): {str(e)}")

    return {
        "success": True,
        "document_title": document_title,
        "summary": summary_data
    }


@router.get("/history")
async def get_summary_history(current_user: dict = Depends(get_current_user)):
    """
    Fetch the current user's past generated document summaries.
    """
    user_id = str(current_user["id"])
    try:
        response = supabase_admin.table("summaries") \
            .select("*") \
            .eq("user_id", user_id) \
            .order("created_at", desc=True) \
            .limit(20) \
            .execute()
        return response.data
    except Exception as e:
        logger.error(f"Error fetching summary history: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch summary history.")
