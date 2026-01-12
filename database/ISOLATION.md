# Isolation Base de Données - Utilisation d'une DB Supabase Partagée

## 🔒 Isolation par Préfixe `fc_`

Cette application utilise le **préfixe `fc_`** pour toutes ses tables afin de partager une base de données Supabase existante sans conflit avec d'autres applications.

## 📊 Tables Isolées

Toutes les tables de cette application sont préfixées `fc_` :

- ✅ `fc_profiles` - Profils utilisateurs
- ✅ `fc_questions` - Questions d'examen
- ✅ `fc_user_progress` - Progression utilisateur
- ✅ `fc_exam_results` - Résultats d'examens

## 🛡️ Sécurité (RLS)

Les politiques RLS (Row Level Security) garantissent que :

1. **Isolation par utilisateur** : Chaque utilisateur ne peut accéder qu'à ses propres données
2. **Isolation par application** : Les tables `fc_*` sont complètement isolées des autres tables de la base de données
3. **Pas de mélange** : Aucune interaction possible avec les tables d'autres applications

## ✅ Vérification de l'Isolation

### 1. Vérifier les tables existantes

Dans Supabase Dashboard → **Table Editor**, vous devriez voir :
- Vos tables existantes (sans préfixe `fc_`)
- Les nouvelles tables `fc_profiles`, `fc_questions`, `fc_user_progress`, `fc_exam_results`

### 2. Vérifier les politiques RLS

Dans Supabase Dashboard → **Authentication** → **Policies**, vérifier que les politiques suivantes existent :

- `Users can view own profile` (fc_profiles)
- `Users can update own profile` (fc_profiles)
- `Authenticated users can view non-premium questions` (fc_questions)
- `Users can manage own progress` (fc_user_progress)
- `Users can manage own exam results` (fc_exam_results)

### 3. Tester l'isolation

```sql
-- Vérifier que les tables fc_ existent
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'fc_%';

-- Vérifier que les politiques RLS sont actives
SELECT tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
AND tablename LIKE 'fc_%';
```

## 🔐 Bonnes Pratiques

1. **Ne jamais supprimer le préfixe `fc_`** : C'est la garantie d'isolation
2. **Vérifier les politiques RLS** : S'assurer qu'elles sont toujours actives
3. **Backup sélectif** : Si vous faites un backup, vous pouvez filtrer par préfixe :
   ```sql
   -- Exporter uniquement les tables fc_
   pg_dump -t 'fc_*' ...
   ```

## ⚠️ Important

- Les tables `fc_*` sont **complètement indépendantes** des autres tables
- Aucune foreign key vers des tables externes (sauf `auth.users` qui est standard Supabase)
- Les triggers et fonctions sont également préfixés ou isolés
- Les index sont préfixés `idx_` pour éviter les conflits

## 📝 Migration depuis une DB Dédiée

Si vous migrez depuis une base de données dédiée vers une base partagée :

1. **Renommer les tables** : Ajouter le préfixe `fc_`
2. **Mettre à jour les politiques RLS** : Vérifier qu'elles utilisent bien le nouveau nom
3. **Mettre à jour les triggers** : Vérifier qu'ils pointent vers les bonnes tables
4. **Tester** : Exécuter `npm run db:check` pour vérifier

## 🎯 Résumé

✅ **Isolation garantie** par le préfixe `fc_`  
✅ **Sécurité renforcée** par les politiques RLS  
✅ **Pas de conflit** avec d'autres applications  
✅ **Compatible** avec un plan Supabase gratuit partagé
