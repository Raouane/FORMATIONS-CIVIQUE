# 🧹 Instructions de Nettoyage des Doublons

## ✅ Confirmation des Doublons

D'après les résultats de la requête 6, il y a effectivement des **doublons** :
- Questions avec le même contenu mais des dates différentes
- Exemple : "Quelle est la devise de la République française?" apparaît deux fois
  - Une fois à `19:28:48` (ancienne)
  - Une fois à `19:30:04` (récente)

## 🎯 Stratégie de Nettoyage

Le script `supprimer_doublons_final.sql` va :
1. **Garder les questions les plus récentes** (ORDER BY created_at DESC)
2. **Garder exactement** :
   - 28 questions CONNAISSANCE non-premium par niveau
   - 12 questions SITUATION non-premium par niveau
3. **Supprimer** toutes les autres questions (doublons + excédents)

## 📋 Étapes d'Exécution

### Étape 1 : Vérifier l'état actuel
Exécutez la requête "ÉTAPE 1" pour voir la répartition actuelle.

### Étape 2 : Voir les questions qui seront gardées
Exécutez la requête "ÉTAPE 2" pour vérifier que chaque niveau aura bien :
- 28 CONNAISSANCE
- 12 SITUATION

### Étape 3 : Compter les questions à supprimer
Exécutez la requête "ÉTAPE 3" pour voir combien de questions seront supprimées.

**Résultat attendu** : ~84 questions à supprimer (204 - 120 = 84)

### Étape 4 : Supprimer les doublons
⚠️ **ATTENTION** : Décommentez la requête "ÉTAPE 4" et exécutez-la uniquement après avoir vérifié les étapes 1-3.

### Étape 5 : Vérification finale
Décommentez et exécutez la requête "ÉTAPE 5" pour vérifier le résultat final.

## 📊 Résultat Attendu

Après nettoyage :

| Niveau | CONNAISSANCE | SITUATION | Total |
|--------|--------------|-----------|-------|
| A2     | 28           | 12        | 40    |
| B1     | 28           | 12        | 40    |
| B2     | 28           | 12        | 40    |
| **Total** | **84** | **36** | **120** |

## ⚠️ Précautions

1. **Sauvegarder la base** avant d'exécuter le DELETE
2. **Vérifier les résultats** des étapes 1-3 avant de supprimer
3. Le script garde les **questions les plus récentes** (19:30:04)
4. Les questions premium seront également supprimées si elles sont en excès

## 💡 Note

Les questions avec `created_at = 2026-01-11 19:30:04` sont les plus récentes (celles que nous avons insérées en dernier). Elles seront **gardées**.

Les questions avec `created_at = 2026-01-11 19:28:48` sont les anciennes (doublons). Elles seront **supprimées**.
