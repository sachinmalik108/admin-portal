from sqlalchemy.orm import Session
import models, schemas

def create_tenant(db: Session, tenant: schemas.TenantCreate):
    db_tenant = models.Tenant(**tenant.dict())
    db.add(db_tenant)
    db.commit()
    db.refresh(db_tenant)
    return db_tenant

def get_tenants(db: Session):
    return db.query(models.Tenant).all()

def toggle_pipeline(db: Session, tenant_id: int, state: bool):
    tenant = db.query(models.Tenant).get(tenant_id)
    if tenant:
        tenant.pipeline_running = state
        db.commit()
        db.refresh(tenant)
    return tenant


def create_source_config(db: Session, config: schemas.SourceConfigCreate):
    db_config = models.SourceConfig(**config.dict())
    db.add(db_config)
    db.commit()
    db.refresh(db_config)
    return db_config

def get_source_configs(db: Session):
    return db.query(models.SourceConfig).all()

def toggle_pipeline(db: Session, tenant_id: int, state: bool):
    tenant = db.query(models.Tenant).get(tenant_id)
    if not tenant:
        return None
    tenant.pipeline_running = state
    db.commit()
    db.refresh(tenant)
    return tenant

