import datetime
import os
from typing import List
from sqlalchemy import DateTime, create_engine, inspect
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.sql import asc, desc, func

Base = declarative_base()


class ValidationInfo(Base):
    __tablename__ = "validation_info"
    id = Column(String, primary_key=True)
    start_time = Column(DateTime)
    duration = Column(Integer)
    status = Column(String(32))
    statistic_info = Column(String)
    error_info = Column(String)


class ValidationDatabaseWrapper:
    def __init__(self, db_path):
        self.engine = create_engine(
            f"sqlite:///{db_path}?check_same_thread=False", echo=True
        )
        self._get_or_create_database(db_path)
        self.Session = sessionmaker()
        self.Session.configure(bind=self.engine)
        self.session = self.Session()

    def _get_or_create_database(self, db_path):
        if not os.path.exists(db_path):
            Base.metadata.create_all(self.engine, checkfirst=True)

    def add_validation_info(self, validation_info):
        self.session.add(validation_info)
        self.session.commit()

    def get_recent_records(self)->List[ValidationInfo]:
        if not inspect(self.engine).has_table("validation_info"):
            return []
        return self.session.query(ValidationInfo).order_by(desc(ValidationInfo.start_time)).limit(7).all()
    
    def get_all_records(self)->List[ValidationInfo]:
        if not inspect(self.engine).has_table("validation_info"):
            return []
        return self.session.query(ValidationInfo).order_by(desc(ValidationInfo.start_time)).all()