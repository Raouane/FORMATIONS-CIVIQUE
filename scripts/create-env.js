const fs = require('fs');
const path = require('path');

const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://lqdfioptcptinnxqshrj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_SVOkmGcIU9EkNqLqCeMBzg_7IN4ZEpl

# Supabase Service Role Key (optionnel pour le développement)
# À récupérer dans Supabase Dashboard → Settings → API → service_role key
# SUPABASE_SERVICE_ROLE_KEY=votre-service-role-key

# Supabase Connection Pooler (optionnel, pour production Render)
# Remplacez [YOUR-PASSWORD] par votre mot de passe de base de données
# SUPABASE_DB_URL_POOLER=postgresql://postgres.lqdfioptcptinnxqshrj:[YOUR-PASSWORD]@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?sslmode=require

# App
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
`;

const envPath = path.join(process.cwd(), '.env.local');

if (fs.existsSync(envPath)) {
  console.log('⚠️  Le fichier .env.local existe déjà.');
  console.log('   Si vous voulez le recréer, supprimez-le d\'abord.');
  process.exit(0);
}

fs.writeFileSync(envPath, envContent, 'utf8');
console.log('✅ Fichier .env.local créé avec succès !');
console.log('');
console.log('📝 Prochaines étapes:');
console.log('1. Vérifiez le contenu du fichier .env.local');
console.log('2. Exécutez: npm run db:check');
console.log('3. Exécutez database/schema.sql dans Supabase Dashboard');
