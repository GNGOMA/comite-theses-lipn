from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Membre(Base):
    """
    Représente un utilisateur du système (Administrateur ou Membre du comité).
    """
    __tablename__ = "membres"

    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String(100))
    email = Column(String(100), unique=True, index=True)
    role = Column(String(50)) # 'Administrateur' ou 'Membre'
    mot_de_passe = Column(String(255)) # Stocke le mot de passe haché (bcrypt)

    # Relation pour accéder facilement aux missions assignées à ce membre
    affectations = relationship("Affectation", back_populates="membre", cascade="all, delete-orphan")


class Activite(Base):
    """
    Représente une tâche (CSI, Rapport, Audition) à réaliser.
    """
    __tablename__ = "activites"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String(50))        # Exemple: 'CSI', 'Rapport', 'Audition'
    description = Column(String(255))
    dateCreation = Column(String(20))
    dateEcheance = Column(String(20))
    statut = Column(String(50))      # Exemple: 'À faire', 'En cours', 'Terminé'

    # Relation pour savoir quels membres sont sur cette activité
    affectations = relationship("Affectation", back_populates="activite", cascade="all, delete-orphan")


class Affectation(Base):
    """
    Table de liaison entre un Membre et une Activité.
    """
    __tablename__ = "affectations"

    id = Column(Integer, primary_key=True, index=True)
    membre_id = Column(Integer, ForeignKey("membres.id"), nullable=False)
    activite_id = Column(Integer, ForeignKey("activites.id"), nullable=False)
    dateAffectation = Column(String(20))

    # Liens inverses vers les objets Membre et Activite
    membre = relationship("Membre", back_populates="affectations")
    activite = relationship("Activite", back_populates="affectations")