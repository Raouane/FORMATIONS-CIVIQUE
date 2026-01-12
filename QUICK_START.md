# 🚀 Démarrage Rapide

> 📖 **Pour finaliser la connexion DB** : Voir [FINALISER_DB.md](./FINALISER_DB.md) pour un guide étape par étape détaillé.

## Configuration en 3 étapes

### 1. Créer le fichier `.env.local`

Copiez le contenu suivant dans un fichier `.env.local` à la racine du projet :

```env
# Supabase (déjà configuré avec vos clés)
NEXT_PUBLIC_SUPABASE_URL=https://lqdfioptcptinnxqshrj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_SVOkmGcIU9EkNqLqCeMBzg_7IN4ZEpl

# ⚠️ Note : La variable doit être NEXT_PUBLIC_SUPABASE_ANON_KEY (pas PUBLISHABLE_DEFAULT_KEY)

# Supabase Service Role Key
# À récupérer dans Supabase Dashboard → Settings → API → service_role key
SUPABASE_SERVICE_ROLE_KEY=votre-service-role-key

# Supabase Connection Pooler (pour production)
# Remplacez [YOUR-PASSWORD] par votre mot de passe de base de données
SUPABASE_DB_URL_POOLER=postgresql://postgres.lqdfioptcptinnxqshrj:[YOUR-PASSWORD]@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?sslmode=require

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Exécuter le schéma SQL dans Supabase

1. Ouvrir [Supabase Dashboard](https://supabase.com/dashboard)
2. Sélectionner votre projet `lqdfioptcptinnxqshrj`
3. Aller dans **SQL Editor**
4. Copier le contenu de `database/schema.sql`
5. Exécuter le script

> ✅ **Isolation garantie** : Toutes les tables sont préfixées `fc_` pour ne pas interférer avec vos autres applications.

### 3. Vérifier et lancer

```bash
# Vérifier la connexion
npm run db:check

# Lancer l'application
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📝 Récupérer les clés manquantes

### Service Role Key
1. Supabase Dashboard → **Settings** → **API**
2. Copier la **service_role key** (⚠️ gardez-la secrète, ne la commitez jamais)

### Mot de passe de la base de données
1. Supabase Dashboard → **Settings** → **Database**
2. Si vous ne connaissez pas le mot de passe, cliquez sur **Reset database password**
3. Copiez le nouveau mot de passe et remplacez `[YOUR-PASSWORD]` dans `.env.local`

## ✅ Vérification

Après avoir configuré `.env.local` et exécuté le schéma SQL :

```bash
npm run db:check
```

Vous devriez voir :
```
✅ Connexion à Supabase réussie
✅ Table fc_profiles existe (0 enregistrements)
✅ Table fc_questions existe (0 enregistrements)
✅ Table fc_user_progress existe (0 enregistrements)
✅ Table fc_exam_results existe (0 enregistrements)
```

## 🎯 Prochaines étapes

1. **Injecter les questions** : `npm run seed` (après création du script)
2. **Tester l'application** : `npm run dev`
3. **Créer les icônes PWA** : `public/icon-192.png` et `public/icon-512.png`

## 📚 Documentation complète

- [Guide de configuration complet](./SETUP.md)
- [Isolation base de données](./database/ISOLATION.md)
- [Configuration PWA](./PWA.md)
