/**
 * Interface représentant un membre du comité
 */
export interface Membre {
  id: number;
  nom: string;
  email: string;
  role: 'Administrateur' | 'Membre'; // Rôles restreints pour plus de sécurité
  labo?: string;
  charge: number; // Taux de charge actuel entre 0 et 100
}

/**
 * Interface pour les activités gérées par le comité
 */
export interface Activite {
  id: number;
  type: 'CSI' | 'Rapport' | 'Audition';
  description: string;
  dateCreation: string; // ISO format (YYYY-MM-DD)
  dateEcheance: string; // ISO format
  statut: 'À faire' | 'En cours' | 'Terminé';
  assigne: string; // Nom du membre responsable
  doctorant?: string; // Nom du doctorant concerné
}

/**
 * Interface pour l'historique des mandats
 */
export interface Mandat {
  id: number;
  dateDebut: string;
  dateFin: string;
}

/**
 * Interface spécifique pour les CSI (Comité de Suivi Individuel)
 */
export interface CSI {
  id: number;
  doctorant: string;
  dateCSI: string;
}

/**
 * Interface pour tracer l'affectation d'une activité
 */
export interface Affectation {
  id: number;
  membreId: number;
  activiteId: number;
  dateAffectation: string;
}