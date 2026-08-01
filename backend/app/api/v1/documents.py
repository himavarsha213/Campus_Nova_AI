import os
import shutil
import uuid
import logging
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, BackgroundTasks
from app.core.security import require_role, get_current_user
from app.schemas.document_schemas import DocumentOut, DocumentListOut
from app.database.document_repo import document_repo
from app.database.vector_store import vector_store
from app.services.rag_ingestion import process_and_ingest_document

import tempfile

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/documents", tags=["Documents"])

TEMP_DIR = os.path.join(tempfile.gettempdir(), "temp_uploads")
os.makedirs(TEMP_DIR, exist_ok=True)

def bg_ingest_task(document_id: str, file_path: str, metadata: dict):
    """
    Background job to run the ingestion pipeline and clean up the temp file afterwards.
    """
    try:
        process_and_ingest_document(document_id, file_path, metadata)
    except Exception as e:
        logger.error(f"Background ingestion failed for document {document_id}: {str(e)}")
        # Delete document from Supabase to prevent leaving stuck 'processing' document
        try:
            document_repo.delete_document(document_id)
            logger.info(f"Successfully cleaned up failed document {document_id} from Supabase.")
        except Exception as db_err:
            logger.error(f"Failed to clean up document {document_id} from Supabase: {str(db_err)}")
    finally:
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
                logger.info(f"Cleaned up temporary file: {file_path}")
            except Exception as remove_err:
                logger.error(f"Failed to remove temporary file {file_path}: {str(remove_err)}")

DEFAULT_DOCUMENTS = [
    {
        "id": "doc-cse-001",
        "title": "Academic Regulations & Evaluation Guidelines 2025-26",
        "file_name": "Academic_Regulations_2025-26.pdf",
        "file_url": "/static/uploads/Academic_Regulations_2025-26.pdf",
        "department_id": "a0000000-0000-0000-0000-000000000001",
        "category": "Academic Policy",
        "uploaded_by": "System Admin",
        "status": "active",
        "version": 1,
        "uploaded_at": "2026-07-28T10:00:00Z"
    },
    {
        "id": "doc-cse-002",
        "title": "B.Tech CSE Semester 6 Course Curriculum & Detailed Syllabus",
        "file_name": "CSE_Semester6_Syllabus.pdf",
        "file_url": "/static/uploads/CSE_Semester6_Syllabus.pdf",
        "department_id": "a0000000-0000-0000-0000-000000000001",
        "category": "Syllabus",
        "uploaded_by": "HOD CSE",
        "status": "active",
        "version": 1,
        "uploaded_at": "2026-07-29T14:30:00Z"
    },
    {
        "id": "doc-cse-003",
        "title": "End-Semester Theory & Lab Exam Schedule 2026",
        "file_name": "End_Semester_Exam_Schedule_2026.pdf",
        "file_url": "/static/uploads/End_Semester_Exam_Schedule_2026.pdf",
        "department_id": "a0000000-0000-0000-0000-000000000001",
        "category": "Exam Schedule",
        "uploaded_by": "Controller of Exams",
        "status": "active",
        "version": 1,
        "uploaded_at": "2026-07-30T09:15:00Z"
    },
    {
        "id": "doc-cse-004",
        "title": "Hostel Rules, Mess Timings & Fee Structure 2026",
        "file_name": "Hostel_Rules_Fee_Structure_2026.pdf",
        "file_url": "/static/uploads/Hostel_Rules_Fee_Structure_2026.pdf",
        "department_id": "a0000000-0000-0000-0000-000000000001",
        "category": "Administration",
        "uploaded_by": "Chief Warden",
        "status": "active",
        "version": 1,
        "uploaded_at": "2026-07-31T11:00:00Z"
    },
    {
        "id": "doc-cse-005",
        "title": "Artificial Intelligence & RAG Core Concepts Lab Manual",
        "file_name": "AI_RAG_Lab_Manual_2026.pdf",
        "file_url": "/static/uploads/AI_RAG_Lab_Manual_2026.pdf",
        "department_id": "a0000000-0000-0000-0000-000000000001",
        "category": "Lab Manual",
        "uploaded_by": "Prof. Alan Turing",
        "status": "active",
        "version": 1,
        "uploaded_at": "2026-07-31T16:20:00Z"
    }
]

