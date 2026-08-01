import sys
import os

# Add backend directory to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.database.supabase_client import supabase_admin
from app.core.security import get_password_hash

def seed_users():
    print("Seeding test users for Student, Faculty, and Admin roles...")
    
    # 1. Fetch a department to associate with if available
    dept_id = None
    try:
        depts = supabase_admin.table('departments').select('id').execute().data
        if depts:
            dept_id = depts[0]['id']
            print(f"Associating users with department ID: {dept_id}")
    except Exception as e:
        print(f"Warning fetching departments: {e}")

    # Define test users to seed
    test_password = "password123"
    hashed_password = get_password_hash(test_password)
    
    users_to_seed = [
        {
            "email": "student@college.edu",
            "full_name": "Test Student",
            "role": "student",
            "password_hash": hashed_password,
            "department_id": dept_id,
            "semester": 3,
            "phone": "1234567890"
        },
        {
            "email": "faculty@college.edu",
            "full_name": "Test Faculty",
            "role": "faculty",
            "password_hash": hashed_password,
            "department_id": dept_id,
            "semester": 1,
            "phone": "1234567891"
        },
        {
            "email": "admin@college.edu",
            "full_name": "Test Admin",
            "role": "admin",
            "password_hash": hashed_password,
            "department_id": dept_id,
            "semester": 1,
            "phone": "1234567892"
        }
    ]

    for user_data in users_to_seed:
        try:
            # Check if user already exists
            existing = supabase_admin.table('users').select('*').eq('email', user_data['email']).execute().data
            if existing:
                print(f"  [INFO] User {user_data['email']} already exists. Updating password to '{test_password}'.")
                supabase_admin.table('users').update({
                    "password_hash": hashed_password,
                    "role": user_data['role']
                }).eq('email', user_data['email']).execute()
            else:
                supabase_admin.table('users').insert(user_data).execute()
                print(f"  [SUCCESS] Seeded User: {user_data['email']} ({user_data['role']})")
        except Exception as e:
            print(f"  [ERROR] Error seeding user {user_data['email']}: {e}")

if __name__ == "__main__":
    seed_users()
