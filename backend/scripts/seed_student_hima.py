"""
seed_student_hima.py — Seed script to register student user hima127@mits.ac.in
"""

import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

from app.database.supabase_client import supabase_admin
from app.core.security import get_password_hash

STUDENT_EMAIL = "hima127@mits.ac.in"
STUDENT_PASSWORD = "123456"
STUDENT_NAME = "Hima Varsha"
STUDENT_ROLE = "student"
STUDENT_SEMESTER = 6

def seed_student():
    print(f"\n[*] Seeding student account...")
    print(f"   Email    : {STUDENT_EMAIL}")
    print(f"   Password : {STUDENT_PASSWORD}")
    print(f"   Role     : {STUDENT_ROLE}")

    hashed_pw = get_password_hash(STUDENT_PASSWORD)

    try:
        # 1. Fetch department ID if available
        dept_id = None
        try:
            dept_res = supabase_admin.table('departments').select('id').eq('department_code', 'CSE').execute()
            if dept_res.data:
                dept_id = dept_res.data[0]['id']
        except Exception as e:
            print(f"   [Note] Could not fetch department ID: {e}")

        # 2. Check if user exists
        existing = supabase_admin.table('users').select('*').eq('email', STUDENT_EMAIL).execute()

        if existing.data:
            user = existing.data[0]
            print(f"\n[OK] User '{STUDENT_EMAIL}' already exists (ID: {user['id']}). Updating password & role...")
            update_data = {
                "password_hash": hashed_pw,
                "role": STUDENT_ROLE,
                "full_name": STUDENT_NAME,
                "semester": STUDENT_SEMESTER
            }
            if dept_id:
                update_data["department_id"] = dept_id

            supabase_admin.table('users').update(update_data).eq('email', STUDENT_EMAIL).execute()
            print(f"[OK] User updated successfully!")
        else:
            # Create user
            user_data = {
                "full_name": STUDENT_NAME,
                "email": STUDENT_EMAIL,
                "password_hash": hashed_pw,
                "role": STUDENT_ROLE,
                "semester": STUDENT_SEMESTER
            }
            if dept_id:
                user_data["department_id"] = dept_id

            res = supabase_admin.table('users').insert(user_data).execute()
            if res.data:
                print(f"\n[OK] Created student account successfully! ID: {res.data[0]['id']}")
            else:
                print(f"[ERROR] Failed to insert student user: {res}")

    except Exception as err:
        print(f"\n[ERROR] Exception during seeding: {err}")

if __name__ == "__main__":
    seed_student()
