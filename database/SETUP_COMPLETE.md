# 🔧 Guide Complet : Finaliser la Connexion DB

## Étape 1 : Créer le fichier `.env.local`

Créez un fichier `.env.local` à la racine du projet avec ce contenu :

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://lqdfioptcptinnxqshrj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_SVOkmGcIU9EkNqLqCeMBzg_7IN4ZEpl

# Service Role Key (à récupérer dans Supabase Dashboard)
SUPABASE_SERVICE_ROLE_KEY=votre-service-role-key

# Connection Pooler (remplacez [YOUR-PASSWORD] par votre mot de passe DB)
SUPABASE_DB_URL_POOLER=postgresql://postgres.lqdfioptcptinnxqshrj:[YOUR-PASSWORD]@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?sslmode=require

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Étape 2 : Récupérer les clés manquantes

### A. Service Role Key

1. Aller sur [Supabase Dashboard](https://supabase.com/dashboard)
2. Sélectionner votre projet `lqdfioptcptinnxqshrj`
3. **Settings** → **API**
4. Dans la section "Project API keys", copier la **service_role key** (⚠️ gardez-la secrète)
5. Remplacez `votre-service-role-key` dans `.env.local`

### B. Mot de passe de la base de données

1. Supabase Dashboard → **Settings** → **Database**
2. Section "Database password"
3. Si vous ne connaissez pas le mot de passe :
   - Cliquez sur **Reset database password**
   - Copiez le nouveau mot de passe
4. Remplacez `[YOUR-PASSWORD]` dans `.env.local`

## Étape 3 : Exécuter le schéma SQL

1. Supabase Dashboard → **SQL Editor** (icône SQL dans la barre latérale)
2. Cliquez sur **New query**
3. Ouvrez le fichier `database/schema.sql` dans votre éditeur
4. **Copier TOUT le contenu** du fichier
5. **Coller** dans l'éditeur SQL de Supabase
6. Cliquez sur **Run** (ou Ctrl+Enter)

> ✅ **Important** : Le script crée les tables avec le préfixe `fc_` pour ne pas interférer avec vos autres applications.

## Étape 4 : Vérifier la connexion

```bash
npm run db:check
```

Vous devriez voir :
```
🔍 Vérification de la connexion à Supabase...

✅ Connexion à Supabase réussie

📊 Vérification des tables...

✅ Table fc_profiles existe (0 enregistrements)
✅ Table fc_questions existe (0 enregistrements)
✅ Table fc_user_progress existe (0 enregistrements)
✅ Table fc_exam_results existe (0 enregistrements)

📝 Instructions:
1. Si des tables n'existent pas, exécutez database/schema.sql dans Supabase Dashboard
2. Pour injecter des questions, exécutez: npm run seed
3. Vérifiez que les politiques RLS sont activées dans Supabase Dashboard
```

## Étape 5 : Vérifier les politiques RLS

1. Supabase Dashboard → **Authentication** → **Policies**
2. Vérifiez que ces politiques existent pour chaque table `fc_*` :
   - `Users can view own profile` (fc_profiles)
   - `Users can update own profile` (fc_profiles)
   - `Authenticated users can view non-premium questions` (fc_questions)
   - `Users can manage own progress` (fc_user_progress)
   - `Users can manage own exam results` (fc_exam_results)

## ✅ Connexion DB terminée !

Une fois ces étapes complétées, votre base de données est prête et isolée avec le préfixe `fc_`.

## 🧪 Test supplémentaire

Pour tester une requête réelle, vous pouvez créer un utilisateur de test dans Supabase Dashboard → **Authentication** → **Users** → **Add user**.