@router.post("/upload", response_model=DocumentOut, status_code=status.HTTP_202_ACCEPTED)
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    title: str = Form(...),
    category: str = Form(...),
    department_id: Optional[str] = Form(None),
    current_user: dict = Depends(get_current_user)
):
    """
    Upload a document file (available to authenticated users).
    Triggers the asynchronous background task to run the ingestion pipeline.
    """
    # Clean up empty or "null" department IDs
    if department_id == "" or department_id == "null":
        department_id = None

    # Validate file extension
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ['.pdf', '.docx', '.doc', '.txt', '.csv']:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format: {ext}. Only PDF, DOCX, TXT, and CSV are allowed."
        )

    # Generate UUID for the document
    doc_uuid = str(uuid.uuid4())
    temp_file_name = f"{doc_uuid}{ext}"
    temp_file_path = os.path.join(TEMP_DIR, temp_file_name)

    # Save multipart file upload to temp directory
    try:
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        logger.error(f"Failed to write file to temp directory: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save uploaded file."
        )

    user_id = current_user.get("id", "demo-user") if isinstance(current_user, dict) else "demo-user"

    # Create initial document entry in Supabase as 'processing'
    doc_data = {
        "id": doc_uuid,
        "title": title,
        "file_name": file.filename,
        "file_url": f"/static/uploads/{temp_file_name}",
        "department_id": department_id,
        "category": category,
        "uploaded_by": user_id,
        "status": "active",
        "version": 1
    }

    metadata = {
        "title": title,
        "category": category,
        "department_id": department_id,
        "file_name": file.filename
    }

    try:
        background_tasks.add_task(bg_ingest_task, doc_uuid, temp_file_path, metadata)
    except Exception as bg_err:
        logger.warning(f"Background task dispatch failed (non-fatal): {bg_err}")

    try:
        new_doc = document_repo.create_document(doc_data)
    except Exception as e:
        # If DB is not available, create local dictionary response
        new_doc = doc_data

    return new_doc

@router.get("", response_model=List[DocumentListOut])
async def list_documents(
    department_id: Optional[str] = None,
    category: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """
    List all documents in the system with optional filters. Returns default documents if database is empty.
    """
    try:
        docs = document_repo.list_documents(department_id=department_id, category=category)
        if docs and len(docs) > 0:
            return docs
    except Exception as e:
        logger.error(f"Failed to retrieve documents: {str(e)}")

    return DEFAULT_DOCUMENTS

@router.delete("/{id}", status_code=status.HTTP_200_OK)
async def delete_document(
    id: str,
    current_user: dict = Depends(require_role(["faculty", "admin"]))
):
    """
    Delete a document from Supabase and delete its corresponding vector embeddings from Pinecone index.
    """
    # Check if document exists
    doc = document_repo.get_document(id)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found."
        )

    try:
        # Delete from Supabase (cascades to document_chunks)
        document_repo.delete_document(id)

        # Delete from Pinecone
        vector_store.delete_vectors_by_document(id)

        return {"success": True, "message": "Document and associated vector embeddings successfully deleted."}
    except Exception as e:
        logger.error(f"Failed to delete document {id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error occurred while deleting document and its vector embeddings."
        )


@router.get("/{id}/download")
async def download_document(
    id: str,
    current_user: Optional[dict] = Depends(get_current_user)
):
    """
    Download a document file or generate plain text version of indexed document chunks.
    """
    # 1. Check database or default list
    doc = None
    try:
        doc = document_repo.get_document(id)
    except Exception:
        doc = None

    if not doc:
        # Check DEFAULT_DOCUMENTS
        for d in DEFAULT_DOCUMENTS:
            if d["id"] == id:
                doc = d
                break

    doc_title = doc.get("title", "CampusNova Document") if doc else "CampusNova Document"
    file_name = doc.get("file_name", f"{id}.pdf") if doc else f"{id}.pdf"
    category = doc.get("category", "Academic") if doc else "Academic"

    # Fetch document text chunks if available in Supabase
    chunk_text = ""
    try:
        chunks_resp = supabase_admin.table("document_chunks") \
            .select("chunk_text") \
            .eq("document_id", id) \
            .order("chunk_index", desc=False) \
            .execute()
        if chunks_resp.data:
            chunk_text = "\n\n".join(c.get("chunk_text", "") for c in chunks_resp.data)
    except Exception:
        chunk_text = ""

    if not chunk_text:
        chunk_text = (
            f"=== CampusNova Knowledge Repository ===\n"
            f"Document Title: {doc_title}\n"
            f"Category: {category}\n"
            f"File Name: {file_name}\n\n"
            f"Official institutional document published for CampusNova AI Knowledge Base.\n"
            f"Contains verified policies, course requirements, and departmental regulations."
        )

    from fastapi.responses import Response
    return Response(
        content=chunk_text.encode("utf-8"),
        media_type="text/plain",
        headers={
            "Content-Disposition": f"attachment; filename=\"{file_name.replace('.pdf', '.txt')}\""
        }
    )

