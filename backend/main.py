from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import models, schemas, crud
from database import SessionLocal, engine, Base
from datetime import datetime, timedelta
import random
from fastapi.security import OAuth2PasswordRequestForm
from auth import (
    authenticate_user,
    create_access_token,
    get_current_user,
    get_current_admin,
    get_password_hash
)

from fastapi import HTTPException



Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"], 
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/tenants/", response_model=schemas.TenantOut)
def create_tenant(tenant: schemas.TenantCreate, db: Session = Depends(get_db)):
    return crud.create_tenant(db, tenant)



@app.get("/tenants/", response_model=list[schemas.TenantOut])
def list_tenants(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    tenants = crud.get_tenants(db)
    result = []

    for tenant in tenants:
      
        minutes_ago = random.randint(5, 120)
        last_sync_time = (datetime.now() - timedelta(minutes=minutes_ago)).isoformat(timespec='seconds')

        
        last_error = random.choice(["", "", "Timeout error", "DB connection lost", "Auth failed"])

        # Determine health status
        if last_error:
            status = "red"
        elif minutes_ago > 60:
            status = "yellow"
        else:
            status = "green"

        # Convert to dict and attach simulated fields
        tenant_data = schemas.TenantOut.model_validate(tenant).model_dump()
        tenant_data.update({
            "last_sync_time": last_sync_time,
            "last_error": last_error or "None",
            "health_status": status
        })

        result.append(tenant_data)

    return result


@app.put("/tenants/{tenant_id}/pipeline")
def update_pipeline(tenant_id: int, state: bool, db: Session = Depends(get_db)):
    updated = crud.toggle_pipeline(db, tenant_id, state)
    if not updated:
        raise HTTPException(status_code=404, detail="Tenant not found")
    return {"status": "updated", "pipeline_running": updated.pipeline_running}

@app.post("/source-configs/", response_model=schemas.SourceConfigOut)
def create_source_config(config: schemas.SourceConfigCreate, db: Session = Depends(get_db)):
    return crud.create_source_config(db, config)

@app.get("/source-configs/", response_model=list[schemas.SourceConfigOut])
def read_source_configs(db: Session = Depends(get_db)):
    return crud.get_source_configs(db)


@app.put("/tenants/{tenant_id}/pipeline")
def update_pipeline(tenant_id: int, state: bool, db: Session = Depends(get_db)):
    updated = crud.toggle_pipeline(db, tenant_id, state)
    if not updated:
        raise HTTPException(status_code=404, detail="Tenant not found")
    return {"status": "updated", "pipeline_running": updated.pipeline_running}


    from fastapi.security import OAuth2PasswordRequestForm
from auth import (
    authenticate_user,
    create_access_token,
    get_current_user,
    get_current_admin,
    get_password_hash
)

@app.post("/users/", response_model=schemas.UserOut)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = models.User(username=user.username, hashed_password=get_password_hash(user.password), role=user.role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}
