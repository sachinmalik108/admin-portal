from pydantic import BaseModel
from typing import Optional

class TenantBase(BaseModel):
    name: str
    email: str
    timezone: str

class TenantCreate(TenantBase):
    pass

class TenantOut(TenantBase):
    
    id: int 
    pipeline_running: bool
    last_sync_time: Optional[str] = None
    last_error: Optional[str] = None
    health_status: Optional[str] = None

    model_config = {
        "from_attributes": True
    }

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str
    role: str = "viewer"

class UserOut(UserBase):
    id: int
    role: str

    model_config = {
        "from_attributes": True
    }

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None








class SourceConfigBase(BaseModel):
    db_host: str
    port: int
    username: str
    password: str

class SourceConfigCreate(SourceConfigBase):
    tenant_id: int

class SourceConfigOut(SourceConfigBase):
    id: int
    tenant_id: int

    class Config:
        from_attributes = True
