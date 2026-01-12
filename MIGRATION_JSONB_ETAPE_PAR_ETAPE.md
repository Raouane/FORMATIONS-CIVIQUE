# 🔧 Migration JSONB - Guide étape par étape

## ⚠️ Erreur rencontrée

```
ERROR: 23514: check constraint "options_has_fr" of relation "fc_questions" is violated by some row
```

Cela signifie que certaines questions ont des options invalides (NULL, vides, ou format incorrect).

## ✅ Solution : Migration en 3 étapes

### ÉTAPE 1 : Nettoyer les données invalides

Exécutez d'abord `database/fix_invalid_options.sql` dans Supabase SQL Editor :

```sql
-- Ce script va :
-- 1. Identifier les questions problématiques
-- 2. Les corriger ou les supprimer
-- 3. Vérifier que tout est OK
```

### ÉTAPE 2 : Exécuter la migration sécurisée

Exécutez `database/migration_localization_jsonb_safe.sql` dans Supabase SQL Editor.

Cette version :
- ✅ Nettoie les données avant d'ajouter les contraintes
- ✅ Gère les différents formats (array, object, null)
- ✅ Ajoute les contraintes seulement à la fin
- ✅ Affiche des messages de diagnostic

### ÉTAPE 3 : Vérifier le résultat

```sql
-- Vérifier que toutes les questions ont le bon format
SELECT 
  COUNT(*) as total,
  COUNT(CASE WHEN jsonb_typeof(content) = 'object' AND content ? 'fr' THEN 1 END) as content_ok,
  COUNT(CASE WHEN jsonb_typeof(options) = 'object' AND options ? 'fr' THEN 1 END) as options_ok,
  COUNT(CASE WHEN jsonb_typeof(explanation) = 'object' AND explanation ? 'fr' THEN 1 END) as explanation_ok
FROM fc_questions;
```

Tous les compteurs doivent être égaux au total.

## 📝 Format attendu après migration

Chaque question doit avoir :

```json
{
  "content": {"fr": "Question en français"},
  "options": {"fr": ["Option 1", "Option 2", "Option 3", "Option 4"]},
  "explanation": {"fr": "Explication en français"}
}
```

## 🚨 Si vous avez encore des erreurs

1. **Vérifiez les questions problématiques** :
   ```sql
   SELECT id, options 
   FROM fc_questions 
   WHERE options IS NULL 
      OR (jsonb_typeof(options) = 'object' AND NOT (options ? 'fr'))
   LIMIT 10;
   ```

2. **Corrigez manuellement** ou supprimez ces questions si elles sont invalides

3. **Réessayez la migration**

## ✅ Après migration réussie

Rechargez la page de simulation et les options devraient s'afficher correctement !
