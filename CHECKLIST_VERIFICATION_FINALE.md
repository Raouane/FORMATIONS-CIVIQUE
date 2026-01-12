# ✅ Checklist de Vérification Finale

## 🎯 Tests à Effectuer Avant Production

### 1. Test du "Transfuge" (Partage de DB)

**Objectif** : Vérifier qu'un utilisateur existant sur `family-depenses` peut s'inscrire sur `formations-civique`.

**Étapes** :
1. Utiliser un email **déjà utilisé** sur `family-depenses`
2. Tenter de s'inscrire sur `formations-civique` avec le **même email** et le **même mot de passe**
3. **Résultat attendu** :
   - ✅ Connexion automatique réussie (pas d'erreur "email déjà enregistré")
   - ✅ Profil créé dans `fc_profiles` (vérifier dans Supabase)
   - ✅ Pas d'impact sur les données de `family-depenses`

**Vérification Supabase** :
```sql
SELECT * FROM fc_profiles WHERE email = 'votre-email@test.com';
```

---

### 2. Test du "Badge Doré" (Premium)

**Objectif** : Vérifier que le badge Premium s'affiche correctement après un paiement.

**Étapes** :
1. Effectuer un paiement test (carte `4242 4242 4242 4242`)
2. Attendre la redirection vers `/pricing?success=true`
3. **Résultat attendu** :
   - ✅ **Confettis** explosent à l'écran (3 secondes)
   - ✅ **Toast de succès** s'affiche : "🎉 Félicitations ! Votre accès Premium est désormais activé"
   - ✅ Redirection automatique vers la page d'accueil après 2 secondes
   - ✅ **Badge Premium** apparaît dans le Header (desktop) **sans rechargement manuel**
   - ✅ **Badge Premium** apparaît dans le menu burger (mobile)

**Vérification Supabase** :
```sql
SELECT is_premium FROM fc_profiles WHERE email = 'votre-email@test.com';
-- Doit retourner : true
```

**Vérification Visuelle** :
- [ ] Badge visible dans le Header (desktop)
- [ ] Badge visible dans le MobileNav (mobile)
- [ ] Badge a un dégradé doré avec icône Sparkles
- [ ] Badge pulse légèrement (animation)

---

### 3. Test des Deux Offres Côte à Côte

**Objectif** : Vérifier que les deux offres s'affichent correctement et que les boutons fonctionnent.

**Étapes** :
1. Aller sur `/pricing`
2. **Vérifier l'affichage** :
   - ✅ Deux cartes côte à côte (desktop) ou empilées (mobile)
   - ✅ Carte gauche : "Accès Mensuel" (9€/mois) avec badge "Flexible"
   - ✅ Carte droite : "Accès Illimité" (29€) avec badge "⭐ Recommandé"
   - ✅ Carte droite a une bordure plus épaisse (border-4) et shadow-lg

3. **Tester les boutons** :
   - ✅ Bouton "S'abonner" (9€) → Redirige vers Stripe en mode `subscription`
   - ✅ Bouton "Acheter maintenant" (29€) → Redirige vers Stripe en mode `payment`

**Vérification Stripe** :
- Dans Stripe Dashboard, vérifier que les deux sessions de checkout sont créées avec les bons modes

---

### 4. Monitoring des Webhooks Stripe

**Objectif** : Vérifier que les webhooks arrivent bien sur le serveur Render.

**Étapes** :
1. Aller dans **Stripe Dashboard** → **Developers** → **Webhooks**
2. Cliquer sur votre webhook (celui avec l'URL `https://formations-civique.onrender.com/api/stripe/webhook`)
3. **Vérifier** :
   - ✅ URL correcte : `https://formations-civique.onrender.com/api/stripe/webhook`
   - ✅ Événements configurés :
     - `checkout.session.completed`
     - `invoice.payment_succeeded`
     - `customer.subscription.deleted`
     - `invoice.payment_failed`
   - ✅ Taux de réussite : **100%** (ou proche)
   - ✅ Pas de "Retries" en masse (quelques retries sont normaux)

4. **Tester un paiement** et vérifier dans "Event deliveries" :
   - ✅ Événement `checkout.session.completed` avec status **200 OK**
   - ✅ Logs montrent : `✅ [Webhook] Premium activé pour l'utilisateur: ...`

**Vérification Logs Render** :
- Aller dans Render Dashboard → Logs
- Chercher les logs `[Webhook]` après un paiement test
- Vérifier qu'il n'y a pas d'erreurs 500

---

### 5. Test de l'Inscription Nouvel Utilisateur

**Objectif** : Vérifier que l'inscription fonctionne pour un nouvel utilisateur.

**Étapes** :
1. Utiliser un email **jamais utilisé** sur les deux sites
2. S'inscrire sur `formations-civique`
3. **Résultat attendu** :
   - ✅ Inscription réussie
   - ✅ Profil créé dans `fc_profiles` avec `is_premium: false`
   - ✅ Redirection vers la page demandée (ou accueil)

**Vérification Supabase** :
```sql
SELECT * FROM fc_profiles WHERE email = 'nouvel-email@test.com';
-- Doit retourner une ligne avec is_premium = false
```

---

### 6. Test de la Page d'Accueil (Badge Premium)

**Objectif** : Vérifier que le badge Premium apparaît sur toutes les pages.

**Étapes** :
1. Se connecter avec un compte Premium
2. Naviguer sur différentes pages :
   - `/` (accueil)
   - `/pricing`
   - `/simulation`
   - `/results`
3. **Vérifier** :
   - ✅ Badge Premium visible dans le Header sur toutes les pages
   - ✅ Badge Premium visible dans le menu burger (mobile)

---

## 🚨 Points de Vigilance

### 1. Chemin du Webhook

**Vérifier** que l'URL dans Stripe Dashboard correspond exactement au chemin du fichier :
- ✅ Fichier : `src/pages/api/stripe/webhook.ts`
- ✅ URL Stripe : `https://formations-civique.onrender.com/api/stripe/webhook`

**⚠️ Ne PAS utiliser** : `/api/webhooks/stripe` (mauvais chemin)

### 2. Dépendances

**Vérifier** que toutes les dépendances sont dans `package.json` :
- ✅ Pas besoin de `canvas-confetti` (confettis en CSS pur)
- ✅ `stripe` : `^14.25.0` ✅
- ✅ `@supabase/supabase-js` : `^2.39.0` ✅
- ✅ `lucide-react` : `^0.344.0` ✅ (pour les icônes)

### 3. Variables d'Environnement sur Render

**Vérifier** que toutes les variables sont configurées :
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`
- ✅ `STRIPE_SECRET_KEY`
- ✅ `STRIPE_WEBHOOK_SECRET`
- ✅ `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- ✅ `NEXT_PUBLIC_APP_URL`

---

## 📊 Résumé des Fonctionnalités Implémentées

### ✅ Modèle Freemium
- [x] Restriction à 10 questions pour les utilisateurs gratuits
- [x] Paywall après la 10ème question
- [x] Timer de 15 minutes pour les quiz gratuits
- [x] Timer de 45 minutes pour les simulations premium

### ✅ Badge Premium
- [x] Composant `PremiumBadge` avec dégradé doré
- [x] Intégration dans Header (desktop)
- [x] Intégration dans MobileNav (mobile)
- [x] Affichage conditionnel basé sur `isPremium`

### ✅ Page Pricing
- [x] Deux offres côte à côte (grille responsive)
- [x] Badge "Flexible" pour l'abonnement mensuel
- [x] Badge "Recommandé" pour le paiement unique
- [x] Mise en avant visuelle de l'offre recommandée

### ✅ Stripe Integration
- [x] Checkout Session pour paiement unique (29€)
- [x] Checkout Session pour abonnement mensuel (9€)
- [x] Webhook pour activation premium automatique
- [x] Gestion des renouvellements mensuels

### ✅ UX/UI
- [x] Toast de succès après paiement
- [x] Animation de confettis (CSS pur)
- [x] Rafraîchissement automatique du statut premium
- [x] Redirection fluide après paiement

### ✅ Partage de Base de Données
- [x] Gestion des utilisateurs existants (autre site)
- [x] Création automatique du profil `fc_profiles`
- [x] Isolation des données (préfixe `fc_`)

---

## 🚀 Prêt pour la Production ?

Une fois tous ces tests validés, vous êtes prêt à :

1. **Passer en mode LIVE** sur Stripe
2. **Créer les produits** (9€ et 29€) en mode Live
3. **Mettre à jour les variables** sur Render avec les clés Live
4. **Configurer le webhook Live** dans Stripe Dashboard

**Bonne chance ! 🎉**
