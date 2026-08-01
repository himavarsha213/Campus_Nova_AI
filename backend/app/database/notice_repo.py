from typing import List, Dict, Any, Optional
from app.database.supabase_client import supabase_admin

class NoticeRepository:
    def __init__(self):
        self.client = supabase_admin

    def create_notice(self, notice_data: Dict[str, Any]) -> Dict[str, Any]:
        response = self.client.table('notices').insert(notice_data).execute()
        return response.data[0]

    def list_notices(self, department_id: Optional[str] = None, category: Optional[str] = None) -> List[Dict[str, Any]]:
        query = self.client.table('notices').select('*, departments(department_name)')
        if department_id:
            query = query.eq('department_id', department_id)
        if category:
            query = query.eq('category', category)
        response = query.order('is_pinned', desc=True).order('created_at', desc=True).execute()
        return response.data

    def delete_notice(self, notice_id: str) -> bool:
        self.client.table('notices').delete().eq('id', notice_id).execute()
        return True

notice_repo = NoticeRepository()
