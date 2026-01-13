# 🔧 Correction RLS : Politique INSERT manquante pour fc_profiles

## ❌ Problème identifié

L'erreur **401 (Unauthorized)** lors de la création du profil `fc_profiles` est due à une **politique RLS INSERT manquante**.

Le schéma SQL actuel ne contient que les politiques :
- ✅ SELECT : "Users can view own profile"
- ✅ UPDATE : "Users can update own profile"
- ❌ **INSERT : MANQUANTE** ← C'est ça qui cause l'erreur 401

## ✅ Solution

### Option 1 : Exécuter le script SQL de correction (Recommandé)

1. **Connectez-vous à Supabase Dashboard**
2. **Allez dans** : SQL Editor
3. **Copiez-collez** le contenu de `database/fix_fc_profiles_rls.sql`
4. **Exécutez** le script

### Option 2 : Créer la politique manuellement

Dans Supabase Dashboard → **Authentication** → **Policies** → **fc_profiles** :

1. Cliquez sur **"New Policy"**
2. Nom : `Users can insert own profile`
3. Type : **INSERT**
4. Expression : `auth.uid() = id`
5. **Save**

## 📋 Vérification

Après avoir exécuté le script, vérifiez que la politique existe :

```sql
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'fc_profiles';
```

Vous devriez voir **3 politiques** :
- ✅ Users can view own profile (SELECT)
- ✅ Users can insert own profile (INSERT) ← **NOUVELLE**
- ✅ Users can update own profile (UPDATE)

## 🎯 Résultat attendu

Après cette correction :
- ✅ L'inscription ne générera plus d'erreur 401
- ✅ Le profil sera créé correctement (par le trigger SQL ou manuellement)
- ✅ L'utilisateur pourra accéder à la page pricing sans boucle
