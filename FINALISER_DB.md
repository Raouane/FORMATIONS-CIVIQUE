# 🔧 Finaliser la Connexion DB - Guide Étape par Étape

## ✅ Étape 1 : Créer le fichier `.env.local`

Créez un fichier `.env.local` à la racine du projet avec ce contenu :

```env
NEXT_PUBLIC_SUPABASE_URL=https://lqdfioptcptinnxqshrj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_SVOkmGcIU9EkNqLqCeMBzg_7IN4ZEpl
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Note** : Pour l'instant, ces 3 variables suffisent pour tester la connexion. Les autres (SERVICE_ROLE_KEY, DB_URL_POOLER) sont optionnelles pour le développement.

## ✅ Étape 2 : Exécuter le schéma SQL dans Supabase

### Instructions détaillées :

1. **Ouvrir Supabase Dashboard**
   - Aller sur [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Se connecter à votre compte
   - Sélectionner votre projet `lqdfioptcptinnxqshrj`

2. **Ouvrir SQL Editor**
   - Cliquer sur l'icône **SQL Editor** dans la barre latérale gauche
   - Cliquer sur **New query** (ou utiliser un onglet existant)

3. **Copier le schéma SQL**
   - Ouvrir le fichier `database/schema.sql` dans votre éditeur de code
   - **Sélectionner TOUT** le contenu (Ctrl+A)
   - **Copier** (Ctrl+C)

4. **Coller et exécuter**
   - **Coller** dans l'éditeur SQL de Supabase (Ctrl+V)
   - Cliquer sur le bouton **Run** (ou appuyer sur Ctrl+Enter)
   - Attendre que le script s'exécute (quelques secondes)

5. **Vérifier le résultat**
   - Vous devriez voir "Success. No rows returned" ou un message de succès
   - Si erreur, vérifiez le message d'erreur

## ✅ Étape 3 : Vérifier que les tables sont créées

Dans Supabase Dashboard :

1. Aller dans **Table Editor** (icône table dans la barre latérale)
2. Vérifier que vous voyez ces 4 nouvelles tables :
   - ✅ `fc_profiles`
   - ✅ `fc_questions`
   - ✅ `fc_user_progress`
   - ✅ `fc_exam_results`

> **Important** : Vos autres tables (sans préfixe `fc_`) doivent toujours être là. Le préfixe `fc_` garantit l'isolation.

## ✅ Étape 4 : Vérifier les politiques RLS

1. Supabase Dashboard → **Authentication** → **Policies**
2. Pour chaque table `fc_*`, vérifier qu'il y a des politiques :
   - `fc_profiles` : "Users can view own profile", "Users can update own profile"
   - `fc_questions` : "Authenticated users can view non-premium questions"
   - `fc_user_progress` : "Users can manage own progress"
   - `fc_exam_results` : "Users can manage own exam results"

## ✅ Étape 5 : Tester la connexion

Dans votre terminal, exécutez :

```bash
npm run db:check
```

### Résultat attendu :

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

## 🎯 Si tout est ✅ : Connexion DB terminée !

Votre base de données est maintenant configurée et prête à être utilisée.

## ❌ En cas de problème

### Erreur "Variables d'environnement manquantes"
- Vérifiez que `.env.local` existe à la racine du projet
- Vérifiez que les variables sont bien écrites (sans espaces, sans guillemets)

### Erreur "Table n'existe pas"
- Réexécutez `database/schema.sql` dans Supabase SQL Editor
- Vérifiez qu'il n'y a pas eu d'erreur lors de l'exécution

### Erreur de connexion
- Vérifiez que l'URL Supabase est correcte
- Vérifiez que la clé ANON est correcte
- Vérifiez votre connexion internet

## 📚 Documentation complète

- [Guide détaillé](./database/SETUP_COMPLETE.md)
- [Vérification](./database/VERIFICATION.md)
- [Isolation DB](./database/ISOLATION.md)
