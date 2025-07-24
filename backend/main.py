from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import models, schemas, crud
from database import SessionLocal, engine, Base
from datetime import datetime, timedelta
import random

from fastapi import HTTPException



Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server origin
    allow_credentials=True,
    allow_methods=["*"],  # Needed to allow POST, PUT, DELETE
    allow_headers=["*"],  # Needed for Authorization, Content-Type, etc.
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
def list_tenants(db: Session = Depends(get_db)):
    tenants = crud.get_tenants(db)
    result = []
    for tenant in tenants:
        # Simulate last sync and error
        minutes_ago = random.randint(1, 120)
        last_sync_time = (datetime.utcnow() - timedelta(minutes=minutes_ago)).isoformat()
        error_options = ["", "", "Timeout error", "Connection refused", "Invalid credentials"]
        last_error = random.choice(error_options)

        # Derive status color
        if last_error:
            status = "red"
        elif minutes_ago > 60:
            status = "yellow"
        else:
            status = "green"

        tenant_dict = schemas.TenantOut.from_orm(tenant).dict()
        tenant_dict.update({
            "last_sync_time": last_sync_time,
            "last_error": last_error or "None",
            "health_status": status,
        })
        result.append(tenant_dict)
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