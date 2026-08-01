import json
import logging
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from app.core.security import get_current_user
from app.database.chat_repo import chat_repo
from app.database.supabase_client import supabase_admin
from app.services.rag_retriever import search_relevant_chunks
from app.services.rag_generator import generate_rag_response, calculate_confidence_score
from app.services.citation_service import format_citations

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/chat", tags=["Chat"])

class ChatRequest(BaseModel):
    question: str
    conversation_id: Optional[str] = None

async def chat_stream_generator(
    question: str,
    conversation_id: str,
    user_id: str,
    department_id: Optional[str]
):
    """
    Async generator that yields SSE events for:
    1. The active session / conversation ID.
    2. Streaming content tokens from the LLM.
    3. The final response metadata (confidence score and source citations).
    Also handles saving both user and assistant messages to Supabase.
    """
    try:
        # 1. Fetch active conversation history (last 6 turns = 12 messages)
        # We query ordered by created_at desc to get the most recent messages, then reverse them
        history_str = ""
        try:
            hist_response = supabase_admin.table("messages") \
                .select("*") \
                .eq("conversation_id", conversation_id) \
                .order("created_at", desc=True) \
                .limit(12) \
                .execute()
            
            if hist_response.data:
                # Chronological order
                messages_sorted = hist_response.data[::-1]
                for msg in messages_sorted:
                    role = "Student" if msg["sender"] == "user" else "Assistant"
                    history_str += f"{role}: {msg['message']}\n"
        except Exception as e:
            logger.error(f"Failed to fetch conversation history for {conversation_id}: {str(e)}")
            # Fallback to empty history on DB failure
            history_str = ""

        # 2. Save User Message to database
        try:
            chat_repo.add_message(
                conversation_id=conversation_id,
                sender="user",
                message=question,
                citations=[],
                confidence_score=100.0
            )
        except Exception as e:
            logger.error(f"Failed to save user message to database: {str(e)}")

        # 3. Retrieve relevant document chunks from Pinecone
        chunks = search_relevant_chunks(
            query=question,
            department_id=department_id,
            top_k=5,
            min_score=0.7
        )

        # 4. Compute confidence score and format citations
        confidence = calculate_confidence_score(chunks)
        citations = format_citations(chunks)

        # 5. Yield session details first
        yield f"event: session\ndata: {json.dumps({'conversation_id': conversation_id})}\n\n"

        # 6. Stream content tokens from the RAG generator and accumulate response text
        full_response = ""
        async for token in generate_rag_response(question, chunks, history_str):
            full_response += token
            yield f"event: content\ndata: {json.dumps({'content': token})}\n\n"

        # 7. Yield final metadata (citations and confidence score)
        yield f"event: metadata\ndata: {json.dumps({'confidence_score': confidence, 'citations': citations})}\n\n"

        # 8. Save Assistant Response to database
        try:
            chat_repo.add_message(
                conversation_id=conversation_id,
                sender="assistant",
                message=full_response,
                citations=citations,
                confidence_score=confidence
            )

            # Automatically escalate low-confidence responses (< 75%) to faculty queries table
            if confidence < 75.0:
                supabase_admin.table("unanswered_queries").insert({
                    "student_id": user_id,
                    "department_id": department_id,
                    "query_text": question,
                    "ai_response": full_response,
                    "confidence_score": confidence,
                    "status": "pending"
                }).execute()
                logger.info(f"Low-confidence query ({confidence}%) automatically logged to faculty unanswered_queries for user {user_id}")

        except Exception as e:
            logger.error(f"Failed to save assistant message or log query to database: {str(e)}")

    except Exception as e:
        logger.error(f"Error in chat streaming generator: {str(e)}", exc_info=True)
        yield f"event: error\ndata: {json.dumps({'detail': 'An error occurred during chat generation.'})}\n\n"

@router.post("", response_class=StreamingResponse)
async def chat_endpoint(
    request: ChatRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Main endpoint for student and faculty conversational queries.
    Streams RAG responses in SSE format and stores logs/history in Supabase.
    """
    conversation_id = request.conversation_id
    user_id = str(current_user["id"])
    department_id = str(current_user["department_id"]) if current_user.get("department_id") else None

    # If conversation_id is not provided, create a new conversation session
    if not conversation_id:
        try:
            title = request.question[:40] + "..." if len(request.question) > 40 else request.question
            new_conv = chat_repo.create_conversation(user_id=user_id, title=title)
            conversation_id = str(new_conv["id"])
            logger.info(f"Created new conversation session: {conversation_id} for user {user_id}")
        except Exception as e:
            logger.error(f"Failed to create new conversation session: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to initialize a new conversation session."
            )

    return StreamingResponse(
        chat_stream_generator(
            question=request.question,
            conversation_id=conversation_id,
            user_id=user_id,
            department_id=department_id
        ),
        media_type="text/event-stream"
    )

@router.get("/conversations")
async def get_conversations(current_user: dict = Depends(get_current_user)):
    """
    Get all conversation sessions for the logged in user.
    """
    try:
        conversations = chat_repo.get_user_conversations(str(current_user["id"]))
        return conversations
    except Exception as e:
        logger.error(f"Error fetching user conversations: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve conversations."
        )

@router.get("/conversations/{id}/messages")
async def get_conversation_messages(id: str, current_user: dict = Depends(get_current_user)):
    """
    Get messages of a specific conversation session.
    Verifies that the conversation belongs to the user.
    """
    try:
        # Check ownership
        conv_response = supabase_admin.table("conversations").select("*").eq("id", id).execute()
        if not conv_response.data:
            raise HTTPException(status_code=404, detail="Conversation not found.")
        
        conv = conv_response.data[0]
        if str(conv["user_id"]) != str(current_user["id"]):
            raise HTTPException(status_code=403, detail="Access denied. You do not own this conversation.")
            
        messages = chat_repo.get_conversation_messages(id, limit=50)
        return messages
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error fetching messages for conversation {id}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve messages."
        )

@router.delete("/conversations/{id}")
async def delete_conversation(id: str, current_user: dict = Depends(get_current_user)):
    """
    Delete a specific conversation session.
    Verifies that the conversation belongs to the user.
    """
    try:
        # Check ownership
        conv_response = supabase_admin.table("conversations").select("*").eq("id", id).execute()
        if not conv_response.data:
            raise HTTPException(status_code=404, detail="Conversation not found.")
        
        conv = conv_response.data[0]
        if str(conv["user_id"]) != str(current_user["id"]):
            raise HTTPException(status_code=403, detail="Access denied. You do not own this conversation.")
            
        # Delete conversation (cascading deletes messages table records due to foreign keys)
        supabase_admin.table("conversations").delete().eq("id", id).execute()
        return {"success": True, "message": "Conversation successfully deleted."}
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error deleting conversation {id}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to delete conversation."
        )
