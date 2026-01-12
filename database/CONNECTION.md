# Configuration des Connexions Supabase

## 🔌 Types de Connexions

Supabase offre deux types de connexions pour PostgreSQL :

### 1. Connexion Directe (Port 5432)
- **URL** : `postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-1-eu-west-1.pooler.supabase.com:5432/postgres`
- **Usage** : Développement local, scripts de migration
- **Limite** : Maximum de connexions simultanées limité
- **SSL** : Requis (`?sslmode=require`)

### 2. Pooler Supavisor (Port 6543) - Recommandé pour Production
- **URL** : `postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?sslmode=require`
- **Usage** : Production (Render, Vercel, etc.)
- **Avantage** : Gestion automatique du pooling, évite la saturation PostgreSQL
- **SSL** : Requis (`?sslmode=require`)

## 📝 Configuration

### Variables d'Environnement

Dans votre `.env.local` :

```env
# Connexion standard (pour développement)
SUPABASE_DB_URL=postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-1-eu-west-1.pooler.supabase.com:5432/postgres?sslmode=require

# Pooler Supavisor (pour production sur Render)
SUPABASE_DB_URL_POOLER=postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?sslmode=require
```

### Récupérer les Informations

1. **PROJECT_REF** : Trouvable dans l'URL de votre projet Supabase
   - Exemple : Si votre URL est `https://lqdfioptcptinnxqshrj.supabase.co`
   - Alors `PROJECT_REF = lqdfioptcptinnxqshrj`

2. **PASSWORD** : Mot de passe de votre base de données
   - Trouvable dans Supabase Dashboard → **Settings** → **Database** → **Database Password**
   - Ou réinitialisable si oublié

3. **Région** : `aws-1-eu-west-1` (Europe) ou autre selon votre projet
   - Vérifiez dans Supabase Dashboard → **Settings** → **General**

## 🔧 Exemple avec votre Configuration

### Informations de votre Projet
- **PROJECT_REF** : `lqdfioptcptinnxqshrj`
- **URL Supabase** : `https://lqdfioptcptinnxqshrj.supabase.co`
- **Région** : `aws-1-eu-west-1` (Europe)

### Pour le développement (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=https://lqdfioptcptinnxqshrj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_SVOkmGcIU9EkNqLqCeMBzg_7IN4ZEpl

# Optionnel pour scripts de migration
SUPABASE_DB_URL=postgresql://postgres.lqdfioptcptinnxqshrj:[YOUR-PASSWORD]@aws-1-eu-west-1.pooler.supabase.com:5432/postgres?sslmode=require
```

### Pour la production (Render)
```env
NEXT_PUBLIC_SUPABASE_URL=https://lqdfioptcptinnxqshrj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_SVOkmGcIU9EkNqLqCeMBzg_7IN4ZEpl
SUPABASE_SERVICE_ROLE_KEY=votre-service-role-key

# Pooler Supavisor (recommandé pour éviter la saturation)
SUPABASE_DB_URL_POOLER=postgresql://postgres.lqdfioptcptinnxqshrj:[YOUR-PASSWORD]@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?sslmode=require
```

> **Note** : Remplacez `[YOUR-PASSWORD]` par votre mot de passe de base de données Supabase (trouvable dans Dashboard → Settings → Database)

## ⚠️ Important

1. **Ne jamais commiter** les mots de passe dans Git
2. **Utiliser des variables d'environnement** pour toutes les connexions
3. **Port 6543** recommandé pour la production (évite la saturation)
4. **Port 5432** acceptable pour le développement local

## 🧪 Tester la Connexion

```bash
# Vérifier la connexion
npm run db:check
```

## 📚 Documentation Supabase

- [Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)
- [Connection Strings](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-strings)
