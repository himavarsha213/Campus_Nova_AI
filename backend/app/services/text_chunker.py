import uuid
from typing import List, Dict, Any

class RecursiveTextSplitter:
    def __init__(self, chunk_size: int = 800, chunk_overlap: int = 150):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.separators = ["\n\n", "\n", ". ", " ", ""]

    def split_text(self, text: str) -> List[str]:
        """
        Recursively splits text into smaller chunks based on separators.
        """
        return self._split(text, self.separators)

    def _split(self, text: str, separators: List[str]) -> List[str]:
        if len(text) <= self.chunk_size:
            return [text]

        if not separators:
            # Character fallback if no separators left
            return [text[i:i + self.chunk_size] for i in range(0, len(text), self.chunk_size - self.chunk_overlap)]

        separator = separators[0]
        splits = text.split(separator)
        
        chunks = []
        current_chunk = ""

        for part in splits:
            if len(part) > self.chunk_size:
                if current_chunk:
                    chunks.append(current_chunk.strip())
                    current_chunk = ""
                # Recursively split large parts
                sub_chunks = self._split(part, separators[1:])
                chunks.extend(sub_chunks)
            else:
                connector = separator if current_chunk else ""
                if len(current_chunk) + len(connector) + len(part) <= self.chunk_size:
                    current_chunk += connector + part
                else:
                    if current_chunk:
                        chunks.append(current_chunk.strip())
                    
                    # Backtrack to apply overlap
                    overlap_text = ""
                    if current_chunk and self.chunk_overlap > 0:
                        overlap_text = current_chunk[-self.chunk_overlap:]
                        space_idx = overlap_text.find(" ")
                        if space_idx != -1:
                            overlap_text = overlap_text[space_idx + 1:]
                    
                    current_chunk = (overlap_text + connector + part).strip()

        if current_chunk:
            chunks.append(current_chunk.strip())

        return [c for c in chunks if c]

def chunk_document(
    pages: List[Dict[str, Any]], 
    document_id: str, 
    file_name: str, 
    department_id: str = None, 
    category: str = None
) -> List[Dict[str, Any]]:
    """
    Splits page-level document text into overlapping chunks, mapping metadata
    for both Supabase (document_chunks table) and Pinecone vector payloads.
    """
    splitter = RecursiveTextSplitter(chunk_size=800, chunk_overlap=150)
    document_chunks = []
    chunk_index = 1

    for page in pages:
        page_num = page["page_number"]
        page_text = page["text"]
        
        splits = splitter.split_text(page_text)
        for split in splits:
            chunk_uuid = str(uuid.uuid4())
            document_chunks.append({
                "id": chunk_uuid,
                "document_id": document_id,
                "chunk_number": chunk_index,
                "chunk_text": split,
                "page_number": page_num,
                "vector_id": chunk_uuid,  # Will be mapped to Pinecone ID
                
                # Additional metadata for Pinecone payload:
                "department_id": department_id,
                "category": category,
                "file_name": file_name
            })
            chunk_index += 1

    return document_chunks
