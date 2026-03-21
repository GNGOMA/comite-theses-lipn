from typing import Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import SessionLocal
from models import Membre, Activite

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class MembreCreate(BaseModel):
    nom: str
    email: str
    role: str


class ActiviteCreate(BaseModel):
    type: str
    description: str
    dateCreation: str
    dateEcheance: str
    statut: str

#-----------------Routes Membres-------------------
@router.get("/membres")
def get_membres(db: Session = Depends(get_db)):
    return db.query(Membre).all()


#------------------Routes Activites-------------------
@router.get("/activites")
def get_activites(db: Session = Depends(get_db)):
    return db.query(Activite).all()


#-------------------Routes Administrateur---------------
@router.get("/dashboard/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_membres = db.query(Membre).count()
    total_en_cours = db.query(Activite).filter(Activite.statut == "En cours").count()
    total_terminees = db.query(Activite).filter(Activite.statut == "Terminé").count()

    return {
        "total_membres": total_membres,
        "total_en_cours": total_en_cours,
        "total_terminees": total_terminees
    }