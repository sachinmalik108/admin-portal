from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Tenant(Base):
    __tablename__ = "tenants"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String)
    timezone = Column(String)
    pipeline_running = Column(Boolean, default=False)

    source_configs = relationship("SourceConfig", back_populates="tenant")


class SourceConfig(Base):
    __tablename__ = "source_configs"
    id = Column(Integer, primary_key=True, index=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))
    db_host = Column(String)
    port = Column(Integer)
    username = Column(String)
    password = Column(String)

    tenant = relationship("Tenant", back_populates="source_configs")
