import logging
from supabase import create_client, Client
from app.core.config import settings

logger = logging.getLogger(__name__)

def get_supabase_client(use_service_role: bool = False) -> Client:
    """
    Initializes and returns a Supabase Python Client.
    :param use_service_role: If True, uses the admin Service Role key to bypass RLS.
    """
    url: str = settings.SUPABASE_URL
    key: str = settings.SUPABASE_SERVICE_ROLE_KEY if use_service_role else settings.SUPABASE_KEY

    try:
        supabase: Client = create_client(url, key)
        return supabase
    except Exception as e:
        logger.error(f"Failed to initialize Supabase client: {str(e)}")
        raise e

# Convenience instances
supabase_anon = get_supabase_client(use_service_role=False)
supabase_admin = get_supabase_client(use_service_role=True)
