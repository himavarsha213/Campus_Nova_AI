import os
import logging
from typing import Dict, Any
from app.services.document_parser import extract_text_from_file
from app.services.text_chunker import chunk_document
from app.services.embedding_service import embedding_service
from app.database.document_repo import document_repo
from app.database.vector_store import vector_store

logger = logging.getLogger(__name__)

def process_and_ingest_document(document_id: str, file_path: str, metadata: Dict[str, Any]) -> bool:
    """
    Orchestrates the document ingestion pipeline:
    1. Parse and extract text (with page numbers).
    2. Chunk the text with overlapping bounds.
    3. Generate batch vector embeddings.
    4. Save chunk records to Supabase.
    5. Upsert vector embeddings and metadata to Pinecone.
    6. Update document status in Supabase to active.
    """
    logger.info(f"Starting ingestion pipeline for document_id={document_id}, path={file_path}")
    try:
        # 1. Parse and extract text
        pages = extract_text_from_file(file_path)
        if not pages:
            raise ValueError("No text could be extracted from the document.")

        file_name = os.path.basename(file_path)
        department_id = metadata.get("department_id")
        category = metadata.get("category")

        # 2. Chunk text using metadata-aware splitter
        chunks = chunk_document(
            pages=pages,
            document_id=document_id,
            file_name=file_name,
            department_id=department_id,
            category=category
        )
        if not chunks:
            raise ValueError("No chunks created for the document.")

        # 3. Generate batch vector embeddings
        texts = [c["chunk_text"] for c in chunks]
        embeddings = embedding_service.get_embeddings(texts)

        # 4. Save document chunks into Supabase (only DB-compatible keys)
        db_chunks = []
        for chunk in chunks:
            db_chunks.append({
                "id": chunk["id"],
                "document_id": chunk["document_id"],
                "chunk_number": chunk["chunk_number"],
                "chunk_text": chunk["chunk_text"],
                "page_number": chunk["page_number"],
                "vector_id": chunk["vector_id"]
            })

        logger.info(f"Saving {len(db_chunks)} chunks to Supabase...")
        document_repo.create_chunks(db_chunks)

        # 5. Upsert vector records into Pinecone
        pinecone_vectors = []
        for i, chunk in enumerate(chunks):
            # Construct metadata for Pinecone payload
            vector_metadata = {
                "document_id": str(chunk["document_id"]),
                "chunk_id": str(chunk["id"]),
                "chunk_number": int(chunk["chunk_number"]),
                "page_number": int(chunk["page_number"]),
                "file_name": file_name,
                "chunk_text": chunk["chunk_text"],
            }
            # Add department_id and category if present
            if department_id:
                vector_metadata["department_id"] = str(department_id)
            if category:
                vector_metadata["category"] = str(category)

            pinecone_vectors.append({
                "id": chunk["vector_id"],
                "values": embeddings[i],
                "metadata": vector_metadata
            })

        logger.info(f"Upserting {len(pinecone_vectors)} vectors to Pinecone...")
        vector_store.upsert_vectors(pinecone_vectors)

        # 6. Update parent document status in Supabase
        logger.info("Updating document status in Supabase to active...")
        document_repo.update_document(document_id, {"status": "active"})

        logger.info(f"Ingestion pipeline completed successfully for document_id={document_id}")
        return True

    except Exception as e:
        logger.error(f"Error in document ingestion pipeline for document_id={document_id}: {str(e)}", exc_info=True)
        raise e
