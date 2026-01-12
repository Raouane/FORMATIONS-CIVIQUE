# Guide de Seeding des Questions avec JSONB

Ce guide explique comment importer vos questions dans la base de données au format JSONB localisé.

## 📋 Prérequis

1. **Migration exécutée** : Assurez-vous d'avoir exécuté `database/migration_localization_jsonb.sql` dans Supabase
2. **Variables d'environnement** : Vérifiez que `.env.local` contient :
   ```env
   NEXT_PUBLIC_SUPABASE_URL=votre-url
   SUPABASE_SERVICE_ROLE_KEY=votre-service-role-key
   ```

## 🚀 Méthode 1 : Import depuis CSV (Recommandé)

### Étape 1 : Préparer le fichier CSV

Utilisez le modèle `database/questions_template.csv` comme référence.

**Structure du CSV :**

```csv
theme,type,level,complexity_level,content_fr,content_en,option1_fr,option1_en,option2_fr,option2_en,option3_fr,option3_en,option4_fr,option4_en,correct_answer,explanation_fr,explanation_en,is_premium
VALEURS,CONNAISSANCE,A2,A2,"Quelle est la devise?","What is the motto?","Option 1 FR","Option 1 EN","Option 2 FR","Option 2 EN","Option 3 FR","Option 3 EN","Option 4 FR","Option 4 EN",0,"Explication FR","Explanation EN",false
```

**Colonnes obligatoires :**
- `theme`, `type`, `level`, `complexity_level`
- `content_fr` (minimum requis)
- `option1_fr`, `option2_fr`, `option3_fr`, `option4_fr`
- `correct_answer` (0-3)
- `explanation_fr`
- `is_premium` (true/false)

**Colonnes optionnelles (traductions) :**
- `content_en`, `content_ar`
- `option1_en`, `option2_en`, `option3_en`, `option4_en` (tous ensemble ou aucun)
- `option1_ar`, `option2_ar`, `option3_ar`, `option4_ar`
- `scenario_context_fr`, `scenario_context_en`, `scenario_context_ar`
- `explanation_en`, `explanation_ar`

### Étape 2 : Exécuter l'import

```bash
npm run seed:jsonb -- --csv=database/questions.csv
```

## 🚀 Méthode 2 : Import depuis JSON

### Étape 1 : Préparer le fichier JSON

Créez un fichier `database/questions.json` avec cette structure :

```json
[
  {
    "theme": "VALEURS",
    "type": "CONNAISSANCE",
    "level": "A2",
    "complexity_level": "A2",
    "content": {
      "fr": "Quelle est la devise de la République française?",
      "en": "What is the motto of the French Republic?"
    },
    "scenario_context": null,
    "options": {
      "fr": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "en": ["Option 1", "Option 2", "Option 3", "Option 4"]
    },
    "correct_answer": 0,
    "explanation": {
      "fr": "Explication en français...",
      "en": "Explanation in English..."
    },
    "is_premium": false
  }
]
```

### Étape 2 : Exécuter l'import

```bash
npm run seed:jsonb -- --json=database/questions.json
```

## 📝 Exemple complet : Les 40 questions officielles

Pour importer les 40 questions que nous avons préparées, vous pouvez :

1. **Créer un fichier CSV** avec toutes les questions
2. **Ou convertir le script existant** `src/scripts/seed-questions.ts` pour générer le format JSONB

### Script de conversion automatique

Le script `seed-questions-jsonb.ts` convertit automatiquement :
- Les strings simples → objets JSONB avec clé `'fr'`
- Les arrays simples → objets JSONB avec clé `'fr'`
- Les colonnes CSV avec suffixes `_fr`, `_en`, `_ar` → objets JSONB complets

## ⚠️ Notes importantes

1. **Service Role Key requise** : Le script utilise `SUPABASE_SERVICE_ROLE_KEY` pour bypasser les RLS
2. **Validation** : Le script valide que les champs obligatoires sont présents
3. **Fallback** : Si une traduction n'existe pas, seul le français sera utilisé
4. **Doublons** : Le script n'évite pas les doublons - vérifiez avant d'importer

## 🔍 Vérification post-import

Après l'import, vérifiez dans Supabase :

```sql
-- Vérifier le nombre de questions
SELECT COUNT(*) FROM fc_questions;

-- Vérifier la structure JSONB
SELECT 
  id,
  theme,
  content->>'fr' as content_fr,
  content->>'en' as content_en,
  jsonb_array_length(options->'fr') as nb_options_fr
FROM fc_questions
LIMIT 5;
```

## 📚 Ressources

- Modèle CSV : `database/questions_template.csv`
- Script de seeding : `src/scripts/seed-questions-jsonb.ts`
- Guide de migration : `MIGRATION_LOCALIZATION.md`
