from sqlalchemy import Column, Integer, String, ForeignKey
from database import Base
from sqlalchemy.orm import relationship


class Membre(Base):
    __tablename__ = "membres"

    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String(100))
    email = Column(String(100))
    role = Column(String(50))


class Activite(Base):
    __tablename__ = "activites"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String(50), nullable=False)
    description = Column(String(255), nullable=False)
    dateCreation = Column(String(20), nullable=False)
    dateEcheance = Column(String(20), nullable=False)
    statut = Column(String(50), nullable=False)
    assigne = Column(String(100), nullable=True)      # facultatif
    doctorant = Column(String(100), nullable=True)    # facultatif

class Affectation(Base):
    __tablename__ = "affectations"

    id = Column(Integer, primary_key=True, index=True)
    membre_id = Column(Integer, ForeignKey("membres.id"), nullable=False)
    activite_id = Column(Integer, ForeignKey("activites.id"), nullable=False)
    dateAffectation = Column(String(20))
    membre = relationship("Membre")
    activite = relationship("Activite")