import logging
from typing import Optional
from supabase import create_client, Client
from app.core.config import settings

logger = logging.getLogger(__name__)

_supabase_anon: Optional[Client] = None
_supabase_admin: Optional[Client] = None

def get_supabase_client(use_service_role: bool = False) -> Optional[Client]:
    """
    Initializes and returns a Supabase Python Client with lazy initialization.
    """
    global _supabase_anon, _supabase_admin

    if use_service_role and _supabase_admin is not None:
        return _supabase_admin
    if not use_service_role and _supabase_anon is not None:
        return _supabase_anon

    url: str = settings.SUPABASE_URL
    key: str = settings.SUPABASE_SERVICE_ROLE_KEY if use_service_role else settings.SUPABASE_KEY

    try:
        client: Client = create_client(url, key)
        if use_service_role:
            _supabase_admin = client
        else:
            _supabase_anon = client
        return client
    except Exception as e:
        logger.error(f"Failed to initialize Supabase client: {str(e)}")
        return None

class LazySupabaseClient:
    def __init__(self, use_service_role: bool = False):
        self.use_service_role = use_service_role

    def __getattr__(self, name):
        client = get_supabase_client(self.use_service_role)
        if client is None:
            raise RuntimeError("Supabase client unavailable")
        return getattr(client, name)

supabase_anon = LazySupabaseClient(use_service_role=False)
supabase_admin = LazySupabaseClient(use_service_role=True)
