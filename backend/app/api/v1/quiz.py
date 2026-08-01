import json
import logging
import uuid
from typing import List, Optional, Literal
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from app.core.security import get_current_user
from app.database.supabase_client import supabase_admin
from app.services.rag_generator import get_llm_client_and_model

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/quiz", tags=["Quiz Generator"])


# ─── Request / Response Schemas ─────────────────────────────────────────────

class QuizGenerateRequest(BaseModel):
    document_id: str
    difficulty: Literal["easy", "medium", "hard"] = "medium"
    question_count: int = 10
    question_type: Literal["mcq", "true_false", "short_answer", "mixed"] = "mcq"


class UserAnswer(BaseModel):
    question_index: int
    selected_answer: str


class QuizSubmitRequest(BaseModel):
    quiz_id: str
    user_answers: List[UserAnswer]


# ─── LLM Quiz Generation Helper ─────────────────────────────────────────────

async def generate_quiz_questions(
    text_content: str,
    difficulty: str,
    question_count: int,
    question_type: str
) -> List[dict]:
    """
    Uses the LLM to generate quiz questions as a structured JSON array.
    """
    difficulty_desc = {
        "easy": "straightforward recall and comprehension questions based on explicitly stated facts",
        "medium": "application and analysis questions requiring understanding of underlying concepts",
        "hard": "synthesis and evaluation questions requiring deep critical thinking about implications"
    }.get(difficulty, "medium-difficulty questions")

    type_instruction = {
        "mcq": "All questions must be multiple choice with exactly 4 options (A, B, C, D).",
        "true_false": "All questions must be True/False with options ['True', 'False'].",
        "short_answer": "All questions are short answer. Set options to [] and correct_answer to the expected answer.",
        "mixed": "Mix of MCQ (4 options) and True/False questions."
    }.get(question_type, "Multiple choice with 4 options.")

    system_prompt = f"""You are CampusNova AI Quiz Generator.
Generate exactly {question_count} {difficulty_desc} quiz questions from the provided document text.
{type_instruction}

Return ONLY a valid JSON array with this exact schema per question:
[
  {{
    "question_text": "The full question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_answer": "The exact correct option text",
    "explanation": "Clear explanation of why this is correct, referencing the document",
    "topic": "Short topic label (e.g. Attendance Policy)"
  }}
]

Rules:
- Base ALL questions STRICTLY on the provided document content only.
- correct_answer must exactly match one of the options array strings.
- explanations should cite the document section where applicable.
- Return ONLY the JSON array. No markdown, no preamble."""

    try:
        client, model = get_llm_client_and_model()
        response = await client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Document Content:\n\n{text_content[:6000]}"}
            ],
            temperature=0.3,
            stream=False
        )

        raw_content = response.choices[0].message.content.strip()

        # Strip markdown fences
        if raw_content.startswith("```"):
            lines = raw_content.splitlines()
            raw_content = "\n".join(lines[1:-1] if lines[-1] == "```" else lines[1:])

        questions = json.loads(raw_content)
        if not isinstance(questions, list):
            raise ValueError("LLM did not return a JSON array")

        return questions[:question_count]

    except (json.JSONDecodeError, ValueError) as e:
        logger.warning(f"LLM returned malformed quiz JSON, using fallback questions: {e}")
        # Fallback sample questions
        fallback = []
        for i in range(min(question_count, 5)):
            fallback.append({
                "question_text": f"Sample Question {i+1}: What is the primary purpose of CampusNova AI?",
                "options": [
                    "To replace faculty members",
                    "To provide AI-powered access to college knowledge documents",
                    "To manage student enrollment",
                    "To grade student assignments"
                ],
                "correct_answer": "To provide AI-powered access to college knowledge documents",
                "explanation": "CampusNova AI is designed to help students retrieve verified information from indexed college documents using RAG technology.",
                "topic": "CampusNova AI Overview"
            })
        return fallback

    except Exception as e:
        logger.error(f"LLM call failed in quiz generation: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="AI quiz generation temporarily unavailable."
        )


# ─── API Endpoints ────────────────────────────────────────────────────────────

