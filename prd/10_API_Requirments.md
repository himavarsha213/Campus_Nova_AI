# API Requirements

## Overview

The CampusNova AI API is designed using a RESTful architecture to enable secure communication between the frontend, backend, authentication service, AI engine, RAG pipeline, and database. All APIs return JSON responses and require authentication where applicable.

---

# Base URL

```text
Development:
http://localhost:8000/api/v1

Production:
https://api.campusnova.ai/api/v1
```

---

# Authentication

Authentication is handled using **Supabase Auth** with JWT tokens.

Authorization Header

```http
Authorization: Bearer <JWT_TOKEN>
```

---

# API Modules

The API is divided into the following modules:

1. Authentication
2. Users
3. Students
4. Faculty
5. Admin
6. AI Chat
7. Documents
8. Knowledge Base
9. Notices
10. Quiz Generator
11. Summarizer
12. Feedback
13. Analytics
14. Notifications

---

# Authentication APIs

## Register User

**POST**

```http
/api/v1/auth/register
```

Request

```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "********",
  "role": "student"
}
```

Response

```json
{
  "success": true,
  "message": "Registration successful"
}
```

---

## Login

**POST**

```http
/api/v1/auth/login
```

Request

```json
{
  "email": "john@example.com",
  "password": "********"
}
```

Response

```json
{
  "token": "...",
  "role": "student"
}
```

---

## Logout

**POST**

```http
/api/v1/auth/logout
```

---

## Forgot Password

**POST**

```http
/api/v1/auth/forgot-password
```

---

## Reset Password

**POST**

```http
/api/v1/auth/reset-password
```

---

# Student APIs

## Get Dashboard

**GET**

```http
/api/v1/student/dashboard
```

Returns:

- Dashboard statistics
- Recent chats
- Notices
- Recommendations
- Notifications

---

## Get Profile

**GET**

```http
/api/v1/student/profile
```

---

## Update Profile

**PUT**

```http
/api/v1/student/profile
```

---

## Chat History

**GET**

```http
/api/v1/student/chat-history
```

---

## Delete Conversation

**DELETE**

```http
/api/v1/student/chat/{conversationId}
```

---

# Faculty APIs

## Faculty Dashboard

**GET**

```http
/api/v1/faculty/dashboard
```

---

## Upload Document

**POST**

```http
/api/v1/faculty/upload-document
```

Multipart Form Data

```
file
department
category
title
```

---

## Delete Document

**DELETE**

```http
/api/v1/faculty/document/{id}
```

---

## Publish Notice

**POST**

```http
/api/v1/faculty/notice
```

---

## Department Analytics

**GET**

```http
/api/v1/faculty/analytics
```

---

# Admin APIs

## Dashboard

**GET**

```http
/api/v1/admin/dashboard
```

---

## Create User

**POST**

```http
/api/v1/admin/users
```

---

## Update User

**PUT**

```http
/api/v1/admin/users/{id}
```

---

## Delete User

**DELETE**

```http
/api/v1/admin/users/{id}
```

---

## Create Department

**POST**

```http
/api/v1/admin/departments
```

---

## Configure AI

**PUT**

```http
/api/v1/admin/ai-settings
```

---

## View Logs

**GET**

```http
/api/v1/admin/logs
```

---

# AI Chat APIs

## Ask AI

**POST**

```http
/api/v1/chat
```

Request

```json
{
  "question": "What is attendance policy?",
  "conversation_id": "optional"
}
```

Response

```json
{
  "answer": "...",
  "citations": [],
  "confidence": 95
}
```

---

## Continue Conversation

**POST**

```http
/api/v1/chat/continue
```

---

## Get Conversation

**GET**

```http
/api/v1/chat/{conversationId}
```

---

## Delete Conversation

**DELETE**

```http
/api/v1/chat/{conversationId}
```

---

# Document APIs

## Upload

**POST**

```http
/api/v1/documents/upload
```

---

## List Documents

**GET**

```http
/api/v1/documents
```

---

## Search Documents

**GET**

```http
/api/v1/documents/search
```

Parameters

```
keyword
department
category
```

---

## Download Document

**GET**

```http
/api/v1/documents/{id}
```

---

## Delete Document

**DELETE**

```http
/api/v1/documents/{id}
```

---

# RAG APIs

## Generate Embeddings

**POST**

```http
/api/v1/rag/embeddings
```

---

## Rebuild Knowledge Base

**POST**

```http
/api/v1/rag/rebuild
```

---

## Search Knowledge Base

**POST**

```http
/api/v1/rag/search
```

---

## Refresh Pinecone Index

**POST**

```http
/api/v1/rag/refresh
```

---

# Summarizer APIs

## Generate Summary

**POST**

```http
/api/v1/summary
```

Request

```json
{
  "document_id":"123"
}
```

---

## Get Summary History

**GET**

```http
/api/v1/summary/history
```

---

# Quiz APIs

## Generate Quiz

**POST**

```http
/api/v1/quiz/generate
```

---

## Submit Quiz

**POST**

```http
/api/v1/quiz/submit
```

---

## Quiz History

**GET**

```http
/api/v1/quiz/history
```

---

# Notice APIs

## List Notices

**GET**

```http
/api/v1/notices
```

---

## Create Notice

**POST**

```http
/api/v1/notices
```

---

## Delete Notice

**DELETE**

```http
/api/v1/notices/{id}
```

---

## Pin Notice

**PUT**

```http
/api/v1/notices/{id}/pin
```

---

# Feedback APIs

## Submit Feedback

**POST**

```http
/api/v1/feedback
```

---

## View Feedback

**GET**

```http
/api/v1/admin/feedback
```

---

# Analytics APIs

## User Analytics

**GET**

```http
/api/v1/analytics/users
```

---

## AI Analytics

**GET**

```http
/api/v1/analytics/ai
```

---

## Department Analytics

**GET**

```http
/api/v1/analytics/departments
```

---

## Search Analytics

**GET**

```http
/api/v1/analytics/search
```

---

# Notification APIs

## Get Notifications

**GET**

```http
/api/v1/notifications
```

---

## Mark as Read

**PUT**

```http
/api/v1/notifications/{id}
```

---

## Delete Notification

**DELETE**

```http
/api/v1/notifications/{id}
```

---

# Standard Response Format

Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

Error Response

```json
{
  "success": false,
  "error": "Invalid request"
}
```

Validation Error

```json
{
  "success": false,
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

---

# HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 204 | Deleted |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Validation Error |
| 500 | Internal Server Error |

---

# API Security

- JWT Authentication
- HTTPS Only
- Role-Based Access Control (RBAC)
- Input Validation
- Rate Limiting
- SQL Injection Protection
- XSS Protection
- CSRF Protection
- Secure File Upload Validation
- Audit Logging

---

# API Success Criteria

The API layer is considered complete when:

- All endpoints are authenticated where required.
- CRUD operations function correctly.
- AI endpoints return contextual responses.
- Document upload and retrieval work reliably.
- Error handling is consistent.
- Response times are optimized.
- APIs are secure and scalable.

---

## End of API Requirements