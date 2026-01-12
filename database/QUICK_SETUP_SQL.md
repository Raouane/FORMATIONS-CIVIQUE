# ⚡ Setup Rapide SQL - Copier/Coller

## Instructions

1. Ouvrir [Supabase Dashboard](https://supabase.com/dashboard)
2. Sélectionner votre projet
3. Aller dans **SQL Editor** (icône SQL dans la barre latérale)
4. Cliquer sur **New query**
5. **Copier TOUT le contenu** du fichier `schema.sql` ci-dessous
6. **Coller** dans l'éditeur SQL
7. Cliquer sur **Run** (ou appuyer sur Ctrl+Enter)

## ✅ Vérification après exécution

Après avoir exécuté le script, vérifiez dans Supabase Dashboard :

1. **Table Editor** → Vous devriez voir 4 nouvelles tables :
   - `fc_profiles`
   - `fc_questions`
   - `fc_user_progress`
   - `fc_exam_results`

2. **Authentication** → **Policies** → Vérifiez que les politiques RLS sont créées pour chaque table `fc_*`

3. **Exécuter** : `npm run db:check` pour vérifier la connexion

## 📝 Note importante

- ✅ Les tables sont préfixées `fc_` pour ne pas interférer avec vos autres applications
- ✅ Les politiques RLS garantissent l'isolation par utilisateur
- ✅ Aucune modification de vos tables existantes
