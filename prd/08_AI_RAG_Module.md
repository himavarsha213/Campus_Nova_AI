# AI & RAG Module

## Module Overview

The AI & Retrieval-Augmented Generation (RAG) Module is the core intelligence of CampusNova AI. It enables users to ask natural language questions and receive accurate, context-aware answers based on official college documents instead of relying solely on the Large Language Model (LLM).

The RAG architecture combines document retrieval, semantic search, vector embeddings, and conversational memory to generate trustworthy responses with source citations.

---

# Objectives

The AI & RAG Module aims to:

- Provide accurate AI-generated answers.
- Retrieve information from official college documents.
- Prevent hallucinations.
- Maintain conversation context.
- Support semantic document search.
- Display source citations.
- Improve response quality.
- Scale with large document collections.

---

# AI Architecture

```text
User
   │
   ▼
Chat Interface
   │
   ▼
Authentication
   │
   ▼
User Query
   │
   ▼
Embedding Generation
   │
   ▼
Vector Database (Pinecone)
   │
   ▼
Top-K Retrieval
   │
   ▼
Relevant Context
   │
   ▼
Prompt Construction
   │
   ▼
Large Language Model
   │
   ▼
Response Generation
   │
   ▼
Source Citation
   │
   ▼
User
```

---

# RAG Pipeline

## Step 1 — Document Upload

Faculty or administrators upload institutional documents.

Supported formats:

- PDF
- DOCX
- TXT
- CSV

---

## Step 2 — Text Extraction

The system extracts text from uploaded documents.

Operations:

- Remove formatting
- Remove unnecessary spaces
- Normalize text
- Preserve document structure

---

## Step 3 — Text Chunking

Large documents are divided into smaller chunks.

Chunk Properties

- Chunk Size
- Overlap
- Metadata
- Page Number
- Department
- Category

---

## Step 4 — Embedding Generation

Each text chunk is converted into vector embeddings using Hugging Face Embedding Models.

Metadata stored includes:

- Document ID
- Chunk ID
- Department
- Category
- File Name
- Page Number

---

## Step 5 — Vector Storage

Generated embeddings are stored in Pinecone.

Stored Data

- Vector
- Metadata
- Document Reference
- Chunk Text

---

## Step 6 — User Query

The student submits a question.

Example:

"What is the attendance requirement?"

---

## Step 7 — Query Embedding

The question is converted into an embedding using the same embedding model.

---

## Step 8 — Semantic Search

Pinecone performs similarity search.

Search Parameters

- Top K Results
- Similarity Score
- Metadata Filters
- Department Filter

---

## Step 9 — Context Construction

The retrieved document chunks are combined to form the context.

Prompt Template

```text
Answer only using the provided context.

If the answer is unavailable,
reply that the information
does not exist in the official
college documents.

Always provide citations.
```

---

## Step 10 — Response Generation

The Large Language Model generates the answer using:

- User Question
- Retrieved Context
- Conversation History
- Prompt Instructions

---

## Step 11 — Source Citation

Every response includes:

- Document Name
- Page Number
- Department
- Confidence Score

---

# Conversational Memory

The chatbot remembers:

- Previous Questions
- Previous Answers
- Department
- Current Topic
- Recent Documents
- User Preferences

Example

Student:

"What is attendance policy?"

↓

Student:

"What if I don't meet it?"

The AI understands that "it" refers to the attendance policy.

---

# Semantic Search

Search Capabilities

- Natural Language Search
- Keyword Search
- Hybrid Search
- Metadata Search
- Department Search
- Document Search

---

# AI Features

## Conversational AI

Features

- Multi-turn Conversation
- Context Awareness
- Conversation Memory
- Smart Follow-up
- Suggested Questions

---

## Intelligent Responses

Features

- Source-based Answers
- Hallucination Prevention
- Confidence Score
- Markdown Formatting
- Streaming Responses

---

## Smart Recommendations

AI suggests

- Related Documents
- Similar Questions
- Recommended Notices
- Study Material
- Department Resources

---

# AI Summarizer

Students can summarize:

- PDF Documents
- Policies
- Regulations
- Academic Calendar
- Syllabus

Output

- Executive Summary
- Key Points
- Important Dates
- Deadlines
- Action Items

---

# AI Quiz Generator

Generates:

- MCQs
- True/False
- Fill in the Blanks
- Short Answers

Difficulty

- Easy
- Medium
- Hard

---

# AI Notice Assistant

Automatically summarizes:

- Department Notices
- Examination Notices
- Placement Notices
- Events
- Circulars

---

# Hallucination Prevention

The AI must never invent information.

If no relevant document exists, the response should be:

> "I couldn't find this information in the official college knowledge base. Please contact your department or administrator."

---

# AI Confidence Score

Each answer includes:

- Retrieval Score
- Similarity Score
- Confidence Percentage

Example

Confidence: **96%**

---

# Source Citations

Every response displays:

- Document Name
- Page Number
- Department
- View Source Button

---

# AI Analytics

Collected Metrics

- Total Questions
- Successful Retrievals
- Failed Retrievals
- Average Response Time
- Average Confidence
- Popular Topics
- Department Usage

---

# Functional Requirements

## Document Processing

### FR-AI-001

The system shall extract text from uploaded documents.

### FR-AI-002

The system shall divide documents into chunks.

### FR-AI-003

The system shall generate embeddings.

### FR-AI-004

The system shall store vectors in Pinecone.

---

## Retrieval

### FR-AI-005

The system shall perform semantic search.

### FR-AI-006

The system shall retrieve Top-K relevant chunks.

### FR-AI-007

The system shall apply metadata filtering.

---

## AI Response

### FR-AI-008

The system shall generate contextual responses.

### FR-AI-009

The system shall display citations.

### FR-AI-010

The system shall maintain conversation memory.

### FR-AI-011

The system shall prevent hallucinations.

### FR-AI-012

The system shall display confidence scores.

---

## Summarization

### FR-AI-013

Students shall generate document summaries.

---

## Quiz

### FR-AI-014

Students shall generate quizzes from uploaded documents.

---

## Recommendations

### FR-AI-015

The AI shall recommend related resources.

---

# AI Module Success Criteria

The AI module is considered successful when:

- Responses are context-aware.
- Retrieval accuracy exceeds 90%.
- Hallucinations are minimized.
- Source citations are displayed.
- Conversation memory works correctly.
- Response time remains below 3 seconds.
- Semantic search returns relevant documents.
- AI improves user productivity.

---

## Future Enhancements

- Voice Chat
- OCR Support
- Multilingual AI
- Speech-to-Text
- Text-to-Speech
- WhatsApp Integration
- Email Assistant
- AI Study Planner
- AI Timetable Generator
- AI Placement Assistant
- AI Career Advisor

---

## End of AI & RAG Module