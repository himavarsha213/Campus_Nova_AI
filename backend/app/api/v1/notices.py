import logging
from typing import Optional, List
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status, Query
from pydantic import BaseModel

from app.core.security import get_current_user, require_role
from app.database.supabase_client import supabase_admin

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/notices", tags=["Notices"])


# ─── Schemas ─────────────────────────────────────────────────────────────────

class NoticeCreate(BaseModel):
    title: str
    description: str
    category: str = "General"        # General | Exam | Event | Placement | Urgent
    department_id: Optional[str] = None
    expiry_date: Optional[str] = None
    is_pinned: bool = False


class NoticeUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    is_pinned: Optional[bool] = None
    expiry_date: Optional[str] = None


# ─── Endpoints ────────────────────────────────────────────────────────────────

@router.get("")
async def list_notices(
    department_id: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    pinned_only: bool = Query(False),
    limit: int = Query(50, le=100),
    current_user: dict = Depends(get_current_user)
):
    """
    List notices. Students see all active/non-expired notices.
    Faculty/Admin see all including expired.
    """
    role = current_user.get("role", "student")

    try:
        query = supabase_admin.table("notices").select("*")

        if department_id:
            query = query.eq("department_id", department_id)
        if category:
            query = query.eq("category", category)
        if pinned_only:
            query = query.eq("is_pinned", True)

        # Students only see non-expired notices
        if role == "student":
            now_iso = datetime.now(timezone.utc).isoformat()
            # Show notices that are not expired OR have no expiry
            query = query.or_(f"expiry_date.is.null,expiry_date.gt.{now_iso}")

        result = query.order("is_pinned", desc=True)\
                      .order("created_at", desc=True)\
                      .limit(limit)\
                      .execute()

        return {"success": True, "data": result.data, "count": len(result.data)}

    except Exception as e:
        logger.error(f"Failed to fetch notices: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch notices.")


@router.post("", status_code=201)
async def create_notice(
    payload: NoticeCreate,
    current_user: dict = Depends(require_role(["faculty", "admin"]))
):
    """Create a new notice (faculty/admin only)."""
    faculty_id = str(current_user["id"])
    department_id = payload.department_id or current_user.get("department_id")

    try:
        record = {
            "title": payload.title,
            "description": payload.description,
            "category": payload.category,
            "department_id": department_id,
            "posted_by": faculty_id,
            "is_pinned": payload.is_pinned,
            "expiry_date": payload.expiry_date,
        }
        result = supabase_admin.table("notices").insert(record).execute()

        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to create notice.")

        logger.info(f"Notice created by faculty {faculty_id}: {payload.title}")
        return {"success": True, "data": result.data[0]}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to create notice: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create notice.")


@router.put("/{notice_id}/pin")
async def toggle_pin_notice(
    notice_id: str,
    current_user: dict = Depends(require_role(["faculty", "admin"]))
):
    """Toggle the pinned status of a notice."""
    try:
        existing = supabase_admin.table("notices").select("id, is_pinned")\
            .eq("id", notice_id).execute()

        if not existing.data:
            raise HTTPException(status_code=404, detail="Notice not found.")

        current_pin = existing.data[0].get("is_pinned", False)
        result = supabase_admin.table("notices")\
            .update({"is_pinned": not current_pin})\
            .eq("id", notice_id)\
            .execute()

        return {"success": True, "is_pinned": not current_pin, "data": result.data[0] if result.data else {}}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to pin/unpin notice {notice_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update notice.")


@router.put("/{notice_id}")
async def update_notice(
    notice_id: str,
    payload: NoticeUpdate,
    current_user: dict = Depends(require_role(["faculty", "admin"]))
):
    """Update a notice (faculty/admin only)."""
    try:
        updates = {k: v for k, v in payload.model_dump().items() if v is not None}
        if not updates:
            raise HTTPException(status_code=400, detail="No fields to update.")

        result = supabase_admin.table("notices")\
            .update(updates)\
            .eq("id", notice_id)\
            .execute()

        if not result.data:
            raise HTTPException(status_code=404, detail="Notice not found.")

        return {"success": True, "data": result.data[0]}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update notice {notice_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update notice.")


@router.delete("/{notice_id}")
async def delete_notice(
    notice_id: str,
    current_user: dict = Depends(require_role(["faculty", "admin"]))
):
    """Delete a notice (faculty/admin only)."""
    try:
        result = supabase_admin.table("notices")\
            .delete()\
            .eq("id", notice_id)\
            .execute()

        logger.info(f"Notice {notice_id} deleted by {current_user['id']}")
        return {"success": True, "message": "Notice deleted."}

    except Exception as e:
        logger.error(f"Failed to delete notice {notice_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete notice.")


# ─── Unanswered Queries Endpoints ─────────────────────────────────────────────

@router.get("/queries/unanswered")
async def list_unanswered_queries(
    status_filter: Optional[str] = Query("pending"),
    limit: int = Query(30, le=100),
    current_user: dict = Depends(require_role(["faculty", "admin"]))
):
    """List unanswered/low-confidence student queries for faculty review."""
    try:
        query = supabase_admin.table("unanswered_queries").select("*")
        if status_filter:
            query = query.eq("status", status_filter)

        dept_id = current_user.get("department_id")
        if dept_id and current_user.get("role") == "faculty":
            query = query.eq("department_id", dept_id)

        result = query.order("created_at", desc=True).limit(limit).execute()
        return {"success": True, "data": result.data, "count": len(result.data)}

    except Exception as e:
        logger.error(f"Failed to fetch unanswered queries: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch queries.")


@router.put("/queries/{query_id}/resolve")
async def resolve_query(
    query_id: str,
    faculty_notes: str,
    current_user: dict = Depends(require_role(["faculty", "admin"]))
):
    """Mark a query as resolved with faculty notes."""
    try:
        updates = {
            "status": "resolved",
            "faculty_notes": faculty_notes,
            "resolved_by": str(current_user["id"]),
            "resolved_at": datetime.now(timezone.utc).isoformat()
        }
        result = supabase_admin.table("unanswered_queries")\
            .update(updates)\
            .eq("id", query_id)\
            .execute()

        if not result.data:
            raise HTTPException(status_code=404, detail="Query not found.")

        return {"success": True, "data": result.data[0]}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to resolve query {query_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to resolve query.")
