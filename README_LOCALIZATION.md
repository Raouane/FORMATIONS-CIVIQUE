# 🌍 Système de Localisation JSONB - Guide Complet

## 📋 Vue d'ensemble

Ce système permet de gérer plusieurs langues (FR, EN, AR) pour le contenu dynamique de la base de données (questions, réponses, explications) en utilisant le type **JSONB** de PostgreSQL.

## 🏗️ Architecture

### Principe

Au lieu de multiplier les tables ou colonnes, chaque champ localisé est un **objet JSONB** :

```json
{
  "fr": "Quelle est la devise ?",
  "en": "What is the motto?",
  "ar": "ما هو الشعار؟"
}
```

### Avantages

1. **Performance** : Index GIN pour recherches rapides
2. **Scalabilité** : Ajout de langues sans modification de schéma
3. **Flexibilité** : Traductions partielles possibles (fallback sur 'fr')
4. **Maintenabilité** : Code centralisé et réutilisable

## 🚀 Démarrage rapide

### 1. Migration de la base de données

```bash
# Dans Supabase Dashboard > SQL Editor
# Exécutez database/migration_localization_jsonb.sql
```

### 2. Vérification

```sql
SELECT 
  content->>'fr' as fr,
  content->>'en' as en
FROM fc_questions
LIMIT 1;
```

### 3. Import de questions

```bash
# Depuis CSV
npm run seed:jsonb -- --csv=database/questions.csv

# Depuis JSON
npm run seed:jsonb -- --json=database/questions.json
```

## 📝 Format des données

### Structure JSONB

```typescript
{
  content: {
    fr: "Question en français",
    en: "Question in English",
    ar: "سؤال بالعربية"
  },
  options: {
    fr: ["Option 1", "Option 2", "Option 3", "Option 4"],
    en: ["Option 1", "Option 2", "Option 3", "Option 4"],
    ar: ["خيار 1", "خيار 2", "خيار 3", "خيار 4"]
  },
  explanation: {
    fr: "Explication...",
    en: "Explanation...",
    ar: "شرح..."
  }
}
```

## 🔧 Utilisation dans le code

### Service de questions

```typescript
// Extraction automatique selon la locale du router
const questions = await questionService.getQuestionsForExam(UserLevel.A2);

// Ou spécifier explicitement
const questions = await questionService.getQuestionsForExam(UserLevel.A2, false, 'en');
```

### Composants

Les composants reçoivent déjà les textes extraits :

```typescript
// QuestionCard reçoit question.content (string) déjà traduit
<QuestionCard question={question} />
```

## 📊 Format CSV pour import

Utilisez `database/questions_template.csv` comme modèle :

```csv
theme,type,level,content_fr,content_en,option1_fr,option1_en,option2_fr,option2_en,correct_answer,explanation_fr,explanation_en,is_premium
VALEURS,CONNAISSANCE,A2,"Quelle est la devise?","What is the motto?","Option 1 FR","Option 1 EN","Option 2 FR","Option 2 EN",0,"Explication FR","Explanation EN",false
```

## ⚠️ Important

1. **Le français est obligatoire** : Toutes les questions doivent avoir au moins `content_fr`
2. **Fallback automatique** : Si une traduction n'existe pas, le français est utilisé
3. **Service Role Key** : Requise pour le seeding (bypass RLS)

## 📚 Documentation

- **Migration** : `MIGRATION_LOCALIZATION.md`
- **Utilisation** : `LOCALIZATION_GUIDE.md`
- **Seeding** : `SEEDING_GUIDE.md`
- **Résumé** : `IMPLEMENTATION_COMPLETE.md`

## 🎯 Prochaines étapes

1. ✅ Exécuter la migration SQL
2. ✅ Importer vos questions (CSV ou JSON)
3. ✅ Tester avec différentes langues
4. ✅ Ajouter des traductions progressivement

**Votre application est prête pour le multilingue !** 🚀
