# 🔧 Variables d'Environnement pour Render

## 📋 Variables OBLIGATOIRES à configurer sur Render

Copiez-collez ces variables dans la section "Environment Variables" de votre service Render :

### 1. Supabase (OBLIGATOIRE)
```
NEXT_PUBLIC_SUPABASE_URL=https://lqdfioptcptinnxqshrj.supabase.co
```

```
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_SVOkmGcIU9EkNqLqCeMBzg_7IN4ZEpl
```

```
SUPABASE_SERVICE_ROLE_KEY=votre-service-role-key
```
> ⚠️ **Important** : Remplacez `votre-service-role-key` par votre vraie clé service_role
> - Trouvable dans Supabase Dashboard → Settings → API → service_role key

### 2. Application (OBLIGATOIRE)
```
NEXT_PUBLIC_APP_URL=https://formations-civique.onrender.com
```
> ⚠️ **Important** : Remplacez `formations-civique.onrender.com` par votre URL Render réelle
> - Format : `https://votre-service.onrender.com`
> - Vous obtiendrez cette URL après le premier déploiement

### 3. Port (GÉRÉ AUTOMATIQUEMENT)
```
PORT=10000
```
> ℹ️ Render définit automatiquement le PORT, mais vous pouvez le laisser à 10000 pour être sûr

---

## 🔗 Variables OPTIONNELLES (selon vos besoins)

### Connexion Base de Données (Recommandé pour Production)
```
SUPABASE_DB_URL_POOLER=postgresql://postgres.lqdfioptcptinnxqshrj:[YOUR-PASSWORD]@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?sslmode=require
```
> ⚠️ Remplacez `[YOUR-PASSWORD]` par votre mot de passe de base de données Supabase
> - Trouvable dans Supabase Dashboard → Settings → Database

### Emails (Resend) - Optionnel
```
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

```
RESEND_FROM_EMAIL=noreply@formations-civiques.fr
```

### Observabilité (Sentry) - Optionnel
```
SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
```

### Analytics (PostHog) - Optionnel
```
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxxx
```

```
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### Paiements (Stripe) - Optionnel
```
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
```

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
```

```
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

---

## 📝 Instructions de Configuration sur Render

1. **Dans votre service Render**, allez dans l'onglet **"Environment"**

2. **Cliquez sur "Add Environment Variable"** pour chaque variable

3. **Pour chaque variable** :
   - **Key** : Le nom de la variable (ex: `NEXT_PUBLIC_SUPABASE_URL`)
   - **Value** : La valeur correspondante

4. **Variables à configurer en PRIORITÉ** :
   - ✅ `NEXT_PUBLIC_SUPABASE_URL`
   - ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - ✅ `SUPABASE_SERVICE_ROLE_KEY`
   - ✅ `NEXT_PUBLIC_APP_URL` (après le premier déploiement)

5. **Après avoir ajouté les variables**, redéployez votre service

---

## 🔍 Où trouver les valeurs manquantes

### Service Role Key (Supabase)
1. Allez sur [Supabase Dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet
3. **Settings** → **API**
4. Copiez la **service_role key** (section "Project API keys")
   - ⚠️ **Attention** : Cette clé est sensible, ne la partagez jamais publiquement

### Mot de passe de la base de données (Supabase)
1. Supabase Dashboard → **Settings** → **Database**
2. Section "Database password"
3. Si vous ne le connaissez pas, cliquez sur **Reset database password**
4. Copiez le nouveau mot de passe

### URL de votre service Render
- Vous obtiendrez l'URL après le premier déploiement
- Format : `https://votre-service.onrender.com`
- Vous pouvez aussi la personnaliser dans les paramètres du service

---

## ✅ Checklist de Déploiement

- [ ] `NEXT_PUBLIC_SUPABASE_URL` configuré
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` configuré
- [ ] `SUPABASE_SERVICE_ROLE_KEY` configuré (avec la vraie valeur)
- [ ] `NEXT_PUBLIC_APP_URL` configuré (après le premier déploiement)
- [ ] `PORT` configuré (optionnel, Render le gère automatiquement)
- [ ] Variables optionnelles configurées si nécessaire

---

## 🚀 Commandes de Build et Start pour Render

**Build Command** (à copier dans Render) :
```
npm install && npm run build
```
> ⚠️ **Important** : Utilisez `&&` (et non `;`) pour que le build ne s'exécute que si l'installation réussit

**Start Command** (à copier dans Render) :
```
npm run start
```
> ℹ️ Next.js utilisera automatiquement la variable `PORT` définie par Render

---

## ⚠️ Notes Importantes

1. **Ne jamais commiter** les variables d'environnement dans Git
2. Les variables commençant par `NEXT_PUBLIC_` sont exposées au client (frontend)
3. Les autres variables sont uniquement côté serveur (backend)
4. Après chaque modification de variables, **redéployez** le service
5. Vérifiez les logs Render en cas d'erreur de connexion à Supabase
