# 🔗 URL Exacte du Webhook Stripe

## 📍 Arborescence du Fichier

```
src/
  pages/
    api/
      stripe/
        webhook.ts  ← Votre fichier webhook
```

## ✅ URL Exacte à Utiliser dans Stripe Dashboard

### Pour la Production (Render)

```
https://formations-civique.onrender.com/api/stripe/webhook
```

### Pour le Développement Local (si vous testez en local)

```
http://localhost:3000/api/stripe/webhook
```

---

## 🔍 Vérifications à Effectuer

### 1. Vérifier que le Fichier Existe

Le fichier doit être présent à :
```
src/pages/api/stripe/webhook.ts
```

**Vérification** : Le fichier existe bien dans votre projet ✅

### 2. Vérifier l'Export du Handler

Le fichier doit exporter un handler par défaut :

```typescript
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // ...
}
```

**Vérification** : Le handler est bien exporté ✅

### 3. Vérifier la Configuration dans Stripe Dashboard

1. Allez dans **Stripe Dashboard** → **Developers** → **Webhooks**
2. Cliquez sur **"Add endpoint"** (ou modifiez l'existant)
3. **Endpoint URL** : Copiez-collez exactement :

```
https://formations-civique.onrender.com/api/stripe/webhook
```

⚠️ **ATTENTION** : 
- Pas de `/` à la fin
- Pas d'espace avant/après
- Vérifiez que c'est bien `formations-civique` (pas `family-depenses`)

### 4. Vérifier les Événements Sélectionnés

Dans Stripe Dashboard, sélectionnez ces événements :

- ✅ `checkout.session.completed`
- ✅ `invoice.payment_succeeded`
- ✅ `customer.subscription.deleted`
- ✅ `invoice.payment_failed`

### 5. Tester l'Endpoint

#### Test Manuel (avec curl)

```bash
curl -X POST https://formations-civique.onrender.com/api/stripe/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": "true"}'
```

**Résultat attendu** : 
- Si vous obtenez `405 Method not allowed` → L'endpoint existe mais refuse les requêtes sans signature Stripe (normal)
- Si vous obtenez `404 Not found` → L'endpoint n'existe pas (problème de déploiement)

#### Test avec Stripe CLI (Recommandé)

```bash
stripe listen --forward-to https://formations-civique.onrender.com/api/stripe/webhook
```

---

## 🚨 Résolution des Problèmes

### Erreur 404 : Endpoint Not Found

**Causes possibles** :

1. **Le build Render n'a pas inclus le fichier**
   - Vérifiez les logs de build Render
   - Assurez-vous que le fichier est bien commité sur GitHub

2. **L'URL dans Stripe Dashboard est incorrecte**
   - Vérifiez qu'il n'y a pas de typo
   - Vérifiez que c'est bien `formations-civique` et pas `family-depenses`
   - Vérifiez qu'il n'y a pas de `/` à la fin

3. **Le fichier n'est pas dans le bon dossier**
   - Doit être : `src/pages/api/stripe/webhook.ts`
   - Pas : `src/pages/api/webhook.ts`
   - Pas : `src/api/stripe/webhook.ts`

### Erreur 405 : Method Not Allowed

**Normal** : Cela signifie que l'endpoint existe mais refuse les requêtes qui ne sont pas des webhooks Stripe valides.

### Erreur 500 : Internal Server Error

**Causes possibles** :

1. **Variable d'environnement manquante**
   - Vérifiez que `STRIPE_WEBHOOK_SECRET` est configuré sur Render
   - Vérifiez que `SUPABASE_SERVICE_ROLE_KEY` est configuré sur Render

2. **Erreur dans le code du webhook**
   - Vérifiez les logs Render pour voir l'erreur exacte

---

## 📋 Checklist de Vérification

Avant de tester le webhook, vérifiez :

- [ ] Le fichier `src/pages/api/stripe/webhook.ts` existe
- [ ] Le fichier est bien commité sur GitHub
- [ ] Le build Render s'est terminé sans erreur
- [ ] L'URL dans Stripe Dashboard est exactement : `https://formations-civique.onrender.com/api/stripe/webhook`
- [ ] Les événements sont bien sélectionnés dans Stripe Dashboard
- [ ] `STRIPE_WEBHOOK_SECRET` est configuré sur Render
- [ ] `SUPABASE_SERVICE_ROLE_KEY` est configuré sur Render

---

## 🔄 Redéploiement

Si vous avez modifié le fichier webhook :

1. **Committez les changements** :
   ```bash
   git add src/pages/api/stripe/webhook.ts
   git commit -m "fix: webhook endpoint"
   git push origin main
   ```

2. **Attendez que Render redéploie** (automatique)

3. **Testez à nouveau** dans Stripe Dashboard

---

## 📞 Support

Si le problème persiste après avoir vérifié tous les points ci-dessus :

1. Vérifiez les **logs Render** pour voir les erreurs exactes
2. Vérifiez les **logs Stripe Dashboard** → Webhooks → Event deliveries
3. Testez l'endpoint avec **Stripe CLI** en local pour isoler le problème
