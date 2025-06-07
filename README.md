# WorkNest Frontend

Interface utilisateur moderne et intuitive pour WorkNest, une plateforme complète de gestion de projets et de collaboration en entreprise. Construit avec React et Vite.

## Technologies utilisées

- React 18
- Vite
- Tailwind CSS pour le design moderne et responsive
- Socket.IO Client pour la communication en temps réel
- Axios pour les requêtes HTTP
- React Router DOM pour la navigation
- React Icons pour les icônes
- React Query pour la gestion des données
- React Hook Form pour la gestion des formulaires
- React Toastify pour les notifications
- React Calendar pour la gestion des événements
- React DnD pour le drag-and-drop
- Chart.js pour les visualisations de données

## Prérequis

- Node.js (v16 ou supérieur)
- npm ou yarn
- Un serveur backend WorkNest en cours d'exécution

## Configuration

1. Clonez le repository
2. Installez les dépendances :
```bash
npm install
```

3. Créez un fichier `.env` à la racine du projet avec les variables suivantes :
```env
VITE_BASE_URL_API=http://localhost:5000
VITE_BASE_URL_SOCKET=http://localhost:5000
```

## Scripts disponibles

### Développement
```bash
npm run dev
```
Lance le serveur de développement sur `http://localhost:5173`

### Build
```bash
npm run build
```
Crée une version optimisée pour la production dans le dossier `dist`

### Preview
```bash
npm run preview
```
Prévisualise la version de production localement

## Structure du projet

```
frontend/
├── src/
│   ├── components/     # Composants réutilisables
│   │   ├── common/     # Composants communs (boutons, inputs, etc.)
│   │   ├── layout/     # Composants de mise en page
│   │   └── features/   # Composants spécifiques aux fonctionnalités
│   ├── pages/         # Pages de l'application
│   │   ├── projects/   # Pages liées aux projets
│   │   ├── tasks/      # Pages liées aux tâches
│   │   ├── events/     # Pages liées aux événements
│   │   ├── admin/      # Pages d'administration
│   │   └── auth/       # Pages d'authentification
│   ├── partials/      # Composants partiels (header, footer, etc.)
│   ├── utils/         # Utilitaires et hooks personnalisés
│   │   ├── hooks/     # Hooks React personnalisés
│   │   ├── api/       # Services API
│   │   └── helpers/   # Fonctions utilitaires
│   ├── context/       # Contextes React
│   ├── assets/        # Images et autres ressources statiques
│   ├── styles/        # Styles globaux et thèmes
│   └── App.jsx        # Point d'entrée de l'application
├── public/            # Fichiers statiques
└── index.html         # Template HTML
```

## Modules principaux

### Gestion des Projets
- Vue d'ensemble des projets
- Création et édition de projets
- Filtrage et recherche de projets
- Gestion des membres du projet
- Suivi de l'avancement
- Documents et ressources

### Gestion des Tâches
- Liste des tâches personnelles
- Vue d'ensemble des tâches par responsable
- Création et assignation de tâches
- Suivi des priorités
- Filtrage par type et statut
- Gestion des dépendances

### Sollicitations
- Mes sollicitations
- Sollicitations par service
- Création de nouvelles sollicitations
- Suivi des statuts
- Notifications en temps réel

### Discussions et Messages
- Messagerie instantanée
- Discussions de projet
- Notifications de messages
- Indicateurs de frappe
- Pièces jointes
- Historique des conversations

### Événements et Calendrier
- Calendrier personnel
- Événements de service
- Calendrier de la société
- Création d'événements
- Rappels et notifications
- Catégorisation des événements

### Plans Stratégiques
- Vue d'ensemble des plans
- Création et suivi des plans
- Gestion des priorités
- Assignation des rôles
- Suivi des objectifs
- Rapports et analyses

### Administration
- Gestion des services
- Gestion des postes
- Gestion des positions
- Gestion des responsables
- Gestion des profils
- Configuration des rôles

## Fonctionnalités principales

- Interface responsive et moderne
- Navigation intuitive
- Thème clair/sombre
- Notifications en temps réel
- Drag-and-drop pour la gestion des tâches
- Filtres et recherche avancée
- Export de données
- Tableaux de bord personnalisables
- Gestion des documents
- Rapports et statistiques

## Développement

### Conventions de code

- Utilisation de composants fonctionnels avec hooks
- Nommage des composants en PascalCase
- Utilisation de Tailwind CSS pour le styling
- Gestion d'état avec React Context et hooks personnalisés
- Validation des formulaires avec React Hook Form
- Tests unitaires avec Jest et React Testing Library
- Documentation des composants avec Storybook

### Bonnes pratiques

- Tests unitaires pour les composants critiques
- Documentation des composants complexes
- Gestion des erreurs centralisée
- Optimisation des performances
- Code modulaire et réutilisable
- Accessibilité (WCAG 2.1)
- SEO friendly
- Internationalisation (i18n)

## Déploiement

1. Configurez les variables d'environnement pour la production
2. Exécutez le build :
```bash
npm run build
```
3. Déployez le contenu du dossier `dist` sur votre serveur web

## Support

Pour toute question ou problème, veuillez créer une issue sur le repository GitHub.

## Licence

Ce projet est propriétaire et confidentiel. Tous droits réservés.
