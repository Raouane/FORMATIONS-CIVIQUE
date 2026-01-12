# 📖 Exemple d'Utilisation : Traductions depuis la BD

## 🎯 Avant/Après

### ❌ Avant (Fichiers JSON)

```typescript
// src/pages/revision/index.tsx
import { useTranslation } from 'next-i18next';

export default function RevisionPage() {
  const { t } = useTranslation('revision');
  
  return <h1>{t('title')}</h1>; // "Centre de Révision"
}
```

### ✅ Après (Base de Données)

```typescript
// src/pages/revision/index.tsx
import { useDBTranslation } from '@/hooks/useDBTranslation';

export default function RevisionPage() {
  const { t, ready } = useDBTranslation('revision');
  
  if (!ready) return <div>Chargement...</div>;
  
  return <h1>{t('title')}</h1>; // "مركز المراجعة" (si locale = 'ar')
}
```

## 🔄 Migration Progressive

### Étape 1 : Tester avec un Composant

```typescript
// src/components/TestDBTranslation.tsx
import { useDBTranslation } from '@/hooks/useDBTranslation';

export function TestDBTranslation() {
  const { t, ready } = useDBTranslation('revision');
  
  if (!ready) {
    return <div>Chargement des traductions...</div>;
  }
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
      <p>{t('themes.valeurs.name')}</p>
    </div>
  );
}
```

### Étape 2 : Remplacer Progressivement

Vous pouvez garder `next-i18next` pour certains composants et utiliser `useDBTranslation` pour d'autres.

## 🎨 Cas d'Usage

### Cas 1 : Traduction Simple

```typescript
const { t } = useDBTranslation('common');
const buttonText = t('buttons.start'); // "Commencer"
```

### Cas 2 : Traduction avec Interpolation

```typescript
const { t } = useDBTranslation('results');
const message = t('verdict.message.passed', { percentage: 85 });
// "Félicitations ! Vous avez obtenu 85%"
```

### Cas 3 : Chargement Asynchrone

```typescript
const { t, ready } = useDBTranslation('revision');

if (!ready) {
  return <LoadingSpinner />;
}

return <div>{t('title')}</div>;
```

## 🔧 Service Direct (Sans Hook)

Pour les cas où vous ne pouvez pas utiliser un hook React :

```typescript
import { getTranslation } from '@/services/translationService';

// Dans une fonction async
async function getPageTitle() {
  const title = await getTranslation('revision', 'title', 'ar');
  return title; // "مركز المراجعة"
}
```

## 📊 Comparaison des Performances

| Méthode | Temps de Chargement | Cache |
|---------|---------------------|-------|
| **Fichiers JSON** | ⚡ Instantané | ✅ Build-time |
| **Base de Données** | ⚡⚡ Rapide (avec cache) | ✅ 5 min TTL |

## ✅ Avantages de la BD

1. **Modification sans redéploiement** : Changez les traductions via Supabase Dashboard
2. **Centralisation** : Toutes les traductions au même endroit
3. **Cohérence** : Même système JSONB que les questions
4. **API REST** : Accès direct via Supabase API

## 🚀 Prochaines Étapes

1. **Exécuter la migration SQL** : `database/migration_add_translations_table.sql`
2. **Migrer les traductions** : `npm run migrate:translations`
3. **Tester** : Utiliser `useDBTranslation` dans un composant
4. **Migrer progressivement** : Remplacer `next-i18next` par `useDBTranslation`
