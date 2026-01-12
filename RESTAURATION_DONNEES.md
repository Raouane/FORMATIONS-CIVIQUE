# 🔄 Guide de Restauration des 40 Questions

## Situation actuelle
Toutes les questions ont été supprimées lors de la migration JSONB. Il faut les réinsérer.

## ✅ Solution : Réinsérer via le script de seeding

### Option 1 : Utiliser le script TypeScript existant (Recommandé)

Le projet contient déjà un script de seeding : `src/scripts/seed-questions-jsonb.ts`

**Étapes :**

1. **Créer un fichier JSON avec les 40 questions** au format JSONB
   - Format attendu : `database/questions_40_complete.json`
   - Structure : Chaque question doit avoir `content`, `options`, `explanation`, `scenario_context` comme objets JSONB avec clés `fr`, `en`, `ar`

2. **Exécuter le script :**
   ```bash
   npm run seed:questions -- --json database/questions_40_complete.json
   ```

### Option 2 : Insertion directe SQL

Si vous préférez utiliser SQL directement dans Supabase :

1. **Exécuter** `database/seed_complete_40_questions.sql` (à compléter avec les 40 questions)
2. Ou utiliser le fichier JSON et le convertir en SQL

## 📋 Format JSONB attendu

Chaque question doit respecter ce format :

```json
{
  "theme": "VALEURS",
  "type": "CONNAISSANCE",
  "level": "A2",
  "complexity_level": "A2",
  "content": {
    "fr": "Question en français",
    "en": "Question in English",
    "ar": "السؤال بالعربية"
  },
  "scenario_context": null, // ou {"fr": "...", "en": "...", "ar": "..."}
  "options": {
    "fr": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "en": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "ar": ["الخيار 1", "الخيار 2", "الخيار 3", "الخيار 4"]
  },
  "correct_answer": 0,
  "explanation": {
    "fr": "Explication en français",
    "en": "Explanation in English",
    "ar": "شرح بالعربية"
  },
  "is_premium": false
}
```

## 🎯 Répartition des 40 questions (Conforme 2026)

- **Thème 1 (VALEURS)** : 11 questions (5 CONNAISSANCE + 6 SITUATION)
- **Thème 2 (DROITS)** : 11 questions (5 CONNAISSANCE + 6 SITUATION)
- **Thème 3 (HISTOIRE)** : 8 questions (8 CONNAISSANCE)
- **Thème 4 (POLITIQUE)** : 6 questions (6 CONNAISSANCE)
- **Thème 5 (SOCIETE)** : 4 questions (4 CONNAISSANCE)

**Total :** 28 CONNAISSANCE + 12 SITUATION = 40 questions

## ⚠️ Important

1. **Vérifier la structure** : Assurez-vous que la table `fc_questions` a bien les colonnes au format JSONB après la migration
2. **Service Role Key** : Le script utilise `SUPABASE_SERVICE_ROLE_KEY` pour bypasser les RLS
3. **Validation** : Après insertion, vérifiez avec :
   ```sql
   SELECT COUNT(*) FROM fc_questions;
   SELECT theme, type, COUNT(*) FROM fc_questions GROUP BY theme, type;
   ```

## 📝 Fichier JSON complet

Un fichier `database/questions_40_complete.json` avec les 11 premières questions a été créé comme exemple. Il faut le compléter avec les 29 questions restantes.

**Note :** Si vous avez les questions dans un autre format (CSV, Excel), utilisez le script `seed-questions-jsonb.ts` qui peut convertir automatiquement.
