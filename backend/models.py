from sqlalchemy import Column, Integer, String, Text, TIMESTAMP
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())

class PlantCare(Base):
    __tablename__ = "plant_care"

    id = Column(Integer, primary_key=True, index=True)
    plant_name = Column(String(255), unique=True, nullable=False, index=True)
    common_name = Column(String(255), nullable=True)
    sunlight = Column(Text, nullable=True)
    water = Column(Text, nullable=True)
    soil = Column(Text, nullable=True)
    container = Column(Text, nullable=True)
    location = Column(Text, nullable=True)
    fertilizer = Column(Text, nullable=True)
    care = Column(Text, nullable=True)
