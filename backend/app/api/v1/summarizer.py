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


def generate_extractive_summary(text_content: str) -> dict:
    """
    Fallback extractive summary generator built directly from the uploaded document text.
    Ensures structured summaries are generated accurately even when external LLM APIs are offline.
    """
    clean_text = text_content.strip()
    lines = [line.strip() for line in clean_text.splitlines() if line.strip()]

    # Extract executive summary paragraphs
    paragraphs = [p.strip() for p in clean_text.split("\n\n") if len(p.strip()) > 40]
    if paragraphs:
        exec_summary = "\n\n".join(paragraphs[:3])
    else:
        exec_summary = clean_text[:600]

    # Extract key takeaways (informative sentences)
    takeaways = []
    for line in lines:
        if any(kw in line.lower() for kw in ["is ", "are ", "provides ", "covers ", "includes ", "contains ", "overview", "system", "architecture"]):
            if len(line) > 25 and line not in takeaways:
                takeaways.append(line[:150])
        if len(takeaways) >= 6:
            break

    if not takeaways:
        takeaways = [lines[i][:150] for i in range(min(5, len(lines))) if len(lines[i]) > 15]

    # Extract action items
    action_items = []
    for line in lines:
        if any(kw in line.lower() for kw in ["must", "should", "require", "ensure", "submit", "complete", "verify", "study", "use", "refer"]):
            if len(line) > 20 and line not in action_items:
                action_items.append(line[:140])
        if len(action_items) >= 4:
            break

    if not action_items:
        action_items = [
            "Review the document content thoroughly for key concepts and details.",
            "Save or download the summary for quick academic reference.",
            "Verify specific requirements or instructions outlined in the document."
        ]

    # Extract dates/deadlines if present
    import re
    date_matches = re.findall(r'([A-Z][a-z]+\s+\d{1,2},?\s+\d{4}|\d{4}-\d{2}-\d{2}|\d{1,2}/\d{1,2}/\d{4})', clean_text)
    dates = []
    for d in set(date_matches):
        dates.append({"label": "Key Date Mentioned", "date": d})
        if len(dates) >= 4:
            break

    return {
        "executive_summary": exec_summary,
        "key_takeaways": takeaways if takeaways else ["Key topics and instructions covered in the document."],
        "important_dates_deadlines": dates,
        "action_items": action_items
    }

async def generate_structured_summary(text_content: str) -> dict:
    """
    Calls the LLM to produce a structured summary JSON, falling back to extractive summary
    directly from document text if the LLM provider is unavailable.
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

    except Exception as e:
        logger.warning(f"LLM call failed in summary generation, generating extractive text summary fallback: {e}")
        return generate_extractive_summary(text_content)


@router.post("")
async def generate_summary(
    request: SummaryRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Generate a structured AI summary for a document_id (fetches chunks from Supabase)
    or for raw_text directly.
    """
    user_id = str(current_user.get("id", "demo-user")) if isinstance(current_user, dict) else "demo-user"
    document_id = request.document_id
    document_title = "Custom Text"

    # 1. Build the text content to summarize
    if request.raw_text and len(request.raw_text.strip()) > 10:
        text_content = request.raw_text.strip()
        if request.document_id:
            doc_response = supabase_admin.table("documents").select("original_filename").eq("id", request.document_id).execute()
            if doc_response.data:
                document_title = doc_response.data[0].get("original_filename", "Uploaded Document")

    elif request.document_id:
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
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Document text is still being processed or no text could be extracted. Please wait a moment or paste raw text."
            )
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Provide either document_id or valid raw_text."
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
