import logging
from typing import Optional
from supabase import create_client, Client
from app.core.config import settings

logger = logging.getLogger(__name__)

_supabase_anon: Optional[Client] = None
_supabase_admin: Optional[Client] = None

class MockSupabaseResponse:
    def __init__(self, data=None):
        self.data = data or []

class MockSupabaseTable:
    def select(self, *args, **kwargs): return self
    def insert(self, *args, **kwargs): return self
    def update(self, *args, **kwargs): return self
    def delete(self, *args, **kwargs): return self
    def eq(self, *args, **kwargs): return self
    def order(self, *args, **kwargs): return self
    def limit(self, *args, **kwargs): return self
    def execute(self): return MockSupabaseResponse([])

def get_supabase_client(use_service_role: bool = False) -> Optional[Client]:
    """
    Initializes and returns a Supabase Python Client with lazy initialization.
    Handles library version discrepancies gracefully.
    """
    global _supabase_anon, _supabase_admin

    if use_service_role and _supabase_admin is not None:
        return _supabase_admin
    if not use_service_role and _supabase_anon is not None:
        return _supabase_anon

    url: str = settings.SUPABASE_URL
    key: str = settings.SUPABASE_SERVICE_ROLE_KEY if use_service_role else settings.SUPABASE_KEY

    if not url or not key:
        logger.warning("Supabase URL or Key not set in configuration.")
        return None

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

    def table(self, table_name: str):
        client = get_supabase_client(self.use_service_role)
        if client is None:
            logger.warning(f"Supabase client unavailable, using fallback mock table for '{table_name}'")
            return MockSupabaseTable()
        try:
            return client.table(table_name)
        except Exception as e:
            logger.warning(f"Failed to query table '{table_name}': {e}")
            return MockSupabaseTable()

    def __getattr__(self, name):
        client = get_supabase_client(self.use_service_role)
        if client is None:
            return lambda *args, **kwargs: MockSupabaseResponse([])
        try:
            return getattr(client, name)
        except Exception as e:
            logger.warning(f"Attribute error on Supabase client: {e}")
            return lambda *args, **kwargs: MockSupabaseResponse([])

supabase_anon = LazySupabaseClient(use_service_role=False)
supabase_admin = LazySupabaseClient(use_service_role=True)
