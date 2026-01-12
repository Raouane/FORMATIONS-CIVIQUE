# 📋 Instructions : Créer la Table fc_revision_chapters

## ⚠️ Erreur Actuelle

```
Could not find the table 'public.fc_revision_chapters' in the schema cache
```

**Solution** : La table n'existe pas encore. Vous devez d'abord l'exécuter dans Supabase.

## ✅ Étapes à Suivre

### 1. Ouvrir Supabase Dashboard

1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet
3. Cliquez sur **SQL Editor** dans le menu de gauche

### 2. Exécuter le Script SQL

1. **Ouvrir le fichier** : `database/migration_add_revision_chapters_table.sql`
2. **Copier tout le contenu** du fichier
3. **Coller dans l'éditeur SQL** de Supabase
4. **Cliquer sur "Run"** (ou appuyer sur Ctrl+Enter)

### 3. Vérifier la Création

Exécutez cette requête pour vérifier :

```sql
SELECT COUNT(*) FROM fc_revision_chapters;
-- Doit retourner 0 (table vide mais créée)
```

### 4. Relancer la Migration

Une fois la table créée, relancez :

```bash
npm run migrate:revision
```

## 📝 Contenu du Script SQL

Le script `migration_add_revision_chapters_table.sql` contient :
- ✅ Création de la table `fc_revision_chapters`
- ✅ Index pour performances
- ✅ Fonctions PostgreSQL pour récupérer les chapitres localisés
- ✅ RLS (Row Level Security) configuré
- ✅ Trigger pour `updated_at`

## 🚀 Après la Création

Une fois la table créée, vous pourrez :
1. ✅ Migrer les chapitres : `npm run migrate:revision`
2. ✅ Voir les chapitres dans Supabase Dashboard → Table Editor
3. ✅ Modifier le contenu directement dans Supabase
4. ✅ La page `/revision` chargera depuis la BD
