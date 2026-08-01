# Functional Requirements

## Overview

This document defines the functional requirements of CampusNova AI. These requirements describe the behavior, capabilities, and services the system must provide for students, faculty, and administrators.

---

# Functional Requirement Categories

The system is divided into the following functional modules:

1. Authentication Module
2. Student Module
3. Faculty Module
4. Administrator Module
5. AI Chatbot Module
6. Knowledge Base Module
7. Document Management Module
8. RAG Pipeline
9. Notification Module
10. Analytics Module
11. Feedback Module
12. Settings Module

---

# Module 1 — Authentication

## Description

The system shall authenticate users securely using role-based authentication.

### Features

- User Registration
- User Login
- Logout
- Forgot Password
- Password Reset
- Email Verification
- Session Management
- Remember Me
- Role Identification

---

## Functional Requirements

### FR-001

The system shall allow users to register.

### FR-002

The system shall verify email addresses.

### FR-003

The system shall allow secure login.

### FR-004

The system shall support password reset.

### FR-005

The system shall identify the user's role after login.

### FR-006

The system shall redirect users to their dashboard.

---

# Module 2 — Student Dashboard

## Description

Students interact with CampusNova AI through a personalized dashboard.

---

### Dashboard Components

- Welcome Card
- AI Search Box
- Recent Chats
- Recent Notices
- Upcoming Events
- Recommended Documents
- Quiz Section
- Summary Section
- Notifications
- Profile Card

---

## Functional Requirements

### FR-007

Students shall view personalized dashboards.

### FR-008

Students shall view recent conversations.

### FR-009

Students shall receive notifications.

### FR-010

Students shall access recent documents.

### FR-011

Students shall access quizzes.

---

# Module 3 — AI Chatbot

## Description

CampusNova AI provides conversational assistance using Retrieval-Augmented Generation (RAG).

---

### Chat Features

- Natural Language Questions
- Multi-turn Conversations
- Context Awareness
- Follow-up Questions
- Suggested Questions
- Streaming Responses
- Typing Animation
- Markdown Responses
- Code Block Support
- Copy Response
- Regenerate Response

---

## Functional Requirements

### FR-012

The chatbot shall answer questions.

### FR-013

The chatbot shall retrieve information using semantic search.

### FR-014

The chatbot shall remember conversation context.

### FR-015

The chatbot shall support follow-up questions.

### FR-016

The chatbot shall provide source citations.

### FR-017

The chatbot shall prevent hallucinations.

### FR-018

The chatbot shall display confidence scores.

### FR-019

The chatbot shall stream responses.

---

# Module 4 — Knowledge Base

## Description

The knowledge base stores institutional information.

---

### Supported Documents

- PDF
- DOCX
- TXT
- CSV
- FAQ
- Notices
- Academic Calendar
- Policies

---

### Functional Requirements

### FR-020

The system shall upload documents.

### FR-021

The system shall categorize documents.

### FR-022

The system shall store metadata.

### FR-023

The system shall create embeddings.

### FR-024

The system shall update the vector database.

---

# Module 5 — Document Management

## Features

- Upload
- Edit
- Delete
- Archive
- Restore
- Preview
- Download
- Search
- Version Control

---

### Functional Requirements

### FR-025

Faculty shall upload documents.

### FR-026

Admins shall delete documents.

### FR-027

The system shall support bulk upload.

### FR-028

The system shall detect duplicate files.

### FR-029

The system shall maintain version history.

---

# Module 6 — RAG Pipeline

## Workflow

```text
User Question
      │
      ▼
Embedding Generation
      │
      ▼
Vector Search
      │
      ▼
Top-K Retrieval
      │
      ▼
Context Creation
      │
      ▼
LLM Response
      │
      ▼
Answer + Citation
```

---

### Functional Requirements

### FR-030

The system shall generate embeddings.

### FR-031

The system shall perform semantic search.

### FR-032

The system shall retrieve top matching chunks.

### FR-033

The system shall generate contextual prompts.

### FR-034

The system shall return citations.

---

# Module 7 — Search

## Search Types

- Semantic Search
- Keyword Search
- Hybrid Search
- Department Search
- Document Search
- Notice Search

---

### Functional Requirements

### FR-035

The system shall search documents.

### FR-036

The system shall search notices.

### FR-037

The system shall support metadata filtering.

### FR-038

The system shall rank search results.

---

# Module 8 — Quiz Generator

## Features

- Generate MCQs
- True/False
- Fill in the Blanks
- Short Answers
- Difficulty Levels

---

### Functional Requirements

### FR-039

Students shall generate quizzes from documents.

### FR-040

Students shall save quiz history.

### FR-041

The system shall evaluate quiz performance.

---

# Module 9 — Document Summarizer

## Features

- AI Summary
- Bullet Points
- Important Dates
- Key Topics
- Action Items

---

### Functional Requirements

### FR-042

Students shall summarize uploaded documents.

### FR-043

The AI shall extract key information.

---

# Module 10 — Notice Management

## Features

- Upload Notice
- Delete Notice
- Categorize Notice
- Pin Notice
- Schedule Notice

---

### Functional Requirements

### FR-044

Faculty shall publish notices.

### FR-045

Students shall view notices.

### FR-046

Admins shall manage notices.

---

# Module 11 — Feedback

## Features

- Like
- Dislike
- Comments
- Ratings
- Report Wrong Answer

---

### Functional Requirements

### FR-047

Students shall rate AI responses.

### FR-048

Admins shall review feedback.

---

# Module 12 — Analytics

## Features

- Daily Users
- Active Sessions
- Popular Questions
- Response Time
- Department Usage
- Feedback Statistics

---

### Functional Requirements

### FR-049

Admins shall access analytics.

### FR-050

Faculty shall access department analytics.

---

# Module 13 — Notifications

## Features

- New Notices
- Document Updates
- Quiz Available
- AI Announcements
- System Updates

---

### Functional Requirements

### FR-051

Students shall receive notifications.

### FR-052

Faculty shall receive upload confirmations.

---

# Module 14 — Settings

## Features

- Edit Profile
- Change Password
- Dark Mode
- Notification Preferences
- Language Selection

---

### Functional Requirements

### FR-053

Users shall manage their profile.

### FR-054

Users shall configure preferences.

---

# General Functional Requirements

The system shall:

- Support role-based access control.
- Handle concurrent users.
- Maintain conversation history.
- Generate citations.
- Secure user data.
- Process uploaded documents.
- Retrieve contextual information.
- Generate AI responses.
- Support responsive design.
- Maintain audit logs.

---

# Acceptance Criteria

The project shall be considered functionally complete when:

- Authentication works correctly.
- AI answers contextual questions.
- Documents are searchable.
- Source citations are displayed.
- Students can generate quizzes.
- Students can summarize documents.
- Faculty can upload files.
- Admins can manage users.
- Analytics display correctly.
- Notifications are delivered successfully.

---

## End of Document