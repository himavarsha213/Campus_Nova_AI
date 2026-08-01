# Step 04: Document Processing & RAG Ingestion Pipeline

## 1. What We Did Up To Now
- Initialized FastAPI backend and Next.js glassmorphic frontend structure in **Step 01**.
- Created Supabase PostgreSQL schema and initialized Pinecone vector database client in **Step 02**.
- Implemented JWT authentication and Role-Based Access Control (RBAC) middleware for Students, Faculty, and Admins in **Step 03**.

---

## 2. Step Master Execution Prompt

```text
You are an expert AI data engineer and NLP pipeline developer. Execute STEP 04 of CampusNova AI by implementing the full document processing, text extraction, chunking, embedding generation, and Pinecone vector ingestion pipeline.

### Requirements:
1. Text Extraction Service (`backend/app/services/document_parser.py`):
   - Multi-format file extractor supporting:
     - `PDF`: Using `pypdf` / `pdfplumber` to extract clean text while retaining page numbers.
     - `DOCX`: Using `python-docx` to extract structured paragraphs and headings.
     - `TXT`: Direct text extraction with UTF-8 normalization.
     - `CSV`: Using `pandas` to format tab/comma tabular data into readable text summaries per row.
   - Text Normalization: Strip boilerplate whitespace, normalize special characters, remove broken formatting, maintain paragraph boundaries.

2. Metadata-Aware Text Chunking Engine (`backend/app/services/text_chunker.py`):
   - Implement Recursive Text Splitter with chunk size: 500-1000 characters and overlap: 100-200 characters.
   - Every chunk must produce a metadata payload:
     - `document_id`: UUID of parent document.
     - `chunk_id`: Unique chunk UUID.
     - `chunk_number`: Sequential index.
     - `page_number`: Extracted page integer.
     - `department_id`: Associated department UUID.
     - `category`: Document category tag (e.g. 'Academic Policy', 'Exam Rules', 'Placements', 'Hostel').
     - `file_name`: Original document filename.

3. Embedding Service (`backend/app/services/embedding_service.py`):
   - Integration with Hugging Face `sentence-transformers/all-MiniLM-L6-v2` (or OpenAI `text-embedding-3-small`).
   - Batch embedding generator converting text chunks into 384/1536-dimensional dense vector floating point arrays.

4. Vector Ingestion Pipeline (`backend/app/services/rag_ingestion.py`):
   - Workflow orchestrator function `process_and_ingest_document(document_id, file_path, metadata)`:
     1. Extract document text with page markers.
     2. Chunk text using metadata-aware splitter.
     3. Generate batch vector embeddings.
     4. Save document chunks into Supabase `document_chunks` table.
     5. Upsert vector records into Pinecone vector index with complete metadata payload.
     6. Update parent document status in Supabase from `processing` to `active`.

5. Document Ingestion API Endpoints (`backend/app/api/v1/documents.py`):
   - `POST /api/v1/documents/upload`: Multipart endpoint restricted to Faculty/Admin (`require_role(["faculty", "admin"])`). Accepts file, title, category, department_id. Saves file, logs entry in Supabase, triggers async background ingestion task (`BackgroundTasks`).
   - `GET /api/v1/documents`: List documents with category and department filtering.
   - `DELETE /api/v1/documents/{id}`: Delete document from Supabase DB and remove corresponding vector embeddings from Pinecone index.

Write robust Python code with background execution, error logging, and cleanup routines for temp files.
```

---

## 3. Expected Outputs of This Step
- `document_parser.py`: Robust text extraction module for PDF, DOCX, TXT, and CSV files.
- `text_chunker.py`: Overlapping chunk generator with page-level metadata tracking.
- `embedding_service.py`: High-performance vector embedding generation client.
- `rag_ingestion.py`: Complete pipeline coordinating extraction $\rightarrow$ chunking $\rightarrow$ embedding $\rightarrow$ Supabase insert $\rightarrow$ Pinecone upsert.
- Document management APIs (`/api/v1/documents/upload`, `/list`, `/delete`) with async background processing.

---

## 4. Step Connectivity & Dependencies

- **Previous Connection**: Relies on vector index wrapper from **Step 02** and auth headers / RBAC permissions implemented in **Step 03**.
- **Next Connection**: Populated vector database and document chunk metadata are strictly required by **Step 05** (RAG Retrieval Core Engine) to perform semantic vector search.