@router.post("/generate")
async def generate_quiz(
    request: QuizGenerateRequest,
    current_user: Optional[dict] = Depends(get_current_user)
):
    """
    Generate an AI-powered quiz from a document's indexed text chunks.
    """
    user_id = str(current_user["id"]) if current_user and "id" in current_user else "demo-user-123"

    # Validate question_count bounds
    question_count = max(5, min(request.question_count, 15))

    # 1. Fetch document metadata
    doc_response = supabase_admin.table("documents").select("*").eq("id", request.document_id).execute()
    if not doc_response.data:
        raise HTTPException(status_code=404, detail="Document not found.")
    doc_title = doc_response.data[0].get("original_filename", "Unknown Document")

    # 2. Fetch document text chunks from Supabase
    chunks_response = supabase_admin.table("document_chunks") \
        .select("chunk_text, page_number, chunk_index") \
        .eq("document_id", request.document_id) \
        .order("chunk_index", desc=False) \
        .limit(20) \
        .execute()

    if not chunks_response.data:
        raise HTTPException(
            status_code=404,
            detail="No text chunks found for this document. Please re-index it."
        )

    text_content = "\n\n".join(
        f"[Page {c.get('page_number', '?')}] {c.get('chunk_text', '')}"
        for c in chunks_response.data
    )

    # 3. Generate quiz questions via LLM
    questions = await generate_quiz_questions(
        text_content=text_content,
        difficulty=request.difficulty,
        question_count=question_count,
        question_type=request.question_type
    )

    # 4. Persist quiz session to Supabase quiz_sessions table
    quiz_id = str(uuid.uuid4())
    try:
        supabase_admin.table("quiz_sessions").insert({
            "id": quiz_id,
            "user_id": user_id,
            "document_id": request.document_id,
            "document_title": doc_title,
            "difficulty": request.difficulty,
            "question_type": request.question_type,
            "questions": questions,
            "status": "active"
        }).execute()
    except Exception as e:
        logger.warning(f"Failed to persist quiz session to DB (non-fatal): {str(e)}")

    return {
        "success": True,
        "quiz_id": quiz_id,
        "document_title": doc_title,
        "difficulty": request.difficulty,
        "question_type": request.question_type,
        "question_count": len(questions),
        "questions": questions
    }


@router.post("/submit")
async def submit_quiz(
    request: QuizSubmitRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Submit quiz answers. Evaluates score and saves result to quiz_history.
    """
    user_id = str(current_user["id"])

    # 1. Fetch quiz session
    session_response = supabase_admin.table("quiz_sessions") \
        .select("*").eq("id", request.quiz_id).execute()

    if not session_response.data:
        raise HTTPException(status_code=404, detail="Quiz session not found.")

    session = session_response.data[0]
    questions: List[dict] = session.get("questions", [])
    total = len(questions)

    if total == 0:
        raise HTTPException(status_code=400, detail="Quiz session has no questions.")

    # 2. Evaluate answers
    results = []
    correct_count = 0
    for ans in request.user_answers:
        idx = ans.question_index
        if idx < 0 or idx >= total:
            continue
        q = questions[idx]
        is_correct = ans.selected_answer.strip().lower() == q.get("correct_answer", "").strip().lower()
        if is_correct:
            correct_count += 1

        results.append({
            "question_index": idx,
            "question_text": q.get("question_text"),
            "options": q.get("options", []),
            "user_answer": ans.selected_answer,
            "correct_answer": q.get("correct_answer"),
            "is_correct": is_correct,
            "explanation": q.get("explanation", ""),
            "topic": q.get("topic", "")
        })

    score_percent = round((correct_count / total) * 100, 1) if total > 0 else 0

    # 3. Performance label
    if score_percent >= 80:
        performance = "Excellent"
        performance_badge = "🏆 Excellent Performance!"
    elif score_percent >= 60:
        performance = "Pass"
        performance_badge = "✅ Good Job! Keep it up."
    elif score_percent >= 40:
        performance = "Needs Improvement"
        performance_badge = "📚 Keep Studying!"
    else:
        performance = "Fail"
        performance_badge = "❌ Revise the material and retry."

    # 4. Generate improvement suggestions (simple rule-based)
    incorrect_topics = list({r["topic"] for r in results if not r["is_correct"] and r.get("topic")})
    suggestions = []
    if incorrect_topics:
        suggestions = [f"Review the section on: {t}" for t in incorrect_topics[:3]]
        suggestions.append("Re-read the complete document and use CampusNova AI Chat for clarifications.")

    # 5. Persist quiz result to quiz_history
    try:
        supabase_admin.table("quiz_history").insert({
            "user_id": user_id,
            "quiz_session_id": request.quiz_id,
            "document_id": session.get("document_id"),
            "document_title": session.get("document_title"),
            "difficulty": session.get("difficulty"),
            "total_questions": total,
            "correct_answers": correct_count,
            "score_percent": score_percent,
            "performance": performance,
            "detailed_results": results
        }).execute()
    except Exception as e:
        logger.warning(f"Failed to persist quiz result to DB (non-fatal): {str(e)}")

    return {
        "success": True,
        "quiz_id": request.quiz_id,
        "total_questions": total,
        "correct_answers": correct_count,
        "score_percent": score_percent,
        "performance": performance,
        "performance_badge": performance_badge,
        "improvement_suggestions": suggestions,
        "detailed_results": results
    }


@router.get("/history")
async def get_quiz_history(current_user: dict = Depends(get_current_user)):
    """
    Fetch the current user's past quiz results and performance scores.
    """
    user_id = str(current_user["id"])
    try:
        response = supabase_admin.table("quiz_history") \
            .select("*") \
            .eq("user_id", user_id) \
            .order("created_at", desc=True) \
            .limit(20) \
            .execute()
        return response.data
    except Exception as e:
        logger.error(f"Error fetching quiz history: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch quiz history.")
