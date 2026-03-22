from typing import Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import SessionLocal
from models import Membre, Activite, Affectation

from fastapi import HTTPException
from pydantic import BaseModel

from fastapi import UploadFile, File
import os
import shutil

router = APIRouter()

class StatutUpdate(BaseModel):
    statut: str

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

#----------------------------------- Routes Membres + Activites-------------------
@router.get("/membres/{membre_id}/activites")
def get_activites_by_membre(membre_id: int, db: Session = Depends(get_db)):
    results = (
        db.query(Affectation, Activite)
        .join(Activite, Affectation.activite_id == Activite.id)
        .filter(Affectation.membre_id == membre_id)
        .all()
    )

    data = []
    for affectation, activite in results:
        data.append({
            "affectation_id": affectation.id,
            "dateAffectation": affectation.dateAffectation,
            "id": activite.id,
            "type": activite.type,
            "description": activite.description,
            "dateCreation": activite.dateCreation,
            "dateEcheance": activite.dateEcheance,
            "statut": activite.statut
        })

    return data

#-------------------------------
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

#-------------------Route pour mettre à jour le statut d'une activité-------------------

@router.put("/activites/{activite_id}/statut")
def update_statut_activite(activite_id: int, payload: StatutUpdate, db: Session = Depends(get_db)):
    activite = db.query(Activite).filter(Activite.id == activite_id).first()

    if not activite:
        raise HTTPException(status_code=404, detail="Activité introuvable")

    activite.statut = payload.statut
    db.commit()
    db.refresh(activite)

    return {
        "message": "Statut mis à jour avec succès",
        "activite": {
            "id": activite.id,
            "type": activite.type,
            "description": activite.description,
            "dateCreation": activite.dateCreation,
            "dateEcheance": activite.dateEcheance,
            "statut": activite.statut
        }
    }

#-------------------Route pour uploader un fichier lié à une activité-------------------

@router.post("/activites/{activite_id}/upload")
def upload_fichier_activite(activite_id: int, fichier: UploadFile = File(...), db: Session = Depends(get_db)):
    activite = db.query(Activite).filter(Activite.id == activite_id).first()

    if not activite:
        raise HTTPException(status_code=404, detail="Activité introuvable")

    upload_dir = "uploads"
    os.makedirs(upload_dir, exist_ok=True)

    file_path = os.path.join(upload_dir, f"{activite_id}_{fichier.filename}")

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(fichier.file, buffer)

    return {
        "message": "Fichier uploadé avec succès",
        "filename": fichier.filename,
        "path": file_path,
        "activite_id": activite_id
    }

