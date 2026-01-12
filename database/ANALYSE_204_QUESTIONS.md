# 📊 Analyse : 204 Questions au lieu de 124

## 🔍 Situation Actuelle

D'après les statistiques de la base de données :
- **Total** : 204 questions
- **Niveaux** : 3 (A2, B1, B2)
- **Types** : 2 (CONNAISSANCE, SITUATION)
- **Non-premium** : 189
- **Premium** : 15

## ⚠️ Problème Identifié

**80 questions en trop** (204 - 124 = 80)

Cela suggère qu'il y a :
1. **Des doublons** : Questions insérées plusieurs fois
2. **Des questions anciennes** : Questions qui existaient déjà avant notre insertion

## 🔧 Solutions

### Option 1 : Vérifier les Doublons (Recommandé)

**Fichier créé** : `database/verifier_doublons_questions.sql`

Exécutez ce script dans Supabase SQL Editor pour :
- Voir la répartition exacte par niveau et type
- Identifier les doublons (même contenu FR)
- Vérifier combien de questions par niveau

### Option 2 : Nettoyer les Doublons

**Fichier créé** : `database/nettoyer_doublons_questions.sql`

⚠️ **ATTENTION** : Ce script supprime les doublons en gardant le plus récent.

**Étapes** :
1. D'abord exécuter `verifier_doublons_questions.sql` pour voir les doublons
2. Vérifier que les doublons identifiés sont bien des doublons
3. Ensuite décommenter la partie DELETE dans `nettoyer_doublons_questions.sql`
4. Exécuter pour supprimer les doublons

### Option 3 : Vérifier la Répartition Cible

**Objectif** : Chaque niveau doit avoir :
- 28 questions CONNAISSANCE (non-premium)
- 12 questions SITUATION (non-premium)
- **Total : 40 questions par niveau**

**Total attendu** : 120 questions (40 × 3 niveaux)

## 📝 Prochaines Étapes

1. ⏳ **Exécuter `verifier_doublons_questions.sql`** pour voir la répartition
2. ⏳ **Identifier les doublons** et décider si on les supprime
3. ⏳ **Vérifier que chaque niveau a 40 questions** (28 CONNAISSANCE + 12 SITUATION)
4. ⏳ **Nettoyer si nécessaire** avec `nettoyer_doublons_questions.sql`

## 💡 Hypothèse

Il est probable que :
- Les 124 questions que nous avons insérées sont présentes
- Il y a 80 questions anciennes/doublons qui existaient déjà
- Il faut vérifier si ces 80 questions sont des doublons ou des questions différentes

**Exécutez d'abord le script de vérification pour avoir une vue complète !**
