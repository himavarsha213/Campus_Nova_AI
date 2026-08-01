# Student Module

## Module Overview

The Student Module is the primary interface of CampusNova AI. It provides students with AI-powered assistance, document search, personalized dashboards, quizzes, summaries, notifications, and academic resources through a secure and intuitive platform.

---

# Module Objectives

The Student Module aims to:

- Provide instant AI-powered assistance.
- Simplify access to institutional knowledge.
- Improve academic productivity.
- Personalize the learning experience.
- Reduce time spent searching documents.
- Enable self-learning through AI-generated quizzes and summaries.

---

# Student Dashboard

The Student Dashboard serves as the central hub after login.

---

## Dashboard Components

### Welcome Section

Displays:

- Student Name
- Department
- Semester
- Profile Picture
- Greeting Message

---

### Quick Statistics

Displays:

- Documents Available
- Recent Notices
- Active Conversations
- Saved Documents
- Completed Quizzes

---

### Quick Actions

Buttons:

- Ask AI
- Upload Notes
- Search Documents
- Generate Quiz
- Summarize Document
- View Notices

---

### Recent Conversations

Displays:

- Conversation Title
- Date
- Last Message
- Continue Chat

---

### Latest Notices

Displays:

- Academic Notices
- Department Notices
- Placement Updates
- Examination Notifications
- Event Announcements

---

### Recommended Resources

AI recommends:

- PDFs
- Study Notes
- Previous Papers
- Syllabus
- Important Circulars

---

# Student Profile

Students can manage:

- Profile Picture
- Name
- Email
- Phone Number
- Department
- Semester
- Password
- Notification Preferences

---

# AI Chat

The AI Chat page is the core feature of CampusNova AI.

---

## Features

- Natural Language Questions
- Streaming Responses
- Typing Animation
- Markdown Support
- Code Blocks
- Source Citations
- Conversation Memory
- Suggested Questions
- Regenerate Response
- Copy Response

---

## Example Questions

- What is the attendance policy?
- When are semester exams?
- What is the hostel fee?
- Show placement eligibility.
- Explain examination rules.
- Summarize academic regulations.

---

# Chat History

Students can:

- View Previous Chats
- Rename Conversations
- Delete Conversations
- Pin Important Chats
- Export Chat
- Search Chat History

---

# Saved Responses

Students can bookmark:

- Important Answers
- AI Responses
- Notes
- Summaries
- Documents

---

# Document Search

Students can search using:

- Keywords
- Natural Language
- Department
- Category
- File Name

---

## Search Results Display

Each result contains:

- Document Name
- Department
- Similarity Score
- Preview
- Download Button

---

# AI Document Summarizer

Students upload or select a document.

AI generates:

- Executive Summary
- Key Topics
- Important Dates
- Deadlines
- Bullet Points
- Action Items

---

# AI Quiz Generator

Students can generate quizzes from any uploaded document.

---

## Quiz Types

- Multiple Choice Questions
- True/False
- Fill in the Blanks
- Short Answer Questions

---

## Difficulty Levels

- Easy
- Medium
- Hard

---

## Quiz Results

Displays:

- Score
- Correct Answers
- Wrong Answers
- Explanation
- Improvement Suggestions

---

# Notifications

Students receive notifications for:

- New Notices
- Exam Updates
- Placement Drives
- Assignment Deadlines
- Uploaded Documents
- AI Announcements
- System Updates

---

# Department Resources

Students can access:

- Syllabus
- Faculty List
- Study Material
- Previous Papers
- Lab Manuals
- Timetables
- Regulations

---

# Events

Students can view:

- Technical Events
- Workshops
- Seminars
- Hackathons
- Placement Drives
- Cultural Events

---

# Feedback

Students can submit:

- Like 👍
- Dislike 👎
- Rating
- Comments
- Report Incorrect Answer

---

# Student Settings

Students can configure:

- Dark Mode
- Language
- Notification Settings
- Chat Preferences
- Privacy Settings
- Account Security

---

# Functional Requirements

## Authentication

### FR-STU-001

Students shall securely log in.

---

### FR-STU-002

Students shall securely log out.

---

### FR-STU-003

Students shall reset forgotten passwords.

---

## Dashboard

### FR-STU-004

Students shall access a personalized dashboard.

### FR-STU-005

Dashboard shall display recent activity.

### FR-STU-006

Dashboard shall display latest notices.

---

## AI Chat

### FR-STU-007

Students shall ask natural language questions.

### FR-STU-008

AI shall remember previous messages.

### FR-STU-009

AI shall display citations.

### FR-STU-010

AI shall refuse unsupported questions.

---

## Documents

### FR-STU-011

Students shall search documents.

### FR-STU-012

Students shall download documents.

### FR-STU-013

Students shall preview documents.

---

## Summaries

### FR-STU-014

Students shall generate summaries.

### FR-STU-015

AI shall identify important dates.

---

## Quizzes

### FR-STU-016

Students shall generate quizzes.

### FR-STU-017

Students shall save quiz history.

### FR-STU-018

Students shall review quiz results.

---

## Notifications

### FR-STU-019

Students shall receive notifications.

---

## Feedback

### FR-STU-020

Students shall submit AI feedback.

---

## Profile

### FR-STU-021

Students shall update profile information.

### FR-STU-022

Students shall change passwords.

---

## Settings

### FR-STU-023

Students shall enable Dark Mode.

### FR-STU-024

Students shall configure notification preferences.

---

# Student User Flow

```text
Student Login
      │
      ▼
Dashboard
      │
      ├────────► AI Chat
      │
      ├────────► Search Documents
      │
      ├────────► Summarizer
      │
      ├────────► Quiz Generator
      │
      ├────────► Notices
      │
      ├────────► Events
      │
      ├────────► Chat History
      │
      └────────► Settings
```

---

# Student Module Success Criteria

The Student Module is considered complete when:

- Students can securely log in.
- AI answers questions accurately.
- Documents are searchable.
- Quizzes are generated successfully.
- Summaries are accurate.
- Notifications are delivered.
- Chat history is maintained.
- Source citations are displayed.
- Feedback is collected successfully.

---

## End of Student Module