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
    

    model_config = {
        "from_attributes": True
    }


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
        orm_mode = True
