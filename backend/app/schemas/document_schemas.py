from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime

class DepartmentNested(BaseModel):
    department_name: str

class DocumentOut(BaseModel):
    id: str
    title: str
    file_name: str
    file_url: str
    department_id: Optional[str] = None
    category: str
    uploaded_by: Optional[str] = None
    version: int = 1
    status: str = "active"
    uploaded_at: Optional[Any] = None

class DocumentListOut(BaseModel):
    id: str
    title: str
    file_name: str
    file_url: str
    department_id: Optional[str] = None
    category: str
    uploaded_by: Optional[str] = None
    version: int = 1
    status: str = "active"
    uploaded_at: Optional[Any] = None
    departments: Optional[DepartmentNested] = None
