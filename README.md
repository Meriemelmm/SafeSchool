<<<<<<< HEAD

SafeSchool is a web platform designed to improve safety and communication inside schools.  
It allows students, teachers, and administrators to report incidents, receive notifications in real-time, and manage school safety efficiently.
 lien de deployement frontend:https://safeschool-web.onrender.com/
 lien de deployement backend :https://safeschool-api.onrender.com/
=======
# SafeSchool

SafeSchool est une application de signalement sécurisée pour les établissements scolaires. Elle combine une interface web moderne avec une API NestJS pour permettre aux utilisateurs d’envoyer, consulter et suivre des signalements, des preuves et des notifications.

## Présentation du projet

- **Frontend** : `apps/web` — application Next.js pour l’interface utilisateur.
- **Backend** : `apps/api` — API NestJS pour gérer l’authentification, les signalements, les preuves, les notifications et les utilisateurs.
- **Packages partagés** : `packages/shared` contient les types, interfaces et enums réutilisés entre le backend et le frontend.

## Fonctionnalités principales

- Authentification utilisateur (connexion et gestion de rôles)
- Création et mise à jour de signalements
- Consultation des signalements personnels et de l’administration
- Ajout et gestion de preuves (upload de fichiers) liées aux signalements
- Gestion des membres impliqués dans un signalement
- Suivi du statut des signalements (nouveau, en cours, résolu)
- Notifications pour informer les utilisateurs des évolutions

## Pour le visiteur

Bienvenue sur le projet SafeSchool ! Voici comment découvrir l’application :

1. **Ouvrir l’application web**
   - Le frontend est disponible à l’adresse : `https://safeschool-web.onrender.com/`
2. **Tester les API**
   - Le backend est disponible à l’adresse : `https://safeschool-api.onrender.com/`
3. **Explorer les fonctionnalités**
   - Inscrire un nouvel utilisateur ou se connecter
   - Créer un signalement pour un incident ou une situation préoccupante
   - Ajouter des preuves et des membres concernés
   - Suivre le statut du signalement dans le tableau de bord

## Liens de déploiement

- Frontend : https://safeschool-web.onrender.com/
- Backend : https://safeschool-api.onrender.com/

## Structure du dépôt

- `apps/web` : application Next.js
- `apps/api` : API NestJS
- `packages/shared` : types, interfaces et enums partagés
- `docker-compose.yml` : orchestration éventuelle des services

## Technologie utilisée

- Next.js (TypeScript) pour le frontend
- NestJS (TypeScript) pour le backend
- MongoDB / Mongoose (probable d’après la structure du code)
- Authentification JWT et gestion des rôles
- Upload de fichiers pour les preuves

## Comment contribuer

1. Cloner le dépôt
2. Installer les dépendances
3. Lancer le backend et le frontend
4. Soumettre une Pull Request avec une description claire des changements

> Ce README est conçu pour aider un visiteur à comprendre rapidement l’objectif de SafeSchool, ses fonctionnalités et où trouver les versions déployées.
>>>>>>> de39f1b (ajout du fichier README.md avec la présentation du projet, ses fonctionnalités et les instructions pour contribuer)
