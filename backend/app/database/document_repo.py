from typing import List, Dict, Any, Optional
from app.database.supabase_client import supabase_admin

class DocumentRepository:
    def __init__(self):
        self.client = supabase_admin

    def create_document(self, doc_data: Dict[str, Any]) -> Dict[str, Any]:
        response = self.client.table('documents').insert(doc_data).execute()
        return response.data[0]

    def list_documents(self, department_id: Optional[str] = None, category: Optional[str] = None) -> List[Dict[str, Any]]:
        query = self.client.table('documents').select('*, departments(department_name)')
        if department_id:
            query = query.eq('department_id', department_id)
        if category:
            query = query.eq('category', category)
        response = query.order('uploaded_at', desc=True).execute()
        return response.data

    def create_chunks(self, chunks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        response = self.client.table('document_chunks').insert(chunks).execute()
        return response.data

    def get_document(self, doc_id: str) -> Optional[Dict[str, Any]]:
        response = self.client.table('documents').select('*').eq('id', doc_id).execute()
        return response.data[0] if response.data else None

    def update_document(self, doc_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
        response = self.client.table('documents').update(updates).eq('id', doc_id).execute()
        return response.data[0]

    def delete_document(self, doc_id: str) -> bool:
        self.client.table('documents').delete().eq('id', doc_id).execute()
        return True

document_repo = DocumentRepository()
