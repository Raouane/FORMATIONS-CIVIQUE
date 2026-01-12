# 🔧 Solution pour les Questions Manquantes

## 📊 Situation Actuelle

D'après le diagnostic :
- **A2** : 30 CONNAISSANCE + 10 SITUATION = 40 total, mais **manque 2 SITUATION**
- **B1** : 14 CONNAISSANCE + 14 SITUATION = 28 total, mais **manque 14 CONNAISSANCE** (et 2 SITUATION en trop)
- **B2** : 0 questions - **tout manque**

## ✅ Solution Recommandée : Réinsérer toutes les questions

La meilleure solution est de réinsérer toutes les questions depuis le fichier JSON pour garantir la cohérence.

### Option 1 : Utiliser le script TypeScript (Recommandé)

```bash
npm run seed:jsonb -- --json database/questions_40_complete.json
```

**Avant d'exécuter :**
1. Vérifiez que `database/questions_40_complete.json` contient bien **40 questions par niveau** (A2, B1, B2)
2. Vérifiez vos variables d'environnement dans `.env.local` :
   ```
   NEXT_PUBLIC_SUPABASE_URL=votre-url
   SUPABASE_SERVICE_ROLE_KEY=votre-service-role-key
   ```

### Option 2 : Supprimer et réinsérer via SQL

Si le script TypeScript ne fonctionne pas, vous pouvez :

1. **Supprimer toutes les questions existantes** (ATTENTION : sauvegardez d'abord !)
   ```sql
   DELETE FROM fc_questions;
   ```

2. **Réinsérer depuis le JSON** en utilisant le script TypeScript ou en convertissant le JSON en SQL

## 🔍 Vérification du Fichier JSON

Vérifiez que `database/questions_40_complete.json` contient :
- **40 questions A2** (28 CONNAISSANCE + 12 SITUATION)
- **40 questions B1** (28 CONNAISSANCE + 12 SITUATION)
- **40 questions B2** (28 CONNAISSANCE + 12 SITUATION)

**Total attendu : 120 questions**

## 📝 Script SQL de Vérification

Exécutez `database/identifier_questions_manquantes.sql` pour voir exactement ce qui manque.

## ⚠️ Important

- Les questions SITUATION doivent toutes être `is_premium: false` car elles font partie des 40 questions obligatoires
- Les questions CONNAISSANCE peuvent avoir certaines marquées comme premium (pour du contenu bonus)
