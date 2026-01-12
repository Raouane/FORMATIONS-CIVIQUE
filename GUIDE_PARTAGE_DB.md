# 🔐 Guide : Partage de Base de Données Supabase

## 📋 Situation

Vous partagez la même base de données Supabase entre deux sites :
- **Site 1** : `family-depenses` (ancien site)
- **Site 2** : `formations-civique` (nouveau site)

## ✅ Isolation des Données

### Tables Préfixées `fc_`

Toutes les tables du site **formations-civique** sont préfixées avec `fc_` pour éviter les conflits :

- ✅ `fc_profiles` - Profils utilisateurs du site formations-civique
- ✅ `fc_questions` - Questions d'examen
- ✅ `fc_user_progress` - Progression des utilisateurs
- ✅ `fc_exam_results` - Résultats des examens

**Les tables de `family-depenses` ne sont PAS affectées.**

## 🔑 Gestion de l'Authentification

### Problème Potentiel

Supabase Auth (`auth.users`) est **partagé** entre les deux sites. Un utilisateur ne peut avoir qu'**un seul compte** par email dans `auth.users`.

### Solution Implémentée

Le code dans `AuthProvider.tsx` gère maintenant **3 cas** :

1. **Nouvel utilisateur** : Inscription normale → Création du compte + profil `fc_profiles`
2. **Utilisateur existant (autre site)** : 
   - Si l'email existe déjà → Tentative de connexion
   - Si la connexion réussit → Vérification/création du profil `fc_profiles`
3. **Utilisateur existant (même site)** : Connexion normale

### Code de Gestion

```typescript
// Dans src/providers/AuthProvider.tsx
const signUp = async (email: string, password: string, fullName: string) => {
  // 1. Essayer de créer le compte
  const { data, error } = await supabase.auth.signUp({ ... });

  // 2. Si l'email existe déjà, essayer de se connecter
  if (error && error.message.includes('already registered')) {
    const { data: signInData } = await supabase.auth.signInWithPassword({ ... });
    
    // 3. Vérifier si le profil fc_profiles existe
    const { data: existingProfile } = await supabase
      .from('fc_profiles')
      .select('id')
      .eq('id', signInData.user.id)
      .single();

    // 4. Si le profil n'existe pas, le créer
    if (!existingProfile) {
      await supabase.from('fc_profiles').insert({ ... });
    }
  }
}
```

## 🎯 Badge Premium

Le badge Premium s'affiche automatiquement dans :
- ✅ **Header** (desktop) - À côté du bouton de déconnexion
- ✅ **MobileNav** (mobile) - À côté du nom de l'application

**Condition** : `isPremium === true` (récupéré depuis `fc_profiles.is_premium`)

## 🔔 Webhooks Stripe

### Configuration Requise

Dans votre **Stripe Dashboard** → **Webhooks**, assurez-vous que l'endpoint pointe vers :

```
https://formations-civique.onrender.com/api/stripe/webhook
```

**⚠️ IMPORTANT** : Ne pas utiliser l'URL de `family-depenses` !

### Événements à Écouter

- ✅ `checkout.session.completed` - Activation premium après paiement
- ✅ `invoice.payment_succeeded` - Renouvellement abonnement mensuel
- ✅ `customer.subscription.deleted` - Désactivation premium
- ✅ `invoice.payment_failed` - Échec de paiement

### Mise à Jour de la Base de Données

Le webhook met à jour **uniquement** la table `fc_profiles` :

```typescript
// Dans src/pages/api/stripe/webhook.ts
await supabaseAdmin
  .from('fc_profiles')
  .update({ is_premium: true })
  .eq('id', userId);
```

**Les données de `family-depenses` ne sont PAS affectées.**

## 🧪 Tests à Effectuer

### 1. Test d'Inscription Nouvel Utilisateur

1. Utiliser un email **jamais utilisé** sur les deux sites
2. S'inscrire sur `formations-civique`
3. Vérifier dans Supabase :
   - ✅ `auth.users` contient le nouvel utilisateur
   - ✅ `fc_profiles` contient le profil avec `is_premium: false`

### 2. Test d'Inscription Utilisateur Existant (Autre Site)

1. Utiliser un email **déjà utilisé** sur `family-depenses`
2. S'inscrire sur `formations-civique` avec le **même email** et le **même mot de passe**
3. Résultat attendu :
   - ✅ Connexion automatique réussie
   - ✅ Profil `fc_profiles` créé (si n'existe pas)
   - ✅ Pas d'erreur "email déjà enregistré"

### 3. Test Badge Premium

1. Effectuer un paiement Stripe (test)
2. Vérifier dans Supabase : `fc_profiles.is_premium = true`
3. Rafraîchir la page
4. ✅ Le badge "PREMIUM" doit apparaître dans le Header

## 🚨 Points de Vigilance

### 1. Conflit de Trigger SQL

Le trigger SQL `handle_new_user()` crée automatiquement un profil dans `fc_profiles` lors de l'inscription.

**Si le trigger existe** : Le code dans `AuthProvider.tsx` détecte que le profil existe déjà et ne tente pas de le recréer.

### 2. Politiques RLS (Row Level Security)

Les politiques RLS sur `fc_profiles` garantissent que :
- ✅ Chaque utilisateur voit uniquement son propre profil
- ✅ Les utilisateurs de `family-depenses` ne voient PAS les profils `fc_profiles`
- ✅ Les utilisateurs de `formations-civique` ne voient PAS les profils de `family-depenses`

### 3. Service Role Key

Le webhook Stripe utilise `SUPABASE_SERVICE_ROLE_KEY` pour **bypasser RLS** et mettre à jour `is_premium`.

**⚠️ Ne JAMAIS exposer cette clé côté client !**

## 📝 Checklist de Vérification

Avant de déployer en production, vérifier :

- [ ] Les tables `fc_*` existent dans Supabase
- [ ] Le trigger `handle_new_user()` est actif
- [ ] Les politiques RLS sont configurées sur `fc_profiles`
- [ ] Le webhook Stripe pointe vers la bonne URL
- [ ] `SUPABASE_SERVICE_ROLE_KEY` est configuré sur Render
- [ ] Test d'inscription avec email existant fonctionne
- [ ] Test de paiement Stripe active bien `is_premium`
- [ ] Le badge Premium s'affiche après activation

## 🆘 En Cas de Problème

### Erreur "Email déjà enregistré"

**Solution** : Le code gère maintenant ce cas automatiquement. Si l'erreur persiste :
1. Vérifier que l'utilisateur peut se connecter avec cet email
2. Vérifier que le profil `fc_profiles` est créé après connexion

### Badge Premium ne s'affiche pas

**Vérifications** :
1. `fc_profiles.is_premium = true` dans Supabase ?
2. L'utilisateur est bien connecté ?
3. `refreshPremiumStatus()` a été appelé après le paiement ?

### Webhook ne fonctionne pas

**Vérifications** :
1. L'URL du webhook dans Stripe Dashboard est correcte ?
2. `STRIPE_WEBHOOK_SECRET` est correct sur Render ?
3. Les logs Render montrent des erreurs ?
