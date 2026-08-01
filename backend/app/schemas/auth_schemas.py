from pydantic import BaseModel, Field
from typing import Optional

class UserRegister(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=255)
    email: str = Field(..., min_length=3, max_length=255)
    password: str = Field(..., min_length=6)
    role: str = Field(default="student", pattern="^(student|faculty|admin)$")
    department_id: Optional[str] = None
    semester: Optional[int] = 1
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str
    role: Optional[str] = None

class UserOut(BaseModel):
    id: str
    full_name: str
    email: str
    role: str
    department_id: Optional[str] = None
    semester: Optional[int] = 1
    phone: Optional[str] = None
    profile_image: Optional[str] = None
    created_at: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

class ForgotPasswordRequest(BaseModel):
    email: str
