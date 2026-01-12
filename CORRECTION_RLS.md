# 🔧 Correction RLS - Accès Anonyme aux Questions

## Problème

La politique RLS actuelle exige que l'utilisateur soit **authentifié** pour voir les questions. Cela bloque l'accès pour les tests sans authentification.

## Solution

Modifier la politique RLS pour permettre l'accès **anonyme** aux questions non-premium.

## 📋 Méthode 1 : Via Supabase Dashboard (Recommandé)

1. **Allez sur** https://supabase.com/dashboard
2. **Sélectionnez votre projet**
3. **Allez dans SQL Editor** (menu de gauche)
4. **Copiez-collez** le contenu de `database/fix_questions_rls.sql` :

```sql
-- Supprimer l'ancienne politique
DROP POLICY IF EXISTS "Authenticated users can view non-premium questions" ON fc_questions;

-- Créer une nouvelle politique qui permet l'accès anonyme
CREATE POLICY "Anyone can view non-premium questions"
  ON fc_questions FOR SELECT
  USING (
    is_premium = false 
    OR 
    EXISTS (
      SELECT 1 FROM fc_profiles 
      WHERE id = auth.uid() AND is_premium = true
    )
  );
```

5. **Cliquez sur "Run"** pour exécuter

## 📋 Méthode 2 : Via Script (Alternative)

```bash
npm run db:fix-rls
```

⚠️ **Note** : Cette méthode peut ne pas fonctionner si Supabase n'expose pas la fonction `exec_sql`. Dans ce cas, utilisez la Méthode 1.

## ✅ Vérification

Après avoir appliqué la correction, testez :

```bash
npm run db:check
```

Vous devriez voir que les questions sont accessibles.

## 🔒 Sécurité

La nouvelle politique permet :
- ✅ **Tous les utilisateurs** (authentifiés ou non) peuvent voir les questions **non-premium**
- ✅ **Seuls les utilisateurs premium** peuvent voir les questions **premium**

Cette configuration est sécurisée car :
- Les questions premium restent protégées
- Les données utilisateur (profils, résultats) restent isolées par RLS
- Seules les questions publiques sont accessibles anonymement
