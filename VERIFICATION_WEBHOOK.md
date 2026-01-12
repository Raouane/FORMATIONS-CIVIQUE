# 🔍 Guide de Vérification du Webhook Stripe

## ✅ Vérification 1 : Dashboard Stripe

### Étapes :

1. **Connectez-vous à [Stripe Dashboard](https://dashboard.stripe.com)**
2. **Allez dans** : Developers → Webhooks
3. **Cliquez sur votre webhook** (celui avec l'URL `https://formations-civique.onrender.com/api/stripe/webhook`)
4. **Regardez la section "Event deliveries"** en bas de la page
5. **Cherchez l'événement** `checkout.session.completed` avec votre `session_id`

### ✅ Résultat attendu :

- **Status** : `200 OK` (en vert) ✅
- **Event type** : `checkout.session.completed`
- **Time** : Quelques secondes après le paiement

### ❌ Si vous voyez une erreur :

- **400 Bad Request** : Le webhook secret est incorrect
- **500 Internal Server Error** : Problème dans le code du webhook (vérifiez les logs Render)
- **Timeout** : Le webhook n'a pas répondu à temps

---

## ✅ Vérification 2 : Supabase Database

### Étapes :

1. **Connectez-vous à [Supabase Dashboard](https://supabase.com/dashboard)**
2. **Sélectionnez votre projet**
3. **Allez dans** : Table Editor → `fc_profiles`
4. **Cherchez votre utilisateur** par email (`raouanedev@gmail.com`)
5. **Vérifiez la colonne** `is_premium`

### ✅ Résultat attendu :

- **`is_premium`** : `true` ✅
- **`updated_at`** : Date/heure récente (juste après le paiement)

### ❌ Si `is_premium` est toujours `false` :

1. Vérifiez les logs Render pour voir si le webhook a été appelé
2. Vérifiez que le `userId` dans les metadata Stripe correspond à l'ID dans Supabase
3. Vérifiez que `SUPABASE_SERVICE_ROLE_KEY` est correctement configuré sur Render

---

## ✅ Vérification 3 : Test Utilisateur

### Sur votre site `formations-civique.onrender.com` :

1. **Le bouton "Passer Premium"** doit avoir disparu
2. **Lancez une simulation** : vous devez pouvoir faire **40 questions** sans paywall
3. **Vérifiez le timer** : doit être de **45 minutes** (pas 15 minutes)

### ✅ Si tout fonctionne :

- ✅ Pas de paywall après la 10ème question
- ✅ Accès à toutes les 40 questions
- ✅ Timer de 45 minutes
- ✅ Accès aux 12 mises en situation

---

## 🚀 Passage en Mode LIVE (Production)

### ⚠️ IMPORTANT : Faites ces changements UNIQUEMENT quand tout fonctionne en mode test !

### 1. Créer les produits dans Stripe Dashboard (Mode LIVE)

1. **Stripe Dashboard** → Mode **LIVE** (toggle en haut à droite)
2. **Products** → **Add product**
3. **Créer 2 produits** :

   **Produit 1 : Premium (29€)**
   - Name: `Accès Premium - Formations Civiques`
   - Description: `Accès illimité aux simulations officielles et à la banque de données complète`
   - Pricing: `One time` → `29.00 EUR`
   - Copiez le **Price ID** : `price_xxxxx...`

   **Produit 2 : Abonnement (9€/mois)**
   - Name: `Abonnement Premium - Formations Civiques`
   - Description: `Accès illimité aux simulations officielles et à la banque de données complète`
   - Pricing: `Recurring` → `Monthly` → `9.00 EUR`
   - Copiez le **Price ID** : `price_xxxxx...`

### 2. Créer le Webhook en Mode LIVE

1. **Stripe Dashboard** → Mode **LIVE**
2. **Developers** → **Webhooks** → **Add endpoint**
3. **Endpoint URL** : `https://formations-civique.onrender.com/api/stripe/webhook`
4. **Events to send** :
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. **Copiez le Signing secret** : `whsec_xxxxx...`

### 3. Modifier les variables sur Render

Dans **Render Dashboard** → votre service → **Environment**, modifiez :

| Variable | Avant (Test) | Après (LIVE) |
|----------|--------------|--------------|
| `STRIPE_SECRET_KEY` | `sk_test_...` | `sk_live_...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` | `pk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` (test) | `whsec_...` (live) |

### 4. Redéployer

1. **Render Dashboard** → votre service
2. **Manual Deploy** → **Deploy latest commit**
3. Attendre la fin du déploiement

---

## ✅ Checklist Finale

Avant de passer en LIVE, vérifiez que :

- [ ] Le webhook fonctionne en mode test (200 OK dans Stripe Dashboard)
- [ ] Le statut premium est activé dans Supabase après paiement test
- [ ] L'utilisateur peut accéder aux 40 questions sans paywall
- [ ] Les produits sont créés dans Stripe Dashboard (mode LIVE)
- [ ] Le webhook LIVE est configuré avec les bons événements
- [ ] Les 3 variables d'environnement sont mises à jour sur Render
- [ ] Le service est redéployé

---

## 🆘 En cas de problème

1. **Vérifiez les logs Render** pour voir les erreurs du webhook
2. **Vérifiez les logs Stripe Dashboard** pour voir si le webhook a été appelé
3. **Vérifiez Supabase** pour voir si `is_premium` a été mis à jour
4. **Testez en mode test** avant de passer en LIVE
