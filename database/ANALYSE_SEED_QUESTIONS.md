# 📊 Analyse du fichier `seed-questions.ts`

## Résultats de l'analyse

Le fichier `src/scripts/seed-questions.ts` contient **47 questions au total** (pas 120).

### Répartition actuelle :

| Niveau | CONNAISSANCE | SITUATION | Total | Manque CONNAISSANCE | Manque SITUATION | Total manquant |
|--------|--------------|-----------|-------|---------------------|------------------|----------------|
| **A2** | 15 | 8 | 23 | **13** | **4** | **17** |
| **B1** | 14 | 8 | 22 | **14** | **4** | **18** |
| **B2** | 2 | 0 | 2 | **26** | **12** | **38** |

### Total requis vs disponible :

- **Requis** : 120 questions (40 × 3 niveaux)
- **Disponible** : 47 questions
- **Manquant** : **73 questions**

## ⚠️ Problèmes identifiés

1. **A2** : Manque 13 CONNAISSANCE + 4 SITUATION = **17 questions**
2. **B1** : Manque 14 CONNAISSANCE + 4 SITUATION = **18 questions**
3. **B2** : Manque 26 CONNAISSANCE + 12 SITUATION = **38 questions** (presque tout manque)

## ✅ Solutions possibles

### Option 1 : Compléter le fichier `seed-questions.ts`

Ajouter les 73 questions manquantes directement dans le fichier TypeScript.

**Avantages :**
- Tout est dans un seul fichier
- Facile à maintenir
- Format TypeScript avec types

**Inconvénients :**
- Fichier très long (800+ lignes actuellement, deviendrait ~2000+ lignes)
- Plus difficile à lire

### Option 2 : Utiliser le fichier JSON et le compléter

Compléter `database/questions_40_complete.json` avec les 80 questions manquantes, puis utiliser le script `seed-questions-jsonb.ts`.

**Avantages :**
- Format JSON plus lisible
- Séparation des données et du code
- Facile à modifier

**Inconvénients :**
- Nécessite de compléter le JSON
- Format JSONB à respecter

### Option 3 : Créer les questions manquantes directement en base

Créer un script SQL pour insérer uniquement les questions manquantes.

**Avantages :**
- Rapide si vous avez déjà les questions
- Pas besoin de modifier les fichiers source

**Inconvénients :**
- Nécessite d'avoir les questions prêtes
- Moins maintenable

## 📝 Recommandation

**Je recommande l'Option 2** : Compléter le fichier JSON `database/questions_40_complete.json` car :
1. Le format JSON est plus lisible et facile à modifier
2. Le script `seed-questions-jsonb.ts` est déjà prêt
3. Vous pouvez ajouter les questions progressivement

## 🔍 Prochaines étapes

1. **Vérifier** si vous avez les 73 questions manquantes quelque part (document Word, Excel, autre fichier)
2. **Compléter** le fichier JSON avec les questions manquantes
3. **Exécuter** le script de seeding pour insérer toutes les questions
4. **Vérifier** avec `database/verification_questions_examen.sql` que tout est correct

## 📋 Format attendu pour chaque question

```json
{
  "theme": "VALEURS|DROITS|HISTOIRE|POLITIQUE|SOCIETE",
  "type": "CONNAISSANCE|SITUATION",
  "level": "A2|B1|B2",
  "complexity_level": "A2|B1|B2",
  "content": {
    "fr": "Question en français",
    "en": "Question in English",
    "ar": "السؤال بالعربية"
  },
  "scenario_context": null, // ou {"fr": "...", "en": "...", "ar": "..."} pour SITUATION
  "options": {
    "fr": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "en": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "ar": ["الخيار 1", "الخيار 2", "الخيار 3", "الخيار 4"]
  },
  "correct_answer": 0, // 0-3
  "explanation": {
    "fr": "Explication en français",
    "en": "Explanation in English",
    "ar": "شرح بالعربية"
  },
  "is_premium": false // false pour toutes les questions SITUATION
}
```
