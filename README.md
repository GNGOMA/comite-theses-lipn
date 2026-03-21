# Système de Gestion du Comité des Thèses (LIPN)

## Présentation
]Ce projet consiste en la conception et le développement d'une application web centralisée pour le comité des thèses du laboratoire LIPN. L'objectif est de remplacer le suivi actuel par courriels et documents épars afin d'améliorer la visibilité, la traçabilité et la gestion des responsabilités.

## Objectifs du projet
* Centraliser l'ensemble des informations relatives au fonctionnement du comité.
* Gérer les membres, les mandats et les activités tout en conservant l'historique des données.
* Analyser la répartition de la charge de travail entre les membres via des indicateurs de pilotage.
* Offrir une solution sécurisée et adaptée aux besoins spécifiques du laboratoire.

## Étude Fonctionnelle
Le système distingue deux profils d'utilisateurs principaux :

### Administrateur
* Gestion complète des membres et des mandats.
* Création et affectation des activités (évaluations de thèses, CSI, auditions annuelles).
* Accès aux tableaux de bord et aux statistiques globales.

### Membre du comité
* Consultation des activités assignées.
* Mise à jour de l'état d'avancement des tâches.
* Dépôt des documents et rapports scientifiques associés.

## Architecture et Données
Le projet s'appuie sur une architecture API REST avec les interactions suivantes :
* **Backend** : Gestion des requêtes via une API (ex: POST /activites pour la création, PUT /activites/{id} pour la mise à jour).
* **Modèle de données** : Structuré autour des entités Membre, Mandat, Activité, CSI et Affectation.
