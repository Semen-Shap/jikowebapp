from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, unique=True, index=True)
    user_name = Column(String)

# Создание подключения к базе данных
DATABASE_URL = "sqlite:///./test.db"  # Путь к файлу базы данных SQLite
engine = create_engine(DATABASE_URL)

# Создание сессии базы данных
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Создание таблицы в базе данных
Base.metadata.create_all(bind=engine)
