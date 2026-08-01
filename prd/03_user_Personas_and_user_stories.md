# User Personas & User Stories

## Overview

CampusNova AI is designed to serve multiple stakeholders within a college ecosystem. Each user has different goals, permissions, and interactions with the platform. This document defines the primary user personas, user journeys, and user stories that guide product development.

---

# User Roles

The system consists of three primary user roles:

1. Student
2. Faculty
3. Administrator

Each role has unique responsibilities and access privileges.

---

# Persona 1 – Student

## Profile

| Attribute | Details |
|------------|---------|
| Role | Student |
| Age | 17–26 |
| Technical Skill | Beginner to Intermediate |
| Goals | Quickly find college information |
| Frequency | Daily |

---

## Student Goals

The student wants to:

- Ask questions naturally.
- Find college policies.
- View department notices.
- Download important documents.
- Prepare for exams.
- Generate quizzes.
- Summarize PDFs.
- Save previous conversations.
- Receive personalized recommendations.

---

## Student Pain Points

- Too many PDFs.
- Difficult website navigation.
- Missing notices.
- Repetitive searching.
- Waiting for faculty replies.
- Unclear academic policies.

---

## Student Permissions

Students can:

- Login
- Logout
- Chat with AI
- View chat history
- Upload personal study notes
- Search documents
- Read notices
- Download files
- Generate summaries
- Generate quizzes
- Give feedback
- Edit profile
- Change password

Students cannot:

- Upload official college documents
- Delete documents
- Manage users
- Configure AI
- View analytics

---

# Student Journey

```text
Open Website
      │
      ▼
Login
      │
      ▼
Student Dashboard
      │
      ▼
Ask AI Question
      │
      ▼
RAG Search
      │
      ▼
Receive Answer
      │
      ▼
View Sources
      │
      ▼
Save Chat
```

---

# Persona 2 – Faculty

## Profile

| Attribute | Details |
|------------|---------|
| Role | Faculty Member |
| Age | 25–60 |
| Technical Skill | Intermediate |
| Goals | Maintain department knowledge |
| Frequency | Weekly |

---

## Faculty Goals

Faculty members want to:

- Upload official documents.
- Update department notices.
- Share study material.
- Review student queries.
- Improve department knowledge base.
- View analytics.

---

## Faculty Permissions

Faculty can:

- Login
- Upload PDFs
- Upload DOCX
- Upload Notices
- Edit department files
- Delete department files
- Manage notices
- View analytics
- View unanswered questions

Faculty cannot:

- Delete users
- Change AI settings
- Manage system roles
- Access system logs

---

# Faculty Journey

```text
Login
   │
   ▼
Faculty Dashboard
   │
   ▼
Upload Document
   │
   ▼
Document Processing
   │
   ▼
Embeddings Created
   │
   ▼
Knowledge Base Updated
```

---

# Persona 3 – Administrator

## Profile

| Attribute | Details |
|------------|---------|
| Role | Administrator |
| Technical Skill | Advanced |
| Goals | Manage entire system |
| Frequency | Daily |

---

## Administrator Goals

Administrators want to:

- Manage users.
- Manage departments.
- Configure AI.
- Upload official documents.
- Monitor analytics.
- View feedback.
- Review logs.
- Maintain system security.

---

## Administrator Permissions

Administrators have full access to:

- User Management
- Faculty Management
- Student Management
- Department Management
- AI Configuration
- Analytics Dashboard
- Feedback Dashboard
- Document Approval
- System Logs
- Security Settings

---

# Admin Journey

```text
Login
   │
   ▼
Admin Dashboard
   │
   ├──────────► Manage Users
   │
   ├──────────► Upload Documents
   │
   ├──────────► Analytics
   │
   ├──────────► Configure AI
   │
   └──────────► Manage Knowledge Base
```

---

# User Stories

## Authentication

### Student

**As a student**, I want to login securely so that I can access personalized AI services.

---

### Faculty

**As a faculty member**, I want to upload department documents so students receive updated information.

---

### Administrator

**As an administrator**, I want to manage all users so the platform remains secure.

---

# AI Chatbot Stories

### Student

As a student,

I want to ask questions in natural language

So that I receive instant answers.

---

As a student,

I want the AI to remember previous questions

So I don't repeat myself.

---

As a student,

I want citations for every answer

So I can verify the information.

---

As a student,

I want AI to admit when it doesn't know an answer

So I can trust the responses.

---

# Knowledge Base Stories

As a faculty member,

I want to upload PDFs

So students always receive updated information.

---

As an administrator,

I want to organize documents by department

So retrieval becomes more accurate.

---

# Dashboard Stories

As a student,

I want to view recent chats

So I can continue previous conversations.

---

As a faculty member,

I want to monitor uploaded documents

So department information stays current.

---

As an administrator,

I want analytics

So I understand system usage.

---

# Notification Stories

As a student,

I want to receive important announcements

So I never miss deadlines.

---

As a faculty member,

I want students to be notified after I publish notices.

---

# Quiz Stories

As a student,

I want quizzes generated from PDFs

So I can prepare for exams.

---

# Summarization Stories

As a student,

I want AI summaries

So I can quickly understand long documents.

---

# Search Stories

As a student,

I want semantic search

So I find information even if I don't know exact keywords.

---

# Feedback Stories

As a student,

I want to rate AI responses

So the system improves.

---

# Acceptance Criteria

The system should allow users to:

- Login securely.
- Access role-specific dashboards.
- Chat with AI.
- Retrieve information using RAG.
- View source citations.
- Upload documents (Faculty/Admin).
- Manage users (Admin).
- Generate quizzes.
- Summarize documents.
- Save chat history.
- Submit feedback.

---

# User Flow Overview

```text
Visitor
   │
   ▼
Landing Page
   │
   ▼
Authentication
   │
   ▼
Role Detection
   │
   ├────────► Student Dashboard
   │
   ├────────► Faculty Dashboard
   │
   └────────► Admin Dashboard
```

---

## End of Document