# 🌱 Commandes de Seeding - Guide Rapide

## ✅ Commande pour restaurer les 40 questions

```bash
npm run seed:40
```

**OU** directement avec tsx :

```bash
npx tsx src/scripts/seed-questions-jsonb.ts --json=database/questions_40_complete.json
```

## 📋 Autres commandes disponibles

### Seeding depuis JSON personnalisé
```bash
npx tsx src/scripts/seed-questions-jsonb.ts --json=chemin/vers/fichier.json
```

### Seeding depuis CSV
```bash
npx tsx src/scripts/seed-questions-jsonb.ts --csv=chemin/vers/fichier.csv
```

### Ancien script (format non-JSONB)
```bash
npm run seed
```

## ⚠️ Important

- **Service Role Key requise** : Le script utilise `SUPABASE_SERVICE_ROLE_KEY` depuis `.env.local`
- **Format JSONB** : Le fichier JSON doit avoir `content`, `options`, `explanation` comme objets avec clés `fr`, `en`, `ar`
- **Vérification** : Après insertion, vérifiez avec :
  ```sql
  SELECT COUNT(*) FROM fc_questions; -- Doit retourner 40
  ```

## ✅ Résultat attendu

```
📖 Lecture du fichier JSON: database/questions_40_complete.json
✅ 40 questions trouvées dans le JSON
💾 Insertion dans Supabase...
✅ 40 questions insérées avec succès!
```
