from typing import List, Dict, Any, Optional
from app.database.supabase_client import supabase_admin

class ChatRepository:
    def __init__(self):
        self.client = supabase_admin

    def create_conversation(self, user_id: str, title: str = "New Conversation") -> Dict[str, Any]:
        data = {"user_id": user_id, "title": title}
        response = self.client.table('conversations').insert(data).execute()
        return response.data[0]

    def get_user_conversations(self, user_id: str) -> List[Dict[str, Any]]:
        response = self.client.table('conversations').select('*').eq('user_id', user_id).order('updated_at', desc=True).execute()
        return response.data

    def add_message(self, conversation_id: str, sender: str, message: str, citations: List[Any] = [], confidence_score: float = 100.0) -> Dict[str, Any]:
        msg_data = {
            "conversation_id": conversation_id,
            "sender": sender,
            "message": message,
            "citations": citations,
            "confidence_score": confidence_score
        }
        response = self.client.table('messages').insert(msg_data).execute()
        return response.data[0]

    def get_conversation_messages(self, conversation_id: str, limit: int = 20) -> List[Dict[str, Any]]:
        response = self.client.table('messages').select('*').eq('conversation_id', conversation_id).order('created_at', desc=False).limit(limit).execute()
        return response.data

chat_repo = ChatRepository()
