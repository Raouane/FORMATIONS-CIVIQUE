# ✅ Vérification de la Connexion DB

## Checklist de vérification

### 1. Variables d'environnement (.env.local)

- [ ] `NEXT_PUBLIC_SUPABASE_URL` est défini
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` est défini
- [ ] `SUPABASE_SERVICE_ROLE_KEY` est défini (optionnel pour l'instant)
- [ ] `SUPABASE_DB_URL_POOLER` est défini (optionnel, pour production)

### 2. Schéma SQL exécuté

- [ ] Le fichier `database/schema.sql` a été exécuté dans Supabase SQL Editor
- [ ] Aucune erreur lors de l'exécution

### 3. Tables créées

Vérifier dans Supabase Dashboard → **Table Editor** :

- [ ] `fc_profiles` existe
- [ ] `fc_questions` existe
- [ ] `fc_user_progress` existe
- [ ] `fc_exam_results` existe

### 4. Politiques RLS

Vérifier dans Supabase Dashboard → **Authentication** → **Policies** :

- [ ] Politiques créées pour `fc_profiles`
- [ ] Politiques créées pour `fc_questions`
- [ ] Politiques créées pour `fc_user_progress`
- [ ] Politiques créées pour `fc_exam_results`

### 5. Test de connexion

```bash
npm run db:check
```

Résultat attendu :
```
✅ Connexion à Supabase réussie
✅ Table fc_profiles existe (0 enregistrements)
✅ Table fc_questions existe (0 enregistrements)
✅ Table fc_user_progress existe (0 enregistrements)
✅ Table fc_exam_results existe (0 enregistrements)
```

## 🔧 Commandes utiles

```bash
# Vérifier la connexion
npm run db:check

# Test de connexion approfondi
npm run db:test

# Lancer l'application (pour tester)
npm run dev
```

## ❌ Problèmes courants

### Erreur "Variables d'environnement Supabase manquantes"
- Vérifiez que `.env.local` existe à la racine du projet
- Vérifiez que les variables commencent par `NEXT_PUBLIC_` pour les clés publiques

### Erreur "Table n'existe pas"
- Exécutez `database/schema.sql` dans Supabase SQL Editor
- Vérifiez qu'il n'y a pas eu d'erreur lors de l'exécution

### Erreur "PGRST116" (table vide)
- C'est normal si les tables viennent d'être créées
- Les tables existent mais sont vides (0 enregistrements)

### Erreur de connexion
- Vérifiez que l'URL Supabase est correcte
- Vérifiez que la clé ANON est correcte
- Vérifiez votre connexion internet

## ✅ Connexion DB terminée quand...

- ✅ `npm run db:check` affiche "Connexion réussie"
- ✅ Les 4 tables `fc_*` sont listées
- ✅ Aucune erreur dans la console
