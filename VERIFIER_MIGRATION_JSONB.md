# 🔍 Vérification : Migration JSONB a-t-elle été exécutée ?

## ⚠️ Problème identifié

Les options sont vides car la **migration JSONB n'a probablement pas été exécutée** dans Supabase.

## 🔍 Diagnostic

Les logs montrent que `options` est un tableau vide. Cela signifie que :
1. Soit la migration `migration_localization_jsonb.sql` n'a pas été exécutée
2. Soit les données sont encore au format ancien (array simple au lieu d'objet avec clés de langue)

## ✅ Solution : Vérifier et exécuter la migration

### Étape 1 : Vérifier le format actuel dans Supabase

Exécutez cette requête dans l'éditeur SQL de Supabase :

```sql
-- Vérifier le format des options
SELECT 
  id,
  jsonb_typeof(options) as options_type,
  options,
  CASE 
    WHEN jsonb_typeof(options) = 'array' THEN 'ANCIEN FORMAT (array)'
    WHEN jsonb_typeof(options) = 'object' THEN 'NOUVEAU FORMAT (object avec clés)'
    ELSE 'FORMAT INCONNU'
  END as format_status
FROM fc_questions
LIMIT 5;
```

### Étape 2 : Si le format est "array" (ancien format)

**La migration n'a pas été exécutée.** Exécutez le script de migration :

1. Ouvrir **Supabase Dashboard** → **SQL Editor**
2. Copier le contenu de `database/migration_localization_jsonb.sql`
3. Exécuter le script

### Étape 3 : Vérifier après migration

```sql
-- Vérifier que le format est maintenant "object"
SELECT 
  id,
  jsonb_typeof(options) as options_type,
  options ? 'fr' as has_fr,
  options ? 'en' as has_en,
  options ? 'ar' as has_ar,
  jsonb_array_length(options->'fr') as fr_options_count
FROM fc_questions
LIMIT 5;
```

## 📝 Format attendu après migration

**Avant migration (ancien format) :**
```json
["Option 1", "Option 2", "Option 3", "Option 4"]
```

**Après migration (nouveau format) :**
```json
{
  "fr": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "en": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "ar": ["الخيار 1", "الخيار 2", "الخيار 3", "الخيار 4"]
}
```

## 🚨 Important

**La migration DOIT être exécutée** pour que le système de localisation fonctionne correctement.

Après exécution de la migration, les options devraient s'afficher correctement, même si les traductions AR ne sont pas encore ajoutées (le fallback sur FR fonctionnera).
