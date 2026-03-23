from main import SessionLocal, MembreDB, get_password_hash

# Ouvrir la session de base de données
db = SessionLocal()

# Créer votre utilisateur
nouvel_admin = MembreDB(
    nom="Votre Nom",
    email="votre.email@lipn.fr",
    mot_de_passe=get_password_hash("motdepasse123"), # Ceci va crypter le mot de passe !
    role="Administrateur"
)

db.add(nouvel_admin)
db.commit()
print("Utilisateur créé avec succès dans MySQL !")