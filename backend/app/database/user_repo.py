import uuid
from typing import Optional, Dict, Any
from app.database.supabase_client import supabase_admin
from app.core.security import get_password_hash

# Pre-seeded local fallback users for offline demo resilience
LOCAL_USERS_DB: Dict[str, Dict[str, Any]] = {
    "hima127@mits.ac.in": {
        "id": "870ed152-9bd7-49d6-a795-b644b77b3440",
        "email": "hima127@mits.ac.in",
        "full_name": "Hima Varsha",
        "role": "student",
        "password_hash": get_password_hash("123456"),
        "semester": 6,
        "department_id": "a0000000-0000-0000-0000-000000000001",
        "created_at": "2026-08-01T00:00:00Z"
    },
    "hima@mits.ac.in": {
        "id": "870ed152-9bd7-49d6-a795-b644b77b3441",
        "email": "hima@mits.ac.in",
        "full_name": "Hima Varsha",
        "role": "student",
        "password_hash": get_password_hash("123456"),
        "semester": 6,
        "department_id": "a0000000-0000-0000-0000-000000000001",
        "created_at": "2026-08-01T00:00:00Z"
    },
    "student@college.edu": {
        "id": "870ed152-9bd7-49d6-a795-b644b77b3442",
        "email": "student@college.edu",
        "full_name": "Demo Student",
        "role": "student",
        "password_hash": get_password_hash("password123"),
        "semester": 4,
        "department_id": "a0000000-0000-0000-0000-000000000001",
        "created_at": "2026-08-01T00:00:00Z"
    },
    "faculty@college.edu": {
        "id": "870ed152-9bd7-49d6-a795-b644b77b3443",
        "email": "faculty@college.edu",
        "full_name": "Dr. Alan Turing",
        "role": "faculty",
        "password_hash": get_password_hash("password123"),
        "semester": 1,
        "department_id": "a0000000-0000-0000-0000-000000000001",
        "created_at": "2026-08-01T00:00:00Z"
    },
    "admin@college.edu": {
        "id": "870ed152-9bd7-49d6-a795-b644b77b3444",
        "email": "admin@college.edu",
        "full_name": "System Administrator",
        "role": "admin",
        "password_hash": get_password_hash("password123"),
        "semester": 1,
        "department_id": "a0000000-0000-0000-0000-000000000001",
        "created_at": "2026-08-01T00:00:00Z"
    }
}

class UserRepository:
    def __init__(self):
        self.client = supabase_admin
        self.local_db = LOCAL_USERS_DB

    def get_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        clean_email = email.lower().strip()
        try:
            response = self.client.table('users').select('*').eq('email', clean_email).execute()
            if response.data and len(response.data) > 0:
                return response.data[0]
        except Exception:
            pass
        
        # Fallback to local store
        return self.local_db.get(clean_email)

    def get_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        try:
            response = self.client.table('users').select('*').eq('id', user_id).execute()
            if response.data and len(response.data) > 0:
                return response.data[0]
        except Exception:
            pass

        # Fallback search local store
        for user in self.local_db.values():
            if str(user.get("id")) == str(user_id):
                return user
        return None

    def create(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        clean_email = user_data["email"].lower().strip()
        try:
            response = self.client.table('users').insert(user_data).execute()
            if response.data and len(response.data) > 0:
                return response.data[0]
        except Exception:
            pass

        # Local fallback creation
        new_user = {
            "id": str(uuid.uuid4()),
            "created_at": "2026-08-01T00:00:00Z",
            **user_data
        }
        self.local_db[clean_email] = new_user
        return new_user

    def update(self, user_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
        try:
            response = self.client.table('users').update(updates).eq('id', user_id).execute()
            if response.data and len(response.data) > 0:
                return response.data[0]
        except Exception:
            pass

        user = self.get_by_id(user_id)
        if user:
            user.update(updates)
            return user
        raise ValueError("User not found")

user_repo = UserRepository()

