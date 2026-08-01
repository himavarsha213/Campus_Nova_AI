"""
seed_admin_suite_data.py — Seed comprehensive sample data for the Admin Suite (Departments, Users, Audit Logs, AI Settings).
"""

import sys
import os
from datetime import datetime, timezone, timedelta

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

from app.database.supabase_client import supabase_admin
from app.core.security import get_password_hash

def seed_admin_suite():
    print("\n==================================================")
    print("   Seeding Admin Suite Data & System Telemetry")
    print("==================================================\n")

    # 1. Seed All Academic Departments
    print("[1/4] Seeding Academic Departments...")
    departments = [
        { "department_name": "Computer Science & Engineering", "department_code": "CSE", "hod_name": "Dr. Alan Turing" },
        { "department_name": "Electronics & Communication", "department_code": "ECE", "hod_name": "Dr. Claude Shannon" },
        { "department_name": "Electrical & Electronics", "department_code": "EEE", "hod_name": "Dr. Nikola Tesla" },
        { "department_name": "Mechanical Engineering", "department_code": "MECH", "hod_name": "Dr. James Watt" },
        { "department_name": "Civil Engineering", "department_code": "CIVIL", "hod_name": "Dr. Isambard Brunel" },
        { "department_name": "Information Technology", "department_code": "IT", "hod_name": "Dr. Tim Berners-Lee" },
        { "department_name": "Artificial Intelligence & Data Science", "department_code": "AI-DS", "hod_name": "Dr. Geoffrey Hinton" },
        { "department_name": "Business Administration", "department_code": "MBA", "hod_name": "Dr. Peter Drucker" },
    ]

    dept_map = {}
    for d in departments:
        ex = supabase_admin.table('departments').select('*').eq('department_code', d['department_code']).execute()
        if ex.data:
            dept_map[d['department_code']] = ex.data[0]['id']
            # Update HOD name
            supabase_admin.table('departments').update({"hod_name": d['hod_name']}).eq('id', ex.data[0]['id']).execute()
        else:
            ins = supabase_admin.table('departments').insert(d).execute()
            if ins.data:
                dept_map[d['department_code']] = ins.data[0]['id']
    print(f"      Seeded {len(dept_map)} Academic Departments!")

    # 2. Seed Admin & Multi-Role User Accounts
    print("\n[2/4] Seeding Admin, Faculty & Student User Accounts...")
    hashed_pw = get_password_hash("123456")
    hashed_admin_pw = get_password_hash("Admin@1234")

    users_to_seed = [
        # Admins
        { "full_name": "System Administrator", "email": "admin@mits.ac.in", "password_hash": hashed_pw, "role": "admin", "department_id": dept_map.get("CSE") },
        { "full_name": "CampusNova Admin", "email": "admin@campusnova.edu", "password_hash": hashed_admin_pw, "role": "admin", "department_id": dept_map.get("CSE") },
        # Faculty
        { "full_name": "Prof. Varsha", "email": "varsha@mits.ac.in", "password_hash": hashed_pw, "role": "faculty", "department_id": dept_map.get("CSE") },
        { "full_name": "Prof. Claude Shannon", "email": "prof.shannon@mits.ac.in", "password_hash": hashed_pw, "role": "faculty", "department_id": dept_map.get("ECE") },
        { "full_name": "Prof. Geoffrey Hinton", "email": "prof.hinton@mits.ac.in", "password_hash": hashed_pw, "role": "faculty", "department_id": dept_map.get("AI-DS") },
        # Students
        { "full_name": "Hima Varsha", "email": "hima127@mits.ac.in", "password_hash": hashed_pw, "role": "student", "department_id": dept_map.get("CSE"), "semester": 6 },
        { "full_name": "Rahul Verma", "email": "rahul.ece@mits.ac.in", "password_hash": hashed_pw, "role": "student", "department_id": dept_map.get("ECE"), "semester": 4 },
        { "full_name": "Priya Sharma", "email": "priya.aids@mits.ac.in", "password_hash": hashed_pw, "role": "student", "department_id": dept_map.get("AI-DS"), "semester": 2 },
    ]

    for u in users_to_seed:
        ex_u = supabase_admin.table('users').select('*').eq('email', u['email']).execute()
        if ex_u.data:
            supabase_admin.table('users').update(u).eq('id', ex_u.data[0]['id']).execute()
        else:
            supabase_admin.table('users').insert(u).execute()
    print("      Seeded 8 Multi-Role User Accounts!")

    # 3. Seed System Audit Logs
    print("\n[3/4] Seeding System Audit Logs...")
    now = datetime.now(timezone.utc)
    sample_audit_logs = [
        {
            "action": "USER_LOGIN",
            "module": "AUTH",
            "ip_address": "127.0.0.1"
        },
        {
            "action": "DEPARTMENT_CREATED",
            "module": "ADMIN",
            "ip_address": "127.0.0.1"
        },
        {
            "action": "DOCUMENT_INGESTED",
            "module": "RAG_INGESTION",
            "ip_address": "127.0.0.1"
        },
        {
            "action": "AI_CONFIG_UPDATED",
            "module": "AI_SETTINGS",
            "ip_address": "127.0.0.1"
        },
        {
            "action": "FACULTY_QUERY_RESOLVED",
            "module": "FACULTY_PORTAL",
            "ip_address": "127.0.0.1"
        }
    ]

    for log in sample_audit_logs:
        try:
            supabase_admin.table('audit_logs').insert(log).execute()
        except Exception as e_log:
            print(f"      [Note] Audit log insert notice: {e_log}")
    print("      Seeded Audit Trail Logs!")

    # 4. Seed AI & System Configuration Settings
    print("\n[4/4] Seeding AI System Configurations...")
    default_ai_settings = [
        { "setting_key": "llm_model", "setting_value": "groq-llama-3.3-70b" },
        { "setting_key": "temperature", "setting_value": "0.1" },
        { "setting_key": "max_tokens", "setting_value": "1024" },
        { "setting_key": "top_k", "setting_value": "5" },
        { "setting_key": "similarity_threshold", "setting_value": "0.70" },
        { "setting_key": "system_prompt", "setting_value": "You are CampusNova AI, an institutional knowledge assistant for college students and faculty. Provide accurate, well-cited answers grounded in official campus materials." }
    ]

    for cfg in default_ai_settings:
        try:
            ex_cfg = supabase_admin.table('system_settings').select('*').eq('setting_key', cfg['setting_key']).execute()
            if ex_cfg.data:
                supabase_admin.table('system_settings').update({"setting_value": cfg['setting_value']}).eq('setting_key', cfg['setting_key']).execute()
            else:
                supabase_admin.table('system_settings').insert(cfg).execute()
        except Exception as e_cfg:
            print(f"      [Note] System setting insert notice: {e_cfg}")
    print("      Seeded AI System Parameters & Grounding Config!")

    print("\n==================================================")
    print("   SUCCESSFULLY SEEDED ALL ADMIN SUITE DATA!")
    print("==================================================\n")

if __name__ == "__main__":
    seed_admin_suite()
