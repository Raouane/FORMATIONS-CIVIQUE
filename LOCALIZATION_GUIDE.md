# Guide de Localisation avec JSONB

## 📋 Vue d'ensemble

Ce guide explique comment utiliser le système de localisation JSONB pour traduire le contenu dynamique de la base de données (questions, réponses, explications).

## 🏗️ Architecture

### Structure JSONB

Chaque champ localisé est un objet JSONB avec des clés de langue :

```json
{
  "fr": "Quelle est la devise de la République ?",
  "en": "What is the motto of the Republic?",
  "ar": "ما هو شعار الجمهورية؟"
}
```

### Champs concernés

- `content` : Le texte de la question
- `scenario_context` : Le contexte de mise en situation (pour les questions SITUATION)
- `options` : Les 4 options de réponse (array par langue)
- `explanation` : L'explication de la bonne réponse

## 🚀 Utilisation

### 1. Migration de la base de données

**IMPORTANT** : Exécutez d'abord le script de migration :

```sql
-- Dans Supabase Dashboard > SQL Editor
-- Copiez-collez le contenu de database/migration_localization_jsonb.sql
```

Ce script :
- ✅ Convertit automatiquement toutes les données existantes en JSONB avec la clé `'fr'`
- ✅ Ajoute la colonne `preferred_language` à `fc_profiles`
- ✅ Crée des fonctions helper PostgreSQL
- ✅ Ajoute des index GIN pour les performances

### 2. Ajouter des traductions

#### Méthode 1 : Via SQL (recommandé pour plusieurs questions)

```sql
-- Ajouter une traduction anglaise à une question
UPDATE fc_questions
SET 
  content = content || '{"en": "What is the motto?"}'::jsonb,
  options = options || '{"en": ["Option 1", "Option 2", "Option 3", "Option 4"]}'::jsonb,
  explanation = explanation || '{"en": "The explanation..."}'::jsonb
WHERE id = 'question-id';
```

#### Méthode 2 : Via l'interface Supabase

1. Allez dans **Table Editor** > `fc_questions`
2. Cliquez sur une question
3. Modifiez les colonnes JSONB directement :
   ```json
   {
     "fr": "Texte français",
     "en": "English text"
   }
   ```

### 3. Utilisation dans le code

Le système extrait automatiquement les traductions selon la locale du router Next.js :

```typescript
// Dans un composant
const router = useRouter();
const locale = router.locale || 'fr'; // 'fr', 'en', 'ar'

// Le service extrait automatiquement la bonne traduction
const questions = await questionService.getQuestionsForExam(UserLevel.A2, false, locale);
```

### 4. Fallback automatique

Si une traduction n'existe pas pour une langue, le système utilise automatiquement le français :

```typescript
// Si la question n'a que 'fr', elle sera affichée même si locale = 'en'
const question = await questionService.getQuestionById(questionId, 'en');
// → Retourne la version française si 'en' n'existe pas
```

## 📝 Exemples pratiques

### Exemple 1 : Ajouter une traduction complète

```sql
UPDATE fc_questions
SET 
  content = content || '{"en": "What is the motto of the French Republic?"}'::jsonb,
  options = options || '{"en": [
    "Liberty, Equality, Fraternity",
    "God, King, Country", 
    "Work, Family, Fatherland",
    "Freedom, Justice, Peace"
  ]}'::jsonb,
  explanation = explanation || '{"en": "The motto 'Liberty, Equality, Fraternity' is a symbol of the Republic inscribed in the Constitution."}'::jsonb,
  scenario_context = CASE 
    WHEN scenario_context IS NOT NULL THEN 
      scenario_context || '{"en": "You are in a public service office."}'::jsonb
    ELSE NULL
  END
WHERE id = 'votre-question-id';
```

### Exemple 2 : Traduire toutes les questions d'un thème

```sql
-- ATTENTION : Testez d'abord sur une question avant d'appliquer à toutes
UPDATE fc_questions
SET 
  content = content || jsonb_build_object('en', 'EN: ' || (content->>'fr')),
  options = options || jsonb_build_object('en', options->'fr'),
  explanation = explanation || jsonb_build_object('en', 'EN: ' || (explanation->>'fr'))
WHERE theme = 'VALEURS' 
  AND NOT (content ? 'en'); -- Seulement si EN n'existe pas
```

### Exemple 3 : Vérifier les traductions

```sql
-- Voir toutes les questions avec leurs traductions
SELECT 
  id,
  theme,
  content->>'fr' as content_fr,
  content->>'en' as content_en,
  CASE 
    WHEN content ? 'en' THEN '✅'
    ELSE '❌'
  END as has_en_translation
FROM fc_questions
ORDER BY theme;
```

## 🔧 Fonctions PostgreSQL utiles

### `get_localized_text(jsonb_field, locale)`

Extrait un texte avec fallback :

```sql
SELECT 
  get_localized_text(content, 'en') as content_en,
  get_localized_text(content, 'fr') as content_fr
FROM fc_questions;
```

### `get_localized_array(jsonb_field, locale)`

Extrait un array avec fallback :

```sql
SELECT 
  get_localized_array(options, 'en') as options_en
FROM fc_questions;
```

## ⚠️ Bonnes pratiques

1. **Toujours garder 'fr'** : Le français est la langue de fallback obligatoire
2. **Vérifier avant d'ajouter** : Utilisez `content ? 'en'` pour vérifier si une traduction existe
3. **Cohérence** : Si vous traduisez `content`, traduisez aussi `options` et `explanation`
4. **Tests** : Testez toujours sur une question avant d'appliquer à toutes

## 🎯 Workflow recommandé

1. **Migration** : Exécutez `migration_localization_jsonb.sql`
2. **Vérification** : Vérifiez que les données sont bien converties
3. **Traduction** : Ajoutez les traductions progressivement (commencez par quelques questions)
4. **Test** : Testez l'affichage avec différentes langues
5. **Déploiement** : Une fois validé, traduisez le reste

## 📚 Ressources

- Script de migration : `database/migration_localization_jsonb.sql`
- Exemples SQL : `database/example_add_translation.sql`
- Guide de migration : `MIGRATION_LOCALIZATION.md`
- Code TypeScript : `src/lib/localization.ts`
