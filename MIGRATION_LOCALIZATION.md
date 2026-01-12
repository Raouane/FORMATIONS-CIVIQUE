# Migration vers Localisation JSONB

Ce document explique comment migrer la base de données pour supporter plusieurs langues avec JSONB.

## 📋 Vue d'ensemble

La migration transforme les colonnes textuelles (`content`, `scenario_context`, `explanation`) et la colonne `options` (déjà JSONB) en objets JSONB avec des clés de langue.

### Structure avant :
```sql
content TEXT
scenario_context TEXT
options JSONB  -- Array: ["option1", "option2", ...]
explanation TEXT
```

### Structure après :
```sql
content JSONB  -- Object: {"fr": "...", "en": "...", "ar": "..."}
scenario_context JSONB  -- Object: {"fr": "...", "en": "...", "ar": "..."}
options JSONB  -- Object: {"fr": ["option1", ...], "en": ["option1", ...], ...}
explanation JSONB  -- Object: {"fr": "...", "en": "...", "ar": "..."}
```

## 🚀 Étapes de migration

### 1. Exécuter le script SQL

1. Ouvrez le **Supabase Dashboard**
2. Allez dans **SQL Editor**
3. Copiez-collez le contenu de `database/migration_localization_jsonb.sql`
4. Exécutez le script

⚠️ **IMPORTANT** : Le script migre automatiquement toutes les données existantes en créant des objets JSONB avec la clé `'fr'`.

### 2. Vérifier la migration

Après l'exécution, vérifiez qu'une question a bien la nouvelle structure :

```sql
SELECT 
  id,
  content,
  options,
  explanation
FROM fc_questions
LIMIT 1;
```

Vous devriez voir :
```json
{
  "content": {"fr": "Quelle est la devise de la République ?"},
  "options": {"fr": ["Option 1", "Option 2", "Option 3", "Option 4"]},
  "explanation": {"fr": "La devise est..."}
}
```

### 3. Ajouter des traductions

Pour ajouter une traduction anglaise à une question existante :

```sql
UPDATE fc_questions
SET 
  content = content || '{"en": "What is the motto of the Republic?"}'::jsonb,
  options = options || '{"en": ["Option 1", "Option 2", "Option 3", "Option 4"]}'::jsonb,
  explanation = explanation || '{"en": "The motto is..."}'::jsonb
WHERE id = 'votre-question-id';
```

## 🔧 Utilisation dans le code

### Service de questions

Le service `questionService` extrait automatiquement les traductions selon la locale :

```typescript
// Récupère les questions en français (par défaut)
const questions = await questionService.getQuestionsForExam(UserLevel.A2);

// Récupère les questions en anglais
const questions = await questionService.getQuestionsForExam(UserLevel.A2, false, 'en');
```

### Composants

Les composants utilisent automatiquement la locale du router Next.js :

```typescript
// Dans QuestionCard.tsx
const router = useRouter();
const locale = router.locale || 'fr'; // Utilisé automatiquement par le service
```

## 📝 Ajout de nouvelles langues

Pour ajouter une nouvelle langue (ex: Arabe) :

1. **Mettre à jour le type TypeScript** :
```typescript
// src/lib/localization.ts
export type SupportedLocale = 'fr' | 'en' | 'ar';
```

2. **Ajouter la contrainte dans la base** :
```sql
ALTER TABLE fc_profiles 
DROP CONSTRAINT IF EXISTS fc_profiles_preferred_language_check;

ALTER TABLE fc_profiles 
ADD CONSTRAINT fc_profiles_preferred_language_check 
CHECK (preferred_language IN ('fr', 'en', 'ar'));
```

3. **Traduire les questions** (voir section "Ajouter des traductions" ci-dessus)

## 🎯 Fonctions PostgreSQL utiles

Le script de migration crée deux fonctions helper :

### `get_localized_text(jsonb_field, locale)`
Extrait un texte dans une langue avec fallback sur 'fr' :

```sql
SELECT get_localized_text(content, 'en') as content_en
FROM fc_questions;
```

### `get_localized_array(jsonb_field, locale)`
Extrait un array dans une langue avec fallback sur 'fr' :

```sql
SELECT get_localized_array(options, 'en') as options_en
FROM fc_questions;
```

## ⚠️ Notes importantes

1. **Fallback automatique** : Si une traduction n'existe pas pour une langue, le système utilise automatiquement le français.

2. **Performance** : Les index GIN créés sur les colonnes JSONB permettent des recherches rapides.

3. **Compatibilité** : Le code gère automatiquement l'ancien format (string/array) et le nouveau format (JSONB object) pour une transition en douceur.

4. **Migration des données** : Toutes les données existantes sont automatiquement converties avec la clé `'fr'`.

## 🔍 Vérification post-migration

Après la migration, testez :

1. ✅ Les questions s'affichent correctement en français
2. ✅ Le changement de langue fonctionne (si des traductions EN existent)
3. ✅ Les options sont bien des arrays
4. ✅ Les explications s'affichent correctement

## 📚 Ressources

- [Documentation PostgreSQL JSONB](https://www.postgresql.org/docs/current/datatype-json.html)
- [Supabase JSONB Guide](https://supabase.com/docs/guides/database/extensions/full-text-search)
