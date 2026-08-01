"""
seed_faculty_varsha.py — Seed comprehensive sample data for faculty account varsha@mits.ac.in
"""

import sys
import os
from datetime import datetime, timezone

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

from app.database.supabase_client import supabase_admin
from app.core.security import get_password_hash

FACULTY_EMAIL = "varsha@mits.ac.in"
FACULTY_PASSWORD = "123456"
FACULTY_NAME = "Prof. Varsha"

def seed_faculty_data():
    print("\n==================================================")
    print(f"   Seeding Faculty Data for {FACULTY_EMAIL}")
    print("==================================================\n")

    # 1. Verify/Create Department (CSE)
    print("[1/5] Verifying Department (CSE)...")
    dept_res = supabase_admin.table('departments').select('*').eq('department_code', 'CSE').execute()
    if dept_res.data:
        dept_id = dept_res.data[0]['id']
        print(f"      Found existing CSE Department ID: {dept_id}")
    else:
        dept_insert = supabase_admin.table('departments').insert({
            "department_name": "Computer Science & Engineering",
            "department_code": "CSE",
            "hod_name": "Dr. A. K. Sharma"
        }).execute()
        dept_id = dept_insert.data[0]['id']
        print(f"      Created CSE Department ID: {dept_id}")

    # 2. Verify/Create Faculty User
    print("\n[2/5] Verifying Faculty Account...")
    hashed_pw = get_password_hash(FACULTY_PASSWORD)
    user_res = supabase_admin.table('users').select('*').eq('email', FACULTY_EMAIL).execute()

    if user_res.data:
        user_id = user_res.data[0]['id']
        supabase_admin.table('users').update({
            "password_hash": hashed_pw,
            "role": "faculty",
            "full_name": FACULTY_NAME,
            "department_id": dept_id
        }).eq('id', user_id).execute()
        print(f"      Updated Faculty User ID: {user_id}")
    else:
        new_user = supabase_admin.table('users').insert({
            "full_name": FACULTY_NAME,
            "email": FACULTY_EMAIL,
            "password_hash": hashed_pw,
            "role": "faculty",
            "department_id": dept_id
        }).execute()
        user_id = new_user.data[0]['id']
        print(f"      Created Faculty User ID: {user_id}")

    # 3. Seed Course Documents Published by Faculty
    print("\n[3/5] Seeding Faculty Course Materials & Uploaded Documents...")
    faculty_docs = [
        {
            "title": "Advanced Database Management Systems Lecture Notes",
            "file_name": "ADBMS_Lecture_Notes_Module_1_4.pdf",
            "file_url": "https://campusnova.edu/storage/docs/adbms_notes.pdf",
            "department_id": dept_id,
            "category": "Syllabus & Lecture Notes",
            "uploaded_by": user_id,
            "status": "active"
        },
        {
            "title": "Design & Analysis of Algorithms Lab Manual 2026",
            "file_name": "DAA_Lab_Manual_v2.pdf",
            "file_url": "https://campusnova.edu/storage/docs/daa_lab_manual.pdf",
            "department_id": dept_id,
            "category": "Lab Manuals",
            "uploaded_by": user_id,
            "status": "active"
        },
        {
            "title": "Cloud Computing & Virtualization Course Syllabus & Rubrics",
            "file_name": "Cloud_Computing_Syllabus_2026.pdf",
            "file_url": "https://campusnova.edu/storage/docs/cloud_syllabus.pdf",
            "department_id": dept_id,
            "category": "Syllabus & Lecture Notes",
            "uploaded_by": user_id,
            "status": "active"
        },
        {
            "title": "Machine Learning & Pattern Recognition Mid-Term Guide",
            "file_name": "ML_Midterm_Preparation_Guide.pdf",
            "file_url": "https://campusnova.edu/storage/docs/ml_guide.pdf",
            "department_id": dept_id,
            "category": "Reference Books",
            "uploaded_by": user_id,
            "status": "active"
        },
        {
            "title": "Software Engineering Principles & Agile Methodology Workbook",
            "file_name": "SE_Agile_Workbook_2026.pdf",
            "file_url": "https://campusnova.edu/storage/docs/se_workbook.pdf",
            "department_id": dept_id,
            "category": "Lecture Notes",
            "uploaded_by": user_id,
            "status": "active"
        }
    ]

    inserted_doc_ids = []
    for doc in faculty_docs:
        ex_doc = supabase_admin.table('documents').select('*').eq('title', doc['title']).execute()
        if ex_doc.data:
            inserted_doc_ids.append(ex_doc.data[0]['id'])
        else:
            res_doc = supabase_admin.table('documents').insert(doc).execute()
            if res_doc.data:
                inserted_doc_ids.append(res_doc.data[0]['id'])
    print(f"      Seeded {len(inserted_doc_ids)} Faculty Documents!")

    # 4. Seed Department Notices Published by Faculty
    print("\n[4/5] Seeding Department Notices Published by Faculty...")
    faculty_notices = [
        {
            "title": "Important: Mid-Semester Lab Examination Instructions for CSE",
            "description": "All 6th Semester CSE students are required to report to Lab 3 at 9:00 AM sharp for the practical evaluations. Ensure your code repositories are committed.",
            "category": "Exam",
            "department_id": dept_id,
            "created_by": user_id,
            "expiry_date": "2027-12-31",
            "is_pinned": True
        },
        {
            "title": "Guest Lecture on Distributed Systems & Microservices Architecture",
            "description": "Distinguished Industry Speaker Dr. Ramesh Kumar from Google Cloud will host an interactive session in Auditorium B on Friday at 2:00 PM.",
            "category": "Event",
            "department_id": dept_id,
            "created_by": user_id,
            "expiry_date": "2027-12-31",
            "is_pinned": True
        },
        {
            "title": "Submission Deadline Extension: Software Engineering Mini-Project",
            "description": "The final documentation and GitHub repository submission deadline for SE Mini-Projects has been extended to next Monday, 11:59 PM.",
            "category": "General",
            "department_id": dept_id,
            "created_by": user_id,
            "expiry_date": "2027-12-31",
            "is_pinned": False
        },
        {
            "title": "Faculty Office Hours Announcement: Doubts & Assessment Discussions",
            "description": "Prof. Varsha will hold open office hours every Tuesday and Thursday from 3:30 PM to 5:00 PM in Faculty Room 204 for academic guidance.",
            "category": "General",
            "department_id": dept_id,
            "created_by": user_id,
            "expiry_date": "2027-12-31",
            "is_pinned": False
        }
    ]

    for n in faculty_notices:
        ex_n = supabase_admin.table('notices').select('*').eq('title', n['title']).execute()
        if not ex_n.data:
            try:
                n_copy = dict(n)
                n_copy['posted_by'] = user_id
                supabase_admin.table('notices').insert(n_copy).execute()
            except Exception:
                supabase_admin.table('notices').insert(n).execute()
    print("      Seeded Faculty Notices!")

    # 5. Seed Unanswered Student Queries for Faculty Review
    print("\n[5/5] Seeding Student Queries for Faculty Review...")
    student_res = supabase_admin.table('users').select('*').eq('role', 'student').limit(1).execute()
    student_id = student_res.data[0]['id'] if student_res.data else user_id

    sample_queries = [
        {
            "student_id": student_id,
            "department_id": dept_id,
            "query_text": "Can you explain B+ Tree deletion rebalancing steps with a step-by-step example?",
            "ai_response": "B+ Trees maintain balance by merging nodes or redistributing keys when a node falls below minimum occupancy after deletion.",
            "confidence_score": 58.5,
            "status": "pending",
            "faculty_notes": None
        },
        {
            "student_id": student_id,
            "department_id": dept_id,
            "query_text": "What is the key practical difference between optimistic and pessimistic concurrency control in DBMS?",
            "ai_response": "Pessimistic concurrency control uses locks immediately, while optimistic concurrency control delays verification until transaction commit phase.",
            "confidence_score": 62.0,
            "status": "pending",
            "faculty_notes": None
        },
        {
            "student_id": student_id,
            "department_id": dept_id,
            "query_text": "How does Kubernetes Horizontal Pod Autoscaler (HPA) handle rapid traffic spikes?",
            "ai_response": "HPA monitors CPU/Memory metrics and adjusts pod replicas based on target utilization thresholds.",
            "confidence_score": 88.0,
            "status": "resolved",
            "faculty_notes": "Reviewed and clarified during class lecture on Container Orchestration.",
            "resolved_by": user_id,
            "resolved_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "student_id": student_id,
            "department_id": dept_id,
            "query_text": "Can we use PyTorch for the Software Engineering mini-project dataset analysis?",
            "ai_response": "PyTorch is a popular deep learning framework for tensor computation and neural networks.",
            "confidence_score": 91.5,
            "status": "resolved",
            "faculty_notes": "Approved. Students can choose PyTorch or Scikit-Learn as long as model evaluation metrics are documented.",
            "resolved_by": user_id,
            "resolved_at": datetime.now(timezone.utc).isoformat()
        }
    ]

    for q in sample_queries:
        ex_q = supabase_admin.table('unanswered_queries').select('*').eq('query_text', q['query_text']).execute()
        if not ex_q.data:
            try:
                supabase_admin.table('unanswered_queries').insert(q).execute()
            except Exception as e_q:
                print(f"      [Note] Could not insert unanswered query: {e_q}")
    print("      Seeded Student Queries for Faculty Portal!")

    print("\n==================================================")
    print("   SUCCESSFULLY SEEDED ALL FACULTY SAMPLE DATA!")
    print("==================================================\n")

if __name__ == "__main__":
    seed_faculty_data()
