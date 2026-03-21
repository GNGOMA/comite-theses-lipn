from sqlalchemy import Column, Integer, String
from database import Base

class Membre(Base):
    __tablename__ = "membres"

    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String(100))
    email = Column(String(100))
    role = Column(String(50))


class Activite(Base):
    __tablename__ = "activites"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String(50))
    description = Column(String(255))
    dateCreation = Column(String(20))
    dateEcheance = Column(String(20))
    statut = Column(String(50))
