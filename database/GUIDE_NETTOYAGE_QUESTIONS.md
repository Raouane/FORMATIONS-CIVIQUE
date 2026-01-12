# 🧹 Guide de Nettoyage des Questions

## 📊 Situation Actuelle

| Niveau | CONNAISSANCE | SITUATION | Total | Objectif |
|--------|--------------|-----------|-------|----------|
| A2     | 58           | 22        | 80    | 40       |
| B1     | 50 (42 non-premium) | 29 (26 non-premium) | 79 | 40 |
| B2     | 32 (28 non-premium) | 13       | 45    | 40       |
| **Total** | **140** | **64** | **204** | **120** |

## 🎯 Objectif

Garder exactement **40 questions par niveau** :
- **28 questions CONNAISSANCE** (non-premium)
- **12 questions SITUATION** (non-premium)

**Total final : 120 questions** (40 × 3 niveaux)

## 🔧 Script de Nettoyage

**Fichier créé** : `database/nettoyer_questions_excessives.sql`

### Étapes d'Exécution

1. **Exécuter les requêtes 1-6** pour voir :
   - L'état actuel
   - Les questions qui seront gardées
   - Les questions qui seront supprimées

2. **Vérifier les résultats** :
   - S'assurer que chaque niveau aura bien 28 CONNAISSANCE + 12 SITUATION
   - Vérifier que les questions à supprimer sont bien des doublons/excédents

3. **Décommenter la requête 7** (DELETE) pour supprimer les questions en trop

4. **Exécuter la requête 8** pour vérifier le résultat final

## ⚠️ Précautions

- **Sauvegarder la base** avant d'exécuter le DELETE
- **Vérifier les résultats** des requêtes 1-6 avant de supprimer
- Le script garde les **questions les plus récentes** (ORDER BY created_at DESC)

## 📝 Résultat Attendu

Après nettoyage :

| Niveau | CONNAISSANCE | SITUATION | Total |
|--------|--------------|-----------|-------|
| A2     | 28           | 12        | 40    |
| B1     | 28           | 12        | 40    |
| B2     | 28           | 12        | 40    |
| **Total** | **84** | **36** | **120** |

## 💡 Note

Le script garde automatiquement :
- Les 28 premières questions CONNAISSANCE non-premium (les plus récentes)
- Les 12 premières questions SITUATION non-premium (les plus récentes)

Cela devrait correspondre aux 124 questions que nous avons insérées récemment.
