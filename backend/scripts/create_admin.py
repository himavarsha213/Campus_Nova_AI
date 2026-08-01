"""
create_admin.py — Run this once to create an admin account.
Usage:
    cd backend
    python scripts/create_admin.py
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

from app.database.supabase_client import supabase_admin
from app.core.security import get_password_hash

# ── Configure your admin details here ────────────────────────────────────────
ADMIN_FULL_NAME  = "Admin User"
ADMIN_EMAIL      = "admin@campusnova.edu"
ADMIN_PASSWORD   = "Admin@1234"          # Change this to a strong password!
# ─────────────────────────────────────────────────────────────────────────────

def create_admin():
    print(f"\n[*] Creating admin account...")
    print(f"   Name  : {ADMIN_FULL_NAME}")
    print(f"   Email : {ADMIN_EMAIL}")

    # Check if already exists
    existing = supabase_admin.table('users').select('id, email, role').eq('email', ADMIN_EMAIL).execute()
    if existing.data:
        user = existing.data[0]
        if user['role'] == 'admin':
            print(f"\n[OK] Admin account already exists with this email!")
        else:
            # Upgrade existing user to admin
            supabase_admin.table('users').update({'role': 'admin'}).eq('email', ADMIN_EMAIL).execute()
            print(f"\n[OK] Existing user '{ADMIN_EMAIL}' upgraded to admin role!")
        return

    # Create new admin user
    hashed_pw = get_password_hash(ADMIN_PASSWORD)
    user_data = {
        "full_name": ADMIN_FULL_NAME,
        "email": ADMIN_EMAIL,
        "password_hash": hashed_pw,
        "role": "admin",
    }

    result = supabase_admin.table('users').insert(user_data).execute()
    if result.data:
        print(f"\n[OK] Admin account created successfully!")
        print(f"   ID    : {result.data[0]['id']}")
        print(f"\n[LOGIN] Credentials:")
        print(f"   Email    : {ADMIN_EMAIL}")
        print(f"   Password : {ADMIN_PASSWORD}")
        print(f"\n[!] Please change the password after first login.\n")
    else:
        print(f"\n[ERROR] Failed to create admin account: {result}")

if __name__ == "__main__":
    create_admin()
