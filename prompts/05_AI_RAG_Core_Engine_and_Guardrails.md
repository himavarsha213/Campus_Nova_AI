# Step 05: RAG Core Engine & Hallucination Guardrails

## 1. What We Did Up To Now
- Initialized FastAPI backend and Next.js glassmorphic frontend structure in **Step 01**.
- Created Supabase PostgreSQL schema and initialized Pinecone vector database client in **Step 02**.
- Implemented JWT authentication and RBAC permissions in **Step 03**.
- Built the document parser, chunker, embedding generator, and Pinecone vector ingestion pipeline in **Step 04**.

---

## 2. Step Master Execution Prompt

```text
You are an expert AI engineer specializing in Retrieval-Augmented Generation (RAG), vector similarity retrieval, and LLM prompt engineering. Execute STEP 05 of CampusNova AI by building the core RAG Query Engine, source citation generator, and hallucination guardrail system.

### Requirements:
1. Vector Similarity Retrieval Engine (`backend/app/services/rag_retriever.py`):
   - `search_relevant_chunks(query: str, department_id: str, top_k: int = 5, min_score: float = 0.7)`:
     1. Convert query text into embedding vector using `embedding_service`.
     2. Query Pinecone vector database with similarity search (Cosine metric).
     3. Apply metadata filters (`department_id` or global documents).
     4. Filter results based on similarity confidence threshold (`min_score`).
     5. Retrieve top Top-K matching vector payloads containing chunk text and citation metadata.

2. RAG Prompt Engineering & Grounded Generation (`backend/app/services/rag_generator.py`):
   - Implement system prompt template enforcing strict institutional grounding:
     ```text
     You are CampusNova AI, an official institutional knowledge assistant.
     Answer the user's question STRICTLY AND ONLY using the provided context chunks below.

     CONTEXT CHUNKS:
     {context_chunks}

     CONVERSATION HISTORY:
     {chat_history}

     RULES:
     1. If the answer cannot be directly derived from the context provided, state clearly:
        "I couldn't find this information in the official college knowledge base. Please contact your department or administrator."
     2. Do NOT invent, assume, or extrapolate any policies, dates, fees, or procedures.
     3. Keep responses clear, professional, formatted in Markdown with bullet points where helpful.
     4. Return structured metadata containing citations for each chunk referenced.
     ```
   - LLM Integration (OpenAI GPT-4o-mini / GPT-3.5-turbo):
     - Support response streaming (`StreamingResponse` generator) for instant UI feedback.
     - Calculate overall response confidence score based on top retrieval similarity scores.

3. Citation Extractor & Parser (`backend/app/services/citation_service.py`):
   - Format source citations array attached to every response:
     ```json
     [
       {
         "document_name": "Academic_Regulations_2026.pdf",
         "page_number": 14,
         "department": "Computer Science",
         "confidence_score": 94.2,
         "snippet": "Attendance requirement is minimum 75%..."
       }
     ]
     ```

4. Conversational Chat Engine (`backend/app/api/v1/chat.py`):
   - `POST /api/v1/chat`: Main chat endpoint accepting `question`, `conversation_id` (optional).
     - Fetches active conversation history from Supabase `messages` table (up to last 6 turns).
     - Triggers RAG retrieval $\rightarrow$ context construction $\rightarrow$ LLM response streaming.
     - Saves user message and assistant answer (with citations JSON and confidence score) into Supabase `messages` table.

Provide production-grade code with error resilience, fallback responses, streaming support, and comprehensive logging.
```

---

## 3. Expected Outputs of This Step
- `rag_retriever.py`: Semantic search component querying Pinecone with score filtering and metadata isolation.
- `rag_generator.py`: Grounded response generator with system prompt guardrails preventing AI hallucinations.
- `citation_service.py`: Citation formatter linking AI answers to specific document titles, page numbers, and departments.
- `/api/v1/chat`: Streaming chat API endpoint maintaining conversation history in Supabase.

---

## 4. Step Connectivity & Dependencies

- **Previous Connection**: Uses vectors upserted in Pinecone and document chunks stored in Supabase from **Step 04**.
- **Next Connection**: Streaming `/api/v1/chat` endpoint and source citations payload power **Step 06** (Student Glassmorphic Chat Interface).
