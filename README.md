# Formations Civiques 2026

Plateforme de préparation à l'examen de formation civique officiel 2026. Application Next.js avec support multilingue, authentification Supabase, et simulation d'examen complète.

## 🚀 Technologies

- **Next.js 14** (Pages Router)
- **TypeScript** (mode strict)
- **Tailwind CSS** + **Shadcn/ui**
- **Supabase** (PostgreSQL + Auth)
- **next-i18next** (Multilingue FR/EN)
- **Resend** (Emails)
- **Stripe** (Paiements premium)
- **Sentry** (Observabilité)
- **PostHog** (Analytics)

## 📋 Prérequis

- Node.js 20.x ou 22.x
- Compte Supabase
- Compte Resend (optionnel)
- Compte Stripe (optionnel)

## 🛠️ Installation

1. Cloner le repository
```bash
git clone <repository-url>
cd FORMATIONS-CIVIQUES-2026
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer les variables d'environnement
```bash
# Créer .env.local avec vos clés Supabase
# Voir ENV_TEMPLATE.md pour le template complet
```

4. Exécuter le schéma SQL dans Supabase Dashboard
```bash
# Copier database/schema.sql dans Supabase SQL Editor
```

5. Lancer le serveur de développement
```bash
npm run dev
```

> 📖 **Démarrage rapide** : Voir [QUICK_START.md](./QUICK_START.md) pour un guide étape par étape avec vos clés Supabase.

## 📁 Structure du projet

```
formations-civiques-2026/
├── src/
│   ├── components/        # Composants React
│   │   ├── ui/           # Composants Shadcn
│   │   └── features/     # Composants métier
│   ├── hooks/            # Hooks personnalisés
│   ├── lib/              # Utilitaires et config
│   ├── pages/            # Pages Next.js
│   ├── providers/        # Context Providers
│   ├── services/         # Services API
│   └── types/            # Types TypeScript
├── public/
│   └── locales/          # Fichiers de traduction i18n
├── database/              # Schémas SQL Supabase
└── prisma/                # Schéma Prisma (référence)
```

## 🗄️ Base de données

Les tables sont préfixées `fc_` pour isolation :
- `fc_profiles` : Profils utilisateurs
- `fc_questions` : Questions d'examen (800+)
- `fc_user_progress` : Progression utilisateur
- `fc_exam_results` : Résultats d'examens

Exécuter le script SQL dans Supabase Dashboard :
```bash
database/schema.sql
```

## 🌍 Internationalisation

L'application supporte le français (défaut) et l'anglais. Les traductions sont dans `public/locales/{locale}/`.

## 🧪 Tests

```bash
# Tests unitaires
npm run test:unit

# Tests E2E
npm run test:e2e
```

## 📦 Déploiement

Voir `DEPLOYMENT.md` pour les instructions de déploiement sur Render.

## 📝 Licence

© 2024 République Française. Tous droits réservés.
