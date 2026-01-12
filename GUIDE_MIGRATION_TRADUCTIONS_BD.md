# 🗄️ Guide : Migrer les Traductions vers la Base de Données

## 🎯 Objectif

Centraliser toutes les traductions (FR, EN, AR) dans la base de données Supabase, cohérent avec le système JSONB utilisé pour les questions.

## 📋 Étapes d'Implémentation

### Étape 1 : Créer la Table dans Supabase

1. **Ouvrir Supabase Dashboard** → SQL Editor
2. **Exécuter le script** : `database/migration_add_translations_table.sql`
3. **Vérifier** que la table `fc_translations` est créée

```sql
-- Vérification
SELECT COUNT(*) FROM fc_translations;
-- Doit retourner 0 (vide pour l'instant)
```

### Étape 2 : Migrer les Traductions depuis les Fichiers JSON

```bash
npm run migrate:translations
```

Ce script va :
- ✅ Lire tous les fichiers JSON dans `public/locales/`
- ✅ Fusionner les traductions FR/EN/AR par clé
- ✅ Insérer dans la table `fc_translations`
- ✅ Gérer les structures imbriquées (themes.valeurs.name, etc.)

### Étape 3 : Vérifier la Migration

Dans Supabase SQL Editor :

```sql
-- Vérifier le nombre de traductions
SELECT namespace, COUNT(*) 
FROM fc_translations 
GROUP BY namespace;

-- Vérifier une traduction spécifique
SELECT key, translations 
FROM fc_translations 
WHERE namespace = 'revision' AND key = 'title';

-- Vérifier les traductions AR
SELECT namespace, key, translations->>'ar' as ar
FROM fc_translations
WHERE translations ? 'ar'
LIMIT 10;
```

### Étape 4 : Utiliser dans le Code

#### Option A : Service Direct

```typescript
import { getTranslation } from '@/services/translationService';

const title = await getTranslation('revision', 'title', 'ar');
// Retourne: "مركز المراجعة"
```

#### Option B : Hook React (Recommandé)

```typescript
import { useDBTranslation } from '@/hooks/useDBTranslation';

function RevisionPage() {
  const { t, ready } = useDBTranslation('revision');
  
  if (!ready) return <div>Chargement...</div>;
  
  return <h1>{t('title')}</h1>;
}
```

## 🔄 Migration Progressive

Vous pouvez migrer progressivement :

1. **Commencer par un namespace** : `revision` par exemple
2. **Tester** que tout fonctionne
3. **Migrer les autres** : `common`, `home`, `exam`, etc.

## 📊 Structure de la Table

```sql
fc_translations
├── id (UUID)
├── namespace (TEXT) - 'common', 'home', 'exam', 'revision', etc.
├── key (TEXT) - 'title', 'nav.home', 'themes.valeurs.name'
├── translations (JSONB) - {"fr": "...", "en": "...", "ar": "..."}
├── created_at (TIMESTAMPTZ)
└── updated_at (TIMESTAMPTZ)
```

## 🎨 Exemples d'Utilisation

### Exemple 1 : Récupérer une traduction simple

```typescript
const title = await getTranslation('revision', 'title', 'ar');
// "مركز المراجعة"
```

### Exemple 2 : Récupérer toutes les traductions d'un namespace

```typescript
const translations = await getTranslationsByNamespace('revision', 'ar');
// {
//   "title": "مركز المراجعة",
//   "description": "فلنراجع المفاهيم الأساسية...",
//   "all": "الكل",
//   ...
// }
```

### Exemple 3 : Mettre à jour une traduction

```typescript
await upsertTranslation('revision', 'title', {
  fr: 'Centre de Révision',
  en: 'Revision Center',
  ar: 'مركز المراجعة'
});
```

## ⚡ Performance

- **Cache en mémoire** : 5 minutes TTL
- **Index GIN** : Recherches rapides dans JSONB
- **Index composite** : `(namespace, key)` pour requêtes optimisées

## 🔒 Sécurité

- **RLS activé** : Les traductions sont publiques (lecture seule)
- **Service Role Key** : Requise pour les modifications (admin uniquement)

## 📝 Notes

- Les traductions sont **publiques** (pas de données sensibles)
- Le cache est **automatiquement invalidé** lors des mises à jour
- **Fallback automatique** sur 'fr' si la traduction demandée n'existe pas

## ✅ Checklist

- [ ] Table `fc_translations` créée
- [ ] Script de migration exécuté
- [ ] Traductions vérifiées dans Supabase
- [ ] Hook `useDBTranslation` testé
- [ ] Composants mis à jour progressivement

## 🚀 Prochaines Étapes

1. **Créer la table** : Exécuter `migration_add_translations_table.sql`
2. **Migrer les traductions** : `npm run migrate:translations`
3. **Tester** : Utiliser `useDBTranslation` dans un composant
4. **Migrer progressivement** : Remplacer `next-i18next` par `useDBTranslation`
