# Faculty Module

## Module Overview

The Faculty Module enables faculty members to contribute, maintain, and manage the academic knowledge base used by CampusNova AI. Faculty can upload official documents, manage department resources, publish notices, monitor student queries, and analyze department usage.

---

# Module Objectives

The Faculty Module aims to:

- Maintain department knowledge.
- Upload official academic documents.
- Publish department notices.
- Improve AI response quality.
- Monitor frequently asked questions.
- Track department analytics.

---

# Faculty Dashboard

The Faculty Dashboard provides a centralized workspace for managing department resources.

---

## Dashboard Components

### Welcome Section

Displays:

- Faculty Name
- Department
- Designation
- Profile Picture

---

### Quick Statistics

Displays:

- Uploaded Documents
- Total Notices
- Student Queries
- Active Users
- Knowledge Base Size

---

### Quick Actions

Buttons:

- Upload Document
- Publish Notice
- Manage Documents
- View Analytics
- Review Student Queries

---

### Recent Uploads

Displays:

- File Name
- Upload Date
- Category
- Status

---

### Department Analytics

Displays:

- Most Viewed Documents
- Most Asked Questions
- Student Activity
- AI Usage

---

# Document Management

Faculty can manage department documents.

---

## Supported File Types

- PDF
- DOCX
- TXT
- CSV

---

## Features

- Upload Documents
- Edit Metadata
- Delete Documents
- Replace Existing Version
- Preview Documents
- Download Documents
- Search Documents
- Categorize Documents
- Department Tagging

---

## Upload Workflow

```text
Select File
      │
      ▼
Upload
      │
      ▼
Text Extraction
      │
      ▼
Chunking
      │
      ▼
Embedding Generation
      │
      ▼
Pinecone Storage
      │
      ▼
Knowledge Base Updated
```

---

# Notice Management

Faculty can create department notices.

---

## Notice Categories

- Academic
- Examination
- Placement
- Workshop
- Seminar
- Events
- Holiday
- Internship

---

## Features

- Publish Notice
- Edit Notice
- Delete Notice
- Schedule Notice
- Pin Notice
- Expiry Date

---

# Student Query Management

Faculty can review:

- Frequently Asked Questions
- Unanswered Questions
- Low Confidence Answers
- Feedback Reports

---

## AI Improvement

Faculty can:

- Add Missing Information
- Update Existing Documents
- Improve Department Knowledge

---

# Department Knowledge Base

Faculty can organize documents by:

- Semester
- Subject
- Laboratory
- Regulation
- Course
- Academic Year

---

# Search

Faculty can search:

- Documents
- Notices
- Student Questions
- Categories
- Subjects

---

# Analytics

Faculty Dashboard Analytics includes:

- Uploaded Documents
- Most Accessed PDFs
- Student Search Trends
- Popular Topics
- AI Accuracy
- Response Time
- Department Usage
- Recent Upload Activity

---

# Notifications

Faculty receive notifications when:

- Upload Processing Completes
- Documents Fail Processing
- Student Feedback Received
- AI Errors Detected
- New Admin Announcements

---

# Faculty Profile

Faculty can update:

- Name
- Email
- Phone
- Department
- Designation
- Password
- Profile Picture

---

# Functional Requirements

## Authentication

### FR-FAC-001

Faculty shall securely log in.

---

### FR-FAC-002

Faculty shall securely log out.

---

## Dashboard

### FR-FAC-003

Faculty shall access the faculty dashboard.

### FR-FAC-004

Dashboard shall display department statistics.

---

## Document Management

### FR-FAC-005

Faculty shall upload documents.

### FR-FAC-006

Faculty shall edit uploaded documents.

### FR-FAC-007

Faculty shall delete department documents.

### FR-FAC-008

Faculty shall categorize uploaded files.

### FR-FAC-009

Faculty shall replace existing document versions.

---

## Notice Management

### FR-FAC-010

Faculty shall publish notices.

### FR-FAC-011

Faculty shall edit notices.

### FR-FAC-012

Faculty shall delete notices.

### FR-FAC-013

Faculty shall schedule notices.

---

## Student Queries

### FR-FAC-014

Faculty shall review unanswered questions.

### FR-FAC-015

Faculty shall improve department knowledge.

---

## Analytics

### FR-FAC-016

Faculty shall access department analytics.

### FR-FAC-017

Faculty shall monitor AI usage.

### FR-FAC-018

Faculty shall review search statistics.

---

## Notifications

### FR-FAC-019

Faculty shall receive upload notifications.

### FR-FAC-020

Faculty shall receive feedback notifications.

---

## Profile

### FR-FAC-021

Faculty shall update profile information.

### FR-FAC-022

Faculty shall change passwords.

---

# Faculty User Flow

```text
Faculty Login
      │
      ▼
Faculty Dashboard
      │
      ├────────► Upload Documents
      │
      ├────────► Manage Documents
      │
      ├────────► Publish Notices
      │
      ├────────► Student Queries
      │
      ├────────► Analytics
      │
      └────────► Settings
```

---

# Faculty Module Success Criteria

The Faculty Module is considered complete when:

- Faculty can securely authenticate.
- Documents are uploaded successfully.
- Knowledge base updates automatically.
- Notices are published.
- Department analytics are available.
- Student queries can be reviewed.
- Notifications work correctly.
- Department resources remain up-to-date.

---

## End of Faculty Module