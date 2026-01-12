# Template de Configuration .env.local

Copiez ce contenu dans un fichier `.env.local` à la racine du projet.

```env
# ============================================
# SUPABASE (OBLIGATOIRE)
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://lqdfioptcptinnxqshrj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_SVOkmGcIU9EkNqLqCeMBzg_7IN4ZEpl

# Service Role Key (pour les routes API)
# À récupérer dans Supabase Dashboard → Settings → API → service_role key
SUPABASE_SERVICE_ROLE_KEY=votre-service-role-key

# Connection Pooler (pour production Render)
# Remplacez [YOUR-PASSWORD] par votre mot de passe de base de données
# Trouvable dans Supabase Dashboard → Settings → Database
SUPABASE_DB_URL_POOLER=postgresql://postgres.lqdfioptcptinnxqshrj:[YOUR-PASSWORD]@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?sslmode=require

# ============================================
# APP
# ============================================
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ============================================
# OPTIONNEL - Intégrations futures
# ============================================

# Resend (pour les emails)
# RESEND_API_KEY=re_xxxxxxxxxxxxx
# RESEND_FROM_EMAIL=noreply@formations-civiques.fr

# Sentry (pour l'observabilité)
# SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx

# PostHog (pour l'analytics)
# NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxxx
# NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Stripe (pour les paiements premium)
# STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
# STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

## 📝 Instructions

1. **Créer le fichier** : Créez `.env.local` à la racine du projet
2. **Copier le template** : Copiez le contenu ci-dessus
3. **Remplacer les valeurs** :
   - `[YOUR-PASSWORD]` : Votre mot de passe de base de données Supabase
   - `votre-service-role-key` : La clé service_role de Supabase
4. **Sauvegarder** : Le fichier est automatiquement ignoré par Git (dans `.gitignore`)

## 🔍 Où trouver les valeurs manquantes

### Service Role Key
1. Aller sur [Supabase Dashboard](https://supabase.com/dashboard)
2. Sélectionner votre projet
3. **Settings** → **API**
4. Copier la **service_role key** (section "Project API keys")

### Mot de passe de la base de données
1. Supabase Dashboard → **Settings** → **Database**
2. Section "Database password"
3. Si vous ne le connaissez pas, cliquez sur **Reset database password**
4. Copiez le nouveau mot de passe

## ⚠️ Sécurité

- ❌ **NE JAMAIS** commiter `.env.local` dans Git
- ✅ Le fichier est déjà dans `.gitignore`
- ✅ Utilisez des variables d'environnement pour la production (Render, Vercel, etc.)
