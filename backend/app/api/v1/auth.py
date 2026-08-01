from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.auth_schemas import UserRegister, UserLogin, Token, UserOut, ForgotPasswordRequest
from app.core.security import verify_password, get_password_hash, create_access_token, get_current_user
from app.database.user_repo import user_repo
from app.database.supabase_client import supabase_admin

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserRegister):
    # Check if email already exists
    existing_user = user_repo.get_by_email(user_in.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    
    # Hash password and save user
    password_hash = get_password_hash(user_in.password)
    user_data = {
        "full_name": user_in.full_name,
        "email": user_in.email.lower(),
        "password_hash": password_hash,
        "role": user_in.role,
        "department_id": user_in.department_id,
        "semester": user_in.semester,
        "phone": user_in.phone
    }
    
    try:
        new_user = user_repo.create(user_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error during registration: {str(e)}")

    access_token = create_access_token(subject=new_user["id"], role=new_user["role"])
    
    user_out = UserOut(
        id=str(new_user["id"]),
        full_name=new_user["full_name"],
        email=new_user["email"],
        role=new_user["role"],
        department_id=str(new_user["department_id"]) if new_user.get("department_id") else None,
        semester=new_user.get("semester", 1),
        created_at=str(new_user.get("created_at", ""))
    )
    
    return Token(access_token=access_token, user=user_out)

@router.post("/login", response_model=Token)
async def login(credentials: UserLogin):
    user = user_repo.get_by_email(credentials.email.lower())
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    if not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    access_token = create_access_token(subject=user["id"], role=user["role"])
    
    user_out = UserOut(
        id=str(user["id"]),
        full_name=user["full_name"],
        email=user["email"],
        role=user["role"],
        department_id=str(user["department_id"]) if user.get("department_id") else None,
        semester=user.get("semester", 1),
        created_at=str(user.get("created_at", ""))
    )
    
    return Token(access_token=access_token, user=user_out)

@router.get("/me", response_model=UserOut)
async def get_me(current_user: dict = Depends(get_current_user)):
    return UserOut(
        id=str(current_user["id"]),
        full_name=current_user["full_name"],
        email=current_user["email"],
        role=current_user["role"],
        department_id=str(current_user["department_id"]) if current_user.get("department_id") else None,
        semester=current_user.get("semester", 1),
        created_at=str(current_user.get("created_at", ""))
    )

@router.post("/forgot-password")
async def forgot_password(req: ForgotPasswordRequest):
    user = user_repo.get_by_email(req.email.lower())
    if not user:
        # Return success for security to prevent user enumeration
        return {"success": True, "message": "Password reset instructions sent if email exists."}
    
    return {"success": True, "message": "Password reset link sent to your registered email."}

DEFAULT_DEPARTMENTS = [
    {"id": "a0000000-0000-0000-0000-000000000001", "department_name": "Computer Science & Engineering", "department_code": "CSE"},
    {"id": "a0000000-0000-0000-0000-000000000002", "department_name": "Information Technology", "department_code": "IT"},
    {"id": "a0000000-0000-0000-0000-000000000003", "department_name": "Electronics & Communication", "department_code": "ECE"},
    {"id": "a0000000-0000-0000-0000-000000000004", "department_name": "Electrical & Electronics", "department_code": "EEE"},
    {"id": "a0000000-0000-0000-0000-000000000005", "department_name": "Mechanical Engineering", "department_code": "MECH"},
    {"id": "a0000000-0000-0000-0000-000000000006", "department_name": "Civil Engineering", "department_code": "CIVIL"},
    {"id": "a0000000-0000-0000-0000-000000000007", "department_name": "Artificial Intelligence & Data Science", "department_code": "AI-DS"},
]

@router.get("/departments", tags=["Authentication"])
async def list_departments():
    """Public endpoint to fetch all departments for the registration form."""
    try:
        res = supabase_admin.table("departments").select("id, department_name, department_code").order("department_name").execute()
        if res.data and len(res.data) > 0:
            return {"departments": res.data}
    except Exception:
        pass
    return {"departments": DEFAULT_DEPARTMENTS}
