# Admin Module

## Module Overview

The Admin Module is the central management system of CampusNova AI. It provides complete control over users, departments, documents, AI configuration, analytics, security, and system settings. Administrators are responsible for maintaining the knowledge base, ensuring data quality, monitoring system performance, and managing platform operations.

---

# Module Objectives

The Admin Module aims to:

- Manage the entire platform.
- Control user access and permissions.
- Maintain the institutional knowledge base.
- Configure AI settings.
- Monitor system analytics.
- Ensure platform security.
- Manage feedback and logs.
- Improve AI performance.

---

# Admin Dashboard

The Admin Dashboard provides a complete overview of the system.

---

## Dashboard Components

### Overview Cards

Displays:

- Total Users
- Active Users
- Faculty Members
- Students
- Departments
- Uploaded Documents
- AI Conversations
- Feedback Count

---

### AI Statistics

Displays:

- Total Queries
- Successful Responses
- Failed Responses
- Average Response Time
- Retrieval Accuracy
- Hallucination Rate

---

### Knowledge Base

Displays:

- Total Documents
- Total Chunks
- Vector Database Status
- Recent Uploads
- Pending Documents

---

### Quick Actions

Buttons:

- Add User
- Upload Document
- Create Department
- Publish Notice
- Configure AI
- View Analytics
- View Logs
- Backup Database

---

# User Management

Administrators can manage all users.

---

## Features

- Create User
- Edit User
- Delete User
- Suspend User
- Activate User
- Reset Password
- Assign Roles
- View User Activity

---

## User Roles

- Student
- Faculty
- Administrator

---

# Department Management

Administrators can manage academic departments.

---

## Features

- Create Department
- Edit Department
- Delete Department
- Assign Faculty
- Assign Documents
- Department Analytics

---

# Document Management

Administrators have complete control over documents.

---

## Features

- Upload Documents
- Delete Documents
- Replace Documents
- Archive Documents
- Restore Documents
- View Metadata
- Bulk Upload
- Bulk Delete

---

## Supported File Types

- PDF
- DOCX
- TXT
- CSV

---

# Knowledge Base Management

Administrators can:

- View Documents
- Update Embeddings
- Regenerate Embeddings
- Delete Chunks
- Refresh Vector Database
- Monitor Storage

---

# AI Configuration

Administrators can configure:

- AI Model
- Temperature
- Max Tokens
- Retrieval Top-K
- Similarity Threshold
- Memory Length
- Prompt Templates
- System Prompt

---

# Notice Management

Administrators can:

- Publish Notices
- Schedule Notices
- Pin Notices
- Archive Notices
- Delete Notices

---

# Analytics Dashboard

The Analytics Dashboard includes:

- Daily Active Users
- Monthly Active Users
- Total Queries
- Average Response Time
- Most Asked Questions
- Popular Documents
- Department Usage
- User Growth
- Feedback Statistics
- AI Accuracy
- Search Trends

---

# Feedback Management

Administrators can:

- View Feedback
- Filter Feedback
- Reply to Feedback
- Export Feedback Reports
- View Ratings
- Monitor AI Performance

---

# Logs & Monitoring

Administrators can monitor:

- Login Logs
- Upload Logs
- Chat Logs
- Error Logs
- API Logs
- Audit Logs
- Security Logs

---

# Notifications

Administrators receive notifications for:

- Failed Uploads
- AI Errors
- New Feedback
- System Updates
- Security Alerts
- Storage Warnings

---

# System Settings

Administrators can configure:

- Institution Name
- Logo
- Contact Information
- Email Settings
- Authentication Settings
- Notification Settings
- Theme
- Maintenance Mode

---

# Backup & Recovery

Features:

- Manual Backup
- Scheduled Backup
- Restore Backup
- Export Database
- Disaster Recovery

---

# Functional Requirements

## Authentication

### FR-ADM-001

Administrators shall securely log in.

---

### FR-ADM-002

Administrators shall securely log out.

---

## Dashboard

### FR-ADM-003

Administrators shall access the admin dashboard.

### FR-ADM-004

Dashboard shall display real-time statistics.

---

## User Management

### FR-ADM-005

Administrators shall create users.

### FR-ADM-006

Administrators shall edit users.

### FR-ADM-007

Administrators shall delete users.

### FR-ADM-008

Administrators shall assign user roles.

### FR-ADM-009

Administrators shall reset passwords.

---

## Department Management

### FR-ADM-010

Administrators shall create departments.

### FR-ADM-011

Administrators shall edit departments.

### FR-ADM-012

Administrators shall delete departments.

---

## Document Management

### FR-ADM-013

Administrators shall upload documents.

### FR-ADM-014

Administrators shall delete documents.

### FR-ADM-015

Administrators shall archive documents.

### FR-ADM-016

Administrators shall regenerate embeddings.

---

## AI Configuration

### FR-ADM-017

Administrators shall configure AI settings.

### FR-ADM-018

Administrators shall modify prompt templates.

### FR-ADM-019

Administrators shall update retrieval parameters.

---

## Analytics

### FR-ADM-020

Administrators shall access complete analytics.

### FR-ADM-021

Administrators shall export reports.

---

## Feedback

### FR-ADM-022

Administrators shall manage user feedback.

---

## Logs

### FR-ADM-023

Administrators shall access audit logs.

### FR-ADM-024

Administrators shall monitor system events.

---

## Backup

### FR-ADM-025

Administrators shall create backups.

### FR-ADM-026

Administrators shall restore backups.

---

# Admin User Flow

```text
Admin Login
      │
      ▼
Admin Dashboard
      │
      ├────────► User Management
      │
      ├────────► Department Management
      │
      ├────────► Document Management
      │
      ├────────► Knowledge Base
      │
      ├────────► AI Configuration
      │
      ├────────► Analytics
      │
      ├────────► Feedback
      │
      ├────────► Logs
      │
      ├────────► Backup & Recovery
      │
      └────────► System Settings
```

---

# Admin Module Success Criteria

The Admin Module is considered complete when:

- Administrators can manage all users and roles.
- Departments can be created and maintained.
- Documents are successfully managed.
- AI settings can be configured.
- Analytics display accurate data.
- Feedback is monitored and managed.
- Audit logs are accessible.
- Backups can be created and restored.
- The system remains secure and scalable.

---

## End of Admin Module