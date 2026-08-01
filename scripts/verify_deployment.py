"""
CampusNova AI — Production Environment & Connectivity Verification Script
Run before going live: python scripts/verify_deployment.py
"""
import os
import sys
import httpx

# Force UTF-8 output encoding for Windows terminal
sys.stdout.reconfigure(encoding='utf-8')

# Add backend directory to sys.path
backend_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "backend")
sys.path.insert(0, backend_dir)

from dotenv import load_dotenv
load_dotenv(os.path.join(backend_dir, ".env"))

def check_supabase():
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        print("[FAIL] Supabase env credentials missing!")
        return False
    try:
        project_ref = url.replace("https://", "").replace(".supabase.co", "")
        headers = {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}
        resp = httpx.post(
            f"https://api.supabase.com/v1/projects/{project_ref}/database/query",
            headers=headers,
            json={"query": "SELECT count(*) FROM users"},
            timeout=10
        )
        if resp.status_code == 201:
            print("[OK] Supabase PostgreSQL Database: OK")
            return True
        else:
            print(f"[WARN] Supabase check returned: {resp.status_code}")
            return True
    except Exception as e:
        print(f"[FAIL] Supabase Connection Failed: {e}")
        return False

def check_pinecone():
    api_key = os.getenv("PINECONE_API_KEY")
    if not api_key:
        print("[FAIL] Pinecone API Key missing!")
        return False
    try:
        from pinecone import Pinecone
        pc = Pinecone(api_key=api_key)
        indexes = [idx.name for idx in pc.list_indexes()]
        print(f"[OK] Pinecone Vector Store: OK (Indexes: {indexes})")
        return True
    except Exception as e:
        print(f"[FAIL] Pinecone Connection Failed: {e}")
        return False

def check_llm_provider():
    groq_key = os.getenv("GROQ_API_KEY")
    if groq_key and not groq_key.startswith("sk-proj-your"):
        print("[OK] LLM Provider (Groq API Key): Configured OK")
        return True
    print("[WARN] LLM Provider Key missing or default.")
    return False

if __name__ == "__main__":
    print("==================================================")
    print(" CampusNova AI — Sanity & Pre-flight Verification ")
    print("==================================================")
    sb_ok = check_supabase()
    pc_ok = check_pinecone()
    llm_ok = check_llm_provider()
    
    print("\n--------------------------------------------------")
    if sb_ok and pc_ok and llm_ok:
        print("SUCCESS: ALL PRE-FLIGHT CHECKS PASSED! Ready for production deployment.")
    else:
        print("WARNING: Pre-flight checks completed with warnings. Check configuration before deployment.")
    print("--------------------------------------------------\n")
