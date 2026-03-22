from typing import Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import SessionLocal
from models import Membre, Activite, Affectation

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

#Loubna
# --- AJOUTER UN MEMBRE ---
@router.post("/membres")
def create_membre(membre: MembreCreate, db: Session = Depends(get_db)):
    db_membre = Membre(nom=membre.nom, email=membre.email, role=membre.role)
    db.add(db_membre)
    db.commit()
    db.refresh(db_membre)
    return db_membre

# --- SUPPRIMER UN MEMBRE ---
@router.delete("/membres/{membre_id}")
def delete_membre(membre_id: int, db: Session = Depends(get_db)):
    db_membre = db.query(Membre).filter(Membre.id == membre_id).first()
    if db_membre:
        db.delete(db_membre)
        db.commit()
    return {"message": "Membre supprimé"}

# --- MODIFIER UN MEMBRE ---
@router.put("/membres/{membre_id}")
def update_membre(membre_id: int, membre_update: MembreCreate, db: Session = Depends(get_db)):
    db_membre = db.query(Membre).filter(Membre.id == membre_id).first()
    if db_membre:
        db_membre.nom = membre_update.nom
        db_membre.email = membre_update.email
        db_membre.role = membre_update.role
        db.commit()
        db.refresh(db_membre)
    return db_membre
#------------------Routes Activites-------------------
@router.get("/activites")
def get_activites(db: Session = Depends(get_db)):
    return db.query(Activite).all()


# =======================
# Routes Affectations
# =======================

@router.get("/affectations")
def get_affectations(db: Session = Depends(get_db)):
    affectations = db.query(Affectation).all()

    result = []
    for a in affectations:
        result.append({
            "id": a.id,
            "dateAffectation": a.dateAffectation,
            "membre": {
                "id": a.membre.id,
                "nom": a.membre.nom,
                "email": a.membre.email,
                "role": a.membre.role
            },
            "activite": {
                "id": a.activite.id,
                "type": a.activite.type,
                "description": a.activite.description,
                "dateCreation": a.activite.dateCreation,
                "dateEcheance": a.activite.dateEcheance,
                "statut": a.activite.statut
            }
        })

    return result


#-------------------Routes Administrateur---------------

@router.get("/dashboard/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_membres = db.query(Membre).count()
    total_activites = db.query(Activite).count()
    total_en_cours = db.query(Activite).filter(Activite.statut == "En cours").count()
    total_terminees = db.query(Activite).filter(Activite.statut == "Terminé").count()

    return {
        "total_membres": total_membres,
        "total_activites": total_activites,
        "total_en_cours": total_en_cours,
        "total_terminees": total_terminees
    }

@router.get("/dashboard/member-metrics")
def get_member_metrics(db: Session = Depends(get_db)):
    membres = db.query(Membre).all()

    total_tasks_global = db.query(Affectation).count()

    total_completed_global = (
        db.query(Affectation)
        .join(Activite, Affectation.activite_id == Activite.id)
        .filter(Activite.statut == "Terminé")
        .count()
    )

    resultats = []

    for membre in membres:
        member_total_tasks = (
            db.query(Affectation)
            .filter(Affectation.membre_id == membre.id)
            .count()
        )

        member_completed_tasks = (
            db.query(Affectation)
            .join(Activite, Affectation.activite_id == Activite.id)
            .filter(
                Affectation.membre_id == membre.id,
                Activite.statut == "Terminé"
            )
            .count()
        )

        # 1) Répartition des tâches
        if total_tasks_global > 0:
            task_distribution = round((member_total_tasks / total_tasks_global) * 100, 2)
        else:
            task_distribution = 0.0

        # 2) Taux de complétion
        if member_total_tasks > 0:
            completion_rate = round((member_completed_tasks / member_total_tasks) * 100, 2)
        else:
            completion_rate = 0.0

        # 3) Contribution réelle
        if total_completed_global > 0:
            real_contribution = round((member_completed_tasks / total_completed_global) * 100, 2)
        else:
            real_contribution = 0.0

        resultats.append({
            "membre_id": membre.id,
            "nom": membre.nom,
            "email": membre.email,
            "role": membre.role,
            "member_total_tasks": member_total_tasks,
            "member_completed_tasks": member_completed_tasks,
            "task_distribution": task_distribution,
            "completion_rate": completion_rate,
            "real_contribution": real_contribution
        })

    return resultats