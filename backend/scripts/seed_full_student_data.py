"""
seed_full_student_data.py — Seeds comprehensive sample data for hima127@mits.ac.in across all student portal sections.
"""

import sys
import os
import uuid
from datetime import datetime, timedelta

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

from app.database.supabase_client import supabase_admin
from app.core.security import get_password_hash

STUDENT_EMAIL = "hima127@mits.ac.in"
STUDENT_PASSWORD = "123456"

def seed_all_student_data():
    print(f"\n==================================================")
    print(f"   Seeding Full Student Data for {STUDENT_EMAIL}")
    print(f"==================================================\n")

    # 1. Verify/Create Department (CSE)
    print("[1/6] Verifying Department (CSE)...")
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

    # 2. Verify/Create Student User
    print("\n[2/6] Verifying Student Account...")
    hashed_pw = get_password_hash(STUDENT_PASSWORD)
    user_res = supabase_admin.table('users').select('*').eq('email', STUDENT_EMAIL).execute()
    
    if user_res.data:
        user = user_res.data[0]
        user_id = user['id']
        supabase_admin.table('users').update({
            "password_hash": hashed_pw,
            "role": "student",
            "full_name": "Hima Varsha",
            "semester": 6,
            "department_id": dept_id
        }).eq('id', user_id).execute()
        print(f"      Updated Student User ID: {user_id}")
    else:
        new_user = supabase_admin.table('users').insert({
            "full_name": "Hima Varsha",
            "email": STUDENT_EMAIL,
            "password_hash": hashed_pw,
            "role": "student",
            "semester": 6,
            "department_id": dept_id
        }).execute()
        user_id = new_user.data[0]['id']
        print(f"      Created Student User ID: {user_id}")

    # 3. Seed Documents & Course Materials
    print("\n[3/6] Seeding Sample Documents...")
    sample_docs = [
        {
            "title": "Data Structures & Algorithms Comprehensive Guide",
            "file_name": "DSA_Comprehensive_Guide_2026.pdf",
            "file_url": "https://campusnova.edu/storage/docs/dsa_guide.pdf",
            "department_id": dept_id,
            "category": "Syllabus & Lecture Notes",
            "uploaded_by": user_id,
            "status": "active"
        },
        {
            "title": "Operating Systems - Concepts & Kernel Architecture",
            "file_name": "OS_Kernel_Architecture_Ch1_4.pdf",
            "file_url": "https://campusnova.edu/storage/docs/os_notes.pdf",
            "department_id": dept_id,
            "category": "Reference Books",
            "uploaded_by": user_id,
            "status": "active"
        },
        {
            "title": "Database Management Systems Lab Manual",
            "file_name": "DBMS_Lab_Manual_v3.pdf",
            "file_url": "https://campusnova.edu/storage/docs/dbms_manual.pdf",
            "department_id": dept_id,
            "category": "Lab Manuals",
            "uploaded_by": user_id,
            "status": "active"
        },
        {
            "title": "Artificial Intelligence & Neural Networks Primer",
            "file_name": "AI_Neural_Networks_Primer.pdf",
            "file_url": "https://campusnova.edu/storage/docs/ai_primer.pdf",
            "department_id": dept_id,
            "category": "Lecture Notes",
            "uploaded_by": user_id,
            "status": "active"
        },
        {
            "title": "Computer Networks Protocol Suite & Security",
            "file_name": "CN_Protocols_Security_Guide.pdf",
            "file_url": "https://campusnova.edu/storage/docs/cn_security.pdf",
            "department_id": dept_id,
            "category": "Syllabus & Lecture Notes",
            "uploaded_by": user_id,
            "status": "active"
        }
    ]

    inserted_doc_ids = []
    for doc in sample_docs:
        # Avoid duplicate documents
        existing_doc = supabase_admin.table('documents').select('*').eq('title', doc['title']).execute()
        if existing_doc.data:
            doc_id = existing_doc.data[0]['id']
            inserted_doc_ids.append(doc_id)
        else:
            doc_res = supabase_admin.table('documents').insert(doc).execute()
            if doc_res.data:
                inserted_doc_ids.append(doc_res.data[0]['id'])
    print(f"      Seeded {len(inserted_doc_ids)} Documents!")

    # 4. Seed Notices
    print("\n[4/6] Seeding Notices & Campus Announcements...")
    sample_notices = [
        {
            "title": "End-Semester Examination Timetable - B.Tech CSE Semester 6",
            "description": "The official timetable for the upcoming B.Tech CSE 6th Semester final exams has been published. Exams commence on May 15, 2026. Please check your hall tickets in the portal.",
            "category": "Examination",
            "department_id": dept_id,
            "created_by": user_id,
            "expiry_date": "2027-12-31",
            "is_pinned": True
        },
        {
            "title": "Annual AI & Cloud Hackathon 2026 Registration Open",
            "description": "Register your team for the 48-hour CampusNova Hackathon focusing on LLMs, RAG, and Cloud Native Solutions. Exciting cash prizes and internship opportunities!",
            "category": "Events",
            "department_id": dept_id,
            "created_by": user_id,
            "expiry_date": "2027-12-31",
            "is_pinned": True
        },
        {
            "title": "Central Library Extended Hours During Exam Week",
            "description": "The main library and quiet study areas will remain open 24/7 starting next Monday to support students preparing for end-semester assessments.",
            "category": "General Notice",
            "department_id": dept_id,
            "created_by": user_id,
            "expiry_date": "2027-12-31",
            "is_pinned": False
        },
        {
            "title": "Placement Drive 2026: Campus Visit by Leading Tech Firms",
            "description": "Top tier tech organizations will be visiting campus next month for placement interviews. Ensure your resume and portfolio links are updated in the career portal.",
            "category": "Placement",
            "department_id": dept_id,
            "created_by": user_id,
            "expiry_date": "2027-12-31",
            "is_pinned": False
        }
    ]

    for n in sample_notices:
        ex_n = supabase_admin.table('notices').select('*').eq('title', n['title']).execute()
        if not ex_n.data:
            supabase_admin.table('notices').insert(n).execute()
    print(f"      Seeded Campus Notices!")

    # 5. Seed Conversations & Messages
    print("\n[5/6] Seeding Chat History & RAG Conversations...")
    conv_title = "Data Structures & Tree Traversal Inquiry"
    ex_conv = supabase_admin.table('conversations').select('*').eq('user_id', user_id).eq('title', conv_title).execute()
    if ex_conv.data:
        conv_id = ex_conv.data[0]['id']
    else:
        c_res = supabase_admin.table('conversations').insert({
            "user_id": user_id,
            "title": conv_title
        }).execute()
        conv_id = c_res.data[0]['id']

    # Seed messages
    msg_check = supabase_admin.table('messages').select('*').eq('conversation_id', conv_id).execute()
    if not msg_check.data:
        supabase_admin.table('messages').insert([
            {
                "conversation_id": conv_id,
                "sender": "user",
                "message": "Can you explain AVL trees balancing factors and rotation types?",
                "citations": []
            },
            {
                "conversation_id": conv_id,
                "sender": "assistant",
                "message": "An **AVL tree** is a self-balancing Binary Search Tree where the difference between heights of left and right subtrees (the balance factor) for any node cannot be more than 1.\n\n### Balance Factor Calculation:\n$$\\text{Balance Factor} = \\text{Height}(\\text{Left Subtree}) - \\text{Height}(\\text{Right Subtree})$$\n\n### 4 Rotation Types:\n1. **Left-Left (LL) Rotation**: Single right rotation when insertion happens in the left child of left subtree.\n2. **Right-Right (RR) Rotation**: Single left rotation when insertion happens in right child of right subtree.\n3. **Left-Right (LR) Rotation**: Double rotation (Left then Right).\n4. **Right-Left (RL) Rotation**: Double rotation (Right then Left).",
                "citations": [
                    {"document_title": "Data Structures & Algorithms Comprehensive Guide", "page_number": 42, "similarity_score": 0.94}
                ],
                "confidence_score": 96.50
            }
        ]).execute()
    print(f"      Seeded Conversation: '{conv_title}'")

    # 6. Seed AI Summaries & Quizzes
    print("\n[6/6] Seeding AI Summaries & Quiz Sessions...")
    doc_id = inserted_doc_ids[0] if inserted_doc_ids else None

    # Summaries
    ex_sum = supabase_admin.table('summaries').select('*').eq('user_id', user_id).execute()
    if not ex_sum.data:
        summary_records = [
            {
                "executive_summary": "This comprehensive guide covers fundamental and advanced data structures including arrays, linked lists, trees, graphs, and dynamic programming paradigms with asymptotic complexity analysis.",
                "key_takeaways": [
                    "Time complexity of AVL tree search, insertion, and deletion is O(log N).",
                    "Dijkstra algorithm computes shortest paths in weighted non-negative graphs.",
                    "QuickSort average runtime is O(N log N) with random pivot selection."
                ]
            },
            {
                "executive_summary": "In-depth breakdown of process scheduling algorithms, memory management via virtual paging, deadlock handling strategies, and multi-threaded synchronization primitives.",
                "key_takeaways": [
                    "Paging eliminates external fragmentation through fixed-sized page frames.",
                    "Banker's Algorithm ensures deadlock avoidance in multi-resource environments.",
                    "Mutexes and Semaphores prevent race conditions in critical sections."
                ]
            }
        ]
        for rec in summary_records:
            try:
                # Try inserting full schema fields
                supabase_admin.table('summaries').insert({
                    "user_id": user_id,
                    "document_id": doc_id,
                    "document_title": "Data Structures & Algorithms Guide",
                    "executive_summary": rec["executive_summary"],
                    "key_takeaways": rec["key_takeaways"],
                    "important_dates": ["Lab Assessment 1: April 10, 2026"],
                    "action_items": ["Practice graph traversal problems on LeetCode."]
                }).execute()
            except Exception:
                try:
                    # Fallback to alternate schema columns (summary, key_points)
                    supabase_admin.table('summaries').insert({
                        "user_id": user_id,
                        "document_id": doc_id,
                        "summary": rec["executive_summary"],
                        "key_points": rec["key_takeaways"]
                    }).execute()
                except Exception as e_sum:
                    print(f"      [Note] Could not insert summary record: {e_sum}")
        print(f"      Seeded AI Summaries!")

    # Quiz sessions & Quiz history
    ex_qs = supabase_admin.table('quiz_sessions').select('*').eq('user_id', user_id).execute()
    if not ex_qs.data:
        quiz_session_id = None
        try:
            qs_res = supabase_admin.table('quiz_sessions').insert({
                "user_id": user_id,
                "document_id": doc_id,
                "document_title": "Data Structures & Algorithms Guide",
                "difficulty": "medium",
                "question_type": "mcq",
                "questions": [
                    {
                        "id": 1,
                        "question": "What is the worst-case time complexity of searching in a balanced AVL tree?",
                        "options": ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
                        "correct_answer": 1,
                        "explanation": "Because an AVL tree maintains strict height balance (|height_left - height_right| <= 1), the maximum tree height is bound by O(log N)."
                    },
                    {
                        "id": 2,
                        "question": "Which data structure uses LIFO (Last In First Out) ordering?",
                        "options": ["Queue", "Stack", "Heap", "Graph"],
                        "correct_answer": 1,
                        "explanation": "A Stack operates on Last In First Out (LIFO) order."
                    },
                    {
                        "id": 3,
                        "question": "Which sorting algorithm has a guaranteed worst-case time complexity of O(N log N)?",
                        "options": ["QuickSort", "BubbleSort", "MergeSort", "InsertionSort"],
                        "correct_answer": 2,
                        "explanation": "MergeSort consistently runs in O(N log N) time regardless of initial array ordering."
                    }
                ],
                "status": "submitted"
            }).execute()
            quiz_session_id = qs_res.data[0]['id'] if qs_res.data else None
        except Exception as e_qs:
            print(f"      [Note] Quiz session insert notice: {e_qs}")

        # Quiz history
        try:
            supabase_admin.table('quiz_history').insert({
                "user_id": user_id,
                "quiz_session_id": quiz_session_id,
                "document_id": doc_id,
                "document_title": "Data Structures & Algorithms Guide",
                "difficulty": "medium",
                "total_questions": 3,
                "correct_answers": 3,
                "score_percent": 100.0,
                "performance": "Excellent (100%)",
                "detailed_results": [
                    {"question_id": 1, "is_correct": True, "selected_option": 1},
                    {"question_id": 2, "is_correct": True, "selected_option": 1},
                    {"question_id": 3, "is_correct": True, "selected_option": 2}
                ]
            }).execute()
        except Exception:
            try:
                supabase_admin.table('quiz_history').insert({
                    "user_id": user_id,
                    "document_id": doc_id,
                    "score": 100,
                    "total_questions": 3,
                    "quiz_data": {
                        "difficulty": "medium",
                        "performance": "Excellent (100%)",
                        "document_title": "Data Structures & Algorithms Guide"
                    }
                }).execute()
            except Exception as e_qh:
                print(f"      [Note] Quiz history insert notice: {e_qh}")

        print(f"      Seeded Quiz Sessions & Performance History!")

    print(f"\n==================================================")
    print(f"   SUCCESSFULLY SEEDED ALL SAMPLE STUDENT DATA!")
    print(f"==================================================\n")

if __name__ == "__main__":
    seed_all_student_data()
