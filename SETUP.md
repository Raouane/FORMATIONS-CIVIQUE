# Guide de Configuration

## 🚀 Installation rapide

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configurer les variables d'environnement

Créer un fichier `.env.local` à la racine du projet avec :

```env
# Supabase (OBLIGATOIRE)
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anon

# Supabase Service Role (pour les routes API)
SUPABASE_SERVICE_ROLE_KEY=votre-service-role-key

# Supabase Connection Pooler (pour production)
# Option 1 : Pooler Supavisor (port 6543) - Recommandé pour Render
SUPABASE_DB_URL_POOLER=postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?sslmode=require
# Option 2 : Pooler standard (port 5432) - Alternative
# SUPABASE_DB_URL_POOLER=postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-1-eu-west-1.pooler.supabase.com:5432/postgres?sslmode=require

# Resend (optionnel - pour les emails)
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@formations-civiques.fr

# Sentry (optionnel - pour l'observabilité)
SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx

# PostHog (optionnel - pour l'analytics)
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Stripe (optionnel - pour les paiements premium)
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Configurer Supabase

#### a) Utiliser un projet Supabase existant

> **Note importante** : Cette application utilise le préfixe `fc_` pour toutes ses tables, ce qui permet de partager une base de données Supabase existante sans conflit avec d'autres applications. Voir [database/ISOLATION.md](./database/ISOLATION.md) pour plus de détails.

1. Utiliser un projet Supabase existant (plan gratuit ou payant)
2. Noter l'URL et les clés API dans **Settings** → **API**

#### b) Exécuter le schéma SQL

1. Ouvrir **SQL Editor** dans Supabase Dashboard
2. Copier le contenu de `database/schema.sql`
3. Exécuter le script

#### c) Vérifier la configuration

```bash
npm run db:check
```

Ce script vérifie :
- ✅ La connexion à Supabase
- ✅ L'existence des 4 tables
- ✅ Le nombre d'enregistrements

### 4. Lancer l'application

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📝 Commandes disponibles

```bash
# Développement
npm run dev              # Lancer le serveur de développement
npm run build            # Construire pour la production
npm run start            # Lancer le serveur de production

# Base de données
npm run db:check         # Vérifier la connexion et les tables
npm run seed             # Injecter les questions (après création du script)

# Tests
npm run test:unit        # Tests unitaires
npm run test:e2e         # Tests end-to-end
npm run test:watch       # Tests en mode watch

# Qualité
npm run lint             # Linter le code
npm run type-check       # Vérifier les types TypeScript
```

## 🔧 Dépannage

### Erreur "Variables d'environnement Supabase manquantes"

Vérifiez que `.env.local` existe et contient :
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Erreur "Table n'existe pas"

Exécutez `database/schema.sql` dans Supabase Dashboard → SQL Editor

### Erreur "tsx n'est pas reconnu"

Exécutez `npm install` pour installer les dépendances

## 📚 Documentation

- [Base de données](./database/README.md)
- [Déploiement](./DEPLOYMENT.md) (à venir)
