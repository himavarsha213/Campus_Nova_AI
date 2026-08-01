# Database Design

## Overview

The CampusNova AI database is designed to support authentication, role management, document management, AI conversations, RAG indexing, analytics, and feedback collection. The database uses **Supabase PostgreSQL** as the primary relational database and **Pinecone** as the vector database for semantic search.

---

# Database Architecture

```text
                    Users
                      │
        ┌─────────────┼─────────────┐
        │             │             │
     Students      Faculty      Administrators
        │             │
        └───────┬─────┘
                │
          Conversations
                │
          Chat Messages
                │
          Retrieved Sources
                │
             Feedback
                │
             Analytics

Documents ───────► Chunks ───────► Pinecone Vector Database
        │
        ▼
Departments
```

---

# Database Tables

The system consists of the following major tables:

1. Users
2. Departments
3. Documents
4. Document Chunks
5. Conversations
6. Messages
7. Notices
8. Feedback
9. Quiz History
10. Summaries
11. Notifications
12. Analytics
13. Audit Logs

---

# Table: Users

Stores all authenticated users.

| Field | Type | Description |
|--------|------|-------------|
| id | UUID | Primary Key |
| full_name | Text | User Name |
| email | Text | Unique Email |
| password_hash | Text | Encrypted Password |
| role | Text | Student / Faculty / Admin |
| department_id | UUID | Department |
| semester | Integer | Student Semester |
| phone | Text | Mobile Number |
| profile_image | Text | Avatar URL |
| created_at | Timestamp | Registration Date |
| updated_at | Timestamp | Last Updated |

---

# Table: Departments

Stores all departments.

| Field | Type |
|--------|------|
| id | UUID |
| department_name | Text |
| department_code | Text |
| hod_name | Text |
| created_at | Timestamp |

---

# Table: Documents

Stores uploaded documents.

| Field | Type |
|--------|------|
| id | UUID |
| title | Text |
| file_name | Text |
| file_url | Text |
| department_id | UUID |
| category | Text |
| uploaded_by | UUID |
| version | Integer |
| status | Text |
| uploaded_at | Timestamp |

---

# Table: Document Chunks

Each uploaded document is divided into chunks.

| Field | Type |
|--------|------|
| id | UUID |
| document_id | UUID |
| chunk_number | Integer |
| chunk_text | Text |
| page_number | Integer |
| vector_id | Text |
| created_at | Timestamp |

---

# Table: Conversations

Stores each AI conversation.

| Field | Type |
|--------|------|
| id | UUID |
| user_id | UUID |
| title | Text |
| created_at | Timestamp |
| updated_at | Timestamp |

---

# Table: Messages

Stores individual chat messages.

| Field | Type |
|--------|------|
| id | UUID |
| conversation_id | UUID |
| sender | Text |
| message | Text |
| citations | JSON |
| confidence_score | Decimal |
| created_at | Timestamp |

---

# Table: Notices

Stores official notices.

| Field | Type |
|--------|------|
| id | UUID |
| title | Text |
| description | Text |
| category | Text |
| department_id | UUID |
| created_by | UUID |
| expiry_date | Date |
| created_at | Timestamp |

---

# Table: Feedback

Stores AI feedback.

| Field | Type |
|--------|------|
| id | UUID |
| user_id | UUID |
| message_id | UUID |
| rating | Integer |
| feedback | Text |
| created_at | Timestamp |

---

# Table: Quiz History

Stores generated quizzes.

| Field | Type |
|--------|------|
| id | UUID |
| user_id | UUID |
| document_id | UUID |
| score | Integer |
| total_questions | Integer |
| completed_at | Timestamp |

---

# Table: Summaries

Stores AI-generated summaries.

| Field | Type |
|--------|------|
| id | UUID |
| user_id | UUID |
| document_id | UUID |
| summary | Text |
| created_at | Timestamp |

---

# Table: Notifications

Stores notifications.

| Field | Type |
|--------|------|
| id | UUID |
| user_id | UUID |
| title | Text |
| message | Text |
| type | Text |
| is_read | Boolean |
| created_at | Timestamp |

---

# Table: Analytics

Stores usage statistics.

| Field | Type |
|--------|------|
| id | UUID |
| user_id | UUID |
| event | Text |
| module | Text |
| timestamp | Timestamp |

---

# Table: Audit Logs

Tracks system actions.

| Field | Type |
|--------|------|
| id | UUID |
| user_id | UUID |
| action | Text |
| module | Text |
| ip_address | Text |
| timestamp | Timestamp |

---

# Relationships

```text
Department
    │
    ├──────── Users
    │            │
    │            ├──────── Conversations
    │            │               │
    │            │               └──────── Messages
    │            │
    │            ├──────── Feedback
    │            ├──────── Quiz History
    │            ├──────── Summaries
    │            └──────── Notifications
    │
    └──────── Documents
                  │
                  └──────── Document Chunks
```

---

# Pinecone Vector Database

Each chunk stored in Pinecone contains:

- Vector Embedding
- Chunk ID
- Document ID
- Department
- Page Number
- Category
- Metadata
- Chunk Text Reference

---

# Indexes

Recommended indexes:

- Email
- Department ID
- Document ID
- Conversation ID
- User ID
- Notice Category
- Upload Date
- Created At

---

# Security

- Passwords encrypted using bcrypt.
- Row-Level Security (RLS) enabled in Supabase.
- Role-Based Access Control (RBAC).
- JWT authentication.
- Audit logging for sensitive operations.

---

# Backup Strategy

- Daily PostgreSQL backups.
- Weekly Pinecone vector export.
- Automated disaster recovery.
- Version-controlled document storage.

---

# Database Success Criteria

The database design is successful when:

- All user data is securely stored.
- Documents are linked to departments.
- AI conversations are persistent.
- Vector search retrieves relevant chunks.
- Relationships maintain data integrity.
- Queries remain performant at scale.

---

## End of Database Design