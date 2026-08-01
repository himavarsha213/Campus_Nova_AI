import logging
from typing import List, Dict, Any, AsyncGenerator
from openai import AsyncOpenAI
from app.core.config import settings

logger = logging.getLogger(__name__)

def get_llm_client_and_model():
    """
    Returns the appropriate AsyncOpenAI client and model name based on settings.
    """
    provider = settings.LLM_PROVIDER.lower()
    if provider == "groq":
        logger.info("Initializing Groq client (OpenAI compatible)...")
        client = AsyncOpenAI(
            api_key=settings.GROQ_API_KEY,
            base_url="https://api.groq.com/openai/v1"
        )
        model = "mixtral-8x7b-32768"
        return client, model
    elif provider == "openai":
        logger.info("Initializing OpenAI client...")
        client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        model = "gpt-4o-mini"
        return client, model
    elif provider == "llama":
        logger.info("Initializing Ollama client (OpenAI compatible)...")
        client = AsyncOpenAI(
            api_key="ollama",
            base_url=f"{settings.OLLAMA_BASE_URL.rstrip('/')}/v1"
        )
        model = "llama3"
        return client, model
    else:
        logger.warning(f"Unknown LLM provider '{provider}', falling back to OpenAI.")
        client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        model = "gpt-4o-mini"
        return client, model

def calculate_confidence_score(chunks: List[Dict[str, Any]]) -> float:
    """
    Calculates overall response confidence score based on similarity scores.
    """
    if not chunks:
        return 0.0
    scores = [c.get("score", 0.0) for c in chunks if "score" in c]
    if not scores:
        return 0.0
    # Average score multiplied by 100 to get percentage
    avg_score = sum(scores) / len(scores)
    confidence = avg_score * 100.0
    return min(max(confidence, 0.0), 100.0)

async def generate_rag_response(
    question: str, 
    chunks: List[Dict[str, Any]], 
    chat_history: str
) -> AsyncGenerator[str, None]:
    """
    Generates RAG response stream using grounded context constraints.
    """
    # 1. Format context chunks
    context_str = ""
    for i, c in enumerate(chunks):
        metadata = c.get("metadata", {})
        doc_name = metadata.get("file_name") or metadata.get("document_name") or "Unknown Document"
        page_num = metadata.get("page_number") or 1
        text = metadata.get("chunk_text") or metadata.get("text") or ""
        context_str += f"Chunk {i+1} [Source: {doc_name}, Page: {page_num}]:\n{text}\n\n"

    if not context_str:
        context_str = "(No relevant context chunks found)"

    # 2. Formulate RAG system prompt
    system_prompt = f"""You are CampusNova AI, an official institutional knowledge assistant.
Answer the user's question STRICTLY AND ONLY using the provided context chunks below.

CONTEXT CHUNKS:
{context_str}

CONVERSATION HISTORY:
{chat_history}

RULES:
1. If the answer cannot be directly derived from the context provided, state clearly:
   "I couldn't find this information in the official college knowledge base. Please contact your department or administrator."
2. Do NOT invent, assume, or extrapolate any policies, dates, fees, or procedures.
3. Keep responses clear, professional, formatted in Markdown with bullet points where helpful.
4. Return structured metadata containing citations for each chunk referenced.
"""

    logger.info("Submitting query to LLM...")
    try:
        client, model = get_llm_client_and_model()
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": question}
        ]

        response_stream = await client.chat.completions.create(
            model=model,
            messages=messages,
            stream=True,
            temperature=0.0 # Force maximum determinism
        )

        async for chunk in response_stream:
            content = chunk.choices[0].delta.content
            if content is not None:
                yield content

    except Exception as e:
        logger.error(f"Error in LLM response generation: {str(e)}", exc_info=True)
        yield "An error occurred while generating the response. Please try again."
