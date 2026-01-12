# 📚 Guide : Migrer les Chapitres de Révision vers la Base de Données

## 🎯 Objectif

Centraliser le contenu des chapitres de révision (FR, EN, AR) dans la base de données Supabase, cohérent avec le système JSONB utilisé pour les questions et traductions.

## 📋 Étapes d'Implémentation

### Étape 1 : Créer la Table dans Supabase

1. **Ouvrir Supabase Dashboard** → SQL Editor
2. **Exécuter le script** : `database/migration_add_revision_chapters_table.sql`
3. **Vérifier** que la table `fc_revision_chapters` est créée

```sql
-- Vérification
SELECT COUNT(*) FROM fc_revision_chapters;
-- Doit retourner 0 (vide pour l'instant)
```

### Étape 2 : Migrer les Chapitres depuis revision-content.ts

```bash
npm run migrate:revision
```

Ce script va :
- ✅ Lire tous les chapitres depuis `REVISION_CONTENT`
- ✅ Insérer dans la table `fc_revision_chapters`
- ✅ Utiliser JSONB pour `title` et `content` (FR, EN, AR)
- ⚠️ Note: Les traductions EN/AR seront identiques au FR pour l'instant (à compléter)

### Étape 3 : Vérifier la Migration

Dans Supabase SQL Editor :

```sql
-- Vérifier le nombre de chapitres
SELECT COUNT(*) FROM fc_revision_chapters;

-- Vérifier un chapitre spécifique
SELECT id, theme, level, title->>'fr' as title_fr, content->>'fr' as content_fr
FROM fc_revision_chapters
WHERE id = 'devise';

-- Vérifier les traductions AR
SELECT id, title->>'ar' as title_ar
FROM fc_revision_chapters
WHERE title ? 'ar'
LIMIT 5;
```

### Étape 4 : Utiliser dans le Code

La page `src/pages/revision/index.tsx` charge maintenant automatiquement depuis la BD avec fallback sur `REVISION_CONTENT` si la BD est vide.

## 📊 Structure de la Table

```sql
fc_revision_chapters
├── id (TEXT) - 'devise', 'laicite', 'droits-citoyen', etc.
├── theme (TEXT) - 'VALEURS', 'DROITS', 'HISTOIRE', 'POLITIQUE', 'SOCIETE'
├── level (TEXT) - 'A2', 'B1', 'B2'
├── title (JSONB) - {"fr": "...", "en": "...", "ar": "..."}
├── content (JSONB) - {"fr": "...", "en": "...", "ar": "..."} (Markdown)
├── order_index (INTEGER) - Ordre d'affichage
├── created_at (TIMESTAMPTZ)
└── updated_at (TIMESTAMPTZ)
```

## 🎨 Exemples d'Utilisation

### Exemple 1 : Récupérer tous les chapitres

```typescript
import { getRevisionChapters } from '@/services/revisionChapterService';

const chapters = await getRevisionChapters('ar');
// Retourne tous les chapitres en arabe
```

### Exemple 2 : Filtrer par thème et niveau

```typescript
const chapters = await getRevisionChapters('fr', QuestionTheme.VALEURS, UserLevel.A2);
// Retourne seulement les chapitres "Valeurs" niveau A2
```

### Exemple 3 : Récupérer un chapitre spécifique

```typescript
import { getRevisionChapterById } from '@/services/revisionChapterService';

const chapter = await getRevisionChapterById('devise', 'ar');
// Retourne le chapitre "devise" en arabe
```

## ⚡ Performance

- **Cache en mémoire** : 10 minutes TTL
- **Index GIN** : Recherches rapides dans JSONB
- **Index composite** : `(theme, level)` pour requêtes optimisées

## 🔒 Sécurité

- **RLS activé** : Les chapitres sont publics (lecture seule)
- **Service Role Key** : Requise pour les modifications (admin uniquement)

## ✅ Avantages

1. ✅ **Centralisation** : Tous les contenus au même endroit
2. ✅ **Modification sans redéploiement** : Changez via Supabase Dashboard
3. ✅ **Cohérence** : Même système JSONB que les questions et traductions
4. ✅ **Multilingue** : Support natif FR/EN/AR
5. ✅ **Fallback automatique** : Utilise `REVISION_CONTENT` si la BD est vide

## 📝 Notes

- Les chapitres sont **publiques** (pas de données sensibles)
- Le cache est **automatiquement invalidé** lors des mises à jour
- **Fallback automatique** sur `REVISION_CONTENT` si la BD est vide ou en erreur
- Les traductions EN/AR doivent être ajoutées manuellement dans Supabase pour l'instant

## 🚀 Prochaines Étapes

1. **Exécuter la migration SQL** dans Supabase
2. **Migrer les chapitres** : `npm run migrate:revision`
3. **Ajouter les traductions EN/AR** dans Supabase (ou créer un script)
4. **Tester** : La page `/revision` charge maintenant depuis la BD

## 🔄 Migration Progressive

La page utilise un système de fallback :
- ✅ Essaie de charger depuis la BD
- ✅ Si vide ou erreur → utilise `REVISION_CONTENT`
- ✅ Permet une migration progressive sans casser l'application
