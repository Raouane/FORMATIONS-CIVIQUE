# Base de données Supabase

## 🚀 Configuration initiale

### 1. Exécuter le schéma SQL

1. Ouvrir le **Supabase Dashboard**
2. Aller dans **SQL Editor**
3. Copier le contenu de `schema.sql`
4. Exécuter le script

### 2. Vérifier la connexion

```bash
npm run db:check
```

Ce script vérifie :
- ✅ La connexion à Supabase
- ✅ L'existence des 4 tables (`fc_profiles`, `fc_questions`, `fc_user_progress`, `fc_exam_results`)
- ✅ Le nombre d'enregistrements par table

### 3. Injecter les questions (optionnel)

```bash
npm run seed
```

## 📊 Structure des tables

### `fc_profiles`
Profils utilisateurs liés à `auth.users`
- `id` : UUID (référence auth.users)
- `email` : Email de l'utilisateur
- `objective` : Niveau cible (A2/B1/B2)
- `is_premium` : Statut premium

### `fc_questions`
Questions d'examen (800+ questions)
- `theme` : VALEURS, DROITS, HISTOIRE, POLITIQUE, SOCIETE
- `type` : CONNAISSANCE (28) ou SITUATION (12)
- `level` : A2, B1, B2
- `options` : JSON array de 4 options
- `correct_answer` : Index 0-3
- `is_premium` : Question premium ou non

### `fc_user_progress`
Progression et historique des réponses
- `user_id` + `question_id` : Relation unique
- `is_correct` : Dernière réponse correcte ou non
- `attempts` : Nombre de tentatives
- `next_review` : Date de révision suggérée

### `fc_exam_results`
Résultats des examens simulés
- `score` : Score sur 40
- `percentage` : Pourcentage
- `passed` : >= 80% (32/40)
- `questions_answered` : JSON avec détails des réponses

## 🔒 Sécurité (RLS)

Toutes les tables ont des politiques RLS activées :
- **fc_profiles** : Utilisateurs voient uniquement leur propre profil
- **fc_questions** : Questions non-premium visibles par tous, premium uniquement pour utilisateurs premium
- **fc_user_progress** : Utilisateurs gèrent uniquement leur propre progression
- **fc_exam_results** : Utilisateurs voient uniquement leurs propres résultats

## 🔧 Maintenance

### Vérifier les politiques RLS

Dans Supabase Dashboard → **Authentication** → **Policies**, vérifier que toutes les politiques sont actives.

### Réinitialiser la base de données

```sql
-- ATTENTION : Supprime toutes les données !
DROP TABLE IF EXISTS fc_exam_results CASCADE;
DROP TABLE IF EXISTS fc_user_progress CASCADE;
DROP TABLE IF EXISTS fc_questions CASCADE;
DROP TABLE IF EXISTS fc_profiles CASCADE;
```

Puis réexécuter `schema.sql`.
