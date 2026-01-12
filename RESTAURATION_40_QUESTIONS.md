# ✅ Restauration des 40 Questions - Guide Complet

## 📋 Fichier Prêt

Le fichier `database/questions_40_complete.json` contient **toutes les 40 questions** au format JSONB avec traductions FR/EN/AR.

### Répartition Vérifiée ✅

- **VALEURS** : 11 questions (5 CONNAISSANCE + 6 SITUATION)
- **DROITS** : 11 questions (5 CONNAISSANCE + 6 SITUATION)
- **HISTOIRE** : 8 questions (8 CONNAISSANCE)
- **POLITIQUE** : 6 questions (6 CONNAISSANCE)
- **SOCIETE** : 4 questions (4 CONNAISSANCE)

**Total :** 28 CONNAISSANCE + 12 SITUATION = 40 questions ✅

## 🚀 Méthode 1 : Script TypeScript (Recommandé)

### Étape 1 : Vérifier les variables d'environnement

Assurez-vous que `.env.local` contient :
```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_SERVICE_ROLE_KEY=votre-service-role-key
```

### Étape 2 : Exécuter le seeding

```bash
npm run seed:questions -- --json database/questions_40_complete.json
```

Le script `src/scripts/seed-questions-jsonb.ts` va :
- ✅ Lire le fichier JSON
- ✅ Valider le format JSONB
- ✅ Convertir automatiquement si nécessaire
- ✅ Insérer dans Supabase avec bypass RLS

### Étape 3 : Vérifier l'insertion

Dans Supabase SQL Editor :
```sql
-- Vérifier le nombre total
SELECT COUNT(*) FROM fc_questions;

-- Vérifier la répartition par thème et type
SELECT theme, type, COUNT(*) 
FROM fc_questions 
GROUP BY theme, type 
ORDER BY theme, type;

-- Vérifier le format JSONB
SELECT 
  id,
  theme,
  jsonb_typeof(content) as content_type,
  jsonb_typeof(options) as options_type,
  content->'fr' as content_fr,
  options->'fr' as options_fr
FROM fc_questions 
LIMIT 5;
```

## 🚀 Méthode 2 : Insertion SQL Directe

Si vous préférez utiliser SQL directement dans Supabase :

1. **Ouvrir** Supabase Dashboard → SQL Editor
2. **Créer un script** qui lit le JSON et l'insère

**Note :** Cette méthode est plus complexe car PostgreSQL ne lit pas directement les fichiers JSON locaux. La Méthode 1 est recommandée.

## ✅ Vérifications Post-Insertion

### 1. Nombre de questions
```sql
SELECT COUNT(*) FROM fc_questions;
-- Doit retourner : 40
```

### 2. Répartition par thème
```sql
SELECT theme, COUNT(*) 
FROM fc_questions 
GROUP BY theme;
-- Doit montrer : VALEURS (11), DROITS (11), HISTOIRE (8), POLITIQUE (6), SOCIETE (4)
```

### 3. Répartition par type
```sql
SELECT type, COUNT(*) 
FROM fc_questions 
GROUP BY type;
-- Doit montrer : CONNAISSANCE (28), SITUATION (12)
```

### 4. Format JSONB
```sql
SELECT 
  COUNT(*) as total,
  COUNT(CASE WHEN jsonb_typeof(content) = 'object' AND content ? 'fr' THEN 1 END) as content_ok,
  COUNT(CASE WHEN jsonb_typeof(options) = 'object' AND options ? 'fr' THEN 1 END) as options_ok
FROM fc_questions;
-- Tous les compteurs doivent être égaux à 40
```

## 🎯 Après Restauration

Une fois les questions restaurées :

1. **Tester la simulation** : `/simulation` doit afficher des questions
2. **Vérifier le quota 28/12** : Le moteur doit récupérer 28 CONNAISSANCE + 12 SITUATION
3. **Tester la localisation** : Changer la langue et vérifier que les questions s'affichent correctement
4. **Tester la page de résultats** : Compléter un examen et vérifier l'affichage du cercle de progression

## ⚠️ Notes Importantes

- **Service Role Key requise** : Le script utilise `SUPABASE_SERVICE_ROLE_KEY` pour bypasser les RLS
- **Format JSONB obligatoire** : Toutes les questions doivent avoir `content`, `options`, `explanation` comme objets JSONB
- **Traductions** : Les traductions EN et AR sont présentes, avec fallback sur FR si manquant
- **Doublons** : Le script n'évite pas les doublons - vérifiez avant d'insérer si vous avez déjà des questions

## 🔍 En cas de problème

Si l'insertion échoue :

1. **Vérifier les logs** du script de seeding
2. **Vérifier la structure** de la table avec `database/check_table_state.sql`
3. **Vérifier les contraintes** : Les contraintes CHECK doivent être présentes après la migration
4. **Nettoyer** : Si nécessaire, exécutez `database/fix_before_constraints.sql` avant de réessayer
