import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database.supabase_client import supabase_admin

def seed_initial_departments():
    """
    Seeds initial academic departments into the Supabase database.
    """
    departments = [
        {
            "department_name": "Computer Science & Engineering",
            "department_code": "CSE",
            "hod_name": "Dr. Alan Turing"
        },
        {
            "department_name": "Electrical & Electronics Engineering",
            "department_code": "EEE",
            "hod_name": "Dr. Nikola Tesla"
        },
        {
            "department_name": "Mechanical Engineering",
            "department_code": "MECH",
            "hod_name": "Dr. James Watt"
        },
        {
            "department_name": "Business Administration",
            "department_code": "MBA",
            "hod_name": "Dr. Peter Drucker"
        }
    ]

    print("[*] Seeding initial departments into Supabase...")
    for dept in departments:
        try:
            # Check if department already exists
            existing = supabase_admin.table('departments').select('*').eq('department_code', dept['department_code']).execute()
            if existing.data and len(existing.data) > 0:
                print(f"  [i] Department {dept['department_code']} already exists.")
            else:
                inserted = supabase_admin.table('departments').insert(dept).execute()
                print(f"  [+] Added Department: {dept['department_name']} ({dept['department_code']})")
        except Exception as e:
            print(f"  [!] Error inserting {dept['department_code']}: {str(e)}")

if __name__ == "__main__":
    seed_initial_departments()
